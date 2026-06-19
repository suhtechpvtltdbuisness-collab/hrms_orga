import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, XCircle, AlertTriangle, ChevronLeft, ChevronRight, Download, Filter, Loader2 } from 'lucide-react';
import { attendanceService } from '../../../service';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const STATUS_STYLE = {
  present: 'bg-green-100 text-green-700 border-green-200',
  absent:  'bg-red-100 text-red-600 border-red-200',
  half_day:'bg-amber-100 text-amber-600 border-amber-200',
  on_leave:'bg-blue-100 text-blue-600 border-blue-200',
  weekend: 'bg-gray-100 text-gray-400 border-gray-100',
  holiday: 'bg-violet-100 text-violet-600 border-violet-200',
  today:   'text-white border-transparent',
  late:    'bg-amber-100 text-amber-600 border-amber-200',
};

const STATUS_DISPLAY_NAME = {
  present: 'Present',
  absent: 'Absent',
  half_day: 'Half Day',
  on_leave: 'On Leave',
  weekend: 'Weekend',
  holiday: 'Holiday',
  late: 'Late Check-in',
};

const STATUS_CALENDAR_NAME = {
  present: 'P',
  absent: 'A',
  half_day: 'HD',
  on_leave: 'L',
  weekend: 'W',
  holiday: 'H',
  late: 'Late',
};

const PERIOD_STYLE = {
  full_time: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  half_day: 'bg-amber-100 text-amber-600 border-amber-200',
  less_than_half_day: 'bg-rose-100 text-rose-600 border-rose-200',
};

const PERIOD_DISPLAY_NAME = {
  full_time: 'Full Time',
  half_day: 'Half Day',
  less_than_half_day: 'Less Than Half Day',
};

export default function EmployeeAttendance() {
  const [view, setView] = useState('calendar');
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [records, setRecords] = useState([]);
  const [todayRecord, setTodayRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [checkOutLoading, setCheckOutLoading] = useState(false);
  const [time, setTime] = useState(new Date());
  
  // Track selected day in calendar view
  const isCurrentMonth = month === now.getMonth() && year === now.getFullYear();
  const [selectedDay, setSelectedDay] = useState(isCurrentMonth ? now.getDate() : 1);

  useEffect(() => { 
    const t = setInterval(() => setTime(new Date()), 1000); 
    return () => clearInterval(t); 
  }, []);

  useEffect(() => {
    const isCurr = month === now.getMonth() && year === now.getFullYear();
    setSelectedDay(isCurr ? now.getDate() : 1);
  }, [month, year]);

  const fetchTodayStatus = async () => {
    try {
      const res = await attendanceService.getTodayStatus();
      if (res.success && res.data) {
        setTodayRecord(res.data.record || null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAttendance = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
      const res = await attendanceService.getMyAttendance(monthStr);
      if (res.success) {
        setRecords(res.data || []);
      } else {
        setErrorMsg(res.message || 'Failed to load attendance records');
      }
    } catch (err) {
      setErrorMsg('Something went wrong while fetching attendance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayStatus();
    fetchAttendance();
  }, [month, year]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const formatTime = (isoString) => {
    if (!isoString) return null;
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatWorkHours = (inStr, outStr) => {
    if (!inStr || !outStr) return '--';
    const diffMs = new Date(outStr).getTime() - new Date(inStr).getTime();
    if (diffMs < 0) return '--';
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHrs}h ${diffMins}m`;
  };

  const selectedRecord = records.find(r => {
    if (!r.attendanceDate) return false;
    const d = new Date(r.attendanceDate);
    return d.getDate() === selectedDay && d.getMonth() === month && d.getFullYear() === year;
  });

  const isSelectedToday = selectedDay === now.getDate() && month === now.getMonth() && year === now.getFullYear();

  const displayRecord = isSelectedToday ? todayRecord : selectedRecord;

  const checkIn = displayRecord && displayRecord.checkIn ? formatTime(displayRecord.checkIn) : null;
  const checkOut = displayRecord && displayRecord.checkOut ? formatTime(displayRecord.checkOut) : null;
  const workHours = (displayRecord && displayRecord.checkIn && displayRecord.checkOut)
    ? formatWorkHours(displayRecord.checkIn, displayRecord.checkOut)
    : (displayRecord && displayRecord.checkIn ? 'In progress' : '--');

  const handleCheckIn = async () => {
    setErrorMsg('');
    setCheckInLoading(true);
    try {
      const res = await attendanceService.checkInSelf();
      if (res.success) {
        await fetchTodayStatus();
        await fetchAttendance();
      } else {
        setErrorMsg(res.message || 'Failed to check in');
      }
    } catch (err) {
      setErrorMsg('Failed to check in');
    } finally {
      setCheckInLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setErrorMsg('');
    setCheckOutLoading(true);
    try {
      const res = await attendanceService.checkOutSelf();
      if (res.success) {
        await fetchTodayStatus();
        await fetchAttendance();
      } else {
        setErrorMsg(res.message || 'Failed to check out');
      }
    } catch (err) {
      setErrorMsg('Failed to check out');
    } finally {
      setCheckOutLoading(false);
    }
  };

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y-1); } else setMonth(m => m-1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y+1); } else setMonth(m => m+1); };

  // Map day numbers of the selected month to their status
  const attendanceMap = {};
  records.forEach(r => {
    if (!r.attendanceDate) return;
    const datePart = r.attendanceDate.split('T')[0];
    const dayNum = parseInt(datePart.split('-')[2], 10);
    if (r.status === 'present' && r.period === 'half_day') {
      attendanceMap[dayNum] = 'half_day';
    } else {
      attendanceMap[dayNum] = r.lateEntry ? 'late' : r.status;
    }
  });

  const getDayStatus = (dayNum) => {
    const isToday = dayNum === now.getDate() && month === now.getMonth() && year === now.getFullYear();
    if (isToday) return 'today';

    if (attendanceMap[dayNum]) {
      return attendanceMap[dayNum];
    }

    const d = new Date(year, month, dayNum);
    const dayOfWeek = d.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) return 'weekend';

    // Default status for past weekdays if not marked
    const checkDate = new Date(year, month, dayNum);
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (checkDate < todayStart) {
      return 'absent';
    }

    return '';
  };

  // Stats calculation
  const present = records.filter(r => r.status === 'present' && r.period === 'full_time').length;
  const absent = records.filter(r => r.status === 'absent').length;
  const halfDay = records.filter(r => r.period === 'half_day').length;
  const leave = records.filter(r => r.status === 'on_leave').length;

  // Format list history
  const sortedRecords = [...records].sort((a, b) => new Date(b.attendanceDate).getTime() - new Date(a.attendanceDate).getTime());
  const history = sortedRecords.map(r => {
    const d = new Date(r.attendanceDate);
    let displayStatus = r.status;
    if (r.lateEntry && displayStatus === 'present' && r.period !== 'half_day') {
      displayStatus = 'late';
    }
    return {
      date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      day: DAYS[d.getDay()],
      status: displayStatus,
      period: r.period,
      in: r.checkIn ? formatTime(r.checkIn) : '-',
      out: r.checkOut ? formatTime(r.checkOut) : '-',
      hours: r.checkIn && r.checkOut ? formatWorkHours(r.checkIn, r.checkOut) : '-',
    };
  });

  const renderSelectedDayDetails = () => {
    if (!selectedDay) return null;

    const d = new Date(year, month, selectedDay);
    const dateFormatted = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    
    // Look up the record
    const record = records.find(r => {
      if (!r.attendanceDate) return false;
      const datePart = r.attendanceDate.split('T')[0];
      const dayNum = parseInt(datePart.split('-')[2], 10);
      return dayNum === selectedDay;
    });

    let displayStatus = 'unmarked';
    let displayPeriod = null;
    let checkInVal = '--:--';
    let checkOutVal = '--:--';
    let hoursVal = '--';
    let isLate = false;

    if (record) {
      displayStatus = record.status;
      displayPeriod = record.period;
      checkInVal = record.checkIn ? formatTime(record.checkIn) : '--:--';
      checkOutVal = record.checkOut ? formatTime(record.checkOut) : '--:--';
      hoursVal = record.checkIn && record.checkOut ? formatWorkHours(record.checkIn, record.checkOut) : '--';
      isLate = record.lateEntry;
      if (isLate && displayStatus === 'present') {
        displayStatus = 'late';
      }
    } else {
      const dayOfWeek = d.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        displayStatus = 'weekend';
      } else {
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        if (d < todayStart) {
          displayStatus = 'absent';
          displayPeriod = 'less_than_half_day';
        } else {
          displayStatus = 'upcoming';
        }
      }
    }

    const statusBadges = {
      present: 'bg-green-500/10 text-green-600 border-green-200/50',
      absent: 'bg-red-500/10 text-red-600 border-red-200/50',
      half_day: 'bg-amber-500/10 text-amber-600 border-amber-200/50',
      on_leave: 'bg-blue-500/10 text-blue-600 border-blue-200/50',
      weekend: 'bg-gray-500/10 text-gray-400 border-gray-200/50',
      upcoming: 'bg-gray-500/10 text-gray-500 border-gray-200/50',
      unmarked: 'bg-gray-500/10 text-gray-400 border-gray-200/50',
      late: 'bg-amber-500/10 text-amber-600 border-amber-200/50',
    };

    return (
      <div className="mt-5 p-5 bg-gradient-to-br from-white to-purple-50/20 rounded-2xl border border-purple-100/50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all duration-300 hover:shadow-md">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-purple-600 tracking-wider uppercase">Selected Date Details</p>
          <h3 className="text-base font-bold text-gray-900">{dateFormatted}</h3>
          <div className="flex flex-wrap gap-2 items-center mt-1">
            <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize border ${statusBadges[displayStatus] || statusBadges.unmarked}`}>
              {STATUS_DISPLAY_NAME[displayStatus] || displayStatus}
            </span>
            {displayPeriod && (
              <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize border ${PERIOD_STYLE[displayPeriod] || 'bg-gray-100 border-gray-200 text-gray-600'}`}>
                {PERIOD_DISPLAY_NAME[displayPeriod] || displayPeriod}
              </span>
            )}
            {isLate && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 border border-amber-200/50 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Late Check-in
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 min-w-[280px] md:min-w-[400px]">
          <div className="bg-white/80 rounded-xl p-3 border border-gray-100 text-center">
            <p className="text-[10px] text-gray-400 font-medium mb-1 uppercase tracking-wider">Check In</p>
            <p className={`text-sm font-bold ${isLate ? 'text-amber-500' : 'text-gray-700'}`}>{checkInVal}</p>
          </div>
          <div className="bg-white/80 rounded-xl p-3 border border-gray-100 text-center">
            <p className="text-[10px] text-gray-400 font-medium mb-1 uppercase tracking-wider">Check Out</p>
            <p className="text-sm font-bold text-gray-700">{checkOutVal}</p>
          </div>
          <div className="bg-white/80 rounded-xl p-3 border border-gray-100 text-center">
            <p className="text-[10px] text-gray-400 font-medium mb-1 uppercase tracking-wider">Hours</p>
            <p className="text-sm font-bold text-gray-700">{hoursVal}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Attendance</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track your daily attendance and working hours</p>
        </div>
        <button
          style={{ background: 'linear-gradient(135deg, #756FCC 0%, #B58CEC 100%)' }}
          className="flex items-center gap-2 px-4 py-2 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      {errorMsg && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Check-in Banner — logo gradient */}
      <div
        className="rounded-2xl p-5 text-white flex flex-col sm:flex-row items-center gap-5"
        style={{ background: 'linear-gradient(135deg, #756FCC 0%, #9B7FDC 50%, #B58CEC 100%)' }}
      >
        <div className="text-center sm:text-left">
          <p className="text-purple-100 text-sm">{isSelectedToday ? "Live Time" : "Selected Date"}</p>
          <p className="text-2xl font-bold tabular-nums mt-1 leading-none">
            {isSelectedToday 
              ? time.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',second:'2-digit'})
              : new Date(year, month, selectedDay).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
            }
          </p>
          <p className="text-purple-100 text-xs mt-1.5">
            {isSelectedToday
              ? time.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})
              : new Date(year, month, selectedDay).toLocaleDateString('en-US', { weekday: 'long' })
            }
          </p>
        </div>
        <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="flex-1 bg-white/15 rounded-xl p-4 text-center backdrop-blur">
            <p className="text-xs text-purple-100 mb-1">Check In</p>
            <p className="text-lg font-bold">{checkIn || '--:--'}</p>
            {isSelectedToday && !checkIn && (
              <button
                onClick={handleCheckIn}
                disabled={checkInLoading}
                className="mt-2 w-full py-1.5 bg-white text-[#756FCC] text-xs font-bold rounded-lg hover:bg-purple-50 transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                {checkInLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#756FCC]" />
                    <span>Processing...</span>
                  </>
                ) : (
                  "Check In"
                )}
              </button>
            )}
          </div>
          <div className="flex-1 bg-white/15 rounded-xl p-4 text-center backdrop-blur">
            <p className="text-xs text-purple-100 mb-1">Check Out</p>
            <p className="text-lg font-bold">{checkOut || '--:--'}</p>
            {isSelectedToday && checkIn && !checkOut && (
              <button
                onClick={handleCheckOut}
                disabled={checkOutLoading}
                className="mt-2 w-full py-1.5 bg-red-400 text-white text-xs font-bold rounded-lg hover:bg-red-500 transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                {checkOutLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                    <span>Processing...</span>
                  </>
                ) : (
                  "Check Out"
                )}
              </button>
            )}
            {checkIn && checkOut && <p className="text-xs text-green-200 mt-1.5 font-medium">✓ Day Complete</p>}
          </div>
          <div className="flex-1 bg-white/15 rounded-xl p-4 text-center backdrop-blur">
            <p className="text-xs text-purple-100 mb-1">Work Hours</p>
            <p className="text-lg font-bold">{workHours}</p>
            <p className="text-xs text-purple-200 mt-1 font-medium">Goal: 8h / day</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label:'Present', val: present, icon: CheckCircle2, color:'bg-green-100 text-green-600' },
          { label:'Absent', val: absent, icon: XCircle, color:'bg-red-100 text-red-500' },
          { label:'Half Day', val: halfDay, icon: AlertTriangle, color:'bg-amber-100 text-amber-500' },
          { label:'On Leave', val: leave, icon: Clock, color:'bg-blue-100 text-blue-500' },
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
            <button onClick={() => setView('calendar')} className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${view==='calendar'?'bg-white shadow text-purple-700':'text-gray-500'}`}>Calendar</button>
            <button onClick={() => setView('list')} className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${view==='list'?'bg-white shadow text-purple-700':'text-gray-500'}`}>List View</button>
          </div>
          {view === 'calendar' && (
            <div className="flex items-center gap-3">
              <button onClick={prevMonth} className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"><ChevronLeft className="w-3.5 h-3.5"/></button>
              <span className="text-sm font-semibold text-gray-800 w-32 text-center">{MONTHS[month]} {year}</span>
              <button onClick={nextMonth} className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"><ChevronRight className="w-3.5 h-3.5"/></button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-gray-500 font-medium">Loading attendance data...</div>
        ) : view === 'calendar' ? (
          <div className="p-5">
            <div className="grid grid-cols-7 mb-2">
              {DAYS.map(d => <div key={d} className="text-center text-[11px] font-bold text-gray-400 py-1">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({length: firstDay}).map((_,i) => <div key={i} />)}
              {Array.from({length: daysInMonth}, (_,i) => i+1).map(day => {
                const status = getDayStatus(day);
                const isToday = status === 'today';
                const isSelected = day === selectedDay;
                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center border text-[11px] font-semibold transition-all hover:scale-105 cursor-pointer ${isSelected ? 'ring-2 ring-purple-600 scale-105 z-10 shadow-sm' : ''} ${STATUS_STYLE[status] || 'bg-gray-50 text-gray-400 border-gray-100'}`}
                    style={isToday ? { background: 'linear-gradient(135deg, #756FCC 0%, #B58CEC 100%)', borderColor: 'transparent' } : {}}
                  >
                    <span>{day}</span>
                    {status && status !== 'weekend' && !isToday && (
                      <span className="text-[8px] mt-0.5 font-bold capitalize opacity-85">{STATUS_CALENDAR_NAME[status] || status}</span>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Render details of clicked date */}
            {renderSelectedDayDetails()}

            <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-gray-100">
              {[['Present','bg-green-400'],['Absent','bg-red-400'],['Half Day','bg-amber-400'],['Leave','bg-blue-400'],['Holiday','bg-violet-400'],['Weekend','bg-gray-300'],['Late Entry','bg-amber-500']].map(([l,c]) => (
                <div key={l} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${c}`} />
                  <span className="text-[11px] text-gray-500">{l}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {history.length === 0 ? (
              <div className="p-10 text-center text-sm text-gray-500 font-medium">No records found for this month.</div>
            ) : (
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-50 border-b border-gray-100">
                  {['Date','Day','Check In','Check Out','Hours','Status','Period'].map(h => (
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
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize border ${STATUS_STYLE[r.status] || 'bg-gray-100 text-gray-400 border-gray-100'}`}>
                          {STATUS_DISPLAY_NAME[r.status] || r.status}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        {r.period ? (
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize border ${PERIOD_STYLE[r.period] || 'bg-gray-100 text-gray-400 border-gray-100'}`}>
                            {PERIOD_DISPLAY_NAME[r.period] || r.period}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
