import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Plus } from 'lucide-react';
import { employeeService } from '../../../service';
import { demoProjects, demoTasks } from '../../../features/projects/demoData';
import { projectOptions, projectService } from '../../../features/projects/projectService';

const names = ['Priya Nair', 'Rohan Verma', 'Meera Joshi', 'Amit Sharma'];
const labels = { TODO: 'To do', IN_PROGRESS: 'In progress', IN_REVIEW: 'In review', COMPLETED: 'Completed', BLOCKED: 'Blocked' };
const tone = (value) => ({ COMPLETED: 'bg-emerald-50 text-emerald-700', IN_PROGRESS: 'bg-blue-50 text-blue-700', IN_REVIEW: 'bg-amber-50 text-amber-700', BLOCKED: 'bg-rose-50 text-rose-700' }[value] || 'bg-slate-100 text-slate-600');
const date = (value) => value ? new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
const readUser = () => { try { return JSON.parse(localStorage.getItem('userData') || '{}'); } catch { return {}; } };
const shouldFallbackToDemo = (error) => !error?.message || /disabled|failed to fetch|load failed|network|request failed/i.test(error.message);
const blankTask = { title: '', description: '', priority: 'MEDIUM', status: 'TODO', startDate: '', dueDate: '', assigneeId: '' };
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
const demoMembers = (project) => names.slice(0, project?.memberCount || 2).map((name, index) => ({ id: `demo-member-${index}`, userId: `demo-member-${index}`, name, email: '', role: index === 0 ? 'OWNER' : 'MEMBER', departmentName: '', designationName: index === 0 ? 'Project manager' : 'Project member' }));
const demoActivity = (project) => [
  { id: 'act-1', message: `${project?.owner?.name || 'Priya Nair'} created the project.`, createdAt: '2026-08-31T09:00:00.000Z', actor: { name: project?.owner?.name || 'Priya Nair' } },
  { id: 'act-2', message: `${project?.owner?.name || 'Priya Nair'} added project members.`, createdAt: '2026-08-31T10:00:00.000Z', actor: { name: project?.owner?.name || 'Priya Nair' } },
  { id: 'act-3', message: 'Rohan Verma updated task progress.', createdAt: '2026-08-31T11:00:00.000Z', actor: { name: 'Rohan Verma' } },
];

export default function ProjectDetails() {
  const { id } = useParams();
  const currentUser = useMemo(readUser, []);
  const isManagerView = currentUser?.isAdmin || currentUser?.roleId === 0 || currentUser?.roleId === 1 || currentUser?.type === 'manager';
  const [tab, setTab] = useState('Tasks');
  const [project, setProject] = useState(null);
  const [projectForm, setProjectForm] = useState({ name: '', description: '', status: 'TODO', priority: 'MEDIUM', ownerId: '', startDate: '', dueDate: '' });
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [activity, setActivity] = useState([]);
  const [people, setPeople] = useState([]);
  const [memberUserId, setMemberUserId] = useState('');
  const [showTask, setShowTask] = useState(false);
  const [taskForm, setTaskForm] = useState(blankTask);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [usingDemo, setUsingDemo] = useState(false);
  const [savingProject, setSavingProject] = useState(false);
  const [savingTask, setSavingTask] = useState(false);
  const [busyTaskId, setBusyTaskId] = useState(null);
  const [memberBusy, setMemberBusy] = useState(false);
  const completed = useMemo(() => tasks.filter((task) => task.status === 'COMPLETED').length, [tasks]);

  const loadPeople = async () => {
    if (!currentUser?.id) return;
    const response = await employeeService.getAllEmployeesByAdminId(currentUser.id, 1, 200);
    setPeople(normalizePeople(response?.data, currentUser));
  };

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const [projectResponse, taskResponse, memberResponse, activityResponse] = await Promise.all([
        projectService.get(id),
        projectService.tasks(id),
        projectService.members(id),
        projectService.activity(id),
      ]);
      const nextProject = projectResponse?.project || projectResponse;
      const nextTasks = taskResponse?.items ?? taskResponse?.tasks ?? taskResponse ?? [];
      const nextMembers = memberResponse?.items ?? memberResponse?.members ?? memberResponse ?? [];
      const nextActivity = activityResponse?.items ?? activityResponse?.activity ?? activityResponse ?? [];
      setProject(nextProject);
      setProjectForm({
        name: nextProject?.name || '',
        description: nextProject?.description || '',
        status: nextProject?.status || 'TODO',
        priority: nextProject?.priority || 'MEDIUM',
        ownerId: nextProject?.owner?.id ? String(nextProject.owner.id) : '',
        startDate: nextProject?.startDate || '',
        dueDate: nextProject?.dueDate || '',
      });
      setTasks(nextTasks);
      setMembers(nextMembers);
      setActivity(nextActivity);
      setUsingDemo(false);
    } catch (loadError) {
      const demoProject = demoProjects.find((item) => String(item.id) === String(id)) || demoProjects[0];
      if (demoProject && shouldFallbackToDemo(loadError)) {
        setProject(demoProject);
        setProjectForm({
          name: demoProject.name,
          description: demoProject.description || '',
          status: demoProject.status || 'TODO',
          priority: demoProject.priority || 'MEDIUM',
          ownerId: demoProject.owner?.id ? String(demoProject.owner.id) : '',
          startDate: demoProject.startDate || '',
          dueDate: demoProject.dueDate || '',
        });
        setTasks(demoTasks.filter((item) => item.projectId === demoProject.id));
        setMembers(demoMembers(demoProject));
        setActivity(demoActivity(demoProject));
        setUsingDemo(true);
      } else {
        setError(loadError.message || 'Unable to load project details');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPeople(); }, []);
  useEffect(() => { load(); }, [id]);

  const saveProject = async (event) => {
    event.preventDefault();
    if (projectForm.dueDate && projectForm.startDate && projectForm.dueDate < projectForm.startDate) return toast.error('Due date must be after start date');
    try {
      setSavingProject(true);
      const payload = { ...projectForm, ownerId: projectForm.ownerId ? Number(projectForm.ownerId) : undefined };
      if (usingDemo) {
        const owner = people.find((person) => person.id === projectForm.ownerId) || project?.owner || null;
        setProject((current) => ({ ...current, ...projectForm, owner }));
        toast.success('Project updated in demo mode');
      } else {
        const response = await projectService.update(id, payload);
        setProject(response?.project || response);
        toast.success('Project updated');
        await load();
      }
    } catch (saveError) {
      toast.error(saveError.message || 'Unable to update project');
    } finally {
      setSavingProject(false);
    }
  };

  const createTask = async (event) => {
    event.preventDefault();
    if (taskForm.dueDate && taskForm.startDate && taskForm.dueDate < taskForm.startDate) return toast.error('Due date must be after start date');
    try {
      setSavingTask(true);
      if (usingDemo) {
        const assignee = people.find((person) => person.id === taskForm.assigneeId) || null;
        setTasks((current) => [...current, { ...taskForm, id: `demo-task-${Date.now()}`, projectId: project.id, projectName: project.name, progress: 0, assigneeId: assignee?.id, assignee }]);
        toast.success('Task created in demo mode');
      } else {
        await projectService.createTask(id, { ...taskForm, assigneeId: taskForm.assigneeId ? Number(taskForm.assigneeId) : undefined });
        toast.success('Task created');
        await load();
      }
      setTaskForm(blankTask);
      setShowTask(false);
    } catch (taskError) {
      toast.error(taskError.message || 'Unable to create task');
    } finally {
      setSavingTask(false);
    }
  };

  const updateTask = async (taskId, patch) => {
    try {
      setBusyTaskId(taskId);
      if (usingDemo) {
        setTasks((current) => current.map((task) => task.id === taskId ? { ...task, ...patch, assignee: patch.assigneeId ? people.find((person) => person.id === String(patch.assigneeId)) || task.assignee : task.assignee } : task));
        toast.success('Task updated in demo mode');
      } else {
        await projectService.updateTask(id, taskId, patch);
        await load();
        toast.success('Task updated');
      }
    } catch (taskError) {
      toast.error(taskError.message || 'Unable to update task');
      await load();
    } finally {
      setBusyTaskId(null);
    }
  };

  const archiveTask = async (taskId) => {
    if (!window.confirm('Archive this task?')) return;
    try {
      setBusyTaskId(taskId);
      if (usingDemo) {
        setTasks((current) => current.filter((task) => task.id !== taskId));
        toast.success('Task archived in demo mode');
      } else {
        await projectService.archiveTask(id, taskId);
        await load();
        toast.success('Task archived');
      }
    } catch (taskError) {
      toast.error(taskError.message || 'Unable to archive task');
    } finally {
      setBusyTaskId(null);
    }
  };

  const addMember = async () => {
    if (!memberUserId) return;
    try {
      setMemberBusy(true);
      if (usingDemo) {
        const person = people.find((item) => item.id === memberUserId);
        if (person && !members.some((item) => String(item.userId || item.id) === person.id)) {
          setMembers((current) => [...current, { id: person.id, userId: person.id, name: person.name, email: person.email, role: 'MEMBER' }]);
          toast.success('Member added in demo mode');
        }
      } else {
        await projectService.addMember(id, Number(memberUserId));
        await load();
        toast.success('Member added');
      }
      setMemberUserId('');
    } catch (memberError) {
      toast.error(memberError.message || 'Unable to add member');
    } finally {
      setMemberBusy(false);
    }
  };

  const removeMember = async (userId) => {
    if (!window.confirm('Remove this member from the project?')) return;
    try {
      setMemberBusy(true);
      if (usingDemo) {
        setMembers((current) => current.filter((member) => String(member.userId || member.id) !== String(userId)));
        setTasks((current) => current.map((task) => String(task.assigneeId) === String(userId) ? { ...task, assigneeId: null, assignee: null } : task));
        toast.success('Member removed in demo mode');
      } else {
        await projectService.removeMember(id, userId);
        await load();
        toast.success('Member removed');
      }
    } catch (memberError) {
      toast.error(memberError.message || 'Unable to remove member');
    } finally {
      setMemberBusy(false);
    }
  };

  if (loading) {
    return <div className="min-h-[calc(100vh-88px)] rounded-2xl bg-[#f7f7fa] p-4 sm:p-6"><div className="space-y-4">{[1, 2, 3].map((item) => <div key={item} className="h-28 animate-pulse rounded-2xl bg-white" />)}</div></div>;
  }

  if (error || !project) {
    return <div className="min-h-[calc(100vh-88px)] rounded-2xl bg-[#f7f7fa] p-4 sm:p-6"><Link to="/hrms/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600"><ArrowLeft size={16} />Back to projects</Link><div className="mt-6 rounded-2xl bg-white p-8 text-center shadow-sm"><p className="text-rose-600">{error || 'Project not found'}</p><button onClick={load} className="mt-4 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white">Retry</button></div></div>;
  }

  return <div className="min-h-[calc(100vh-88px)] rounded-2xl bg-[#f7f7fa] p-4 sm:p-6">
    <Link to="/hrms/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600"><ArrowLeft size={16} />Back to projects</Link>
    {usingDemo && <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">This project is showing demo data because the live API is unavailable.</div>}
    <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tone(project.status)}`}>{labels[project.status] || project.status}</span>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{project.description || 'No project description provided.'}</p>
        </div>
        {isManagerView && <button onClick={() => setShowTask(true)} className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white"><Plus size={16} />Add task</button>}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Progress</p><p className="mt-1 text-lg font-bold">{project.progress ?? 0}%</p></div>
        <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Priority</p><p className="mt-1 text-lg font-bold">{project.priority}</p></div>
        <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Due date</p><p className="mt-1 text-sm font-bold">{date(project.dueDate)}</p></div>
        <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Task progress</p><p className="mt-1 text-lg font-bold">{completed}/{tasks.length}</p></div>
        <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Members</p><p className="mt-1 text-lg font-bold">{members.length}</p></div>
      </div>
    </div>
    <div className="mt-5 flex gap-1 border-b border-slate-200">{['Overview', 'Tasks', 'Members', 'Activity'].map((item) => <button key={item} onClick={() => setTab(item)} className={`border-b-2 px-4 py-3 text-sm font-semibold ${tab === item ? 'border-violet-600 text-violet-600' : 'border-transparent text-slate-500'}`}>{item}</button>)}</div>
    <section className="mt-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      {tab === 'Overview' && <form onSubmit={saveProject} className="space-y-5">
        <div>
          <h2 className="font-bold">Project overview</h2>
          <p className="mt-2 text-sm text-slate-600">Owner: {project.owner?.name || '—'} · Started {date(project.startDate)} · Due {date(project.dueDate)}</p>
        </div>
        <div>
          <div className="mb-2 flex justify-between text-sm"><span>Overall progress</span><strong>{project.progress ?? 0}%</strong></div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-violet-600" style={{ width: `${project.progress ?? 0}%` }} /></div>
        </div>
        {isManagerView && <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2 text-sm font-medium">Project name<input required value={projectForm.name} onChange={(event) => setProjectForm({ ...projectForm, name: event.target.value })} className="mt-1 w-full rounded-xl border p-2.5" /></label>
          <label className="sm:col-span-2 text-sm font-medium">Description<textarea value={projectForm.description} onChange={(event) => setProjectForm({ ...projectForm, description: event.target.value })} className="mt-1 min-h-24 w-full rounded-xl border p-2.5" /></label>
          <label className="text-sm font-medium">Status<select value={projectForm.status} onChange={(event) => setProjectForm({ ...projectForm, status: event.target.value })} className="mt-1 w-full rounded-xl border p-2.5">{projectOptions.statuses.map((item) => <option key={item} value={item}>{labels[item]}</option>)}</select></label>
          <label className="text-sm font-medium">Priority<select value={projectForm.priority} onChange={(event) => setProjectForm({ ...projectForm, priority: event.target.value })} className="mt-1 w-full rounded-xl border p-2.5">{projectOptions.priorities.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label className="text-sm font-medium">Owner<select value={projectForm.ownerId} onChange={(event) => setProjectForm({ ...projectForm, ownerId: event.target.value })} className="mt-1 w-full rounded-xl border p-2.5"><option value="">Select owner</option>{people.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}</select></label>
          <label className="text-sm font-medium">Start date<input type="date" value={projectForm.startDate} onChange={(event) => setProjectForm({ ...projectForm, startDate: event.target.value })} className="mt-1 w-full rounded-xl border p-2.5" /></label>
          <label className="text-sm font-medium">Due date<input type="date" value={projectForm.dueDate} onChange={(event) => setProjectForm({ ...projectForm, dueDate: event.target.value })} className="mt-1 w-full rounded-xl border p-2.5" /></label>
        </div>}
        {isManagerView && <div className="flex justify-end"><button disabled={savingProject} className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white">{savingProject ? 'Saving…' : 'Save changes'}</button></div>}
      </form>}
      {tab === 'Tasks' && <div className="space-y-3">{!tasks.length ? <p className="py-10 text-center text-sm text-slate-500">No tasks yet.</p> : tasks.map((task) => <div key={task.id} className="rounded-xl border border-slate-100 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-semibold">{task.title}</p><p className="mt-1 text-sm text-slate-500">{task.description || 'No description'} · Due {date(task.dueDate)}</p><p className="mt-1 text-xs text-slate-500">Assigned to {task.assignee?.name || 'Unassigned'}</p></div><div className="flex flex-wrap gap-2">{<select disabled={busyTaskId === task.id} value={task.status} onChange={(event) => updateTask(task.id, { status: event.target.value })} className="rounded-lg border px-2 py-1 text-sm">{projectOptions.statuses.map((item) => <option key={item} value={item}>{labels[item]}</option>)}</select>}{isManagerView && <select disabled={busyTaskId === task.id} value={task.assigneeId ? String(task.assigneeId) : ''} onChange={(event) => updateTask(task.id, { assigneeId: event.target.value ? Number(event.target.value) : null })} className="rounded-lg border px-2 py-1 text-sm"><option value="">Unassigned</option>{members.map((member) => <option key={member.userId || member.id} value={member.userId || member.id}>{member.name}</option>)}</select>}{isManagerView && <button onClick={() => archiveTask(task.id)} disabled={busyTaskId === task.id} className="rounded-lg border border-rose-200 px-3 py-1 text-sm font-semibold text-rose-600">Archive</button>}</div></div><div className="mt-3 flex flex-wrap items-center gap-3"><input type="range" min="0" max="100" value={task.progress ?? 0} onChange={(event) => setTasks((current) => current.map((item) => item.id === task.id ? { ...item, progress: Number(event.target.value) } : item))} onMouseUp={(event) => updateTask(task.id, { progress: Number(event.currentTarget.value) })} disabled={busyTaskId === task.id} className="w-44 accent-violet-600" /><span className="text-xs font-semibold text-violet-600">{task.progress ?? 0}%</span><span className={`rounded-full px-2 py-1 text-xs font-semibold ${tone(task.status)}`}>{labels[task.status] || task.status}</span><span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{task.priority || 'MEDIUM'}</span></div></div>)}</div>}
      {tab === 'Members' && <div className="space-y-4">{isManagerView && <div className="flex flex-wrap gap-2"><select value={memberUserId} onChange={(event) => setMemberUserId(event.target.value)} className="min-w-[240px] rounded-xl border px-3 py-2 text-sm"><option value="">Add member</option>{people.filter((person) => !members.some((member) => String(member.userId || member.id) === person.id)).map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}</select><button onClick={addMember} disabled={memberBusy || !memberUserId} className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white">Add member</button></div>}<div className="grid gap-3 sm:grid-cols-2">{members.map((member) => <div key={member.userId || member.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-4"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-full bg-violet-100 text-sm font-bold text-violet-700">{member.name?.[0] || 'U'}</div><div><p className="font-semibold">{member.name}</p><p className="text-xs text-slate-500">{member.role === 'OWNER' ? 'Project owner' : member.designationName || member.departmentName || 'Project member'}</p></div></div>{isManagerView && String(project.owner?.id) !== String(member.userId || member.id) && <button onClick={() => removeMember(member.userId || member.id)} disabled={memberBusy} className="text-xs font-semibold text-rose-600">Remove</button>}</div>)}</div></div>}
      {tab === 'Activity' && <div className="space-y-4 text-sm text-slate-600">{!activity.length ? <p className="py-10 text-center text-sm text-slate-500">No activity yet.</p> : activity.map((item) => <div key={item.id} className="rounded-xl border border-slate-100 p-4"><p className="font-medium text-slate-800">{item.message}</p><p className="mt-1 text-xs text-slate-400">{item.actor?.name ? `${item.actor.name} · ` : ''}{date(item.createdAt)}</p></div>)}</div>}
    </section>
    {showTask && <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-900/40 p-4">
      <form onSubmit={createTask} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold">Add task</h2>
        <label className="mt-4 block text-sm font-medium">Task title<input required value={taskForm.title} onChange={(event) => setTaskForm({ ...taskForm, title: event.target.value })} className="mt-1 w-full rounded-xl border p-2.5" /></label>
        <label className="mt-3 block text-sm font-medium">Description<textarea value={taskForm.description} onChange={(event) => setTaskForm({ ...taskForm, description: event.target.value })} className="mt-1 min-h-20 w-full rounded-xl border p-2.5" /></label>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <label className="text-sm font-medium">Priority<select value={taskForm.priority} onChange={(event) => setTaskForm({ ...taskForm, priority: event.target.value })} className="mt-1 w-full rounded-xl border p-2.5">{projectOptions.priorities.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label className="text-sm font-medium">Status<select value={taskForm.status} onChange={(event) => setTaskForm({ ...taskForm, status: event.target.value })} className="mt-1 w-full rounded-xl border p-2.5">{projectOptions.statuses.map((item) => <option key={item} value={item}>{labels[item]}</option>)}</select></label>
          <label className="text-sm font-medium">Start date<input type="date" value={taskForm.startDate} onChange={(event) => setTaskForm({ ...taskForm, startDate: event.target.value })} className="mt-1 w-full rounded-xl border p-2.5" /></label>
          <label className="text-sm font-medium">Due date<input type="date" value={taskForm.dueDate} onChange={(event) => setTaskForm({ ...taskForm, dueDate: event.target.value })} className="mt-1 w-full rounded-xl border p-2.5" /></label>
          <label className="col-span-2 text-sm font-medium">Assign to<select value={taskForm.assigneeId} onChange={(event) => setTaskForm({ ...taskForm, assigneeId: event.target.value })} className="mt-1 w-full rounded-xl border p-2.5"><option value="">Unassigned</option>{members.map((member) => <option key={member.userId || member.id} value={member.userId || member.id}>{member.name}</option>)}</select></label>
        </div>
        <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setShowTask(false)} className="rounded-xl border px-4 py-2.5 text-sm font-semibold">Cancel</button><button disabled={savingTask} className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white">{savingTask ? 'Creating…' : 'Create task'}</button></div>
      </form>
    </div>}
  </div>;
}
