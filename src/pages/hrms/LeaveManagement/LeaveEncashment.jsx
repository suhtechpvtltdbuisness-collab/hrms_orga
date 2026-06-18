import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Search, DollarSign, Check, X, Info } from "lucide-react";

const INITIAL_REQUESTS = [
  { id: 1, empName: "Ravi Sharma", empId: "EMP001", leaveType: "Earned Leave", daysAvailable: 22, daysRequested: 10, rate: 2500, amount: 25000, status: "pending", requestDate: "2026-06-01" },
  { id: 2, empName: "Priya Mehta", empId: "EMP002", leaveType: "Earned Leave", daysAvailable: 18, daysRequested: 8, rate: 3200, amount: 25600, status: "approved", requestDate: "2026-05-15" },
  { id: 3, empName: "Amit Verma", empId: "EMP003", leaveType: "Earned Leave", daysAvailable: 30, daysRequested: 15, rate: 1800, amount: 27000, status: "pending", requestDate: "2026-06-02" },
  { id: 4, empName: "Sneha Roy", empId: "EMP004", leaveType: "Earned Leave", daysAvailable: 12, daysRequested: 5, rate: 2200, amount: 11000, status: "rejected", requestDate: "2026-05-20" },
  { id: 5, empName: "Karan Singh", empId: "EMP005", leaveType: "Earned Leave", daysAvailable: 25, daysRequested: 12, rate: 2800, amount: 33600, status: "pending", requestDate: "2026-06-05" },
];

const STATUS_CONFIG = {
  pending: { label: "Pending", cls: "bg-amber-100 text-amber-700" },
  approved: { label: "Approved", cls: "bg-green-100 text-green-700" },
  rejected: { label: "Rejected", cls: "bg-red-100 text-red-700" },
};

const LeaveEncashment = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const filtered = requests.filter(r => {
    const matchStatus = filterStatus === "All" || r.status === filterStatus.toLowerCase();
    const matchSearch = !search || r.empName.toLowerCase().includes(search.toLowerCase()) || r.empId.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === "pending").length,
    approved: requests.filter(r => r.status === "approved").length,
    totalAmount: requests.filter(r => r.status === "approved").reduce((sum, r) => sum + r.amount, 0),
  };

  const handleApprove = (id) => setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "approved" } : r));
  const handleReject = (id) => setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "rejected" } : r));
  const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
  const fmtCurrency = (n) => `₹${n.toLocaleString("en-IN")}`;

  return (
    <div className="bg-white px-4 sm:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl min-h-[calc(100vh-10rem)] flex flex-col" style={{ fontFamily: "Poppins, sans-serif" }}>
      <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
        <span className="cursor-pointer text-[#7D1EDB]" onClick={() => navigate("/hrms")}>HRMS Dashboard</span>
        <ChevronRight size={14} />
        <span className="text-[#6B7280]">Leave Encashment</span>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-4 mb-5">
        <div>
          <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Leave Encashment</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage employee leave encashment requests</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-5">
        <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700">Only Earned Leave can be encashed. The encashment amount is calculated based on the employee's daily rate.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="rounded-xl border border-gray-100 p-3">
          <p className="text-xs text-gray-400 mb-1">Total Requests</p>
          <p className="text-2xl font-bold text-[#494949]">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-amber-100 bg-amber-50 p-3">
          <p className="text-xs text-gray-400 mb-1">Pending</p>
          <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
        </div>
        <div className="rounded-xl border border-green-100 bg-green-50 p-3">
          <p className="text-xs text-gray-400 mb-1">Approved</p>
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
        </div>
        <div className="rounded-xl border border-purple-100 bg-purple-50 p-3">
          <p className="text-xs text-gray-400 mb-1">Total Paid Out</p>
          <p className="text-xl font-bold text-[#7D1EDB]">{fmtCurrency(stats.totalAmount)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employee..." className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#7D1EDB]" />
        </div>
        <div className="flex gap-2">
          {["All", "Pending", "Approved", "Rejected"].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${filterStatus === s ? "bg-[#7D1EDB] text-white border-[#7D1EDB]" : "border-gray-200 text-gray-600 hover:border-[#7D1EDB]"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto border border-[#CECECE] rounded-lg">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-white">
            <tr className="border-b border-[#CECECE] text-left">
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Employee</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Leave Type</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Available Days</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Days to Encash</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Daily Rate</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Amount</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Request Date</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Status</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={9} className="py-12 text-center text-gray-400 text-sm">No requests found</td></tr>
            ) : filtered.map(r => (
              <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-5">
                  <p className="text-sm font-medium text-[#1E1E1E]">{r.empName}</p>
                  <p className="text-xs text-gray-400">{r.empId}</p>
                </td>
                <td className="py-3 px-5">
                  <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">{r.leaveType}</span>
                </td>
                <td className="py-3 px-5 text-sm text-gray-600">{r.daysAvailable} days</td>
                <td className="py-3 px-5 text-sm font-medium text-[#1E1E1E]">{r.daysRequested} days</td>
                <td className="py-3 px-5 text-sm text-gray-600">{fmtCurrency(r.rate)}/day</td>
                <td className="py-3 px-5 text-sm font-semibold text-[#7D1EDB]">{fmtCurrency(r.amount)}</td>
                <td className="py-3 px-5 text-sm text-gray-500">{fmt(r.requestDate)}</td>
                <td className="py-3 px-5">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_CONFIG[r.status]?.cls}`}>
                    {STATUS_CONFIG[r.status]?.label}
                  </span>
                </td>
                <td className="py-3 px-5">
                  {r.status === "pending" ? (
                    <div className="flex gap-2">
                      <button onClick={() => handleApprove(r.id)} className="p-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200" title="Approve"><Check size={15} /></button>
                      <button onClick={() => handleReject(r.id)} className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200" title="Reject"><X size={15} /></button>
                    </div>
                  ) : <span className="text-xs text-gray-400">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveEncashment;
