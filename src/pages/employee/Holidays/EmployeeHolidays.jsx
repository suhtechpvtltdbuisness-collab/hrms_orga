import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { leaveManagementService } from '../../../service';

const typeStyle = {
  National: 'bg-orange-100 text-orange-700',
  Festival: 'bg-violet-100 text-violet-700',
  Optional: 'bg-blue-100 text-blue-700',
};

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const parseHolidayDate = (value) => {
  if (!value) return null;
  const raw = String(value).slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const [y, m, d] = raw.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(0, 0, 0, 0);
  return date;
};

export default function EmployeeHolidays() {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const year = new Date().getFullYear();
      const result = await leaveManagementService.getHolidays({ year });
      const rows = result.success ? result.data?.holidays || [] : [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      setHolidays(
        rows
          .map((item) => {
            const date = parseHolidayDate(item.holidayDate);
            if (!date) return null;
            return {
              id: item.id,
              name: item.name,
              date,
              day: date.toLocaleDateString('en-US', { weekday: 'long' }),
              type: item.holidayType || 'National',
              upcoming: date >= today,
            };
          })
          .filter(Boolean)
          .sort((a, b) => a.date - b.date),
      );
      setLoading(false);
    };
    load();
  }, []);

  const upcoming = holidays.filter((h) => h.upcoming);
  const past = holidays.filter((h) => !h.upcoming);
  const nextHoliday = upcoming[0];
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const daysAway = nextHoliday
    ? Math.ceil((nextHoliday.date - todayStart) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Holidays</h1>
        <p className="text-sm text-gray-500 mt-0.5">Company holiday calendar for the current year</p>
      </div>

      {nextHoliday && (
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-5 text-white flex items-center gap-5">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex flex-col items-center justify-center shrink-0">
            <Star className="w-6 h-6 fill-white" />
          </div>
          <div>
            <p className="text-amber-100 text-xs font-semibold uppercase tracking-wide">Next Holiday</p>
            <h2 className="text-xl font-bold mt-0.5">{nextHoliday.name}</h2>
            <p className="text-amber-100 text-sm">
              {nextHoliday.date.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}{' '}
              · {nextHoliday.day}
            </p>
          </div>
          <div className="ml-auto text-right hidden sm:block">
            <p className="text-3xl font-bold">{daysAway}</p>
            <p className="text-amber-100 text-xs">days away</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Holidays', val: holidays.length, color: 'bg-violet-100 text-violet-700' },
          { label: 'Upcoming', val: upcoming.length, color: 'bg-green-100 text-green-700' },
          { label: 'Passed', val: past.length, color: 'bg-gray-100 text-gray-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
            <p className={`text-2xl font-bold ${s.color.split(' ')[1]}`}>{s.val}</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Upcoming Holidays</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {!loading && upcoming.length === 0 && (
            <p className="px-5 py-8 text-center text-xs text-gray-400">No upcoming holidays</p>
          )}
          {upcoming.map((h) => (
            <div key={h.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-amber-50/30 transition-colors">
              <div className="w-12 h-12 bg-amber-50 border border-amber-100 rounded-xl flex flex-col items-center justify-center shrink-0">
                <p className="text-[10px] font-bold text-amber-600 uppercase">{MONTHS[h.date.getMonth()]}</p>
                <p className="text-base font-bold text-amber-700 leading-tight">{h.date.getDate()}</p>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{h.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{h.day}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeStyle[h.type] || typeStyle.National}`}>
                {h.type}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Past Holidays</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {!loading && past.length === 0 && (
            <p className="px-5 py-8 text-center text-xs text-gray-400">No past holidays</p>
          )}
          {past.map((h) => (
            <div key={h.id} className="flex items-center gap-4 px-5 py-3.5 opacity-60">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex flex-col items-center justify-center shrink-0">
                <p className="text-[10px] font-bold text-gray-500 uppercase">{MONTHS[h.date.getMonth()]}</p>
                <p className="text-base font-bold text-gray-600 leading-tight">{h.date.getDate()}</p>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{h.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{h.day}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeStyle[h.type] || typeStyle.National}`}>
                {h.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
