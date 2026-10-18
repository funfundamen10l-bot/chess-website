import { useState, useEffect, useCallback } from "react";
import { portalApi } from "../../lib/portalApi";
import { toast } from "sonner";
import { Plus, Trophy, Pencil, Trash2, MapPin, Calendar, Users, Save, ChevronDown, ChevronUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog";

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", date: new Date().toISOString().split("T")[0], batch_ids: [], description: "", location: "" });
  const [expandedId, setExpandedId] = useState(null);
  const [scores, setScores] = useState({});
  const [scoreEntries, setScoreEntries] = useState([]);
  const [savingScores, setSavingScores] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [tRes, bRes, sRes] = await Promise.all([
        portalApi.listTournaments(),
        portalApi.listBatches(),
        portalApi.listStudents({ status: "Active" }),
      ]);
      setTournaments(tRes.data);
      setBatches(bRes.data);
      setStudents(sRes.data);
    } catch { /* initial load */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const batchMap = Object.fromEntries(batches.map(b => [b.id, b.name]));

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", date: new Date().toISOString().split("T")[0], batch_ids: [], description: "", location: "" });
    setDialogOpen(true);
  };

  const openEdit = (t) => {
    setEditing(t);
    setForm({ name: t.name, date: t.date, batch_ids: t.batch_ids || [], description: t.description || "", location: t.location || "" });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Tournament name is required"); return; }
    try {
      if (editing) { await portalApi.updateTournament(editing.id, form); toast.success("Updated"); }
      else { await portalApi.createTournament(form); toast.success("Tournament scheduled"); }
      setDialogOpen(false);
      fetchData();
    } catch { toast.error("Failed to save"); }
  };

  const handleDelete = async (t) => {
    if (!window.confirm(`Delete "${t.name}"? All associated scores will be removed.`)) return;
    try { await portalApi.deleteTournament(t.id); toast.success("Deleted"); fetchData(); }
    catch { toast.error("Failed to delete"); }
  };

  const toggleBatch = (bid) => {
    setForm(prev => ({
      ...prev,
      batch_ids: prev.batch_ids.includes(bid) ? prev.batch_ids.filter(b => b !== bid) : [...prev.batch_ids, bid]
    }));
  };

  const expandTournament = async (t) => {
    if (expandedId === t.id) { setExpandedId(null); return; }
    setExpandedId(t.id);
    try {
      const res = await portalApi.getTournamentScores(t.id);
      setScores(res.data);
      // Build score entries for editing
      const eligible = students.filter(s => !t.batch_ids?.length || t.batch_ids.includes(s.batch_id));
      const existingMap = {};
      res.data.scores.forEach(s => { existingMap[s.student_id] = { score: s.score, remarks: s.remarks }; });
      setScoreEntries(eligible.map(s => ({
        student_id: s.id,
        name: s.full_name,
        batch: batchMap[s.batch_id] || "",
        score: existingMap[s.id]?.score ?? "",
        remarks: existingMap[s.id]?.remarks ?? "",
      })));
    } catch { toast.error("Failed to load scores"); }
  };

  const updateScoreEntry = (idx, field, value) => {
    setScoreEntries(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const handleSaveScores = async (tournamentId) => {
    const validScores = scoreEntries
      .filter(e => e.score !== "" && e.score !== null)
      .map(e => ({ student_id: e.student_id, score: parseFloat(e.score) || 0, remarks: e.remarks }));
    if (!validScores.length) { toast.error("Enter at least one score"); return; }
    setSavingScores(true);
    try {
      await portalApi.recordTournamentScores(tournamentId, validScores);
      toast.success(`${validScores.length} scores saved`);
      expandTournament({ id: tournamentId });
    } catch { toast.error("Failed to save scores"); } finally { setSavingScores(false); }
  };

  const isPast = (dateStr) => new Date(dateStr) < new Date();

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6" data-testid="tournaments-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-white">Tournaments & Tests</h1>
          <p className="text-gray-500 text-sm mt-1">Schedule events and record student performance</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-semibold text-sm rounded-lg">
          <Plus size={16} /> Schedule New
        </button>
      </div>

      {/* Tournament List */}
      <div className="space-y-4">
        {tournaments.map(t => (
          <div key={t.id} className={`bg-[#16161a] border rounded-xl overflow-hidden ${isPast(t.date) ? "border-white/5" : "border-amber-500/15"}`}>
            <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-white/[0.02]" onClick={() => expandTournament(t)}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isPast(t.date) ? "bg-white/5" : "bg-amber-500/15"}`}>
                  <Trophy size={18} className={isPast(t.date) ? "text-gray-500" : "text-amber-400"} />
                </div>
                <div>
                  <div className="text-white font-medium">{t.name}</div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                    <span className="flex items-center gap-1"><Calendar size={11} /> {t.date}</span>
                    {t.location && <span className="flex items-center gap-1"><MapPin size={11} /> {t.location}</span>}
                    {t.batch_ids?.length > 0 && <span className="flex items-center gap-1"><Users size={11} /> {t.batch_ids.map(id => batchMap[id]).filter(Boolean).join(", ")}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-2 py-0.5 rounded ${isPast(t.date) ? "bg-gray-500/15 text-gray-400" : "bg-green-500/15 text-green-400"}`}>
                  {isPast(t.date) ? "Completed" : "Upcoming"}
                </span>
                <button onClick={(e) => { e.stopPropagation(); openEdit(t); }} className="p-1.5 text-gray-500 hover:text-amber-400"><Pencil size={14} /></button>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(t); }} className="p-1.5 text-gray-500 hover:text-red-400"><Trash2 size={14} /></button>
                {expandedId === t.id ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
              </div>
            </div>

            {t.description && expandedId === t.id && (
              <div className="px-5 pb-2 text-gray-500 text-xs">{t.description}</div>
            )}

            {/* Score Entry Panel */}
            {expandedId === t.id && (
              <div className="border-t border-white/5 px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white text-sm font-medium">Student Scores</h4>
                  <button onClick={() => handleSaveScores(t.id)} disabled={savingScores} className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black text-xs font-semibold rounded-lg disabled:opacity-50">
                    <Save size={12} /> {savingScores ? "Saving..." : "Save Scores"}
                  </button>
                </div>
                <div className="space-y-1.5 max-h-[400px] overflow-y-auto">
                  <div className="grid grid-cols-[1fr_80px_1fr] gap-2 text-[10px] text-gray-500 uppercase tracking-wider px-1 mb-1">
                    <span>Student</span><span>Score</span><span>Remarks</span>
                  </div>
                  {scoreEntries.map((e, i) => (
                    <div key={e.student_id} className="grid grid-cols-[1fr_80px_1fr] gap-2 items-center bg-white/[0.02] rounded-lg px-3 py-2">
                      <div>
                        <span className="text-white text-sm">{e.name}</span>
                        <span className="text-gray-600 text-xs ml-2">{e.batch}</span>
                      </div>
                      <input type="number" min="0" max="100" value={e.score} onChange={ev => updateScoreEntry(i, "score", ev.target.value)} placeholder="0-100" className="bg-white/5 border border-white/10 text-white text-sm px-2 py-1.5 rounded outline-none focus:border-amber-500 w-full" />
                      <input value={e.remarks} onChange={ev => updateScoreEntry(i, "remarks", ev.target.value)} placeholder="Optional remarks" className="bg-white/5 border border-white/10 text-white text-sm px-2 py-1.5 rounded outline-none focus:border-amber-500 w-full" />
                    </div>
                  ))}
                  {scoreEntries.length === 0 && <p className="text-gray-500 text-sm text-center py-4">No eligible students found for selected batches</p>}
                </div>
              </div>
            )}
          </div>
        ))}
        {tournaments.length === 0 && <div className="text-center py-16 text-gray-500 text-sm">No tournaments scheduled yet</div>}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#16161a] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">{editing ? "Edit Tournament" : "Schedule Tournament/Test"}</DialogTitle>
            <DialogDescription className="text-gray-500">{editing ? "Update event details" : "Create a new event"}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div><label className="text-sm text-gray-400 mb-1.5 block">Name *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-lg outline-none focus:border-amber-500 text-sm" placeholder="e.g. Monthly Assessment - June" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm text-gray-400 mb-1.5 block">Date</label>
                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-lg outline-none focus:border-amber-500 text-sm" /></div>
              <div><label className="text-sm text-gray-400 mb-1.5 block">Location</label>
                <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-lg outline-none focus:border-amber-500 text-sm" placeholder="Online / Venue" /></div>
            </div>
            <div><label className="text-sm text-gray-400 mb-1.5 block">Applicable Batches</label>
              <div className="flex flex-wrap gap-2">
                {batches.map(b => (
                  <button key={b.id} onClick={() => toggleBatch(b.id)} className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${form.batch_ids.includes(b.id) ? "bg-amber-500/20 text-amber-400 border-amber-500/30" : "text-gray-500 border-white/10 hover:border-white/20"}`}>
                    {b.name}
                  </button>
                ))}
              </div>
              <p className="text-gray-600 text-xs mt-1">Leave empty for all batches</p>
            </div>
            <div><label className="text-sm text-gray-400 mb-1.5 block">Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-lg outline-none focus:border-amber-500 text-sm resize-none" placeholder="Event details..." /></div>
            <button onClick={handleSave} className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-3 rounded-lg">{editing ? "Update" : "Schedule"}</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
