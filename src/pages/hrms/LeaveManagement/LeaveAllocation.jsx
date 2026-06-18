import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight, Search, CheckCircle2, AlertCircle, User,
  TrendingUp, RefreshCw, ChevronDown, Loader2, Users, CalendarDays
} from "lucide-react";
import { employeeService, leaveService } from "../../../service";

/* ─── Mock allocation history (shown after an employee is selected) ─── */
const MOCK_HISTORY = [
  { id: 1, date: "2026-01-15", allocatedBy: "HR Admin", sick: 10, casual: 12, paid: 15, note: "Annual allocation" },
  { id: 2, date: "2025-07-01", allocatedBy: "HR Admin", sick: 5, casual: 6, paid: 8, note: "Mid-year top-up" },
  { id: 3, date: "2025-01-10", allocatedBy: "HR Admin", sick: 10, casual: 12, paid: 15, note: "Annual allocation" },
];

/* ─── Leave type config ─── */
const LEAVE_TYPES = [
  {
    key: "sickLeave",
    remainingKey: "sickRemaining",
    label: "Sick Leave",
    icon: "🤒",
    color: "from-red-400 to-rose-500",
    bgLight: "bg-red-50",
    border: "border-red-100",
    textColor: "text-red-600",
    ringColor: "#f87171",
  },
  {
    key: "casualLeave",
    remainingKey: "casualRemaining",
    label: "Casual Leave",
    icon: "☀️",
    color: "from-amber-400 to-orange-500",
    bgLight: "bg-amber-50",
    border: "border-amber-100",
    textColor: "text-amber-600",
    ringColor: "#fbbf24",
  },
  {
    key: "paidLeave",
    remainingKey: "paidRemaining",
    label: "Earned / Paid Leave",
    icon: "🏖️",
    color: "from-violet-500 to-purple-600",
    bgLight: "bg-purple-50",
    border: "border-purple-100",
    textColor: "text-purple-600",
    ringColor: "#8b5cf6",
  },
];

/* ─── Circular progress ring ─── */
const CircleRing = ({ used, total, color }) => {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const pct = total > 0 ? Math.min(used / total, 1) : 0;
  const dashOffset = circ * (1 - pct);
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r={r} fill="none" stroke="#f3f4f6" strokeWidth="7" />
      <circle
        cx="36" cy="36" r={r} fill="none" stroke={color}
        strokeWidth="7" strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={dashOffset}
        transform="rotate(-90 36 36)"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      <text x="36" y="40" textAnchor="middle" fontSize="12" fontWeight="700" fill="#374151">
        {total > 0 ? `${Math.round(pct * 100)}%` : "—"}
      </text>
    </svg>
  );
};

/* ─── Balance Card ─── */
const BalanceCard = ({ lt, balance, formValue, onChange }) => {
  const total = balance ? (balance[lt.key] ?? 0) : 0;
  const used = balance ? (total - (balance[lt.remainingKey] ?? total)) : 0;
  const remaining = balance ? (balance[lt.remainingKey] ?? total) : 0;

  return (
    <div className={`rounded-2xl border ${lt.border} ${lt.bgLight} p-4 flex flex-col gap-3`}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-xl">{lt.icon}</span>
        <div>
          <p className="text-sm font-semibold text-[#1E1E1E]">{lt.label}</p>
          {balance && (
            <p className="text-xs text-gray-400">{remaining} of {total} days remaining</p>
          )}
        </div>
      </div>

      {/* Ring + Stats */}
      {balance ? (
        <div className="flex items-center gap-4">
          <CircleRing used={used} total={total} color={lt.ringColor} />
          <div className="flex-1 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Allocated</span>
              <span className="font-semibold text-[#1E1E1E]">{total} days</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Used</span>
              <span className={`font-semibold ${lt.textColor}`}>{used} days</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Remaining</span>
              <span className="font-semibold text-green-600">{remaining} days</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-16 text-gray-300 text-sm">No data</div>
      )}

      {/* Allocation Input */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Set Allocation (days)</label>
        <input
          type="number"
          min="0"
          max="365"
          value={formValue}
          onChange={e => onChange(e.target.value)}
          className={`w-full border ${lt.border} rounded-xl px-3 py-2 text-sm font-semibold text-center text-[#1E1E1E] outline-none focus:ring-2 focus:ring-[#7D1EDB]/20 focus:border-[#7D1EDB] bg-white transition-all`}
          placeholder="0"
        />
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════ */
/*                    MAIN COMPONENT                           */
/* ═══════════════════════════════════════════════════════════ */
const LeaveAllocation = () => {
  const navigate = useNavigate();

  // Employee list
  const [employees, setEmployees] = useState([]);
  const [empLoading, setEmpLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);

  // Form state
  const [form, setForm] = useState({ sickLeave: "", casualLeave: "", paidLeave: "" });

  // Balance + action state
  const [currentBalance, setCurrentBalance] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type, text }

  // History
  const [showHistory, setShowHistory] = useState(false);

  /* ── Load employees ── */
  useEffect(() => {
    const load = async () => {
      setEmpLoading(true);
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const adminId = userData?.id;
      if (!adminId) { setEmpLoading(false); return; }
      const res = await employeeService.getAllEmployeesByAdminId(adminId);
      if (res.success && res.data) {
        setEmployees(res.data.map(item => ({
          id: item.user?.id || item.userId,
          name: item.user?.name || "Employee",
          email: item.user?.email || "",
          department: item.department?.name || "General",
          designation: item.designation?.name || "—",
        })));
      }
      setEmpLoading(false);
    };
    load();
  }, []);

  /* ── Load balance when employee selected ── */
  useEffect(() => {
    if (!selectedEmp) { setCurrentBalance(null); setForm({ sickLeave: "", casualLeave: "", paidLeave: "" }); return; }
    const loadBalance = async () => {
      setBalanceLoading(true);
      const res = await leaveService.getBalance(selectedEmp.id);
      if (res.success && res.data) {
        setCurrentBalance(res.data);
        setForm({
          sickLeave: res.data.sickLeave ?? "",
          casualLeave: res.data.casualLeave ?? "",
          paidLeave: res.data.paidLeave ?? "",
        });
      } else {
        setCurrentBalance(null);
        setForm({ sickLeave: "", casualLeave: "", paidLeave: "" });
      }
      setBalanceLoading(false);
    };
    loadBalance();
  }, [selectedEmp]);

  /* ── Auto-dismiss toast ── */
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!selectedEmp) { setToast({ type: "error", text: "Please select an employee first." }); return; }
    setSubmitLoading(true);
    const res = await leaveService.allocateLeave({
      empId: Number(selectedEmp.id),
      sickLeave: Number(form.sickLeave) || 0,
      casualLeave: Number(form.casualLeave) || 0,
      paidLeave: Number(form.paidLeave) || 0,
    });
    setSubmitLoading(false);
    if (res.success) {
      setToast({ type: "success", text: res.message || "Leave allocated successfully!" });
      const balRes = await leaveService.getBalance(selectedEmp.id);
      if (balRes.success) setCurrentBalance(balRes.data);
    } else {
      setToast({ type: "error", text: res.message || "Failed to allocate leave." });
    }
  };

  const filteredEmp = employees.filter(e =>
    !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalAllocated = (Number(form.sickLeave) || 0) + (Number(form.casualLeave) || 0) + (Number(form.paidLeave) || 0);
  const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  return (
    <div className="bg-white px-4 sm:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl min-h-[calc(100vh-10rem)] flex flex-col" style={{ fontFamily: "Poppins, sans-serif" }}>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg text-sm font-medium transition-all ${toast.type === "success" ? "bg-green-600 text-white" : "bg-red-500 text-white"}`}>
          {toast.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {toast.text}
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
        <span className="cursor-pointer text-[#7D1EDB]" onClick={() => navigate("/hrms")}>HRMS Dashboard</span>
        <ChevronRight size={14} />
        <span className="text-[#6B7280]">Leave Allocation</span>
      </div>

      {/* Page Header */}
      <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Leave Allocation</h1>
          <p className="text-sm text-gray-400 mt-0.5">Allocate and manage leave balances for employees</p>
        </div>
        {/* Stats chips */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-xl px-3 py-2">
            <Users size={15} className="text-[#7D1EDB]" />
            <span className="text-xs font-semibold text-[#7D1EDB]">{employees.length} Employees</span>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
            <CalendarDays size={15} className="text-blue-600" />
            <span className="text-xs font-semibold text-blue-600">{totalAllocated > 0 ? `${totalAllocated} days set` : "No allocation set"}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1">

        {/* ── LEFT PANEL: Employee Selector ── */}
        <div className="lg:w-[280px] shrink-0">
          <div className="border border-gray-100 rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#7D1EDB] to-indigo-600 px-4 py-3">
              <p className="text-white text-sm font-semibold">Select Employee</p>
              <p className="text-white/70 text-xs mt-0.5">Choose to view & edit allocation</p>
            </div>

            {/* Search */}
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search employee..."
                  className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#7D1EDB]"
                />
              </div>
            </div>

            {/* Employee List */}
            <div className="overflow-y-auto max-h-[420px]">
              {empLoading ? (
                <div className="py-8 flex items-center justify-center">
                  <Loader2 size={20} className="animate-spin text-[#7D1EDB]" />
                </div>
              ) : filteredEmp.length === 0 ? (
                <div className="py-8 text-center text-gray-400 text-xs">No employees found</div>
              ) : filteredEmp.map(emp => (
                <button
                  key={emp.id}
                  onClick={() => { setSelectedEmp(emp); setSearch(""); setShowHistory(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-gray-50 transition-colors ${selectedEmp?.id === emp.id ? "bg-purple-50 border-l-2 border-l-[#7D1EDB]" : "hover:bg-gray-50"}`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7D1EDB] to-indigo-500 flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-bold">{emp.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs font-semibold truncate ${selectedEmp?.id === emp.id ? "text-[#7D1EDB]" : "text-[#1E1E1E]"}`}>{emp.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{emp.email}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="flex-1 min-w-0">
          {!selectedEmp ? (
            /* Empty state */
            <div className="h-full flex flex-col items-center justify-center text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl">
              <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mb-4">
                <User size={28} className="text-[#7D1EDB]" />
              </div>
              <h3 className="text-base font-semibold text-[#494949] mb-1">Select an Employee</h3>
              <p className="text-sm text-gray-400 max-w-xs">Choose an employee from the left panel to view and manage their leave balance allocation.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Employee Card */}
              <div className="flex items-center gap-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-2xl px-5 py-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7D1EDB] to-indigo-500 flex items-center justify-center shrink-0">
                  <span className="text-white text-lg font-bold">{selectedEmp.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-bold text-[#1E1E1E]">{selectedEmp.name}</h2>
                  <p className="text-xs text-gray-500">{selectedEmp.email}</p>
                  {selectedEmp.department && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 bg-white border border-purple-200 text-purple-700 text-[10px] rounded-full">{selectedEmp.department}</span>
                      {selectedEmp.designation !== "—" && (
                        <span className="px-2 py-0.5 bg-white border border-gray-200 text-gray-600 text-[10px] rounded-full">{selectedEmp.designation}</span>
                      )}
                    </div>
                  )}
                </div>
                <button onClick={() => { setSelectedEmp(null); }} className="p-2 hover:bg-white/60 rounded-xl text-gray-400 hover:text-gray-600 transition-colors">
                  <RefreshCw size={15} />
                </button>
              </div>

              {/* Balance Loading */}
              {balanceLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 size={28} className="animate-spin text-[#7D1EDB]" />
                    <p className="text-sm text-gray-400">Loading balance...</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Section Title */}
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-[#7D1EDB]" />
                    <h3 className="text-sm font-semibold text-[#494949]">Leave Balance & Allocation</h3>
                    {currentBalance && (
                      <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Current data loaded</span>
                    )}
                  </div>

                  {/* Balance Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {LEAVE_TYPES.map(lt => (
                      <BalanceCard
                        key={lt.key}
                        lt={lt}
                        balance={currentBalance}
                        formValue={form[lt.key]}
                        onChange={v => setForm(prev => ({ ...prev, [lt.key]: v }))}
                      />
                    ))}
                  </div>

                  {/* Summary Row */}
                  {totalAllocated > 0 && (
                    <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <CalendarDays size={15} className="text-[#7D1EDB]" />
                        <span>Total to be allocated:</span>
                      </div>
                      <span className="text-base font-bold text-[#7D1EDB]">{totalAllocated} days</span>
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    type="submit"
                    disabled={submitLoading || totalAllocated === 0}
                    className="w-full h-12 bg-gradient-to-r from-[#7D1EDB] to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-purple-200 text-sm"
                  >
                    {submitLoading ? (
                      <><Loader2 size={17} className="animate-spin" /> Saving...</>
                    ) : currentBalance ? (
                      "Update Allocation"
                    ) : (
                      "Allocate Leave"
                    )}
                  </button>
                </form>
              )}

              {/* Allocation History */}
              <div className="border border-gray-100 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="w-full flex items-center justify-between px-5 py-3.5 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span className="text-sm font-semibold text-[#494949]">Allocation History</span>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform ${showHistory ? "rotate-180" : ""}`} />
                </button>
                {showHistory && (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-100 text-left">
                          <th className="py-2.5 px-4 text-xs font-normal text-[#757575]">Date</th>
                          <th className="py-2.5 px-4 text-xs font-normal text-[#757575]">Sick</th>
                          <th className="py-2.5 px-4 text-xs font-normal text-[#757575]">Casual</th>
                          <th className="py-2.5 px-4 text-xs font-normal text-[#757575]">Paid</th>
                          <th className="py-2.5 px-4 text-xs font-normal text-[#757575]">By</th>
                          <th className="py-2.5 px-4 text-xs font-normal text-[#757575]">Note</th>
                        </tr>
                      </thead>
                      <tbody>
                        {MOCK_HISTORY.map(h => (
                          <tr key={h.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <td className="py-2.5 px-4 text-xs text-gray-600">{fmt(h.date)}</td>
                            <td className="py-2.5 px-4 text-xs font-medium text-red-600">{h.sick}d</td>
                            <td className="py-2.5 px-4 text-xs font-medium text-amber-600">{h.casual}d</td>
                            <td className="py-2.5 px-4 text-xs font-medium text-purple-600">{h.paid}d</td>
                            <td className="py-2.5 px-4 text-xs text-gray-500">{h.allocatedBy}</td>
                            <td className="py-2.5 px-4 text-xs text-gray-400">{h.note}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveAllocation;
