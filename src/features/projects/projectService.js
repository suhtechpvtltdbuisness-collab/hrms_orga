import { demoStore } from './demoStore';

const API = '/api/projects';
const projectsApiDisabled = import.meta.env.VITE_PROJECTS_API_ENABLED === 'false';

let demoMode = projectsApiDisabled;

export const isDemoMode = () => demoMode;

const headers = () => {
  const token = localStorage.getItem('authToken');
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
};

// Only transport/availability problems fall back to the local store — real
// validation errors from the API must still reach the user.
const isUnavailable = (error) => !error?.message || /failed to fetch|load failed|network|unexpected token|not found|<!doctype/i.test(error.message);

async function request(path = '', options = {}) {
  const response = await fetch(`${API}${path}`, { credentials: 'include', ...options, headers: { ...headers(), ...options.headers } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(body.message || body.error || `Request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }
  return body.data ?? body;
}

// Every call goes through the live API first; when it is disabled or
// unreachable the identical operation runs against the persistent demo store,
// so the screens behave the same either way.
const call = async (path, options, demoCall) => {
  if (demoMode) return demoCall();
  try {
    return await request(path, options);
  } catch (error) {
    if (error.status >= 400 && error.status < 500) throw error;
    if (!isUnavailable(error)) throw error;
    demoMode = true;
    return demoCall();
  }
};

const query = (params = {}) => new URLSearchParams(Object.entries(params).filter(([, value]) => value !== '' && value != null)).toString();

export const projectService = {
  isDemoMode,
  list: (params = {}) => call(`?${query(params)}`, undefined, () => demoStore.list(params)),
  get: (id) => call(`/${id}`, undefined, () => demoStore.get(id)),
  create: (payload) => call('', { method: 'POST', body: JSON.stringify(payload) }, () => demoStore.create(payload)),
  update: (id, payload) => call(`/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }, () => demoStore.update(id, payload)),
  archive: (id) => call(`/${id}`, { method: 'DELETE' }, () => demoStore.archive(id)),
  members: (id) => call(`/${id}/members`, undefined, () => demoStore.members(id)),
  addMember: (id, userId) => call(`/${id}/members`, { method: 'POST', body: JSON.stringify({ userId }) }, () => demoStore.addMember(id, userId)),
  removeMember: (id, userId) => call(`/${id}/members/${userId}`, { method: 'DELETE' }, () => demoStore.removeMember(id, userId)),
  tasks: (id, params = {}) => call(`/${id}/tasks?${query(params)}`, undefined, () => demoStore.tasks(id, params)),
  createTask: (id, payload) => call(`/${id}/tasks`, { method: 'POST', body: JSON.stringify(payload) }, () => demoStore.createTask(id, payload)),
  updateTask: (id, taskId, payload) => call(`/${id}/tasks/${taskId}`, { method: 'PATCH', body: JSON.stringify(payload) }, () => demoStore.updateTask(id, taskId, payload)),
  archiveTask: (id, taskId) => call(`/${id}/tasks/${taskId}`, { method: 'DELETE' }, () => demoStore.archiveTask(id, taskId)),
  activity: (id) => call(`/${id}/activity`, undefined, () => demoStore.activity(id)),
  allTasks: (params = {}) => call(`/tasks?${query(params)}`, undefined, () => demoStore.allTasks(params)),
  getTask: (projectId, taskId) => call(`/${projectId}/tasks/${taskId}`, undefined, () => demoStore.getTask(taskId)),
  comments: (projectId, taskId) => call(`/${projectId}/tasks/${taskId}/comments`, undefined, () => demoStore.comments(taskId)),
  addComment: (projectId, taskId, message) => call(`/${projectId}/tasks/${taskId}/comments`, { method: 'POST', body: JSON.stringify({ message }) }, () => demoStore.addComment(taskId, message)),
  myProjects: (params = {}) => call(`/mine?${query(params)}`, undefined, () => demoStore.myProjects(params)),
  myTasks: (params = {}) => call(`/tasks/mine?${query(params)}`, undefined, () => demoStore.myTasks(params)),
};

export const projectOptions = {
  statuses: ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'BLOCKED'],
  priorities: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
};
