import React, { useState } from 'react';
import { ChevronDown } from "lucide-react";
import FilterDropdown from '../../../../components/ui/FilterDropdown';


const ActivityLog = ({ employeeId, employeeName }) => {
    const [selectedRange, setSelectedRange] = useState("Select Date range");
    
    const formatDate = (date) => {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        const dayStr = date.toLocaleDateString('en-GB', options);
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        return `${dayStr} - ${formattedHours}:${minutes} ${ampm}`;
    };

    // Calculate dates relative to today for mock data
    const today = new Date();
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
    const twoDaysAgo = new Date(today); twoDaysAgo.setDate(today.getDate() - 2);
    const lastWeek = new Date(today); lastWeek.setDate(today.getDate() - 6);
    const lastMonth = new Date(today); lastMonth.setDate(today.getDate() - 25);
    const twoMonthsAgo = new Date(today); twoMonthsAgo.setDate(today.getDate() - 60);

    // Mock data with dynamic dates
    const activities = [
        {
            dateObject: today,
            title: "Profile Updated",
            description: "HR Manager updated bank details (IFSC Code, Account Number)."
        },
        {
            dateObject: today,
            title: "Attendance Marked",
            description: "System marked employee as Present (Biometric)."
        },
        {
            dateObject: yesterday,
            title: "Leave Approved",
            description: "Team Lead approved Sick Leave – 1 Day."
        },
        {
            dateObject: lastWeek,
            title: "Payslip Generated",
            description: "Payroll team generated payslip for previous month."
        },
        {
            dateObject: lastMonth,
            title: "Login Activity",
            description: "Employee logged in via Web Dashboard."
        },
        {
            dateObject: twoMonthsAgo,
            title: "Password Changed",
            description: "Employee updated their account password."
        }
    ].map(item => ({
        ...item,
        date: formatDate(item.dateObject) 
    }));

    // Filter Logic
    const getFilteredActivities = () => {
        if (!selectedRange || selectedRange === "Select Date range") return activities;
        
        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        return activities.filter(activity => {
            const activityDate = activity.dateObject;
            if (selectedRange === 'Last 24 Hours') {
                return activityDate >= twentyFourHoursAgo;
            }
            if (selectedRange === 'Last Week') {
                return activityDate >= oneWeekAgo;
            }
            if (selectedRange === 'Last Month') {
                return activityDate >= oneMonthAgo;
            }
            return true;
        });
    };

    const filteredActivities = getFilteredActivities();

    return (
        <div className="h-full font-sans flex flex-col">
            {/* Main Heading outside container */}
            <h2 className="text-[18px] font-semibold text-[#1E1E1E] px-2" style={{ fontFamily: '"Inter", sans-serif' }}>Activity Log</h2>
            <div className="flex justify-end items-center mb-3">
                <div className="relative">
                    <FilterDropdown
                        placeholder="Select Date range"
                        options={['Last 24 Hours', 'Last Week', 'Last Month']}
                        value={selectedRange === "Select Date range" ? "" : selectedRange}
                        onChange={setSelectedRange}
                        className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-all cursor-pointer text-sm font-normal flex items-center justify-between min-w-[180px]"
                        buttonTextClassName="whitespace-nowrap"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl">
                {/* Banner */}
                <div
                    className="w-full h-[118px] rounded-xl p-[16px] mb-4 text-white"
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
                             <div className="pl-14 text-gray-500 italic">
                                No activities found for this time range.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityLog;
