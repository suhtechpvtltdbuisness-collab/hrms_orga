import React, { useEffect, useState } from 'react';
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
  Receipt,
  UserCircle,
  Settings,
  HelpCircle,
  LogOut,
  TrendingUp,
  ChevronDown,
  ChevronLeft
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../../service';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedMenu, setExpandedMenu] = useState(
    location.pathname.startsWith('/hrms/sales') ? 'Sales' : ''
  );

  useEffect(() => {
    if (location.pathname.startsWith('/hrms/sales')) {
      setExpandedMenu('Sales');
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/auth');
    toast.success('Logged out successfully');
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/hrms/dashboard' },
    { name: 'HRMS', icon: Users, path: '/hrms' },
    { name: 'Project Management', icon: Briefcase, path: '' },
    { name: 'Employees', icon: Mail, path: '/hrms/employees' },
    { name: 'Attendance', icon: CalendarDays, path: '/hrms/attendance' },
    {
      name: 'Sales',
      icon: TrendingUp,
      path: '/hrms/sales/overview',
      children: [
        { name: 'Overview', path: '/hrms/sales/overview' },
        { name: 'Leads', path: '/hrms/sales/leads' },
        { name: 'Clients', path: '/hrms/sales/clients' },
        { name: 'Opportunities', path: '/hrms/sales/opportunities' },
        { name: 'Pipeline', path: '/hrms/sales/pipeline' },
        { name: 'Sales AI Co-Pilot', path: '/hrms/sales/sales-ai-co-pilot' },
        { name: 'Knowledge Hub', path: '/hrms/sales/knowledge-hub' },
        { name: 'Proposal Builder', path: '/hrms/sales/proposal-builder' },
        { name: 'Quotations', path: '/hrms/sales/quotations' },
        { name: 'Contracts', path: '/hrms/sales/contracts' },
        { name: 'Products & Services', path: '/hrms/sales/products-services' },
        { name: 'Pricing Calculator', path: '/hrms/sales/pricing-calculator' },
        { name: 'Case Studies', path: '/hrms/sales/case-studies' },
        { name: 'Competitor Battlecards', path: '/hrms/sales/competitor-battlecards' },
        { name: 'Objection Playbooks', path: '/hrms/sales/objection-playbooks' }
      ]
    },
    { name: 'Tasks', icon: CheckSquare, path: '' },
    { name: 'Reports', icon: BarChart3, path: '/hrms/financial-reports/profit-and-loss' },
    { name: 'Announcements', icon: Megaphone, path: '' },
    { name: 'Messages', icon: MessageSquare, path: '' },
    { name: 'My Profile', icon: UserCircle, path: '/hrms/profile' },
    { name: 'Settings', icon: Settings, path: '/hrms/settings' },
    { name: 'Support', icon: HelpCircle, path: '' }
  ];

  const isActive = (item) => {
    if (!item.path) return false;

    if (item.children?.length) {
      return item.children.some((child) => location.pathname === child.path)
        || location.pathname.startsWith('/hrms/sales');
    }

    if (item.name === 'Dashboard') {
      return location.pathname === '/hrms/dashboard';
    }

    if (item.name === 'HRMS') {
      return location.pathname === '/hrms';
    }

    return location.pathname.startsWith(item.path);
  };

  const handleItemClick = (item) => {
    if (item.children?.length) {
      if (!isOpen) {
        navigate(item.path);
        return;
      }

      setExpandedMenu((current) => current === item.name ? '' : item.name);
      if (!location.pathname.startsWith('/hrms/sales')) {
        navigate(item.path);
      }
      return;
    }

    if (!item.path) {
      toast(`${item.name} module is coming soon!`, { icon: '🚀' });
      return;
    }
    navigate(item.path);
    if (window.innerWidth < 1260 && isOpen) {
      toggleSidebar();
    }
  };

  const handleChildClick = (path) => {
    navigate(path);
    if (window.innerWidth < 1260 && isOpen) {
      toggleSidebar();
    }
  };

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen z-50
        bg-white border-r border-gray-100 shadow-sm
        transition-all duration-300 flex flex-col rounded-xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full min-[1260px]:translate-x-0'}
        ${isOpen ? 'w-65 px-5 py-5' : 'w-16 py-4'}
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
      <nav className="flex-1 mt-8 space-y-1 overflow-y-auto pr-1">
        {menuItems.map((item) => {
          const active = isActive(item);
          const expanded = expandedMenu === item.name;

          return (
            <div key={item.name}>
              <div
                onClick={() => handleItemClick(item)}
                className={`
                  flex items-center rounded-full transition-all duration-200 cursor-pointer
                  ${isOpen ? 'px-4 py-3 gap-3' : 'justify-center py-3'}
                  ${active
                    ? 'bg-[#EEF2FF] text-[#7D1EDB]'
                    : 'text-gray-800 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <item.icon
                  className={`w-5 h-5 ${active ? 'text-[#7D1EDB]' : 'text-gray-800'
                    }`}
                />
                {isOpen && (
                  <>
                    <span className="min-w-0 flex-1 text-sm font-medium">{item.name}</span>
                    {item.children?.length > 0 && (
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
                      />
                    )}
                  </>
                )}
              </div>

              {isOpen && item.children?.length > 0 && expanded && (
                <div className="ml-6 mt-1 space-y-1 border-l border-[#E5E7EB] pl-3">
                  {item.children.map((child) => {
                    const childActive = location.pathname === child.path;

                    return (
                      <button
                        key={child.path}
                        type="button"
                        onClick={() => handleChildClick(child.path)}
                        className={`
                          flex w-full items-center gap-2 rounded-full px-3 py-2 text-left text-xs font-medium transition
                          ${childActive
                            ? 'bg-[#F4ECFF] text-[#7D1EDB]'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-[#7D1EDB]'
                          }
                        `}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${childActive ? 'bg-[#7D1EDB]' : 'bg-gray-300'}`} />
                        <span className="truncate">{child.name}</span>
                      </button>
                    );
                  })}
                </div>
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

export default Sidebar;
