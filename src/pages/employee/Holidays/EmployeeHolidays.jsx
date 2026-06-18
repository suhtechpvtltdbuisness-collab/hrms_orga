import React from 'react';
import { Star, CalendarDays } from 'lucide-react';

const holidays = [
  { name: 'Independence Day', date: 'August 15, 2025', day: 'Friday', type: 'National', upcoming: true },
  { name: 'Janmashtami', date: 'August 16, 2025', day: 'Saturday', type: 'Festival', upcoming: true },
  { name: 'Gandhi Jayanti', date: 'October 2, 2025', day: 'Thursday', type: 'National', upcoming: true },
  { name: 'Dussehra', date: 'October 2, 2025', day: 'Thursday', type: 'Festival', upcoming: true },
  { name: 'Diwali', date: 'October 20, 2025', day: 'Monday', type: 'Festival', upcoming: true },
  { name: 'Diwali (Additional)', date: 'October 21, 2025', day: 'Tuesday', type: 'Festival', upcoming: true },
  { name: 'Christmas', date: 'December 25, 2025', day: 'Thursday', type: 'National', upcoming: true },
  { name: 'New Year', date: 'January 1, 2026', day: 'Thursday', type: 'National', upcoming: true },
  // Past
  { name: 'New Year 2025', date: 'January 1, 2025', day: 'Wednesday', type: 'National', upcoming: false },
  { name: 'Republic Day', date: 'January 26, 2025', day: 'Sunday', type: 'National', upcoming: false },
  { name: 'Holi', date: 'March 14, 2025', day: 'Friday', type: 'Festival', upcoming: false },
  { name: 'Good Friday', date: 'April 18, 2025', day: 'Friday', type: 'National', upcoming: false },
  { name: 'Eid ul-Fitr', date: 'April 10, 2025', day: 'Thursday', type: 'Festival', upcoming: false },
];

const typeStyle = {
  National: 'bg-orange-100 text-orange-700',
  Festival: 'bg-violet-100 text-violet-700',
};

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function EmployeeHolidays() {
  const upcoming = holidays.filter(h => h.upcoming);
  const past = holidays.filter(h => !h.upcoming);
  const nextHoliday = upcoming[0];

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Holidays</h1>
        <p className="text-sm text-gray-500 mt-0.5">Company holiday calendar for the current year</p>
      </div>

      {/* Next Holiday Banner */}
      {nextHoliday && (
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-5 text-white flex items-center gap-5">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex flex-col items-center justify-center shrink-0">
            <Star className="w-6 h-6 fill-white" />
          </div>
          <div>
            <p className="text-amber-100 text-xs font-semibold uppercase tracking-wide">Next Holiday</p>
            <h2 className="text-xl font-bold mt-0.5">{nextHoliday.name}</h2>
            <p className="text-amber-100 text-sm">{nextHoliday.date} · {nextHoliday.day}</p>
          </div>
          <div className="ml-auto text-right hidden sm:block">
            <p className="text-3xl font-bold">{Math.ceil((new Date(nextHoliday.date) - new Date()) / (1000*60*60*24))}</p>
            <p className="text-amber-100 text-xs">days away</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label:'Total Holidays', val: holidays.length, color:'bg-violet-100 text-violet-700' },
          { label:'Upcoming', val: upcoming.length, color:'bg-green-100 text-green-700' },
          { label:'Passed', val: past.length, color:'bg-gray-100 text-gray-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
            <p className={`text-2xl font-bold ${s.color.split(' ')[1]}`}>{s.val}</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Upcoming */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Upcoming Holidays</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {upcoming.map((h, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-amber-50/30 transition-colors">
              <div className="w-12 h-12 bg-amber-50 border border-amber-100 rounded-xl flex flex-col items-center justify-center shrink-0">
                <p className="text-[10px] font-bold text-amber-600 uppercase">{MONTHS[new Date(h.date).getMonth()]}</p>
                <p className="text-base font-bold text-amber-700 leading-tight">{new Date(h.date).getDate()}</p>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{h.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{h.day}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeStyle[h.type]}`}>{h.type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Past */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Past Holidays</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {past.map((h, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3.5 opacity-60">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex flex-col items-center justify-center shrink-0">
                <p className="text-[10px] font-bold text-gray-500 uppercase">{MONTHS[new Date(h.date).getMonth()]}</p>
                <p className="text-base font-bold text-gray-600 leading-tight">{new Date(h.date).getDate()}</p>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{h.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{h.day}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeStyle[h.type]}`}>{h.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
