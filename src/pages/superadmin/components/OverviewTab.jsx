import React from 'react';
import { Building2, Users, CreditCard, Activity, ChevronRight, CheckCircle2, Clock } from 'lucide-react';

const OverviewTab = () => (
  <div className="fade-in">
    <div className="page-header">
       <div>
          <h2 className="page-title text-2xl">Overview</h2>
          <div className="breadcrumb mt-1">
             <span className="bc-link">Admin</span>
             <ChevronRight size={14} />
             <span>Dashboard</span>
          </div>
       </div>
       <button className="btn-primary shadow-lg shadow-purple-500/30">
          Generate Report
       </button>
    </div>

    {/* Stats Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
       <div className="stat-card hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-md">
          <div className="flex items-center justify-between mb-3">
             <span className="stat-label">Total Organizations</span>
             <div className="p-2.5 bg-gradient-to-br from-[#F5F3FF] to-[#EDE9FE] rounded-xl text-[#7C3AED]">
                <Building2 size={22} />
             </div>
          </div>
          <div className="stat-value">124</div>
          <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
            <Activity size={12}/> +12% from last month
          </p>
       </div>
       <div className="stat-card hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-md">
          <div className="flex items-center justify-between mb-3">
             <span className="stat-label">Active Subscriptions</span>
             <div className="p-2.5 bg-gradient-to-br from-[#DCFCE7] to-[#BBF7D0] rounded-xl text-[#16A34A]">
                <CreditCard size={22} />
             </div>
          </div>
          <div className="stat-value">118</div>
          <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
             <Activity size={12}/> +8% from last month
          </p>
       </div>
       <div className="stat-card hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-md">
          <div className="flex items-center justify-between mb-3">
             <span className="stat-label">Total Employees</span>
             <div className="p-2.5 bg-gradient-to-br from-[#DBEAFE] to-[#BFDBFE] rounded-xl text-[#2563EB]">
                <Users size={22} />
             </div>
          </div>
          <div className="stat-value">4,592</div>
          <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
             <Activity size={12}/> +245 this week
          </p>
       </div>
       <div className="stat-card hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-md">
          <div className="flex items-center justify-between mb-3">
             <span className="stat-label">Monthly Revenue</span>
             <div className="p-2.5 bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] rounded-xl text-[#D97706]">
                <Activity size={22} />
             </div>
          </div>
          <div className="stat-value">$34,850</div>
          <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
             <Activity size={12}/> +15% from last month
          </p>
       </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
       <div className="lg:col-span-2 card shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
             <h3 className="text-lg font-bold text-[#111827]">Recent Organizations</h3>
             <button className="btn-ghost text-sm">View All</button>
          </div>
          <div className="overflow-x-auto">
             <table className="data-table">
                <thead>
                   <tr>
                      <th>Organization</th>
                      <th>Plan Type</th>
                      <th>Employees</th>
                      <th>Status</th>
                   </tr>
                </thead>
                <tbody>
                   <tr className="hover:bg-gray-50/50">
                      <td>
                         <div className="font-semibold text-[#111827]">TechFlow Inc.</div>
                         <div className="text-xs text-[#6B7280]">techflow.com</div>
                      </td>
                      <td><span className="badge badge-purple">Enterprise</span></td>
                      <td className="font-medium text-gray-700">245</td>
                      <td><span className="badge badge-success flex w-fit items-center gap-1"><CheckCircle2 size={12}/> Active</span></td>
                   </tr>
                   <tr className="hover:bg-gray-50/50">
                      <td>
                         <div className="font-semibold text-[#111827]">Global Media</div>
                         <div className="text-xs text-[#6B7280]">globalmedia.org</div>
                      </td>
                      <td><span className="badge badge-info">Professional</span></td>
                      <td className="font-medium text-gray-700">84</td>
                      <td><span className="badge badge-success flex w-fit items-center gap-1"><CheckCircle2 size={12}/> Active</span></td>
                   </tr>
                   <tr className="hover:bg-gray-50/50">
                      <td>
                         <div className="font-semibold text-[#111827]">Nexus Corp</div>
                         <div className="text-xs text-[#6B7280]">nexuscorp.net</div>
                      </td>
                      <td><span className="badge badge-purple">Enterprise</span></td>
                      <td className="font-medium text-gray-700">512</td>
                      <td><span className="badge badge-warning flex w-fit items-center gap-1"><Clock size={12}/> Trial</span></td>
                   </tr>
                </tbody>
             </table>
          </div>
       </div>

       <div className="card shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
             <h3 className="text-lg font-bold text-[#111827]">System Activity</h3>
          </div>
          <div className="space-y-5">
             <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#DCFCE7] to-[#BBF7D0] text-[#16A34A] flex items-center justify-center shrink-0 shadow-sm">
                   <Building2 size={18} />
                </div>
                <div>
                   <p className="text-sm font-semibold text-[#111827]">New Organization Registered</p>
                   <p className="text-xs text-[#6B7280] mt-0.5"><span className="font-semibold text-gray-700">TechFlow Inc.</span> signed up for Enterprise.</p>
                   <p className="text-[11px] font-medium text-[#9CA3AF] mt-1.5">2 hours ago</p>
                </div>
             </div>
             <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#DBEAFE] to-[#BFDBFE] text-[#2563EB] flex items-center justify-center shrink-0 shadow-sm">
                   <Users size={18} />
                </div>
                <div>
                   <p className="text-sm font-semibold text-[#111827]">Bulk Employee Import</p>
                   <p className="text-xs text-[#6B7280] mt-0.5"><span className="font-semibold text-gray-700">Global Media</span> imported 50 employees.</p>
                   <p className="text-[11px] font-medium text-[#9CA3AF] mt-1.5">5 hours ago</p>
                </div>
             </div>
             <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] text-[#D97706] flex items-center justify-center shrink-0 shadow-sm">
                   <CreditCard size={18} />
                </div>
                <div>
                   <p className="text-sm font-semibold text-[#111827]">Subscription Upgraded</p>
                   <p className="text-xs text-[#6B7280] mt-0.5"><span className="font-semibold text-gray-700">StartUp Hub</span> upgraded to Pro.</p>
                   <p className="text-[11px] font-medium text-[#9CA3AF] mt-1.5">1 day ago</p>
                </div>
             </div>
          </div>
          <button className="w-full mt-6 btn-ghost justify-center hover:bg-gray-100 font-semibold">View All Activity</button>
       </div>
    </div>
  </div>
);

export default OverviewTab;
