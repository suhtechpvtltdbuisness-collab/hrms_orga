import React, { useState, useMemo } from 'react';
import { ChevronDown } from "lucide-react";
import FilterDropdown from '../../../../components/ui/FilterDropdown';


const EmpUpdateActivityLog = () => {
    const [selectedRange, setSelectedRange] = useState("Select Date range");

    // Mock data for the activity log with actual dates
    const allActivities = [
        {
            date: "5 Nov 2025 - 9:42 AM",
            actualDate: new Date("2025-11-05T09:42:00"),
            title: "Profile Updated",
            description: "HR Manager updated bank details (IFSC Code, Account Number)."
        },
        {
            date: "5 Nov 2025 - 9:00 AM",
            actualDate: new Date("2025-11-05T09:00:00"),
            title: "Attendance Marked",
            description: "System marked employee as Present (Biometric)."
        },
        {
            date: "4 Nov 2025 - 6:10 PM",
            actualDate: new Date("2025-11-04T18:10:00"),
            title: "Leave Approved",
            description: "Team Lead approved Sick Leave – 1 Day."
        },
        {
            date: "03 Nov 2025 - 5:45 PM",
            actualDate: new Date("2025-11-03T17:45:00"),
            title: "Payslip Generated",
            description: "Payroll team generated payslip for October 2025."
        },
        {
            date: "1 Nov 2025 - 9:12 AM",
            actualDate: new Date("2025-11-01T09:12:00"),
            title: "Login Activity",
            description: "Employee logged in via Web Dashboard."
        }
    ];

    // Filter activities based on selected date range
    const filteredActivities = useMemo(() => {
        const now = new Date("2025-11-05T10:00:00"); // Current date for demo
        let cutoffDate;

        switch (selectedRange) {
            case "Last 24 Hours":
                cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                break;
            case "Last Week":
                cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case "Last Month":
                cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            default:
                return allActivities;
        }

        return allActivities.filter(activity => activity.actualDate >= cutoffDate);
    }, [selectedRange]);

    // Get last updated date
    const lastUpdatedDate = filteredActivities.length > 0
        ? filteredActivities[0].date.split(' - ')[0]
        : "5 Nov 2025";

    return (
        <div className="h-full font-sans flex flex-col gap-4">
            {/* Header Area */}
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-[16px] font-semibold text-[#1E1E1E]" style={{ fontFamily: '"Inter", sans-serif' }}>Activity Log</h2>
                <div className="relative">
                    <FilterDropdown
                        placeholder="Select Date range"
                        options={['Select Date range', 'Last 24 Hours', 'Last Week', 'Last Month']}
                        value={selectedRange}
                        onChange={setSelectedRange}
                        className="bg-white border border-gray-200 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-all cursor-pointer text-sm font-normal flex items-center justify-between min-w-[180px]"
                        buttonTextClassName={`whitespace-nowrap ${selectedRange === "Select Date range" ? "text-gray-700" : ""}`}
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl">
                {/* Banner */}
                <div
                    className="w-full min-h-[118px] rounded-xl p-4 sm:p-[16px] mb-8 text-white"
                    style={{
                        background: 'linear-gradient(270deg, #D6FFE4 0%, #A484E3 100%)'
                    }}
                >
                    <p className="text-sm font-base mb-4 sm:mb-6 opacity-90" style={{ fontFamily: '"Inter", sans-serif' }}>Last Updated</p>
                    <h3 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: '"Inter", sans-serif' }}>{lastUpdatedDate}</h3>
                </div>

                {/* Timeline */}
                <div className="relative mt-4 px-2 sm:px-0">
                    {/* Vertical Line */}
                    <div className="absolute left-[9px] sm:left-[9px] top-2 bottom-2 w-[2px] bg-[#765DD3]"></div>

                    <div className="flex flex-col gap-6 sm:gap-8">
                        {filteredActivities.length > 0 ? (
                            filteredActivities.map((activity, index) => (
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
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No activities found for the selected date range.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmpUpdateActivityLog;
