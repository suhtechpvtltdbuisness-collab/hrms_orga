import React from 'react';
import { useOutletContext } from "react-router-dom";
import FilterDropdown from "../../../../components/ui/FilterDropdown";

const DesignationSettings = () => {
  const { designationInfo, isEditing, formData, handleInputChange } = useOutletContext();

  const DEPARTMENT_OPTIONS = [
    "Engineering",
    "Product",
    "Sales",
    "Finance",
    "Human Resources",
    "Legal",
    "Design",
    "Administration",
    "Data & Analysis",
  ];
  const LEVEL_OPTIONS = ["L-1", "L-2", "L-3", "L-4", "L-5"];
  const MANAGER_DESIGNATION_OPTIONS = [
    "Director Of Product",
    "Senior Engineer",
    "Engineering Manager",
    "CTO",
    "CEO",
    "Product Manager"
  ];

  return (
    <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-4 pl-2 pb-4 ">
      <h2
        className="text-[20px] font-semibold text-[#000000] mb-4 px-2 w-full xl:w-[75%]"
        style={{ fontFamily: '"Nunito Sans", sans-serif' }}
      >
        Settings
      </h2>

      <div className="bg-white px-2 w-full xl:w-[75%]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* Department */}
          <div>
            <label className="block text-[#1E1E1E] mb-2 text-[16px] font-normal">
              Department
            </label>
            {isEditing ? (
              <FilterDropdown
                options={DEPARTMENT_OPTIONS}
                value={formData?.department || ""}
                onChange={(val) => handleInputChange("department", val)}
                placeholder="Select Department"
                className="px-4 py-2 w-[200px] rounded-lg text-[#1E1E1E] text-[16px] font-normal outline-none focus:ring-1 focus:ring-purple-500 bg-[#F2F2F7] border border-[#D9D9D9] flex items-center justify-between"
              />
            ) : (
              <div
                className="px-4 py-2 rounded-lg text-[#757575] text-[16px] font-normal"
                style={{ background: "#F2F2F7", border: "1px solid #D9D9D9" }}
              >
                {designationInfo.department}
              </div>
            )}
          </div>

          {/* Level / Grade */}
          <div>
            <label className="block text-[#1E1E1E] mb-2 text-[16px] font-normal">
              Level / Grade
            </label>
            {isEditing ? (
              <FilterDropdown
                options={LEVEL_OPTIONS}
                value={formData?.level || ""}
                onChange={(val) => handleInputChange("level", val)}
                placeholder="Select Level"
                className="w-[200px] px-4 py-2 rounded-lg text-[#1E1E1E] text-[16px] font-normal outline-none focus:ring-1 focus:ring-purple-500 bg-[#F2F2F7] border border-[#D9D9D9] flex items-center justify-between"
              />
            ) : (
              <div
                className="px-4 py-2 rounded-lg text-[#757575] text-[16px] font-normal"
                style={{ background: "#F2F2F7", border: "1px solid #D9D9D9" }}
              >
                {designationInfo.level}
              </div>
            )}
          </div>

          {/* Reporting Manager Designation */}
          <div>
            <label className="block text-[#1E1E1E] mb-2 text-[16px] font-normal whitespace-nowrap">
              Reporting Manager Designation
            </label>
            {isEditing ? (
              <FilterDropdown
                options={MANAGER_DESIGNATION_OPTIONS}
                value={formData?.reportsTo || ""}
                onChange={(val) => handleInputChange("reportsTo", val)}
                placeholder="Select Reporting Manager"
                className="w-[230px] px-4 py-2 rounded-lg text-[#1E1E1E] text-[16px] font-normal outline-none focus:ring-1 focus:ring-purple-500 bg-[#F2F2F7] border border-[#D9D9D9] flex items-center justify-between"
              />
            ) : (
              <div
                className="px-4 py-2 rounded-lg text-[#757575] text-[16px] font-normal"
                style={{ background: "#F2F2F7", border: "1px solid #D9D9D9" }}
              >
                {designationInfo.reportsTo}
              </div>
            )}
          </div>
        </div>

        {/* Responsibilities */}
        <div className="mb-8">
          <label className="block text-[#1E1E1E] mb-2 text-[16px] font-normal">
            Responsibilities
          </label>
          {isEditing ? (
            <textarea
              value={Array.isArray(formData?.responsibilities) ? formData.responsibilities.join("\n") : formData?.responsibilities || ""}
              onChange={(e) => handleInputChange("responsibilities", e.target.value.split("\n"))}
              placeholder="Add responsibilities....."
              className="w-full px-4 py-3 rounded-lg text-[#1E1E1E] text-[16px] font-normal outline-none focus:ring-1 focus:ring-purple-500 placeholder-[#A8A8A8] resize-none"
              style={{ background: "#F2F2F7", border: "1px solid #D9D9D9", height: "128px" }}
            ></textarea>
          ) : (
            <div
              className="px-4 py-3 rounded-lg text-[#757575] text-[16px] font-normal"
              style={{ background: "#F2F2F7", border: "1px solid #D9D9D9", minHeight: "128px" }}
            >
              <ul className="list-disc pl-5">
                {(Array.isArray(designationInfo.responsibilities) ? designationInfo.responsibilities : []).map((resp, i) => (
                  <li key={i}>{resp}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Activate Designation Button */}
        <div>
          <button
            className="bg-[#7D1EDB] text-white text-[16px] font-medium py-3 px-8 rounded-full hover:bg-[#6c1ac0] transition-colors"
          >
            Activate Designation
          </button>
        </div>
      </div>
    </div>
  );
};

export default DesignationSettings;
