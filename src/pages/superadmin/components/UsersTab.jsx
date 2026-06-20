import React from 'react';
import { Users, ChevronRight } from 'lucide-react';

const UsersTab = () => (
  <div className="fade-in">
    <div className="page-header">
       <div>
          <h2 className="page-title text-2xl">All Users</h2>
          <div className="breadcrumb mt-1">
             <span className="bc-link">Admin</span>
             <ChevronRight size={14} />
             <span>Users</span>
          </div>
       </div>
       <button className="btn-primary shadow-lg shadow-purple-500/30">
          Invite Admin
       </button>
    </div>
    <div className="card shadow-sm h-[600px] flex items-center justify-center">
       <div className="text-center">
          <Users size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-700">User Directory</h3>
          <p className="text-sm text-gray-500 mt-2 max-w-sm">Manage Super Admins, support staff, and platform owners across the HRMS system.</p>
       </div>
    </div>
  </div>
);

export default UsersTab;
