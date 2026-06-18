import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Check, X, Search, Clock } from "lucide-react";

const INITIAL_REQUESTS = [
  { id: 1, empName: "Ravi Sharma", empId: "EMP001", workDate: "2026-01-26", reason: "Worked on Republic Day for server migration", requestDate: "2026-01-27", status: "pending" },
  { id: 2, empName: "Priya Mehta", empId: "EMP002", workDate: "2026-01-15", reason: "Office work on Makar Sankranti", requestDate: "2026-01-16", status: "approved" },
  { id: 3, empName: "Amit Verma", empId: "EMP003", workDate: "2025-12-25", reason: "Production deployment on Christmas", requestDate: "2025-12-26", status: "rejected" },
  { id: 4, empName: "Sneha Roy", empId: "EMP004", workDate: "2026-03-14", reason: "Client emergency on Holi", requestDate: "2026-03-15", status: "pending" },
  { id: 5, empName: "Karan Singh", empId: "EMP005", workDate: "2026-08-15", reason: "Critical release on Independence Day", requestDate: "2026-08-16", status: "pending" },
];

const STATUS_CONFIG = {
  pending: { label: "Pending", cls: "bg-amber-100 text-amber-700" },
  approved: { label: "Approved", cls: "bg-green-100 text-green-700" },
  rejected: { label: "Rejected", cls: "bg-red-100 text-red-700" },
};

const CompensatoryLeave = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionId, setActionId] = useState(null);

  const filtered = requests.filter(r => {
    const matchStatus = filterStatus === "All" || r.status === filterStatus.toLowerCase();
    const matchSearch = !search || r.empName.toLowerCase().includes(search.toLowerCase()) || r.empId.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === "pending").length,
    approved: requests.filter(r => r.status === "approved").length,
    rejected: requests.filter(r => r.status === "rejected").length,
  };

  const handleApprove = (id) => {
    setActionId(id);
    setTimeout(() => {
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "approved" } : r));
      setActionId(null);
    }, 500);
  };

  const handleReject = () => {
    if (!rejectModal) return;
    setRequests(prev => prev.map(r => r.id === rejectModal ? { ...r, status: "rejected" } : r));
    setRejectModal(null);
    setRejectReason("");
  };

  const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  return (
    <div className="bg-white px-4 sm:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl min-h-[calc(100vh-10rem)] flex flex-col" style={{ fontFamily: "Poppins, sans-serif" }}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
        <span className="cursor-pointer text-[#7D1EDB]" onClick={() => navigate("/hrms")}>HRMS Dashboard</span>
        <ChevronRight size={14} />
        <span className="text-[#6B7280]">Compensatory Leave Request</span>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-4 mb-5">
        <div>
          <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Compensatory Leave Requests</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage comp-off requests from employees who worked on holidays</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total", count: stats.total, color: "text-[#494949]", bg: "border-gray-100" },
          { label: "Pending", count: stats.pending, color: "text-amber-600", bg: "border-amber-100 bg-amber-50" },
          { label: "Approved", count: stats.approved, color: "text-green-600", bg: "border-green-100 bg-green-50" },
          { label: "Rejected", count: stats.rejected, color: "text-red-500", bg: "border-red-100 bg-red-50" },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-3 ${s.bg}`}>
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
          </div>
        ))}
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

      {/* Table */}
      <div className="flex-1 overflow-auto border border-[#CECECE] rounded-lg">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-white">
            <tr className="border-b border-[#CECECE] text-left">
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Employee</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Work Date</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Request Date</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Reason</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Status</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="py-12 text-center text-gray-400 text-sm">No requests found</td></tr>
            ) : filtered.map(r => (
              <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-5">
                  <p className="text-sm font-medium text-[#1E1E1E]">{r.empName}</p>
                  <p className="text-xs text-gray-400">{r.empId}</p>
                </td>
                <td className="py-3 px-5 text-sm text-gray-600">{fmt(r.workDate)}</td>
                <td className="py-3 px-5 text-sm text-gray-600">{fmt(r.requestDate)}</td>
                <td className="py-3 px-5 text-sm text-gray-500 max-w-[220px] truncate">{r.reason}</td>
                <td className="py-3 px-5">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_CONFIG[r.status]?.cls}`}>
                    {STATUS_CONFIG[r.status]?.label}
                  </span>
                </td>
                <td className="py-3 px-5">
                  {r.status === "pending" ? (
                    <div className="flex gap-2">
                      <button onClick={() => handleApprove(r.id)} disabled={actionId === r.id}
                        className="p-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50" title="Approve">
                        <Check size={15} />
                      </button>
                      <button onClick={() => setRejectModal(r.id)} disabled={actionId === r.id}
                        className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50" title="Reject">
                        <X size={15} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-[#494949] mb-2">Reject Request</h3>
            <p className="text-sm text-gray-500 mb-4">Provide a reason for rejection (optional)</p>
            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={3} placeholder="Reason for rejection..." className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-[#7D1EDB] resize-none mb-4" />
            <div className="flex gap-3 justify-end">
              <button onClick={() => { setRejectModal(null); setRejectReason(""); }} className="px-5 py-2 text-sm border border-gray-200 rounded-full hover:bg-gray-50">Cancel</button>
              <button onClick={handleReject} className="px-5 py-2 text-sm bg-red-500 text-white rounded-full hover:bg-red-600">Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompensatoryLeave;
