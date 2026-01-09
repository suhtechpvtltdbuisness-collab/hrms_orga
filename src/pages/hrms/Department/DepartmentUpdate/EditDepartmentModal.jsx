import React, { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";

const EditDepartmentModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    departmentName: "",
    departmentCode: "",
    departmentHead: "",
    location: "",
    description: "",
    parentDepartment: "",
    status: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [initialData, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#3B3A3A82] z-50 flex justify-center items-center">
      <div
        className="bg-white rounded-xl p-6 w-[95%] md:w-[700px] shadow-xl relative"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[18px] font-semibold text-[#393C46]">
            Edit Department
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Department Name */}
          <div className="flex flex-col gap-[8px]">
            <label className="text-[16px] font-base text-[#1E1E1E]">
              Department Name
            </label>
            <input
              type="text"
              name="departmentName"
              value={formData.departmentName}
              onChange={handleInputChange}
              placeholder="Enter department name"
              className="w-full h-[40px] px-4 py-2 border border-[#D9D9D9] rounded-[8px] text-[16px] font-base outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all placeholder:text-[#B8B8B8]"
            />
          </div>

          {/* Department Code */}
          <div className="flex flex-col gap-[8px]">
            <label className="text-[16px] font-base text-[#1E1E1E]">
              Department Code
            </label>
            <input
              type="text"
              name="departmentCode"
              value={formData.departmentCode}
              onChange={handleInputChange}
              placeholder="Enter department code"
              className="w-full h-[40px] px-4 py-2 border border-[#D9D9D9] rounded-[8px] text-[16px] font-base outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all placeholder:text-[#B8B8B8]"
            />
          </div>

          {/* Department Head */}
          <div className="flex flex-col gap-[8px]">
            <label className="text-[16px] font-base text-[#1E1E1E]">
              Department Head
            </label>
            <div className="relative">
              <select
                name="departmentHead"
                value={formData.departmentHead}
                onChange={handleInputChange}
                className="w-full h-[40px] px-4 py-2 border border-[#D9D9D9] rounded-[8px] text-[16px] font-base outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all appearance-none bg-white text-[#1E1E1E]"
              >
                <option value="">Select a department head</option>
                <option value="John Smith">John Smith</option>
                <option value="Alice Carol">Alice Carol</option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1E1E1E] pointer-events-none"
              />
            </div>
          </div>

          {/* Location */}
          <div className="flex flex-col gap-[8px]">
            <label className="text-[16px] font-base text-[#1E1E1E]">
              Location
            </label>
            <div className="relative">
              <select
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full h-[40px] px-4 py-2 border border-[#D9D9D9] rounded-[8px] text-[16px] font-base outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all appearance-none bg-white text-[#1E1E1E]"
              >
                <option value="">Select a location</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1E1E1E] pointer-events-none"
              />
            </div>
          </div>

          {/* Parent Department */}
          <div className="flex flex-col gap-[8px]">
            <label className="text-[16px] font-base text-[#1E1E1E]">
              Parent department
            </label>
            <div className="relative">
              <select
                name="parentDepartment"
                value={formData.parentDepartment}
                onChange={handleInputChange}
                className="w-full h-[40px] px-4 py-2 border border-[#D9D9D9] rounded-[8px] text-[16px] font-base outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all appearance-none bg-white text-[#1E1E1E]"
              >
                <option value="">Select parent department</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1E1E1E] pointer-events-none"
              />
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-[8px]">
            <label className="text-[16px] font-base text-[#1E1E1E]">
              Status
            </label>
            <div className="relative">
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full h-[40px] px-4 py-2 border border-[#D9D9D9] rounded-[8px] text-[16px] font-base outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all appearance-none bg-white text-[#1E1E1E]"
              >
                <option value="">Select status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1E1E1E] pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-[8px] mb-8">
          <label className="text[16px]m font-base text-[#1E1E1E]">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter department description"
            rows="3"
            className="w-full h-[80px] px-4 py-2 border border-[#D9D9D9] rounded-[8px] text-[16px] font-base outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all placeholder:text-[#B8B8B8] resize-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-8 py-2 border border-[#7D1EDB] rounded-full text-[#7D1EDB] font-medium hover:bg-purple-50 transition-colors"
            style={{ borderRadius: "30px" }}
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-8 py-2 bg-[#7D1EDB] text-white rounded-full font-medium hover:bg-purple-700 transition-colors shadow-sm"
            style={{ borderRadius: "30px" }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDepartmentModal;
