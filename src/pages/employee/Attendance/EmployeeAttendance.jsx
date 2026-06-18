import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, XCircle, AlertTriangle, ChevronLeft, ChevronRight, Download, Filter } from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const STATUS_STYLE = {
  present: 'bg-green-100 text-green-700 border-green-200',
  absent:  'bg-red-100 text-red-600 border-red-200',
  late:    'bg-amber-100 text-amber-600 border-amber-200',
  leave:   'bg-blue-100 text-blue-600 border-blue-200',
  weekend: 'bg-gray-100 text-gray-400 border-gray-100',
  holiday: 'bg-violet-100 text-violet-600 border-violet-200',
  today:   'bg-violet-600 text-white border-violet-600',
};

// Mock attendance data for current month
const mockAttendance = {};
const now = new Date();
for (let d = 1; d < now.getDate(); d++) {
  const day = new Date(now.getFullYear(), now.getMonth(), d).getDay();
  if (day === 0 || day === 6) { mockAttendance[d] = 'weekend'; continue; }
  const r = Math.random();
  mockAttendance[d] = r > 0.85 ? 'absent' : r > 0.75 ? 'late' : r > 0.6 ? 'leave' : 'present';
}

const history = Array.from({ length: 20 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() - i);
  const dow = d.getDay();
  const s = dow === 0 || dow === 6 ? 'weekend' : mockAttendance[d.getDate()] || 'present';
  const inT = s === 'present' ? '09:' + String(Math.floor(Math.random()*20+1)).padStart(2,'0') + ' AM' : s === 'late' ? '10:' + String(Math.floor(Math.random()*30+1)).padStart(2,'0') + ' AM' : '-';
  const outT = (s === 'present' || s === 'late') ? '06:' + String(Math.floor(Math.random()*30)).padStart(2,'0') + ' PM' : '-';
  const hrs = (s === 'present' || s === 'late') ? `${Math.floor(8 + Math.random()*2)}h ${Math.floor(Math.random()*59)}m` : '-';
  return { date: d.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}), day: DAYS[dow], status: s, in: inT, out: outT, hours: hrs };
});

export default function EmployeeAttendance() {
  const [view, setView] = useState('calendar');
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [checkIn, setCheckIn] = useState(() => localStorage.getItem('emp_checkIn'));
  const [checkOut, setCheckOut] = useState(() => localStorage.getItem('emp_checkOut'));
  const [time, setTime] = useState(new Date());

  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const stats = Object.values(mockAttendance);
  const present = stats.filter(s => s === 'present').length;
  const absent = stats.filter(s => s === 'absent').length;
  const late = stats.filter(s => s === 'late').length;
  const leave = stats.filter(s => s === 'leave').length;

  const handleCheckIn = () => { const t = new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'}); setCheckIn(t); localStorage.setItem('emp_checkIn',t); };
  const handleCheckOut = () => { const t = new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'}); setCheckOut(t); localStorage.setItem('emp_checkOut',t); };

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y-1); } else setMonth(m => m-1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y+1); } else setMonth(m => m+1); };

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Attendance</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track your daily attendance and working hours</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-all">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      {/* Check-in Banner */}
      <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-center gap-5">
        <div className="text-center sm:text-left">
          <p className="text-violet-200 text-sm">Live Time</p>
          <p className="text-3xl font-bold tabular-nums mt-1">{time.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',second:'2-digit'})}</p>
          <p className="text-violet-200 text-xs mt-1">{time.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</p>
        </div>
        <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="flex-1 bg-white/10 rounded-xl p-4 text-center backdrop-blur">
            <p className="text-xs text-violet-200 mb-1">Check In</p>
            <p className="text-lg font-bold">{checkIn || '--:--'}</p>
            {!checkIn && <button onClick={handleCheckIn} className="mt-2 w-full py-1.5 bg-white text-violet-700 text-xs font-bold rounded-lg hover:bg-violet-50 transition-all active:scale-95">Check In</button>}
          </div>
          <div className="flex-1 bg-white/10 rounded-xl p-4 text-center backdrop-blur">
            <p className="text-xs text-violet-200 mb-1">Check Out</p>
            <p className="text-lg font-bold">{checkOut || '--:--'}</p>
            {checkIn && !checkOut && <button onClick={handleCheckOut} className="mt-2 w-full py-1.5 bg-red-400 text-white text-xs font-bold rounded-lg hover:bg-red-500 transition-all active:scale-95">Check Out</button>}
            {checkIn && checkOut && <p className="text-xs text-green-300 mt-1.5 font-medium">✓ Day Complete</p>}
          </div>
          <div className="flex-1 bg-white/10 rounded-xl p-4 text-center backdrop-blur">
            <p className="text-xs text-violet-200 mb-1">Work Hours</p>
            <p className="text-lg font-bold">{(checkIn && checkOut) ? '8h 42m' : checkIn ? 'In progress' : '--'}</p>
            <p className="text-xs text-violet-300 mt-1">Goal: 9h / day</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label:'Present', val: present, icon: CheckCircle2, color:'bg-green-100 text-green-600', badge:'badge-success' },
          { label:'Absent', val: absent, icon: XCircle, color:'bg-red-100 text-red-500', badge:'badge-danger' },
          { label:'Late', val: late, icon: AlertTriangle, color:'bg-amber-100 text-amber-500', badge:'badge-warning' },
          { label:'On Leave', val: leave, icon: Clock, color:'bg-blue-100 text-blue-500', badge:'badge-info' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{s.val}</p>
              <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* View Toggle */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button onClick={() => setView('calendar')} className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${view==='calendar'?'bg-white shadow text-violet-700':'text-gray-500'}`}>Calendar</button>
            <button onClick={() => setView('list')} className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${view==='list'?'bg-white shadow text-violet-700':'text-gray-500'}`}>List View</button>
          </div>
          {view === 'calendar' && (
            <div className="flex items-center gap-3">
              <button onClick={prevMonth} className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"><ChevronLeft className="w-3.5 h-3.5"/></button>
              <span className="text-sm font-semibold text-gray-800 w-32 text-center">{MONTHS[month]} {year}</span>
              <button onClick={nextMonth} className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"><ChevronRight className="w-3.5 h-3.5"/></button>
            </div>
          )}
        </div>

        {view === 'calendar' ? (
          <div className="p-5">
            <div className="grid grid-cols-7 mb-2">
              {DAYS.map(d => <div key={d} className="text-center text-[11px] font-bold text-gray-400 py-1">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({length: firstDay}).map((_,i) => <div key={i} />)}
              {Array.from({length: daysInMonth}, (_,i) => i+1).map(day => {
                const isToday = day === now.getDate() && month === now.getMonth() && year === now.getFullYear();
                const status = isToday ? 'today' : mockAttendance[day] || (new Date(year,month,day).getDay()===0||new Date(year,month,day).getDay()===6?'weekend':'');
                return (
                  <div key={day} className={`aspect-square rounded-xl flex flex-col items-center justify-center border text-[11px] font-semibold transition-all hover:scale-105 ${STATUS_STYLE[status] || 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                    <span>{day}</span>
                    {status && status !== 'weekend' && status !== 'today' && (
                      <span className="text-[8px] mt-0.5 font-bold capitalize opacity-80">{status.slice(0,1).toUpperCase()}</span>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-gray-100">
              {[['Present','bg-green-400'],['Absent','bg-red-400'],['Late','bg-amber-400'],['Leave','bg-blue-400'],['Holiday','bg-violet-400'],['Weekend','bg-gray-300']].map(([l,c]) => (
                <div key={l} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${c}`} />
                  <span className="text-[11px] text-gray-500">{l}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 border-b border-gray-100">
                {['Date','Day','Check In','Check Out','Hours','Status'].map(h => (
                  <th key={h} className="text-left text-xs font-bold text-gray-400 uppercase tracking-wide px-5 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {history.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-xs font-medium text-gray-700 whitespace-nowrap">{r.date}</td>
                    <td className="px-5 py-3 text-xs text-gray-500">{r.day}</td>
                    <td className="px-5 py-3 text-xs text-gray-600 font-mono">{r.in}</td>
                    <td className="px-5 py-3 text-xs text-gray-600 font-mono">{r.out}</td>
                    <td className="px-5 py-3 text-xs text-gray-600">{r.hours}</td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize border ${STATUS_STYLE[r.status] || 'bg-gray-100 text-gray-400 border-gray-100'}`}>{r.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
