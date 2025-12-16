import React from 'react';
import {
    LayoutDashboard,
    Users,
    Briefcase,
    UserCheck,
    CalendarDays,
    CheckSquare,
    BarChart3,
    Megaphone,
    MessageSquare,
    UserCircle,
    Settings,
    HelpCircle,
    LogOut,
    ChevronLeft
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();
    const isActive = (name) => {
        if (name === 'HRMS') return location.pathname.includes('/hrms');
        if (name === 'Dashboard') return location.pathname === '/';
        return false;
    };

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard },
        { name: 'HRMS', icon: Users },
        { name: 'Project Management', icon: Briefcase },
        { name: 'Attendance', icon: CalendarDays },
        { name: 'Tasks', icon: CheckSquare },
        { name: 'Reports', icon: BarChart3 },
        { name: 'Announcements', icon: Megaphone },
        { name: 'Messages', icon: MessageSquare },
        { name: 'My Profile', icon: UserCircle },
        { name: 'Settings', icon: Settings },
        { name: 'Support', icon: HelpCircle },
        { name: 'Departments', icon: Users }
    ];

    if (!isOpen) return null;

    return (
        <div className="w-70 h-screen rounded-2xl bg-white fixed left-0 top-0 z-20 flex flex-col pt-6 pb-4 shadow-sm border-r border-gray-100 overflow-y-auto font-sans transition-transform duration-300">
            {/* Logo Section with Toggle Button */}
            <div className="px-6 mb-8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <img src="/images/Orga Logo.svg" alt="ORGA" className="h-8" />
                </div>
                {/* Close Button */}
                <button
                    onClick={toggleSidebar}
                    className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-gray-400 hover:bg-purple-50 hover:text-purple-600 transition-colors border border-gray-100"
                >
                    <ChevronLeft size={24} />
                </button>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 px-4 space-y-1 mt-8">
                {menuItems.map((item) => {
                    const active = isActive(item.name);
                    return (
                        <Link
                            key={item.name}
                            to={
                                item.name === 'HRMS' ? '/hrms' :
                                  item.name ===  'Departments' ? '/hrms/departments' :
                                    item.name === 'Employees' ? '/hrms/employees' :
                                        '#'
                            }
                            className={`flex items-center px-4 py-3 cursor-pointer rounded-3xl transition-all duration-200 group text-base font-medium relative
                ${active
                                    ? 'bg-[#EEF2FF] text-[#7D1EDB]'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <item.icon
                                strokeWidth={2}
                                className={`w-5 h-5 mr-3 transition-colors ${active ? 'text-purple-600' : 'text-gray-400 group-hover:text-gray-600'
                                    }`}
                            />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout Section */}
            <div className="px-4 mt-6">
                <div className="flex items-center px-4 py-3 cursor-pointer text-gray-500 hover:text-red-500 transition-colors rounded-3xl hover:bg-red-50">
                    <LogOut className="w-5 h-5 mr-3" />
                    <span className="text-sm font-medium">Logout</span>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;