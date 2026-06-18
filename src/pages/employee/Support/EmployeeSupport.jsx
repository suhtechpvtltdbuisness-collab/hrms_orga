import React, { useState } from 'react';
import { LifeBuoy, Plus, X, CheckCircle2, Clock, AlertCircle, MessageSquare } from 'lucide-react';

const tickets = [
  { id:'TKT-001', subject:'Attendance not marked for June 10', category:'Attendance', status:'resolved', date:'Jun 11, 2025', updated:'Jun 13, 2025', priority:'medium' },
  { id:'TKT-002', subject:'Payslip discrepancy for April', category:'Payroll', status:'in-progress', date:'Jun 8, 2025', updated:'Jun 16, 2025', priority:'high' },
  { id:'TKT-003', subject:'IT asset request - Laptop', category:'IT', status:'open', date:'Jun 17, 2025', updated:'Jun 17, 2025', priority:'low' },
];

const statusStyle = {
  resolved:    { bg:'bg-green-100', text:'text-green-700', icon:CheckCircle2 },
  'in-progress':{ bg:'bg-blue-100', text:'text-blue-700', icon:Clock },
  open:        { bg:'bg-amber-100', text:'text-amber-700', icon:AlertCircle },
};

const categories = ['Attendance', 'Payroll', 'IT Support', 'HR Query', 'Leave', 'Document', 'Other'];

export default function EmployeeSupport() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ subject:'', category:'', priority:'medium', desc:'' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setShowModal(false); setForm({subject:'',category:'',priority:'medium',desc:''}); }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Support / Help Desk</h1>
          <p className="text-sm text-gray-500 mt-0.5">Raise and track your support tickets</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-all active:scale-95">
          <Plus className="w-4 h-4" /> New Ticket
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label:'Open', val: tickets.filter(t=>t.status==='open').length, color:'text-amber-600', bg:'bg-amber-50' },
          { label:'In Progress', val: tickets.filter(t=>t.status==='in-progress').length, color:'text-blue-600', bg:'bg-blue-50' },
          { label:'Resolved', val: tickets.filter(t=>t.status==='resolved').length, color:'text-green-600', bg:'bg-green-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center border border-gray-100`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.val}</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tickets */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">My Tickets</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {tickets.map(t => {
            const s = statusStyle[t.status];
            const Icon = s.icon;
            return (
              <div key={t.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}><Icon className={`w-4.5 h-4.5 ${s.text}`} /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 font-mono">{t.id}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${s.bg} ${s.text}`}>{t.status}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${t.priority==='high'?'bg-red-100 text-red-600':t.priority==='medium'?'bg-amber-100 text-amber-600':'bg-green-100 text-green-600'}`}>{t.priority}</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 mt-1">{t.subject}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{t.category} · Opened {t.date} · Updated {t.updated}</p>
                </div>
                <button className="flex items-center gap-1.5 text-xs text-violet-600 font-medium border border-violet-200 px-2.5 py-1 rounded-lg hover:bg-violet-50 transition-all shrink-0">
                  <MessageSquare className="w-3 h-3" /> Reply
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Quick Help</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon:'📋', title:'Leave Policy', desc:'Learn about leave types and limits' },
            { icon:'💰', title:'Payroll FAQs', desc:'Understand your salary structure' },
            { icon:'🔐', title:'IT & Security', desc:'Password resets, access requests' },
          ].map((f, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-violet-50/50 hover:border-violet-100 transition-all cursor-pointer">
              <span className="text-xl">{f.icon}</span>
              <div>
                <p className="text-xs font-bold text-gray-800">{f.title}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-gray-900">Raise a Support Ticket</h2>
              <button onClick={() => setShowModal(false)} className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200"><X className="w-4 h-4" /></button>
            </div>
            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-base font-bold text-gray-900">Ticket Raised!</p>
                <p className="text-sm text-gray-500 mt-1">Our team will respond within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Subject *</label>
                  <input required value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} placeholder="Brief description of your issue" className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category *</label>
                    <select required value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100">
                      <option value="">Select</option>
                      {categories.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Priority</label>
                    <select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})} className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100">
                      <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description *</label>
                  <textarea required value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} rows={4} placeholder="Describe your issue in detail..." className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 resize-none" />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={()=>setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="flex-1 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-all">Submit Ticket</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
