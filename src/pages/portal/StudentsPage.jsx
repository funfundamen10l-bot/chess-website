import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { portalApi } from "../../lib/portalApi";
import { toast } from "sonner";
import {
  Plus, Search, Filter, Pencil, Trash2, Upload, X, UserCircle, Phone, Mail, ChevronDown, FileSpreadsheet, Download, Eye
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog";

const AGE_GROUPS = ["Below 5", "5-10", "10-15", "15-20", "20+"];
const CHESS_LEVELS = ["Beginner", "Intermediate", "Advanced", "Tournament Player"];
const COUNTRY_CODES = ["+91", "+1", "+44", "+61", "+971", "+65", "+49", "+33"];

const LEVEL_COLORS = {
  Beginner: "bg-green-500/15 text-green-400",
  Intermediate: "bg-blue-500/15 text-blue-400",
  Advanced: "bg-purple-500/15 text-purple-400",
  "Tournament Player": "bg-amber-500/15 text-amber-400",
};

export default function StudentsPage() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [filterBatch, setFilterBatch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [bulkDialog, setBulkDialog] = useState(false);
  const [bulkFile, setBulkFile] = useState(null);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkResult, setBulkResult] = useState(null);

  const [form, setForm] = useState({
    full_name: "", age_group: "5-10", email: "", phone: "", country_code: "+91",
    parent_name: "", batch_id: "", joining_date: "", chess_level: "Beginner",
    fee_per_block: 0, status: "Active", date_of_birth: "",
  });

  const fetchData = useCallback(async () => {
    try {
      const [sRes, bRes] = await Promise.all([
        portalApi.listStudents({ search: search || undefined, batch_id: filterBatch || undefined, status: filterStatus || undefined, chess_level: filterLevel || undefined }),
        portalApi.listBatches(),
      ]);
      setStudents(sRes.data);
      setBatches(bRes.data);
    } catch { toast.error("Failed to load data"); } finally { setLoading(false); }
  }, [search, filterBatch, filterStatus, filterLevel]);

  useEffect(() => {
    const timer = setTimeout(() => fetchData(), search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [fetchData, search]);

  const batchMap = Object.fromEntries(batches.map(b => [b.id, b.name]));

  const openCreate = () => {
    setEditing(null);
    setPhotoFile(null);
    setForm({ full_name: "", age_group: "5-10", email: "", phone: "", country_code: "+91", parent_name: "", batch_id: batches[0]?.id || "", joining_date: new Date().toISOString().split("T")[0], chess_level: "Beginner", fee_per_block: 0, status: "Active", date_of_birth: "" });
    setDialogOpen(true);
  };

  const openEdit = (student) => {
    setEditing(student);
    setPhotoFile(null);
    setForm({
      full_name: student.full_name, age_group: student.age_group, email: student.email,
      phone: student.phone, country_code: student.country_code || "+91", parent_name: student.parent_name,
      batch_id: student.batch_id, joining_date: student.joining_date, chess_level: student.chess_level,
      fee_per_block: student.fee_per_block, status: student.status, date_of_birth: student.date_of_birth || "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.full_name.trim()) { toast.error("Student name is required"); return; }
    try {
      let studentId;
      if (editing) {
        await portalApi.updateStudent(editing.id, form);
        studentId = editing.id;
        toast.success("Student updated");
      } else {
        const res = await portalApi.createStudent(form);
        studentId = res.data.id;
        toast.success("Student added");
      }
      if (photoFile) {
        await portalApi.uploadPhoto(studentId, photoFile);
      }
      setDialogOpen(false);
      fetchData();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Failed to save");
    }
  };

  const handleDelete = async (student) => {
    if (!window.confirm(`Delete "${student.full_name}"? This cannot be undone.`)) return;
    try {
      await portalApi.deleteStudent(student.id);
      toast.success("Student deleted");
      fetchData();
    } catch { toast.error("Failed to delete"); }
  };

  const handleToggleStatus = async (student) => {
    const newStatus = student.status === "Active" ? "Inactive" : "Active";
    try {
      await portalApi.updateStudent(student.id, { status: newStatus });
      toast.success(`Student marked ${newStatus}`);
      fetchData();
    } catch { toast.error("Failed to update status"); }
  };

  const handleDownloadTemplate = async () => {
    try {
      const res = await portalApi.downloadTemplate();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = "ChessZen_Student_Template.xlsx";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch { toast.error("Download failed"); }
  };

  const handleBulkUpload = async () => {
    if (!bulkFile) { toast.error("Select an Excel file"); return; }
    setBulkUploading(true);
    setBulkResult(null);
    try {
      const res = await portalApi.bulkUpload(bulkFile);
      setBulkResult(res.data);
      if (res.data.created_count > 0) {
        toast.success(`${res.data.created_count} students imported`);
        fetchData();
      }
      if (res.data.error_count > 0) {
        toast.error(`${res.data.error_count} rows had errors`);
      }
    } catch (e) {
      toast.error(e.response?.data?.detail || "Upload failed");
    } finally { setBulkUploading(false); }
  };

  const activeFilters = [filterBatch, filterStatus, filterLevel].filter(Boolean).length;

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6" data-testid="students-page">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-white">Students</h1>
          <p className="text-gray-500 text-sm mt-1">{students.length} students found</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setBulkFile(null); setBulkResult(null); setBulkDialog(true); }} data-testid="bulk-upload-btn" className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 text-gray-300 hover:text-white font-medium text-sm rounded-lg transition-colors">
            <FileSpreadsheet size={16} /> Bulk Upload
          </button>
          <button onClick={openCreate} data-testid="add-student-btn" className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-semibold text-sm rounded-lg transition-colors">
            <Plus size={16} /> Add Student
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              data-testid="student-search"
              className="w-full bg-[#16161a] border border-white/10 text-white pl-10 pr-4 py-2.5 rounded-lg outline-none focus:border-amber-500 text-sm"
              placeholder="Search by name, email, phone, or parent..."
            />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm transition-colors ${activeFilters > 0 ? "border-amber-500/30 text-amber-400 bg-amber-500/10" : "border-white/10 text-gray-400 hover:text-white"}`}>
            <Filter size={16} /> Filters {activeFilters > 0 && <span className="w-5 h-5 bg-amber-500 text-black text-xs font-bold rounded-full flex items-center justify-center">{activeFilters}</span>}
          </button>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-3 p-4 bg-[#16161a] border border-white/5 rounded-xl">
            <select value={filterBatch} onChange={e => setFilterBatch(e.target.value)} className="bg-white/5 border border-white/10 text-white text-sm px-3 py-2 rounded-lg outline-none">
              <option value="">All Batches</option>
              {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-white/5 border border-white/10 text-white text-sm px-3 py-2 rounded-lg outline-none">
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)} className="bg-white/5 border border-white/10 text-white text-sm px-3 py-2 rounded-lg outline-none">
              <option value="">All Levels</option>
              {CHESS_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            {activeFilters > 0 && (
              <button onClick={() => { setFilterBatch(""); setFilterStatus(""); setFilterLevel(""); }} className="text-xs text-red-400 hover:text-red-300 px-3 py-2">Clear All</button>
            )}
          </div>
        )}
      </div>

      {/* Student Table */}
      <div className="bg-[#16161a] border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 text-left">
                <th className="py-3 px-4 text-gray-500 text-xs font-medium">Student</th>
                <th className="py-3 px-4 text-gray-500 text-xs font-medium hidden md:table-cell">Contact</th>
                <th className="py-3 px-4 text-gray-500 text-xs font-medium hidden lg:table-cell">Batch</th>
                <th className="py-3 px-4 text-gray-500 text-xs font-medium">Level</th>
                <th className="py-3 px-4 text-gray-500 text-xs font-medium">Status</th>
                <th className="py-3 px-4 text-gray-500 text-xs font-medium w-20">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {s.photo_url ? (
                        <img src={`${process.env.REACT_APP_BACKEND_URL}${s.photo_url}`} alt="" className="w-9 h-9 rounded-full object-cover border border-white/10" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-400 text-sm font-bold">{s.full_name.charAt(0)}</div>
                      )}
                      <div>
                        <div className="text-white text-sm font-medium">{s.full_name}</div>
                        <div className="text-gray-500 text-xs">{s.age_group} yrs {s.parent_name && `· ${s.parent_name}`}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <div className="text-gray-400 text-xs">{s.email}</div>
                    <div className="text-gray-500 text-xs">{s.country_code} {s.phone}</div>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-gray-300 text-xs">{batchMap[s.batch_id] || "—"}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded ${LEVEL_COLORS[s.chess_level] || "bg-gray-500/15 text-gray-400"}`}>{s.chess_level}</span>
                  </td>
                  <td className="py-3 px-4">
                    <button onClick={() => handleToggleStatus(s)} className={`text-xs px-2.5 py-1 rounded-full transition-colors ${s.status === "Active" ? "bg-green-500/15 text-green-400 hover:bg-green-500/25" : "bg-red-500/15 text-red-400 hover:bg-red-500/25"}`}>
                      {s.status}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      <button onClick={() => navigate(`/portal/students/${s.id}`)} className="p-1.5 text-gray-500 hover:text-blue-400 rounded transition-colors" title="View Profile"><Eye size={14} /></button>
                      <button onClick={() => openEdit(s)} className="p-1.5 text-gray-500 hover:text-amber-400 rounded transition-colors"><Pencil size={14} /></button>
                      <button onClick={() => handleDelete(s)} className="p-1.5 text-gray-500 hover:text-red-400 rounded transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {students.length === 0 && (
          <div className="text-center py-16 text-gray-500 text-sm">No students found. {search || activeFilters ? "Try adjusting your filters." : "Add your first student to get started."}</div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#16161a] border-white/10 text-white max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">{editing ? "Edit Student" : "Add Student"}</DialogTitle>
            <DialogDescription className="text-gray-500">{editing ? "Update student details" : "Register a new student"}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Photo Upload */}
            <div className="flex items-center gap-4">
              {(photoFile || editing?.photo_url) ? (
                <div className="relative">
                  <img
                    src={photoFile ? URL.createObjectURL(photoFile) : `${process.env.REACT_APP_BACKEND_URL}${editing.photo_url}`}
                    alt="" className="w-16 h-16 rounded-full object-cover border-2 border-amber-500/30"
                  />
                  <button onClick={() => setPhotoFile(null)} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"><X size={10} /></button>
                </div>
              ) : (
                <label className="w-16 h-16 rounded-full bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center cursor-pointer hover:border-amber-500/30 transition-colors">
                  <Upload size={18} className="text-gray-500" />
                  <input type="file" accept="image/*" className="hidden" onChange={e => setPhotoFile(e.target.files?.[0] || null)} />
                </label>
              )}
              <div className="text-sm text-gray-500">Upload profile photo (optional)</div>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Full Name *</label>
              <input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} data-testid="student-name-input" className="w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-lg outline-none focus:border-amber-500 text-sm" placeholder="Student full name" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Age Group</label>
                <select value={form.age_group} onChange={e => setForm({ ...form, age_group: e.target.value })} className="w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-lg outline-none focus:border-amber-500 text-sm">
                  {AGE_GROUPS.map(ag => <option key={ag} value={ag}>{ag}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Date of Birth</label>
                <input type="date" value={form.date_of_birth} onChange={e => setForm({ ...form, date_of_birth: e.target.value })} className="w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-lg outline-none focus:border-amber-500 text-sm" />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-lg outline-none focus:border-amber-500 text-sm" placeholder="student@email.com" />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Phone Number</label>
              <div className="flex gap-2">
                <select value={form.country_code} onChange={e => setForm({ ...form, country_code: e.target.value })} className="bg-white/5 border border-white/10 text-white px-3 py-2.5 rounded-lg outline-none focus:border-amber-500 text-sm w-24">
                  {COUNTRY_CODES.map(cc => <option key={cc} value={cc}>{cc}</option>)}
                </select>
                <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="flex-1 bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-lg outline-none focus:border-amber-500 text-sm" placeholder="Phone number" />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Parent / Guardian Name</label>
              <input value={form.parent_name} onChange={e => setForm({ ...form, parent_name: e.target.value })} className="w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-lg outline-none focus:border-amber-500 text-sm" placeholder="Parent name" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Batch</label>
                <select value={form.batch_id} onChange={e => setForm({ ...form, batch_id: e.target.value })} className="w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-lg outline-none focus:border-amber-500 text-sm">
                  <option value="">No Batch</option>
                  {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Joining Date</label>
                <input type="date" value={form.joining_date} onChange={e => setForm({ ...form, joining_date: e.target.value })} className="w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-lg outline-none focus:border-amber-500 text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Chess Level</label>
                <select value={form.chess_level} onChange={e => setForm({ ...form, chess_level: e.target.value })} className="w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-lg outline-none focus:border-amber-500 text-sm">
                  {CHESS_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Fee per 8-session block (INR)</label>
                <input type="number" min="0" value={form.fee_per_block} onChange={e => setForm({ ...form, fee_per_block: parseFloat(e.target.value) || 0 })} className="w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-lg outline-none focus:border-amber-500 text-sm" />
              </div>
            </div>

            <button onClick={handleSave} data-testid="save-student-btn" className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-3 rounded-lg transition-colors">
              {editing ? "Update Student" : "Add Student"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Upload Dialog */}
      <Dialog open={bulkDialog} onOpenChange={setBulkDialog}>
        <DialogContent className="bg-[#16161a] border-white/10 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Bulk Upload Students</DialogTitle>
            <DialogDescription className="text-gray-500">Import students from an Excel file</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 mt-4">
            {/* Step 1: Download Template */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white text-sm font-medium">Step 1: Download Template</h4>
                  <p className="text-gray-500 text-xs mt-1">Get the Excel template with proper headers and instructions</p>
                </div>
                <button onClick={handleDownloadTemplate} data-testid="download-template-btn" className="flex items-center gap-2 px-4 py-2 bg-amber-500/15 text-amber-400 text-sm rounded-lg hover:bg-amber-500/25 border border-amber-500/20">
                  <Download size={14} /> Template
                </button>
              </div>
            </div>

            {/* Step 2: Upload */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h4 className="text-white text-sm font-medium mb-3">Step 2: Upload Filled File</h4>
              {bulkFile ? (
                <div className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet size={20} className="text-green-400" />
                    <div>
                      <div className="text-white text-sm">{bulkFile.name}</div>
                      <div className="text-gray-500 text-xs">{(bulkFile.size / 1024).toFixed(1)} KB</div>
                    </div>
                  </div>
                  <button onClick={() => { setBulkFile(null); setBulkResult(null); }} className="text-gray-500 hover:text-red-400"><X size={16} /></button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 py-8 border-2 border-dashed border-white/10 rounded-lg cursor-pointer hover:border-amber-500/30 transition-colors">
                  <Upload size={24} className="text-gray-500" />
                  <span className="text-gray-400 text-sm">Click to select .xlsx file</span>
                  <input type="file" accept=".xlsx,.xls" className="hidden" onChange={e => setBulkFile(e.target.files?.[0] || null)} />
                </label>
              )}
            </div>

            {/* Upload Button */}
            <button onClick={handleBulkUpload} disabled={!bulkFile || bulkUploading} data-testid="bulk-upload-submit" className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-3 rounded-lg transition-colors disabled:opacity-40 flex items-center justify-center gap-2">
              {bulkUploading ? (
                <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> Importing...</>
              ) : (
                <><Upload size={16} /> Import Students</>
              )}
            </button>

            {/* Results */}
            {bulkResult && (
              <div className="space-y-3">
                {bulkResult.created_count > 0 && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                    <p className="text-green-400 text-sm font-medium">{bulkResult.created_count} students imported successfully</p>
                    <div className="text-green-400/70 text-xs mt-1 max-h-24 overflow-y-auto">
                      {bulkResult.created_names.join(", ")}
                    </div>
                  </div>
                )}
                {bulkResult.error_count > 0 && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <p className="text-red-400 text-sm font-medium">{bulkResult.error_count} errors found</p>
                    <div className="text-red-400/70 text-xs mt-1 space-y-0.5 max-h-24 overflow-y-auto">
                      {bulkResult.errors.map((err, i) => <div key={`err-${i}`}>{err}</div>)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
