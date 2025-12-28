import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Outlet } from 'react-router-dom';

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);

    useEffect(() => {
        const handleResize = () => {
            setIsSidebarOpen(window.innerWidth >= 1024);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex bg-[#eeeff1] min-h-screen font-sans overflow-x-hidden">
            {/* Sidebar Container - Width transitions */}
            <div
                className={`flex-none transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-70' : 'w-0 -ml-2'
                    }`}
            >
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            </div>

            {!isSidebarOpen && (
                <button
                    onClick={toggleSidebar}
                    className="fixed top-8 left-4 z-50 p-1.5 bg-white rounded-full shadow-md hover:bg-purple-50 text-purple-600 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                </button>
            )}

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                {/* Topbar */}
                <div className="sticky top-0 z-10">
                    <Topbar />
                </div>

                {/* Page Content Container */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto">

                    <div className="w-full mx-auto">
                        {children || <Outlet />}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
