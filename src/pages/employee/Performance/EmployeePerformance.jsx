import React from 'react';
import { TrendingUp, Star, Award, Target, BarChart3, Zap } from 'lucide-react';

const ratings = [
  { period: 'Q1 2025', score: 4.2, status: 'completed', reviewer: 'Amit Sharma' },
  { period: 'Q4 2024', score: 3.9, status: 'completed', reviewer: 'Priya Nair' },
  { period: 'Q3 2024', score: 4.5, status: 'completed', reviewer: 'Amit Sharma' },
  { period: 'Q2 2025', score: null, status: 'upcoming', reviewer: 'Amit Sharma' },
];

const kpis = [
  { name: 'Code Quality', score: 88, target: 85 },
  { name: 'Task Completion Rate', score: 92, target: 90 },
  { name: 'Attendance', score: 95, target: 90 },
  { name: 'Team Collaboration', score: 80, target: 85 },
];

const energyLog = [
  { reason: 'Completed Sprint on time', points: 50, date: 'Jun 10' },
  { reason: 'Helped teammate debug issue', points: 25, date: 'Jun 8' },
  { reason: 'Led team standup', points: 15, date: 'Jun 5' },
  { reason: 'Late submission penalty', points: -10, date: 'Jun 3' },
];

const StarRating = ({ score }) => (
  <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map(i => (
      <Star key={i} className={`w-4 h-4 ${i <= Math.round(score) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
    ))}
    <span className="ml-2 text-sm font-bold text-gray-700">{score.toFixed(1)}</span>
  </div>
);

export default function EmployeePerformance() {
  const totalPoints = energyLog.reduce((s, l) => s + l.points, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Performance</h1>
        <p className="text-sm text-gray-500 mt-0.5">Track your appraisals, KPIs and energy points</p>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Overall Rating', val: '4.2 / 5', icon: Star, color: 'bg-amber-100 text-amber-600' },
          { label: 'Energy Points', val: totalPoints, icon: Zap, color: 'bg-violet-100 text-violet-600' },
          { label: 'Goal Completion', val: '87%', icon: Target, color: 'bg-green-100 text-green-600' },
          { label: 'Appraisals Done', val: '3', icon: Award, color: 'bg-blue-100 text-blue-600' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${c.color}`}><c.icon className="w-4.5 h-4.5" /></div>
            <p className="text-xl font-bold text-gray-900">{c.val}</p>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Appraisal History */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Appraisal History</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {ratings.map((r, i) => (
              <div key={i} className="px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{r.period}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Reviewed by {r.reviewer}</p>
                  {r.score ? <StarRating score={r.score} /> : <span className="text-xs text-violet-600 font-medium bg-violet-50 px-2 py-0.5 rounded-full mt-1 inline-block">Upcoming</span>}
                </div>
                {r.score && (
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold ${r.score >= 4 ? 'bg-green-100 text-green-700' : r.score >= 3 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600'}`}>
                    {r.score.toFixed(1)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* KPIs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">KPI Metrics</h2>
          </div>
          <div className="p-5 space-y-5">
            {kpis.map((kpi, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-gray-700">{kpi.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">Target: {kpi.target}%</span>
                    <span className={`text-xs font-bold ${kpi.score >= kpi.target ? 'text-green-600' : 'text-red-500'}`}>{kpi.score}%</span>
                  </div>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden relative">
                  <div className={`h-full rounded-full transition-all ${kpi.score >= kpi.target ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gradient-to-r from-red-400 to-red-500'}`} style={{ width:`${kpi.score}%` }} />
                  <div className="absolute top-0 h-full border-l-2 border-gray-400 border-dashed" style={{ left:`${kpi.target}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Energy Points Log */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Energy Points Log</h2>
            <span className={`text-sm font-bold px-3 py-1 rounded-full ${totalPoints >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>Total: {totalPoints > 0 ? '+' : ''}{totalPoints} pts</span>
          </div>
          <div className="divide-y divide-gray-50">
            {energyLog.map((log, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${log.points > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                    <Zap className={`w-4 h-4 ${log.points > 0 ? 'text-green-600' : 'text-red-500'}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{log.reason}</p>
                    <p className="text-xs text-gray-400">{log.date}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${log.points > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {log.points > 0 ? '+' : ''}{log.points}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
