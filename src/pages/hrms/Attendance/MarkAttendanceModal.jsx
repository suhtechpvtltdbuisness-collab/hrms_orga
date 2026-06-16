import React, { useState, useEffect } from "react";
import { X, Calendar } from "lucide-react";
import FilterDropdown from "../../../components/ui/FilterDropdown";
import {
  attendanceService,
  attendanceUtils,
  employeeService,
} from "../../../service";

const MarkAttendanceModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    employee: "",
    employeeId: "",
    month: "",
    status: "",
    leaveType: "",
    selectedDays: [],
  });
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [unmarkedDays, setUnmarkedDays] = useState([]);
  const [isLoadingDays, setIsLoadingDays] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState("");

  const MONTH_OPTIONS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const STATUS_OPTIONS = ["Present", "Absent", "Half Day", "Leave", "Work From Home"];
  const LEAVE_TYPE_OPTIONS = ["Sick Leave", "Personal Leave"];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      loadEmployees();
      setFormData({
        employee: "",
        employeeId: "",
        month: "",
        status: "",
        leaveType: "",
        selectedDays: [],
      });
      setUnmarkedDays([]);
      setLoadError("");
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const loadEmployees = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const adminId = userData.id || userData._id;
      if (!adminId) return;

      const response = await employeeService.getAllEmployeesByAdminId(adminId);
      if (response.success && Array.isArray(response.data)) {
        const options = response.data
          .map((item) => {
            const u = item.user || item;
            if (!u || !u.id) return null;
            return {
              label: u.name || u.email || `EMP-${u.id}`,
              value: String(u.id),
            };
          })
          .filter(Boolean);
        setEmployeeOptions(options);
      }
    } catch {
      setLoadError("Failed to load employees.");
    }
  };

  useEffect(() => {
    const fetchUnmarkedDays = async () => {
      if (!formData.employeeId || !formData.month) {
        setUnmarkedDays([]);
        return;
      }

      const month = attendanceUtils.monthNameToApi(formData.month);
      if (!month) return;

      setIsLoadingDays(true);
      setLoadError("");

      const response = await attendanceService.getUnmarkedDates(
        Number(formData.employeeId),
        month,
      );

      if (response.success) {
        const days = (response.data?.unmarkedDates || []).map(
          attendanceUtils.toDisplayDate,
        );
        setUnmarkedDays(days);
        setFormData((prev) => ({ ...prev, selectedDays: [] }));
      } else {
        setUnmarkedDays([]);
        setLoadError(response.message || "Failed to load unmarked days.");
      }

      setIsLoadingDays(false);
    };

    if (isOpen) {
      fetchUnmarkedDays();
    }
  }, [formData.employeeId, formData.month, isOpen]);

  const handleEmployeeChange = (empId) => {
    const selected = employeeOptions.find((opt) => opt.value === empId);
    setFormData((prev) => ({
      ...prev,
      employee: selected?.label || "",
      employeeId: empId,
      selectedDays: [],
    }));
  };

  const handleDropdownChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDayToggle = (day) => {
    setFormData((prev) => {
      const newDays = prev.selectedDays.includes(day)
        ? prev.selectedDays.filter((d) => d !== day)
        : [...prev.selectedDays, day];
      return { ...prev, selectedDays: newDays };
    });
  };

  const handleSubmit = async () => {
    if (!formData.employeeId || !formData.month || !formData.status) {
      setLoadError("Please select employee, month, and status.");
      return;
    }

    if (formData.selectedDays.length === 0) {
      setLoadError("Please select at least one day.");
      return;
    }

    if (formData.status === "Leave" && !formData.leaveType) {
      setLoadError("Please select a leave type.");
      return;
    }

    setIsSubmitting(true);
    setLoadError("");

    try {
      await onSave(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#3B3A3A82] z-50 flex justify-center items-center">
      <div
        className="bg-white rounded-xl p-6 w-[95%] md:w-[700px] shadow-xl relative"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[18px] font-semibold text-[#393C46]">
             Mark Attendance
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {loadError && (
          <p className="text-sm text-red-500 mb-4">{loadError}</p>
        )}

        <div className="flex flex-col gap-3 mb-6">
          <div className="flex flex-col gap-[8px]">
            <label className="text-[14px] font-normal text-[#1E1E1E]">
              For Employee
            </label>
            <FilterDropdown
                options={employeeOptions}
                value={formData.employeeId}
                onChange={handleEmployeeChange}
                placeholder="Select Employee"
                className="w-full bg-white border border-[#E5E7EB] rounded-[8px] px-4 py-2 flex items-center justify-between outline-none"
                dropdownWidth="150px"
                align="right"
                optionFontFamily="'Nunito Sans', sans-serif"
            />
          </div>

          <div className="flex flex-col gap-[8px] relative">
            <label className="text-[14px] font-normal text-[#1E1E1E]">
              For Month
            </label>
            <div className="relative">
                <FilterDropdown
                    options={MONTH_OPTIONS}
                    value={formData.month}
                    onChange={(val) => handleDropdownChange("month", val)}
                    placeholder="Select month"
                    className="w-full bg-white border border-[#E5E7EB] rounded-[8px] px-4 py-2 flex items-center justify-between outline-none"
                    dropdownWidth="150px"
                    align="right"
                    optionFontFamily="'Nunito Sans', sans-serif"
                    showArrow={false}
                />
                 <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#1E1E1E] pointer-events-none w-5 h-5" />
            </div>
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="text-[14px] font-normal text-[#1E1E1E]">
              Status
            </label>
            <FilterDropdown
                options={STATUS_OPTIONS}
                value={formData.status}
                onChange={(val) => handleDropdownChange("status", val)}
                placeholder="Select status"
                className="w-full bg-white border border-[#E5E7EB] rounded-[8px] px-4 py-2 flex items-center justify-between outline-none"
                dropdownWidth="200px"
                align="right"
                optionFontFamily="'Nunito Sans', sans-serif"
            />
          </div>

          {formData.status === "Leave" && (
            <div className="flex flex-col gap-[8px]">
              <label className="text-[14px] font-normal text-[#1E1E1E]">
                Leave Type
              </label>
              <FilterDropdown
                  options={LEAVE_TYPE_OPTIONS}
                  value={formData.leaveType}
                  onChange={(val) => handleDropdownChange("leaveType", val)}
                  placeholder="Select leave type"
                  className="w-full bg-white border border-[#E5E7EB] rounded-[8px] px-4 py-2 flex items-center justify-between outline-none"
                  dropdownWidth="200px"
                  align="right"
                  optionFontFamily="'Nunito Sans', sans-serif"
              />
            </div>
          )}

           <div className="flex flex-col gap-[8px]">
                <label className="text-[14px] font-normal text-[#1E1E1E]">
                   Unmarked Attendance For Days
                </label>
                <div className="border border-[#E5E7EB] rounded-[8px] p-4 max-h-[150px] overflow-y-auto custom-scrollbar">
                    {isLoadingDays ? (
                      <p className="text-sm text-gray-500">Loading unmarked days...</p>
                    ) : unmarkedDays.length > 0 ? (
                      <div className="grid grid-cols-2 gap-y-3 gap-x-8">
                          {unmarkedDays.map((day) => (
                              <label key={day} className="flex items-center gap-3 cursor-pointer">
                                  <input
                                      type="checkbox"
                                      checked={formData.selectedDays.includes(day)}
                                      onChange={() => handleDayToggle(day)}
                                      className="w-5 h-5 rounded border-gray-300 text-[#7D1EDB] focus:ring-[#7D1EDB]"
                                  />
                                  <span className="text-[14px] text-[#1E1E1E]">{day}</span>
                              </label>
                          ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        {formData.employeeId && formData.month
                          ? "No unmarked days for this month."
                          : "Select employee and month to view unmarked days."}
                      </p>
                    )}
                </div>
           </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 border border-[#7D1EDB] rounded-full text-[#7D1EDB] font-medium hover:bg-purple-50 transition-colors"
            style={{ borderRadius: "26px", fontFamily: "Poppins, sans-serif" }}
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-[#7D1EDB] text-white rounded-full font-medium hover:bg-purple-700 transition-colors shadow-sm disabled:opacity-60"
            style={{ borderRadius: "26px", fontFamily: "Poppins, sans-serif" }}
          >
            {isSubmitting ? "Saving..." : "Mark Attendance"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarkAttendanceModal;
