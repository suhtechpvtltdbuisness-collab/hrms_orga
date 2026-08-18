import React, { useState, useEffect, useCallback } from 'react';
import { ChevronRight, Search, CheckCircle2, XCircle, Clock, Eye, Ban, RotateCcw, X } from 'lucide-react';
import { subscriptionService } from '../../../service';
import toast from 'react-hot-toast';
import ActionMenu from './ActionMenu';

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
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const limit = 10;

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await subscriptionService.getAllSubscriptions(page, limit, searchTerm);
      if (res.success) {
        setSubscriptions(res.data.subscriptions || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalCount(res.data.total || 0);
      } else {
        toast.error(res.message || "Failed to fetch subscriptions");
      }
    } catch {
      toast.error("Error loading subscriptions");
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleStatusChange = async (subscription, status) => {
    const verb = status === 'Canceled' ? 'Cancel' : 'Reactivate';
    if (!window.confirm(`${verb} ${subscription.orgName}'s subscription?`)) return;
    setUpdatingId(subscription.id);
    const res = await subscriptionService.updateSubscriptionStatus(subscription.id, status);
    if (res.success) {
      toast.success(res.message);
      await fetchSubscriptions();
    } else {
      toast.error(res.message);
    }
    setUpdatingId(null);
  };

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
                onChange={handleSearchChange}
              />
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
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-gray-500 font-medium">
                    Loading subscriptions...
                  </td>
                </tr>
              ) : subscriptions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-gray-500 font-medium">
                    No subscriptions found.
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub) => (
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
                      <ActionMenu label={`Manage ${sub.orgName} subscription`} items={[
                        { label: 'View details', icon: Eye, onClick: () => setSelectedSubscription(sub) },
                        sub.status === 'Canceled'
                          ? { label: 'Reactivate', icon: RotateCcw, disabled: updatingId === sub.id, onClick: () => handleStatusChange(sub, 'Active') }
                          : { label: 'Cancel subscription', icon: Ban, danger: true, disabled: updatingId === sub.id, onClick: () => handleStatusChange(sub, 'Canceled') },
                      ]} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-5 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
           <div>
             Showing {totalCount > 0 ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, totalCount)} of {totalCount} results
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
      {selectedSubscription && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-sm" onMouseDown={() => setSelectedSubscription(null)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4"><div><h3 className="text-xl font-bold text-gray-900">{selectedSubscription.orgName}</h3><p className="mt-1 text-sm text-gray-500">{selectedSubscription.id}</p></div><button type="button" aria-label="Close" onClick={() => setSelectedSubscription(null)} className="rounded-full bg-gray-100 p-1.5 text-gray-500 hover:bg-gray-200"><X size={18} /></button></div>
            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
              {[["Plan", selectedSubscription.plan], ["Status", selectedSubscription.status], ["Billing", selectedSubscription.billing], ["Next invoice", selectedSubscription.nextBilling], ["Amount", selectedSubscription.amount]].map(([label, value]) => <div key={label} className="rounded-xl bg-gray-50 p-3"><dt className="text-gray-500">{label}</dt><dd className="mt-1 font-semibold text-gray-900">{value || '-'}</dd></div>)}
            </dl>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionsTab;
