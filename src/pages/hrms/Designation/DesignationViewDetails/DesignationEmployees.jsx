import React from "react";
import { useOutletContext } from "react-router-dom";

const DesignationEmployees = () => {
  const { designationInfo, isEditing, formData, handleInputChange } =
    useOutletContext();

  return (
    <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-4 pl-2 pb-4 ">
      {/* Employee Information Card */}
      <h2
        className="text-[20px] font-semibold text-[#000000] mb-4 px-2 w-full xl:w-[75%]"
        style={{ fontFamily: '"Nunito Sans", sans-serif' }}
      >
        Employee Information
      </h2>

      <div className="bg-white px-2 w-full xl:w-[75%]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
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
                className="px-4 py-2 rounded-lg text-[#1E1E1E] text-[16px] font-normal outline-none focus:ring-1 focus:ring-purple-500"
                style={{ background: "#F2F2F7", border: "1px solid #D9D9D9", width: "200px" }}
              />
            ) : (
              <div
                className="px-4 py-2 rounded-lg text-[#757575] text-[16px] font-normal"
                style={{ background: "#F2F2F7", border: "1px solid #D9D9D9", width: "200px" }}
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
                className="px-4 py-2 rounded-lg text-[#1E1E1E] text-[16px] font-normal outline-none focus:ring-1 focus:ring-purple-500"
                style={{ background: "#F2F2F7", border: "1px solid #D9D9D9", width: "200px" }}
              />
            ) : (
              <div
                className="px-4 py-2 rounded-lg text-[#757575] text-[16px] font-normal"
                style={{ background: "#F2F2F7", border: "1px solid #D9D9D9", width: "200px" }}
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
                className="px-4 py-2 rounded-lg text-[#1E1E1E] text-[16px] font-normal outline-none focus:ring-1 focus:ring-purple-500"
                style={{ background: "#F2F2F7", border: "1px solid #D9D9D9", width: "260px" }}
              />
            ) : (
              <div
                className="px-4 py-2 rounded-lg text-[#757575] text-[16px] font-normal"
                style={{ background: "#F2F2F7", border: "1px solid #D9D9D9", width: "260px" }}
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
              style={{ background: "#F2F2F7", border: "1px solid #D9D9D9", width: "230px" }}
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
              style={{ background: "#F2F2F7", border: "1px solid #D9D9D9", width: "230px" }}
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
              className="px-4 py-4 rounded-lg text-[#1E1E1E] text-[12px] font-normal w-full outline-none focus:ring-1 focus:ring-purple-500 resize-none"
              style={{ background: "#F2F2F7", border: "1px solid #D9D9D9", height: "80px" }}
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
              className="px-4 py-4 rounded-lg text-[#1E1E1E] text-[12px] font-normal w-full outline-none focus:ring-1 focus:ring-purple-500 resize-none"
              style={{ background: "#F2F2F7", border: "1px solid #D9D9D9", height: "128px" }}
            />
          ) : (
            <div
              className="px-4 py-4 rounded-lg text-[#757575] text-[12px] font-normal"
              style={{
                background: "#F2F2F7",
                border: "1px solid #D9D9D9",
                minHeight: "128px",
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

        {/* Assign Employee Button */}
        <div>
           <button className="px-6 py-3 bg-[#8A2BE2] text-white text-[16px] font-semibold rounded-full hover:bg-[#7a25c9] transition-colors">
            Assign Employee To Designation
          </button>
        </div>
      </div>
    </div>
  );
};

export default DesignationEmployees;
