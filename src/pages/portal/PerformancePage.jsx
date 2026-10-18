import { useState, useEffect, useCallback } from "react";
import { portalApi } from "../../lib/portalApi";
import { toast } from "sonner";
import { Plus, Trophy, Trash2, Paperclip, Upload, Award, TrendingUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";

const TICK = { fill: "#9ca3af", fontSize: 11 };
const CHART_TOOLTIP_STYLE = { background: "rgba(0,0,0,0.9)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 8, fontSize: 12 };
const SCORE_DOMAIN = [0, 100];
const LINE_DOT = { fill: "#f59e0b", r: 4 };
const SCORE_LABEL = { fill: "#e5e5e5", fontSize: 11, fontWeight: 600 };

function scoreColor(score) {
  if (score >= 75) return "text-green-400";
  if (score >= 50) return "text-amber-400";
  return "text-red-400";
}

function rankColor(rank) {
  if (rank === 1) return "text-amber-400";
  if (rank === 2) return "text-gray-300";
  if (rank === 3) return "text-amber-600";
  return "text-gray-500";
}

export default function PerformancePage() {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [testData, setTestData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [lbTestName, setLbTestName] = useState("");
  const [lbBatch, setLbBatch] = useState("");
  const [allTestNames, setAllTestNames] = useState([]);
  const [addDialog, setAddDialog] = useState(false);
  const [testForm, setTestForm] = useState({ student_id: "", test_name: "", test_date: new Date().toISOString().split("T")[0], score: 0, remarks: "" });

  const fetchBase = useCallback(async () => {
    try {
      const [sRes, bRes] = await Promise.all([portalApi.listStudents({}), portalApi.listBatches()]);
      setStudents(sRes.data);
      setBatches(bRes.data);
    } catch { /* initial load */ }
  }, []);

  useEffect(() => { fetchBase(); }, [fetchBase]);

  const loadStudentTests = async (id) => {
    try {
      const res = await portalApi.studentTests(id);
      setTestData(res.data);
      setSelectedStudent(students.find(s => s.id === id));
      // Collect unique test names
      const names = [...new Set(res.data.tests.map(t => t.test_name))];
      setAllTestNames(prev => [...new Set([...prev, ...names])]);
    } catch { toast.error("Failed to load tests"); }
  };

  const handleAddTest = async () => {
    if (!testForm.test_name || !testForm.student_id) { toast.error("Fill required fields"); return; }
    try {
      const res = await portalApi.addTest(testForm);
      toast.success("Test entry added");
      setAddDialog(false);
      loadStudentTests(testForm.student_id);
    } catch { toast.error("Failed to add test"); }
  };

  const handleDeleteTest = async (testId) => {
    if (!window.confirm("Delete this test entry?")) return;
    try {
      await portalApi.deleteTest(testId);
      toast.success("Deleted");
      if (selectedStudent) loadStudentTests(selectedStudent.id);
    } catch { toast.error("Failed to delete"); }
  };

  const handleAttachFile = async (testId, file) => {
    try {
      await portalApi.uploadAttachment(testId, file);
      toast.success("File attached");
      if (selectedStudent) loadStudentTests(selectedStudent.id);
    } catch (e) {
      toast.error(e.response?.data?.detail || "Upload failed");
    }
  };

  const loadLeaderboard = async () => {
    if (!lbTestName) return;
    try {
      const res = await portalApi.leaderboard(lbTestName, lbBatch || undefined);
      setLeaderboard(res.data);
    } catch { toast.error("Failed to load leaderboard"); }
  };

  useEffect(() => { if (lbTestName) loadLeaderboard(); }, [lbTestName, lbBatch]);

  const chartData = testData?.tests ? [...testData.tests].reverse().map(t => ({ name: t.test_name, date: t.test_date, score: t.score })) : [];

  return (
    <div className="space-y-6" data-testid="performance-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-white">Performance</h1>
          <p className="text-gray-500 text-sm mt-1">Track test scores and student progress</p>
        </div>
        <button onClick={() => { setTestForm({ student_id: selectedStudent?.id || "", test_name: "", test_date: new Date().toISOString().split("T")[0], score: 0, remarks: "" }); setAddDialog(true); }} className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-semibold text-sm rounded-lg">
          <Plus size={16} /> Add Test Entry
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Selector + Stats */}
        <div className="space-y-4">
          <div className="bg-[#16161a] border border-white/5 rounded-xl p-5">
            <label className="text-sm text-gray-400 mb-2 block">Select Student</label>
            <select onChange={e => { if (e.target.value) loadStudentTests(e.target.value); else { setSelectedStudent(null); setTestData(null); } }} value={selectedStudent?.id || ""} className="w-full bg-white/5 border border-white/10 text-white px-3 py-2.5 rounded-lg text-sm outline-none">
              <option value="">Choose a student...</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.full_name}</option>)}
            </select>
          </div>

          {testData?.stats && Object.keys(testData.stats).length > 0 && (
            <div className="bg-[#16161a] border border-white/5 rounded-xl p-5 space-y-3">
              <h3 className="text-white font-medium flex items-center gap-2"><Award size={16} className="text-amber-400" /> Score Summary</h3>
              {[
                { label: "Highest Score", value: `${testData.stats.highest}%`, color: "text-green-400" },
                { label: "Average Score", value: `${testData.stats.average}%`, color: "text-amber-400" },
                { label: "Latest Score", value: `${testData.stats.latest}%`, color: "text-blue-400" },
                { label: "Total Tests", value: testData.stats.total_tests, color: "text-white" },
              ].map(s => (
                <div key={s.label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{s.label}</span>
                  <span className={`font-medium ${s.color}`}>{s.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Score Chart + Test List */}
        <div className="lg:col-span-2 space-y-4">
          {chartData.length > 0 && (
            <div className="bg-[#16161a] border border-white/5 rounded-xl p-6">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2"><TrendingUp size={16} className="text-amber-400" /> Score Progression</h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="name" tick={TICK} angle={-15} textAnchor="end" height={40} />
                    <YAxis domain={SCORE_DOMAIN} tick={TICK} />
                    <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                    <Line type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={2} dot={LINE_DOT}>
                      <LabelList dataKey="score" position="top" style={SCORE_LABEL} formatter={(v) => `${v}%`} />
                    </Line>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {testData?.tests?.length > 0 && (
            <div className="bg-[#16161a] border border-white/5 rounded-xl">
              <div className="px-5 py-4 border-b border-white/5"><h3 className="text-white font-medium">Test History</h3></div>
              <div className="divide-y divide-white/[0.03]">
                {testData.tests.map(t => (
                  <div key={t.id} className="px-5 py-3">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <span className="text-white text-sm font-medium">{t.test_name}</span>
                        <span className="text-gray-500 text-xs ml-3">{t.test_date}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-bold ${scoreColor(t.score)}`}>{t.score}%</span>
                        <label className="p-1.5 text-gray-500 hover:text-amber-400 cursor-pointer">
                          <Paperclip size={14} />
                          <input type="file" className="hidden" onChange={e => { if (e.target.files?.[0]) handleAttachFile(t.id, e.target.files[0]); }} />
                        </label>
                        <button onClick={() => handleDeleteTest(t.id)} className="p-1.5 text-gray-500 hover:text-red-400"><Trash2 size={14} /></button>
                      </div>
                    </div>
                    {t.remarks && <p className="text-gray-500 text-xs">{t.remarks}</p>}
                    {t.attachments?.length > 0 && (
                      <div className="flex gap-2 mt-1">
                        {t.attachments.map((a, i) => (
                          <a key={`att-${i}`} href={`${process.env.REACT_APP_BACKEND_URL}${a.url}`} target="_blank" rel="noopener noreferrer" className="text-[10px] bg-white/5 text-amber-400 px-2 py-0.5 rounded flex items-center gap-1">
                            <Paperclip size={10} />{a.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-[#16161a] border border-white/5 rounded-xl p-6">
        <h3 className="text-white font-medium mb-4 flex items-center gap-2"><Trophy size={16} className="text-amber-400" /> Batch Leaderboard</h3>
        <div className="flex flex-wrap gap-3 mb-4">
          <input value={lbTestName} onChange={e => setLbTestName(e.target.value)} placeholder="Enter test name..." className="bg-white/5 border border-white/10 text-white px-3 py-2 rounded-lg text-sm outline-none focus:border-amber-500" list="test-names" />
          <datalist id="test-names">{allTestNames.map(n => <option key={n} value={n} />)}</datalist>
          <select value={lbBatch} onChange={e => setLbBatch(e.target.value)} className="bg-white/5 border border-white/10 text-white px-3 py-2 rounded-lg text-sm outline-none">
            <option value="">All Batches</option>
            {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        {leaderboard.length > 0 ? (
          <div className="space-y-2">
            {leaderboard.map(r => (
              <div key={r.student_id} className={`flex items-center gap-4 px-4 py-2.5 rounded-lg ${r.rank <= 3 ? "bg-amber-500/5 border border-amber-500/10" : "bg-white/[0.02]"}`}>
                <span className={`text-lg font-bold w-8 text-center ${rankColor(r.rank)}`}>#{r.rank}</span>
                <span className="text-white text-sm flex-1">{r.name}</span>
                <span className={`text-sm font-bold ${scoreColor(r.score)}`}>{r.score}%</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm text-center py-6">{lbTestName ? "No results found" : "Enter a test name to view leaderboard"}</p>
        )}
      </div>

      {/* Add Test Dialog */}
      <Dialog open={addDialog} onOpenChange={setAddDialog}>
        <DialogContent className="bg-[#16161a] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Add Test Entry</DialogTitle>
            <DialogDescription className="text-gray-500">Record a new test score</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div><label className="text-sm text-gray-400 mb-1.5 block">Student *</label>
              <select value={testForm.student_id} onChange={e => setTestForm({ ...testForm, student_id: e.target.value })} className="w-full bg-white/5 border border-white/10 text-white px-3 py-2.5 rounded-lg text-sm outline-none">
                <option value="">Select student...</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.full_name}</option>)}
              </select></div>
            <div><label className="text-sm text-gray-400 mb-1.5 block">Test Name *</label>
              <input value={testForm.test_name} onChange={e => setTestForm({ ...testForm, test_name: e.target.value })} className="w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-lg text-sm outline-none focus:border-amber-500" placeholder="e.g. Monthly Assessment - May" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm text-gray-400 mb-1.5 block">Date</label>
                <input type="date" value={testForm.test_date} onChange={e => setTestForm({ ...testForm, test_date: e.target.value })} className="w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-lg text-sm outline-none focus:border-amber-500" /></div>
              <div><label className="text-sm text-gray-400 mb-1.5 block">Score (0-100) *</label>
                <input type="number" min="0" max="100" value={testForm.score} onChange={e => setTestForm({ ...testForm, score: Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)) })} className="w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-lg text-sm outline-none focus:border-amber-500" /></div>
            </div>
            <div><label className="text-sm text-gray-400 mb-1.5 block">Remarks</label>
              <textarea value={testForm.remarks} onChange={e => setTestForm({ ...testForm, remarks: e.target.value })} rows={2} className="w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-lg text-sm outline-none focus:border-amber-500 resize-none" placeholder="Admin notes..." /></div>
            <button onClick={handleAddTest} className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-3 rounded-lg">Add Test Entry</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
