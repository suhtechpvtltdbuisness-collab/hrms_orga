import React, { useState, useEffect } from 'react';
import { Users, ChevronRight, Search, Plus, MoreHorizontal, Shield, Mail, Calendar } from 'lucide-react';
import { employeeService, getProfilePicUrl } from '../../../service';
import toast from 'react-hot-toast';

const getRoleBadge = (role) => {
  if (role === 'Super Admin') return 'bg-purple-100 text-purple-700 border-purple-200';
  if (role === 'Support Agent') return 'bg-blue-100 text-blue-700 border-blue-200';
  if (role === 'Org Owner') return 'bg-indigo-100 text-indigo-700 border-indigo-200';
  return 'bg-gray-100 text-gray-700 border-gray-200';
};

const getRoleName = (roleId, type) => {
  if (roleId === 0) return 'Super Admin';
  if (type === 'support') return 'Support Agent';
  if (roleId === 1 || type === 'admin') return 'Org Owner';
  return 'Employee';
};

const getPlanName = (plan) => {
  if (!plan || !plan.id) return '-';
  return plan.name || plan.planType?.replaceAll('_', ' ') || '-';
};

const UsersTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetchUsers();
  }, [page, searchTerm]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await employeeService.getAllUsersForSuperAdmin(page, limit, searchTerm);
      if (res.success) {
        setUsersList(res.data.users || []);
        setTotalCount(res.data.total || 0);
        setTotalPages(res.data.totalPages || 1);
      } else {
        toast.error(res.message || "Failed to fetch users");
      }
    } catch (err) {
      toast.error("Error loading users");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const totalUsers = totalCount;
  const orgOwners = usersList.filter(u => u.roleId === 1 || u.type === 'admin').length;
  const activeNow = usersList.filter(u => u.active).length;

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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600"><Users size={24} /></div>
           <div>
             <p className="text-sm font-medium text-gray-500">Total Users</p>
             <h3 className="text-2xl font-bold text-gray-900 mt-1">{loading ? '...' : totalUsers}</h3>
           </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600"><Shield size={24} /></div>
           <div>
             <p className="text-sm font-medium text-gray-500">Org Owners</p>
             <h3 className="text-2xl font-bold text-gray-900 mt-1">{loading ? '...' : orgOwners}</h3>
           </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600"><div className="w-3 h-3 rounded-full bg-green-500 ring-4 ring-green-100"></div></div>
           <div>
             <p className="text-sm font-medium text-gray-500">Active Now</p>
             <h3 className="text-2xl font-bold text-gray-900 mt-1">{loading ? '...' : activeNow}</h3>
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
                onChange={handleSearchChange}
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
                <th className="px-6 py-4 font-semibold text-gray-500">Subscription Plan</th>
                <th className="px-6 py-4 font-semibold text-gray-500">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-500">Joined Date</th>
                <th className="px-6 py-4 font-semibold text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500 font-medium">
                    Loading users...
                  </td>
                </tr>
              ) : usersList.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500 font-medium">
                    No users found.
                  </td>
                </tr>
              ) : (
                usersList.map((user) => {
                  const roleName = getRoleName(user.roleId, user.type);
                  return (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={getProfilePicUrl(user.profilePic) || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} 
                            alt={user.name} 
                            className="w-10 h-10 rounded-full border border-gray-200 object-cover" 
                          />
                          <div>
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Mail size={10} /> {user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getRoleBadge(roleName)}`}>
                          {roleName}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${
                          user.plan && user.plan.id ? 'bg-purple-50 text-purple-700 ring-purple-600/20' : 'bg-gray-50 text-gray-600 ring-gray-500/10'
                        }`}>
                          {getPlanName(user.plan)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full ${user.active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <span className="text-gray-700">{user.active ? 'Active' : 'Inactive'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-gray-400"/>
                          {new Date(user.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                           <MoreHorizontal size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-5 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
           <div>
             Showing {totalCount > 0 ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, totalCount)} of {totalCount} users
           </div>
           <div className="flex gap-1">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 rounded-md border ${
                    page === i + 1 
                      ? "bg-purple-50 text-purple-600 border-purple-100 font-medium" 
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default UsersTab;
