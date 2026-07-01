import React from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  CheckSquare,
  BarChart3,
  Megaphone,
  UserCircle,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  DollarSign,
  FolderOpen,
  TrendingUp,
  Palmtree,
  Video,
  AlarmClock
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../../service';

const menuItems = [
  { name: 'Dashboard',        icon: LayoutDashboard, path: '/employee' },
  { name: 'My Profile',       icon: UserCircle,      path: '/employee/profile' },
  { name: 'Attendance',       icon: CalendarDays,    path: '/employee/attendance' },
  { name: 'Shift',            icon: AlarmClock,      path: '/employee/shift' },
  { name: 'Leave Management', icon: CalendarDays,    path: '/employee/leave' },
  { name: 'Payroll',          icon: DollarSign,      path: '/employee/payroll' },
  { name: 'Documents',        icon: FolderOpen,      path: '/employee/documents' },
  { name: 'Tasks',            icon: CheckSquare,     path: '/employee/tasks' },
  { name: 'Performance',      icon: TrendingUp,      path: '/employee/performance' },
  { name: 'Announcements',    icon: Megaphone,       path: '/employee/announcements' },
  { name: 'Holidays',         icon: Palmtree,        path: '/employee/holidays' },
  { name: 'Meetings',         icon: Video,           path: '/employee/meetings' },
  { name: 'Support',          icon: HelpCircle,      path: '/employee/support' },
  { name: 'Settings',         icon: Settings,        path: '/employee/settings' },
];

const EmployeeSidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    navigate('/auth');
    toast.success('Logged out successfully');
  };

  const isActive = (item) => {
    if (!item.path) return false;
    if (item.name === 'Dashboard') return location.pathname === '/employee';
    return location.pathname.startsWith(item.path);
  };

  const handleItemClick = (item) => {
    navigate(item.path);
    if (window.innerWidth < 1260 && isOpen) toggleSidebar();
  };

  return (
    <aside
      className="fixed top-0 left-0 h-screen z-50 bg-white border-r border-gray-100 shadow-sm transition-all duration-300 flex flex-col rounded-r-2xl"
      style={{ width: isOpen ? '268px' : '64px', padding: isOpen ? '20px' : '16px 0' }}
    >
      {/* Logo — same as admin panel */}
      <div className={`relative flex items-center mb-6 h-10 ${isOpen ? 'justify-start' : 'justify-center'}`}>
        <img
          src={isOpen ? '/images/Orga Logo.svg' : '/images/orga A.svg'}
          alt="ORGA"
          className={`transition-all ${isOpen ? 'h-7' : 'h-6'}`}
        />

        {/* Toggle Button */}
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
            className={`transition-transform duration-300 cursor-pointer ${!isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 mt-4 space-y-1 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => {
          const active = isActive(item);
          return (
            <div
              key={item.name}
              onClick={() => handleItemClick(item)}
              title={!isOpen ? item.name : undefined}
              className={`
                flex items-center rounded-full transition-all duration-200 cursor-pointer
                ${isOpen ? 'px-4 py-3 gap-3' : 'justify-center py-3'}
                ${!active ? 'text-gray-800 hover:bg-gray-50 hover:text-gray-900' : ''}
              `}
              style={active ? { background: 'linear-gradient(135deg, #756FCC18 0%, #B58CEC18 100%)', color: '#8B5CF6' } : {}}
            >
              <item.icon
                style={active ? { color: '#756FCC' } : {}}
                className={`w-5 h-5 ${!active ? 'text-gray-800' : ''}`}
              />
              {isOpen && (
                <span className="text-sm font-medium">{item.name}</span>
              )}
            </div>
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

export default EmployeeSidebar;
