import { demoStore } from './demoStore';

const API = '/api/projects';
const useDemoOnly = import.meta.env.VITE_PROJECTS_API_ENABLED === 'false';

export const isDemoMode = () => useDemoOnly;

const headers = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const query = (params = {}) =>
  new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== '' && value != null),
  ).toString();

const toNumberId = (value) => {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

const asStringId = (value) => (value == null || value === '' ? null : String(value));

const normalizePerson = (person) => {
  if (!person) return null;
  return {
    ...person,
    id: asStringId(person.id),
  };
};

const normalizeProject = (project) => {
  if (!project) return project;
  return {
    ...project,
    id: asStringId(project.id),
    ownerId: asStringId(project.ownerId ?? project.owner?.id),
    owner: normalizePerson(project.owner),
    progress: Number(project.progress ?? 0),
    memberCount: Number(project.memberCount ?? 0),
    taskCount: Number(project.taskCount ?? 0),
    completedTaskCount: Number(project.completedTaskCount ?? 0),
  };
};

const normalizeTask = (task) => {
  if (!task) return task;
  return {
    ...task,
    id: asStringId(task.id),
    projectId: asStringId(task.projectId),
    assigneeId: asStringId(task.assigneeId ?? task.assignee?.id),
    assignee: normalizePerson(task.assignee),
    progress: Number(task.progress ?? 0),
    project: task.project
      ? { ...task.project, id: asStringId(task.project.id) }
      : task.project,
  };
};

const normalizeMember = (member) => {
  if (!member) return member;
  return {
    ...member,
    id: asStringId(member.id ?? member.userId),
    userId: asStringId(member.userId ?? member.id),
  };
};

const normalizeComment = (comment) => {
  if (!comment) return comment;
  return {
    ...comment,
    id: asStringId(comment.id),
    taskId: asStringId(comment.taskId),
    projectId: asStringId(comment.projectId),
    author: normalizePerson(comment.author),
  };
};

const normalizeProjectPayload = (payload = {}) => {
  const next = { ...payload };
  if ('ownerId' in next) next.ownerId = toNumberId(next.ownerId);
  if ('progress' in next && next.progress != null && next.progress !== '') {
    next.progress = Number(next.progress);
  }
  if (Array.isArray(next.memberIds)) {
    next.memberIds = next.memberIds.map(toNumberId).filter(Boolean);
  }
  return next;
};

const normalizeTaskPayload = (payload = {}) => {
  const next = { ...payload };
  delete next.projectId;
  if ('assigneeId' in next) next.assigneeId = toNumberId(next.assigneeId);
  if ('progress' in next && next.progress != null && next.progress !== '') {
    next.progress = Number(next.progress);
  }
  return next;
};

let refreshInFlight = null;

async function refreshAccessToken() {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return false;
      const response = await fetch('/api/auth/refresh-token', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      const body = await response.json().catch(() => ({}));
      const accessToken = body?.data?.tokens?.accessToken;
      if (!response.ok || !accessToken) return false;
      localStorage.setItem('authToken', accessToken);
      if (body.data.tokens.refreshToken) {
        localStorage.setItem('refreshToken', body.data.tokens.refreshToken);
      }
      return true;
    })().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

async function request(path = '', options = {}, retried = false) {
  const response = await fetch(`${API}${path}`, {
    credentials: 'include',
    ...options,
    headers: { ...headers(), ...options.headers },
  });
  const body = await response.json().catch(() => ({}));
  if (response.status === 401 && !retried) {
    const refreshed = await refreshAccessToken();
    if (refreshed) return request(path, options, true);
  }
  if (!response.ok) {
    const raw = body.message || body.error || `Request failed (${response.status})`;
    const message = response.status === 401
      ? 'Your session expired. Please sign in again.'
      : raw;
    const error = new Error(message);
    error.status = response.status;
    error.body = body;
    throw error;
  }
  return body.data ?? body;
}

const unwrapItems = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.projects)) return data.projects;
  if (Array.isArray(data?.tasks)) return data.tasks;
  if (Array.isArray(data?.members)) return data.members;
  if (Array.isArray(data?.activity)) return data.activity;
  if (Array.isArray(data?.comments)) return data.comments;
  return [];
};

const call = async (liveCall, demoCall) => {
  if (useDemoOnly) return demoCall();
  return liveCall();
};

export const projectService = {
  isDemoMode,

  list: (params = {}) =>
    call(
      async () => {
        const data = await request(`?${query(params)}`);
        return { items: unwrapItems(data).map(normalizeProject), pagination: data?.pagination };
      },
      () => demoStore.list(params),
    ),

  get: (id) =>
    call(
      async () => normalizeProject(await request(`/${id}`)),
      () => demoStore.get(id),
    ),

  create: (payload) =>
    call(
      async () => normalizeProject(await request('', {
        method: 'POST',
        body: JSON.stringify(normalizeProjectPayload(payload)),
      })),
      () => demoStore.create(payload),
    ),

  update: (id, payload) =>
    call(
      async () => normalizeProject(await request(`/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(normalizeProjectPayload(payload)),
      })),
      () => demoStore.update(id, payload),
    ),

  archive: (id) =>
    call(
      () => request(`/${id}`, { method: 'DELETE' }),
      () => demoStore.archive(id),
    ),

  members: (id) =>
    call(
      async () => {
        const data = await request(`/${id}/members`);
        return { items: unwrapItems(data).map(normalizeMember) };
      },
      () => demoStore.members(id),
    ),

  addMember: (id, userId) =>
    call(
      async () => {
        const data = await request(`/${id}/members`, {
          method: 'POST',
          body: JSON.stringify({ userId: toNumberId(userId) }),
        });
        return { items: unwrapItems(data).map(normalizeMember) };
      },
      () => demoStore.addMember(id, userId),
    ),

  removeMember: (id, userId) =>
    call(
      () => request(`/${id}/members/${userId}`, { method: 'DELETE' }),
      () => demoStore.removeMember(id, userId),
    ),

  tasks: (id, params = {}) =>
    call(
      async () => {
        const data = await request(`/${id}/tasks?${query(params)}`);
        return { items: unwrapItems(data).map(normalizeTask) };
      },
      () => demoStore.tasks(id, params),
    ),

  createTask: (id, payload) =>
    call(
      async () => normalizeTask(await request(`/${id}/tasks`, {
        method: 'POST',
        body: JSON.stringify(normalizeTaskPayload(payload)),
      })),
      () => demoStore.createTask(id, payload),
    ),

  updateTask: (id, taskId, payload) =>
    call(
      async () => normalizeTask(await request(`/${id}/tasks/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify(normalizeTaskPayload(payload)),
      })),
      () => demoStore.updateTask(id, taskId, payload),
    ),

  archiveTask: (id, taskId) =>
    call(
      () => request(`/${id}/tasks/${taskId}`, { method: 'DELETE' }),
      () => demoStore.archiveTask(id, taskId),
    ),

  activity: (id) =>
    call(
      async () => {
        const data = await request(`/${id}/activity`);
        return {
          items: unwrapItems(data).map((item) => ({
            ...item,
            id: asStringId(item.id),
            projectId: asStringId(item.projectId),
            actor: normalizePerson(item.actor),
          })),
        };
      },
      () => demoStore.activity(id),
    ),

  allTasks: (params = {}) =>
    call(
      async () => {
        const data = await request(`/tasks?${query(params)}`);
        return { items: unwrapItems(data).map(normalizeTask) };
      },
      () => demoStore.allTasks(params),
    ),

  getTask: (projectId, taskId) =>
    call(
      async () => normalizeTask(await request(`/${projectId}/tasks/${taskId}`)),
      () => demoStore.getTask(taskId),
    ),

  comments: (projectId, taskId) =>
    call(
      async () => {
        const data = await request(`/${projectId}/tasks/${taskId}/comments`);
        return { items: unwrapItems(data).map(normalizeComment) };
      },
      () => demoStore.comments(taskId),
    ),

  addComment: (projectId, taskId, message) =>
    call(
      async () => normalizeComment(await request(`/${projectId}/tasks/${taskId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ message }),
      })),
      () => demoStore.addComment(taskId, message),
    ),

  myProjects: (params = {}) =>
    call(
      async () => {
        const data = await request(`/mine?${query(params)}`);
        return { items: unwrapItems(data).map(normalizeProject), pagination: data?.pagination };
      },
      () => demoStore.myProjects(params),
    ),

  myTasks: (params = {}) =>
    call(
      async () => {
        const data = await request(`/tasks/mine?${query(params)}`);
        return { items: unwrapItems(data).map(normalizeTask) };
      },
      () => demoStore.myTasks(params),
    ),
};

export const projectOptions = {
  statuses: ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'BLOCKED'],
  priorities: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
};
