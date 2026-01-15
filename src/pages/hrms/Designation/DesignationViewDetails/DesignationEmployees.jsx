import React from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import FilterDropdown from "../../../../components/ui/FilterDropdown";

const DesignationEmployees = () => {
  const { designationInfo, isEditing, formData, handleInputChange } =
    useOutletContext();
    const navigate = useNavigate();

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
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    if (dateString.includes('/')) {
        const parts = dateString.split('/');
        if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    if (dateString.includes(' ')) {
        return dateString.split(' ')[0];
    }
    return dateString;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) return dateString;
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

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
              <FilterDropdown
                options={DEPARTMENT_OPTIONS}
                value={formData?.department || ""}
                onChange={(val) => handleInputChange("department", val)}
                placeholder="Select Department"
                className="w-[200px] px-4 py-2 rounded-lg text-[#1E1E1E] text-[16px] font-normal outline-none focus:ring-1 focus:ring-purple-500 bg-[#F2F2F7] border border-[#D9D9D9] flex items-center justify-between"
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
              <FilterDropdown
                options={MANAGER_DESIGNATION_OPTIONS}
                value={formData?.reportsTo || ""}
                onChange={(val) => handleInputChange("reportsTo", val)}
                placeholder="Select Reporting Manager"
                className="w-[260px] px-4 py-2 rounded-lg text-[#1E1E1E] text-[16px] font-normal outline-none focus:ring-1 focus:ring-purple-500 bg-[#F2F2F7] border border-[#D9D9D9] flex items-center justify-between"
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
            {isEditing ? (
                <div className="relative">
                    <input
                        type="date"
                        value={formatDateForInput(formData?.createdOn)}
                        onChange={(e) => handleInputChange('createdOn', e.target.value)}
                        className="px-4 py-2 rounded-lg text-[#1E1E1E] outline-none focus:ring-1 focus:ring-purple-500 appearance-none bg-[#F2F2F7] border border-[#D9D9D9]"
                        style={{
                            background: '#F2F2F7',
                            border: '1px solid #D9D9D9',
                            WebkitAppearance: 'none',
                            width: '230px'
                        }}
                        onClick={(e) => e.target.showPicker && e.target.showPicker()}
                    />
                    <img
                        src="/images/calender.svg"
                        alt="calendar"
                        className="absolute top-1/2 transform -translate-y-1/2 pointer-events-none w-5 h-5"
                        style={{ left: "195px" }}
                    />
                     <style jsx>{`
                        input[type="date"]::-webkit-calendar-picker-indicator {
                            opacity: 0;
                            position: absolute;
                            right: 0;
                            top: 0;
                            width: 100%;
                            height: 100%;
                            cursor: pointer;
                        }
                    `}</style>
                </div>
            ) : (
                <div
                  className="px-4 py-2 rounded-lg text-[#757575] text-[16px] font-normal flex justify-between items-center"
                  style={{ background: "#F2F2F7", border: "1px solid #D9D9D9", width: "230px" }}
                >
                  {formatDate(designationInfo.createdOn)}
                  <img src="/images/calender.svg" alt="calendar" className="w-5 h-5 ml-2" />
                </div>
            )}
          </div>
          <div>
            <label className="block text-[#1E1E1E] mb-2 text-[16px]">
              Last Updated On
            </label>
            {isEditing ? (
                <div className="relative">
                    <input
                        type="date"
                        value={formatDateForInput(formData?.lastUpdated)}
                        onChange={(e) => handleInputChange('lastUpdated', e.target.value)}
                        className="px-4 py-2 rounded-lg text-[#1E1E1E] outline-none focus:ring-1 focus:ring-purple-500 appearance-none bg-[#F2F2F7] border border-[#D9D9D9]"
                        style={{
                            background: '#F2F2F7',
                            border: '1px solid #D9D9D9',
                            WebkitAppearance: 'none',
                            width: '230px'
                        }}
                        onClick={(e) => e.target.showPicker && e.target.showPicker()}
                    />
                    <img
                        src="/images/calender.svg"
                        alt="calendar"
                        className="absolute top-1/2 transform -translate-y-1/2 pointer-events-none w-5 h-5"
                        style={{ left: "195px" }}
                    />
                </div>
            ) : (
                <div
                  className="px-4 py-2 rounded-lg text-[#757575] text-[16px] font-normal flex justify-between items-center"
                  style={{ background: "#F2F2F7", border: "1px solid #D9D9D9", width: "230px" }}
                >
                  {formatDate(designationInfo.lastUpdated)}
                  <img src="/images/calender.svg" alt="calendar" className="w-5 h-5 ml-2" />
                </div>
            )}
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
