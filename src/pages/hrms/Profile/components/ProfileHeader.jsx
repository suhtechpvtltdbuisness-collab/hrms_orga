import React from 'react';
import { LayoutDashboard, KeyRound, Edit, FileText, Mail, Phone, Building, Calendar } from 'lucide-react';

const ProfileHeader = ({ userData, userRole, initials, userImage, joinDate, location, onEditProfile, onChangePassword }) => {
    const userName = userData.name || userData.firstName || 'Testing User';
    const email = userData.email || 'testing@orga.com';
    const phone = userData.phone || userData.mobile || '+91 98765 43210';
    const employeeId = userData.employeeId || userData.id || 'EMP-00421';

    return (
        <>
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-400">
                        <LayoutDashboard size={20} />
                    </div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
                        <span className="text-gray-300">/</span>
                        <span className="text-gray-500 text-sm font-medium">{userRole}</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={onChangePassword}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 shadow-sm rounded-xl text-sm font-bold text-gray-400 hover:text-gray-600 hover:border-gray-200 transition-colors cursor-pointer"
                    >
                        <KeyRound size={16} />
                        Change Password
                    </button>
                    <button 
                        onClick={onEditProfile}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#7D1EDB] border border-transparent shadow-sm rounded-xl text-sm font-bold text-white hover:bg-[#6012a8] transition-colors cursor-pointer"
                    >
                        <Edit size={16} />
                        Edit Profile
                    </button>
                </div>
            </div>

            {/* Profile Header Card */}
            <div className="bg-white rounded-[2rem] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-50 mb-6">
                <div className="flex flex-col md:flex-row gap-8 md:items-start">
                    {/* Avatar */}
                    <div className="relative shrink-0 mt-2">
                        {userImage && !userImage.includes('EMP_IMG.svg') ? (
                            <img src={userImage} alt={userName} className="w-[104px] h-[104px] rounded-full object-cover" />
                        ) : (
                            <div className="w-[104px] h-[104px] rounded-full bg-[#7D1EDB] flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                                {initials}
                            </div>
                        )}
                        <div className="absolute bottom-1 right-1 w-6 h-6 bg-[#00E676] rounded-full border-[3px] border-white"></div>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h2 className="text-[28px] font-bold text-gray-900 tracking-tight">{userName}</h2>
                            <div className="bg-blue-50 text-blue-500 p-1.5 rounded-lg ml-1">
                                <FileText size={16} />
                            </div>
                            <span className="bg-[#F3ECFF] text-[#7D1EDB] px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                {userRole}
                            </span>
                        </div>
                        
                        <p className="text-[#7D1EDB] font-bold text-[15px] mb-5 tracking-wide">
                            {userRole === 'Super Admin' ? 'System Administrator · ORGA HRMS' : `${userData.designation || 'Employee'} · ORGA HRMS`}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-gray-500 font-medium mb-8">
                            <div className="flex items-center gap-2.5">
                                <div className="p-1.5 bg-gray-50 rounded-md"><Mail size={16} className="text-gray-400" /></div>
                                {email}
                            </div>
                            <div className="flex items-center gap-2.5">
                                <div className="p-1.5 bg-gray-50 rounded-md"><Phone size={16} className="text-gray-400" /></div>
                                {phone}
                            </div>
                            <div className="flex items-center gap-2.5">
                                <div className="p-1.5 bg-gray-50 rounded-md"><Building size={16} className="text-gray-400" /></div>
                                {location}
                            </div>
                            <div className="flex items-center gap-2.5">
                                <div className="p-1.5 bg-gray-50 rounded-md"><Calendar size={16} className="text-gray-400" /></div>
                                Joined {joinDate}
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div className="flex flex-wrap gap-4">
                            <div className="flex flex-col items-center justify-center border border-gray-100 rounded-2xl px-8 py-3.5 min-w-[130px] shadow-sm hover:border-gray-200 transition-colors cursor-default">
                                <span className="text-[22px] font-bold text-gray-900 mb-0.5">9</span>
                                <span className="text-[11px] text-gray-400 font-bold tracking-wide">Employees</span>
                            </div>
                            <div className="flex flex-col items-center justify-center border border-gray-100 rounded-2xl px-8 py-3.5 min-w-[130px] shadow-sm hover:border-gray-200 transition-colors cursor-default">
                                <span className="text-[22px] font-bold text-gray-900 mb-0.5">15</span>
                                <span className="text-[11px] text-gray-400 font-bold tracking-wide">Active Tasks</span>
                            </div>
                            <div className="flex flex-col items-center justify-center border border-gray-100 rounded-2xl px-8 py-3.5 min-w-[130px] shadow-sm hover:border-gray-200 transition-colors cursor-default">
                                <span className="text-[22px] font-bold text-gray-900 mb-0.5">3</span>
                                <span className="text-[11px] text-gray-400 font-bold tracking-wide">Departments</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfileHeader;
