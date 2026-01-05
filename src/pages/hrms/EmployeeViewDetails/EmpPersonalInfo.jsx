import React, { useState } from "react";
import { ChevronRight, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

import PersonalInfo from "../EmployeeTabs/PersonalInfo";
import EmpEmployment from "./EmpEmployment";
import EmpAttendance from "./EmpAttendance";
import EmpLeave from "./EmpLeave";
import EmpPerformance from "./EmpPerformance";
import EmpDocuments from "./EmpDocument";
import EmpPayroll from "./EmpPayroll";
import EmpTrainingDevelopment from "./EmpTrainingDevelopment";
import EmpOffBoarding from "./EmpOffBoarding";
import EmpActivityLog from "./EmpActivityLog";

const EmpPersonalInfo = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("Personal Information");

    const tabs = [
        "Personal Information",
        "Employment",
        "Attendance",
        "Leave",
        "Performance",
        "Documents",
        "Payroll",
        "Training & Development",
        "Off Boarding",
        "Activity Log",
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "Personal Information":
                return <PersonalInfo />;
            case "Employment":
                return <EmpEmployment />;
            case "Attendance":
                return <EmpAttendance />;
            case "Leave":
                return <EmpLeave />;

            case "Performance":
                return <EmpPerformance />;

            case "Documents":
                return <EmpDocuments />;

            case "Payroll":
                return <EmpPayroll />;

            case "Training & Development":
                return <EmpTrainingDevelopment />;

            case "Off Boarding":
                return <EmpOffBoarding />;

            case "Activity Log":
                return <EmpActivityLog />;
            default:
                return (
                    <div className="p-10 text-center text-gray-500 bg-white rounded-b-xl min-h-[400px]">
                        {activeTab}
                    </div>
                );
        }
    };

    return (
        <div className="mx-5 mt-5 font-sans">
            <div className="bg-white px-4 sm:px-6 md:px-8 py-6 mx-4 sm:mx-6 md:mx-0 mt-4 mb-4 rounded-xl h-[calc(100vh-11rem)] overflow-y-auto border border-[#D9D9D9]">

                {/* Breadcrumb */}
                <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span
                        className="cursor-pointer hover:text-purple-600"
                        onClick={() => navigate("/hrms/employees")}
                    >
                        Employees
                    </span>
                    <ChevronRight size={16} className="mx-1" />
                    <span className="text-gray-900 font-medium">View Employee Details</span>
                </div>

                {/* Header */}
                <div className="flex justify-between items-center mb-2">
                    <h1 className="text-xl font-bold text-gray-900 mb-4">Employee Information</h1>
                    <button className="flex items-center gap-2 px-5 py-2 rounded-full border border-purple-600 text-purple-600 font-medium hover:bg-purple-50 transition-colors cursor-pointer"
                        onClick={() => navigate("/hrms/employees-details-update")}>
                        <span>Edit</span>
                        <img
                            src="/pencil.svg"
                            alt="Edit"
                            className="w-4 h-4"
                        />


                    </button>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

                    {/* LEFT SIDE — Visible only on Personal Information tab */}
                    {activeTab === "Personal Information" && (
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">

                                <div className="flex flex-col items-center">
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-full flex items-center justify-center">
                                            <img
                                                src="/EMP_IMG.svg"
                                                alt="Employee"
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        </div>

                                        <button className="absolute bottom-0 right-0 text-white p-1 rounded-full cursor-pointer">
                                            <img src="/EMP_IMG_EDIT.svg" alt="" className="w-8 h-8" />
                                        </button>
                                    </div>

                                    <h2 className="mt-4 text-lg font-semibold text-gray-800">Rohan Patil</h2>
                                    <p className="text-sm text-gray-500">Frontend Developer</p>
                                    <p className="text-sm font-semibold text-gray-700 mt-1">EMP-1001</p>
                                </div>

                                <div className="mt-6 space-y-4 w-full">
                                    {[
                                        ["Mobile", "+9198453647588"],
                                        ["Email", "rohanp@company.com"],
                                        ["Location", "Mumbai"],
                                        ["Joining Date", "15 Jan 2022"],
                                        ["Department", "HR"],
                                        ["Manager", "Priya Sharma"],
                                        ["Status", "Active"],
                                    ].map(([label, value]) => (
                                        <div key={label}>
                                            <p className="text-xs text-gray-500 mb-1">{label}</p>
                                            <div className="text-sm text-gray-700 bg-gray-100 p-2 rounded">
                                                {value}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </div>
                    )}

                    {/* RIGHT SIDE */}
                    <div className={`bg-white rounded-xl border border-gray-200 flex flex-col ${activeTab === "Personal Information" ? "lg:col-span-3" : "lg:col-span-4"}`}
                        style={{ height: 'calc(100vh - 200px)' }}> {/* Adjust 200px according to your layout */}

                        {/* Tabs - Fixed at top */}
                        <div className="bg-[#EFEEE7] h-12 shrink-0 rounded-lg overflow-x-auto no-scrollbar flex">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 h-full flex items-center justify-center text-sm font-medium whitespace-nowrap transition-all
                    ${activeTab === tab
                                            ? "bg-[#7D1EDB] text-white rounded-lg"
                                            : "text-gray-600 hover:text-black hover:bg-gray-200"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Scrollable Content Area */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 pt-4">
                            {renderContent()}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default EmpPersonalInfo;
