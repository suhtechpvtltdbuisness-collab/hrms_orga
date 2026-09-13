import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { BriefcaseBusiness, Calendar, Plus, Search, Users } from 'lucide-react';
import { employeeService } from '../../../service';
import { isDemoMode, projectOptions, projectService } from '../../../features/projects/projectService';
import { mergeDirectory } from '../../../features/projects/demoDirectory';

const tone = (value) => ({ COMPLETED: 'bg-emerald-50 text-emerald-700', IN_PROGRESS: 'bg-blue-50 text-blue-700', IN_REVIEW: 'bg-amber-50 text-amber-700', BLOCKED: 'bg-rose-50 text-rose-700' }[value] || 'bg-slate-100 text-slate-600');
const date = (value) => value ? new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value)) : '—';
const readUser = () => { try { return JSON.parse(localStorage.getItem('userData') || '{}'); } catch { return {}; } };
const buildBlank = (currentUser) => ({ name: '', description: '', status: 'TODO', priority: 'MEDIUM', startDate: '', dueDate: '', ownerId: currentUser?.id ? String(currentUser.id) : '', memberIds: currentUser?.id ? [String(currentUser.id)] : [] });
const normalizePeople = (rows, currentUser) => {
  const fromRows = (Array.isArray(rows) ? rows : []).map((row) => {
    const user = row?.user || row;
    return user?.id ? { id: String(user.id), name: user.name || user.email || `User ${user.id}`, email: user.email || '', type: user.type || row?.employee?.role || '' } : null;
  }).filter(Boolean);
  if (currentUser?.id && !fromRows.some((item) => item.id === String(currentUser.id))) {
    fromRows.unshift({ id: String(currentUser.id), name: currentUser.name || 'Current user', email: currentUser.email || '', type: currentUser.type || '' });
  }
  return fromRows;
};

export default function Projects() {
  const navigate = useNavigate();
  const currentUser = useMemo(readUser, []);
  const [items, setItems] = useState([]);
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [usingDemo, setUsingDemo] = useState(false);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(buildBlank(currentUser));
  const [saving, setSaving] = useState(false);

  // Fall back to the demo directory so the owner/member pickers are never empty.
  const loadPeople = async () => {
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
    const normalized = directory.length > 1 ? directory : mergeDirectory(directory, currentUser);
    setPeople(normalized);
    setForm((current) => ({
      ...current,
      ownerId: current.ownerId || String(currentUser.id),
      memberIds: current.memberIds.length ? current.memberIds : [String(currentUser.id)],
    }));
  };

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await projectService.list({ search: query, status, priority });
      setItems(data.items ?? data.projects ?? data ?? []);
      setUsingDemo(isDemoMode());
    } catch (loadError) {
      setError(loadError.message || 'Unable to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPeople(); }, []);
  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [query, status, priority]);

  const counts = useMemo(() => ({
    total: items.length,
    active: items.filter((item) => item.status === 'IN_PROGRESS').length,
    completed: items.filter((item) => item.status === 'COMPLETED').length,
  }), [items]);

  const toggleMember = (userId) => {
    setForm((current) => {
      const exists = current.memberIds.includes(userId);
      const nextMembers = exists ? current.memberIds.filter((id) => id !== userId) : [...current.memberIds, userId];
      return {
        ...current,
        memberIds: nextMembers.includes(current.ownerId) ? nextMembers : [...nextMembers, current.ownerId].filter(Boolean),
      };
    });
  };

  const submit = async (event) => {
    event.preventDefault();
    if (form.dueDate && form.startDate && form.dueDate < form.startDate) return toast.error('Due date must be after start date');
    if (!form.ownerId) return toast.error('Select a project owner');
    try {
      setSaving(true);
      await projectService.create({
        ...form,
        memberIds: Array.from(new Set([...form.memberIds, form.ownerId].filter(Boolean))),
      });
      toast.success('Project created');
      setForm(buildBlank(currentUser));
      setShowForm(false);
      await load();
    } catch (createError) {
      toast.error(createError.message || 'Unable to create project');
    } finally {
      setSaving(false);
    }
  };

  const archive = async (event, id) => {
    event.preventDefault();
    event.stopPropagation();
    if (!window.confirm('Archive this project? Its tasks will no longer appear in active views.')) return;
    try {
      await projectService.archive(id);
      toast.success('Project archived');
      await load();
    } catch (archiveError) {
      toast.error(archiveError.message || 'Unable to archive project');
    }
  };

  return <div className="min-h-[calc(100vh-88px)] rounded-2xl bg-[#f7f7fa] p-4 sm:p-6">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-violet-600"><BriefcaseBusiness size={17} /> Work management</div>
        <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
        <p className="mt-1 text-sm text-slate-500">Plan work, assign your team, and track delivery.</p>
      </div>
      <button onClick={() => setShowForm(true)} className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-200"><Plus size={17} /> Create project</button>
    </div>
    {usingDemo && <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">Demo mode: the project API is not connected yet, so projects are saved in this browser only.</div>}
    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">{[['All projects', counts.total, 'bg-violet-50 text-violet-600'], ['In progress', counts.active, 'bg-blue-50 text-blue-600'], ['Completed', counts.completed, 'bg-emerald-50 text-emerald-600']].map(([label, value, color]) => <div key={label} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"><div className={`mb-3 grid h-9 w-9 place-items-center rounded-xl ${color}`}><BriefcaseBusiness size={17} /></div><p className="text-2xl font-bold text-slate-900">{value}</p><p className="mt-1 text-xs text-slate-500">{label}</p></div>)}</div>
    <section className="mt-5 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="flex flex-wrap gap-2 border-b p-4">
        <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-xl border px-3 py-2"><Search size={16} className="text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects…" className="w-full text-sm outline-none" /></div>
        {[['Status', status, setStatus, projectOptions.statuses], ['Priority', priority, setPriority, projectOptions.priorities]].map(([label, value, setter, options]) => <select aria-label={label} key={label} value={value} onChange={(event) => setter(event.target.value)} className="rounded-xl border px-3 py-2 text-sm"><option value="">All {label.toLowerCase()}es</option>{options.map((item) => <option key={item} value={item}>{item.replaceAll('_', ' ')}</option>)}</select>)}
      </div>
      {error ? <div className="p-12 text-center"><p className="text-rose-600">{error}</p><button onClick={load} className="mt-3 text-sm font-semibold text-violet-600">Try again</button></div> : loading ? <div className="space-y-3 p-5">{[1, 2, 3].map((item) => <div key={item} className="h-24 animate-pulse rounded-xl bg-slate-100" />)}</div> : !items.length ? <div className="p-14 text-center text-sm text-slate-500">No projects found. Create the first project to get started.</div> : <div className="divide-y">{items.map((project) => <div role="button" tabIndex={0} onClick={() => navigate(`/hrms/projects/${project.id}`)} onKeyDown={(event) => event.key === 'Enter' && navigate(`/hrms/projects/${project.id}`)} key={project.id} className="flex cursor-pointer flex-wrap items-center gap-4 p-4 transition hover:bg-slate-50"><div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-violet-600"><BriefcaseBusiness size={19} /></div><div className="min-w-[220px] flex-1"><p className="font-semibold text-slate-900">{project.name}</p><p className="mt-1 line-clamp-1 text-sm text-slate-500">{project.description || 'No description'}</p><div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500"><span className="inline-flex items-center gap-1"><Users size={13} /> {project.memberCount || 0} members</span><span>Owner: {project.owner?.name || '—'}</span></div></div><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tone(project.status)}`}>{(project.status || 'TODO').replaceAll('_', ' ')}</span><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{project.priority || 'MEDIUM'}</span><div className="w-36"><div className="mb-1 flex justify-between text-xs text-slate-500"><span>Progress</span><span>{project.progress ?? 0}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-violet-600" style={{ width: `${project.progress ?? 0}%` }} /></div></div><div className="text-xs text-slate-500"><Calendar size={14} className="mr-1 inline" />{date(project.dueDate)}</div><button onClick={(event) => archive(event, project.id)} className="text-xs font-semibold text-rose-600">Archive</button></div>)}</div>}
    </section>
    {showForm && <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-900/40 p-4">
      <form onSubmit={submit} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold">Create project</h2>
        <p className="mt-1 text-sm text-slate-500">Projects are visible only to selected members and can be managed by admins and managers.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2 text-sm font-medium">Project name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-1 w-full rounded-xl border p-2.5" /></label>
          <label className="sm:col-span-2 text-sm font-medium">Description<textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="mt-1 min-h-24 w-full rounded-xl border p-2.5" /></label>
          <label className="text-sm font-medium">Owner<select value={form.ownerId} onChange={(event) => setForm((current) => ({ ...current, ownerId: event.target.value, memberIds: Array.from(new Set([...current.memberIds, event.target.value])) }))} className="mt-1 w-full rounded-xl border p-2.5"><option value="">Select owner</option>{people.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}</select></label>
          <label className="text-sm font-medium">Priority<select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })} className="mt-1 w-full rounded-xl border p-2.5">{projectOptions.priorities.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label className="text-sm font-medium">Status<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className="mt-1 w-full rounded-xl border p-2.5">{projectOptions.statuses.map((item) => <option key={item} value={item}>{item.replaceAll('_', ' ')}</option>)}</select></label>
          <label className="text-sm font-medium">Start date<input type="date" value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} className="mt-1 w-full rounded-xl border p-2.5" /></label>
          <label className="text-sm font-medium">Due date<input type="date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} className="mt-1 w-full rounded-xl border p-2.5" /></label>
          <div className="sm:col-span-2">
            <p className="text-sm font-medium text-slate-700">Members</p>
            <div className="mt-2 grid gap-2 rounded-2xl border border-slate-200 p-3 sm:grid-cols-2">
              {people.length ? people.map((person) => <label key={person.id} className="flex items-start gap-3 rounded-xl border border-slate-100 px-3 py-2 text-sm"><input type="checkbox" checked={form.memberIds.includes(person.id)} onChange={() => toggleMember(person.id)} disabled={person.id === form.ownerId} className="mt-1 accent-violet-600" /><span><span className="block font-semibold text-slate-800">{person.name}</span><span className="block text-xs text-slate-500">{person.email || person.type || 'Organization member'}</span></span></label>) : <p className="text-sm text-slate-500">Employee options are loading. The project owner will still be added automatically.</p>}
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={() => setShowForm(false)} disabled={saving} className="rounded-xl border px-4 py-2.5 text-sm font-semibold">Cancel</button>
          <button disabled={saving} className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white">{saving ? 'Creating…' : 'Create project'}</button>
        </div>
      </form>
    </div>}
  </div>;
}
