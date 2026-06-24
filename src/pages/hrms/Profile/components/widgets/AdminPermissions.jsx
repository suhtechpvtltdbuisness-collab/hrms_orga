import React from 'react';
import { ShieldCheck, Users, CheckSquare, FileText, Settings } from 'lucide-react';

const AdminPermissions = () => {
    return (
        <div className="bg-white rounded-[1.5rem] p-7 shadow-sm border border-gray-50">
            <div className="flex items-center gap-3 mb-8">
                <div className="text-[#7D1EDB] bg-[#F3ECFF] p-1.5 rounded-lg">
                    <ShieldCheck size={18} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg tracking-tight">Admin Permissions</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2.5 border border-gray-100 rounded-xl p-3 hover:bg-gray-50 transition-colors">
                    <Users size={16} className="text-[#00E676]" />
                    <span className="text-[12px] font-bold text-gray-800 leading-tight">Manage<br/>Employees</span>
                </div>
                <div className="flex items-center gap-2.5 border border-gray-100 rounded-xl p-3 hover:bg-gray-50 transition-colors">
                    <CheckSquare size={16} className="text-[#00E676]" />
                    <span className="text-[12px] font-bold text-gray-800 leading-tight">Approve<br/>Leaves</span>
                </div>
                <div className="flex items-center gap-2.5 border border-gray-100 rounded-xl p-3 hover:bg-gray-50 transition-colors">
                    <FileText size={16} className="text-[#00E676]" />
                    <span className="text-[12px] font-bold text-gray-800 leading-tight">View<br/>Reports</span>
                </div>
                <div className="flex items-center gap-2.5 border border-gray-100 rounded-xl p-3 hover:bg-gray-50 transition-colors">
                    <FileText size={16} className="text-[#00E676]" />
                    <span className="text-[12px] font-bold text-gray-800 leading-tight">Manage<br/>Payroll</span>
                </div>
                <div className="flex items-center gap-2.5 border border-gray-100 rounded-xl p-3 hover:bg-gray-50 transition-colors">
                    <Settings size={16} className="text-[#00E676]" />
                    <span className="text-[12px] font-bold text-gray-800 leading-tight">System<br/>Settings</span>
                </div>
                <div className="flex items-center gap-2.5 border border-gray-100 rounded-xl p-3 hover:bg-gray-50 transition-colors">
                    <FileText size={16} className="text-[#00E676]" />
                    <span className="text-[12px] font-bold text-gray-800 leading-tight">Announcements</span>
                </div>
            </div>
        </div>
    );
};

export default AdminPermissions;
