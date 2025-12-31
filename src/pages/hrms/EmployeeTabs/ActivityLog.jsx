import React, { useState } from 'react';
import { ChevronDown } from "lucide-react";


const ActivityLog = () => {
    const [selectedRange, setSelectedRange] = useState("Select Date range");

    // Mock data for the activity log
    const activities = [
        {
            date: "5 Nov 2025 - 9:42 AM",
            title: "Profile Updated",
            description: "HR Manager updated bank details (IFSC Code, Account Number)."
        },
        {
            date: "5 Nov 2025 - 9:00 AM",
            title: "Attendance Marked",
            description: "System marked employee as Present (Biometric)."
        },
        {
            date: "4 Nov 2025 - 6:10 PM",
            title: "Leave Approved",
            description: "Team Lead approved Sick Leave – 1 Day."
        },
        {
            date: "03 Nov 2025 - 5:45 PM",
            title: "Payslip Generated",
            description: "Payroll team generated payslip for October 2025."
        },
        {
            date: "1 Nov 2025 - 9:12 AM",
            title: "Login Activity",
            description: "Employee logged in via Web Dashboard."
        }
    ];

    return (
        <div className="h-full font-sans flex flex-col gap-4">
            {/* Main Heading outside container */}
            <h2 className="text-[16px] font-semibold text-[#1E1E1E]" style={{ fontFamily: '"Inter", sans-serif' }}>Activity Log</h2>
            <div className="flex justify-end items-center mb-4">
                <div className="absolute">
                    <select
                        className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 px-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-all cursor-pointer text-sm font-normal"
                        style={{ fontFamily: '"Inter", sans-serif' }}
                        value={selectedRange}
                        onChange={(e) => setSelectedRange(e.target.value)}
                    >
                        <option>Select Date range</option>
                        <option>Last 24 Hours</option>
                        <option>Last Week</option>
                        <option>Last Month</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
            </div>

            <div className="bg-white rounded-xl">
                {/* Banner */}
                <div
                    className="w-full h-[118px] rounded-xl p-[16px] mb-8 text-white"
                    style={{
                        background: 'linear-gradient(270deg, #D6FFE4 0%, #A484E3 100%)'
                    }}
                >
                    <p className="text-sm font-base mb-6 opacity-90" style={{ fontFamily: '"Inter", sans-serif' }}>Last Updated</p>
                    <h3 className="text-3xl font-bold" style={{ fontFamily: '"Inter", sans-serif' }}>5 Nov 2025</h3>
                </div>

                {/* Timeline */}
                <div className="relative mt-4">
                    {/* Vertical Line */}
                    <div className="absolute left-[9px] top-2 bottom-2 w-[2px] bg-[#765DD3]"></div>

                    <div className="flex flex-col gap-8">
                        {activities.map((activity, index) => (
                            <div key={index} className="relative pl-14">
                                {/* Dot Indicator */}
                                <div className="absolute left-[2px] top-1.5 w-4 h-4 rounded-full bg-[#765DD3] z-10"></div>

                                {/* Content */}
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-base text-[#1E1E1E]" style={{ fontFamily: '"Inter", sans-serif' }}>
                                        {activity.date}
                                    </span>
                                    <h4 className="text-sm font-base text-[#1E1E1E]" style={{ fontFamily: '"Inter", sans-serif' }}>
                                        {activity.title}
                                    </h4>
                                    <p className="text-sm text-[#757575]" style={{ fontFamily: '"Inter", sans-serif' }}>
                                        {activity.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityLog;
