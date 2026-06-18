import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Check, X, Search } from "lucide-react";
import { leaveRequestService } from "../../../service";

const formatStatus = (status) => {
  if (!status) return "Submitted";
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const LeaveApplication = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [rejectId, setRejectId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError("");
    const filters = {};
    if (filterStatus !== "All") filters.status = filterStatus.toLowerCase();
    const res = await leaveRequestService.getLeaveRequests(filters);
    if (res.success) {
      setRequests(res.data || []);
    } else {
      setError(res.message || "Failed to load leave requests");
    }
    setLoading(false);
  }, [filterStatus]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleApprove = async (id) => {
    setActionId(id);
    const res = await leaveRequestService.approveLeaveRequest(id);
    setActionId(null);
    if (res.success) fetchRequests();
    else setError(res.message);
  };

  const handleReject = async () => {
    if (!rejectId) return;
    setActionId(rejectId);
    const res = await leaveRequestService.rejectLeaveRequest(rejectId, rejectReason);
    setActionId(null);
    setRejectId(null);
    setRejectReason("");
    if (res.success) fetchRequests();
    else setError(res.message);
  };

  const filtered = requests.filter((r) => {
    const q = search.toLowerCase();
    return (
      !q ||
      r.empName?.toLowerCase().includes(q) ||
      r.leaveType?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-white px-4 sm:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl min-h-[calc(100vh-10rem)] font-popins">
      <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
        <span className="cursor-pointer text-[#7D1EDB]" onClick={() => navigate("/hrms")}>
          HRMS Dashboard
        </span>
        <ChevronRight size={14} />
        <span>Leave Application</span>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-[20px] font-semibold text-[#494949]">Leave Applications</h1>
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employee..."
              className="pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          >
            {["All", "Submitted", "Approved", "Rejected"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="overflow-x-auto border border-[#CECECE] rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm text-gray-500">
              <th className="py-3 px-4">Employee</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">From</th>
              <th className="py-3 px-4">To</th>
              <th className="py-3 px-4">Days</th>
              <th className="py-3 px-4">Reason</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="py-8 text-center text-gray-400">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} className="py-8 text-center text-gray-400">No leave requests found</td></tr>
            ) : (
              filtered.map((req) => (
                <tr key={req.id} className="border-t hover:bg-gray-50 text-sm">
                  <td className="py-3 px-4 font-medium">{req.empName || `User #${req.empId}`}</td>
                  <td className="py-3 px-4 capitalize">{leaveRequestService.leaveTypeToLabel(req.leaveType)}</td>
                  <td className="py-3 px-4">{req.fromDate}</td>
                  <td className="py-3 px-4">{req.toDate}</td>
                  <td className="py-3 px-4">{req.days}</td>
                  <td className="py-3 px-4 max-w-[200px] truncate">{req.reason || "—"}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      req.status === "approved" ? "bg-green-100 text-green-700" :
                      req.status === "rejected" ? "bg-red-100 text-red-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>
                      {formatStatus(req.status)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {req.status === "submitted" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(req.id)}
                          disabled={actionId === req.id}
                          className="p-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50"
                          title="Approve"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => setRejectId(req.id)}
                          disabled={actionId === req.id}
                          className="p-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50"
                          title="Reject"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {rejectId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold mb-2">Reject Leave Request</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection (optional)"
              className="w-full border border-gray-200 rounded-lg p-3 text-sm min-h-[100px] mb-4"
            />
            <div className="flex gap-3 justify-end">
              <button onClick={() => { setRejectId(null); setRejectReason(""); }} className="px-4 py-2 text-sm border rounded-lg">Cancel</button>
              <button onClick={handleReject} className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg">Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveApplication;
