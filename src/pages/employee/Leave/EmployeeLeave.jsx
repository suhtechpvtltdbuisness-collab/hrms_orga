import React, { useState } from 'react';
import { Plus, X, ChevronRight, Clock, CheckCircle2, XCircle, AlertCircle, Calendar } from 'lucide-react';

const leaveTypes = ['Casual Leave','Sick Leave','Earned Leave','Maternity Leave','Paternity Leave','Compensatory Off'];

const leaveBalance = [
  { type: 'Casual Leave', used: 3, total: 12, color: 'from-violet-500 to-violet-400', light: 'bg-violet-50', text: 'text-violet-700' },
  { type: 'Sick Leave', used: 1, total: 8, color: 'from-blue-500 to-blue-400', light: 'bg-blue-50', text: 'text-blue-700' },
  { type: 'Earned Leave', used: 5, total: 15, color: 'from-green-500 to-green-400', light: 'bg-green-50', text: 'text-green-700' },
  { type: 'Comp Off', used: 0, total: 2, color: 'from-amber-500 to-amber-400', light: 'bg-amber-50', text: 'text-amber-700' },
];

const leaveHistory = [
  { id: 1, type: 'Sick Leave', from: 'Jun 10, 2025', to: 'Jun 11, 2025', days: 2, reason: 'Fever and cold', status: 'approved', applied: 'Jun 9' },
  { id: 2, type: 'Casual Leave', from: 'May 25, 2025', to: 'May 26, 2025', days: 2, reason: 'Personal work', status: 'approved', applied: 'May 22' },
  { id: 3, type: 'Earned Leave', from: 'Jul 4, 2025', to: 'Jul 7, 2025', days: 4, reason: 'Family vacation', status: 'pending', applied: 'Jun 15' },
  { id: 4, type: 'Casual Leave', from: 'Apr 14, 2025', to: 'Apr 14, 2025', days: 1, reason: 'Personal', status: 'rejected', applied: 'Apr 12' },
];

const statusStyle = {
  approved: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle2, label: 'Approved' },
  pending:  { bg: 'bg-amber-100', text: 'text-amber-700', icon: Clock, label: 'Pending' },
  rejected: { bg: 'bg-red-100',   text: 'text-red-600',   icon: XCircle, label: 'Rejected' },
};

export default function EmployeeLeave() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ type: '', from: '', to: '', reason: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setShowModal(false); setForm({ type:'', from:'', to:'', reason:'' }); }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Leave Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Apply, track and manage your leave requests</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-all active:scale-95">
          <Plus className="w-4 h-4" /> Apply Leave
        </button>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {leaveBalance.map(l => {
          const remaining = l.total - l.used;
          const pct = (remaining / l.total) * 100;
          return (
            <div key={l.type} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">{l.type}</p>
              <div className="flex items-end justify-between mb-3">
                <span className="text-3xl font-bold text-gray-900">{remaining}</span>
                <span className="text-xs text-gray-400 mb-1">/ {l.total} days</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                <div className={`h-full rounded-full bg-gradient-to-r ${l.color} transition-all`} style={{ width: `${pct}%` }} />
              </div>
              <p className="text-[11px] text-gray-400">{l.used} used · {remaining} remaining</p>
            </div>
          );
        })}
      </div>

      {/* Leave History */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Leave History</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">{leaveHistory.length} records</span>
          </div>
        </div>
        <div className="divide-y divide-gray-50">
          {leaveHistory.map(leave => {
            const s = statusStyle[leave.status];
            const Icon = s.icon;
            return (
              <div key={leave.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900">{leave.type}</span>
                    <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${s.bg} ${s.text}`}>
                      <Icon className="w-2.5 h-2.5" />{s.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{leave.from} → {leave.to} · {leave.days} day{leave.days > 1 ? 's' : ''}</p>
                  <p className="text-xs text-gray-400 mt-0.5 italic">"{leave.reason}"</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-gray-400">Applied {leave.applied}</span>
                  {leave.status === 'pending' && (
                    <button className="text-xs text-red-500 font-medium border border-red-200 px-2.5 py-1 rounded-lg hover:bg-red-50 transition-all">Cancel</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Apply Leave Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-gray-900">Apply for Leave</h2>
              <button onClick={() => setShowModal(false)} className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-all">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-base font-bold text-gray-900">Leave Applied!</p>
                <p className="text-sm text-gray-500 mt-1">Your request has been submitted for approval.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Leave Type *</label>
                  <select required value={form.type} onChange={e => setForm({...form, type:e.target.value})} className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm text-gray-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100">
                    <option value="">Select leave type</option>
                    {leaveTypes.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">From Date *</label>
                    <input required type="date" value={form.from} onChange={e => setForm({...form, from:e.target.value})} className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm text-gray-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">To Date *</label>
                    <input required type="date" value={form.to} onChange={e => setForm({...form, to:e.target.value})} className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm text-gray-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Reason *</label>
                  <textarea required value={form.reason} onChange={e => setForm({...form, reason:e.target.value})} rows={3} placeholder="Briefly describe your reason..." className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 resize-none" />
                </div>
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all">Cancel</button>
                  <button type="submit" className="flex-1 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-all active:scale-95">Submit Request</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
