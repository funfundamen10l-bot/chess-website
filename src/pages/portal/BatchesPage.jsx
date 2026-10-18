import { useState, useEffect, useCallback } from "react";
import { portalApi } from "../../lib/portalApi";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Calendar, Clock, Users, X, CalendarOff } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function BatchesPage() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [holidayBatch, setHolidayBatch] = useState(null);
  const [holidayDate, setHolidayDate] = useState("");
  const [holidayReason, setHolidayReason] = useState("");
  const [form, setForm] = useState({ name: "", schedule_days: [], schedule_time: "", max_capacity: 20 });

  const fetchBatches = useCallback(async () => {
    try {
      const res = await portalApi.listBatches();
      setBatches(res.data);
    } catch { toast.error("Failed to load batches"); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchBatches(); }, [fetchBatches]);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", schedule_days: [], schedule_time: "", max_capacity: 20 });
    setDialogOpen(true);
  };

  const openEdit = (batch) => {
    setEditing(batch);
    setForm({ name: batch.name, schedule_days: batch.schedule_days, schedule_time: batch.schedule_time, max_capacity: batch.max_capacity });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Batch name is required"); return; }
    try {
      if (editing) {
        await portalApi.updateBatch(editing.id, form);
        toast.success("Batch updated");
      } else {
        await portalApi.createBatch(form);
        toast.success("Batch created");
      }
      setDialogOpen(false);
      fetchBatches();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Failed to save batch");
    }
  };

  const handleDelete = async (batch) => {
    if (!window.confirm(`Delete "${batch.name}"? This cannot be undone.`)) return;
    try {
      await portalApi.deleteBatch(batch.id);
      toast.success("Batch deleted");
      fetchBatches();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Failed to delete");
    }
  };

  const toggleDay = (day) => {
    setForm(prev => ({
      ...prev,
      schedule_days: prev.schedule_days.includes(day)
        ? prev.schedule_days.filter(d => d !== day)
        : [...prev.schedule_days, day]
    }));
  };

  const handleAddHoliday = async () => {
    if (!holidayDate) return;
    try {
      await portalApi.addHoliday(holidayBatch.id, { date: holidayDate, reason: holidayReason });
      toast.success("Holiday added");
      setHolidayDate("");
      setHolidayReason("");
      fetchBatches();
    } catch { toast.error("Failed to add holiday"); }
  };

  const handleRemoveHoliday = async (batchId, date) => {
    try {
      await portalApi.removeHoliday(batchId, date);
      toast.success("Holiday removed");
      fetchBatches();
    } catch { toast.error("Failed to remove holiday"); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6" data-testid="batches-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-white">Batches</h1>
          <p className="text-gray-500 text-sm mt-1">Manage class batches and schedules</p>
        </div>
        <button onClick={openCreate} data-testid="create-batch-btn" className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-semibold text-sm rounded-lg transition-colors">
          <Plus size={16} /> New Batch
        </button>
      </div>

      {/* Batch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {batches.map((batch) => (
          <div key={batch.id} className="bg-[#16161a] border border-white/5 rounded-xl p-6 hover:border-amber-500/20 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-white font-medium text-lg">{batch.name}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                  <span className="flex items-center gap-1.5"><Calendar size={14} className="text-amber-400" />{batch.schedule_days?.join(", ") || "Not set"}</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} className="text-amber-400" />{batch.schedule_time || "Not set"}</span>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(batch)} className="p-2 text-gray-500 hover:text-amber-400 hover:bg-white/5 rounded-lg transition-colors"><Pencil size={15} /></button>
                <button onClick={() => handleDelete(batch)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={15} /></button>
              </div>
            </div>

            {/* Capacity bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-gray-500 flex items-center gap-1"><Users size={12} /> {batch.student_count} / {batch.max_capacity} students</span>
                <span className="text-amber-400">{batch.max_capacity > 0 ? Math.round((batch.student_count / batch.max_capacity) * 100) : 0}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500/60 rounded-full transition-all" style={{ width: `${batch.max_capacity > 0 ? Math.min((batch.student_count / batch.max_capacity) * 100, 100) : 0}%` }} />
              </div>
            </div>

            {/* Holidays */}
            <div className="border-t border-white/5 pt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-xs flex items-center gap-1"><CalendarOff size={12} /> Holidays ({batch.holidays?.length || 0})</span>
                <button onClick={() => setHolidayBatch(holidayBatch?.id === batch.id ? null : batch)} className="text-xs text-amber-400 hover:underline">
                  {holidayBatch?.id === batch.id ? "Close" : "Manage"}
                </button>
              </div>
              {holidayBatch?.id === batch.id && (
                <div className="space-y-2 mt-2">
                  <div className="flex gap-2">
                    <input type="date" value={holidayDate} onChange={e => setHolidayDate(e.target.value)} className="flex-1 bg-white/5 border border-white/10 text-white text-sm px-3 py-1.5 rounded-lg outline-none focus:border-amber-500" />
                    <input type="text" value={holidayReason} onChange={e => setHolidayReason(e.target.value)} placeholder="Reason" className="flex-1 bg-white/5 border border-white/10 text-white text-sm px-3 py-1.5 rounded-lg outline-none focus:border-amber-500" />
                    <button onClick={handleAddHoliday} className="px-3 py-1.5 bg-amber-500/20 text-amber-400 text-sm rounded-lg hover:bg-amber-500/30">Add</button>
                  </div>
                  {batch.holidays?.map((h) => (
                    <div key={h.date} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2 text-sm">
                      <span className="text-gray-300">{h.date} {h.reason && <span className="text-gray-500">— {h.reason}</span>}</span>
                      <button onClick={() => handleRemoveHoliday(batch.id, h.date)} className="text-red-400 hover:text-red-300"><X size={14} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {batches.length === 0 && (
        <div className="text-center py-16 text-gray-500">No batches yet. Create your first batch to get started.</div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#16161a] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">{editing ? "Edit Batch" : "Create Batch"}</DialogTitle>
            <DialogDescription className="text-gray-500">{editing ? "Update batch details" : "Add a new class batch"}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Batch Name *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-lg outline-none focus:border-amber-500" placeholder="e.g. Online 1" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Schedule Days</label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map(day => (
                  <button key={day} onClick={() => toggleDay(day)} className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${form.schedule_days.includes(day) ? "bg-amber-500/20 text-amber-400 border-amber-500/30" : "text-gray-500 border-white/10 hover:border-white/20"}`}>
                    {day}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Schedule Time</label>
              <input value={form.schedule_time} onChange={e => setForm({ ...form, schedule_time: e.target.value })} className="w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-lg outline-none focus:border-amber-500" placeholder="e.g. 4:00 PM - 5:00 PM" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Max Capacity</label>
              <input type="number" min="1" value={form.max_capacity} onChange={e => setForm({ ...form, max_capacity: parseInt(e.target.value) || 1 })} className="w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-lg outline-none focus:border-amber-500" />
            </div>
            <button onClick={handleSave} data-testid="save-batch-btn" className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-3 rounded-lg transition-colors">
              {editing ? "Update Batch" : "Create Batch"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
