// Persistent, browser-local implementation of the project management API.
// It backs the UI end to end (projects, members, tasks, activity) until the
// real /api/projects service is deployed and VITE_PROJECTS_API_ENABLED=true.
import { demoDirectory } from './demoDirectory';

const KEY = 'orga.projects.demo.v1';
const now = () => new Date().toISOString();
const uid = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
const person = (id) => demoDirectory.find((item) => item.id === String(id));
const readUser = () => { try { return JSON.parse(localStorage.getItem('userData') || '{}'); } catch { return {}; } };

const seed = () => {
  const projects = [
    { id: 'demo-website', name: 'Website refresh', description: 'Redesign the public marketing website and careers experience.', status: 'IN_PROGRESS', priority: 'HIGH', startDate: '2026-08-01', dueDate: '2026-09-30', ownerId: 'demo-user-1', archived: false, createdAt: now() },
    { id: 'demo-policy', name: 'HR policy review', description: 'Review and publish annual leave and remote work policy.', status: 'TODO', priority: 'MEDIUM', startDate: '2026-09-01', dueDate: '2026-09-20', ownerId: 'demo-user-4', archived: false, createdAt: now() },
    { id: 'demo-onboarding', name: 'Onboarding improvement', description: 'Improve the first-week experience for new employees.', status: 'COMPLETED', priority: 'LOW', startDate: '2026-07-01', dueDate: '2026-08-15', ownerId: 'demo-user-4', archived: false, createdAt: now() },
  ];
  const members = [
    { id: uid('mem'), projectId: 'demo-website', userId: 'demo-user-1', role: 'OWNER' },
    { id: uid('mem'), projectId: 'demo-website', userId: 'demo-user-2', role: 'MEMBER' },
    { id: uid('mem'), projectId: 'demo-website', userId: 'demo-user-3', role: 'MEMBER' },
    { id: uid('mem'), projectId: 'demo-policy', userId: 'demo-user-4', role: 'OWNER' },
    { id: uid('mem'), projectId: 'demo-policy', userId: 'demo-user-5', role: 'MEMBER' },
    { id: uid('mem'), projectId: 'demo-onboarding', userId: 'demo-user-4', role: 'OWNER' },
    { id: uid('mem'), projectId: 'demo-onboarding', userId: 'demo-user-6', role: 'MEMBER' },
  ];
  const tasks = [
    { id: 'demo-task-design', projectId: 'demo-website', title: 'Finalize the design system', description: 'Document approved type, colours, buttons and card patterns.', status: 'IN_PROGRESS', priority: 'HIGH', progress: 60, startDate: '2026-08-05', dueDate: '2026-09-05', assigneeId: 'demo-user-3', archived: false },
    { id: 'demo-task-copy', projectId: 'demo-website', title: 'Write careers page copy', description: 'Prepare approved content for the careers landing page.', status: 'TODO', priority: 'MEDIUM', progress: 0, startDate: '2026-08-20', dueDate: '2026-09-12', assigneeId: 'demo-user-2', archived: false },
    { id: 'demo-task-policy', projectId: 'demo-policy', title: 'Collect policy feedback', description: 'Consolidate feedback from managers and employees.', status: 'IN_REVIEW', priority: 'MEDIUM', progress: 80, startDate: '2026-09-02', dueDate: '2026-09-10', assigneeId: 'demo-user-5', archived: false },
    { id: 'demo-task-kit', projectId: 'demo-onboarding', title: 'Ship the welcome kit', description: 'Hand over the new joiner welcome kit to HR ops.', status: 'COMPLETED', priority: 'LOW', progress: 100, startDate: '2026-07-05', dueDate: '2026-08-10', assigneeId: 'demo-user-6', archived: false },
  ];
  const activity = [
    { id: uid('act'), projectId: 'demo-website', message: 'Priya Nair created the project.', actorName: 'Priya Nair', createdAt: '2026-08-01T09:00:00.000Z' },
    { id: uid('act'), projectId: 'demo-website', message: 'Priya Nair added project members.', actorName: 'Priya Nair', createdAt: '2026-08-01T10:00:00.000Z' },
    { id: uid('act'), projectId: 'demo-policy', message: 'Amit Sharma created the project.', actorName: 'Amit Sharma', createdAt: '2026-09-01T09:00:00.000Z' },
    { id: uid('act'), projectId: 'demo-onboarding', message: 'Amit Sharma created the project.', actorName: 'Amit Sharma', createdAt: '2026-07-01T09:00:00.000Z' },
  ];
  const comments = [
    { id: uid('cmt'), taskId: 'demo-task-design', authorName: 'Priya Nair', message: 'Please align the button styles with the new brand palette.', createdAt: '2026-08-22T06:30:00.000Z' },
    { id: uid('cmt'), taskId: 'demo-task-design', authorName: 'Meera Joshi', message: 'Updated the tokens, review pending.', createdAt: '2026-08-24T11:10:00.000Z' },
  ];
  return { projects, members, tasks, activity, comments };
};

const read = () => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.projects) {
        parsed.comments = parsed.comments || [];
        return parsed;
      }
    }
  } catch { /* fall through to a fresh seed */ }
  const fresh = seed();
  write(fresh);
  return fresh;
};

function write(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage unavailable: keep working in memory */ }
  return state;
}

const mutate = (updater) => {
  const state = read();
  const result = updater(state);
  write(state);
  return result;
};

const log = (state, projectId, message) => {
  const user = readUser();
  state.activity.unshift({ id: uid('act'), projectId, message, actorName: user?.name || 'You', createdAt: now() });
};

const userOf = (userId) => {
  const match = person(userId);
  if (match) return { id: match.id, name: match.name, email: match.email };
  const user = readUser();
  if (user?.id && String(user.id) === String(userId)) return { id: String(user.id), name: user.name || 'You', email: user.email || '' };
  return userId ? { id: String(userId), name: `User ${userId}`, email: '' } : null;
};

const projectTasks = (state, projectId) => state.tasks.filter((task) => task.projectId === projectId && !task.archived);

const decorateProject = (state, project) => {
  const tasks = projectTasks(state, project.id);
  const members = state.members.filter((member) => member.projectId === project.id);
  const progress = tasks.length ? Math.round(tasks.reduce((sum, task) => sum + (Number(task.progress) || 0), 0) / tasks.length) : (Number(project.progress) || 0);
  return { ...project, progress, owner: userOf(project.ownerId), memberCount: members.length, taskCount: tasks.length };
};

const decorateTask = (state, task) => ({
  ...task,
  assignee: task.assigneeId ? userOf(task.assigneeId) : null,
  projectId: task.projectId,
  projectName: state.projects.find((project) => project.id === task.projectId)?.name || '',
});

const decorateMember = (state, member) => {
  const user = userOf(member.userId);
  return { id: member.id, userId: String(member.userId), name: user?.name || 'Member', email: user?.email || '', role: member.role, designationName: member.role === 'OWNER' ? 'Project owner' : 'Project member' };
};

const matches = (project, { search = '', status = '', priority = '' }) => {
  const q = String(search || '').toLowerCase();
  return (!q || `${project.name} ${project.description || ''}`.toLowerCase().includes(q))
    && (!status || project.status === status)
    && (!priority || project.priority === priority);
};

export const demoStore = {
  isDemo: true,
  reset: () => write(seed()),

  list(params = {}) {
    const state = read();
    const items = state.projects.filter((project) => !project.archived && matches(project, params)).map((project) => decorateProject(state, project));
    return { items, pagination: { page: 1, limit: items.length, total: items.length } };
  },

  get(id) {
    const state = read();
    const project = state.projects.find((item) => String(item.id) === String(id));
    if (!project) throw new Error('Project not found');
    return decorateProject(state, project);
  },

  create(payload = {}) {
    return mutate((state) => {
      const id = uid('proj');
      const ownerId = payload.ownerId ? String(payload.ownerId) : '';
      const project = {
        id,
        name: payload.name || 'Untitled project',
        description: payload.description || '',
        status: payload.status || 'TODO',
        priority: payload.priority || 'MEDIUM',
        startDate: payload.startDate || '',
        dueDate: payload.dueDate || '',
        ownerId,
        archived: false,
        progress: 0,
        createdAt: now(),
      };
      state.projects.unshift(project);
      const memberIds = Array.from(new Set([...(payload.memberIds || []).map(String), ownerId].filter(Boolean)));
      memberIds.forEach((userId) => state.members.push({ id: uid('mem'), projectId: id, userId, role: userId === ownerId ? 'OWNER' : 'MEMBER' }));
      log(state, id, `Project "${project.name}" was created.`);
      return decorateProject(state, project);
    });
  },

  update(id, payload = {}) {
    return mutate((state) => {
      const project = state.projects.find((item) => String(item.id) === String(id));
      if (!project) throw new Error('Project not found');
      const previousOwner = project.ownerId;
      Object.assign(project, {
        name: payload.name ?? project.name,
        description: payload.description ?? project.description,
        status: payload.status ?? project.status,
        priority: payload.priority ?? project.priority,
        startDate: payload.startDate ?? project.startDate,
        dueDate: payload.dueDate ?? project.dueDate,
        ownerId: payload.ownerId != null && payload.ownerId !== '' ? String(payload.ownerId) : project.ownerId,
      });
      if (project.ownerId !== previousOwner) {
        state.members.forEach((member) => { if (member.projectId === project.id && member.role === 'OWNER') member.role = 'MEMBER'; });
        const existing = state.members.find((member) => member.projectId === project.id && String(member.userId) === project.ownerId);
        if (existing) existing.role = 'OWNER';
        else state.members.push({ id: uid('mem'), projectId: project.id, userId: project.ownerId, role: 'OWNER' });
        log(state, project.id, `${userOf(project.ownerId)?.name || 'A member'} is now the project owner.`);
      }
      log(state, project.id, 'Project details were updated.');
      return decorateProject(state, project);
    });
  },

  archive(id) {
    return mutate((state) => {
      const project = state.projects.find((item) => String(item.id) === String(id));
      if (!project) throw new Error('Project not found');
      project.archived = true;
      log(state, project.id, 'Project was archived.');
      return { id: project.id, archived: true };
    });
  },

  members(id) {
    const state = read();
    return { items: state.members.filter((member) => member.projectId === String(id)).map((member) => decorateMember(state, member)) };
  },

  addMember(id, userId) {
    return mutate((state) => {
      const projectId = String(id);
      if (!state.projects.some((project) => String(project.id) === projectId)) throw new Error('Project not found');
      if (state.members.some((member) => member.projectId === projectId && String(member.userId) === String(userId))) {
        throw new Error('This person is already a project member');
      }
      const member = { id: uid('mem'), projectId, userId: String(userId), role: 'MEMBER' };
      state.members.push(member);
      log(state, projectId, `${userOf(userId)?.name || 'A member'} was added to the project.`);
      return decorateMember(state, member);
    });
  },

  removeMember(id, userId) {
    return mutate((state) => {
      const projectId = String(id);
      const member = state.members.find((item) => item.projectId === projectId && String(item.userId) === String(userId));
      if (!member) throw new Error('Member not found on this project');
      if (member.role === 'OWNER') throw new Error('The project owner cannot be removed');
      state.members = state.members.filter((item) => item !== member);
      state.tasks.forEach((task) => { if (task.projectId === projectId && String(task.assigneeId) === String(userId)) task.assigneeId = null; });
      log(state, projectId, `${userOf(userId)?.name || 'A member'} was removed from the project.`);
      return { userId: String(userId), removed: true };
    });
  },

  tasks(id, params = {}) {
    const state = read();
    const items = projectTasks(state, String(id))
      .filter((task) => (!params.status || task.status === params.status) && (!params.assigneeId || String(task.assigneeId) === String(params.assigneeId)))
      .map((task) => decorateTask(state, task));
    return { items };
  },

  createTask(id, payload = {}) {
    return mutate((state) => {
      const projectId = String(id);
      if (!state.projects.some((project) => String(project.id) === projectId)) throw new Error('Project not found');
      const task = {
        id: uid('task'),
        projectId,
        title: payload.title || 'Untitled task',
        description: payload.description || '',
        status: payload.status || 'TODO',
        priority: payload.priority || 'MEDIUM',
        progress: payload.status === 'COMPLETED' ? 100 : Number(payload.progress) || 0,
        startDate: payload.startDate || '',
        dueDate: payload.dueDate || '',
        assigneeId: payload.assigneeId ? String(payload.assigneeId) : null,
        archived: false,
        createdAt: now(),
      };
      state.tasks.push(task);
      log(state, projectId, `Task "${task.title}" was created.`);
      return decorateTask(state, task);
    });
  },

  updateTask(id, taskId, payload = {}) {
    return mutate((state) => {
      const task = state.tasks.find((item) => String(item.id) === String(taskId) && item.projectId === String(id));
      if (!task) throw new Error('Task not found');
      if (payload.assigneeId !== undefined) task.assigneeId = payload.assigneeId ? String(payload.assigneeId) : null;
      if (payload.title !== undefined) task.title = payload.title;
      if (payload.description !== undefined) task.description = payload.description;
      if (payload.priority !== undefined) task.priority = payload.priority;
      if (payload.startDate !== undefined) task.startDate = payload.startDate;
      if (payload.dueDate !== undefined) task.dueDate = payload.dueDate;
      if (payload.progress !== undefined) {
        task.progress = Math.max(0, Math.min(100, Number(payload.progress) || 0));
        if (task.progress === 100 && task.status !== 'COMPLETED') task.status = 'COMPLETED';
        else if (task.progress < 100 && task.status === 'COMPLETED') task.status = 'IN_PROGRESS';
      }
      if (payload.status !== undefined) {
        task.status = payload.status;
        if (payload.status === 'COMPLETED') task.progress = 100;
        else if (task.progress === 100) task.progress = 90;
      }
      log(state, task.projectId, `Task "${task.title}" was updated.`);
      return decorateTask(state, task);
    });
  },

  archiveTask(id, taskId) {
    return mutate((state) => {
      const task = state.tasks.find((item) => String(item.id) === String(taskId) && item.projectId === String(id));
      if (!task) throw new Error('Task not found');
      task.archived = true;
      log(state, task.projectId, `Task "${task.title}" was archived.`);
      return { id: task.id, archived: true };
    });
  },

  activity(id) {
    const state = read();
    const items = state.activity
      .filter((item) => item.projectId === String(id))
      .map((item) => ({ id: item.id, message: item.message, createdAt: item.createdAt, actor: { name: item.actorName } }));
    return { items };
  },

  // Cross-project task views power the admin task board.
  allTasks(params = {}) {
    const state = read();
    const live = new Set(state.projects.filter((project) => !project.archived).map((project) => project.id));
    const q = String(params.search || '').toLowerCase();
    return {
      items: state.tasks
        .filter((task) => !task.archived && live.has(task.projectId))
        .filter((task) => (!params.projectId || task.projectId === params.projectId)
          && (!params.status || task.status === params.status)
          && (!params.priority || task.priority === params.priority)
          && (!params.assigneeId || String(task.assigneeId) === String(params.assigneeId))
          && (!q || `${task.title} ${task.description || ''}`.toLowerCase().includes(q)))
        .map((task) => decorateTask(state, task)),
    };
  },

  getTask(taskId) {
    const state = read();
    const task = state.tasks.find((item) => String(item.id) === String(taskId));
    if (!task) throw new Error('Task not found');
    return decorateTask(state, task);
  },

  comments(taskId) {
    const state = read();
    return {
      items: state.comments
        .filter((item) => String(item.taskId) === String(taskId))
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .map((item) => ({ id: item.id, message: item.message, createdAt: item.createdAt, author: { name: item.authorName } })),
    };
  },

  addComment(taskId, message) {
    return mutate((state) => {
      const task = state.tasks.find((item) => String(item.id) === String(taskId));
      if (!task) throw new Error('Task not found');
      const text = String(message || '').trim();
      if (!text) throw new Error('Comment cannot be empty');
      const user = readUser();
      const comment = { id: uid('cmt'), taskId: String(taskId), authorName: user?.name || 'You', message: text, createdAt: now() };
      state.comments.push(comment);
      log(state, task.projectId, `A comment was added on "${task.title}".`);
      return { id: comment.id, message: comment.message, createdAt: comment.createdAt, author: { name: comment.authorName } };
    });
  },

  myProjects(params = {}) {
    const state = read();
    const user = readUser();
    const mine = new Set(state.members.filter((member) => String(member.userId) === String(user?.id)).map((member) => member.projectId));
    const items = state.projects
      .filter((project) => !project.archived && mine.has(project.id) && matches(project, params))
      .map((project) => decorateProject(state, project));
    return { items };
  },

  myTasks(params = {}) {
    const state = read();
    const user = readUser();
    const live = new Set(state.projects.filter((project) => !project.archived).map((project) => project.id));
    const q = String(params.search || '').toLowerCase();
    const items = state.tasks
      .filter((task) => !task.archived && live.has(task.projectId) && String(task.assigneeId) === String(user?.id))
      .filter((task) => (!params.status || task.status === params.status)
        && (!params.priority || task.priority === params.priority)
        && (!q || `${task.title} ${task.description || ''}`.toLowerCase().includes(q)))
      .map((task) => decorateTask(state, task));
    return { items };
  },
};
