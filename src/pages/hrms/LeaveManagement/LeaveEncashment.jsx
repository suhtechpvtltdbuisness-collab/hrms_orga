import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ChevronRight, Loader2, Search, X } from "lucide-react";
import { leaveManagementService } from "../../../service";
import useAsyncAction from "../../../hooks/useAsyncAction";

const LeaveEncashment = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [error, setError] = useState("");
  const { activeKey, isLoading, run } = useAsyncAction();

  const loadRequests = async () => {
    const res = await leaveManagementService.getEncashmentRequests();
    if (res.success) {
      setRequests(res.data || []);
      setError("");
    } else {
      setError(res.message || "Failed to load requests");
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return requests.filter((item) => {
      const statusMatch = filterStatus === "All" || item.status === filterStatus.toLowerCase();
      const searchMatch = !q || item.empName?.toLowerCase().includes(q);
      return statusMatch && searchMatch;
    });
  }, [requests, filterStatus, search]);

  const handleApprove = async (id) => {
    const res = await run(
      () => leaveManagementService.approveEncashmentRequest(id),
      `approve-${id}`,
    );
    if (!res) return;
    if (!res.success) {
      setError(res.message || "Failed to approve request");
      return;
    }
    loadRequests();
  };

  const handleReject = async (id) => {
    const res = await run(
      () => leaveManagementService.rejectEncashmentRequest(id),
      `reject-${id}`,
    );
    if (!res) return;
    if (!res.success) {
      setError(res.message || "Failed to reject request");
      return;
    }
    loadRequests();
  };

  const fmt = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
      : "—";
  const fmtCurrency = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

  return (
    <div className="bg-white px-4 sm:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl min-h-[calc(100vh-10rem)] flex flex-col" style={{ fontFamily: "Poppins, sans-serif" }}>
      <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
        <span className="cursor-pointer text-[#7D1EDB]" onClick={() => navigate("/hrms")}>HRMS Dashboard</span>
        <ChevronRight size={14} />
        <span className="text-[#6B7280]">Leave Encashment</span>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-4 mb-5">
        <div>
          <h1 className="text-[20px] font-semibold text-[#494949]">Leave Encashment</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage employee leave encashment requests</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search employee..." className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#7D1EDB]" />
        </div>
        <div className="flex gap-2">
          {["All", "Submitted", "Approved", "Rejected"].map((status) => (
            <button key={status} onClick={() => setFilterStatus(status)} className={`px-4 py-2 rounded-full text-xs font-medium border ${filterStatus === status ? "bg-[#7D1EDB] text-white border-[#7D1EDB]" : "border-gray-200 text-gray-600"}`}>
              {status}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

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
            ) : filtered.map((item) => (
              <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-5">
                  <p className="text-sm font-medium text-[#1E1E1E]">{item.empName}</p>
                  <p className="text-xs text-gray-400">{item.empEmail}</p>
                </td>
                <td className="py-3 px-5">{item.leaveTypeName}</td>
                <td className="py-3 px-5 text-sm text-gray-600">{item.daysAvailable}</td>
                <td className="py-3 px-5 text-sm text-gray-600">{item.daysRequested}</td>
                <td className="py-3 px-5 text-sm text-gray-600">{fmtCurrency(item.dailyRate)}/day</td>
                <td className="py-3 px-5 text-sm font-semibold text-[#7D1EDB]">{fmtCurrency(item.amount)}</td>
                <td className="py-3 px-5 text-sm text-gray-500">{fmt(item.createdAt)}</td>
                <td className="py-3 px-5 text-sm capitalize">{item.status}</td>
                <td className="py-3 px-5">
                  {item.status === "submitted" ? (
                    <div className="flex gap-2">
                      <button onClick={() => handleApprove(item.id)} disabled={isLoading} className="p-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed">
                        {activeKey === `approve-${item.id}` ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                      </button>
                      <button onClick={() => handleReject(item.id)} disabled={isLoading} className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed">
                        {activeKey === `reject-${item.id}` ? <Loader2 size={15} className="animate-spin" /> : <X size={15} />}
                      </button>
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
