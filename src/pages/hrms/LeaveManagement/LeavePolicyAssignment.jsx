import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Loader2, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { leaveManagementService } from "../../../service";
import useAsyncAction from "../../../hooks/useAsyncAction";

const EMPTY_FORM = { empId: "", policyId: "", effectiveDate: "" };

const LeavePolicyAssignment = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState(null);
  const [error, setError] = useState("");
  const { activeKey, isLoading, run } = useAsyncAction();

  const loadData = async () => {
    const [assignmentsRes, optionsRes] = await Promise.all([
      leaveManagementService.getAssignments(),
      leaveManagementService.getOptions(),
    ]);
    if (assignmentsRes.success) setAssignments(assignmentsRes.data || []);
    else setError(assignmentsRes.message || "Failed to load assignments");
    if (optionsRes.success) {
      setEmployees(optionsRes.data?.employees || []);
      setPolicies(optionsRes.data?.policies || []);
      setDepartments(optionsRes.data?.departments || []);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return assignments.filter((item) => {
      const matchDept = filterDept === "All" || String(item.departmentId) === filterDept;
      const matchSearch =
        !q ||
        item.employee?.toLowerCase().includes(q) ||
        item.policy?.toLowerCase().includes(q);
      return matchDept && matchSearch;
    });
  }, [assignments, filterDept, search]);

  const openAdd = () => {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item.id);
    setForm({
      empId: String(item.empId),
      policyId: String(item.policyId),
      effectiveDate: item.effectiveDate || "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    const payload = {
      empId: Number(form.empId),
      policyId: Number(form.policyId),
      effectiveDate: form.effectiveDate,
    };
    const actionKey = editItem ? `save-${editItem}` : "save-new";
    const res = await run(
      () =>
        editItem
          ? leaveManagementService.updateAssignment(editItem, payload)
          : leaveManagementService.createAssignment(payload),
      actionKey,
    );
    if (!res) return;
    if (!res.success) {
      setError(res.message || "Failed to save assignment");
      return;
    }
    setShowModal(false);
    loadData();
  };

  const handleDelete = async () => {
    const res = await run(
      () => leaveManagementService.deleteAssignment(deleteId),
      `delete-${deleteId}`,
    );
    if (!res) return;
    if (!res.success) {
      setError(res.message || "Failed to remove assignment");
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
        <span className="text-[#6B7280]">Leave Policy Assignment</span>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-4 mb-5">
        <div>
          <h1 className="text-[20px] font-semibold text-[#494949]">Leave Policy Assignment</h1>
          <p className="text-sm text-gray-400 mt-0.5">Assign leave policies to employees</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#7D1EDB] text-white font-medium hover:bg-purple-700 px-5 py-2.5 rounded-full text-sm">
          <Plus size={16} /> Assign Policy
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search employee..." className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#7D1EDB]" />
        </div>
        <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#7D1EDB]">
          <option value="All">All Departments</option>
          {departments.map((dept) => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
        </select>
      </div>

      {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      <div className="flex-1 overflow-auto border border-[#CECECE] rounded-lg">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-white">
            <tr className="border-b border-[#CECECE] text-left">
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Employee</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Department</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Policy Assigned</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Effective Date</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Status</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="py-12 text-center text-gray-400 text-sm">No assignments found</td></tr>
            ) : filtered.map((item) => (
              <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-5">
                  <p className="text-sm font-medium text-[#1E1E1E]">{item.employee}</p>
                  <p className="text-xs text-gray-400">{item.empEmail}</p>
                </td>
                <td className="py-3 px-5">{item.department || "—"}</td>
                <td className="py-3 px-5">{item.policy}</td>
                <td className="py-3 px-5 text-sm text-gray-600">{fmt(item.effectiveDate)}</td>
                <td className="py-3 px-5 text-sm text-gray-600">{item.isActive ? "Active" : "Inactive"}</td>
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
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-[#494949]">{editItem ? "Edit Assignment" : "Assign Policy"}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <select value={form.empId} onChange={(e) => setForm((prev) => ({ ...prev, empId: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#7D1EDB]">
                <option value="">Select employee</option>
                {employees.map((emp) => <option key={emp.empId} value={emp.empId}>{emp.empName}</option>)}
              </select>
              <select value={form.policyId} onChange={(e) => setForm((prev) => ({ ...prev, policyId: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#7D1EDB]">
                <option value="">Select policy</option>
                {policies.map((policy) => <option key={policy.id} value={policy.id}>{policy.name}</option>)}
              </select>
              <input type="date" value={form.effectiveDate} onChange={(e) => setForm((prev) => ({ ...prev, effectiveDate: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#7D1EDB]" />
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowModal(false)} className="px-5 py-2 text-sm border border-gray-200 rounded-full hover:bg-gray-50">Cancel</button>
              <button
                onClick={handleSave}
                disabled={isLoading || !form.empId || !form.policyId || !form.effectiveDate}
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
            <h3 className="text-base font-semibold mb-2">Remove Assignment?</h3>
            <p className="text-sm text-gray-400 mb-5">The employee will lose their current policy assignment.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteId(null)} className="px-5 py-2 text-sm border border-gray-200 rounded-full">Cancel</button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="px-5 py-2 text-sm bg-red-500 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="inline-flex items-center gap-2">
                  {activeKey === `delete-${deleteId}` && <Loader2 size={14} className="animate-spin" />}
                  {activeKey === `delete-${deleteId}` ? "Removing..." : "Remove"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeavePolicyAssignment;
