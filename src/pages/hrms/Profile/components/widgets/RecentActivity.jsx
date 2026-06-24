import React from 'react';
import { Clock, FileText, Users, Settings } from 'lucide-react';

const RecentActivity = () => {
    return (
        <div className="bg-white rounded-[1.5rem] p-7 shadow-sm border border-gray-50">
            <div className="flex items-center gap-3 mb-8">
                <div className="text-[#7D1EDB] bg-[#F3ECFF] p-1.5 rounded-lg">
                    <Clock size={18} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg tracking-tight">Recent Activity</h3>
            </div>

            <div className="space-y-6">
                <div className="flex items-start justify-between group">
                    <div className="flex gap-5">
                        <div className="bg-purple-100 text-purple-600 w-11 h-11 rounded-[10px] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <FileText size={20} />
                        </div>
                        <div className="mt-0.5">
                            <p className="font-bold text-gray-900 text-[15px]">Approved leave request for Rahul Sharma</p>
                            <p className="text-[13px] text-gray-500 font-medium mt-1">Today, 10:30 AM</p>
                        </div>
                    </div>
                    <span className="bg-purple-50 text-purple-700 text-[11px] font-bold px-3 py-1.5 rounded-full">Leave</span>
                </div>

                <div className="flex items-start justify-between group">
                    <div className="flex gap-5">
                        <div className="bg-blue-100 text-blue-600 w-11 h-11 rounded-[10px] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <Users size={20} />
                        </div>
                        <div className="mt-0.5">
                            <p className="font-bold text-gray-900 text-[15px]">Onboarded new employee — Priya Mehta</p>
                            <p className="text-[13px] text-gray-500 font-medium mt-1">Yesterday, 3:15 PM</p>
                        </div>
                    </div>
                    <span className="bg-blue-50 text-blue-700 text-[11px] font-bold px-3 py-1.5 rounded-full">HR</span>
                </div>

                <div className="flex items-start justify-between group">
                    <div className="flex gap-5">
                        <div className="bg-green-100 text-green-600 w-11 h-11 rounded-[10px] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <FileText size={20} />
                        </div>
                        <div className="mt-0.5">
                            <p className="font-bold text-gray-900 text-[15px]">Updated attendance report for August</p>
                            <p className="text-[13px] text-gray-500 font-medium mt-1">22 Jun, 11:00 AM</p>
                        </div>
                    </div>
                    <span className="bg-green-50 text-green-700 text-[11px] font-bold px-3 py-1.5 rounded-full">Report</span>
                </div>

                <div className="flex items-start justify-between group">
                    <div className="flex gap-5">
                        <div className="bg-yellow-100 text-yellow-600 w-11 h-11 rounded-[10px] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <Settings size={20} />
                        </div>
                        <div className="mt-0.5">
                            <p className="font-bold text-gray-900 text-[15px]">Updated system notification settings</p>
                            <p className="text-[13px] text-gray-500 font-medium mt-1">20 Jun, 9:45 AM</p>
                        </div>
                    </div>
                    <span className="bg-[#F3ECFF] text-[#7D1EDB] text-[11px] font-bold px-3 py-1.5 rounded-full">System</span>
                </div>
            </div>
        </div>
    );
};

export default RecentActivity;
