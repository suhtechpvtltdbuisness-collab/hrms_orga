import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Plus, Pencil, Trash2, X, Search, ToggleLeft, ToggleRight } from "lucide-react";

const INITIAL_TYPES = [
  { id: 1, name: "Sick Leave", maxDays: 10, carryForward: false, encashable: false, isPaid: true, allowHalfDay: true, description: "For medical emergencies" },
  { id: 2, name: "Casual Leave", maxDays: 12, carryForward: false, encashable: false, isPaid: true, allowHalfDay: true, description: "For personal work" },
  { id: 3, name: "Earned Leave", maxDays: 15, carryForward: true, encashable: true, isPaid: true, allowHalfDay: true, description: "Accumulated leave" },
  { id: 4, name: "Maternity Leave", maxDays: 180, carryForward: false, encashable: false, isPaid: true, allowHalfDay: false, description: "As per Maternity Benefit Act" },
  { id: 5, name: "Paternity Leave", maxDays: 15, carryForward: false, encashable: false, isPaid: true, allowHalfDay: false, description: "For new fathers" },
  { id: 6, name: "Loss of Pay", maxDays: 0, carryForward: false, encashable: false, isPaid: false, allowHalfDay: true, description: "Unpaid leave when balance is zero" },
];

const EMPTY_FORM = { name: "", maxDays: "", carryForward: false, encashable: false, isPaid: true, allowHalfDay: true, description: "" };

const Toggle = ({ value, onChange, id }) => (
  <button id={id} type="button" onClick={() => onChange(!value)}
    className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${value ? "bg-[#7D1EDB]" : "bg-gray-200"}`}>
    <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${value ? "translate-x-5" : "translate-x-0"}`} />
  </button>
);

const LeaveType = () => {
  const navigate = useNavigate();
  const [types, setTypes] = useState(INITIAL_TYPES);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState(null);

  const filtered = types.filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setForm(EMPTY_FORM); setEditItem(null); setShowModal(true); };
  const openEdit = (t) => {
    setForm({ name: t.name, maxDays: t.maxDays, carryForward: t.carryForward, encashable: t.encashable, isPaid: t.isPaid, allowHalfDay: t.allowHalfDay, description: t.description });
    setEditItem(t.id); setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name) return;
    const data = { ...form, maxDays: Number(form.maxDays) || 0 };
    if (editItem) setTypes(types.map(t => t.id === editItem ? { ...t, ...data } : t));
    else setTypes([...types, { id: Date.now(), ...data }]);
    setShowModal(false);
  };

  const handleDelete = () => { setTypes(types.filter(t => t.id !== deleteId)); setDeleteId(null); };

  return (
    <div className="bg-white px-4 sm:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl min-h-[calc(100vh-10rem)] flex flex-col" style={{ fontFamily: "Poppins, sans-serif" }}>
      <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
        <span className="cursor-pointer text-[#7D1EDB]" onClick={() => navigate("/hrms")}>HRMS Dashboard</span>
        <ChevronRight size={14} />
        <span className="text-[#6B7280]">Leave Type</span>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-4 mb-5">
        <div>
          <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Leave Types</h1>
          <p className="text-sm text-gray-400 mt-0.5">Configure all leave types for your organization</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#7D1EDB] text-white font-medium hover:bg-purple-700 px-5 py-2.5 rounded-full text-sm">
          <Plus size={16} /> Add Leave Type
        </button>
      </div>

      <div className="relative mb-4 max-w-xs">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leave type..." className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#7D1EDB]" />
      </div>

      <div className="flex-1 overflow-auto border border-[#CECECE] rounded-lg">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-white">
            <tr className="border-b border-[#CECECE] text-left">
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Leave Type</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Max Days/Year</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Carry Forward</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Encashable</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Paid</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Half Day</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Description</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="py-12 text-center text-gray-400 text-sm">No leave types found</td></tr>
            ) : filtered.map(t => (
              <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-5">
                  <span className="text-sm font-semibold text-[#1E1E1E]">{t.name}</span>
                </td>
                <td className="py-3 px-5 text-sm text-gray-600">{t.maxDays === 0 ? "Unlimited" : `${t.maxDays} days`}</td>
                <td className="py-3 px-5">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${t.carryForward ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {t.carryForward ? "Yes" : "No"}
                  </span>
                </td>
                <td className="py-3 px-5">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${t.encashable ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}>
                    {t.encashable ? "Yes" : "No"}
                  </span>
                </td>
                <td className="py-3 px-5">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${t.isPaid ? "bg-purple-100 text-purple-700" : "bg-red-100 text-red-600"}`}>
                    {t.isPaid ? "Paid" : "Unpaid"}
                  </span>
                </td>
                <td className="py-3 px-5">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${t.allowHalfDay ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {t.allowHalfDay ? "Allowed" : "No"}
                  </span>
                </td>
                <td className="py-3 px-5 text-sm text-gray-400 max-w-[180px] truncate">{t.description || "—"}</td>
                <td className="py-3 px-5">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg hover:bg-purple-50 text-[#7D1EDB]"><Pencil size={15} /></button>
                    <button onClick={() => setDeleteId(t.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={15} /></button>
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
              <h3 className="text-lg font-semibold text-[#494949]">{editItem ? "Edit Leave Type" : "Add Leave Type"}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type Name *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Sick Leave" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#7D1EDB]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Days per Year <span className="text-gray-400">(0 = unlimited)</span></label>
                <input type="number" min="0" value={form.maxDays} onChange={e => setForm({ ...form, maxDays: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#7D1EDB]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Carry Forward", key: "carryForward" },
                  { label: "Encashable", key: "encashable" },
                  { label: "Paid Leave", key: "isPaid" },
                  { label: "Allow Half Day", key: "allowHalfDay" },
                ].map(({ label, key }) => (
                  <div key={key} className="flex items-center justify-between border border-gray-100 rounded-xl p-3">
                    <span className="text-sm text-gray-700">{label}</span>
                    <Toggle value={form[key]} onChange={v => setForm({ ...form, [key]: v })} />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#7D1EDB] resize-none" />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowModal(false)} className="px-5 py-2 text-sm border border-gray-200 rounded-full hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={!form.name} className="px-5 py-2 text-sm bg-[#7D1EDB] text-white rounded-full hover:bg-purple-700 disabled:opacity-50">Save</button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><Trash2 size={22} className="text-red-500" /></div>
            <h3 className="text-base font-semibold mb-2">Delete Leave Type?</h3>
            <p className="text-sm text-gray-400 mb-5">Employees using this type may be affected.</p>
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

export default LeaveType;
