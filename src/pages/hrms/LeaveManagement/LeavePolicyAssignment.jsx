import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Plus, Pencil, Trash2, X, Search, Users } from "lucide-react";

const POLICIES = ["Standard Policy", "Senior Staff Policy", "Probation Policy", "Contract Policy"];
const DEPARTMENTS = ["All", "Engineering", "Product Design", "Marketing", "Sales", "HR", "Finance"];

const INITIAL_ASSIGNMENTS = [
  { id: 1, employee: "Ravi Sharma", empId: "EMP001", department: "Engineering", policy: "Standard Policy", effectiveDate: "2026-01-01", assignedBy: "HR Admin" },
  { id: 2, employee: "Priya Mehta", empId: "EMP002", department: "HR", policy: "Senior Staff Policy", effectiveDate: "2026-01-01", assignedBy: "HR Admin" },
  { id: 3, employee: "Amit Verma", empId: "EMP003", department: "Marketing", policy: "Standard Policy", effectiveDate: "2026-01-01", assignedBy: "HR Admin" },
  { id: 4, employee: "Sneha Roy", empId: "EMP004", department: "Engineering", policy: "Probation Policy", effectiveDate: "2026-03-01", assignedBy: "HR Admin" },
];

const EMPTY_FORM = { employee: "", empId: "", department: "", policy: "", effectiveDate: "", assignedBy: "HR Admin" };

const LeavePolicyAssignment = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState(null);

  const filtered = assignments.filter(a => {
    const matchDept = filterDept === "All" || a.department === filterDept;
    const matchSearch = !search || a.employee.toLowerCase().includes(search.toLowerCase()) || a.empId.toLowerCase().includes(search.toLowerCase());
    return matchDept && matchSearch;
  });

  const openAdd = () => { setForm(EMPTY_FORM); setEditItem(null); setShowModal(true); };
  const openEdit = (a) => {
    setForm({ employee: a.employee, empId: a.empId, department: a.department, policy: a.policy, effectiveDate: a.effectiveDate, assignedBy: a.assignedBy });
    setEditItem(a.id); setShowModal(true);
  };

  const handleSave = () => {
    if (!form.employee || !form.policy) return;
    if (editItem) setAssignments(assignments.map(a => a.id === editItem ? { ...a, ...form } : a));
    else setAssignments([...assignments, { id: Date.now(), ...form }]);
    setShowModal(false);
  };

  const handleDelete = () => { setAssignments(assignments.filter(a => a.id !== deleteId)); setDeleteId(null); };
  const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  return (
    <div className="bg-white px-4 sm:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl min-h-[calc(100vh-10rem)] flex flex-col" style={{ fontFamily: "Poppins, sans-serif" }}>
      <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
        <span className="cursor-pointer text-[#7D1EDB]" onClick={() => navigate("/hrms")}>HRMS Dashboard</span>
        <ChevronRight size={14} />
        <span className="text-[#6B7280]">Leave Policy Assignment</span>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-4 mb-5">
        <div>
          <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Leave Policy Assignment</h1>
          <p className="text-sm text-gray-400 mt-0.5">Assign leave policies to employees or departments</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#7D1EDB] text-white font-medium hover:bg-purple-700 px-5 py-2.5 rounded-full text-sm">
          <Plus size={16} /> Assign Policy
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {POLICIES.map(p => {
          const count = assignments.filter(a => a.policy === p).length;
          return (
            <div key={p} className="rounded-xl border border-gray-100 p-3">
              <p className="text-xs text-gray-400 mb-1 truncate">{p}</p>
              <p className="text-2xl font-bold text-[#494949]">{count}</p>
              <p className="text-xs text-gray-400">employees</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employee..." className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#7D1EDB]" />
        </div>
        <select value={filterDept} onChange={e => setFilterDept(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#7D1EDB]">
          {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
        </select>
      </div>

      <div className="flex-1 overflow-auto border border-[#CECECE] rounded-lg">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-white">
            <tr className="border-b border-[#CECECE] text-left">
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Employee</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Department</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Policy Assigned</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Effective Date</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Assigned By</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="py-12 text-center text-gray-400 text-sm">No assignments found</td></tr>
            ) : filtered.map(a => (
              <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-5">
                  <p className="text-sm font-medium text-[#1E1E1E]">{a.employee}</p>
                  <p className="text-xs text-gray-400">{a.empId}</p>
                </td>
                <td className="py-3 px-5">
                  <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">{a.department}</span>
                </td>
                <td className="py-3 px-5">
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">{a.policy}</span>
                </td>
                <td className="py-3 px-5 text-sm text-gray-600">{fmt(a.effectiveDate)}</td>
                <td className="py-3 px-5 text-sm text-gray-500">{a.assignedBy}</td>
                <td className="py-3 px-5">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(a)} className="p-1.5 rounded-lg hover:bg-purple-50 text-[#7D1EDB]"><Pencil size={15} /></button>
                    <button onClick={() => setDeleteId(a.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={15} /></button>
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee Name *</label>
                  <input value={form.employee} onChange={e => setForm({ ...form, employee: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#7D1EDB]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                  <input value={form.empId} onChange={e => setForm({ ...form, empId: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#7D1EDB]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#7D1EDB]">
                  <option value="">Select department</option>
                  {DEPARTMENTS.filter(d => d !== "All").map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Policy *</label>
                <select value={form.policy} onChange={e => setForm({ ...form, policy: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#7D1EDB]">
                  <option value="">Select policy</option>
                  {POLICIES.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date</label>
                <input type="date" value={form.effectiveDate} onChange={e => setForm({ ...form, effectiveDate: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#7D1EDB]" />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowModal(false)} className="px-5 py-2 text-sm border border-gray-200 rounded-full hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={!form.employee || !form.policy} className="px-5 py-2 text-sm bg-[#7D1EDB] text-white rounded-full hover:bg-purple-700 disabled:opacity-50">Save</button>
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
              <button onClick={handleDelete} className="px-5 py-2 text-sm bg-red-500 text-white rounded-full">Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeavePolicyAssignment;
