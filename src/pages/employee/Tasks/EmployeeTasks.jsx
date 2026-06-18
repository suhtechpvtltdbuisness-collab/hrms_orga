import React, { useState } from 'react';
import { CheckCircle2, Clock, AlertTriangle, Circle, ChevronDown, Filter } from 'lucide-react';

const allTasks = [
  { id:1, title:'Q2 Performance Review Submission', project:'HR', due:'2025-06-18', priority:'high', status:'in-progress', progress:60, assignedBy:'Amit Sharma', desc:'Complete the self-appraisal form and submit to HR.' },
  { id:2, title:'Submit Expense Report - May', project:'Finance', due:'2025-06-20', priority:'medium', status:'pending', progress:0, assignedBy:'Finance Team', desc:'Upload all expense receipts for May 2025.' },
  { id:3, title:'Team Meeting Notes', project:'General', due:'2025-06-22', priority:'low', status:'pending', progress:0, assignedBy:'Amit Sharma', desc:'Document the key points from the Monday sync call.' },
  { id:4, title:'Update Project Documentation', project:'Engineering', due:'2025-06-15', priority:'high', status:'completed', progress:100, assignedBy:'Tech Lead', desc:'Finalize all API documentation in Confluence.' },
  { id:5, title:'Client Presentation Prep', project:'Sales', due:'2025-06-25', priority:'medium', status:'in-progress', progress:35, assignedBy:'Manager', desc:'Prepare slides for the upcoming client demo.' },
  { id:6, title:'Training Module Completion', project:'L&D', due:'2025-06-30', priority:'low', status:'pending', progress:0, assignedBy:'HR Team', desc:'Complete the mandatory cybersecurity training.' },
];

const priorityStyle = { high:'bg-red-100 text-red-600 border-red-200', medium:'bg-amber-100 text-amber-600 border-amber-200', low:'bg-green-100 text-green-600 border-green-200' };
const statusStyle = {
  'in-progress': { bg:'bg-blue-100', text:'text-blue-700', icon:Clock, label:'In Progress' },
  'pending':     { bg:'bg-gray-100', text:'text-gray-600', icon:Circle, label:'Pending' },
  'completed':   { bg:'bg-green-100', text:'text-green-700', icon:CheckCircle2, label:'Completed' },
};

export default function EmployeeTasks() {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const filtered = filter === 'all' ? allTasks : allTasks.filter(t => t.status === filter);
  const counts = { all: allTasks.length, pending: allTasks.filter(t=>t.status==='pending').length, 'in-progress': allTasks.filter(t=>t.status==='in-progress').length, completed: allTasks.filter(t=>t.status==='completed').length };

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Tasks</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage and track your assigned tasks</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { k:'all', label:'Total Tasks', color:'bg-violet-100 text-violet-600' },
          { k:'pending', label:'Pending', color:'bg-gray-100 text-gray-600' },
          { k:'in-progress', label:'In Progress', color:'bg-blue-100 text-blue-600' },
          { k:'completed', label:'Completed', color:'bg-green-100 text-green-600' },
        ].map(s => (
          <button key={s.k} onClick={() => setFilter(s.k)} className={`bg-white rounded-2xl p-4 border text-left transition-all shadow-sm hover:shadow-md ${filter===s.k?'border-violet-400 ring-2 ring-violet-100':'border-gray-100'}`}>
            <p className="text-2xl font-bold text-gray-900">{counts[s.k]}</p>
            <p className="text-xs font-medium text-gray-500 mt-0.5">{s.label}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Task List */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.map(task => {
            const s = statusStyle[task.status];
            const Icon = s.icon;
            const isOverdue = task.status !== 'completed' && new Date(task.due) < new Date();
            return (
              <div
                key={task.id}
                onClick={() => setSelected(task)}
                className={`bg-white rounded-xl p-4 border cursor-pointer transition-all hover:shadow-md ${selected?.id===task.id?'border-violet-400 ring-2 ring-violet-100':'border-gray-100 hover:border-gray-200'}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${s.bg}`}>
                    <Icon className={`w-3.5 h-3.5 ${s.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 leading-tight">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${priorityStyle[task.priority]}`}>{task.priority}</span>
                      <span className={`text-[10px] font-semibold ${isOverdue ? 'text-red-500' : 'text-gray-400'}`}>
                        {isOverdue ? '⚠ Overdue' : `Due ${new Date(task.due).toLocaleDateString('en-IN',{month:'short',day:'numeric'})}`}
                      </span>
                    </div>
                    {task.status === 'in-progress' && (
                      <div className="mt-2">
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all" style={{ width: `${task.progress}%` }} />
                        </div>
                        <p className="text-[10px] text-gray-400 mt-0.5">{task.progress}% complete</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <CheckCircle2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-400">No tasks in this category</p>
            </div>
          )}
        </div>

        {/* Task Detail */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-start justify-between gap-3 mb-5">
                <div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${priorityStyle[selected.priority]}`}>{selected.priority} priority</span>
                  <h2 className="text-base font-bold text-gray-900 mt-2">{selected.title}</h2>
                </div>
                <span className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${statusStyle[selected.status].bg} ${statusStyle[selected.status].text}`}>
                  {selected.status.replace('-',' ')}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-5 leading-relaxed">{selected.desc}</p>
              <div className="grid grid-cols-2 gap-4 mb-5">
                {[
                  { label:'Project', val:selected.project },
                  { label:'Assigned By', val:selected.assignedBy },
                  { label:'Due Date', val:new Date(selected.due).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) },
                  { label:'Priority', val:selected.priority },
                ].map(i => (
                  <div key={i.label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{i.label}</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5 capitalize">{i.val}</p>
                  </div>
                ))}
              </div>
              {selected.status === 'in-progress' && (
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-semibold text-gray-600">Progress</p>
                    <p className="text-xs font-bold text-violet-600">{selected.progress}%</p>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full" style={{ width:`${selected.progress}%` }} />
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                {selected.status !== 'completed' && (
                  <button className="flex-1 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-all">Mark Complete</button>
                )}
                <button className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all">Add Comment</button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
              <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-violet-400" />
              </div>
              <p className="text-sm font-semibold text-gray-500">Select a task to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
