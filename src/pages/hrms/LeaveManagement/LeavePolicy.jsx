import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, FileText, Loader2, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { leaveManagementService } from "../../../service";
import useAsyncAction from "../../../hooks/useAsyncAction";

const EMPTY_FORM = { name: "", description: "", leaveTypeIds: [], applicableTo: "", isDefault: false };

const LeavePolicy = () => {
  const navigate = useNavigate();
  const [policies, setPolicies] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState(null);
  const [error, setError] = useState("");
  const { activeKey, isLoading, run } = useAsyncAction();

  const loadData = async () => {
    const [policiesRes, optionsRes] = await Promise.all([
      leaveManagementService.getPolicies(),
      leaveManagementService.getOptions(),
    ]);
    if (policiesRes.success) setPolicies(policiesRes.data || []);
    else setError(policiesRes.message || "Failed to load policies");
    if (optionsRes.success) setLeaveTypes(optionsRes.data?.leaveTypes || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return policies.filter((item) => !q || item.name?.toLowerCase().includes(q));
  }, [policies, search]);

  const openAdd = () => {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item.id);
    setForm({
      name: item.name || "",
      description: item.description || "",
      leaveTypeIds: (item.leaveTypeIds || []).map(Number),
      applicableTo: item.applicableTo || "",
      isDefault: item.isDefault || false,
    });
    setShowModal(true);
  };

  const toggleLeaveType = (id) => {
    setForm((prev) => ({
      ...prev,
      leaveTypeIds: prev.leaveTypeIds.includes(id)
        ? prev.leaveTypeIds.filter((item) => item !== id)
        : [...prev.leaveTypeIds, id],
    }));
  };

  const handleSave = async () => {
    const actionKey = editItem ? `save-${editItem}` : "save-new";
    const res = await run(
      () =>
        editItem
          ? leaveManagementService.updatePolicy(editItem, form)
          : leaveManagementService.createPolicy(form),
      actionKey,
    );
    if (!res) return;
    if (!res.success) {
      setError(res.message || "Failed to save policy");
      return;
    }
    setShowModal(false);
    loadData();
  };

  const handleDelete = async () => {
    const res = await run(
      () => leaveManagementService.deletePolicy(deleteId),
      `delete-${deleteId}`,
    );
    if (!res) return;
    if (!res.success) {
      setError(res.message || "Failed to delete policy");
      return;
    }
    setDeleteId(null);
    loadData();
  };

  return (
    <div className="bg-white px-4 sm:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl min-h-[calc(100vh-10rem)] flex flex-col" style={{ fontFamily: "Poppins, sans-serif" }}>
      <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
        <span className="cursor-pointer text-[#7D1EDB]" onClick={() => navigate("/hrms")}>HRMS Dashboard</span>
        <ChevronRight size={14} />
        <span className="text-[#6B7280]">Leave Policy</span>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-4 mb-5">
        <div>
          <h1 className="text-[20px] font-semibold text-[#494949]">Leave Policies</h1>
          <p className="text-sm text-gray-400 mt-0.5">Define leave policies bundling multiple leave types</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#7D1EDB] text-white font-medium hover:bg-purple-700 px-5 py-2.5 rounded-full text-sm">
          <Plus size={16} /> Create Policy
        </button>
      </div>

      <div className="relative mb-5 max-w-xs">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search policy..." className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#7D1EDB]" />
      </div>

      {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4 flex-1">
        {filtered.map((policy) => (
          <div key={policy.id} className="border border-gray-100 rounded-2xl p-5 hover:border-[#7D1EDB] hover:shadow-sm transition-all relative">
            {policy.isDefault && <span className="absolute top-4 right-16 px-2 py-0.5 bg-[#7D1EDB] text-white text-[10px] rounded-full font-medium">DEFAULT</span>}
            <div className="absolute top-3 right-3 flex gap-1">
              <button onClick={() => openEdit(policy)} className="p-1.5 rounded-lg hover:bg-purple-50 text-[#7D1EDB]"><Pencil size={14} /></button>
              <button onClick={() => setDeleteId(policy.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={14} /></button>
            </div>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                <FileText size={18} className="text-[#7D1EDB]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#1E1E1E] text-base">{policy.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{policy.applicableTo || "General"}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-4 leading-relaxed">{policy.description || "—"}</p>
            <div className="flex flex-wrap gap-1.5">
              {(policy.leaveTypes || []).map((type) => (
                <span key={type.id} className="px-2.5 py-1 text-xs rounded-full font-medium bg-purple-100 text-purple-700">{type.name}</span>
              ))}
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
              <input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Policy Name" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#7D1EDB]" />
              <textarea value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} rows={2} placeholder="Description" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#7D1EDB] resize-none" />
              <div className="flex flex-wrap gap-2">
                {leaveTypes.map((type) => (
                  <button key={type.id} type="button" onClick={() => toggleLeaveType(type.id)} className={`px-3 py-1.5 rounded-full text-xs border ${form.leaveTypeIds.includes(type.id) ? "bg-[#7D1EDB] text-white border-[#7D1EDB]" : "border-gray-200 text-gray-600 hover:border-[#7D1EDB]"}`}>
                    {type.name}
                  </button>
                ))}
              </div>
              <input value={form.applicableTo} onChange={(e) => setForm((prev) => ({ ...prev, applicableTo: e.target.value }))} placeholder="Applicable To" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#7D1EDB]" />
              <label className="flex items-center gap-3 text-sm text-gray-700">
                <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm((prev) => ({ ...prev, isDefault: e.target.checked }))} className="w-4 h-4 accent-[#7D1EDB]" />
                Set as Default Policy
              </label>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowModal(false)} className="px-5 py-2 text-sm border border-gray-200 rounded-full hover:bg-gray-50">Cancel</button>
              <button
                onClick={handleSave}
                disabled={isLoading || !form.name || form.leaveTypeIds.length === 0}
                className="px-5 py-2 text-sm bg-[#7D1EDB] text-white rounded-full hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="inline-flex items-center gap-2">
                  {activeKey?.startsWith("save-") && <Loader2 size={14} className="animate-spin" />}
                  {activeKey?.startsWith("save-") ? "Saving..." : "Save Policy"}
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
            <h3 className="text-base font-semibold mb-2">Delete Policy?</h3>
            <p className="text-sm text-gray-400 mb-5">Assignments using this policy must be removed first.</p>
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

export default LeavePolicy;
