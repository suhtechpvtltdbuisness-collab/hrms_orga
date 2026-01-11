import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronRight, ArrowLeft } from "lucide-react";

import EmployeeProfileCard from "./EmployeeProfileCard";

// Tabs
import EmpLeave from "./EmpLeave";
import EmpPerformance from "./EmpPerformance";
import EmpDocuments from "./EmpDocument";
import EmpPayroll from "./EmpPayroll";
import EmpTrainingDevelopment from "./EmpTrainingDevelopment";
import EmpOffBoarding from "./EmpOffBoarding";
import EmpActivityLog from "./EmpActivityLog";
import EmpPersonalInfo from "./EmpPersonalInfo";
import EmpEmployment from "./EmpEmployment";
import EmpAttendance from "./EmpAttendance";
import { getEmployeeData } from "../../../../utils/employeeData";

const ViewEmployee = () => {
  const navigate = useNavigate();
  const { tab } = useParams();
  const tabsRef = useRef(null);
  const [employeeData, setEmployeeData] = useState(null);

  useEffect(() => {
    // Fetch initial data
    setEmployeeData(getEmployeeData());

    // Listen for updates
    const handleStorageUpdate = () => {
      setEmployeeData(getEmployeeData());
    };

    window.addEventListener('employeeDataUpdated', handleStorageUpdate);
    return () => window.removeEventListener('employeeDataUpdated', handleStorageUpdate);
  }, []);

  const tabConfig = [
    { name: "Personal Information", path: "personal-information", component: <EmpPersonalInfo /> },
    { name: "Employment", path: "employment", component: <EmpEmployment /> },
    { name: "Attendance", path: "attendance", component: <EmpAttendance /> },
    { name: "Leave", path: "leave", component: <EmpLeave /> },
    { name: "Performance", path: "performance", component: <EmpPerformance /> },
    { name: "Document", path: "documents", component: <EmpDocuments /> },
    { name: "Payroll", path: "payroll", component: <EmpPayroll /> },
    { name: "Training & Development", path: "training-development", component: <EmpTrainingDevelopment /> },
    { name: "Off Boarding", path: "off-board", component: <EmpOffBoarding /> },
    { name: "Activity Log", path: "activity-log", component: <EmpActivityLog /> },
  ];

  const activeTab = tabConfig.find(t => t.path === tab) || tabConfig[0];

  useEffect(() => {
    const el = tabsRef.current?.querySelector('[data-active="true"]');
    el?.scrollIntoView({ behavior: "smooth", inline: "center" });
  }, [tab]);

  const cardData = employeeData ? {
    name: employeeData.name || "Rohan Patil",
    designation: employeeData.designation || "Frontend Developer",
    empId: employeeData.empId || "EMP-1001",
    mobile: employeeData.mobile || "+91 98453647588",
    email: employeeData.email || "rohanp@company.com",
    location: employeeData.location || "Mumbai",
    joiningDate: employeeData.joiningDate || "15 Jan 2022",
    department: employeeData.department || "HR",
    manager: employeeData.manager || "Priya Sharma",
    status: employeeData.status || "Active"
  } : null;

  return (
    <div className="bg-white px-4 sm:px-6 md:px-8 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-9rem)] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-10rem)] xl:h-[calc(100vh-11rem)] flex flex-col border border-[#D9D9D9] font-sans" style={{ fontFamily: 'Poppins, sans-serif' }}>

      {/* Breadcrumb */}
      <div className="flex items-center text-sm mb-4 shrink-0">
        <span className="text-[#026E78] cursor-pointer hover:text-purple-600"
          onClick={() => navigate("/hrms/employees")}  >Employee List</span>
        <ChevronRight size={16} className="mx-1 hover:text-purple-600" />
        <span className="text-[#667085] font-base">Employee details</span>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h1 className="text-xl font-bold">Employee Information</h1>
        <button onClick={() => navigate("/hrms/employees-details-update", { state: { activeTab: activeTab.name } })} className="flex items-center gap-2 px-5 py-2 rounded-full border border-purple-600 text-purple-600 font-medium hover:bg-purple-50 transition-colors" > <span>Edit</span> <img src="/pencil.svg" alt="Edit" className="w-4 h-4" /> </button>
      </div>

      {/* Content Area - Split Layout */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 overflow-auto">

        {/* Left Side - Profile Card */}
        {activeTab.name === "Personal Information" && (
          <div className="w-full lg:w-[320px] shrink-0 h-auto lg:h-full">
            <EmployeeProfileCard
              data={cardData}
              profileImage={employeeData?.profileImage}
            />
          </div>
        )}

        {/* Right Side - Tabs & Content */}
        <div className="flex-1 min-w-0 h-full">
          <div className="flex flex-col h-full bg-white border border-[#D9D9D9] rounded-[24px] overflow-hidden">

            {/* Tabs Bar */}
            <div className="sticky top-0 z-10 bg-white pt-3 pb-1 px-3 border-b border-gray-100">
              <div ref={tabsRef} className="bg-[#EFEEE7] h-12 shrink-0 rounded-lg overflow-x-auto no-scrollbar flex">
                {tabConfig.map((t, index) => (
                  <button
                    key={t.path}
                    data-active={activeTab.path === t.path}
                    onClick={() => navigate(`/hrms/employees-details/${t.path}`)}
                    className={`px-4 h-full flex items-center justify-center text-sm font-medium whitespace-nowrap transition-all
                                ${index === 0 ? 'rounded-lg' : ''} 
                                ${index === tabConfig.length - 1 ? 'rounded-lg' : ''}
                                ${activeTab.path === t.path
                        ? "bg-[#7D1EDB] text-white rounded-lg"
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}
                            `}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area - Scrollable */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              {activeTab.component}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ViewEmployee;
