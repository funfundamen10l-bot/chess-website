import { useState, useEffect, useCallback } from "react";
import { portalApi } from "../../lib/portalApi";
import { toast } from "sonner";
import { CalendarCheck, CheckCircle, XCircle, Clock, Users, Save } from "lucide-react";

const STATUS_COLORS = {
  Present: { active: "bg-green-500/15 text-green-400 border-green-500/30", inactive: "text-gray-500 hover:text-green-400" },
  Late: { active: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30", inactive: "text-gray-500 hover:text-yellow-400" },
  Absent: { active: "bg-red-500/15 text-red-400 border-red-500/30", inactive: "text-gray-500 hover:text-red-400" },
};

function StatusButton({ studentId, status, label, isActive, onMark }) {
  const colors = STATUS_COLORS[status];
  return (
    <button
      onClick={() => onMark(studentId, status)}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${isActive ? colors.active : colors.inactive}`}
    >
      {label}
    </button>
  );
}

export default function AttendancePage() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [batchId, setBatchId] = useState("");
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState({});
  const [existing, setExisting] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchBatches = useCallback(async () => {
    try { const r = await portalApi.listBatches(); setBatches(r.data); if (r.data.length && !batchId) setBatchId(r.data[0].id); } catch { /* non-critical */ }
  }, [batchId]);

  useEffect(() => { fetchBatches(); }, [fetchBatches]);

  const fetchData = useCallback(async () => {
    if (!batchId) return;
    try {
      const [sRes, aRes] = await Promise.all([
        portalApi.listStudents({ batch_id: batchId, status: "Active" }),
        portalApi.getAttendance(date, batchId),
      ]);
      setStudents(sRes.data);
      const existMap = {};
      aRes.data.forEach(r => { existMap[r.student_id] = r.status; });
      setExisting(existMap);
      // Pre-fill records from existing
      const rec = {};
      sRes.data.forEach(s => { rec[s.id] = existMap[s.id] || ""; });
      setRecords(rec);
    } catch { toast.error("Failed to load data"); }
  }, [batchId, date]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const markAll = (status) => {
    const updated = {};
    students.forEach(s => { updated[s.id] = status; });
    setRecords(updated);
  };

  const handleSave = async () => {
    const entries = Object.entries(records).filter(([_, status]) => status);
    if (!entries.length) { toast.error("No attendance marked"); return; }
    setSaving(true);
    try {
      await portalApi.saveAttendance({
        date, batch_id: batchId,
        records: entries.map(([student_id, status]) => ({ student_id, status })),
      });
      toast.success(`Attendance saved for ${entries.length} students`);
      setExisting(Object.fromEntries(entries));
    } catch { toast.error("Failed to save"); } finally { setSaving(false); }
  };

  const summary = { Present: 0, Absent: 0, Late: 0, Unmarked: 0 };
  students.forEach(s => { const st = records[s.id]; if (st) summary[st]++; else summary.Unmarked++; });

  return (
    <div className="space-y-6" data-testid="attendance-page">
      <div>
        <h1 className="text-2xl font-serif text-white">Attendance</h1>
        <p className="text-gray-500 text-sm mt-1">Mark and manage daily attendance</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="bg-[#16161a] border border-white/10 text-white px-4 py-2.5 rounded-lg outline-none focus:border-amber-500 text-sm" />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Batch</label>
          <select value={batchId} onChange={e => setBatchId(e.target.value)} className="bg-[#16161a] border border-white/10 text-white px-4 py-2.5 rounded-lg outline-none focus:border-amber-500 text-sm">
            {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <button onClick={() => markAll("Present")} className="px-3 py-2.5 bg-green-500/15 text-green-400 text-xs rounded-lg hover:bg-green-500/25">All Present</button>
          <button onClick={() => markAll("Absent")} className="px-3 py-2.5 bg-red-500/15 text-red-400 text-xs rounded-lg hover:bg-red-500/25">All Absent</button>
        </div>
        <button onClick={handleSave} disabled={saving} data-testid="save-attendance-btn" className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-semibold text-sm rounded-lg transition-colors disabled:opacity-50 ml-auto">
          <Save size={16} /> {saving ? "Saving..." : "Save Attendance"}
        </button>
      </div>

      {/* Summary */}
      <div className="flex gap-4 text-sm">
        <span className="text-green-400">{summary.Present} Present</span>
        <span className="text-red-400">{summary.Absent} Absent</span>
        <span className="text-yellow-400">{summary.Late} Late</span>
        <span className="text-gray-500">{summary.Unmarked} Unmarked</span>
      </div>

      {/* Student List */}
      <div className="bg-[#16161a] border border-white/5 rounded-xl overflow-hidden">
        {students.length > 0 ? (
          <div className="divide-y divide-white/[0.03]">
            {students.map(s => (
              <div key={s.id} className={`flex items-center justify-between px-5 py-3 transition-colors ${existing[s.id] ? "bg-white/[0.01]" : ""}`}>
                <div className="flex items-center gap-3">
                  {s.photo_url ? (
                    <img src={`${process.env.REACT_APP_BACKEND_URL}${s.photo_url}`} alt="" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-400 text-xs font-bold">{s.full_name.charAt(0)}</div>
                  )}
                  <div>
                    <div className="text-white text-sm">{s.full_name}</div>
                    {existing[s.id] && <div className="text-[10px] text-gray-600">Previously: {existing[s.id]}</div>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <StatusButton studentId={s.id} status="Present" label="Present" isActive={records[s.id] === "Present"} onMark={(id, st) => setRecords(prev => ({ ...prev, [id]: st }))} />
                  <StatusButton studentId={s.id} status="Late" label="Late" isActive={records[s.id] === "Late"} onMark={(id, st) => setRecords(prev => ({ ...prev, [id]: st }))} />
                  <StatusButton studentId={s.id} status="Absent" label="Absent" isActive={records[s.id] === "Absent"} onMark={(id, st) => setRecords(prev => ({ ...prev, [id]: st }))} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500 text-sm">No active students in this batch</div>
        )}
      </div>
    </div>
  );
}
