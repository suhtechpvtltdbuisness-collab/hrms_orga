import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

const DesignationUpdate = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Default data fallback
  const defaultDesignation = {
    name: "Senior Product Manager",
    department: "Product",
    level: "5",
    reportsTo: "Director Of Product",
    employees: "5",
    createdOn: "2023-01-15 10:30 AM",
    lastUpdated: "2024-11-20 02:45 PM",
    description: "",
    responsibilities: [],
    status: "Active",
  };

  // Initialize formData from passed state or defaults
  const [formData, setFormData] = useState({
    ...defaultDesignation,
    ...(location.state?.designation || {}),
  });

  const designationInfo = formData;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveClick = () => {
    console.log("Saving data:", formData);
    // Navigate back to View page with updated data
    navigate("/hrms/designation-details/overview", {
      state: { designation: formData },
    });
  };

  const handleCancelClick = () => {
    // Navigate back to View page without saving
    navigate("/hrms/designation-details/overview", {
      state: { designation: formData },
    });
  };

  const currentTab = location.pathname.split("/").pop().toLowerCase();

  const tabs = [
    { label: "Overview", path: "overview" },
    { label: "Employees", path: "employees" },
    { label: "Org Structure", path: "org-structure" },
    { label: "Settings", path: "settings" },
  ];

  const activeTabObj = tabs.find((t) => t.path === currentTab) || tabs[0];
  const activeTab = activeTabObj.label;

  const handleTabClick = (path) => {
    // Stay in update route, just switch tab
    navigate(path, { state: { designation: formData } });
  };

  return (
    <div
      className="bg-white p-4 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-9rem)] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-10rem)] xl:h-[calc(100vh-11rem)] flex flex-col border border-[#D9D9D9] font-sans"
      style={{ fontFamily: '"Nunito Sans", sans-serif' }}
    >
      {/* Breadcrumb */}
      <div
        className="flex items-center text-[14px] text-[#7D1EDB] mb-4 shrink-0"
        style={{ fontFamily: "Mulish, sans-serif" }}
      >
        <div
          className="flex items-center gap-3"
          onClick={() => navigate("/hrms/designations")}
        >
          <img
            src="/images/arrow_left_alt.svg"
            alt="Back"
            className="cursor-pointer"
          />
          <span className="font-normal cursor-pointer hover:text-purple-500">
            Designation List
          </span>
        </div>
        <ChevronLeft size={16} className="mx-1 rotate-180" />
        <span
          className="text-[#667085] text-[14px] font-normal cursor-pointer"
          onClick={handleCancelClick}
        >
          Designation Details
        </span>
      </div>

      {/* Header */}
      <div className="flex justify-between items-start shrink-0">
        <div>
          <h1 className="text-[20px] font-semibold text-[#494949]">
            {formData.name}
          </h1>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleCancelClick}
            className="flex items-center justify-center text-[16px] font-medium mt-1 pt-0.5 w-[100px] h-[48px] border border-[#7D1EDB] text-[#7D1EDB] rounded-full hover:bg-[#EEECFF] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveClick}
            className="flex items-center justify-center text-[16px] font-medium mt-1 pt-0.5 w-[100px] h-[48px] bg-[#7D1EDB] text-white rounded-full hover:bg-[#6c1ac0] transition-colors"
          >
            Save
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-4 px-2 font-normal shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <img src="/images/department.svg" alt="dept" className="w-5 h-5" />
            <p className="text-[#7F7F7F] text-[18px]">Department</p>
          </div>
          <p className="text-[#1E1E1E] text-[17px] pl-7">
            {formData.department}
          </p>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <img src="/images/levels.svg" alt="level" className="w-5 h-5" />
            <p className="text-[#7F7F7F] text-[18px]">Level</p>
          </div>
          <p className="text-[#1E1E1E] text-[17px] pl-7">{formData.level}</p>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <img src="/images/report.svg" alt="report" className="w-5 h-5" />
            <p className="text-[#7F7F7F] text-[18px]">Reports To</p>
          </div>
          <p className="text-[#1E1E1E] text-[17px] pl-7">
            {formData.reportsTo}
          </p>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <img src="/images/employees.svg" alt="emp" className="w-5 h-5" />
            <p className="text-[#7F7F7F] text-[18px]">Employees</p>
          </div>
          <p className="text-[#1E1E1E] text-[17px] pl-7">
            {formData.employees}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 mb-6 bg-[#EEECFF] py-[7px] px-[9px] rounded-lg shrink-0"
        style={{ width: "500px", height: "49.93px" }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => handleTabClick(tab.path)}
            className={`px-5 py-2 rounded-[11px] text-[16px] font-medium cursor-pointer transition-all ${
              activeTab === tab.label
                ? "bg-[#7D1EDB] text-white "
                : "text-[#000000] hover:text-[#1E1E1E]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Outlet
        context={{
          designationInfo,
          isEditing: true,
          formData,
          handleInputChange,
        }}
      />
    </div>
  );
};

export default DesignationUpdate;
