import React, { useState } from 'react';
import { AlarmClock, Clock, ArrowRight, CheckCircle2, X } from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const myShift = {
  name: 'Morning Shift',
  type: 'Fixed',
  startTime: '09:00 AM',
  endTime: '06:00 PM',
  workDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  breakDuration: '60 min',
  totalHours: '9h / day',
  assignedBy: 'Amit Sharma',
  effectiveFrom: 'Jan 1, 2025',
};

const shiftHistory = [
  { period: 'Jan 2025 – Present', name: 'Morning Shift', time: '09:00 AM – 06:00 PM', status: 'active' },
  { period: 'Jul 2024 – Dec 2024', name: 'General Shift', time: '10:00 AM – 07:00 PM', status: 'past' },
  { period: 'Jan 2024 – Jun 2024', name: 'Morning Shift', time: '09:00 AM – 06:00 PM', status: 'past' },
];

const shiftRequests = [
  { id: 'SHR-001', from: 'Morning Shift', to: 'Evening Shift', date: 'Jun 10, 2025', reason: 'Personal commitment', status: 'approved' },
  { id: 'SHR-002', from: 'Morning Shift', to: 'Night Shift', date: 'May 5, 2025', reason: 'Project deadline', status: 'rejected' },
];

const statusStyle = {
  active:   { bg: 'bg-green-100', text: 'text-green-700' },
  past:     { bg: 'bg-gray-100',  text: 'text-gray-500' },
  approved: { bg: 'bg-green-100', text: 'text-green-700' },
  rejected: { bg: 'bg-red-100',   text: 'text-red-600' },
  pending:  { bg: 'bg-amber-100', text: 'text-amber-600' },
};

const now = new Date();
const weekDays = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(now);
  d.setDate(now.getDate() - now.getDay() + i);
  const dayName = DAYS[d.getDay()];
  const isWorkDay = myShift.workDays.includes(dayName);
  return {
    dayName, date: d.getDate(),
    month: MONTHS[d.getMonth()].slice(0, 3),
    isToday: d.toDateString() === now.toDateString(),
    isWorkDay,
  };
});

export default function EmployeeShift() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ to: '', date: '', reason: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowModal(false);
      setForm({ to: '', date: '', reason: '' });
    }, 1500);
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Shift</h1>
          <p className="text-sm text-gray-500 mt-0.5">View your assigned shift and request changes</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{ background: 'linear-gradient(135deg, #756FCC 0%, #9B7FDC 50%, #B58CEC 100%)' }}
          className="flex items-center gap-2 px-4 py-2.5 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all active:scale-95"
        >
          <AlarmClock className="w-4 h-4" /> Request Shift Change
        </button>
      </div>

      {/* Current Shift Banner — logo gradient */}
      <div className="rounded-2xl p-6 text-white mb-6" style={{ background: 'linear-gradient(135deg, #756FCC 0%, #9B7FDC 50%, #B58CEC 100%)' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
            <AlarmClock className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold">{myShift.name}</h2>
              <span className="text-xs font-semibold bg-white/20 px-2.5 py-0.5 rounded-full">{myShift.type}</span>
            </div>
            <p className="text-violet-200 text-sm">{myShift.startTime} → {myShift.endTime} · {myShift.totalHours}</p>
            <p className="text-violet-200 text-xs mt-1">
              Works: {myShift.workDays.join(', ')} · Break: {myShift.breakDuration}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center shrink-0">
            <div className="bg-white/10 rounded-xl px-4 py-3 backdrop-blur">
              <p className="text-xs text-violet-200">Effective From</p>
              <p className="text-sm font-bold mt-0.5">{myShift.effectiveFrom}</p>
            </div>
            <div className="bg-white/10 rounded-xl px-4 py-3 backdrop-blur">
              <p className="text-xs text-violet-200">Assigned By</p>
              <p className="text-sm font-bold mt-0.5">{myShift.assignedBy}</p>
            </div>
          </div>
        </div>
      </div>

      {/* This Week */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">This Week's Schedule</h2>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, i) => (
            <div
              key={i}
              className={`flex flex-col items-center rounded-xl p-3 border transition-all
                ${day.isToday
                  ? 'border-[#9B7FDC]/40'
                  : day.isWorkDay
                    ? 'bg-gray-50 border-gray-100'
                    : 'bg-gray-50 border-gray-100 opacity-50'
                }`}
              style={day.isToday ? { background: 'linear-gradient(135deg, #756FCC15 0%, #B58CEC15 100%)', borderColor: '#9B7FDC' } : {}}
            >
              <p className={`text-[11px] font-bold uppercase tracking-wide ${day.isToday ? 'text-[#7C3AED]' : 'text-gray-400'}`}>
                {day.dayName}
              </p>
              <p className={`text-lg font-bold mt-0.5 ${day.isToday ? 'text-[#7C3AED]' : 'text-gray-700'}`}>
                {day.date}
              </p>
              <p className="text-[9px] text-gray-400 mt-0.5">{day.month}</p>
              {day.isWorkDay ? (
                <span className="mt-2 text-[9px] font-bold text-[#7C3AED] bg-[#EEF2FF] px-1.5 py-0.5 rounded-full">
                  {myShift.startTime.replace(' AM','').replace(' PM','')}
                </span>
              ) : (
                <span className="text-[9px] text-gray-400 mt-2">Off</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Shift History */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Shift History</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {shiftHistory.map((s, i) => {
              const st = statusStyle[s.status];
              return (
                <div key={i} className={`flex items-start gap-3 px-5 py-4 ${s.status === 'active' ? 'bg-[#EEF2FF]/40' : ''}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${s.status === 'active' ? 'bg-[#7C3AED]' : 'bg-gray-100'}`}>
                    <Clock className={`w-4 h-4 ${s.status === 'active' ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-gray-800">{s.name}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${st.bg} ${st.text}`}>{s.status}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{s.time}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{s.period}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shift Change Requests */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Shift Change Requests</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {shiftRequests.map((r, i) => {
              const st = statusStyle[r.status];
              return (
                <div key={i} className="px-5 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-400 font-mono">{r.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${st.bg} ${st.text}`}>{r.status}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{r.from}</span>
                    <ArrowRight className="w-3 h-3 text-gray-400" />
                    <span className="text-xs bg-[#EEF2FF] text-[#7C3AED] px-2 py-0.5 rounded">{r.to}</span>
                  </div>
                  <p className="text-xs text-gray-400">Requested {r.date} · "{r.reason}"</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-gray-900">Request Shift Change</h2>
              <button onClick={() => setShowModal(false)} className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-base font-bold text-gray-900">Request Submitted!</p>
                <p className="text-sm text-gray-500 mt-1">Pending manager approval.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Current Shift</label>
                  <input value={myShift.name} disabled className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Requested Shift *</label>
                  <select required value={form.to} onChange={e => setForm({ ...form, to: e.target.value })}
                    className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100">
                    <option value="">Select shift</option>
                    <option>Evening Shift (02:00 PM – 11:00 PM)</option>
                    <option>Night Shift (10:00 PM – 07:00 AM)</option>
                    <option>General Shift (10:00 AM – 07:00 PM)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Requested From Date *</label>
                  <input required type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                    className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Reason *</label>
                  <textarea required rows={3} value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })}
                    placeholder="Describe the reason for shift change..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 resize-none" />
                </div>
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => setShowModal(false)}
                    className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50">
                    Cancel
                  </button>
                  <button type="submit"
                    className="flex-1 py-2.5 bg-[#7C3AED] text-white text-sm font-semibold rounded-xl hover:bg-[#6D28D9] transition-all">
                    Submit Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
