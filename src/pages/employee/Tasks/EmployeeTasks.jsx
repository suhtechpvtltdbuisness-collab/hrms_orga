import React, { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { AlertTriangle, CheckCircle2, CheckSquare, Loader2, Search } from 'lucide-react';
import { isDemoMode, projectService } from '../../../features/projects/projectService';
import TaskDetailPanel from '../../../features/projects/TaskDetailPanel';
import { dueLabel, isOverdue, priorityTone, sortTasks, statusLabels, statusTone } from '../../../features/projects/taskUi';

const groups = [
  { key: '', label: 'All' },
  { key: 'TODO', label: 'To do' },
  { key: 'IN_PROGRESS', label: 'In progress' },
  { key: 'IN_REVIEW', label: 'In review' },
  { key: 'COMPLETED', label: 'Completed' },
];

export default function EmployeeTasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [status, setStatus] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [usingDemo, setUsingDemo] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [taskResponse, projectResponse] = await Promise.all([
        projectService.myTasks(),
        projectService.myProjects().catch(() => ({ items: [] })),
      ]);
      setTasks(taskResponse?.items ?? taskResponse?.tasks ?? taskResponse ?? []);
      setProjects(projectResponse?.items ?? projectResponse?.projects ?? projectResponse ?? []);
      setUsingDemo(isDemoMode());
    } catch (loadError) {
      setError(loadError.message || 'Unable to load your tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const visible = useMemo(() => sortTasks(tasks
    .filter((task) => !status || task.status === status)
    .filter((task) => `${task.title} ${task.projectName || ''}`.toLowerCase().includes(query.trim().toLowerCase()))), [tasks, status, query]);

  const selected = useMemo(() => tasks.find((task) => task.id === selectedId) || null, [tasks, selectedId]);
  const stats = useMemo(() => ({
    total: tasks.length,
    active: tasks.filter((task) => task.status === 'IN_PROGRESS').length,
    overdue: tasks.filter(isOverdue).length,
    completed: tasks.filter((task) => task.status === 'COMPLETED').length,
  }), [tasks]);

  // Employees may only move their own task along — status and progress.
  const update = async (task, patch) => {
    const allowed = {};
    if (patch.status !== undefined) allowed.status = patch.status;
    if (patch.progress !== undefined) allowed.progress = patch.progress;
    if (!Object.keys(allowed).length) return;
    const previous = tasks;
    setTasks((current) => current.map((item) => item.id === task.id ? { ...item, ...allowed } : item));
    try {
      await projectService.updateTask(task.projectId, task.id, allowed);
      await load();
      toast.success('Task updated');
    } catch (updateError) {
      setTasks(previous);
      toast.error(updateError.message || 'Unable to update task');
    }
  };

  return <div className="mx-auto max-w-6xl space-y-5">
    <div>
      <h1 className="text-xl font-bold text-gray-900">My tasks</h1>
      <p className="mt-0.5 text-sm text-gray-500">Work assigned to you across {projects.length || 'your'} project{projects.length === 1 ? '' : 's'}.</p>
    </div>

    {usingDemo && <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">Demo mode: the task API is not connected yet, so updates are saved in this browser only.</div>}

    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {[['Assigned', stats.total, 'bg-violet-50 text-violet-600'], ['In progress', stats.active, 'bg-blue-50 text-blue-600'], ['Overdue', stats.overdue, 'bg-rose-50 text-rose-600'], ['Completed', stats.completed, 'bg-emerald-50 text-emerald-600']].map(([label, value, color]) => <div key={label} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className={`mb-3 grid h-9 w-9 place-items-center rounded-xl ${color}`}>{label === 'Overdue' ? <AlertTriangle size={17} /> : <CheckSquare size={17} />}</div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="mt-1 text-xs text-gray-500">{label}</p>
      </div>)}
    </div>

    <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
      <section className="space-y-3 lg:col-span-2">
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2">
          <Search size={16} className="text-gray-400" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks…" className="w-full text-sm outline-none" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {groups.map((group) => <button key={group.label} onClick={() => setStatus(group.key)} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${status === group.key ? 'bg-violet-600 text-white' : 'bg-white text-gray-600 ring-1 ring-gray-200'}`}>{group.label}</button>)}
        </div>
        {error ? <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error} <button onClick={load} className="font-semibold underline">Retry</button></div>
          : loading ? <div className="flex items-center justify-center gap-2 rounded-xl border border-gray-100 bg-white p-10 text-sm text-gray-500"><Loader2 size={16} className="animate-spin" />Loading your tasks…</div>
            : !visible.length ? <div className="rounded-xl border border-gray-100 bg-white p-10 text-center text-sm text-gray-500">No tasks here. Anything assigned to you will show up automatically.</div>
              : visible.map((task) => <button
                key={task.id}
                onClick={() => setSelectedId(task.id)}
                className={`w-full rounded-xl border bg-white p-4 text-left shadow-sm transition hover:shadow-md ${selectedId === task.id ? 'border-violet-400 ring-2 ring-violet-100' : 'border-gray-100'}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-gray-800">{task.title}</p>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${priorityTone(task.priority)}`}>{task.priority || 'MEDIUM'}</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">{task.projectName || 'Project'}</p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-violet-600" style={{ width: `${task.progress ?? 0}%` }} /></div>
                <div className="mt-2.5 flex items-center justify-between">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusTone(task.status)}`}>{statusLabels[task.status] || task.status}</span>
                  <span className={`text-[11px] font-medium ${isOverdue(task) ? 'text-rose-600' : 'text-gray-400'}`}>{dueLabel(task)}</span>
                </div>
              </button>)}
      </section>

      <section className="lg:col-span-3">
        {selected ? <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <TaskDetailPanel task={selected} onUpdate={(patch) => update(selected, patch)} onClose={() => setSelectedId(null)} />
        </div> : <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center text-sm text-gray-500">
          <CheckCircle2 className="mx-auto mb-3 text-violet-300" />
          Select a task to see its details, update progress and talk to your team.
        </div>}
      </section>
    </div>
  </div>;
}
