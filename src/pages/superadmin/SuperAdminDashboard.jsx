import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../service';
import { 
  Building2, Users, CreditCard, Activity, Search, Bell, Settings, 
  LogOut, Menu, Package, X
} from 'lucide-react';
import toast from 'react-hot-toast';

import OverviewTab from './components/OverviewTab';
import OrganizationsTab from './components/OrganizationsTab';
import SubscriptionsTab from './components/SubscriptionsTab';
import UsersTab from './components/UsersTab';
import SettingsTab from './components/SettingsTab';
import PlansTab from './components/PlansTab';

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success("Logged out successfully");
      navigate("/auth", { replace: true });
    } catch (err) {
      toast.error("Failed to logout");
    }
  };

  const renderContent = () => {
    switch(activeTab) {
      case "dashboard": return <OverviewTab />;
      case "organizations": return <OrganizationsTab />;
      case "subscriptions": return <SubscriptionsTab />;
      case "plans": return <PlansTab />;
      case "users": return <UsersTab />;
      case "settings": return <SettingsTab />;
      default: return <OverviewTab />;
    }
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Activity },
    { id: "organizations", label: "Organizations", icon: Building2 },
    { id: "subscriptions", label: "Subscriptions", icon: CreditCard },
    { id: "plans", label: "Plans", icon: Package },
    { id: "users", label: "All Users", icon: Users },
  ];

  return (
    <div className="flex h-screen bg-[#F4F5F7] font-sans selection:bg-purple-200">
       {/* Sidebar Overlay for Mobile */}
       {isMobileMenuOpen && (
         <div 
           className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
           onClick={() => setIsMobileMenuOpen(false)}
         />
       )}

       {/* Sidebar */}
       <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 flex flex-col shrink-0 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} shadow-2xl lg:shadow-none`}>
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <img src="/images/Orga Logo.svg" alt="Orga" className="h-8 w-auto object-contain" />
             </div>
             <button className="lg:hidden text-gray-500 hover:text-gray-700" onClick={() => setIsMobileMenuOpen(false)}>
                <X size={24} />
             </button>
          </div>
          
          <div className="flex-1 px-4 py-6 overflow-y-auto">
             <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-3">Menu</div>
             <div className="space-y-1">
                {navItems.map((item) => {
                   const Icon = item.icon;
                   const isActive = activeTab === item.id;
                   return (
                     <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive ? 'bg-gradient-to-r from-purple-50 to-indigo-50 text-[#7C3AED] shadow-sm ring-1 ring-purple-100' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                     >
                        <Icon size={18} className={isActive ? 'text-[#7C3AED]' : 'text-gray-400'} />
                        {item.label}
                     </button>
                   )
                })}
             </div>
          </div>

          <div className="p-4 border-t border-gray-100 space-y-1 bg-gray-50/50">
             <button 
                onClick={() => { setActiveTab("settings"); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${activeTab === 'settings' ? 'bg-white text-[#7C3AED] shadow-sm ring-1 ring-purple-100' : 'text-gray-600 hover:bg-white hover:text-gray-900'}`}
             >
                <Settings size={18} className={activeTab === 'settings' ? 'text-[#7C3AED]' : 'text-gray-400'} />
                Settings
             </button>
             <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
             >
                <LogOut size={18} className="text-red-500" />
                Logout
             </button>
          </div>
       </aside>

       {/* Main Content */}
       <main className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Topbar */}
          <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 shrink-0 sticky top-0 z-20">
             <div className="flex items-center gap-4">
                 <button 
                   className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                   onClick={() => setIsMobileMenuOpen(true)}
                >
                   <Menu size={24} />
                </button>
                <div className="hidden sm:flex items-center gap-2 bg-gray-100/80 border border-gray-200 rounded-full px-4 py-2 w-64 md:w-80 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-purple-100 focus-within:border-purple-300">
                   <Search size={16} className="text-gray-400 shrink-0" />
                   <input type="text" placeholder="Search anything..." className="bg-transparent border-none outline-none text-sm w-full text-gray-800 placeholder-gray-400" />
                </div>
             </div>

             <div className="flex items-center gap-3 lg:gap-5">
                <button className="relative p-2.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                   <Bell size={20} />
                   <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
                <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1.5 rounded-xl transition-colors">
                   <div className="hidden md:block text-right">
                      <p className="text-sm font-bold text-gray-900 leading-tight">Super Admin</p>
                      <p className="text-[11px] font-semibold text-purple-600 uppercase tracking-wider">Owner</p>
                   </div>
                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-700 flex items-center justify-center font-bold text-sm shadow-inner ring-1 ring-purple-200">
                      SA
                   </div>
                </div>
             </div>
          </header>

          {/* Dashboard Content */}
          <div className="flex-1 overflow-auto p-4 lg:p-8">
             <div className="max-w-7xl mx-auto">
               {renderContent()}
             </div>
          </div>
       </main>
    </div>
  );
};

export default SuperAdminDashboard;
