const API = '/api/projects';
const projectsApiDisabled = import.meta.env.VITE_PROJECTS_API_ENABLED === 'false';

const headers = () => {
  const token = localStorage.getItem('authToken');
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
};

async function request(path = '', options = {}) {
  if (projectsApiDisabled) {
    throw new Error('Project Management API is disabled');
  }
  const response = await fetch(`${API}${path}`, { credentials: 'include', ...options, headers: { ...headers(), ...options.headers } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || body.error || 'Request failed');
  return body.data ?? body;
}

export const projectService = {
  list: (params = {}) => request(`?${new URLSearchParams(Object.entries(params).filter(([, v]) => v !== '' && v != null)).toString()}`),
  get: (id) => request(`/${id}`),
  create: (payload) => request('', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) => request(`/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  archive: (id) => request(`/${id}`, { method: 'DELETE' }),
  members: (id) => request(`/${id}/members`),
  addMember: (id, userId) => request(`/${id}/members`, { method: 'POST', body: JSON.stringify({ userId }) }),
  removeMember: (id, userId) => request(`/${id}/members/${userId}`, { method: 'DELETE' }),
  tasks: (id, params = {}) => request(`/${id}/tasks?${new URLSearchParams(params).toString()}`),
  createTask: (id, payload) => request(`/${id}/tasks`, { method: 'POST', body: JSON.stringify(payload) }),
  updateTask: (id, taskId, payload) => request(`/${id}/tasks/${taskId}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  archiveTask: (id, taskId) => request(`/${id}/tasks/${taskId}`, { method: 'DELETE' }),
  activity: (id) => request(`/${id}/activity`),
  myProjects: (params = {}) => request(`/mine?${new URLSearchParams(params).toString()}`),
  myTasks: (params = {}) => request(`/tasks/mine?${new URLSearchParams(params).toString()}`),
};

export const projectOptions = {
  statuses: ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'BLOCKED'],
  priorities: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
};
