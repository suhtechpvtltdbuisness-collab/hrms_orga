import React, { useState, useEffect } from 'react';
import { Building2, Users, CreditCard, Activity, ChevronRight, Clock } from 'lucide-react';
import { organizationService } from '../../../service';
import toast from 'react-hot-toast';

const OverviewTab = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const res = await organizationService.getSuperAdminOverview();
      if (res.success && res.data) {
        setData(res.data);
      } else {
        toast.error(res.message || "Failed to fetch overview data");
      }
    } catch (error) {
      toast.error("Error loading dashboard overview");
    } finally {
      setLoading(false);
    }
  };

  const stats = data?.stats || {
    totalOrganizations: 0,
    orgsGrowthPercent: 0,
    activeSubscriptions: 0,
    subsGrowthPercent: 0,
    totalEmployees: 0,
    monthlyRevenue: 0,
  };

  const recentOrganizations = data?.recentOrganizations || [];
  const activities = data?.activities || [];

  return (
    <div className="fade-in">
      <div className="page-header flex flex-col sm:flex-row sm:items-center justify-between gap-4">
         <div>
            <h2 className="page-title text-2xl font-bold text-gray-900">Overview</h2>
            <div className="breadcrumb mt-1 flex items-center text-sm text-gray-500">
               <span className="hover:text-purple-600 cursor-pointer transition-colors">Admin</span>
               <ChevronRight size={14} className="mx-2 text-gray-400" />
               <span className="font-medium text-gray-900">Dashboard</span>
            </div>
         </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
         <div className="stat-card bg-white p-6 rounded-2xl border border-gray-100 hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-md">
            <div className="flex items-center justify-between mb-3">
               <span className="stat-label text-sm font-medium text-gray-500">Total Organizations</span>
               <div className="p-2.5 bg-gradient-to-br from-[#F5F3FF] to-[#EDE9FE] rounded-xl text-[#7C3AED]">
                  <Building2 size={22} />
               </div>
            </div>
            <div className="stat-value text-2xl font-bold text-gray-900">
              {loading ? "..." : stats.totalOrganizations}
            </div>
            <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
              <Activity size={12}/> {stats.orgsGrowthPercent >= 0 ? `+${stats.orgsGrowthPercent}%` : `${stats.orgsGrowthPercent}%`} from last month
            </p>
         </div>
         
         <div className="stat-card bg-white p-6 rounded-2xl border border-gray-100 hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-md">
            <div className="flex items-center justify-between mb-3">
               <span className="stat-label text-sm font-medium text-gray-500">Active Subscriptions</span>
               <div className="p-2.5 bg-gradient-to-br from-[#DCFCE7] to-[#BBF7D0] rounded-xl text-[#16A34A]">
                  <CreditCard size={22} />
               </div>
            </div>
            <div className="stat-value text-2xl font-bold text-gray-900">
              {loading ? "..." : stats.activeSubscriptions}
            </div>
            <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
               <Activity size={12}/> {stats.subsGrowthPercent >= 0 ? `+${stats.subsGrowthPercent}%` : `${stats.subsGrowthPercent}%`} from last month
            </p>
         </div>

         <div className="stat-card bg-white p-6 rounded-2xl border border-gray-100 hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-md">
            <div className="flex items-center justify-between mb-3">
               <span className="stat-label text-sm font-medium text-gray-500">Total Employees</span>
               <div className="p-2.5 bg-gradient-to-br from-[#DBEAFE] to-[#BFDBFE] rounded-xl text-[#2563EB]">
                  <Users size={22} />
               </div>
            </div>
            <div className="stat-value text-2xl font-bold text-gray-900">
              {loading ? "..." : stats.totalEmployees.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 font-medium mt-2 flex items-center gap-1">
               <Activity size={12} className="text-blue-500"/> Across all clients
            </p>
         </div>

         <div className="stat-card bg-white p-6 rounded-2xl border border-gray-100 hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-md">
            <div className="flex items-center justify-between mb-3">
               <span className="stat-label text-sm font-medium text-gray-500">Total Revenue</span>
               <div className="p-2.5 bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] rounded-xl text-[#D97706]">
                  <Activity size={22} />
               </div>
            </div>
            <div className="stat-value text-2xl font-bold text-gray-900">
              {loading ? "..." : `₹${stats.monthlyRevenue.toLocaleString("en-IN")}`}
            </div>
            <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
               <Activity size={12}/> All-time earnings
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 card bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-lg font-bold text-[#111827]">Recent Organizations</h3>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse text-sm">
                  <thead>
                     <tr className="bg-gray-50/50 border-b border-gray-100">
                        <th className="px-6 py-4 font-semibold text-gray-500">Organization</th>
                        <th className="px-6 py-4 font-semibold text-gray-500">Plan Type</th>
                        <th className="px-6 py-4 font-semibold text-gray-500">Employees</th>
                        <th className="px-6 py-4 font-semibold text-gray-500">Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {loading ? (
                       <tr>
                         <td colSpan="4" className="px-6 py-8 text-center text-gray-500 font-medium">
                           Loading...
                         </td>
                       </tr>
                     ) : recentOrganizations.length === 0 ? (
                       <tr>
                         <td colSpan="4" className="px-6 py-8 text-center text-gray-500 font-medium">
                           No organizations registered yet.
                         </td>
                       </tr>
                     ) : (
                       recentOrganizations.map((item) => (
                         <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4">
                               <div className="font-semibold text-[#111827]">{item.name}</div>
                               <div className="text-xs text-[#6B7280]">{item.domain}</div>
                            </td>
                            <td className="px-6 py-4">
                               <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${
                                 item.plan === 'Enterprise' 
                                   ? 'bg-purple-50 text-purple-700 ring-purple-600/20' 
                                   : item.plan === 'Starter' || item.plan === 'Growth'
                                   ? 'bg-blue-50 text-blue-700 ring-blue-600/20' 
                                   : 'bg-gray-50 text-gray-600 ring-gray-500/10'
                               }`}>
                                 {item.plan}
                               </span>
                            </td>
                            <td className="px-6 py-4 font-medium text-gray-700">{item.users}</td>
                            <td className="px-6 py-4">
                               <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                 item.status === 'Active' 
                                   ? 'bg-green-100 text-green-800' 
                                   : item.status === 'Trial' 
                                   ? 'bg-yellow-100 text-yellow-800' 
                                   : 'bg-red-100 text-red-800'
                               }`}>
                                 {item.status}
                               </span>
                            </td>
                         </tr>
                       ))
                     )}
                  </tbody>
               </table>
            </div>
         </div>

         <div className="card bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-lg font-bold text-[#111827]">System Activity</h3>
              </div>
              <div className="space-y-5">
                 {loading ? (
                   <p className="text-sm text-gray-500 text-center py-4">Loading activities...</p>
                 ) : activities.length === 0 ? (
                   <p className="text-sm text-gray-500 text-center py-4">No recent activity.</p>
                 ) : (
                   activities.map((act) => {
                     let iconColor = "text-[#7C3AED] bg-[#F5F3FF]";
                     if (act.type === "employee") iconColor = "text-[#2563EB] bg-[#DBEAFE]";
                     if (act.type === "payment") iconColor = "text-[#D97706] bg-[#FEF3C7]";
                     
                     return (
                       <div key={act.id} className="flex gap-4 items-start">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${iconColor}`}>
                             {act.type === "organization" && <Building2 size={18} />}
                             {act.type === "employee" && <Users size={18} />}
                             {act.type === "payment" && <CreditCard size={18} />}
                          </div>
                          <div>
                             <p className="text-sm font-semibold text-[#111827]">{act.title}</p>
                             <p className="text-xs text-[#6B7280] mt-0.5" dangerouslySetInnerHTML={{ __html: act.description }}></p>
                             <p className="text-[11px] font-medium text-[#9CA3AF] mt-1 flex items-center gap-1">
                                <Clock size={10} /> {act.time}
                             </p>
                          </div>
                       </div>
                     );
                   })
                 )}
              </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default OverviewTab;
