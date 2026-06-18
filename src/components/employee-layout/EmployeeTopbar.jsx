import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, Sun, Moon, ChevronDown, User, Settings, LogOut, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../service';
import toast from 'react-hot-toast';

const EmployeeTopbar = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const userData = (() => {
    try { return JSON.parse(localStorage.getItem('userData') || '{}'); } catch { return {}; }
  })();

  const displayName = userData?.name || userData?.fullName || userData?.email?.split('@')[0] || 'Employee';
  const designation = userData?.designation || 'Team Member';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/auth');
    toast.success('Logged out successfully');
  };

  const notifications = [
    { id: 1, title: 'Leave Approved', msg: 'Your leave request for Jun 20 has been approved.', time: '2h ago', unread: true, color: 'bg-green-100 text-green-600' },
    { id: 2, title: 'New Announcement', msg: 'Company picnic scheduled for July 5th.', time: '5h ago', unread: true, color: 'bg-blue-100 text-blue-600' },
    { id: 3, title: 'Task Due Tomorrow', msg: 'Q2 Report is due tomorrow at 5 PM.', time: '1d ago', unread: false, color: 'bg-orange-100 text-orange-600' },
  ];
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6 shrink-0">
      {/* Search */}
      <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 h-9 w-64 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100 transition-all">
        <Search className="w-3.5 h-3.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 flex-1"
        />
      </div>
      <div className="sm:hidden" />

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all"
          title="Toggle Dark Mode"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-10 w-80 bg-white rounded-xl border border-gray-200 shadow-xl z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                <span className="text-xs text-violet-600 font-medium cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className={`px-4 py-3 flex gap-3 hover:bg-gray-50 cursor-pointer ${n.unread ? 'bg-violet-50/30' : ''}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${n.color} text-xs font-bold`}>
                      {n.unread ? '●' : '○'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold text-gray-900 ${n.unread ? '' : 'font-medium'}`}>{n.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.msg}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-gray-100 text-center">
                <span className="text-xs text-violet-600 font-medium cursor-pointer hover:underline">View all notifications</span>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200" />

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-2 py-1.5 transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-gray-900 leading-tight">{displayName}</p>
              <p className="text-[10px] text-gray-500 leading-tight">{designation}</p>
            </div>
            <ChevronDown className="w-3 h-3 text-gray-400 hidden md:block" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-11 w-52 bg-white rounded-xl border border-gray-200 shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 bg-gradient-to-r from-violet-50 to-indigo-50 border-b border-gray-100">
                <p className="text-xs font-bold text-gray-900">{displayName}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">{userData?.email || 'employee@company.com'}</p>
              </div>
              <div className="py-1">
                <button onClick={() => { navigate('/employee/profile'); setDropdownOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-all">
                  <User className="w-4 h-4 text-gray-400" />My Profile
                </button>
                <button onClick={() => { navigate('/employee/settings'); setDropdownOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-all">
                  <Settings className="w-4 h-4 text-gray-400" />Settings
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-all">
                  <Shield className="w-4 h-4 text-gray-400" />Privacy
                </button>
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-all">
                    <LogOut className="w-4 h-4" />Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default EmployeeTopbar;
