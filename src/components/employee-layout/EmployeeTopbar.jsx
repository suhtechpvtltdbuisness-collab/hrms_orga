import React from 'react';
import { Bell, Menu, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const getInitials = (name) =>
  name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'E';

const EmployeeTopbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const userData = (() => {
    try { return JSON.parse(localStorage.getItem('userData') || '{}'); } catch { return {}; }
  })();

  const userName = userData.name || userData.fullName || 'Employee';
  const userRole = 'Employee';
  const userImage = userData.profileImage || null;
  const initials = getInitials(userName);

  return (
    <div className="bg-white px-3 py-4 sm:px-4 sm:py-5 mx-1 sm:mx-3 mr-1 mt-0 flex justify-between items-center rounded-xl border border-[#D9D9D9] gap-3">
      <button
        type="button"
        onClick={onMenuClick}
        className="min-[1260px]:hidden inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-purple-50 hover:text-purple-600"
        aria-label="Open sidebar"
      >
        <Menu size={20} />
      </button>

      {/* Search Bar — same as admin */}
      <div className="relative hidden md:flex w-full max-w-96 items-center bg-[#F9FAFB] rounded-full px-4 py-3 border border-[#F2F2F2] focus-within:ring-2 focus-within:ring-purple-100 focus-within:border-purple-200 transition-all">
        <img
          src="/images/search-circle.svg"
          alt="Search Icon"
          className="w-5 h-5 mr-3 opacity-70"
        />
        <input
          type="text"
          className="w-full bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none text-base font-normal"
          placeholder="Search here..."
        />
      </div>

      {/* Mobile search icon */}
      <div className="md:hidden p-2 rounded-full bg-gray-50 text-gray-500">
        <Search size={20} />
      </div>

      {/* Right: Notification + Profile */}
      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        {/* Notification Bell */}
        <div
          onClick={() => navigate('/employee/announcements')}
          className="relative cursor-pointer h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center transition-opacity hover:opacity-80 bg-[#EEECFF]"
        >
          <Bell className="h-5 w-5 sm:h-7 sm:w-7" color="#7D1EDB" fill="#7D1EDB" />
          <div className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-[#FF3B30] sm:right-2 sm:top-2 sm:h-5 sm:w-5">
            <span className="text-white text-[10px] font-bold">2</span>
          </div>
        </div>

        {/* User Profile */}
        <div
          onClick={() => navigate('/employee/profile')}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
        >
          <div className="relative">
            {userImage ? (
              <img
                className="h-10 w-10 sm:h-13 sm:w-13 rounded-full object-cover border-2 border-yellow-400 group-hover:border-purple-400 transition-colors"
                src={userImage}
                alt={userName}
              />
            ) : (
              <div className="h-10 w-10 sm:h-13 sm:w-13 rounded-full border-2 border-yellow-400 group-hover:border-purple-400 transition-colors bg-gradient-to-br from-[#7D1EDB] to-indigo-500 flex items-center justify-center text-white font-bold text-base select-none"
              >
                {initials}
              </div>
            )}
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-bold text-gray-900 leading-tight group-hover:text-purple-600 transition-colors">
              {userName}
            </span>
            <span className="text-xs text-gray-500 font-medium">{userRole}</span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className="hidden md:block h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTopbar;
