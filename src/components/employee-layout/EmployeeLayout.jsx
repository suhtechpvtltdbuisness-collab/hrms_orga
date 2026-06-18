import React, { useState, useEffect } from 'react';
import EmployeeSidebar from './EmployeeSidebar';
import EmployeeTopbar from './EmployeeTopbar';
import { Outlet } from 'react-router-dom';

const EmployeeLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1260 : true
  );
  const [darkMode, setDarkMode] = useState(() =>
    localStorage.getItem('emp_darkMode') === 'true'
  );

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1260);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem('emp_darkMode', darkMode);
    if (darkMode) {
      document.documentElement.setAttribute('data-emp-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-emp-theme');
    }
  }, [darkMode]);

  const sidebarWidth = isSidebarOpen ? 240 : 64;

  return (
    <div className={`min-h-screen ${darkMode ? 'emp-dark' : ''} bg-[#F4F5F9] font-sans`}>
      <EmployeeSidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 min-[1260px]:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content area */}
      <div
        className="transition-all duration-300 flex flex-col min-h-screen"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        <div className="sticky top-0 z-30">
          <EmployeeTopbar
            darkMode={darkMode}
            toggleDarkMode={() => setDarkMode(!darkMode)}
          />
        </div>
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EmployeeLayout;
