import React, { useState, useEffect } from 'react';
import EmployeeSidebar from './EmployeeSidebar';
import EmployeeTopbar from './EmployeeTopbar';
import { Outlet } from 'react-router-dom';
import { FaceAttendanceProvider } from '../../features/face-attendance/FaceAttendanceContext';

const EmployeeLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') return window.innerWidth >= 1260;
    return true;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1260);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <FaceAttendanceProvider>
    <div className="min-h-screen bg-[#eeeff1] font-sans">
      {/* Sidebar */}
      <EmployeeSidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(prev => !prev)}
      />

      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 min-[1260px]:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main area shifts right based on sidebar state */}
      <div
        className={`transition-all duration-300 ${isSidebarOpen ? 'min-[1260px]:ml-[268px]' : 'min-[1260px]:ml-16'}`}
      >
        {/* Topbar */}
        <div className="sticky top-0 z-30 pt-4 px-2 pb-0 bg-[#eeeff1]">
          <EmployeeTopbar onMenuClick={() => setIsSidebarOpen(true)} />
        </div>

        {/* Page Content */}
        <main className="px-2 py-4 sm:px-4 overflow-x-auto">
          <Outlet />
        </main>
      </div>
    </div>
    </FaceAttendanceProvider>
  );
};

export default EmployeeLayout;
