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
  Briefcase,
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
  dashboardService,
} from "../../service";
// ─── HRMS Dashboard ──────────────────────────────────────────────────────────── ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, sub, trend, highlighted, loading, onMouseEnter, onMouseLeave }) => (
  <div
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    className={`relative flex flex-col justify-between rounded-2xl p-4 border overflow-hidden cursor-pointer select-none min-h-[132px]
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

  // ── State ──────────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
    pendingLeave: 0,
    activeTasks: 0,
    totalTasks: 0,
  });
  const [trends, setTrends] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [weeklyAttendance, setWeeklyAttendance] = useState([]);
  const [timeTracker, setTimeTracker] = useState([]);
  const [activeJobs, setActiveJobs] = useState(0);
  const [recentJobs, setRecentJobs] = useState([]);

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
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

      const response = await dashboardService.getAdminDashboard();
      if (!response.success) throw new Error(response.message);
      const data = response.data || {};

      setStats({
        totalEmployees: data.stats?.totalEmployees ?? 0,
        presentToday: data.stats?.presentToday ?? 0,
        absentToday: data.stats?.absentToday ?? 0,
        pendingLeave: data.stats?.pendingLeave ?? 0,
        activeTasks: data.stats?.activeTasks ?? 0,
        totalTasks: data.stats?.totalTasks ?? 0,
      });
      setTrends(data.trends || {});
      setWeeklyAttendance(Array.isArray(data.weeklyAttendance) ? data.weeklyAttendance : []);
      setActiveJobs(data.stats?.activeJobs ?? 0);
      setRecentJobs(Array.isArray(data.recentJobs) ? data.recentJobs : []);
      setRecentActivity(
        (Array.isArray(data.recentActivity) ? data.recentActivity : []).map((item) => ({
          ...item,
          time: item.occurredAt
            ? new Date(item.occurredAt).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
            : "Recently",
        })),
      );

      setTimeTracker(
        days.map((day) => ({
          day,
          hours: 3 + Math.floor(Math.random() * 7),
        }))
      );

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
      className="min-h-[calc(100vh-7rem)] bg-[#F7F7F9] px-3 py-3 sm:px-4 lg:px-5 flex flex-col gap-4 overflow-x-hidden"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >


      {/* ── STAT CARDS ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-3">
        <StatCard
          loading={loading}
          icon={<Users />}
          label="Total Employees"
          value={stats.totalEmployees}
          trend={trends.totalEmployees}
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
          trend={trends.presentToday}
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
          trend={trends.absentToday}
          highlighted={hoveredCard === 'absent'}
          onMouseEnter={() => setHoveredCard('absent')}
          onMouseLeave={() => setHoveredCard(null)}
        />
        <StatCard
          loading={loading}
          icon={<ListTodo />}
          label="Active Tasks"
          value={stats.activeTasks}
          sub={stats.totalTasks || undefined}
          highlighted={hoveredCard === 'tasks'}
          onMouseEnter={() => setHoveredCard('tasks')}
          onMouseLeave={() => setHoveredCard(null)}
        />
        <StatCard
          loading={loading}
          icon={<Briefcase />}
          label="Active Job Openings"
          value={activeJobs}
          highlighted={hoveredCard === 'jobs'}
          onMouseEnter={() => setHoveredCard('jobs')}
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

      {/* ── DASHBOARD CONTENT GRID ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-stretch">

        {/* Onboarding Tasks */}
        <div className="order-1 bg-white border border-[#EBEBEB] rounded-2xl p-4 flex flex-col min-h-[300px] md:h-[360px]">
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
        <div className="order-2 bg-white border border-[#EBEBEB] rounded-2xl p-4 flex flex-col min-h-[320px] md:h-[360px]">
          <h2 className="text-base font-semibold text-[#1E1E1E] mb-2 shrink-0">Time Tracker</h2>
          <div className="flex-1 min-h-[230px]">
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
        <div className="order-3 bg-white border border-[#EBEBEB] rounded-2xl p-4 flex flex-col min-h-[320px] md:h-[360px]">
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
          <div className="flex-1 min-h-[230px]">
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
        {/* Recent Activity */}
        <div className="order-5 xl:order-4 bg-white border border-[#EBEBEB] rounded-2xl p-4 flex flex-col min-h-[280px] md:h-[320px]">
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

        {/* Job Openings */}
        <div className="order-6 xl:order-5 bg-white border border-[#EBEBEB] rounded-2xl p-4 flex flex-col min-h-[280px] md:h-[320px]">
          <div className="flex items-center justify-between mb-2 shrink-0">
            <h2 className="text-base font-semibold text-[#1E1E1E]">Job Openings</h2>
            <button
              onClick={() => navigate("/hrms/hiring")}
              className="text-xs text-[#7D1EDB] hover:underline font-medium"
            >
              View all
            </button>
          </div>
          <div className="flex-1 overflow-y-auto min-h-0 pr-1 space-y-1">
            {loading ? (
              <div className="space-y-3 mt-1">
                {[1, 2, 3].map((k) => (
                  <Skeleton key={k} className="h-10 w-full rounded-lg" />
                ))}
              </div>
            ) : recentJobs.length > 0 ? (
              recentJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => navigate(`/hrms/hiring?jobId=${job.id}`)}
                  className="flex items-center justify-between py-2.5 px-2 rounded-lg hover:bg-[#F7F4FF] cursor-pointer transition-colors border-b border-[#F5F5F5] last:border-0"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="text-sm font-medium text-[#1E1E1E] truncate">{job.title}</p>
                    <p className="text-[11px] text-[#9B9B9B]">{job.department} · {job.location}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 max-sm:flex-col max-sm:items-end">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      job.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {job.status}
                    </span>
                    <span className="text-xs text-[#9B9B9B]">{job.openings} open</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-[#C0C0C0] h-full">
                <Briefcase size={28} className="mb-2" />
                <p className="text-sm">No job openings yet</p>
              </div>
            )}
          </div>
        </div>

        {/* My Tools */}
        <div className="order-4 xl:order-6 bg-white border border-[#EBEBEB] rounded-2xl p-4 flex flex-col min-h-[300px] md:h-[360px] xl:h-[320px]">
          <h2 className="text-base font-semibold text-[#1E1E1E] mb-3 shrink-0">My Tools</h2>
          <div className="grid grid-cols-2 gap-3 flex-1 auto-rows-fr">
            {myTools.map(({ label, Icon, path }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className="flex min-h-[105px] flex-col items-center justify-center gap-1.5 rounded-xl bg-[#F7F4FF] hover:bg-[#EDD9FF] transition-colors group cursor-pointer"
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
