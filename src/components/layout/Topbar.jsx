import React from 'react';
import { Bell } from 'lucide-react';

const Topbar = () => {
    return (
        <div className="bg-white px-4 py-6 mx-4 mr-1 mt-0 flex justify-between items-center rounded-xl border border-[#D9D9D9]">
            {/* Search Bar */}
            
            <div className="relative w-96 flex items-center bg-[#F9FAFB] rounded-full px-4 py-4 border border-[#F2F2F2] focus-within:ring-2 focus-within:ring-purple-100 focus-within:border-purple-200 transition-all">

                {/* Search Icon */}
                <img
                    src="/images/search-circle.svg"
                    alt="Search Icon"
                    className="w-5 h-5 mr-3 opacity-70"
                />                                                                      
                
                {/* Input */}
                <input
                    type="text"
                    className="w-full bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none text-base font-normal"
                    placeholder="Search here..."
                />
            </div>

            {/* Right Section: Notification & Profile */}
            <div className="flex items-center space-x-6">
                {/* Notification */}
                <div className="relative cursor-pointer w-15 h-15 rounded-full flex items-center justify-center transition-opacity hover:opacity-80 bg-[#EEECFF]">
                    <Bell size={32} color="#7D1EDB" fill="#7D1EDB" />
                    <div className="absolute top-2 right-2 w-5 h-5 bg-[#FF3B30] rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold">2</span>
                    </div>
                </div>

                {/* User Profile */}
                <div className="flex items-center space-x-3 cursor-pointer group">
                    <div className="relative">
                        <img
                            className="h-13 w-13 rounded-full object-cover border-2 border-yellow-400 group-hover:border-purple-400 transition-colors"
                            src="https://avatar.iran.liara.run/public/boy?username=Ankit"
                            alt="Ankit Kumar"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 leading-tight group-hover:text-purple-600 transition-colors">Ankit Kumar</span>
                        <span className="text-xs text-gray-500 font-medium">Admin</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default Topbar;