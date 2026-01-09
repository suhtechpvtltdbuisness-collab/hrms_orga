import React from "react";
import { useOutletContext } from "react-router-dom";

const DesignationOverview = () => {
  const { designationInfo, isEditing, formData, handleInputChange } =
    useOutletContext();

  const getValue = (key) =>
    isEditing ? formData?.[key] || "" : designationInfo?.[key] || "";

  return (
    <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2 pb-4">
      {/* Title */}
      <h2
        className="text-[20px] font-semibold text-[#000000] mb-4 px-2"
        style={{ fontFamily: '"Nunito Sans", sans-serif' }}
      >
        Designation Information
      </h2>

      {/* Form Content */}
      <div className="bg-white px-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Row 1 */}
          <div>
            <label className="block text-[#1E1E1E] mb-2 text-[16px]">
              Department
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData?.department || ""}
                onChange={(e) =>
                  handleInputChange("department", e.target.value)
                }
                className="px-4 py-2 rounded-lg text-[#1E1E1E] text-[16px] font-normal w-full outline-none focus:ring-1 focus:ring-purple-500"
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
          <div>
            <label className="block text-[#1E1E1E] mb-2 text-[16px]">
              Level / Grade
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData?.level || ""}
                onChange={(e) => handleInputChange("level", e.target.value)}
                className="px-4 py-2 rounded-lg text-[#1E1E1E] text-[16px] font-normal w-full outline-none focus:ring-1 focus:ring-purple-500"
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
          <div>
            <label className="block text-[#1E1E1E] mb-2 text-[16px]">
              Reporting Manager Designation
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData?.reportsTo || ""}
                onChange={(e) => handleInputChange("reportsTo", e.target.value)}
                className="px-4 py-2 rounded-lg text-[#1E1E1E] text-[16px] font-normal w-full outline-none focus:ring-1 focus:ring-purple-500"
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

          {/* Row 2 */}
          <div>
            <label className="block text-[#1E1E1E] mb-2 text-[16px]">
              Created On
            </label>
            <div
              className="px-4 py-2 rounded-lg text-[#757575] text-[16px] font-normal"
              style={{ background: "#F2F2F7", border: "1px solid #D9D9D9" }}
            >
              {designationInfo.createdOn}
            </div>
          </div>
          <div>
            <label className="block text-[#1E1E1E] mb-2 text-[16px]">
              Last Updated On
            </label>
            <div
              className="px-4 py-2 rounded-lg text-[#757575] text-[16px] font-normal"
              style={{ background: "#F2F2F7", border: "1px solid #D9D9D9" }}
            >
              {designationInfo.lastUpdated}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-[#1E1E1E] mb-2 text-[16px]">
            Description
          </label>
          {isEditing ? (
            <textarea
              value={formData?.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows="3"
              className="px-4 py-4 rounded-lg text-[#757575] text-[12px] font-normal w-full outline-none focus:ring-1 focus:ring-purple-500 resize-none"
              style={{ background: "#F2F2F7", border: "1px solid #D9D9D9" }}
            />
          ) : (
            <div
              className="px-4 py-4 rounded-lg text-[#757575] text-[12px] font-normal"
              style={{
                background: "#F2F2F7",
                border: "1px solid #D9D9D9",
                minHeight: "80px",
              }}
            >
              {designationInfo.description}
            </div>
          )}
        </div>

        {/* Responsibilities */}
        <div className="mb-8">
          <label className="block text-[#1E1E1E] mb-2 text-[16px]">
            Responsibilities
          </label>
          {isEditing ? (
            <textarea
              value={
                Array.isArray(formData?.responsibilities)
                  ? formData.responsibilities.join("\n")
                  : formData?.responsibilities || ""
              }
              onChange={(e) =>
                handleInputChange(
                  "responsibilities",
                  e.target.value.split("\n")
                )
              }
              rows="4"
              className="px-4 py-4 rounded-lg text-[#757575] text-[12px] font-normal w-full outline-none focus:ring-1 focus:ring-purple-500 resize-none"
              style={{ background: "#F2F2F7", border: "1px solid #D9D9D9" }}
            />
          ) : (
            <div
              className="px-4 py-4 rounded-lg text-[#757575] text-[12px] font-normal"
              style={{
                background: "#F2F2F7",
                border: "1px solid #D9D9D9",
                minHeight: "100px",
              }}
            >
              <ul className="list-disc pl-5">
                {(Array.isArray(designationInfo.responsibilities)
                  ? designationInfo.responsibilities
                  : []
                ).map((resp, i) => (
                  <li key={i}>{resp}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Deactivate Button */}
        <button className="px-6 py-3 bg-[#FF383C] text-white text-[17px] font-Poppins font-medium rounded-full hover:bg-[#E03125] transition-colors">
          Deactivate Designation
        </button>
      </div>
    </div>
  );
};

export default DesignationOverview;
