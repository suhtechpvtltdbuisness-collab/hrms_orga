import React from 'react';
import {
  LayoutDashboard,
  Users,
  Briefcase,
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
    ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <aside
      className={`
    fixed left-0 top-0 h-screen
    bg-white border-r border-gray-100 shadow-sm
    flex flex-col font-sans
    transition-all duration-300
    ${isOpen ? 'w-70 p-5' : 'w-16 py-4 px-2'}
  `}
    >

      {/* Logo + Toggle */}
      <div className="flex items-center justify-between mb-6 h-10">
        <img
          src={isOpen ? '/images/Orga Logo.svg' : '/images/orga A.svg'}
          alt="ORGA"
          className={`transition-all duration-300 ${isOpen ? 'h-7' : 'h-6 mx-auto'
            }`}
        />

        <button
          onClick={toggleSidebar}
          className={`w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center
           text-gray-400 hover:bg-purple-50 hover:text-purple-600 transition border border-gray-100 cursor-pointer
            ${!isOpen ? 'ml-4' : ''}`}
        >
          <ChevronLeft
            size={20}
            className={`transition-transform duration-300 ${!isOpen ? 'rotate-180' : ''
              }`}
          />
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

      {/* Logout */}
      <div className="mt-auto pt-4 border-t border-gray-100">
        <div
          className={`
            flex items-center rounded-3xl cursor-pointer transition
            ${isOpen ? 'gap-3 px-4 py-2.5' : 'justify-center py-3'}
            text-gray-600 hover:text-red-500 hover:bg-red-50
          `}
        >
          <LogOut size={18} />
          {isOpen && <span className="text-sm font-medium">Logout</span>}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
