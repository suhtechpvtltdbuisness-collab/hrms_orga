import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Plus, Pencil, Trash2, X, Search, FileText } from "lucide-react";

const LEAVE_TYPES = ["Sick Leave", "Casual Leave", "Earned Leave", "Maternity Leave", "Paternity Leave"];

const INITIAL_POLICIES = [
  {
    id: 1, name: "Standard Policy", description: "Default policy for all full-time employees",
    leaveTypes: ["Sick Leave", "Casual Leave", "Earned Leave"],
    applicableTo: "All Employees", isDefault: true,
  },
  {
    id: 2, name: "Senior Staff Policy", description: "Enhanced benefits for senior employees (5+ years)",
    leaveTypes: ["Sick Leave", "Casual Leave", "Earned Leave", "Paternity Leave"],
    applicableTo: "Senior Staff", isDefault: false,
  },
  {
    id: 3, name: "Probation Policy", description: "Restricted leave for employees in probation period",
    leaveTypes: ["Sick Leave", "Casual Leave"],
    applicableTo: "Probation Employees", isDefault: false,
  },
  {
    id: 4, name: "Contract Policy", description: "Leave benefits for contract employees",
    leaveTypes: ["Sick Leave"],
    applicableTo: "Contract Staff", isDefault: false,
  },
];

const APPLICABLE_OPTIONS = ["All Employees", "Senior Staff", "Probation Employees", "Contract Staff", "Management"];
const EMPTY_FORM = { name: "", description: "", leaveTypes: [], applicableTo: "", isDefault: false };

const TYPE_COLORS = ["bg-purple-100 text-purple-700", "bg-blue-100 text-blue-700", "bg-green-100 text-green-700", "bg-amber-100 text-amber-700", "bg-pink-100 text-pink-700"];

const LeavePolicy = () => {
  const navigate = useNavigate();
  const [policies, setPolicies] = useState(INITIAL_POLICIES);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState(null);

  const filtered = policies.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setForm(EMPTY_FORM); setEditItem(null); setShowModal(true); };
  const openEdit = (p) => {
    setForm({ name: p.name, description: p.description, leaveTypes: [...p.leaveTypes], applicableTo: p.applicableTo, isDefault: p.isDefault });
    setEditItem(p.id); setShowModal(true);
  };

  const toggleLeaveType = (lt) => {
    const existing = form.leaveTypes;
    if (existing.includes(lt)) setForm({ ...form, leaveTypes: existing.filter(t => t !== lt) });
    else setForm({ ...form, leaveTypes: [...existing, lt] });
  };

  const handleSave = () => {
    if (!form.name || form.leaveTypes.length === 0) return;
    if (editItem) setPolicies(policies.map(p => p.id === editItem ? { ...p, ...form } : p));
    else setPolicies([...policies, { id: Date.now(), ...form }]);
    setShowModal(false);
  };

  const handleDelete = () => { setPolicies(policies.filter(p => p.id !== deleteId)); setDeleteId(null); };

  return (
    <div className="bg-white px-4 sm:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl min-h-[calc(100vh-10rem)] flex flex-col" style={{ fontFamily: "Poppins, sans-serif" }}>
      <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
        <span className="cursor-pointer text-[#7D1EDB]" onClick={() => navigate("/hrms")}>HRMS Dashboard</span>
        <ChevronRight size={14} />
        <span className="text-[#6B7280]">Leave Policy</span>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-4 mb-5">
        <div>
          <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Leave Policies</h1>
          <p className="text-sm text-gray-400 mt-0.5">Define leave policies bundling multiple leave types</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#7D1EDB] text-white font-medium hover:bg-purple-700 px-5 py-2.5 rounded-full text-sm">
          <Plus size={16} /> Create Policy
        </button>
      </div>

      <div className="relative mb-5 max-w-xs">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search policy..." className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#7D1EDB]" />
      </div>

      {/* Policy Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4 flex-1">
        {filtered.map(p => (
          <div key={p.id} className="border border-gray-100 rounded-2xl p-5 hover:border-[#7D1EDB] hover:shadow-sm transition-all relative">
            {p.isDefault && (
              <span className="absolute top-4 right-16 px-2 py-0.5 bg-[#7D1EDB] text-white text-[10px] rounded-full font-medium">DEFAULT</span>
            )}
            <div className="absolute top-3 right-3 flex gap-1">
              <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-purple-50 text-[#7D1EDB]"><Pencil size={14} /></button>
              <button onClick={() => setDeleteId(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={14} /></button>
            </div>

            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                <FileText size={18} className="text-[#7D1EDB]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#1E1E1E] text-base">{p.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{p.applicableTo}</p>
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-4 leading-relaxed">{p.description}</p>

            <div>
              <p className="text-xs font-medium text-gray-400 mb-2">INCLUDED LEAVE TYPES</p>
              <div className="flex flex-wrap gap-1.5">
                {p.leaveTypes.map((lt, i) => (
                  <span key={lt} className={`px-2.5 py-1 text-xs rounded-full font-medium ${TYPE_COLORS[i % TYPE_COLORS.length]}`}>{lt}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-[#494949]">{editItem ? "Edit Policy" : "Create Policy"}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Policy Name *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Standard Policy" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#7D1EDB]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#7D1EDB] resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Leave Types Included *</label>
                <div className="flex flex-wrap gap-2">
                  {LEAVE_TYPES.map(lt => (
                    <button key={lt} type="button" onClick={() => toggleLeaveType(lt)}
                      className={`px-3 py-1.5 rounded-full text-xs border transition-all ${form.leaveTypes.includes(lt) ? "bg-[#7D1EDB] text-white border-[#7D1EDB]" : "border-gray-200 text-gray-600 hover:border-[#7D1EDB]"}`}>
                      {lt}
                    </button>
                  ))}
                </div>
                {form.leaveTypes.length === 0 && <p className="text-xs text-red-400 mt-1">Select at least one leave type</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Applicable To</label>
                <select value={form.applicableTo} onChange={e => setForm({ ...form, applicableTo: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#7D1EDB]">
                  <option value="">Select target group</option>
                  {APPLICABLE_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="isDefault" checked={form.isDefault} onChange={e => setForm({ ...form, isDefault: e.target.checked })} className="w-4 h-4 accent-[#7D1EDB]" />
                <label htmlFor="isDefault" className="text-sm text-gray-700">Set as Default Policy</label>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowModal(false)} className="px-5 py-2 text-sm border border-gray-200 rounded-full hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={!form.name || form.leaveTypes.length === 0} className="px-5 py-2 text-sm bg-[#7D1EDB] text-white rounded-full hover:bg-purple-700 disabled:opacity-50">Save Policy</button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><Trash2 size={22} className="text-red-500" /></div>
            <h3 className="text-base font-semibold mb-2">Delete Policy?</h3>
            <p className="text-sm text-gray-400 mb-5">Employees assigned to this policy will be unassigned.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteId(null)} className="px-5 py-2 text-sm border border-gray-200 rounded-full">Cancel</button>
              <button onClick={handleDelete} className="px-5 py-2 text-sm bg-red-500 text-white rounded-full">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeavePolicy;
