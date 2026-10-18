import { useState, useEffect, useCallback, useMemo } from "react";
import { portalApi } from "../../lib/portalApi";
import { toast } from "sonner";
import { IndianRupee, Plus, Send, AlertTriangle, CreditCard, TrendingUp, ExternalLink, Search, Users, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog";

const METHODS = ["PhonePe", "Google Pay", "Cash", "Bank Transfer"];

export default function FeesPage() {
  const [summary, setSummary] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [payments, setPayments] = useState(null);
  const [payDialog, setPayDialog] = useState(false);
  const [reminderDialog, setReminderDialog] = useState(false);
  const [reminderData, setReminderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payForm, setPayForm] = useState({ student_id: "", amount: 0, date: new Date().toISOString().split("T")[0], method: "PhonePe", sessions_covered: 8, notes: "" });
  const [editingPayment, setEditingPayment] = useState(null);
  const [studentSearch, setStudentSearch] = useState("");

  const fetchSummary = useCallback(async () => {
    try {
      const [sRes, fRes] = await Promise.all([
        portalApi.listStudents({ status: "Active" }),
        portalApi.feesSummary(),
      ]);
      setStudents(sRes.data);
      setSummary(fRes.data);
    } catch { toast.error("Failed to load fee data"); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchSummary(); }, [fetchSummary]);

  const openPayment = (student) => {
    setEditingPayment(null);
    setPayForm({ student_id: student.id, amount: student.fee_per_block || 0, date: new Date().toISOString().split("T")[0], method: "PhonePe", sessions_covered: 8, notes: "" });
    setPayDialog(true);
  };

  const openEditPayment = (payment) => {
    setEditingPayment(payment);
    setPayForm({ student_id: payment.student_id, amount: payment.amount, date: payment.date, method: payment.method, sessions_covered: payment.sessions_covered || 8, notes: payment.notes || "" });
    setPayDialog(true);
  };

  const handlePay = async () => {
    if (payForm.amount <= 0) { toast.error("Amount must be positive"); return; }
    try {
      if (editingPayment) {
        await portalApi.updatePayment(editingPayment.id, payForm);
        toast.success("Payment updated");
      } else {
        await portalApi.recordPayment(payForm);
        toast.success("Payment recorded");
      }
      setPayDialog(false);
      setEditingPayment(null);
      fetchSummary();
      if (selectedStudent) loadStudentPayments(selectedStudent.id);
    } catch { toast.error("Failed to save payment"); }
  };

  const handleDeletePayment = async (paymentId) => {
    if (!window.confirm("Delete this payment entry? This cannot be undone.")) return;
    try {
      await portalApi.deletePayment(paymentId);
      toast.success("Payment deleted");
      fetchSummary();
      if (selectedStudent) loadStudentPayments(selectedStudent.id);
    } catch { toast.error("Failed to delete payment"); }
  };

  const loadStudentPayments = async (id) => {
    try {
      const res = await portalApi.studentPayments(id);
      setPayments(res.data);
      setSelectedStudent(students.find(s => s.id === id) || null);
    } catch { toast.error("Failed to load payments"); }
  };

  const handleReminder = async (student) => {
    try {
      const res = await portalApi.feeReminder(student.id);
      setReminderData(res.data);
      setReminderDialog(true);
    } catch { toast.error("Failed to generate reminder"); }
  };

  const filteredStudents = useMemo(() =>
    students.filter(s => !studentSearch || s.full_name.toLowerCase().includes(studentSearch.toLowerCase()) || s.email?.toLowerCase().includes(studentSearch.toLowerCase())),
    [students, studentSearch]
  );

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6" data-testid="fees-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-white">Fee Management</h1>
          <p className="text-gray-500 text-sm mt-1">Track payments and manage fee collection</p>
        </div>
        {summary?.students_with_dues?.length > 0 && (
          <button
            onClick={async () => {
              for (const s of summary.students_with_dues) {
                await handleReminder(s);
                break; // Open first one; user sends one by one
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/15 text-amber-400 text-sm rounded-lg hover:bg-amber-500/25 border border-amber-500/20"
          >
            <Send size={16} /> Send Reminders
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Monthly Revenue", value: `₹${summary?.monthly_revenue?.toLocaleString() || 0}`, icon: <TrendingUp className="text-green-400" size={20} />, border: "border-green-500/20" },
          { label: "Total Revenue", value: `₹${summary?.total_revenue?.toLocaleString() || 0}`, icon: <IndianRupee className="text-amber-400" size={20} />, border: "border-amber-500/20" },
          { label: "Total Pending", value: `₹${summary?.total_pending?.toLocaleString() || 0}`, icon: <AlertTriangle className="text-red-400" size={20} />, border: "border-red-500/20" },
          { label: "Students with Dues", value: summary?.students_with_dues?.length || 0, icon: <CreditCard className="text-blue-400" size={20} />, border: "border-blue-500/20" },
        ].map(c => (
          <div key={c.label} className={`bg-[#16161a] border ${c.border} rounded-xl p-5`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">{c.icon}</div>
              <span className="text-gray-400 text-sm">{c.label}</span>
            </div>
            <span className="text-2xl font-bold text-white">{c.value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Students with Dues */}
        <div className="lg:col-span-2 bg-[#16161a] border border-white/5 rounded-xl">
          <div className="px-5 py-4 border-b border-white/5">
            <h3 className="text-white font-medium">Students with Pending Fees</h3>
          </div>
          {summary?.students_with_dues?.length > 0 ? (
            <div className="divide-y divide-white/[0.03]">
              {summary.students_with_dues.map(s => (
                <div key={s.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <div className="text-white text-sm">{s.name}</div>
                    <div className="text-gray-500 text-xs">{s.pending_sessions} sessions pending · ₹{s.pending_amount}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => loadStudentPayments(s.id)} className="px-3 py-1.5 text-xs bg-white/5 text-gray-400 hover:text-white rounded-lg">View</button>
                    <button onClick={() => openPayment({ id: s.id, fee_per_block: 0 })} className="px-3 py-1.5 text-xs bg-green-500/15 text-green-400 rounded-lg hover:bg-green-500/25"><Plus size={12} className="inline" /> Pay</button>
                    <button onClick={() => handleReminder({ id: s.id })} className="px-3 py-1.5 text-xs bg-amber-500/15 text-amber-400 rounded-lg hover:bg-amber-500/25"><Send size={12} className="inline" /> Remind</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 text-sm">No pending fees</div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="bg-[#16161a] border border-white/5 rounded-xl p-5">
            <h3 className="text-white font-medium mb-4">Record Payment</h3>
            <div className="space-y-3">
              <select onChange={e => { const s = students.find(st => st.id === e.target.value); if (s) openPayment(s); }} className="w-full bg-white/5 border border-white/10 text-white px-3 py-2.5 rounded-lg text-sm outline-none">
                <option value="">Select student...</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.full_name}</option>)}
              </select>
            </div>
          </div>

          {/* Selected Student Payment Details */}
          {selectedStudent && payments && (
            <div className="bg-[#16161a] border border-white/5 rounded-xl p-5">
              <h3 className="text-white font-medium mb-3">{selectedStudent.full_name}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Sessions Attended</span><span className="text-white">{payments.sessions_attended}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Sessions Paid</span><span className="text-green-400">{payments.sessions_paid}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Pending Sessions</span><span className="text-red-400">{payments.sessions_pending}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Total Paid</span><span className="text-white">₹{payments.total_paid}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Pending Amount</span><span className="text-amber-400">₹{payments.pending_amount}</span></div>
              </div>
              {payments.payments?.length > 0 && (
                <div className="mt-4 border-t border-white/5 pt-3">
                  <h4 className="text-gray-500 text-xs mb-2">Payment History</h4>
                  {payments.payments.map(p => (
                    <div key={p.id} className="flex items-center justify-between text-xs py-2 border-b border-white/[0.03] last:border-0">
                      <div>
                        <span className="text-gray-400">{p.date} · {p.method}</span>
                        {p.notes && <span className="text-gray-600 ml-2">({p.notes})</span>}
                        <div className="text-gray-600 text-[10px]">{p.sessions_covered || 8} sessions</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-400 font-medium">₹{p.amount}</span>
                        <button onClick={() => openEditPayment(p)} className="p-1 text-gray-600 hover:text-amber-400 transition-colors"><Pencil size={12} /></button>
                        <button onClick={() => handleDeletePayment(p.id)} className="p-1 text-gray-600 hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* All Students — Fee Actions */}
      <div className="bg-[#16161a] border border-white/5 rounded-xl">
        <div className="px-5 py-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-white font-medium flex items-center gap-2"><Users size={16} className="text-amber-400" /> All Students — Fee Actions</h3>
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input value={studentSearch} onChange={e => setStudentSearch(e.target.value)} placeholder="Search students..." className="w-full bg-white/5 border border-white/10 text-white pl-9 pr-3 py-2 rounded-lg text-xs outline-none focus:border-amber-500" />
          </div>
        </div>
        <div className="divide-y divide-white/[0.03] max-h-[400px] overflow-y-auto">
          {filteredStudents.map(s => (
              <div key={s.id} className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-amber-500/15 flex-shrink-0 flex items-center justify-center text-amber-400 text-xs font-bold">{s.full_name.charAt(0)}</div>
                  <div className="min-w-0">
                    <div className="text-white text-sm truncate">{s.full_name}</div>
                    <div className="text-gray-500 text-xs truncate">{s.email || s.phone || "No contact"} {s.fee_per_block > 0 ? `· ₹${s.fee_per_block}/block` : ""}</div>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => loadStudentPayments(s.id)} className="px-3 py-1.5 text-xs bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors">View</button>
                  <button onClick={() => openPayment(s)} className="px-3 py-1.5 text-xs bg-green-500/15 text-green-400 rounded-lg hover:bg-green-500/25 transition-colors flex items-center gap-1"><Plus size={12} /> Pay</button>
                  <button onClick={() => handleReminder(s)} data-testid={`remind-${s.id}`} className="px-3 py-1.5 text-xs bg-amber-500/15 text-amber-400 rounded-lg hover:bg-amber-500/25 transition-colors flex items-center gap-1"><Send size={12} /> Remind</button>
                </div>
              </div>
            ))
          }
          {filteredStudents.length === 0 && (
            <div className="text-center py-10 text-gray-500 text-sm">No students found</div>
          )}
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={payDialog} onOpenChange={setPayDialog}>
        <DialogContent className="bg-[#16161a] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">{editingPayment ? "Edit Payment" : "Record Payment"}</DialogTitle>
            <DialogDescription className="text-gray-500">{editingPayment ? "Update payment details" : "Add a new payment entry"}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div><label className="text-sm text-gray-400 mb-1.5 block">Amount (INR)</label>
              <input type="number" min="0" value={payForm.amount} onChange={e => setPayForm({ ...payForm, amount: parseFloat(e.target.value) || 0 })} className="w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-lg outline-none focus:border-amber-500 text-sm" /></div>
            <div><label className="text-sm text-gray-400 mb-1.5 block">Date</label>
              <input type="date" value={payForm.date} onChange={e => setPayForm({ ...payForm, date: e.target.value })} className="w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-lg outline-none focus:border-amber-500 text-sm" /></div>
            <div><label className="text-sm text-gray-400 mb-1.5 block">Payment Method</label>
              <select value={payForm.method} onChange={e => setPayForm({ ...payForm, method: e.target.value })} className="w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-lg outline-none focus:border-amber-500 text-sm">
                {METHODS.map(m => <option key={m} value={m}>{m}</option>)}
              </select></div>
            <div><label className="text-sm text-gray-400 mb-1.5 block">Sessions Covered</label>
              <input type="number" min="1" value={payForm.sessions_covered} onChange={e => setPayForm({ ...payForm, sessions_covered: parseInt(e.target.value) || 8 })} className="w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-lg outline-none focus:border-amber-500 text-sm" /></div>
            <div><label className="text-sm text-gray-400 mb-1.5 block">Notes</label>
              <input value={payForm.notes} onChange={e => setPayForm({ ...payForm, notes: e.target.value })} className="w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-lg outline-none focus:border-amber-500 text-sm" placeholder="Optional notes" /></div>
            <button onClick={handlePay} className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-3 rounded-lg">{editingPayment ? "Update Payment" : "Record Payment"}</button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reminder Dialog */}
      <Dialog open={reminderDialog} onOpenChange={setReminderDialog}>
        <DialogContent className="bg-[#16161a] border-white/10 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Fee Reminder</DialogTitle>
            <DialogDescription className="text-gray-500">Send via WhatsApp or copy the message</DialogDescription>
          </DialogHeader>
          {reminderData && (
            <div className="mt-4 space-y-4">
              <pre className="text-sm text-gray-300 bg-white/5 p-4 rounded-lg whitespace-pre-wrap max-h-60 overflow-y-auto">{reminderData.message}</pre>
              <div className="flex gap-3">
                {reminderData.whatsapp_url && (
                  <a href={reminderData.whatsapp_url} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 text-sm">
                    <ExternalLink size={14} /> Send WhatsApp
                  </a>
                )}
                <button onClick={() => { navigator.clipboard.writeText(reminderData.message); toast.success("Copied!"); }} className="flex-1 py-2.5 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 text-sm">
                  Copy Message
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
