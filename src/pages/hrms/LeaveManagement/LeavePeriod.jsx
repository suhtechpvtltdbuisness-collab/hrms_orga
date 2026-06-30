import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Loader2, Plus, Trash2 } from "lucide-react";
import { leaveManagementService } from "../../../service";
import useAsyncAction from "../../../hooks/useAsyncAction";

const LeavePeriod = () => {
  const navigate = useNavigate();
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { activeKey, isLoading: isDeleting, run } = useAsyncAction();

  const loadPeriods = async () => {
    setLoading(true);
    const res = await leaveManagementService.getPeriods();
    if (res.success) {
      setPeriods(res.data || []);
      setError("");
    } else {
      setError(res.message || "Failed to load leave periods");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPeriods();
  }, []);

  const handleDelete = async (id) => {
    const res = await run(() => leaveManagementService.deletePeriod(id), `delete-${id}`);
    if (!res) return;
    if (!res.success) {
      setError(res.message || "Failed to delete leave period");
      return;
    }
    loadPeriods();
  };

  const fmt = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  return (
    <div className="bg-white px-4 sm:px-4 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col font-popins">
      <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 shrink-0">
        <span className="cursor-pointer text-[#7D1EDB]" onClick={() => navigate("/hrms")}>
          HRMS Dashboard
        </span>
        <ChevronRight size={14} />
        <span className="text-[#6B7280]">Leave Period</span>
      </div>

      <div className="flex justify-between items-center mb-4 shrink-0">
        <h1 className="text-[20px] font-semibold text-[#494949]">Leave Period</h1>
        <button
          onClick={() => navigate("/hrms/leave-period/new")}
          className="flex items-center justify-center gap-2 text-white font-medium hover:bg-purple-700 transition-colors bg-[#7D1EDB] min-w-[180px] h-12 px-6 rounded-full"
        >
          <span className="text-[16px] font-medium text-white">Add Leave Period</span>
          <Plus size={20} />
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="h-fit min-h-0 overflow-y-auto border border-[#CECECE] rounded-lg">
        <table className="w-full relative border-collapse">
          <thead className="sticky top-0 z-10 bg-white">
            <tr className="text-left text-[14px] border-b border-[#CECECE]">
              <th className="py-3 px-6 font-normal text-[#757575]">Sr No.</th>
              <th className="py-3 px-6 font-normal text-[#757575]">Name</th>
              <th className="py-3 px-6 font-normal text-[#757575]">From Date</th>
              <th className="py-3 px-6 font-normal text-[#757575]">To Date</th>
              <th className="py-3 px-6 font-normal text-[#757575]">Holiday List</th>
              <th className="py-3 px-6 font-normal text-[#757575]">Status</th>
              <th className="py-3 px-6 font-normal text-[#757575]">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-400">
                  Loading leave periods...
                </td>
              </tr>
            ) : periods.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-400">
                  No leave periods found
                </td>
              </tr>
            ) : (
              periods.map((period, index) => (
                <tr key={period.id} className="hover:bg-gray-50 transition-colors text-[14px] font-medium text-[#1E1E1E]">
                  <td className="py-3 px-6">{index + 1}</td>
                  <td className="py-3 px-6">{period.name}</td>
                  <td className="py-3 px-6">{fmt(period.fromDate)}</td>
                  <td className="py-3 px-6">{fmt(period.toDate)}</td>
                  <td className="py-3 px-6">{period.holidayListName || "—"}</td>
                  <td className="py-3 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-xs ${period.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                      {period.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3 px-6">
                    <button
                      onClick={() => handleDelete(period.id)}
                      disabled={isDeleting}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {activeKey === `delete-${period.id}` ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Trash2 size={15} />
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeavePeriod;
