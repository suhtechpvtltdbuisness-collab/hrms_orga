import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Ban, ChevronRight, Loader2, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { leaveManagementService } from "../../../service";
import useAsyncAction from "../../../hooks/useAsyncAction";

const EMPTY_FORM = { name: "", fromDate: "", toDate: "", departmentIds: [], reason: "" };

const LeaveBlockList = () => {
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { activeKey, isLoading, run } = useAsyncAction();

  const loadData = async () => {
    setLoading(true);
    const [blocksRes, optionsRes] = await Promise.all([
      leaveManagementService.getBlocks(),
      leaveManagementService.getOptions(),
    ]);

    if (blocksRes.success) setBlocks(blocksRes.data || []);
    else setError(blocksRes.message || "Failed to load leave blocks");

    if (optionsRes.success) setDepartments(optionsRes.data?.departments || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return blocks.filter((item) => !q || item.name?.toLowerCase().includes(q));
  }, [blocks, search]);

  const openAdd = () => {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item.id);
    setForm({
      name: item.name || "",
      fromDate: item.fromDate || "",
      toDate: item.toDate || "",
      departmentIds: item.departmentIds || [],
      reason: item.reason || "",
    });
    setShowModal(true);
  };

  const toggleDept = (deptId) => {
    setForm((prev) => ({
      ...prev,
      departmentIds: prev.departmentIds.includes(deptId)
        ? prev.departmentIds.filter((id) => id !== deptId)
        : [...prev.departmentIds, deptId],
    }));
  };

  const handleSave = async () => {
    const payload = {
      ...form,
      departmentIds: form.departmentIds,
    };
    const actionKey = editItem ? `save-${editItem}` : "save-new";
    const res = await run(
      () =>
        editItem
          ? leaveManagementService.updateBlock(editItem, payload)
          : leaveManagementService.createBlock(payload),
      actionKey,
    );
    if (!res) return;
    if (!res.success) {
      setError(res.message || "Failed to save leave block");
      return;
    }
    setShowModal(false);
    loadData();
  };

  const handleDelete = async () => {
    const res = await run(
      () => leaveManagementService.deleteBlock(deleteId),
      `delete-${deleteId}`,
    );
    if (!res) return;
    if (!res.success) {
      setError(res.message || "Failed to delete leave block");
      return;
    }
    setDeleteId(null);
    loadData();
  };

  const fmt = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
      : "—";

  return (
    <div className="bg-white px-4 sm:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl min-h-[calc(100vh-10rem)] flex flex-col" style={{ fontFamily: "Poppins, sans-serif" }}>
      <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
        <span className="cursor-pointer text-[#7D1EDB]" onClick={() => navigate("/hrms")}>HRMS Dashboard</span>
        <ChevronRight size={14} />
        <span className="text-[#6B7280]">Leave Block List</span>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-4 mb-5">
        <div>
          <h1 className="text-[20px] font-semibold text-[#494949]">Leave Block List</h1>
          <p className="text-sm text-gray-400 mt-0.5">Dates when leaves cannot be applied</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#7D1EDB] text-white font-medium hover:bg-purple-700 px-5 py-2.5 rounded-full text-sm">
          <Plus size={16} /> Add Block Period
        </button>
      </div>

      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5">
        <Ban size={18} className="text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-700">During block periods, employees cannot apply for leave.</p>
      </div>

      <div className="relative mb-4 max-w-xs">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search block..." className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#7D1EDB]" />
      </div>

      {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

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
            {loading ? (
              <tr><td colSpan={7} className="py-12 text-center text-gray-400 text-sm">Loading blocks...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="py-12 text-center text-gray-400 text-sm">No block periods found</td></tr>
            ) : filtered.map((item, idx) => (
              <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-5 text-sm text-gray-500">{idx + 1}</td>
                <td className="py-3 px-5 text-sm font-medium text-[#1E1E1E]">{item.name}</td>
                <td className="py-3 px-5 text-sm text-gray-600">{fmt(item.fromDate)}</td>
                <td className="py-3 px-5 text-sm text-gray-600">{fmt(item.toDate)}</td>
                <td className="py-3 px-5">
                  <div className="flex flex-wrap gap-1">
                    {(item.departments || ["All"]).map((dept) => (
                      <span key={dept} className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded-full">{dept}</span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-5 text-sm text-gray-400 max-w-[180px] truncate">{item.reason || "—"}</td>
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
              <h3 className="text-lg font-semibold text-[#494949]">{editItem ? "Edit Block Period" : "Add Block Period"}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Block Name *</label>
                <input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#7D1EDB]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="date" value={form.fromDate} onChange={(e) => setForm((prev) => ({ ...prev, fromDate: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#7D1EDB]" />
                <input type="date" value={form.toDate} onChange={(e) => setForm((prev) => ({ ...prev, toDate: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#7D1EDB]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Departments</label>
                <div className="flex flex-wrap gap-2">
                  {departments.map((dept) => (
                    <button key={dept.id} type="button" onClick={() => toggleDept(dept.id)} className={`px-3 py-1 rounded-full text-xs border ${form.departmentIds.includes(dept.id) ? "bg-[#7D1EDB] text-white border-[#7D1EDB]" : "border-gray-200 text-gray-600 hover:border-[#7D1EDB]"}`}>
                      {dept.name}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-gray-400">Leave empty to apply to all departments.</p>
              </div>
              <textarea value={form.reason} onChange={(e) => setForm((prev) => ({ ...prev, reason: e.target.value }))} rows={2} placeholder="Reason for block..." className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#7D1EDB] resize-none" />
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowModal(false)} className="px-5 py-2 text-sm border border-gray-200 rounded-full hover:bg-gray-50">Cancel</button>
              <button
                onClick={handleSave}
                disabled={isLoading || !form.name || !form.fromDate || !form.toDate}
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
            <h3 className="text-base font-semibold text-[#494949] mb-2">Delete Block Period?</h3>
            <p className="text-sm text-gray-400 mb-5">This cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteId(null)} className="px-5 py-2 text-sm border border-gray-200 rounded-full">Cancel</button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="px-5 py-2 text-sm bg-red-500 text-white rounded-full hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default LeaveBlockList;
