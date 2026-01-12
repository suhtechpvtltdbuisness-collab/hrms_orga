import React from 'react';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Mail,
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
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Navigate to login page
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboards' },
    { name: 'HRMS', icon: Users, path: '/hrms' },
    { name: 'Project Management', icon: Briefcase, path: '/projects' },
    { name: 'Employees', icon: Mail, path: '/employees' },
    { name: 'Attendance', icon: CalendarDays, path: '/attendance' },
    { name: 'Tasks', icon: CheckSquare, path: '/tasks' },
    { name: 'Reports', icon: BarChart3, path: '/reports' },
    { name: 'Announcements', icon: Megaphone, path: '/announcements' },
    { name: 'Messages', icon: MessageSquare, path: '/messages' },
    { name: 'My Profile', icon: UserCircle, path: '/profile' },
    { name: 'Settings', icon: Settings, path: '/hrms/settings' },
    { name: 'Support', icon: HelpCircle, path: '/support' }
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen z-20
        bg-white border-r border-gray-100 shadow-sm
        transition-all duration-300 flex flex-col rounded-xl
        ${isOpen ? 'w-70 px-5 py-5' : 'w-16 py-4'}
      `}
    >
      {/* Logo */}
      <div className={`relative flex items-center mb-6 h-10 ${isOpen ? 'justify-start' : 'justify-center'}`}>
        <img
          src={isOpen ? '/images/Orga Logo.svg' : '/images/orga A.svg'}
          alt="ORGA"
          className={`transition-all ${isOpen ? 'h-7' : 'h-6'}`}
        />

        {/* Toggle Button (ALWAYS VISIBLE) */}
        <button
          onClick={toggleSidebar}
          className="
            absolute top-1/2 -right-3 -translate-y-1/2
            w-7 h-7 rounded-full bg-white border border-gray-200
            flex items-center justify-center text-gray-500
            hover:bg-purple-50 hover:text-purple-600
            shadow-md transition cursor-pointer 
          "
        >
          <ChevronLeft
            size={16}
            className={`transition-transform duration-300  cursor-pointer ${!isOpen ? 'rotate-180' : ''
              }`}
          />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 mt-8 space-y-1">
        {menuItems.map((item) => {
          const active = isActive(item.path);

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`
                flex items-center rounded-2xl transition-all duration-200
                ${isOpen ? 'px-4 py-3 gap-3' : 'justify-center py-3'}
                ${active
                  ? 'bg-[#EEF2FF] text-[#7D1EDB]'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <item.icon
                className={`w-5 h-5 ${active ? 'text-purple-600' : 'text-gray-400'
                  }`}
              />
              {isOpen && (
                <span className="text-sm font-medium">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="mt-auto pt-4 border-t border-gray-200">
        <div
          onClick={handleLogout}
          className={`
            flex items-center rounded-2xl cursor-pointer transition-all duration-200
            ${isOpen ? 'gap-3 px-4 py-3' : 'justify-center py-3'}
            text-gray-700 hover:text-gray-900 hover:bg-gray-50
          `}
        >
          <LogOut className="w-5 h-5" strokeWidth={1.5} />
          {isOpen && <span className="text-sm font-medium">Logout</span>}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
