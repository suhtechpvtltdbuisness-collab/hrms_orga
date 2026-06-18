import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Plus, Pencil, Trash2, X, Search, Ban } from "lucide-react";

const INITIAL_BLOCKS = [
  { id: 1, name: "Year End Freeze", fromDate: "2025-12-20", toDate: "2025-12-31", departments: ["All"], reason: "Year-end financial closing" },
  { id: 2, name: "Product Launch Week", fromDate: "2026-03-01", toDate: "2026-03-07", departments: ["Engineering", "Product Design"], reason: "Critical product launch" },
  { id: 3, name: "Audit Period", fromDate: "2026-04-01", toDate: "2026-04-05", departments: ["Finance", "HR"], reason: "Annual audit" },
];

const ALL_DEPARTMENTS = ["All", "Engineering", "Product Design", "Marketing", "Sales", "HR", "Finance"];
const EMPTY_FORM = { name: "", fromDate: "", toDate: "", departments: ["All"], reason: "" };

const LeaveBlockList = () => {
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState(INITIAL_BLOCKS);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState(null);

  const filtered = blocks.filter(b => !search || b.name.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setForm(EMPTY_FORM); setEditItem(null); setShowModal(true); };
  const openEdit = (b) => {
    setForm({ name: b.name, fromDate: b.fromDate, toDate: b.toDate, departments: [...b.departments], reason: b.reason });
    setEditItem(b.id);
    setShowModal(true);
  };

  const toggleDept = (dept) => {
    if (dept === "All") { setForm({ ...form, departments: ["All"] }); return; }
    const existing = form.departments.filter(d => d !== "All");
    if (existing.includes(dept)) {
      const updated = existing.filter(d => d !== dept);
      setForm({ ...form, departments: updated.length ? updated : ["All"] });
    } else {
      setForm({ ...form, departments: [...existing, dept] });
    }
  };

  const handleSave = () => {
    if (!form.name || !form.fromDate || !form.toDate) return;
    if (editItem) {
      setBlocks(blocks.map(b => b.id === editItem ? { ...b, ...form } : b));
    } else {
      setBlocks([...blocks, { id: Date.now(), ...form }]);
    }
    setShowModal(false);
  };

  const handleDelete = () => { setBlocks(blocks.filter(b => b.id !== deleteId)); setDeleteId(null); };

  const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  return (
    <div className="bg-white px-4 sm:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl min-h-[calc(100vh-10rem)] flex flex-col" style={{ fontFamily: "Poppins, sans-serif" }}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
        <span className="cursor-pointer text-[#7D1EDB]" onClick={() => navigate("/hrms")}>HRMS Dashboard</span>
        <ChevronRight size={14} />
        <span className="text-[#6B7280]">Leave Block List</span>
      </div>

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-5">
        <div>
          <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Leave Block List</h1>
          <p className="text-sm text-gray-400 mt-0.5">Dates when leaves cannot be applied</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#7D1EDB] text-white font-medium hover:bg-purple-700 px-5 py-2.5 rounded-full text-sm">
          <Plus size={16} /> Add Block Period
        </button>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5">
        <Ban size={18} className="text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-700">During block periods, employees cannot apply for leave. Existing approved leaves remain unaffected.</p>
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-xs">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search block..." className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#7D1EDB]" />
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto border border-[#CECECE] rounded-lg">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-white">
            <tr className="border-b border-[#CECECE] text-left">
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Sr No.</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Block Name</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">From Date</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">To Date</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Departments</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Reason</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="py-12 text-center text-gray-400 text-sm">No block periods found</td></tr>
            ) : filtered.map((b, idx) => (
              <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-5 text-sm text-gray-500">{idx + 1}</td>
                <td className="py-3 px-5 text-sm font-medium text-[#1E1E1E]">{b.name}</td>
                <td className="py-3 px-5 text-sm text-gray-600">{fmt(b.fromDate)}</td>
                <td className="py-3 px-5 text-sm text-gray-600">{fmt(b.toDate)}</td>
                <td className="py-3 px-5">
                  <div className="flex flex-wrap gap-1">
                    {b.departments.map(d => (
                      <span key={d} className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded-full">{d}</span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-5 text-sm text-gray-400 max-w-[180px] truncate">{b.reason || "—"}</td>
                <td className="py-3 px-5">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(b)} className="p-1.5 rounded-lg hover:bg-purple-50 text-[#7D1EDB]"><Pencil size={15} /></button>
                    <button onClick={() => setDeleteId(b.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-[#494949]">{editItem ? "Edit Block Period" : "Add Block Period"}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Block Name *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Year End Freeze" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#7D1EDB]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From Date *</label>
                  <input type="date" value={form.fromDate} onChange={e => setForm({ ...form, fromDate: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#7D1EDB]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To Date *</label>
                  <input type="date" value={form.toDate} onChange={e => setForm({ ...form, toDate: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#7D1EDB]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Departments</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_DEPARTMENTS.map(d => (
                    <button key={d} type="button" onClick={() => toggleDept(d)}
                      className={`px-3 py-1 rounded-full text-xs border transition-all ${form.departments.includes(d) ? "bg-[#7D1EDB] text-white border-[#7D1EDB]" : "border-gray-200 text-gray-600 hover:border-[#7D1EDB]"}`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} rows={2} placeholder="Reason for block..." className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#7D1EDB] resize-none" />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowModal(false)} className="px-5 py-2 text-sm border border-gray-200 rounded-full hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={!form.name || !form.fromDate || !form.toDate} className="px-5 py-2 text-sm bg-[#7D1EDB] text-white rounded-full hover:bg-purple-700 disabled:opacity-50">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><Trash2 size={22} className="text-red-500" /></div>
            <h3 className="text-base font-semibold text-[#494949] mb-2">Delete Block Period?</h3>
            <p className="text-sm text-gray-400 mb-5">This cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteId(null)} className="px-5 py-2 text-sm border border-gray-200 rounded-full">Cancel</button>
              <button onClick={handleDelete} className="px-5 py-2 text-sm bg-red-500 text-white rounded-full hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveBlockList;
