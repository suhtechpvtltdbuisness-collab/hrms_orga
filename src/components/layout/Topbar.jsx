import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, UserCircle, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getProfilePicUrl, authService } from '../../service';
import toast from 'react-hot-toast';

const getRoleLabel = (user) => {
    if (user.isAdmin) return 'Admin';
    if (user.type) return user.type.charAt(0).toUpperCase() + user.type.slice(1);
    return 'User';
};

const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return { text: 'Good Morning', emoji: '☀️' };
    if (h < 17) return { text: 'Good Afternoon', emoji: '🌤️' };
    return { text: 'Good Evening', emoji: '🌙' };
};

const Topbar = () => {
    const navigate = useNavigate();

    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userName = userData.name || 'User';
    const firstName = userName.split(' ')[0];
    const userRole = getRoleLabel(userData);
    const userImage = getProfilePicUrl(userData.profilePic || userData.profileImage) || '/EMP_IMG.svg';
    const greeting = getGreeting();

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        setIsProfileOpen(false);
        try {
            await authService.logout();
            toast.success('Logged out successfully');
            navigate('/auth', { replace: true });
        } catch (error) {
            toast.error('Logout failed');
        }
    };

    return (
        <div className="bg-white px-3 py-4 sm:px-5 lg:px-6 lg:py-5 mx-1 sm:mx-3 mt-0 flex justify-between items-center rounded-xl border border-[#D9D9D9] gap-3 sm:gap-6">

            {/* LEFT: Greeting + Search Bar */}
            <div className="flex items-center gap-4 flex-1 min-w-0">

                {/* Greeting */}
                <div className="flex flex-col justify-center shrink-0">
                    <h2 className="text-sm sm:text-lg font-bold text-[#7D1EDB] leading-tight truncate">
                        {greeting.text}, {firstName}&nbsp;{greeting.emoji}
                    </h2>
                    <p className="hidden sm:block text-sm text-[#9B9B9B] mt-0.5 whitespace-nowrap">
                        Here's an overview of your work
                    </p>
                </div>

                {/* Search Bar */}
                <div className="hidden md:flex relative items-center bg-[#F9FAFB] rounded-full px-5 py-3 border border-[#F2F2F2] focus-within:ring-2 focus-within:ring-purple-100 focus-within:border-purple-200 transition-all w-64 xl:w-80">
                    <img
                        src="/images/search-circle.svg"
                        alt="Search Icon"
                        className="w-5 h-5 mr-3 opacity-60 shrink-0"
                    />
                    <input
                        type="text"
                        className="w-full bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none text-base font-normal"
                        placeholder="Search here..."
                    />
                </div>

                {/* Mobile Search Icon */}
                <div className="hidden sm:flex md:hidden p-2 rounded-full bg-gray-50 text-gray-500 cursor-pointer">
                    <Search size={20} />
                </div>
            </div>

            {/* RIGHT: Notification + Profile */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">

                {/* Notification Bell */}
                <div
                    onClick={() => navigate('/hrms/notifications')}
                    className="relative cursor-pointer w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-opacity hover:opacity-80 bg-[#EEECFF]"
                >
                    <Bell className="w-5 h-5 sm:w-[26px] sm:h-[26px]" color="#7D1EDB" fill="#7D1EDB" />
                    <div className="absolute top-1 right-1 w-4 h-4 bg-[#FF3B30] rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-white text-[9px] font-bold">2</span>
                    </div>
                </div>

                {/* User Profile */}
                <div className="relative" ref={profileRef}>
                    <div 
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                    >
                        <img
                            className="h-9 w-9 sm:h-11 sm:w-11 rounded-full object-cover border-2 border-yellow-400 group-hover:border-purple-400 transition-colors"
                            src={userImage}
                            alt={userName}
                        />
                        <div className="hidden md:flex flex-col">
                            <span className="text-base font-bold text-gray-900 leading-tight group-hover:text-purple-600 transition-colors">
                                {userName}
                            </span>
                            <span className="text-sm text-gray-500 font-medium">{userRole}</span>
                        </div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`hidden md:block h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>

                    {/* Dropdown Menu */}
                    {isProfileOpen && (
                        <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 transform opacity-100 scale-100 transition-all origin-top-right">
                            <div className="px-4 py-3 bg-[#F9FAFB] border-b border-gray-100">
                                <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
                                <p className="text-xs text-gray-500 truncate">{userData.email || 'No email'}</p>
                            </div>
                            <div className="p-2 space-y-1">
                                <button
                                    onClick={() => {
                                        setIsProfileOpen(false);
                                        navigate('/hrms/profile');
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-[#F3ECFF] hover:text-[#7D1EDB] transition-colors"
                                >
                                    <UserCircle size={18} />
                                    <span>My Profile</span>
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                >
                                    <LogOut size={18} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

};

export default Topbar;
