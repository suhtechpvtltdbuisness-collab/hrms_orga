import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Loader2 } from "lucide-react";
import { leaveManagementService } from "../../../service";
import useAsyncAction from "../../../hooks/useAsyncAction";

const NewLeavePeriod = () => {
  const navigate = useNavigate();
  const [options, setOptions] = useState([]);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fromDate: "",
    toDate: "",
    holidayListName: "",
    holidayYear: "",
    isActive: true,
  });
  const { isLoading: isSaving, run } = useAsyncAction();

  useEffect(() => {
    const loadOptions = async () => {
      const res = await leaveManagementService.getOptions();
      if (res.success) {
        setOptions(res.data?.holidayLists || []);
      }
    };
    loadOptions();
  }, []);

  const handleSave = async () => {
    if (!formData.fromDate || !formData.toDate) {
      setError("From date and to date are required");
      return;
    }

    const res = await run(() =>
      leaveManagementService.createPeriod({
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        holidayListName: formData.holidayListName || undefined,
        holidayYear: formData.holidayYear ? Number(formData.holidayYear) : undefined,
        isActive: formData.isActive,
      }),
    );

    if (!res) return;

    if (!res.success) {
      setError(res.message || "Failed to create leave period");
      return;
    }

    navigate("/hrms/leave-period");
  };

  return (
    <div className="bg-white px-4 sm:px-4 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col font-popins">
      <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 shrink-0">
        <span className="cursor-pointer text-[#7D1EDB]" onClick={() => navigate("/hrms")}>
          HRMS Dashboard
        </span>
        <ChevronRight size={14} />
        <span className="cursor-pointer text-[#667085]" onClick={() => navigate("/hrms/leave-period")}>
          Leave Period
        </span>
        <ChevronRight size={14} />
        <span className="text-[#6B7280]">New Leave Period</span>
      </div>

      <div className="flex justify-between items-center mb-6 shrink-0">
        <h1 className="text-[20px] font-semibold text-[#494949]">New Leave Period</h1>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center rounded-full py-3 px-4 justify-center gap-2 text-white font-medium hover:bg-purple-700 transition-colors bg-[#7D1EDB] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSaving && <Loader2 size={16} className="animate-spin" />}
          <span className="text-[16px] font-medium text-white">{isSaving ? "Saving..." : "Save"}</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="border border-[#E5E7EB] rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="flex flex-col gap-2">
            <label className="text-[14px] text-[#494949] font-medium">From Date</label>
            <input
              type="date"
              value={formData.fromDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, fromDate: e.target.value }))}
              className="bg-white h-[40px] px-4 rounded-lg border border-[#D9D9D9] focus:border-[#7D1EDB] outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] text-[#494949] font-medium">To Date</label>
            <input
              type="date"
              value={formData.toDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, toDate: e.target.value }))}
              className="bg-white h-[40px] px-4 rounded-lg border border-[#D9D9D9] focus:border-[#7D1EDB] outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] text-[#494949] font-medium">Holiday List</label>
            <select
              value={`${formData.holidayListName}__${formData.holidayYear}`}
              onChange={(e) => {
                const [holidayListName, holidayYear] = e.target.value.split("__");
                setFormData((prev) => ({
                  ...prev,
                  holidayListName: holidayListName || "",
                  holidayYear: holidayYear || "",
                }));
              }}
              className="bg-white h-[40px] px-4 rounded-lg border border-[#D9D9D9] focus:border-[#7D1EDB] outline-none"
            >
              <option value="__">Select Holiday List</option>
              {options.map((item) => (
                <option
                  key={`${item.holidayListName}-${item.holidayYear}`}
                  value={`${item.holidayListName}__${item.holidayYear}`}
                >
                  {item.holidayListName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
            className="h-5 w-5 accent-[#7D1EDB]"
          />
          <label className="text-[14px] text-[#1E1E1E] cursor-pointer select-none">Is Active</label>
        </div>
      </div>
    </div>
  );
};

export default NewLeavePeriod;
