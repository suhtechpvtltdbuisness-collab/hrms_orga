import React from 'react';
import { Building, FileText, Calendar, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';

const WorkInformation = ({ employeeId, department, joinDate, userRole }) => {
    return (
        <div className="bg-white rounded-[1.5rem] p-7 shadow-sm border border-gray-50">
            <div className="flex items-center gap-3 mb-8">
                <div className="text-[#7D1EDB] bg-[#F3ECFF] p-1.5 rounded-lg">
                    <Building size={18} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg tracking-tight">Work Information</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="border border-gray-100 rounded-[1.25rem] p-6 hover:border-purple-200 hover:shadow-sm transition-all bg-[#FAFAFA] hover:bg-white cursor-default group">
                    <div className="bg-purple-100 text-purple-600 w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <FileText size={18} />
                    </div>
                    <p className="text-[11px] font-bold text-gray-400 tracking-wider mb-1.5">EMPLOYEE ID</p>
                    <p className="font-extrabold text-gray-900 text-base">{employeeId}</p>
                </div>
                
                <div className="border border-gray-100 rounded-[1.25rem] p-6 hover:border-blue-200 hover:shadow-sm transition-all bg-[#FAFAFA] hover:bg-white cursor-default group">
                    <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Building size={18} />
                    </div>
                    <p className="text-[11px] font-bold text-gray-400 tracking-wider mb-1.5">DEPARTMENT</p>
                    <p className="font-extrabold text-gray-900 text-base">{department}</p>
                </div>

                <div className="border border-gray-100 rounded-[1.25rem] p-6 hover:border-pink-200 hover:shadow-sm transition-all bg-[#FAFAFA] hover:bg-white cursor-default group">
                    <div className="bg-pink-100 text-pink-600 w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Calendar size={18} />
                    </div>
                    <p className="text-[11px] font-bold text-gray-400 tracking-wider mb-1.5">DATE OF JOINING</p>
                    <p className="font-extrabold text-gray-900 text-base">{joinDate}</p>
                </div>

                <div className="border border-gray-100 rounded-[1.25rem] p-6 hover:border-green-200 hover:shadow-sm transition-all bg-[#FAFAFA] hover:bg-white cursor-default group">
                    <div className="bg-green-100 text-green-600 w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <CheckCircle2 size={18} />
                    </div>
                    <p className="text-[11px] font-bold text-gray-400 tracking-wider mb-1.5">STATUS</p>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#00E676]"></div>
                        <p className="font-extrabold text-gray-900 text-base">Active</p>
                    </div>
                </div>

                <div className="border border-gray-100 rounded-[1.25rem] p-6 hover:border-yellow-200 hover:shadow-sm transition-all bg-[#FAFAFA] hover:bg-white cursor-default group">
                    <div className="bg-yellow-100 text-yellow-600 w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <ShieldCheck size={18} />
                    </div>
                    <p className="text-[11px] font-bold text-gray-400 tracking-wider mb-1.5">ROLE</p>
                    <p className="font-extrabold text-gray-900 text-base">{userRole}</p>
                </div>

                <div className="border border-gray-100 rounded-[1.25rem] p-6 hover:border-cyan-200 hover:shadow-sm transition-all bg-[#FAFAFA] hover:bg-white cursor-default group">
                    <div className="bg-cyan-100 text-cyan-600 w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Clock size={18} />
                    </div>
                    <p className="text-[11px] font-bold text-gray-400 tracking-wider mb-1.5">WORK HOURS</p>
                    <p className="font-extrabold text-gray-900 text-base">9:00 – 6:00</p>
                </div>
            </div>
        </div>
    );
};

export default WorkInformation;
