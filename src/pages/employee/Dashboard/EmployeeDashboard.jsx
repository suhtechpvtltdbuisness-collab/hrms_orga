import React, { useState, useEffect } from 'react';
import {
  Clock, Calendar, TrendingUp, DollarSign, CheckSquare, Bell, ChevronRight,
  ArrowUpRight, MapPin, Coffee, Zap, Award, Sun, CloudRain, Star, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { attendanceService } from '../../../service';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Good Morning', icon: '🌅' };
  if (h < 17) return { text: 'Good Afternoon', icon: '☀️' };
  return { text: 'Good Evening', icon: '🌙' };
};

const StatCard = ({ icon, label, value, sub, color, onClick }) => {
  const CardIcon = icon;
  return (
  <div
    onClick={onClick}
    className={`bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group`}
  >
    <div className="flex items-start justify-between mb-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <CardIcon className="w-5 h-5" />
      </div>
      <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-violet-500 transition-colors" />
    </div>
    <p className="text-2xl font-bold text-gray-900 mb-0.5">{value}</p>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
  );
};

const QuickAction = ({ icon, label, color, onClick }) => {
  const ActionIcon = icon;
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 bg-white hover:shadow-md transition-all group`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
        <ActionIcon className="w-5 h-5" />
      </div>
      <span className="text-xs font-medium text-gray-600 text-center leading-tight">{label}</span>
    </button>
  );
};

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayRecord, setTodayRecord] = useState(null);
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [checkOutLoading, setCheckOutLoading] = useState(false);

  const userData = (() => {
    try { return JSON.parse(localStorage.getItem('userData') || '{}'); } catch { return {}; }
  })();
  const displayName = userData?.name || userData?.fullName || userData?.email?.split('@')[0] || 'Employee';
  const { text: greeting, icon: greetIcon } = getGreeting();

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const fetchTodayAttendance = async () => {
    try {
      const res = await attendanceService.getTodayStatus();
      if (res.success && res.data) {
        setTodayRecord(res.data.record || null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  const formatTime = (isoString) => {
    if (!isoString) return null;
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCheckIn = async () => {
    setCheckInLoading(true);
    try {
      const res = await attendanceService.checkInSelf();
      if (res.success) {
        await fetchTodayAttendance();
      } else {
        alert(res.message || 'Failed to check in');
      }
    } catch {
      alert('Failed to check in');
    } finally {
      setCheckInLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setCheckOutLoading(true);
    try {
      const res = await attendanceService.checkOutSelf();
      if (res.success) {
        await fetchTodayAttendance();
      } else {
        alert(res.message || 'Failed to check out');
      }
    } catch {
      alert('Failed to check out');
    } finally {
      setCheckOutLoading(false);
    }
  };

  const checkInTime = todayRecord && todayRecord.checkIn ? formatTime(todayRecord.checkIn) : null;
  const checkOutTime = todayRecord && todayRecord.checkOut ? formatTime(todayRecord.checkOut) : null;

  const attendance = [
    { day: 'Mon', status: 'present' }, { day: 'Tue', status: 'present' },
    { day: 'Wed', status: 'late' }, { day: 'Thu', status: 'present' },
    { day: 'Fri', status: 'absent' }, { day: 'Sat', status: 'weekend' },
    { day: 'Sun', status: 'weekend' },
  ];

  const statusColor = { present: 'bg-green-500', absent: 'bg-red-400', late: 'bg-amber-400', weekend: 'bg-gray-200' };

  const tasks = [
    { title: 'Q2 Performance Review', due: 'Due Tomorrow', priority: 'high', status: 'In Progress' },
    { title: 'Submit Expense Report', due: 'Due Jun 20', priority: 'medium', status: 'Pending' },
    { title: 'Team Meeting Notes', due: 'Due Jun 22', priority: 'low', status: 'Pending' },
  ];

  const priorityColor = { high: 'text-red-600 bg-red-50', medium: 'text-amber-600 bg-amber-50', low: 'text-green-600 bg-green-50' };

  const announcements = [
    { title: 'Company Picnic — July 5th', time: '2h ago', category: 'Event', color: 'bg-blue-100 text-blue-700' },
    { title: 'New Leave Policy Update', time: '1d ago', category: 'Policy', color: 'bg-violet-100 text-violet-700' },
    { title: 'Q2 All-Hands Meeting', time: '2d ago', category: 'Meeting', color: 'bg-green-100 text-green-700' },
  ];

  const holidays = [
    { name: 'Independence Day', date: 'Aug 15, 2025', days: 59 },
    { name: 'Gandhi Jayanti', date: 'Oct 2, 2025', days: 107 },
    { name: 'Diwali', date: 'Oct 20, 2025', days: 125 },
  ];

  const leaveBalance = [
    { type: 'Casual Leave', used: 3, total: 12, gradFrom: '#756FCC', gradTo: '#9B7FDC' },
    { type: 'Sick Leave', used: 1, total: 8, gradFrom: '#85C3C2', gradTo: '#6B74BB' },
    { type: 'Earned Leave', used: 5, total: 15, gradFrom: '#B58CEC', gradTo: '#EDC0F3' },
  ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Welcome Banner — using Orga logo gradient colors */}
      <div className="relative rounded-2xl p-6 text-white overflow-hidden" style={{ background: 'linear-gradient(135deg, #756FCC 0%, #9B7FDC 50%, #B58CEC 100%)' }}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-20" />
        <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-white/10 rounded-full translate-y-16" />
        <div className="absolute top-4 left-1/3 w-48 h-48 bg-white/5 rounded-full" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-purple-100 text-sm font-medium mb-1">{greetIcon} {greeting}</p>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">{displayName}</h1>
            <p className="text-purple-100 text-sm">
              {userData?.designation || 'Software Engineer'} · {userData?.department || 'Engineering'}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <p className="text-3xl font-bold tabular-nums">
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
            <p className="text-purple-100 text-sm">
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats + Check-In Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Clock} label="Attendance" value="92%" sub="This month" color="bg-violet-100 text-violet-600" onClick={() => navigate('/employee/attendance')} />
        <StatCard icon={Calendar} label="Leave Encashment" value="19" sub="Days remaining" color="bg-blue-100 text-blue-600" onClick={() => navigate('/employee/leave-encashment')} />
        <StatCard icon={CheckSquare} label="Tasks Pending" value="3" sub="2 due this week" color="bg-amber-100 text-amber-600" onClick={() => navigate('/employee/tasks')} />
        <StatCard icon={DollarSign} label="Last Payslip" value="₹45,000" sub="May 2025" color="bg-green-100 text-green-600" onClick={() => navigate('/employee/payroll')} />
      </div>

      {/* Check-in widget + This Week Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Check-in / Check-out */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
              <Coffee className="w-4 h-4 text-violet-600" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900">Today's Attendance</h2>
          </div>
          <div className="flex gap-3 mb-4">
            <div className="flex-1 bg-green-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">Check In</p>
              <p className="text-base font-bold text-green-600">{checkInTime || '--:--'}</p>
            </div>
            <div className="flex-1 bg-red-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">Check Out</p>
              <p className="text-base font-bold text-red-500">{checkOutTime || '--:--'}</p>
            </div>
          </div>
          {!checkInTime ? (
            <button
              onClick={handleCheckIn}
              disabled={checkInLoading}
              style={{ background: 'linear-gradient(135deg, #756FCC 0%, #B58CEC 100%)' }}
              className="w-full py-2.5 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              {checkInLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Checking In...</span>
                </>
              ) : (
                "✓ Check In"
              )}
            </button>
          ) : !checkOutTime ? (
            <button
              onClick={handleCheckOut}
              disabled={checkOutLoading}
              className="w-full py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              {checkOutLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Checking Out...</span>
                </>
              ) : (
                "✗ Check Out"
              )}
            </button>
          ) : (
            <div className="text-center py-2">
              <span className="text-xs text-green-600 font-semibold bg-green-50 px-3 py-1.5 rounded-full">✓ Day Complete</span>
            </div>
          )}
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-2 font-medium">This Week</p>
            <div className="flex gap-1.5">
              {attendance.map((a, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className={`w-full h-1.5 rounded-full ${statusColor[a.status]}`} />
                  <span className="text-[9px] text-gray-400">{a.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leave Balance */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900">Leave Balance</h2>
            </div>
            <button onClick={() => navigate('/employee/leave-encashment')} className="text-xs text-violet-600 font-medium hover:underline">Open</button>
          </div>
          <div className="space-y-4">
            {leaveBalance.map((l, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-gray-600">{l.type}</span>
                  <span className="text-xs font-bold text-gray-900">{l.total - l.used} <span className="text-gray-400 font-normal">/ {l.total} left</span></span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${((l.total - l.used) / l.total) * 100}%`, background: `linear-gradient(90deg, ${l.gradFrom}, ${l.gradTo})` }}
                    className="h-full rounded-full transition-all"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Holidays */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <Star className="w-4 h-4 text-amber-500" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900">Upcoming Holidays</h2>
          </div>
          <div className="space-y-3">
            {holidays.map((h, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-amber-50/50 rounded-xl border border-amber-100">
                <div>
                  <p className="text-xs font-semibold text-gray-800">{h.name}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{h.date}</p>
                </div>
                <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-lg">
                  {h.days}d
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tasks + Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Assigned Tasks */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                <CheckSquare className="w-4 h-4 text-violet-600" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900">Assigned Tasks</h2>
            </div>
            <button onClick={() => navigate('/employee/tasks')} className="text-xs text-violet-600 font-medium hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {tasks.map((t, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-violet-50/30 transition-all cursor-pointer">
                <div className="w-1 h-full min-h-[40px] rounded-full bg-gradient-to-b from-violet-400 to-indigo-400 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">{t.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-gray-500">{t.due}</span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${priorityColor[t.priority]}`}>
                      {t.priority}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-medium text-gray-500 bg-white border border-gray-200 px-2 py-1 rounded-lg whitespace-nowrap">
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Announcements */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <Bell className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900">Recent Announcements</h2>
            </div>
            <button onClick={() => navigate('/employee/announcements')} className="text-xs text-violet-600 font-medium hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {announcements.map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-blue-50/30 transition-all cursor-pointer">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-lg whitespace-nowrap mt-0.5 ${a.color}`}>{a.category}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">{a.title}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{a.time}</p>
                </div>
                <ChevronRight className="w-3 h-3 text-gray-400 shrink-0 mt-0.5" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          <QuickAction icon={Calendar} label="Encashment" color="bg-blue-100 text-blue-600" onClick={() => navigate('/employee/leave-encashment')} />
          <QuickAction icon={Clock} label="Request Attendance" color="bg-violet-100 text-violet-600" onClick={() => navigate('/employee/attendance')} />
          <QuickAction icon={DollarSign} label="Download Payslip" color="bg-green-100 text-green-600" onClick={() => navigate('/employee/payroll')} />
          <QuickAction icon={TrendingUp} label="View Performance" color="bg-amber-100 text-amber-600" onClick={() => navigate('/employee/performance')} />
          <QuickAction icon={Bell} label="Announcements" color="bg-pink-100 text-pink-600" onClick={() => navigate('/employee/announcements')} />
          <QuickAction icon={Zap} label="Support Ticket" color="bg-indigo-100 text-indigo-600" onClick={() => navigate('/employee/support')} />
        </div>
      </div>
    </div>
  );
}
