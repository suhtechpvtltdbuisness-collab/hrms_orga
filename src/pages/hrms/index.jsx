import React from 'react';
import { ArrowUpRight, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ActivityHeatmap from './ActivityHeatmap';


const HRMS = () => {
    const navigate = useNavigate();

    // Categorized shortcuts matching the user's design
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
                { name: "Shift Type", path: "" },
                { name: "Shift Request", path: "" },
                { name: "Shift Assignment", path: "" },
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
        {
            title: "Leave",
            icon: "/images/report.svg",
            items: [
                { name: "Holiday List", path: "/hrms" },
            ]
        }
    ];

    const handleNavigation = (path) => {
        if (path) {
            navigate(path);
        }
    };

    return (
        <div className="bg-white px-4 sm:px-6 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-9rem)] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-10rem)] xl:h-[calc(100vh-11rem)] overflow-y-auto border border-[#D9D9D9]">
            {/* Header */}
            <div className="mb-4">
                <h1 className="text-xl font-semibold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>HRMS Dashboard</h1>
            </div>

            {/* Activity Heatmap Section */}
            <ActivityHeatmap />

            {/* Shortcuts */}
            <div>
                <h2 className="text-xl font-medium text-gray-900 mb-6" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Your Shortcuts</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
                    {shortcutGroups.map((group, index) => (
                        <div key={index} className="border border-[#E4E0E0] rounded-lg p-4 hover:shadow-sm transition-shadow h-fit min-h-[200px]">
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