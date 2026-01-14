import React from 'react';
import { useOutletContext } from "react-router-dom";

const DesignationSettings = () => {
  const { designationInfo, isEditing, formData, handleInputChange } = useOutletContext();

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
              <input
                type="text"
                value={formData?.department || ""}
                onChange={(e) => handleInputChange("department", e.target.value)}
                placeholder="Enter department"
                className="w-full px-4 py-2 rounded-lg text-[#1E1E1E] text-[16px] font-normal outline-none focus:ring-1 focus:ring-purple-500 placeholder-[#A8A8A8]"
                style={{ background: "#F2F2F7", border: "1px solid #D9D9D9" }}
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
              <input
                type="text"
                value={formData?.level || ""}
                onChange={(e) => handleInputChange("level", e.target.value)}
                placeholder="Enter level"
                className="w-full px-4 py-2 rounded-lg text-[#1E1E1E] text-[16px] font-normal outline-none focus:ring-1 focus:ring-purple-500 placeholder-[#A8A8A8]"
                style={{ background: "#F2F2F7", border: "1px solid #D9D9D9" }}
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
            <label className="block text-[#1E1E1E] mb-2 text-[16px] font-normal">
              Reporting Manager Designation
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData?.reportsTo || ""}
                onChange={(e) => handleInputChange("reportsTo", e.target.value)}
                placeholder="Enter reporting manager"
                className="w-full px-4 py-2 rounded-lg text-[#1E1E1E] text-[16px] font-normal outline-none focus:ring-1 focus:ring-purple-500 placeholder-[#A8A8A8]"
                style={{ background: "#F2F2F7", border: "1px solid #D9D9D9" }}
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
