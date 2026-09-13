import React, { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { AlertTriangle, CheckSquare, LayoutGrid, List, Loader2, Plus, Search } from 'lucide-react';
import { employeeService } from '../../../service';
import { mergeDirectory } from '../../../features/projects/demoDirectory';
import { isDemoMode, projectOptions, projectService } from '../../../features/projects/projectService';
import TaskDetailPanel from '../../../features/projects/TaskDetailPanel';
import { columnAccent, dueLabel, formatDate, initials, isOverdue, priorityTone, readUser, sortTasks, statusLabels, statusTone } from '../../../features/projects/taskUi';

const blankTask = { projectId: '', title: '', description: '', priority: 'MEDIUM', status: 'TODO', startDate: '', dueDate: '', assigneeId: '' };
const normalizePeople = (rows, currentUser) => {
  const people = (Array.isArray(rows) ? rows : []).map((row) => {
    const user = row?.user || row;
    return user?.id ? { id: String(user.id), name: user.name || user.email || `User ${user.id}`, email: user.email || '' } : null;
  }).filter(Boolean);
  if (currentUser?.id && !people.some((person) => person.id === String(currentUser.id))) {
    people.unshift({ id: String(currentUser.id), name: currentUser.name || 'Current user', email: currentUser.email || '' });
  }
  return people;
};

export default function TaskManagement() {
  const currentUser = useMemo(readUser, []);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [people, setPeople] = useState([]);
  const [membersByProject, setMembersByProject] = useState({});
  const [filters, setFilters] = useState({ search: '', projectId: '', status: '', priority: '', assigneeId: '' });
  const [view, setView] = useState('board');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [usingDemo, setUsingDemo] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(blankTask);
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState('');

  const loadPeople = useCallback(async () => {
    let rows = [];
    try {
      if (currentUser?.id) {
        const response = await employeeService.getAllEmployeesByAdminId(currentUser.id, 1, 200);
        rows = response?.data || [];
      }
    } catch {
      rows = [];
    }
    const directory = normalizePeople(rows, currentUser);
    setPeople(directory.length > 1 ? directory : mergeDirectory(directory, currentUser));
  }, [currentUser]);

  const loadProjects = useCallback(async () => {
    const data = await projectService.list();
    const items = data?.items ?? data?.projects ?? data ?? [];
    setProjects(items);
    // Member lists drive the assignee picker, which must stay project-scoped.
    const entries = await Promise.all(items.map(async (project) => {
      try {
        const response = await projectService.members(project.id);
        return [project.id, response?.items ?? response?.members ?? response ?? []];
      } catch {
        return [project.id, []];
      }
    }));
    setMembersByProject(Object.fromEntries(entries));
  }, []);

  const loadTasks = useCallback(async () => {
    const data = await projectService.allTasks(filters);
    setTasks(data?.items ?? data?.tasks ?? data ?? []);
  }, [filters]);

  useEffect(() => { loadPeople(); }, [loadPeople]);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError('');
        await Promise.all([loadProjects(), loadTasks()]);
        if (active) setUsingDemo(isDemoMode());
      } catch (loadError) {
        if (active) setError(loadError.message || 'Unable to load tasks');
      } finally {
        if (active) setLoading(false);
      }
    }, 200);
    return () => { active = false; clearTimeout(timer); };
  }, [loadProjects, loadTasks]);

  const refresh = async () => {
    try {
      await Promise.all([loadProjects(), loadTasks()]);
    } catch (refreshError) {
      toast.error(refreshError.message || 'Unable to refresh tasks');
    }
  };

  const selected = useMemo(() => tasks.find((task) => task.id === selectedId) || null, [tasks, selectedId]);
  const stats = useMemo(() => ({
    total: tasks.length,
    todo: tasks.filter((task) => task.status === 'TODO').length,
    active: tasks.filter((task) => task.status === 'IN_PROGRESS').length,
    overdue: tasks.filter(isOverdue).length,
    completed: tasks.filter((task) => task.status === 'COMPLETED').length,
  }), [tasks]);

  const assignableMembers = useMemo(() => {
    const scoped = membersByProject[form.projectId] || [];
    return scoped.length ? scoped : people.map((person) => ({ userId: person.id, name: person.name }));
  }, [membersByProject, form.projectId, people]);

  const updateTask = async (task, patch) => {
    const previous = tasks;
    setTasks((current) => current.map((item) => item.id === task.id ? { ...item, ...patch } : item));
    try {
      await projectService.updateTask(task.projectId, task.id, patch);
      await loadTasks();
      toast.success('Task updated');
    } catch (updateError) {
      setTasks(previous);
      toast.error(updateError.message || 'Unable to update task');
    }
  };

  const archiveTask = async (task) => {
    if (!window.confirm(`Archive "${task.title}"?`)) return;
    try {
      await projectService.archiveTask(task.projectId, task.id);
      setSelectedId(null);
      await refresh();
      toast.success('Task archived');
    } catch (archiveError) {
      toast.error(archiveError.message || 'Unable to archive task');
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!form.projectId) return toast.error('Select a project for this task');
    if (form.startDate && form.dueDate && form.dueDate < form.startDate) return toast.error('Due date must be after start date');
    try {
      setSaving(true);
      await projectService.createTask(form.projectId, { ...form, assigneeId: form.assigneeId || undefined });
      setForm(blankTask);
      setShowForm(false);
      await refresh();
      toast.success('Task created');
    } catch (createError) {
      toast.error(createError.message || 'Unable to create task');
    } finally {
      setSaving(false);
    }
  };

  const openForm = () => {
    setForm({ ...blankTask, projectId: filters.projectId || projects[0]?.id || '' });
    setShowForm(true);
  };

  const onDrop = (status) => (event) => {
    event.preventDefault();
    setDragOver('');
    const taskId = event.dataTransfer.getData('text/plain');
    const task = tasks.find((item) => item.id === taskId);
    if (task && task.status !== status) updateTask(task, { status });
  };

  const card = (task) => <div
    key={task.id}
    draggable
    onDragStart={(event) => event.dataTransfer.setData('text/plain', task.id)}
    onClick={() => setSelectedId(task.id)}
    role="button"
    tabIndex={0}
    onKeyDown={(event) => event.key === 'Enter' && setSelectedId(task.id)}
    className={`cursor-pointer rounded-xl border bg-white p-3.5 shadow-sm transition hover:shadow-md ${selectedId === task.id ? 'border-violet-400 ring-2 ring-violet-100' : 'border-slate-100'}`}
  >
    <div className="flex items-start justify-between gap-2">
      <p className="text-sm font-semibold leading-5 text-slate-800">{task.title}</p>
      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${priorityTone(task.priority)}`}>{task.priority || 'MEDIUM'}</span>
    </div>
    <p className="mt-1 text-xs text-slate-500">{task.projectName || 'Project'}</p>
    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-violet-600" style={{ width: `${task.progress ?? 0}%` }} /></div>
    <div className="mt-3 flex items-center justify-between gap-2">
      <span className="flex items-center gap-1.5 text-xs text-slate-500">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-700">{initials(task.assignee?.name)}</span>
        {task.assignee?.name || 'Unassigned'}
      </span>
      <span className={`text-[11px] font-medium ${isOverdue(task) ? 'text-rose-600' : 'text-slate-400'}`}>{dueLabel(task)}</span>
    </div>
  </div>;

  return <div className="min-h-[calc(100vh-88px)] rounded-2xl bg-[#f7f7fa] p-4 sm:p-6">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-violet-600"><CheckSquare size={17} />Work management</div>
        <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
        <p className="mt-1 text-sm text-slate-500">Create, assign and track every task across your projects.</p>
      </div>
      <button onClick={openForm} className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-200"><Plus size={17} />New task</button>
    </div>

    {usingDemo && <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">Demo mode: the task API is not connected yet, so changes are saved in this browser only.</div>}

    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
      {[['All tasks', stats.total, 'bg-violet-50 text-violet-600'], ['To do', stats.todo, 'bg-slate-100 text-slate-600'], ['In progress', stats.active, 'bg-blue-50 text-blue-600'], ['Overdue', stats.overdue, 'bg-rose-50 text-rose-600'], ['Completed', stats.completed, 'bg-emerald-50 text-emerald-600']].map(([label, value, color]) => <div key={label} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className={`mb-3 grid h-9 w-9 place-items-center rounded-xl ${color}`}>{label === 'Overdue' ? <AlertTriangle size={17} /> : <CheckSquare size={17} />}</div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="mt-1 text-xs text-slate-500">{label}</p>
      </div>)}
    </div>

    <section className="mt-5 rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 p-4">
        <div className="flex min-w-[200px] flex-1 items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
          <Search size={16} className="text-slate-400" />
          <input value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} placeholder="Search tasks…" className="w-full text-sm outline-none" />
        </div>
        <select aria-label="Project" value={filters.projectId} onChange={(event) => setFilters({ ...filters, projectId: event.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
          <option value="">All projects</option>
          {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
        </select>
        <select aria-label="Assignee" value={filters.assigneeId} onChange={(event) => setFilters({ ...filters, assigneeId: event.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
          <option value="">All assignees</option>
          {people.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}
        </select>
        <select aria-label="Status" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
          <option value="">All statuses</option>
          {projectOptions.statuses.map((item) => <option key={item} value={item}>{statusLabels[item]}</option>)}
        </select>
        <select aria-label="Priority" value={filters.priority} onChange={(event) => setFilters({ ...filters, priority: event.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
          <option value="">All priorities</option>
          {projectOptions.priorities.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <div className="flex items-center gap-1 rounded-xl border border-slate-200 p-1">
          <button aria-label="Board view" onClick={() => setView('board')} className={`rounded-lg p-1.5 ${view === 'board' ? 'bg-violet-600 text-white' : 'text-slate-500'}`}><LayoutGrid size={16} /></button>
          <button aria-label="List view" onClick={() => setView('list')} className={`rounded-lg p-1.5 ${view === 'list' ? 'bg-violet-600 text-white' : 'text-slate-500'}`}><List size={16} /></button>
        </div>
      </div>

      {error ? <div className="p-12 text-center"><p className="text-rose-600">{error}</p><button onClick={refresh} className="mt-3 text-sm font-semibold text-violet-600">Try again</button></div>
        : loading ? <div className="flex items-center justify-center gap-2 p-16 text-sm text-slate-500"><Loader2 size={16} className="animate-spin" />Loading tasks…</div>
          : !tasks.length ? <div className="p-14 text-center text-sm text-slate-500">No tasks match these filters. Create a task to get started.</div>
            : view === 'board' ? <div className="grid gap-4 overflow-x-auto p-4 lg:grid-cols-5">
              {projectOptions.statuses.map((status) => {
                const column = sortTasks(tasks.filter((task) => task.status === status));
                return <div
                  key={status}
                  onDragOver={(event) => { event.preventDefault(); setDragOver(status); }}
                  onDragLeave={() => setDragOver((current) => current === status ? '' : current)}
                  onDrop={onDrop(status)}
                  className={`min-w-[230px] rounded-2xl p-3 transition ${dragOver === status ? 'bg-violet-50 ring-2 ring-violet-200' : 'bg-slate-50'}`}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${columnAccent[status]}`} />
                    <p className="text-sm font-semibold text-slate-700">{statusLabels[status]}</p>
                    <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-500">{column.length}</span>
                  </div>
                  <div className="space-y-2.5">
                    {column.map(card)}
                    {!column.length && <p className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">Drop a task here</p>}
                  </div>
                </div>;
              })}
            </div>
              : <div className="divide-y divide-slate-100">
                {sortTasks(tasks).map((task) => <div key={task.id} className="flex flex-wrap items-center gap-4 p-4 transition hover:bg-slate-50">
                  <button onClick={() => setSelectedId(task.id)} className="min-w-[220px] flex-1 text-left">
                    <p className="font-semibold text-slate-800">{task.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{task.projectName || 'Project'} · {task.assignee?.name || 'Unassigned'}</p>
                  </button>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${priorityTone(task.priority)}`}>{task.priority || 'MEDIUM'}</span>
                  <select value={task.status} onChange={(event) => updateTask(task, { status: event.target.value })} className={`rounded-lg border-0 px-2.5 py-1.5 text-xs font-semibold ${statusTone(task.status)}`}>
                    {projectOptions.statuses.map((item) => <option key={item} value={item}>{statusLabels[item]}</option>)}
                  </select>
                  <div className="w-32">
                    <div className="mb-1 flex justify-between text-[11px] text-slate-500"><span>Progress</span><span>{task.progress ?? 0}%</span></div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-violet-600" style={{ width: `${task.progress ?? 0}%` }} /></div>
                  </div>
                  <span className={`w-32 text-xs font-medium ${isOverdue(task) ? 'text-rose-600' : 'text-slate-500'}`}>{formatDate(task.dueDate)}</span>
                  <button onClick={() => archiveTask(task)} className="text-xs font-semibold text-rose-600">Archive</button>
                </div>)}
              </div>}
    </section>

    {selected && <div className="fixed inset-0 z-[100] flex justify-end bg-slate-900/40" onClick={() => setSelectedId(null)}>
      <div onClick={(event) => event.stopPropagation()} className="h-full w-full max-w-md overflow-hidden bg-white shadow-2xl">
        <TaskDetailPanel
          task={selected}
          members={membersByProject[selected.projectId] || []}
          canManage
          onUpdate={(patch) => updateTask(selected, patch)}
          onArchive={archiveTask}
          onClose={() => setSelectedId(null)}
        />
      </div>
    </div>}

    {showForm && <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-900/40 p-4">
      <form onSubmit={submit} className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-slate-900">Create task</h2>
        <p className="mt-1 text-sm text-slate-500">Tasks belong to a project and can only be assigned to that project&apos;s members.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2 text-sm font-medium text-slate-700">Project
            <select required value={form.projectId} onChange={(event) => setForm({ ...form, projectId: event.target.value, assigneeId: '' })} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm">
              <option value="">Select a project</option>
              {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
            </select>
          </label>
          <label className="sm:col-span-2 text-sm font-medium text-slate-700">Task title<input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm" /></label>
          <label className="sm:col-span-2 text-sm font-medium text-slate-700">Description<textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="mt-1 min-h-20 w-full rounded-xl border border-slate-200 p-2.5 text-sm" /></label>
          <label className="text-sm font-medium text-slate-700">Priority
            <select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm">{projectOptions.priorities.map((item) => <option key={item} value={item}>{item}</option>)}</select>
          </label>
          <label className="text-sm font-medium text-slate-700">Status
            <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm">{projectOptions.statuses.map((item) => <option key={item} value={item}>{statusLabels[item]}</option>)}</select>
          </label>
          <label className="text-sm font-medium text-slate-700">Start date<input type="date" value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm" /></label>
          <label className="text-sm font-medium text-slate-700">Due date<input type="date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm" /></label>
          <label className="sm:col-span-2 text-sm font-medium text-slate-700">Assign to
            <select value={form.assigneeId} onChange={(event) => setForm({ ...form, assigneeId: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm">
              <option value="">Unassigned</option>
              {assignableMembers.map((member) => <option key={member.userId || member.id} value={member.userId || member.id}>{member.name}</option>)}
            </select>
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={() => setShowForm(false)} disabled={saving} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold">Cancel</button>
          <button disabled={saving} className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Creating…' : 'Create task'}</button>
        </div>
      </form>
    </div>}
  </div>;
}
