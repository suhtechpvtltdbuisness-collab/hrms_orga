import React, { useState, useEffect, useCallback } from 'react';
import { ChevronRight, Search, Mail, Calendar, Eye, RotateCcw, X } from 'lucide-react';
import { employeeService, getProfilePicUrl } from '../../../service';
import toast from 'react-hot-toast';
import ActionMenu from './ActionMenu';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'admin', label: 'Admins' },
  { id: 'employee', label: 'Employees' },
];

const getRoleBadge = (role) => {
  if (role === 'Org Owner') return 'bg-indigo-100 text-indigo-700 border-indigo-200';
  return 'bg-gray-100 text-gray-700 border-gray-200';
};

const getRoleName = (roleId, type) => {
  if (roleId === 1 || type === 'admin') return 'Org Owner';
  return 'Employee';
};

const isAdminUser = (user) => user.roleId === 1 || user.type === 'admin' || user.isAdmin === true;

const DeletedUsersTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const limit = 10;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await employeeService.getDeletedUsersForSuperAdmin(page, limit, searchTerm, roleFilter);
      if (res.success) {
        setUsersList(res.data.users || []);
        setTotalCount(res.data.total || 0);
        setTotalPages(res.data.totalPages || 1);
      } else {
        toast.error(res.message || 'Failed to fetch deleted users');
      }
    } catch {
      toast.error('Error loading deleted users');
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleRestore = async (user) => {
    const admin = isAdminUser(user);
    const confirmText = admin
      ? `Restore ${user.name} and all employees under this admin?`
      : `Restore ${user.name}?`;
    if (!window.confirm(confirmText)) return;
    setUpdatingId(user.id);
    const res = await employeeService.restoreSuperAdminUser(user.id);
    if (res.success) {
      toast.success(res.message);
      await fetchUsers();
    } else {
      toast.error(res.message);
    }
    setUpdatingId(null);
  };

  return (
    <div className="fade-in space-y-6">
      <div className="page-header">
        <h2 className="page-title text-2xl font-bold text-gray-900">Deleted Users</h2>
        <div className="breadcrumb mt-1 flex items-center text-sm text-gray-500">
          <span>Admin</span>
          <ChevronRight size={14} className="mx-2 text-gray-400" />
          <span className="font-medium text-gray-900">Deleted Users</span>
        </div>
      </div>

      <div className="card bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search deleted users..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="inline-flex rounded-xl bg-gray-100 p-1">
            {FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => { setRoleFilter(filter.id); setPage(1); }}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                  roleFilter === filter.id
                    ? 'bg-white text-purple-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 font-semibold text-gray-500">User</th>
                <th className="px-6 py-4 font-semibold text-gray-500">Role</th>
                <th className="px-6 py-4 font-semibold text-gray-500">Deleted On</th>
                <th className="px-6 py-4 font-semibold text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-gray-500 font-medium">Loading deleted users...</td>
                </tr>
              ) : usersList.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-gray-500 font-medium">No deleted users found.</td>
                </tr>
              ) : (
                usersList.map((user) => {
                  const roleName = getRoleName(user.roleId, user.type);
                  return (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
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
                            {roleName === 'Employee' && user.adminName ? (
                              <div className="text-xs text-gray-400 mt-0.5">Admin: {user.adminName}</div>
                            ) : null}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getRoleBadge(roleName)}`}>
                          {roleName}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-gray-400" />
                          {new Date(user.updatedAt || user.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <ActionMenu label={`Manage ${user.name}`} items={[
                          { label: 'View details', icon: Eye, onClick: () => setSelectedUser(user) },
                          { label: isAdminUser(user) ? 'Restore admin' : 'Restore employee', icon: RotateCcw, disabled: updatingId === user.id, onClick: () => handleRestore(user) },
                        ]} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-5 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <div>
            Showing {totalCount > 0 ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, totalCount)} of {totalCount} users
          </div>
          <div className="flex gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-50">Prev</button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded-md border ${page === i + 1 ? 'bg-purple-50 text-purple-600 border-purple-100 font-medium' : 'border-gray-200 hover:bg-gray-50'}`}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-sm" onMouseDown={() => setSelectedUser(null)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedUser.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{selectedUser.email}</p>
              </div>
              <button type="button" aria-label="Close" onClick={() => setSelectedUser(null)} className="rounded-full bg-gray-100 p-1.5 text-gray-500 hover:bg-gray-200"><X size={18} /></button>
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
              {[["Role", getRoleName(selectedUser.roleId, selectedUser.type)], ["Status", "Deleted"], ["Deleted on", selectedUser.updatedAt ? new Date(selectedUser.updatedAt).toLocaleDateString() : '-'], ...(selectedUser.adminName ? [["Admin", selectedUser.adminName]] : []), ...(isAdminUser(selectedUser) ? [["Employees", selectedUser.employeeCount ?? 0]] : [])].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-gray-50 p-3">
                  <dt className="text-gray-500">{label}</dt>
                  <dd className="mt-1 font-semibold text-gray-900">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeletedUsersTab;
