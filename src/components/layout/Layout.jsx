import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Outlet } from 'react-router-dom';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1260;
    }
    return true;
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1260) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-[#eeeff1] font-sans overflow-x-clip">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Backdrop for mobile/tablet */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 min-[1260px]:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${isSidebarOpen ? 'min-[1260px]:ml-61' : 'min-[1260px]:ml-16'
          }`}
      >
        <div className="px-2 sm:px-4 pt-4 pb-0">
          {/* Topbar */}
          <div className="sticky top-0 z-30 bg-[#eeeff1] pb-2 -mt-4 pt-4">
            <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
          </div>

          {/* Page Content Container */}
          <main className="flex-1 min-w-0 overflow-x-auto">
            {/* Inner content container - align with Topbar's margin */}
            <div className="w-full mx-auto">
              {children || <Outlet />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
