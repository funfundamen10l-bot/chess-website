import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { portalApi } from "../../lib/portalApi";
import { toast } from "sonner";
import { ArrowLeft, Share2, Download, Send, Award, CalendarCheck, IndianRupee, TrendingUp, ExternalLink } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, LabelList } from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog";
import html2canvas from "html2canvas";

const TICK = { fill: "#9ca3af", fontSize: 11 };
const LABEL_STYLE = { fill: "#e5e5e5", fontSize: 11, fontWeight: 600 };
const LABEL_STYLE_SM = { fill: "#9ca3af", fontSize: 10 };
const GRID = "rgba(255,255,255,0.06)";
const TT = { background: "rgba(0,0,0,0.9)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 8, fontSize: 12 };

export default function StudentDetailPage() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [graph, setGraph] = useState(null);
  const [reportCard, setReportCard] = useState(null);
  const [reminderCard, setReminderCard] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [loading, setLoading] = useState(true);
  const reportRef = useRef(null);
  const reminderRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      const [gRes, rRes] = await Promise.all([
        portalApi.studentMonthlyGraph(studentId),
        portalApi.studentReportCard(studentId),
      ]);
      setGraph(gRes.data);
      setReportCard(rRes.data);
    } catch { toast.error("Failed to load student data"); } finally { setLoading(false); }
  }, [studentId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openReminderCard = async () => {
    try {
      const res = await portalApi.feeReminderCard(studentId);
      setReminderCard(res.data);
      setShowReminder(true);
    } catch { toast.error("Failed to generate reminder"); }
  };

  const downloadAsImage = async (ref, filename) => {
    if (!ref.current) return;
    try {
      const canvas = await html2canvas(ref.current, { backgroundColor: "#111115", scale: 2 });
      const link = document.createElement("a");
      link.download = `${filename}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Image downloaded!");
    } catch { toast.error("Download failed"); }
  };

  const shareViaWhatsApp = (data) => {
    if (!data) return;
    const cc = (data.student?.country_code || "+91").replace("+", "");
    const phone = data.student?.phone || "";
    const msg = `Dear ${data.student?.name},\n\nPending Fee Reminder - ChessZen Classes\n\nAttendance: ${data.attendance?.attended}/${data.attendance?.total_sessions} (${data.attendance?.percentage}%)\nSessions Paid: ${data.fees?.sessions_paid}\nPending Sessions: ${data.fees?.pending_sessions}\nPending Amount: ₹${data.fees?.pending_amount}\n\nFee: ₹${data.fees?.fee_per_block} per 8 sessions\n\nPayment Details:\n📱 PhonePe/GPay: 8090424776\n👤 Name: Ramya Singh\n🔗 UPI: 8090424776@ybl\n\nThank you,\nChessZen Classes`;
    const url = phone ? `https://wa.me/${cc}${phone}?text=${encodeURIComponent(msg)}` : "";
    if (url) window.open(url, "_blank");
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>;

  const rc = reportCard;

  return (
    <div className="space-y-6" data-testid="student-detail-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/portal/students")} className="p-2 text-gray-500 hover:text-white rounded-lg hover:bg-white/5"><ArrowLeft size={20} /></button>
          <div>
            <h1 className="text-2xl font-serif text-white">{graph?.student_name || rc?.student?.name}</h1>
            <p className="text-gray-500 text-sm">{graph?.batch_name} · Joined {graph?.joining_date}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={openReminderCard} className="flex items-center gap-2 px-4 py-2 bg-amber-500/15 text-amber-400 text-sm rounded-lg hover:bg-amber-500/25 border border-amber-500/20">
            <Send size={14} /> Fee Reminder
          </button>
          <button onClick={() => setShowReport(true)} className="flex items-center gap-2 px-4 py-2 bg-green-500/15 text-green-400 text-sm rounded-lg hover:bg-green-500/25 border border-green-500/20">
            <Award size={14} /> Report Card
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#16161a] border border-amber-500/20 rounded-xl p-5">
          <div className="text-gray-400 text-xs mb-2 flex items-center gap-1.5"><CalendarCheck size={14} className="text-amber-400" /> Attendance</div>
          <div className="text-2xl font-bold text-white">{graph?.overall_percentage}%</div>
          <div className="text-gray-500 text-xs mt-1">{graph?.total_attended}/{graph?.total_conducted} sessions</div>
        </div>
        <div className="bg-[#16161a] border border-blue-500/20 rounded-xl p-5">
          <div className="text-gray-400 text-xs mb-2 flex items-center gap-1.5"><TrendingUp size={14} className="text-blue-400" /> Test Average</div>
          <div className="text-2xl font-bold text-white">{rc?.tests?.stats?.average || 0}%</div>
          <div className="text-gray-500 text-xs mt-1">{rc?.tests?.stats?.total || 0} tests taken</div>
        </div>
        <div className="bg-[#16161a] border border-green-500/20 rounded-xl p-5">
          <div className="text-gray-400 text-xs mb-2 flex items-center gap-1.5"><IndianRupee size={14} className="text-green-400" /> Total Paid</div>
          <div className="text-2xl font-bold text-white">₹{rc?.fees?.total_paid || 0}</div>
          <div className="text-gray-500 text-xs mt-1">{rc?.fees?.sessions_paid || 0} sessions paid</div>
        </div>
        <div className="bg-[#16161a] border border-purple-500/20 rounded-xl p-5">
          <div className="text-gray-400 text-xs mb-2"><Award size={14} className="text-purple-400 inline mr-1.5" />Highest Score</div>
          <div className="text-2xl font-bold text-white">{rc?.tests?.stats?.highest || 0}%</div>
          <div className="text-gray-500 text-xs mt-1">Chess Level: {rc?.student?.chess_level}</div>
        </div>
      </div>

      {/* Monthly Attendance Graph */}
      {graph?.monthly?.length > 0 && (
        <div className="bg-[#16161a] border border-white/5 rounded-xl p-6">
          <h3 className="text-white font-medium mb-4 flex items-center gap-2"><CalendarCheck size={16} className="text-amber-400" /> Monthly Attendance: Conducted vs Attended</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={graph.monthly} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
                <XAxis dataKey="label" tick={TICK} />
                <YAxis tick={TICK} allowDecimals={false} />
                <Tooltip contentStyle={TT} />
                <Legend wrapperStyle={{ fontSize: 12, color: "#9ca3af" }} />
                <Bar dataKey="conducted" name="Conducted" fill="rgba(255,255,255,0.12)" radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="conducted" position="top" style={LABEL_STYLE_SM} />
                </Bar>
                <Bar dataKey="attended" name="Attended" fill="#f59e0b" radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="attended" position="top" style={LABEL_STYLE} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Monthly percentage row */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
            {graph.monthly.map(m => (
              <div key={m.month} className="flex-shrink-0 text-center bg-white/[0.03] rounded-lg px-3 py-2 min-w-[70px]">
                <div className="text-gray-500 text-[10px]">{m.label}</div>
                <div className={`text-sm font-bold ${m.percentage >= 75 ? "text-green-400" : m.percentage >= 50 ? "text-amber-400" : "text-red-400"}`}>{m.percentage}%</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Test Score Trend */}
      {rc?.tests?.entries?.length > 0 && (
        <div className="bg-[#16161a] border border-white/5 rounded-xl p-6">
          <h3 className="text-white font-medium mb-4 flex items-center gap-2"><TrendingUp size={16} className="text-amber-400" /> Test Score Progression</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rc.tests.entries}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
                <XAxis dataKey="name" tick={TICK} angle={-15} textAnchor="end" height={40} />
                <YAxis domain={[0, 100]} tick={TICK} />
                <Tooltip contentStyle={TT} />
                <Line type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={2} dot={{ fill: "#f59e0b", r: 4 }}>
                  <LabelList dataKey="score" position="top" style={LABEL_STYLE} formatter={(v) => `${v}%`} />
                </Line>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── REPORT CARD DIALOG ── */}
      <Dialog open={showReport} onOpenChange={setShowReport}>
        <DialogContent className="bg-[#111115] border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="sr-only"><DialogTitle>Report Card</DialogTitle><DialogDescription>Student performance report</DialogDescription></DialogHeader>
          <div ref={reportRef} className="p-8" style={{ background: "#111115" }}>
            {/* Report Card Content */}
            <div className="text-center mb-6 border-b border-amber-500/20 pb-6">
              <div className="text-amber-400 text-xs tracking-[0.3em] uppercase mb-1">ChessZen Classes</div>
              <h2 className="text-2xl font-serif text-white">Student Performance Report</h2>
              <p className="text-gray-500 text-xs mt-2">Generated {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div><span className="text-gray-500">Student:</span> <span className="text-white font-medium">{rc?.student?.name}</span></div>
              <div><span className="text-gray-500">Parent:</span> <span className="text-white">{rc?.student?.parent_name}</span></div>
              <div><span className="text-gray-500">Batch:</span> <span className="text-amber-400">{rc?.batch?.name}</span></div>
              <div><span className="text-gray-500">Level:</span> <span className="text-white">{rc?.student?.chess_level}</span></div>
              <div><span className="text-gray-500">Schedule:</span> <span className="text-white">{rc?.batch?.schedule}</span></div>
              <div><span className="text-gray-500">Joined:</span> <span className="text-white">{rc?.student?.joining_date}</span></div>
            </div>

            {/* Attendance Section */}
            <div className="mb-6">
              <h3 className="text-amber-400 text-xs tracking-wider uppercase mb-3 font-medium">Attendance Summary</h3>
              <div className="flex gap-4 mb-3">
                <div className="bg-white/5 rounded-lg p-3 flex-1 text-center">
                  <div className="text-2xl font-bold text-white">{rc?.attendance?.percentage}%</div>
                  <div className="text-gray-500 text-[10px]">Overall</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 flex-1 text-center">
                  <div className="text-2xl font-bold text-green-400">{rc?.attendance?.present}</div>
                  <div className="text-gray-500 text-[10px]">Present</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 flex-1 text-center">
                  <div className="text-2xl font-bold text-red-400">{rc?.attendance?.absent}</div>
                  <div className="text-gray-500 text-[10px]">Absent</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 flex-1 text-center">
                  <div className="text-2xl font-bold text-gray-400">{rc?.attendance?.total_sessions}</div>
                  <div className="text-gray-500 text-[10px]">Total</div>
                </div>
              </div>
              {rc?.attendance?.monthly?.length > 0 && (
                <div className="flex gap-1.5 flex-wrap">
                  {rc.attendance.monthly.map(m => (
                    <div key={m.label} className={`text-[10px] px-2 py-1 rounded ${m.pct >= 75 ? "bg-green-500/10 text-green-400" : m.pct >= 50 ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"}`}>
                      {m.label}: {m.attended}/{m.conducted} ({m.pct}%)
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Test Section */}
            {rc?.tests?.stats?.total > 0 && (
              <div className="mb-6">
                <h3 className="text-amber-400 text-xs tracking-wider uppercase mb-3 font-medium">Test Performance</h3>
                <div className="flex gap-4 mb-3">
                  <div className="bg-white/5 rounded-lg p-3 flex-1 text-center">
                    <div className="text-2xl font-bold text-green-400">{rc.tests.stats.highest}%</div>
                    <div className="text-gray-500 text-[10px]">Highest</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 flex-1 text-center">
                    <div className="text-2xl font-bold text-amber-400">{rc.tests.stats.average}%</div>
                    <div className="text-gray-500 text-[10px]">Average</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 flex-1 text-center">
                    <div className="text-2xl font-bold text-blue-400">{rc.tests.stats.latest}%</div>
                    <div className="text-gray-500 text-[10px]">Latest</div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {rc.tests.entries.map((t, i) => (
                    <div key={`t-${i}`} className="flex items-center justify-between bg-white/[0.03] rounded px-3 py-1.5 text-xs">
                      <span className="text-gray-300">{t.name} <span className="text-gray-600">({t.date})</span></span>
                      <span className={`font-bold ${t.score >= 75 ? "text-green-400" : t.score >= 50 ? "text-amber-400" : "text-red-400"}`}>{t.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-center text-gray-600 text-[10px] border-t border-white/5 pt-4 mt-4">ChessZen Classes · www.chess-zen.in</div>
          </div>

          <div className="flex gap-3 px-8 pb-6">
            <button onClick={() => downloadAsImage(reportRef, `ReportCard_${rc?.student?.name}`)} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-500 text-black font-semibold rounded-lg text-sm"><Download size={14} /> Download as Image</button>
            <button onClick={() => { navigator.clipboard.writeText(`Student Report - ${rc?.student?.name}\nAttendance: ${rc?.attendance?.percentage}%\nTest Avg: ${rc?.tests?.stats?.average || 0}%\nHighest: ${rc?.tests?.stats?.highest || 0}%`); toast.success("Copied!"); }} className="flex-1 py-2.5 bg-white/5 text-gray-300 rounded-lg text-sm">Copy Summary</button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── FEE REMINDER CARD DIALOG ── */}
      <Dialog open={showReminder} onOpenChange={setShowReminder}>
        <DialogContent className="bg-[#111115] border-white/10 text-white max-w-md max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="sr-only"><DialogTitle>Fee Reminder</DialogTitle><DialogDescription>Fee reminder card</DialogDescription></DialogHeader>
          {reminderCard && (
            <>
              <div ref={reminderRef} className="p-6" style={{ background: "#111115" }}>
                {/* Card Header */}
                <div className="text-center mb-5">
                  <div className="text-amber-400 text-[10px] tracking-[0.3em] uppercase">ChessZen Classes</div>
                  <h3 className="text-lg font-serif text-white mt-1">Fee Reminder</h3>
                  <p className="text-gray-500 text-xs mt-1">{reminderCard.student.name} · {reminderCard.student.batch}</p>
                </div>

                {/* Attendance Mini Chart */}
                {reminderCard.recent_months?.length > 0 && (
                  <div className="mb-4 bg-white/[0.03] rounded-xl p-4">
                    <div className="text-gray-400 text-[10px] uppercase tracking-wider mb-2">Recent Attendance</div>
                    <div className="flex gap-3 justify-center">
                      {reminderCard.recent_months.map(m => (
                        <div key={m.month} className="text-center">
                          <div className="flex items-end gap-0.5 h-12 justify-center mb-1">
                            <div className="w-3 rounded-t bg-white/10" style={{ height: `${m.conducted > 0 ? (m.conducted / Math.max(...reminderCard.recent_months.map(x => x.conducted || 1))) * 48 : 4}px` }} />
                            <div className="w-3 rounded-t bg-amber-500" style={{ height: `${m.attended > 0 ? (m.attended / Math.max(...reminderCard.recent_months.map(x => x.conducted || 1))) * 48 : 2}px` }} />
                          </div>
                          <div className="text-[10px] text-gray-500">{m.month}</div>
                          <div className="text-[10px] text-amber-400 font-medium">{m.attended}/{m.conducted}</div>
                        </div>
                      ))}
                    </div>
                    <div className="text-center mt-2">
                      <span className="text-xl font-bold text-white">{reminderCard.attendance.percentage}%</span>
                      <span className="text-gray-500 text-xs ml-2">overall attendance</span>
                    </div>
                  </div>
                )}

                {/* Fee Summary */}
                <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-4 mb-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-400">Sessions Attended</span><span className="text-white font-medium">{reminderCard.attendance.attended}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Sessions Paid</span><span className="text-green-400">{reminderCard.fees.sessions_paid}</span></div>
                    <div className="flex justify-between border-t border-white/5 pt-2"><span className="text-gray-400">Pending Sessions</span><span className="text-red-400 font-bold">{reminderCard.fees.pending_sessions}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Fee (per 8 sessions)</span><span className="text-white">₹{reminderCard.fees.fee_per_block}</span></div>
                    <div className="flex justify-between border-t border-amber-500/20 pt-2"><span className="text-amber-400 font-medium">Amount Due</span><span className="text-amber-400 text-lg font-bold">₹{reminderCard.fees.pending_amount}</span></div>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="bg-white/[0.03] rounded-xl p-4 text-center text-sm">
                  <div className="text-gray-400 text-[10px] uppercase tracking-wider mb-2">Payment Details</div>
                  <div className="text-white">📱 PhonePe / Google Pay: <strong>8090424776</strong></div>
                  <div className="text-white">👤 Name: <strong>Ramya Singh</strong></div>
                  <div className="text-amber-400">🔗 UPI: <strong>8090424776@ybl</strong></div>
                </div>

                <div className="text-center text-gray-600 text-[10px] mt-4">ChessZen Classes · www.chess-zen.in</div>
              </div>

              <div className="flex gap-3 px-6 pb-6">
                <button onClick={() => downloadAsImage(reminderRef, `FeeReminder_${reminderCard.student.name}`)} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-500 text-black font-semibold rounded-lg text-sm"><Download size={14} /> Save Image</button>
                <button onClick={() => shareViaWhatsApp(reminderCard)} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500/20 text-green-400 rounded-lg text-sm"><ExternalLink size={14} /> WhatsApp</button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
