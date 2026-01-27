import React, { useState, useEffect } from "react";
import { X, Calendar } from "lucide-react";
import FilterDropdown from "../../../components/ui/FilterDropdown";

const MarkAttendanceModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    employee: "",
    month: "",
    status: "",
    selectedDays: []
  });

  const EMPLOYEE_OPTIONS = [
    "HR-EMP-123", "HR-EMP-124", "HR-EMP-125", "HR-EMP-126", "HR-EMP-127"
  ];

  const MONTH_OPTIONS = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const STATUS_OPTIONS = [
     "Present", "Absent", "Half Day", "Work From Home"
  ];

  const UNMARKED_DAYS = [
      "01/01/2026", "02/01/2026", "03/01/2026", "04/01/2026",
      "05/01/2026", "06/01/2026", "07/01/2026", "08/01/2026"
  ];

  useEffect(() => {
    if(isOpen) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleDropdownChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDayToggle = (day) => {
      setFormData(prev => {
          const newDays = prev.selectedDays.includes(day) 
            ? prev.selectedDays.filter(d => d !== day)
            : [...prev.selectedDays, day];
          return { ...prev, selectedDays: newDays };
      });
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#3B3A3A82] z-50 flex justify-center items-center">
      <div
        className="bg-white rounded-xl p-6 w-[95%] md:w-[600px] shadow-xl relative"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {/* Modal Header */}
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

        {/* Form Fields */}
        <div className="flex flex-col gap-3 mb-6">
          
          {/* For Employee */}
          <div className="flex flex-col gap-[8px] border-[#D9D9D9]">
            <label className="text-[14px] font-normal text-[#1E1E1E]">
              For Employee
            </label>
            <FilterDropdown
                options={EMPLOYEE_OPTIONS}
                value={formData.employee}
                onChange={(val) => handleDropdownChange("employee", val)}
                placeholder="Select Employee"
                 className="w-full bg-white border border-[#E5E7EB] rounded-[8px] px-4 py-2 flex items-center justify-between outline-none"
                dropdownWidth="150px"
                align="right"
                optionFontFamily="'Nunito Sans', sans-serif"
            />
          </div>

          {/* For Month */}
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

          {/* Status */}
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

           {/* Unmarked Attendance For Days */}
           <div className="flex flex-col gap-[8px]">
                <label className="text-[14px] font-normal text-[#1E1E1E]">
                   Unmarked Attendance For Days
                </label>
                <div className="border border-[#E5E7EB] rounded-[8px] p-4 max-h-[150px] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-2 gap-y-3 gap-x-8">
                        {UNMARKED_DAYS.map((day, idx) => (
                            <label key={idx} className="flex items-center gap-3 cursor-pointer">
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
                </div>
           </div>

        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#7D1EDB] rounded-full text-[#7D1EDB] font-medium hover:bg-purple-50 transition-colors"
            style={{ borderRadius: "26px", fontFamily: "Poppins, sans-serif" }}
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#7D1EDB] text-white rounded-full font-medium hover:bg-purple-700 transition-colors shadow-sm"
            style={{ borderRadius: "26px", fontFamily: "Poppins, sans-serif" }}
          >
            Mark Attendance
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarkAttendanceModal;
