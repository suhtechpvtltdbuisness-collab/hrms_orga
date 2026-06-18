import React, { useState } from 'react';
import {
  LayoutDashboard, UserCircle, Clock, CalendarDays, DollarSign,
  FolderOpen, CheckSquare, TrendingUp, Megaphone, Palmtree,
  Video, LifeBuoy, Settings, LogOut, ChevronLeft, ChevronRight,
  Building2
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../../service';

const menuGroups = [
  {
    label: 'Main',
    items: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/employee' },
      { name: 'My Profile', icon: UserCircle, path: '/employee/profile' },
    ],
  },
  {
    label: 'Work',
    items: [
      { name: 'Attendance', icon: Clock, path: '/employee/attendance' },
      { name: 'Leave Management', icon: CalendarDays, path: '/employee/leave' },
      { name: 'Tasks', icon: CheckSquare, path: '/employee/tasks' },
      { name: 'Performance', icon: TrendingUp, path: '/employee/performance' },
    ],
  },
  {
    label: 'Finance',
    items: [
      { name: 'Payroll & Payslips', icon: DollarSign, path: '/employee/payroll' },
      { name: 'Documents', icon: FolderOpen, path: '/employee/documents' },
    ],
  },
  {
    label: 'Company',
    items: [
      { name: 'Announcements', icon: Megaphone, path: '/employee/announcements' },
      { name: 'Holidays', icon: Palmtree, path: '/employee/holidays' },
      { name: 'Meetings', icon: Video, path: '/employee/meetings' },
    ],
  },
  {
    label: 'Help',
    items: [
      { name: 'Support', icon: LifeBuoy, path: '/employee/support' },
      { name: 'Settings', icon: Settings, path: '/employee/settings' },
    ],
  },
];

const EmployeeSidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    navigate('/auth');
    toast.success('Logged out successfully');
  };

  const isActive = (path) => {
    if (path === '/employee') return location.pathname === '/employee';
    return location.pathname.startsWith(path);
  };

  const handleItemClick = (item) => {
    navigate(item.path);
    if (window.innerWidth < 1260 && isOpen) toggleSidebar();
  };

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen z-50 flex flex-col
        bg-white border-r border-gray-100 shadow-sm
        transition-all duration-300
        ${isOpen ? 'w-[240px]' : 'w-[64px]'}
      `}
    >
      {/* Logo */}
      <div className={`relative flex items-center h-16 border-b border-gray-100 shrink-0 ${isOpen ? 'px-5' : 'justify-center'}`}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          {isOpen && (
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-gray-900 leading-tight">ORGA HRMS</p>
              <p className="text-[10px] text-violet-600 font-semibold uppercase tracking-wide">Employee Portal</p>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-500 hover:bg-violet-50 hover:text-violet-600 transition-all"
        >
          {isOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
        </button>
      </div>

      {/* Scrollable Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 no-scrollbar">
        {menuGroups.map((group) => (
          <div key={group.label} className="mb-1">
            {isOpen && (
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 py-2">
                {group.label}
              </p>
            )}
            {group.items.map((item) => {
              const active = isActive(item.path);
              return (
                <div
                  key={item.name}
                  onClick={() => handleItemClick(item)}
                  title={!isOpen ? item.name : undefined}
                  className={`
                    flex items-center cursor-pointer transition-all duration-150 mx-2 rounded-lg mb-0.5
                    ${isOpen ? 'px-3 py-2.5 gap-3' : 'justify-center py-3'}
                    ${active
                      ? 'bg-violet-50 text-violet-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <item.icon
                    className={`w-[18px] h-[18px] shrink-0 ${active ? 'text-violet-600' : 'text-gray-500'}`}
                    strokeWidth={active ? 2.2 : 1.8}
                  />
                  {isOpen && (
                    <span className={`text-sm font-medium truncate ${active ? 'text-violet-700 font-semibold' : ''}`}>
                      {item.name}
                    </span>
                  )}
                  {isOpen && active && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-600" />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-100 p-3 shrink-0">
        <div
          onClick={handleLogout}
          title={!isOpen ? 'Logout' : undefined}
          className={`
            flex items-center cursor-pointer rounded-lg transition-all duration-150
            text-red-500 hover:bg-red-50
            ${isOpen ? 'px-3 py-2.5 gap-3' : 'justify-center py-3'}
          `}
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" strokeWidth={1.8} />
          {isOpen && <span className="text-sm font-medium">Logout</span>}
        </div>
      </div>
    </aside>
  );
};

export default EmployeeSidebar;
