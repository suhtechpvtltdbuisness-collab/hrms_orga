import React, { useEffect, useRef } from "react";
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

const ViewEmployee = () => {
  const navigate = useNavigate();
  const { tab } = useParams();
  const tabsRef = useRef(null);

  const tabConfig = [
    { name: "Personal Information", path: "personal-information", component: <EmpPersonalInfo /> },
    { name: "Employment", path: "employment", component: <EmpEmployment /> },
    { name: "Attendance", path: "attendance", component: <EmpAttendance /> },
    { name: "Leave", path: "leave", component: <EmpLeave /> },
    { name: "Performance", path: "performance", component: <EmpPerformance /> },
    { name: "Document", path: "documents", component: <EmpDocuments/> },
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

  return (
    <div className="bg-white px-6 py-6 mx-4 my-4 rounded-xl border border-[#D9D9D9]">

      {/* Breadcrumb */}
      <div className="flex items-center text-sm mb-4">
        <ArrowLeft
          size={14}
          className="cursor-pointer mr-2"
          onClick={() => navigate("/hrms/employees")}
        />
        <span className="text-gray-500 cursor-pointer hover:text-purple-600"
          onClick={() => navigate("/hrms/employees")}  >Employee List</span>
        <ChevronRight size={16} className="mx-1 hover:text-purple-600" />
        <span className="text-gray-900 font-medium">View Employee</span>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Employee Information</h1>
        <button onClick={() => navigate("/hrms/employees-details-update")} className="flex items-center gap-2 px-5 py-2 rounded-full border border-purple-600 text-purple-600 font-medium hover:bg-purple-50 transition-colors" > <span>Edit</span> <img src="/pencil.svg" alt="Edit" className="w-4 h-4" /> </button>
      </div>

      {/* MAIN CARD */}
      <div className="border border-[#D9D9D9] rounded-3xl p-1">

        {/* Tabs */}
        <div ref={tabsRef} className="bg-[#EFEEE7] h-12 rounded-lg flex overflow-x-auto no-scrollbar px-2">
          {tabConfig.map(t => (
            <button
              key={t.path}
              data-active={activeTab.path === t.path}
              onClick={() => navigate(`/hrms/employees-details/${t.path}`)}
              className={`px-6 h-full text-sm font-medium whitespace-nowrap
                ${activeTab.path === t.path
                  ? "bg-[#7D1EDB] text-white rounded-lg"
                  : "text-gray-600 hover:bg-gray-200"}
              `}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* CONTENT GRID */}
        <div className="p-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
          {activeTab.path === "personal-information" && (
            <div className="lg:col-span-1">
              <EmployeeProfileCard />
            </div>
          )}

          <div
            className={`bg-white rounded-xl border border-gray-200 p-4
              ${activeTab.path === "personal-information"
                ? "lg:col-span-3"
                : "lg:col-span-4"}
            `}
          >
            {activeTab.component}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEmployee;
