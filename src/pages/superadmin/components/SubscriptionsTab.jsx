import React, { useState } from 'react';
import { CreditCard, ChevronRight, Search, Filter, MoreVertical, CheckCircle2, XCircle, Clock } from 'lucide-react';

const DUMMY_SUBSCRIPTIONS = [
  { id: 'SUB-1001', orgName: 'Acme Corp', plan: 'Enterprise', status: 'Active', billing: 'Yearly', nextBilling: 'Oct 24, 2026', amount: '$4,999' },
  { id: 'SUB-1002', orgName: 'Globex Inc', plan: 'Pro', status: 'Past Due', billing: 'Monthly', nextBilling: 'Jun 15, 2026', amount: '$499' },
  { id: 'SUB-1003', orgName: 'Stark Industries', plan: 'Enterprise', status: 'Active', billing: 'Yearly', nextBilling: 'Jan 10, 2027', amount: '$12,000' },
  { id: 'SUB-1004', orgName: 'Wayne Enterprises', plan: 'Pro', status: 'Active', billing: 'Monthly', nextBilling: 'Jul 01, 2026', amount: '$499' },
  { id: 'SUB-1005', orgName: 'Umbrella Corp', plan: 'Basic', status: 'Canceled', billing: 'Monthly', nextBilling: '-', amount: '$99' },
];

const getStatusColor = (status) => {
  switch(status) {
    case 'Active': return 'bg-green-100 text-green-700 ring-green-600/20';
    case 'Past Due': return 'bg-yellow-100 text-yellow-800 ring-yellow-600/20';
    case 'Canceled': return 'bg-red-100 text-red-700 ring-red-600/10';
    default: return 'bg-gray-100 text-gray-700 ring-gray-600/20';
  }
};

const getStatusIcon = (status) => {
  switch(status) {
    case 'Active': return <CheckCircle2 size={14} className="mr-1" />;
    case 'Past Due': return <Clock size={14} className="mr-1" />;
    case 'Canceled': return <XCircle size={14} className="mr-1" />;
    default: return null;
  }
};

const SubscriptionsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="fade-in space-y-6">
      <div className="page-header flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="page-title text-2xl font-bold text-gray-900">Subscriptions</h2>
          <div className="breadcrumb mt-1 flex items-center text-sm text-gray-500">
            <span className="hover:text-purple-600 cursor-pointer transition-colors">Admin</span>
            <ChevronRight size={14} className="mx-2 text-gray-400" />
            <span className="font-medium text-gray-900">Subscriptions</span>
          </div>
        </div>
      </div>

      <div className="card bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search organizations..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
                 <Filter size={16} />
                 Filter
              </button>
           </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 font-semibold text-gray-500">Organization</th>
                <th className="px-6 py-4 font-semibold text-gray-500">Plan</th>
                <th className="px-6 py-4 font-semibold text-gray-500">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-500">Billing</th>
                <th className="px-6 py-4 font-semibold text-gray-500">Next Invoice</th>
                <th className="px-6 py-4 font-semibold text-gray-500">Amount</th>
                <th className="px-6 py-4 font-semibold text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {DUMMY_SUBSCRIPTIONS.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{sub.orgName}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{sub.id}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-700 font-medium">{sub.plan}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${getStatusColor(sub.status)}`}>
                      {getStatusIcon(sub.status)}
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{sub.billing}</td>
                  <td className="px-6 py-4 text-gray-600">{sub.nextBilling}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{sub.amount}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                       <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Dummy */}
        <div className="p-5 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
           <div>Showing 1 to 5 of 24 results</div>
           <div className="flex gap-1">
              <button className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-50">Prev</button>
              <button className="px-3 py-1 rounded-md border border-gray-200 bg-purple-50 text-purple-600 border-purple-100 font-medium">1</button>
              <button className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50">2</button>
              <button className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50">3</button>
              <button className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50">Next</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsTab;
