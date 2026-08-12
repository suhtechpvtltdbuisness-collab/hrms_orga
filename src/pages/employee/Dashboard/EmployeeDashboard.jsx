import React, { useCallback, useState, useEffect } from 'react';
import {
  Clock, Calendar, TrendingUp, DollarSign, CheckSquare, Bell, ChevronRight,
  ArrowUpRight, MapPin, Coffee, Zap, Award, Sun, CloudRain, Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { attendanceService, leaveService, leaveManagementService, payrollService } from '../../../service';
import {
  AttendanceSuccessModal,
  AttendanceVerificationModal,
  FaceAttendanceCard,
  FaceRegistrationWizard,
} from '../../../features/face-attendance/FaceAttendanceFlow';
import { useAnnouncements } from '../../../features/announcements/hooks/useAnnouncements';
import { canEmployeeView, relativeTime } from '../../../features/announcements/utils';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Good Morning', icon: '🌅' };
  if (h < 17) return { text: 'Good Afternoon', icon: '☀️' };
  return { text: 'Good Evening', icon: '🌙' };
};

const getRecordDate = (record) => record?.date || record?.attendanceDate || record?.createdAt;
const normalizeStatus = (value) => String(value || '').trim().toLowerCase().replace(/[\s_]+/g, '-');
const presentStatuses = new Set(['present', 'late', 'half-day', 'halfday']);

const normalizeTask = (task, index) => {
  const dueDate = task?.dueDate || task?.due || task?.deadline;
  const status = normalizeStatus(task?.status || 'pending');
  return {
    id: task?.id || index,
    title: task?.title || task?.name || task?.taskName || 'Assigned task',
    due: dueDate
      ? `Due ${new Date(dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}`
      : 'No due date',
    dueDate,
    priority: normalizeStatus(task?.priority || 'medium'),
    status,
  };
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
  const { items: announcementItems } = useAnnouncements();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayRecord, setTodayRecord] = useState(null);
  const [monthlyAttendance, setMonthlyAttendance] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({});
  const [holidays, setHolidays] = useState([]);
  const [salaryCard, setSalaryCard] = useState({ value: '—', sub: 'No payroll assigned' });
  const [verificationType, setVerificationType] = useState(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [attendanceResult, setAttendanceResult] = useState(null);

  const userData = (() => {
    try { return JSON.parse(localStorage.getItem('userData') || '{}'); } catch { return {}; }
  })();
  const userId = userData?.id;
  const displayName = userData?.name || userData?.fullName || userData?.email?.split('@')[0] || 'Employee';
  const { text: greeting, icon: greetIcon } = getGreeting();

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      const month = new Date().toISOString().slice(0, 7);
      const [todayRes, attendanceRes, balanceRes, holidaysRes, payrollRes] = await Promise.all([
        attendanceService.getTodayStatus(),
        attendanceService.getMyAttendance(month),
        userId ? leaveService.getBalance(userId) : Promise.resolve({ success: false }),
        leaveManagementService.getHolidays(),
        userId ? payrollService.getPayrollByUserId(userId) : Promise.resolve({ success: false }),
      ]);

      if (todayRes.success && todayRes.data) {
        setTodayRecord(todayRes.data.record || todayRes.data.attendance || todayRes.data.data || todayRes.data);
      }
      if (attendanceRes.success) {
        setMonthlyAttendance(Array.isArray(attendanceRes.data) ? attendanceRes.data : []);
      }
      if (balanceRes.success && balanceRes.data) {
        const balance = balanceRes.data;
        setLeaveBalance([
          { type: 'Casual Leave', used: Number(balance.casualLeaveTaken) || 0, total: Number(balance.casualLeave) || 0, gradFrom: '#756FCC', gradTo: '#9B7FDC' },
          { type: 'Sick Leave', used: Number(balance.sickLeaveTaken) || 0, total: Number(balance.sickLeave) || 0, gradFrom: '#85C3C2', gradTo: '#6B74BB' },
          { type: 'Earned Leave', used: Number(balance.paidLeaveTaken) || 0, total: Number(balance.paidLeave) || 0, gradFrom: '#B58CEC', gradTo: '#EDC0F3' },
        ]);
      }
      if (holidaysRes.success) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const upcoming = (holidaysRes.data?.holidays || [])
          .map((item) => {
            const raw = String(item.holidayDate || '').slice(0, 10);
            if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null;
            const [y, m, d] = raw.split('-').map(Number);
            const holidayDate = new Date(y, m - 1, d);
            holidayDate.setHours(0, 0, 0, 0);
            const days = Math.ceil((holidayDate - today) / (1000 * 60 * 60 * 24));
            if (days < 0) return null;
            return {
              id: item.id,
              name: item.name,
              date: holidayDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              }),
              days,
            };
          })
          .filter(Boolean)
          .sort((a, b) => a.days - b.days)
          .slice(0, 5);
        setHolidays(upcoming);
      }
      if (payrollRes.success) {
        const latest = Array.isArray(payrollRes.data) ? payrollRes.data[0] : null;
        const payroll = latest?.payroll || latest || null;
        const amount = payroll?.monthlyPay ?? payroll?.monthlyGross ?? payroll?.baseSalary ?? payroll?.ctc;
        const rawDate = payroll?.updatedAt || payroll?.createdAt;
        const sub = rawDate
          ? new Date(rawDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
          : 'Current salary';
        setSalaryCard({
          value: amount != null && amount !== ''
            ? `₹${Number(amount).toLocaleString('en-IN')}`
            : '—',
          sub: amount != null && amount !== '' ? `Current salary · ${sub}` : 'No payroll assigned',
        });
      }
    } catch (error) {
      console.error(error);
    }
  }, [userId]);

  useEffect(() => {
    // Existing dashboard API hydration; state is updated when the request resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboardData();
  }, [fetchDashboardData]);

  const formatTime = (isoString) => {
    if (!isoString) return null;
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCheckIn = () => setVerificationType('check-in');
  const handleCheckOut = () => setVerificationType('check-out');

  const handleAttendanceSuccess = (result) => {
    setVerificationType(null);
    setAttendanceResult(result);
    setTodayRecord((current) => ({
      ...(current || {}),
      ...(result.type === 'check-in' ? { checkIn: result.timestamp } : { checkOut: result.timestamp }),
    }));
  };

  const checkInTime = todayRecord && todayRecord.checkIn ? formatTime(todayRecord.checkIn) : null;
  const checkOutTime = todayRecord && todayRecord.checkOut ? formatTime(todayRecord.checkOut) : null;

  const attendancePercentage = monthlyAttendance.length
    ? Math.round((monthlyAttendance.filter((record) => presentStatuses.has(normalizeStatus(record.status))).length / monthlyAttendance.length) * 100)
    : Number(dashboardStats.attendancePercentage ?? dashboardStats.attendancePercent ?? 0);

  const startOfWeek = new Date();
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(startOfWeek.getDate() - ((startOfWeek.getDay() + 6) % 7));
  const attendance = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + index);
    const key = date.toISOString().slice(0, 10);
    const record = monthlyAttendance.find((item) => String(getRecordDate(item) || '').slice(0, 10) === key);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      status: record ? normalizeStatus(record.status) : index > 4 ? 'weekend' : 'unmarked',
    };
  });

  const statusColor = { present: 'bg-green-500', absent: 'bg-red-400', late: 'bg-amber-400', 'half-day': 'bg-amber-400', weekend: 'bg-gray-200', unmarked: 'bg-gray-100' };
  const pendingTasks = tasks.filter((task) => !['completed', 'done', 'cancelled'].includes(task.status));
  const pendingTaskCount = Number(dashboardStats.pendingTasks ?? dashboardStats.tasksPending ?? pendingTasks.length);
  const dueThisWeek = pendingTasks.filter((task) => {
    if (!task.dueDate) return false;
    const due = new Date(task.dueDate);
    const end = new Date(startOfWeek);
    end.setDate(end.getDate() + 7);
    return due >= startOfWeek && due < end;
  }).length;
  const totalLeaveRemaining = leaveBalance.reduce((sum, item) => sum + Math.max(0, item.total - item.used), 0);

  const priorityColor = { high: 'text-red-600 bg-red-50', medium: 'text-amber-600 bg-amber-50', low: 'text-green-600 bg-green-50' };

  const announcements = announcementItems
    .filter((announcement) => canEmployeeView(announcement, userData))
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, 3)
    .map((announcement) => ({
      ...announcement,
      time: relativeTime(announcement.publishedAt),
      category: announcement.type,
      color: announcement.priority === 'Urgent'
        ? 'bg-red-100 text-red-700'
        : announcement.priority === 'Important'
          ? 'bg-amber-100 text-amber-700'
          : 'bg-violet-100 text-violet-700',
    }));

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
        <StatCard icon={Clock} label="Attendance" value={`${attendancePercentage}%`} sub="This month" color="bg-violet-100 text-violet-600" onClick={() => navigate('/employee/attendance')} />
        <StatCard icon={Calendar} label="Leave Balance" value={totalLeaveRemaining} sub="Days remaining" color="bg-blue-100 text-blue-600" onClick={() => navigate('/employee/leave')} />
        <StatCard icon={CheckSquare} label="Tasks Pending" value={pendingTaskCount} sub={`${dueThisWeek} due this week`} color="bg-amber-100 text-amber-600" onClick={() => navigate('/employee/tasks')} />
        <StatCard icon={DollarSign} label="Monthly Salary" value={salaryCard.value} sub={salaryCard.sub} color="bg-green-100 text-green-600" onClick={() => navigate('/employee/payroll')} />
      </div>

      <FaceAttendanceCard onRegister={() => setShowRegistration(true)} />

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
              style={{ background: 'linear-gradient(135deg, #756FCC 0%, #B58CEC 100%)' }}
              className="w-full py-2.5 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              ✓ Check In
            </button>
          ) : !checkOutTime ? (
            <button
              onClick={handleCheckOut}
              className="w-full py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              ✗ Check Out
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
            {holidays.map((h) => (
              <div key={h.id || h.name} className="flex items-center justify-between p-3 bg-amber-50/50 rounded-xl border border-amber-100">
                <div>
                  <p className="text-xs font-semibold text-gray-800">{h.name}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{h.date}</p>
                </div>
                <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-lg">
                  {h.days === 0 ? 'Today' : `${h.days}d`}
                </span>
              </div>
            ))}
            {holidays.length === 0 && (
              <p className="py-6 text-center text-xs text-gray-400">No upcoming holidays</p>
            )}
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
            {pendingTasks.slice(0, 3).map((t, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-violet-50/30 transition-all cursor-pointer">
                <div className="w-1 h-full min-h-[40px] rounded-full bg-gradient-to-b from-violet-400 to-indigo-400 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">{t.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-gray-500">{t.due}</span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${priorityColor[t.priority] || priorityColor.medium}`}>
                      {t.priority}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-medium text-gray-500 bg-white border border-gray-200 px-2 py-1 rounded-lg whitespace-nowrap">
                  {t.status.replace('-', ' ')}
                </span>
              </div>
            ))}
            {pendingTasks.length === 0 && (
              <p className="py-6 text-center text-xs text-gray-400">No pending tasks</p>
            )}
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
            {announcements.map((a) => (
              <button type="button" onClick={() => navigate(`/employee/announcements?announcement=${a.id}`)} key={a.id} className="flex w-full items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-blue-50/30 transition-all cursor-pointer text-left">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-lg whitespace-nowrap mt-0.5 ${a.color}`}>{a.category}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">{a.title}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{a.time}</p>
                </div>
                <ChevronRight className="w-3 h-3 text-gray-400 shrink-0 mt-0.5" />
              </button>
            ))}
            {announcements.length === 0 && <p className="py-6 text-center text-xs text-gray-400">No published announcements</p>}
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

      {verificationType && (
        <AttendanceVerificationModal
          type={verificationType}
          onClose={() => setVerificationType(null)}
          onRegister={() => setShowRegistration(true)}
          onSuccess={handleAttendanceSuccess}
        />
      )}
      {showRegistration && (
        <FaceRegistrationWizard onClose={() => setShowRegistration(false)} />
      )}
      {attendanceResult && (
        <AttendanceSuccessModal result={attendanceResult} onClose={() => setAttendanceResult(null)} />
      )}
    </div>
  );
}
