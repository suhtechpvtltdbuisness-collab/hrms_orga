import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Outlet } from 'react-router-dom';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="bg-[#eeeff1] min-h-screen font-sans">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? 'ml-70' : 'ml-16'
        }`}
      >
        <div className="px-4 py-4">
          {/* Topbar */}
          <div className="sticky top-0 z-30">
            <Topbar />
          </div>

          {/* Page Content */}
          <main className="min-h-screen">
            {children || <Outlet />}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
