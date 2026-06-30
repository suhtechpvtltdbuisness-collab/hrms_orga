import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Loader2, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { leaveManagementService } from "../../../service";
import useAsyncAction from "../../../hooks/useAsyncAction";

const EMPTY_FORM = {
  name: "",
  maxDays: "",
  carryForward: false,
  encashable: false,
  isPaid: true,
  allowHalfDay: true,
  description: "",
};

const Toggle = ({ value, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!value)}
    className={`relative w-10 h-5 rounded-full ${value ? "bg-[#7D1EDB]" : "bg-gray-200"}`}
  >
    <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${value ? "translate-x-5" : ""}`} />
  </button>
);

const LeaveType = () => {
  const navigate = useNavigate();
  const [types, setTypes] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState(null);
  const [error, setError] = useState("");
  const { activeKey, isLoading, run } = useAsyncAction();

  const loadTypes = async () => {
    const res = await leaveManagementService.getLeaveTypes();
    if (res.success) {
      setTypes(res.data || []);
      setError("");
    } else {
      setError(res.message || "Failed to load leave types");
    }
  };

  useEffect(() => {
    loadTypes();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return types.filter((item) => !q || item.name?.toLowerCase().includes(q));
  }, [types, search]);

  const openAdd = () => {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item.id);
    setForm({
      name: item.name || "",
      maxDays: item.maxDays ?? "",
      carryForward: item.carryForward ?? false,
      encashable: item.encashable ?? false,
      isPaid: item.isPaid ?? true,
      allowHalfDay: item.allowHalfDay ?? true,
      description: item.description || "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    const payload = { ...form, maxDays: Number(form.maxDays) || 0 };
    const actionKey = editItem ? `save-${editItem}` : "save-new";
    const res = await run(
      () =>
        editItem
          ? leaveManagementService.updateLeaveType(editItem, payload)
          : leaveManagementService.createLeaveType(payload),
      actionKey,
    );
    if (!res) return;
    if (!res.success) {
      setError(res.message || "Failed to save leave type");
      return;
    }
    setShowModal(false);
    loadTypes();
  };

  const handleDelete = async () => {
    const res = await run(
      () => leaveManagementService.deleteLeaveType(deleteId),
      `delete-${deleteId}`,
    );
    if (!res) return;
    if (!res.success) {
      setError(res.message || "Failed to delete leave type");
      return;
    }
    setDeleteId(null);
    loadTypes();
  };

  return (
    <div className="bg-white px-4 sm:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl min-h-[calc(100vh-10rem)] flex flex-col" style={{ fontFamily: "Poppins, sans-serif" }}>
      <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
        <span className="cursor-pointer text-[#7D1EDB]" onClick={() => navigate("/hrms")}>HRMS Dashboard</span>
        <ChevronRight size={14} />
        <span className="text-[#6B7280]">Leave Type</span>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-4 mb-5">
        <div>
          <h1 className="text-[20px] font-semibold text-[#494949]">Leave Types</h1>
          <p className="text-sm text-gray-400 mt-0.5">Configure leave types for your organization</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#7D1EDB] text-white font-medium hover:bg-purple-700 px-5 py-2.5 rounded-full text-sm">
          <Plus size={16} /> Add Leave Type
        </button>
      </div>

      <div className="relative mb-4 max-w-xs">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search leave type..." className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#7D1EDB]" />
      </div>

      {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

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
            ) : filtered.map((item) => (
              <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 px-5 text-sm font-semibold text-[#1E1E1E]">{item.name}</td>
                <td className="py-3 px-5 text-sm text-gray-600">{item.maxDays === 0 ? "Unlimited" : `${item.maxDays} days`}</td>
                <td className="py-3 px-5 text-sm text-gray-600">{item.carryForward ? "Yes" : "No"}</td>
                <td className="py-3 px-5 text-sm text-gray-600">{item.encashable ? "Yes" : "No"}</td>
                <td className="py-3 px-5 text-sm text-gray-600">{item.isPaid ? "Paid" : "Unpaid"}</td>
                <td className="py-3 px-5 text-sm text-gray-600">{item.allowHalfDay ? "Allowed" : "No"}</td>
                <td className="py-3 px-5 text-sm text-gray-400 max-w-[180px] truncate">{item.description || "—"}</td>
                <td className="py-3 px-5">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-purple-50 text-[#7D1EDB]"><Pencil size={15} /></button>
                    <button onClick={() => setDeleteId(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-[#494949]">{editItem ? "Edit Leave Type" : "Add Leave Type"}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Leave Type Name" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#7D1EDB]" />
              <input type="number" min="0" value={form.maxDays} onChange={(e) => setForm((prev) => ({ ...prev, maxDays: e.target.value }))} placeholder="Max Days per Year" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#7D1EDB]" />
              <div className="grid grid-cols-2 gap-4">
                {[
                  ["Carry Forward", "carryForward"],
                  ["Encashable", "encashable"],
                  ["Paid Leave", "isPaid"],
                  ["Allow Half Day", "allowHalfDay"],
                ].map(([label, key]) => (
                  <div key={key} className="flex items-center justify-between border border-gray-100 rounded-xl p-3">
                    <span className="text-sm text-gray-700">{label}</span>
                    <Toggle value={form[key]} onChange={(value) => setForm((prev) => ({ ...prev, [key]: value }))} />
                  </div>
                ))}
              </div>
              <textarea value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} rows={2} placeholder="Description" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#7D1EDB] resize-none" />
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowModal(false)} className="px-5 py-2 text-sm border border-gray-200 rounded-full hover:bg-gray-50">Cancel</button>
              <button
                onClick={handleSave}
                disabled={isLoading || !form.name}
                className="px-5 py-2 text-sm bg-[#7D1EDB] text-white rounded-full hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="inline-flex items-center gap-2">
                  {activeKey?.startsWith("save-") && <Loader2 size={14} className="animate-spin" />}
                  {activeKey?.startsWith("save-") ? "Saving..." : "Save"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><Trash2 size={22} className="text-red-500" /></div>
            <h3 className="text-base font-semibold mb-2">Delete Leave Type?</h3>
            <p className="text-sm text-gray-400 mb-5">Policies using this type must be updated first.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteId(null)} className="px-5 py-2 text-sm border border-gray-200 rounded-full">Cancel</button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="px-5 py-2 text-sm bg-red-500 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="inline-flex items-center gap-2">
                  {activeKey === `delete-${deleteId}` && <Loader2 size={14} className="animate-spin" />}
                  {activeKey === `delete-${deleteId}` ? "Deleting..." : "Delete"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveType;
