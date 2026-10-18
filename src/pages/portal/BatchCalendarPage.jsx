import { useState, useEffect, useCallback } from "react";
import { portalApi } from "../../lib/portalApi";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, CalendarDays, CheckCircle, XCircle, Clock } from "lucide-react";

const STATUS_ICON = {
  Present: <CheckCircle size={14} className="text-green-400" />,
  Late: <Clock size={14} className="text-yellow-400" />,
  Absent: <XCircle size={14} className="text-red-400" />,
};

const STATUS_BG = {
  Present: "bg-green-500/10 border-green-500/20",
  Late: "bg-yellow-500/10 border-yellow-500/20",
  Absent: "bg-red-500/10 border-red-500/20",
};

export default function BatchCalendarPage() {
  const [batches, setBatches] = useState([]);
  const [batchId, setBatchId] = useState("");
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [calData, setCalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);

  const fetchBatches = useCallback(async () => {
    try {
      const r = await portalApi.listBatches();
      setBatches(r.data);
      if (r.data.length && !batchId) setBatchId(r.data[0].id);
    } catch { /* non-critical */ } finally { setLoading(false); }
  }, [batchId]);

  useEffect(() => { fetchBatches(); }, [fetchBatches]);

  const fetchCalendar = useCallback(async () => {
    if (!batchId) return;
    try {
      const res = await portalApi.batchCalendar(batchId, month);
      setCalData(res.data);
      setSelectedDay(null);
    } catch { toast.error("Failed to load calendar"); }
  }, [batchId, month]);

  useEffect(() => { fetchCalendar(); }, [fetchCalendar]);

  const changeMonth = (delta) => {
    const d = new Date(month + "-01");
    d.setMonth(d.getMonth() + delta);
    setMonth(d.toISOString().slice(0, 7));
  };

  const monthLabel = new Date(month + "-01").toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  // Build a full calendar grid
  const calendarGrid = [];
  if (calData) {
    const firstDay = new Date(month + "-01");
    const startWeekday = firstDay.getDay(); // 0=Sun
    const daysInMonth = new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0).getDate();

    // Class dates in this month
    const classDayMap = {};
    calData.days.forEach(d => { classDayMap[d.date] = d; });

    for (let i = 0; i < startWeekday; i++) calendarGrid.push(null);
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${month}-${String(day).padStart(2, "0")}`;
      const classDay = classDayMap[dateStr];
      calendarGrid.push({
        day,
        date: dateStr,
        hasClass: !!classDay,
        data: classDay,
      });
    }
  }

  const selectedDayData = selectedDay ? calData?.days?.find(d => d.date === selectedDay) : null;

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6" data-testid="batch-calendar-page">
      <div>
        <h1 className="text-2xl font-serif text-white">Batch Calendar</h1>
        <p className="text-gray-500 text-sm mt-1">Visual attendance view — see who was present/absent on any day</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <select value={batchId} onChange={e => setBatchId(e.target.value)} className="bg-[#16161a] border border-white/10 text-white px-4 py-2.5 rounded-lg text-sm outline-none focus:border-amber-500">
          {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <div className="flex items-center gap-2">
          <button onClick={() => changeMonth(-1)} className="p-2 text-gray-500 hover:text-white rounded-lg hover:bg-white/5"><ChevronLeft size={18} /></button>
          <span className="text-white font-medium min-w-[160px] text-center">{monthLabel}</span>
          <button onClick={() => changeMonth(1)} className="p-2 text-gray-500 hover:text-white rounded-lg hover:bg-white/5"><ChevronRight size={18} /></button>
        </div>
        <div className="flex gap-3 ml-auto text-xs">
          <span className="flex items-center gap-1.5 text-green-400"><CheckCircle size={12} /> Present</span>
          <span className="flex items-center gap-1.5 text-yellow-400"><Clock size={12} /> Late</span>
          <span className="flex items-center gap-1.5 text-red-400"><XCircle size={12} /> Absent</span>
          <span className="flex items-center gap-1.5 text-gray-500"><CalendarDays size={12} /> No Class</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 bg-[#16161a] border border-white/5 rounded-xl p-5">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
              <div key={d} className="text-center text-gray-500 text-xs py-1">{d}</div>
            ))}
          </div>
          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarGrid.map((cell, i) => {
              if (!cell) return <div key={`empty-${i}`} className="aspect-square" />;
              const isSelected = selectedDay === cell.date;
              return (
                <button
                  key={cell.date}
                  onClick={() => cell.hasClass && setSelectedDay(cell.date)}
                  className={`aspect-square rounded-lg border text-center relative transition-all flex flex-col items-center justify-center gap-0.5 ${
                    cell.hasClass
                      ? isSelected
                        ? "bg-amber-500/15 border-amber-500/40"
                        : "bg-white/[0.03] border-white/5 hover:border-amber-500/30 cursor-pointer"
                      : "border-transparent opacity-40"
                  }`}
                >
                  <span className={`text-sm ${cell.hasClass ? "text-white font-medium" : "text-gray-600"}`}>{cell.day}</span>
                  {cell.hasClass && cell.data && (
                    <div className="flex items-center gap-0.5">
                      <span className="text-[10px] text-green-400 font-bold">{cell.data.present_count}</span>
                      <span className="text-[10px] text-gray-600">/</span>
                      <span className="text-[10px] text-gray-400">{cell.data.total_count}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Day Detail Panel */}
        <div className="bg-[#16161a] border border-white/5 rounded-xl">
          <div className="px-5 py-4 border-b border-white/5">
            <h3 className="text-white font-medium">
              {selectedDay
                ? new Date(selectedDay + "T00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })
                : "Select a class day"
              }
            </h3>
            {selectedDayData && (
              <div className="flex gap-3 mt-1 text-xs">
                <span className="text-green-400">{selectedDayData.students.filter(s => s.status === "Present").length} Present</span>
                <span className="text-yellow-400">{selectedDayData.students.filter(s => s.status === "Late").length} Late</span>
                <span className="text-red-400">{selectedDayData.students.filter(s => s.status === "Absent").length} Absent</span>
              </div>
            )}
          </div>

          {selectedDayData ? (
            <div className="divide-y divide-white/[0.03] max-h-[500px] overflow-y-auto">
              {selectedDayData.students.map(s => (
                <div key={s.id} className={`flex items-center justify-between px-5 py-2.5 border-l-2 ${STATUS_BG[s.status]}`}>
                  <div className="flex items-center gap-3">
                    {s.photo_url ? (
                      <img src={`${process.env.REACT_APP_BACKEND_URL}${s.photo_url}`} alt="" className="w-7 h-7 rounded-full object-cover" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-400 text-[10px] font-bold">{s.name.charAt(0)}</div>
                    )}
                    <span className="text-white text-sm">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {STATUS_ICON[s.status]}
                    <span className={`text-xs ${s.status === "Present" ? "text-green-400" : s.status === "Late" ? "text-yellow-400" : "text-red-400"}`}>{s.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500 text-sm px-4">
              Click on a highlighted date to see attendance details for that day
            </div>
          )}
        </div>
      </div>

      {/* Monthly Summary Table */}
      {calData?.days?.length > 0 && (
        <div className="bg-[#16161a] border border-white/5 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5">
            <h3 className="text-white font-medium">Student Summary — {monthLabel}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs sticky left-0 bg-[#16161a]">Student</th>
                  {calData.days.map(d => (
                    <th key={d.date} className="py-3 px-2 text-gray-500 font-medium text-[10px] text-center min-w-[36px]">
                      {d.date.slice(8)}
                    </th>
                  ))}
                  <th className="py-3 px-3 text-gray-500 font-medium text-xs text-center">P</th>
                  <th className="py-3 px-3 text-gray-500 font-medium text-xs text-center">A</th>
                  <th className="py-3 px-3 text-gray-500 font-medium text-xs text-center">%</th>
                </tr>
              </thead>
              <tbody>
                {calData.students.map(student => {
                  let p = 0, a = 0;
                  return (
                    <tr key={student.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                      <td className="py-2 px-4 text-white text-xs sticky left-0 bg-[#16161a]">{student.full_name}</td>
                      {calData.days.map(d => {
                        const s = d.students.find(st => st.id === student.id);
                        const status = s?.status || "Absent";
                        if (status === "Present" || status === "Late") p++;
                        else a++;
                        return (
                          <td key={d.date} className="py-2 px-2 text-center">
                            {status === "Present" && <span className="inline-block w-5 h-5 rounded bg-green-500/20 text-green-400 text-[10px] leading-5">P</span>}
                            {status === "Late" && <span className="inline-block w-5 h-5 rounded bg-yellow-500/20 text-yellow-400 text-[10px] leading-5">L</span>}
                            {status === "Absent" && <span className="inline-block w-5 h-5 rounded bg-red-500/20 text-red-400 text-[10px] leading-5">A</span>}
                          </td>
                        );
                      })}
                      <td className="py-2 px-3 text-center text-green-400 text-xs font-medium">{p}</td>
                      <td className="py-2 px-3 text-center text-red-400 text-xs font-medium">{a}</td>
                      <td className="py-2 px-3 text-center text-xs font-bold">
                        <span className={`${(p + a) > 0 && (p / (p + a)) * 100 >= 75 ? "text-green-400" : "text-red-400"}`}>
                          {(p + a) > 0 ? Math.round((p / (p + a)) * 100) : 0}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
