import React from 'react';
import { ArrowUpRight, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ActivityHeatmap from './ActivityHeatmap';


const HRMS = () => {
    const navigate = useNavigate();

    const shortcutGroups = [
        {
            title: "Hiring and Recruitment",
            icon: "/images/report.svg",
            items: [
                { name: "New Hiring", path: "" },
                { name: "New Job Opening", path: "/hrms/job-opening/new" },
                { name: "Schedule Interview", path: "" },
                { name: "New Onboarding", path: "" },
                { name: "Onboarded Employee List", path: "/hrms/onboarded-employee-list" },
            ]
        },
        {
            title: "Attendance",
            icon: "/images/report.svg",
            items: [
                { name: "Attendance List", path: "/hrms/attendance" },
                { name: "Employee Attendance Tool", path: "/hrms/employee-attendance-tool" },
                { name: "Upload Attendance", path: "/hrms/upload-attendance" },
                { name: "Employee Check-IN", path: "" },
                { name: "Attendance Request", path: "/hrms/request-attendance" },
            ]
        },
        {
            title: "Shift Management",
            icon: "/images/report.svg",
            items: [
                { name: "Shift Type", path: "/hrms/shift-type" },
                { name: "Shift Request", path: "/hrms/shift-request" },
                { name: "Shift Assignment", path: "/hrms/shift-assignment" },
            ]
        },
        {
            title: "Peformance",
            icon: "/images/report.svg",
            items: [
                { name: "Appraisal", path: "/hrms/appraisal/new" },
                { name: "Appraisal Template", path: "/hrms/appraisal-template" },
                { name: "Energy Point Rule", path: "/hrms/energy-point-rule" },
                { name: "Energy Point Log", path: "/hrms/energy-point-log" },
                { name: "Energy Point Settings", path: "/hrms/energy-point-setting" },
            ]
        },
        {
            title: "Leave",
            icon: "/images/report.svg",
            items: [
                { name: "Holiday List", path: "/hrms" },
                { name: "Leave Period", path: "/hrms/leave-period" },
                { name: "Leave Block List", path: "/hrms" },
                { name: "Compensatory Leave Request", path: "/hrms" },
                { name: "Leave Type", path: "/hrms" },
                { name: "Leave Policy Assignment", path: "/hrms" },
                { name: "Leave Application", path: "/hrms" },
                { name: "Leave Allocation", path: "/hrms" },
                { name: "Leave Encashment", path: "/hrms" },
                { name: "Leave Policy", path: "/hrms" }
            ]
        },
        {
            title: "Payroll",
            icon: "/images/report.svg",
            items: [
                { name: "Salary Component", path: "/hrms/salary-component" },
                { name: "Salary Structure", path: "/hrms/salary-structure" },
                { name: "Salary Structure Assignment", path: "/hrms/salary-structure-assignment" },
                { name: "Payroll Entry", path: "/hrms/payroll-entry" },
                { name: "Salary Slip", path: "/hrms/salary-slip" },
                { name: "Additional Salary", path: "/hrms/additional-salary" },
                { name: "Payroll Accounting", path: "/hrms/payroll-accounting" },
                { name: "Bank Integration For Salary Payout", path: "/hrms/bank-integration" }
            ]
        },
        {
            title: "Organization and Employee Setup",
            icon: "/images/report.svg",
            items: [
                { name: "Organization", path: "/hrms/organization-tree" },
                { name: "Department", path: "/hrms/departments" },
                { name: "Designation", path: "/hrms/designations" },
                { name: "Employee List", path: "/hrms/employees" },
                { name: "Settings", path: "/hrms/settings" },
            ]
        },
    ];

    const handleNavigation = (path) => {
        if (path) {
            navigate(path);
        }
    };

    return (
        <div className="bg-white px-4 sm:px-6 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] overflow-y-auto border border-[#D9D9D9]">
            {/* Header */}
            <div className="mb-4">
                <h1 className="text-xl font-semibold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>HRMS Dashboard</h1>
            </div>

            {/* Activity Heatmap Section */}
            <ActivityHeatmap />

            {/* Shortcuts */}
            <div>
                <h2 className="text-xl font-medium text-gray-900 mb-6" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Your Shortcuts</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {shortcutGroups.map((group, index) => (
                        <div key={index} className="border border-[#E4E0E0] rounded-lg p-4 h-full min-h-[200px]">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-1">
                                    <FileText className="w-6 h-6 text-[#1E1E1E]" />
                                </div>
                                <h3 className="font-medium text-[#1E1E1E] text-[16px]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                                    {group.title}
                                </h3>
                            </div>
                            
                            <div className="space-y-2">
                                {group.items.map((item, idx) => (
                                    <div 
                                        key={idx} 
                                        className="flex items-center gap-3 cursor-pointer group"
                                        onClick={() => handleNavigation(item.path)}
                                    >
                                        <div className="w-4 h-4 rounded-[4px] bg-[#7D1EDB] flex items-center justify-center shrink-0">
                                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                        </div>
                                        <span className="text-[16px] text-[#000000] group-hover:text-[#7D1EDB] transition-colors" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                                            {item.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>


        </div>

    );
};

export default HRMS;