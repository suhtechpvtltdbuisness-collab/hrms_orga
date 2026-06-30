import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ChevronRight, Loader2, Search, X } from "lucide-react";
import { leaveManagementService } from "../../../service";
import useAsyncAction from "../../../hooks/useAsyncAction";

const CompensatoryLeave = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [error, setError] = useState("");
  const { activeKey, isLoading, run } = useAsyncAction();

  const loadRequests = async () => {
    const res = await leaveManagementService.getCompOffRequests();
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
      () => leaveManagementService.approveCompOffRequest(id),
      `approve-${id}`,
    );
    if (!res) return;
    if (!res.success) {
      setError(res.message || "Failed to approve request");
      return;
    }
    loadRequests();
  };

  const handleReject = async () => {
    const res = await run(
      () => leaveManagementService.rejectCompOffRequest(rejectModal, rejectReason),
      `reject-${rejectModal}`,
    );
    if (!res) return;
    if (!res.success) {
      setError(res.message || "Failed to reject request");
      return;
    }
    setRejectModal(null);
    setRejectReason("");
    loadRequests();
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
        <span className="text-[#6B7280]">Compensatory Leave Request</span>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-4 mb-5">
        <div>
          <h1 className="text-[20px] font-semibold text-[#494949]">Compensatory Leave Requests</h1>
          <p className="text-sm text-gray-400 mt-0.5">Approve comp-off requests for employees who worked on holidays</p>
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
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Work Date</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Credited Days</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Reason</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Status</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="py-12 text-center text-gray-400 text-sm">No requests found</td></tr>
            ) : filtered.map((item) => (
              <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-5">
                  <p className="text-sm font-medium text-[#1E1E1E]">{item.empName}</p>
                  <p className="text-xs text-gray-400">{item.empEmail}</p>
                </td>
                <td className="py-3 px-5 text-sm text-gray-600">{fmt(item.workDate)}</td>
                <td className="py-3 px-5 text-sm text-gray-600">{item.creditedDays}</td>
                <td className="py-3 px-5 text-sm text-gray-500 max-w-[220px] truncate">{item.reason || "—"}</td>
                <td className="py-3 px-5 text-sm capitalize">{item.status}</td>
                <td className="py-3 px-5">
                  {item.status === "submitted" ? (
                    <div className="flex gap-2">
                      <button onClick={() => handleApprove(item.id)} disabled={isLoading} className="p-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed">
                        {activeKey === `approve-${item.id}` ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                      </button>
                      <button onClick={() => setRejectModal(item.id)} disabled={isLoading} className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"><X size={15} /></button>
                    </div>
                  ) : <span className="text-xs text-gray-400">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rejectModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-[#494949] mb-2">Reject Request</h3>
            <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={3} placeholder="Reason for rejection..." className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-[#7D1EDB] resize-none mb-4" />
            <div className="flex gap-3 justify-end">
              <button onClick={() => { setRejectModal(null); setRejectReason(""); }} disabled={isLoading} className="px-5 py-2 text-sm border border-gray-200 rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Cancel</button>
              <button onClick={handleReject} disabled={isLoading} className="px-5 py-2 text-sm bg-red-500 text-white rounded-full hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed">
                <span className="inline-flex items-center gap-2">
                  {activeKey === `reject-${rejectModal}` && <Loader2 size={14} className="animate-spin" />}
                  {activeKey === `reject-${rejectModal}` ? "Rejecting..." : "Reject"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompensatoryLeave;
