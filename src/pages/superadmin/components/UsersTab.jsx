import React, { useState } from 'react';
import { Users, ChevronRight, Search, Plus, MoreHorizontal, Shield, Mail, Calendar } from 'lucide-react';

const DUMMY_USERS = [
  { id: 'U-001', name: 'Alice Smith', email: 'alice@hrms.com', role: 'Super Admin', status: 'Active', lastLogin: '2 mins ago', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
  { id: 'U-002', name: 'Bob Johnson', email: 'bob@hrms.com', role: 'Support Agent', status: 'Active', lastLogin: '1 hour ago', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
  { id: 'U-003', name: 'Charlie Brown', email: 'charlie@acmecorp.com', role: 'Org Owner', status: 'Inactive', lastLogin: '5 days ago', avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d' },
  { id: 'U-004', name: 'Diana Prince', email: 'diana@stark.com', role: 'Org Owner', status: 'Active', lastLogin: 'Just now', avatar: 'https://i.pravatar.cc/150?u=a048581f4e29026701d' },
  { id: 'U-005', name: 'Evan Wright', email: 'evan@hrms.com', role: 'Support Agent', status: 'Active', lastLogin: '2 days ago', avatar: 'https://i.pravatar.cc/150?u=a04258a2462d826712d' },
];

const getRoleBadge = (role) => {
  if (role === 'Super Admin') return 'bg-purple-100 text-purple-700 border-purple-200';
  if (role === 'Support Agent') return 'bg-blue-100 text-blue-700 border-blue-200';
  return 'bg-gray-100 text-gray-700 border-gray-200';
};

const UsersTab = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="fade-in space-y-6">
      <div className="page-header flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="page-title text-2xl font-bold text-gray-900">All Users</h2>
          <div className="breadcrumb mt-1 flex items-center text-sm text-gray-500">
            <span className="hover:text-purple-600 cursor-pointer transition-colors">Admin</span>
            <ChevronRight size={14} className="mx-2 text-gray-400" />
            <span className="font-medium text-gray-900">Users</span>
          </div>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md shadow-purple-500/20 hover:shadow-lg hover:-translate-y-0.5">
          <Plus size={18} />
          Invite User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600"><Users size={24} /></div>
           <div>
             <p className="text-sm font-medium text-gray-500">Total Users</p>
             <h3 className="text-2xl font-bold text-gray-900 mt-1">1,248</h3>
           </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600"><Shield size={24} /></div>
           <div>
             <p className="text-sm font-medium text-gray-500">System Admins</p>
             <h3 className="text-2xl font-bold text-gray-900 mt-1">12</h3>
           </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600"><div className="w-3 h-3 rounded-full bg-green-500 ring-4 ring-green-100"></div></div>
           <div>
             <p className="text-sm font-medium text-gray-500">Active Now</p>
             <h3 className="text-2xl font-bold text-gray-900 mt-1">142</h3>
           </div>
        </div>
      </div>

      <div className="card bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search users by name or email..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 font-semibold text-gray-500">User</th>
                <th className="px-6 py-4 font-semibold text-gray-500">Role</th>
                <th className="px-6 py-4 font-semibold text-gray-500">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-500">Last Login</th>
                <th className="px-6 py-4 font-semibold text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {DUMMY_USERS.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border border-gray-200 object-cover" />
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Mail size={10} /> {user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="text-gray-700">{user.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center gap-1.5"><Calendar size={14} className="text-gray-400"/> {user.lastLogin}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                       <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Dummy */}
        <div className="p-5 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
           <div>Showing 1 to 5 of 1,248 users</div>
           <div className="flex gap-1">
              <button className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-50">Prev</button>
              <button className="px-3 py-1 rounded-md border border-gray-200 bg-purple-50 text-purple-600 border-purple-100 font-medium">1</button>
              <button className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50">2</button>
              <button className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50">3</button>
              <span className="px-2 py-1">...</span>
              <button className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50">250</button>
              <button className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50">Next</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default UsersTab;
