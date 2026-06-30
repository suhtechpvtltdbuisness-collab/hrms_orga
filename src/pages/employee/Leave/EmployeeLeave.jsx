import React, { useCallback, useEffect, useState } from 'react';
import { Plus, X, Clock, CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { leaveRequestService, leaveService } from '../../../service';

const statusStyle = {
  approved: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle2, label: 'Approved' },
  submitted: { bg: 'bg-amber-100', text: 'text-amber-700', icon: Clock, label: 'Pending' },
  rejected: { bg: 'bg-red-100', text: 'text-red-600', icon: XCircle, label: 'Rejected' },
};

export default function EmployeeLeave() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ type: '', from: '', to: '', reason: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [balance, setBalance] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leaveTypes, setLeaveTypes] = useState([]);

  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userId = userData?.id;

  const loadData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const [balanceRes, requestsRes, leaveTypesRes] = await Promise.all([
      leaveService.getBalance(userId),
      leaveRequestService.getLeaveRequests({ empId: userId }),
      leaveRequestService.getAvailableLeaveTypes(),
    ]);
    if (balanceRes.success) setBalance(balanceRes.data);
    if (requestsRes.success) setHistory(requestsRes.data || []);
    if (leaveTypesRes.success) setLeaveTypes(leaveTypesRes.data || []);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const leaveBalance = balance
    ? [
        { type: 'Casual Leave', used: balance.casualLeaveTaken, total: balance.casualLeave, color: 'from-violet-500 to-violet-400' },
        { type: 'Sick Leave', used: balance.sickLeaveTaken, total: balance.sickLeave, color: 'from-blue-500 to-blue-400' },
        { type: 'Earned Leave', used: balance.paidLeaveTaken, total: balance.paidLeave, color: 'from-green-500 to-green-400' },
      ]
    : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.type || !form.from || !form.to) {
      setError('Please fill all required fields');
      return;
    }
    setSubmitting(true);
    setError('');
    const res = await leaveRequestService.createLeaveRequest({
      leaveType: form.type,
      fromDate: form.from,
      toDate: form.to,
      reason: form.reason,
    });
    setSubmitting(false);
    if (res.success) {
      setSuccess('Leave request submitted successfully');
      setShowModal(false);
      setForm({ type: '', from: '', to: '', reason: '' });
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(res.message || 'Failed to submit leave request');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Leave Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Apply, track and manage your leave requests</p>
        </div>
        <button
          onClick={() => { setShowModal(true); setError(''); }}
          disabled={!balance || leaveTypes.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-all active:scale-95 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" /> Apply Leave
        </button>
      </div>

      {!balance && !loading && (
        <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
          <AlertCircle size={16} />
          No leave balance allocated yet. Contact your admin.
        </div>
      )}

      {success && (
        <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">{success}</div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {leaveBalance.map((l) => {
          const remaining = Math.max(0, l.total - l.used);
          const pct = l.total > 0 ? (remaining / l.total) * 100 : 0;
          return (
            <div key={l.type} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">{l.type}</p>
              <div className="flex items-end justify-between mb-3">
                <span className="text-3xl font-bold text-gray-900">{remaining}</span>
                <span className="text-xs text-gray-400 mb-1">/ {l.total} days</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                <div className={`h-full rounded-full bg-gradient-to-r ${l.color}`} style={{ width: `${pct}%` }} />
              </div>
              <p className="text-[11px] text-gray-400">{l.used} used · {remaining} remaining</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Leave History</h2>
          <span className="text-xs text-gray-400">{history.length} records</span>
        </div>
        {loading ? (
          <p className="py-8 text-center text-gray-400 text-sm">Loading...</p>
        ) : history.length === 0 ? (
          <p className="py-8 text-center text-gray-400 text-sm">No leave requests yet</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {history.map((leave) => {
              const s = statusStyle[leave.status] || statusStyle.submitted;
              const Icon = s.icon;
              return (
                <div key={leave.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-900">
                        {leaveRequestService.leaveTypeToLabel(leave.leaveType)}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${s.bg} ${s.text}`}>
                        <Icon size={11} /> {s.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{leave.fromDate} → {leave.toDate} · {leave.days} day{leave.days > 1 ? 's' : ''}</p>
                    {leave.reason && <p className="text-xs text-gray-400 mt-0.5 italic">"{leave.reason}"</p>}
                    {leave.rejectionReason && <p className="text-xs text-red-500 mt-0.5">Rejected: {leave.rejectionReason}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h2 className="text-base font-bold text-gray-900">Apply for Leave</h2>
              <button onClick={() => setShowModal(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Leave Type *</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" required>
                  <option value="">Select leave type</option>
                  {leaveTypes.map((t) => (
                    <option key={t.id} value={t.requestType}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">From *</label>
                  <input type="date" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">To *</label>
                  <input type="date" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Reason</label>
                <textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} rows={3} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none" placeholder="Brief reason for leave" />
              </div>
              <button type="submit" disabled={submitting} className="w-full py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed">
                <span className="inline-flex items-center justify-center gap-2">
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
