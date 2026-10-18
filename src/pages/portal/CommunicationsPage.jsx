import { useState, useEffect, useCallback } from "react";
import { portalApi } from "../../lib/portalApi";
import { toast } from "sonner";
import { Send, Cake, MessageSquare, ExternalLink, Clock, Users, FileText, Copy } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog";

const BIRTHDAY_MSG = (name, age) =>
  `Happy Birthday, ${name}! 🎂🎉\n\nWishing you a wonderful ${age}th birthday! May this year bring you great moves on and off the chessboard.\n\nWarm wishes,\nChessZen Classes Team`;

export default function CommunicationsPage() {
  const [batches, setBatches] = useState([]);
  const [history, setHistory] = useState([]);
  const [birthdays, setBirthdays] = useState([]);
  const [broadcastDialog, setBroadcastDialog] = useState(false);
  const [reportDialog, setReportDialog] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [resultDialog, setResultDialog] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState(null);
  const [students, setStudents] = useState([]);
  const [bcForm, setBcForm] = useState({ batch_id: "", subject: "", message: "" });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [bRes, hRes, bdRes, sRes] = await Promise.all([
        portalApi.listBatches(),
        portalApi.commHistory(),
        portalApi.birthdays(),
        portalApi.listStudents({ status: "Active" }),
      ]);
      setBatches(bRes.data);
      setHistory(hRes.data);
      setBirthdays(bdRes.data);
      setStudents(sRes.data);
    } catch { /* initial load, non-critical */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleBroadcast = async () => {
    if (!bcForm.batch_id || !bcForm.message.trim()) { toast.error("Select batch and enter message"); return; }
    try {
      const res = await portalApi.broadcast(bcForm);
      toast.success(`Message sent to ${res.data.count} students`);
      setBroadcastDialog(false);
      setBroadcastResult(res.data);
      setResultDialog(true);
      fetchData();
    } catch { toast.error("Broadcast failed"); }
  };

  const handleReport = async (studentId) => {
    try {
      const res = await portalApi.studentReport(studentId);
      setReportData(res.data);
      setReportDialog(true);
    } catch { toast.error("Failed to generate report"); }
  };

  const copyReport = () => {
    if (!reportData) return;
    const r = reportData;
    const text = `STUDENT PROGRESS REPORT - ChessZen Classes
━━━━━━━━━━━━━━━━━━━━━━━━━
Student: ${r.student.full_name}
Batch: ${r.batch_name}
Level: ${r.student.chess_level}
Joining Date: ${r.student.joining_date}

ATTENDANCE
Total Sessions: ${r.attendance.total}
Present: ${r.attendance.present}
Attendance: ${r.attendance.percentage}%

TEST PERFORMANCE
${r.test_stats.total_tests ? `Tests Taken: ${r.test_stats.total_tests}
Highest Score: ${r.test_stats.highest}%
Average Score: ${r.test_stats.average}%
Latest Score: ${r.test_stats.latest}%` : "No tests recorded yet"}
${r.tests.length > 0 ? "\nRecent Tests:\n" + r.tests.slice(0, 5).map(t => `  ${t.test_name} (${t.test_date}): ${t.score}%${t.remarks ? " — " + t.remarks : ""}`).join("\n") : ""}

Generated on ${new Date().toLocaleDateString()}
ChessZen Classes`;
    navigator.clipboard.writeText(text);
    toast.success("Report copied to clipboard");
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6" data-testid="communications-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-white">Communications</h1>
          <p className="text-gray-500 text-sm mt-1">Broadcast messages, reports, and birthday greetings</p>
        </div>
        <button onClick={() => { setBcForm({ batch_id: batches[0]?.id || "", subject: "", message: "" }); setBroadcastDialog(true); }} className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-semibold text-sm rounded-lg">
          <Send size={16} /> Broadcast Message
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Birthday Alerts */}
        <div className="bg-[#16161a] border border-white/5 rounded-xl">
          <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
            <Cake size={16} className="text-amber-400" />
            <h3 className="text-white font-medium">Upcoming Birthdays</h3>
          </div>
          {birthdays.length > 0 ? (
            <div className="divide-y divide-white/[0.03]">
              {birthdays.map(b => {
                const msg = BIRTHDAY_MSG(b.name, b.turning_age);
                const cc = b.country_code?.replace("+", "") || "91";
                const waUrl = b.phone ? `https://wa.me/${cc}${b.phone}?text=${encodeURIComponent(msg)}` : "";
                return (
                  <div key={b.student_id} className="px-5 py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white text-sm">{b.name}</div>
                        <div className="text-gray-500 text-xs">
                          Turning {b.turning_age} · {b.days_until === 0 ? "Today!" : `in ${b.days_until} day${b.days_until > 1 ? "s" : ""}`}
                        </div>
                      </div>
                      {waUrl && (
                        <a href={waUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-green-400 hover:bg-green-500/15 rounded-lg">
                          <Send size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500 text-sm">No birthdays in the next 7 days</div>
          )}
        </div>

        {/* Progress Reports */}
        <div className="bg-[#16161a] border border-white/5 rounded-xl">
          <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
            <FileText size={16} className="text-amber-400" />
            <h3 className="text-white font-medium">Generate Report</h3>
          </div>
          <div className="p-5 space-y-3">
            <p className="text-gray-500 text-xs">Generate a progress summary for any student</p>
            <select onChange={e => { if (e.target.value) handleReport(e.target.value); }} className="w-full bg-white/5 border border-white/10 text-white px-3 py-2.5 rounded-lg text-sm outline-none" defaultValue="">
              <option value="">Select student...</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.full_name}</option>)}
            </select>
          </div>
        </div>

        {/* Communication History */}
        <div className="bg-[#16161a] border border-white/5 rounded-xl">
          <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
            <Clock size={16} className="text-amber-400" />
            <h3 className="text-white font-medium">Recent Broadcasts</h3>
          </div>
          {history.length > 0 ? (
            <div className="divide-y divide-white/[0.03]">
              {history.slice(0, 8).map(h => (
                <div key={h.id} className="px-5 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white text-sm">{h.batch_name}</div>
                      <div className="text-gray-500 text-xs">{h.recipients} recipients · {new Date(h.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs mt-1 truncate">{h.message.substring(0, 80)}...</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500 text-sm">No broadcasts yet</div>
          )}
        </div>
      </div>

      {/* Broadcast Dialog */}
      <Dialog open={broadcastDialog} onOpenChange={setBroadcastDialog}>
        <DialogContent className="bg-[#16161a] border-white/10 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Broadcast Message</DialogTitle>
            <DialogDescription className="text-gray-500">Send a message to all students in a batch</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div><label className="text-sm text-gray-400 mb-1.5 block">Batch *</label>
              <select value={bcForm.batch_id} onChange={e => setBcForm({ ...bcForm, batch_id: e.target.value })} className="w-full bg-white/5 border border-white/10 text-white px-3 py-2.5 rounded-lg text-sm outline-none">
                {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select></div>
            <div><label className="text-sm text-gray-400 mb-1.5 block">Subject</label>
              <input value={bcForm.subject} onChange={e => setBcForm({ ...bcForm, subject: e.target.value })} className="w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-lg text-sm outline-none focus:border-amber-500" placeholder="Optional subject line" /></div>
            <div><label className="text-sm text-gray-400 mb-1.5 block">Message *</label>
              <textarea value={bcForm.message} onChange={e => setBcForm({ ...bcForm, message: e.target.value })} rows={5} className="w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-lg text-sm outline-none focus:border-amber-500 resize-none" placeholder="Type your message here..." /></div>
            <button onClick={handleBroadcast} className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-3 rounded-lg flex items-center justify-center gap-2">
              <Send size={16} /> Send to Batch
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Broadcast Result Dialog */}
      <Dialog open={resultDialog} onOpenChange={setResultDialog}>
        <DialogContent className="bg-[#16161a] border-white/10 text-white max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Message Sent — {broadcastResult?.batch_name}</DialogTitle>
            <DialogDescription className="text-gray-500">{broadcastResult?.count} recipients</DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-2">
            {broadcastResult?.recipients?.map(r => (
              <div key={r.student_id} className="flex items-center justify-between bg-white/[0.02] rounded-lg px-4 py-2.5">
                <div>
                  <div className="text-white text-sm">{r.name}</div>
                  <div className="text-gray-500 text-xs">{r.phone} · {r.email}</div>
                </div>
                {r.whatsapp_url && (
                  <a href={r.whatsapp_url} target="_blank" rel="noopener noreferrer" className="text-green-400 text-xs flex items-center gap-1 hover:underline">
                    <ExternalLink size={12} /> WhatsApp
                  </a>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Report Dialog */}
      <Dialog open={reportDialog} onOpenChange={setReportDialog}>
        <DialogContent className="bg-[#16161a] border-white/10 text-white max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Progress Report</DialogTitle>
            <DialogDescription className="text-gray-500">{reportData?.student?.full_name}</DialogDescription>
          </DialogHeader>
          {reportData && (
            <div className="mt-4 space-y-4">
              <div className="bg-white/5 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Batch</span><span className="text-white">{reportData.batch_name || "—"}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Level</span><span className="text-white">{reportData.student.chess_level}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Joined</span><span className="text-white">{reportData.student.joining_date}</span></div>
              </div>
              <div className="bg-white/5 rounded-lg p-4 space-y-2 text-sm">
                <h4 className="text-amber-400 text-xs font-medium uppercase tracking-wider">Attendance</h4>
                <div className="flex justify-between"><span className="text-gray-500">Total Sessions</span><span className="text-white">{reportData.attendance.total}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Present</span><span className="text-green-400">{reportData.attendance.present}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Percentage</span><span className={`font-medium ${reportData.attendance.percentage >= 75 ? "text-green-400" : "text-red-400"}`}>{reportData.attendance.percentage}%</span></div>
              </div>
              {reportData.test_stats?.total_tests > 0 && (
                <div className="bg-white/5 rounded-lg p-4 space-y-2 text-sm">
                  <h4 className="text-amber-400 text-xs font-medium uppercase tracking-wider">Test Performance</h4>
                  <div className="flex justify-between"><span className="text-gray-500">Tests Taken</span><span className="text-white">{reportData.test_stats.total_tests}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Highest</span><span className="text-green-400">{reportData.test_stats.highest}%</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Average</span><span className="text-amber-400">{reportData.test_stats.average}%</span></div>
                </div>
              )}
              <button onClick={copyReport} className="w-full py-2.5 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 text-sm flex items-center justify-center gap-2">
                <Copy size={14} /> Copy Report as Text
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
