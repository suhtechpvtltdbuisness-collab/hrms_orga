import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserCheck,
  UserX,
  ListTodo,
  Clock,
  CheckCircle2,
  Circle,
  TrendingDown,
  TrendingUp,
  Activity,
  Calendar,
  FileText,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  employeeService,
  attendanceService,
  leaveRequestService,
} from "../../service";
// ─── HRMS Dashboard ──────────────────────────────────────────────────────────── ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, sub, trend, highlighted, loading, onMouseEnter, onMouseLeave }) => (
  <div
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    className={`relative flex flex-col justify-between rounded-2xl p-4 border overflow-hidden cursor-pointer select-none h-full
      transition-all duration-300 ease-in-out
      ${ highlighted
        ? 'bg-gradient-to-br from-[#7D1EDB] to-[#a855f7] border-transparent text-white shadow-purple-200 shadow-lg -translate-y-1'
        : 'bg-white border-[#EBEBEB] hover:border-purple-100 hover:shadow-md'
      }`}
  >
    {highlighted && (
      <>
        <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/10 pointer-events-none transition-all duration-300" />
        <div className="absolute -right-2 bottom-2 w-14 h-14 rounded-full bg-white/5 pointer-events-none" />
      </>
    )}
    <div className="flex items-center gap-2 mb-3 z-10">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${
          highlighted ? 'bg-white/20' : 'bg-[#F3ECFF]'
        }`}
      >
        {React.cloneElement(icon, {
          size: 16,
          className: `transition-colors duration-300 ${highlighted ? 'text-white' : 'text-[#7D1EDB]'}`,
        })}
      </div>
      <span className={`text-sm font-medium transition-colors duration-300 ${highlighted ? 'text-white/90' : 'text-[#6B6B6B]'}`}>
        {label}
      </span>
    </div>
    <div className="z-10">
      <div className={`text-3xl font-bold leading-none mb-1 transition-colors duration-300 ${highlighted ? 'text-white' : 'text-[#1E1E1E]'}`}>
        {loading ? (
          <span className="inline-block w-12 h-7 bg-current opacity-10 rounded animate-pulse" />
        ) : (
          <>
            {value}
            {sub != null && (
              <span className={`text-base font-normal ml-1 transition-colors duration-300 ${highlighted ? 'text-white/70' : 'text-[#9B9B9B]'}`}>
                /{sub}
              </span>
            )}
          </>
        )}
      </div>
      {trend != null && !loading && (
        <div className={`flex items-center gap-1 text-xs mt-1 transition-colors duration-300 ${highlighted ? 'text-white/80' : 'text-[#9B9B9B]'}`}>
          {trend >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {Math.abs(trend)}% {trend >= 0 ? 'increase' : 'decrease'} from last month
        </div>
      )}
    </div>
  </div>
);

// ─── Onboarding Task Row ───────────────────────────────────────────────────────
const TaskRow = ({ title, date, done }) => (
  <div className="flex items-center justify-between py-3 border-b border-[#F5F5F5] last:border-0">
    <div className="flex-1 min-w-0 pr-3">
      <p className="text-sm font-medium text-[#1E1E1E] leading-snug truncate">{title}</p>
      <p className="text-xs text-[#9B9B9B] mt-0.5">{date}</p>
    </div>
    {done ? (
      <CheckCircle2 size={22} className="text-[#7D1EDB] shrink-0" />
    ) : (
      <Circle size={22} className="text-[#D9D9D9] shrink-0" />
    )}
  </div>
);

// ─── Activity Row ──────────────────────────────────────────────────────────────
const ActivityRow = ({ name, action, time }) => (
  <div className="flex items-center gap-3 py-3 border-b border-[#F5F5F5] last:border-0">
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-200 to-purple-400 flex items-center justify-center shrink-0">
      <Users size={14} className="text-purple-700" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm text-[#1E1E1E] leading-snug">
        <span className="font-semibold">{name}</span>
        {"'s "}
        {action}
      </p>
      <p className="text-xs text-[#9B9B9B] mt-0.5">{time}</p>
    </div>
  </div>
);

// ─── Custom Tooltip ────────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#EBEBEB] rounded-xl px-3 py-2 shadow-xl text-xs">
      <p className="font-semibold text-[#1E1E1E] mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.fill }}>
          {p.name}: {p.value}{p.unit || ""}
        </p>
      ))}
    </div>
  );
};

// ─── Skeleton loader ───────────────────────────────────────────────────────────
const Skeleton = ({ className }) => (
  <div className={`bg-gray-100 animate-pulse rounded-lg ${className}`} />
);

// ─── HRMS Dashboard ────────────────────────────────────────────────────────────
const HRMSDashboard = () => {
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  // ── State ──────────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
    pendingLeave: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [weeklyAttendance, setWeeklyAttendance] = useState([]);
  const [timeTracker, setTimeTracker] = useState([]);

  // Static onboarding tasks
  const tasks = [
    { title: "Interview-Frontend Developer", date: "Aug 10, 04:30", done: true },
    { title: "Team meeting-Fun Friday", date: "Aug 10, 04:30", done: false },
    { title: "Meeting-Project Update", date: "Aug 10, 04:30", done: false },
  ];
  const doneCount = tasks.filter((t) => t.done).length;
  const taskPercent = Math.round((doneCount / tasks.length) * 100);

  // My Tools quick-nav
  const myTools = [
    { label: "Employees", Icon: Users, path: "/hrms/employees" },
    { label: "Attendance", Icon: UserCheck, path: "/hrms/attendance" },
    { label: "Leave", Icon: Calendar, path: "/hrms/leave-application" },
    { label: "Reports", Icon: FileText, path: "/hrms/financial-reports/profit-and-loss" },
  ];

  // ── Data Fetch ─────────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const adminId = userData?.id || userData?._id;
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

      // Total employees
      let totalEmployees = 0;
      if (adminId) {
        const empRes = await employeeService.getAllEmployeesByAdminId(adminId);
        if (empRes.success && empRes.data) {
          totalEmployees = Array.isArray(empRes.data) ? empRes.data.length : 0;
        }
      }

      // Attendance
      let presentToday = 0;
      let absentToday = 0;
      let activityItems = [];
      const attRes = await attendanceService.getAttendances();
      if (attRes.success && attRes.data) {
        const records = Array.isArray(attRes.data) ? attRes.data : [];
        const today = new Date().toISOString().split("T")[0];

        const todayRecords = records.filter((r) => {
          const att = r.attendance || r;
          return (att.attendanceDate || att.date || "").startsWith(today);
        });

        presentToday = todayRecords.filter((r) => (r.attendance || r).status === "present").length;
        absentToday = todayRecords.filter((r) => (r.attendance || r).status === "absent").length;

        activityItems = records.slice(0, 5).map((r) => {
          const att = r.attendance || r;
          const emp = r.employee || r.user || r;
          const name = emp.name || att.empName || "Employee";
          const statusMap = {
            on_leave: "Leave request was approved",
            present: "checked in successfully",
            absent: "was marked absent",
          };
          const action = statusMap[att.status] || "attendance was marked";
          const rawDate = att.attendanceDate || att.date;
          const time = rawDate
            ? new Date(rawDate).toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })
            : "Recently";
          return { name, action, time };
        });
      }

      // Pending leave requests
      let pendingLeave = 0;
      const leaveRes = await leaveRequestService.getLeaveRequests({ status: "pending" });
      if (leaveRes.success && leaveRes.data) {
        const leaveData = Array.isArray(leaveRes.data) ? leaveRes.data : [];
        pendingLeave = leaveData.length;
        if (activityItems.length < 3) {
          const leaveItems = leaveData.slice(0, 3).map((lr) => ({
            name: lr.employeeName || lr.employee?.name || "Employee",
            action: "Leave request was submitted",
            time: lr.createdAt
              ? new Date(lr.createdAt).toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })
              : "Recently",
          }));
          activityItems = [...activityItems, ...leaveItems].slice(0, 5);
        }
      }

      // Weekly chart data
      setWeeklyAttendance(
        days.map((day) => ({
          day,
          Present: 60 + Math.floor(Math.random() * 35),
          Absent: 5 + Math.floor(Math.random() * 20),
          Leave: 3 + Math.floor(Math.random() * 15),
        }))
      );

      setTimeTracker(
        days.map((day) => ({
          day,
          hours: 3 + Math.floor(Math.random() * 7),
        }))
      );

      setStats({ totalEmployees, presentToday, absentToday, pendingLeave });
      setRecentActivity(activityItems);
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      className="h-[calc(100vh-6.5rem)] bg-[#F7F7F9] px-4 py-3 flex flex-col gap-3 overflow-hidden"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >


      {/* ── STAT CARDS ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-3 h-[20%] min-h-[110px]">
        <StatCard
          loading={loading}
          icon={<Users />}
          label="Total Employees"
          value={stats.totalEmployees}
          trend={-10}
          highlighted={hoveredCard === 'total'}
          onMouseEnter={() => setHoveredCard('total')}
          onMouseLeave={() => setHoveredCard(null)}
        />
        <StatCard
          loading={loading}
          icon={<UserCheck />}
          label="Present Today"
          value={stats.presentToday}
          sub={stats.totalEmployees || undefined}
          trend={-10}
          highlighted={hoveredCard === 'present'}
          onMouseEnter={() => setHoveredCard('present')}
          onMouseLeave={() => setHoveredCard(null)}
        />
        <StatCard
          loading={loading}
          icon={<UserX />}
          label="Absent Today"
          value={stats.absentToday}
          sub={stats.totalEmployees || undefined}
          trend={-10}
          highlighted={hoveredCard === 'absent'}
          onMouseEnter={() => setHoveredCard('absent')}
          onMouseLeave={() => setHoveredCard(null)}
        />
        <StatCard
          loading={loading}
          icon={<ListTodo />}
          label="Active Tasks"
          value={15}
          sub={35}
          highlighted={hoveredCard === 'tasks'}
          onMouseEnter={() => setHoveredCard('tasks')}
          onMouseLeave={() => setHoveredCard(null)}
        />
        <StatCard
          loading={loading}
          icon={<Clock />}
          label="Pending leave requests"
          value={stats.pendingLeave}
          highlighted={hoveredCard === 'leave'}
          onMouseEnter={() => setHoveredCard('leave')}
          onMouseLeave={() => setHoveredCard(null)}
        />
      </div>

      {/* ── MIDDLE ROW ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 h-[38%] min-h-0">

        {/* Onboarding Tasks */}
        <div className="bg-white border border-[#EBEBEB] rounded-2xl p-4 flex flex-col">
          <div className="flex items-center justify-between mb-1 shrink-0">
            <h2 className="text-base font-semibold text-[#1E1E1E]">Onboarding Tasks</h2>
            <span className="text-sm font-bold text-[#7D1EDB]">{taskPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#F3ECFF] rounded-full mb-3 overflow-hidden shrink-0">
            <div
              className="h-full bg-[#7D1EDB] rounded-full transition-all duration-700"
              style={{ width: `${taskPercent}%` }}
            />
          </div>
          <div className="flex-1 overflow-y-auto min-h-0 pr-1 space-y-1">
            {tasks.map((t, i) => <TaskRow key={i} {...t} />)}
          </div>
        </div>

        {/* Time Tracker */}
        <div className="bg-white border border-[#EBEBEB] rounded-2xl p-4 flex flex-col">
          <h2 className="text-base font-semibold text-[#1E1E1E] mb-2 shrink-0">Time Tracker</h2>
          <div className="flex-1 min-h-0">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeTracker} barSize={16} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#F5F5F5" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9B9B9B" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9B9B9B" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}h`} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="hours" name="Hours" unit="h" fill="#7D1EDB" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
          </div>
        </div>

        {/* Daily Attendance Statistics */}
        <div className="bg-white border border-[#EBEBEB] rounded-2xl p-4 flex flex-col">
          <h2 className="text-base font-semibold text-[#1E1E1E] mb-1 shrink-0">Daily Attendance statistic</h2>
          <div className="flex items-center gap-3 mb-2 flex-wrap shrink-0">
            {[
              { label: "Present%", color: "#7D1EDB" },
              { label: "Absent%", color: "#C084FC" },
              { label: "Leave%", color: "#E9D5FF" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
                <span className="text-[11px] text-[#6B6B6B]">{l.label}</span>
              </div>
            ))}
          </div>
          <div className="flex-1 min-h-0">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyAttendance} barSize={7} barGap={2} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#F5F5F5" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#9B9B9B" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "#9B9B9B" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="Present" name="Present%" fill="#7D1EDB" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Absent" name="Absent%" fill="#C084FC" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Leave" name="Leave%" fill="#E9D5FF" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 flex-1 min-h-0">

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white border border-[#EBEBEB] rounded-2xl p-4 flex flex-col">
          <div className="flex items-center justify-between mb-2 shrink-0">
            <h2 className="text-base font-semibold text-[#1E1E1E]">Recent Activity</h2>
            <button
              onClick={() => navigate("/hrms/attendance")}
              className="text-xs text-[#7D1EDB] hover:underline font-medium"
            >
              View all
            </button>
          </div>
          <div className="flex-1 overflow-y-auto min-h-0 pr-2">
            {loading ? (
              <div className="space-y-3 mt-1">
                {[1, 2, 3].map((k) => (
                  <div key={k} className="flex items-center gap-3">
                    <Skeleton className="w-9 h-9 rounded-full" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-3.5 w-3/4" />
                      <Skeleton className="h-2.5 w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentActivity.length > 0 ? (
              recentActivity.map((item, i) => <ActivityRow key={i} {...item} />)
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-[#C0C0C0] h-full">
                <Activity size={30} className="mb-2" />
                <p className="text-sm">No recent activity yet</p>
              </div>
            )}
          </div>
        </div>

        {/* My Tools */}
        <div className="bg-white border border-[#EBEBEB] rounded-2xl p-4 flex flex-col">
          <h2 className="text-base font-semibold text-[#1E1E1E] mb-3 shrink-0">My Tools</h2>
          <div className="grid grid-cols-2 gap-3 flex-1 min-h-0">
            {myTools.map(({ label, Icon, path }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className="flex flex-col items-center justify-center gap-1.5 rounded-xl bg-[#F7F4FF] hover:bg-[#EDD9FF] transition-colors group cursor-pointer h-full"
              >
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:shadow-md transition-shadow shrink-0">
                  <Icon size={20} className="text-[#7D1EDB]" />
                </div>
                <span className="text-xs font-medium text-[#6B6B6B] group-hover:text-[#7D1EDB] transition-colors text-center leading-tight">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRMSDashboard;
