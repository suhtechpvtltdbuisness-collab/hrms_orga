const API_BASE_PATH = '/api';
const BASE_URL =
  typeof window !== 'undefined'
    ? `${window.location.origin}${API_BASE_PATH}`
    : API_BASE_PATH;

const notify = () => window.dispatchEvent(new Event('orga-announcements-change'));

const buildQuery = (params = {}) => {
  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null && value !== '',
  );
  return entries.length ? `?${new URLSearchParams(Object.fromEntries(entries))}` : '';
};

const request = async (path, options = {}) => {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.message || payload.error || 'Request failed. Please try again.');
    error.status = response.status;
    throw error;
  }
  return payload;
};

const toBody = (input = {}) => {
  const body = { ...input };
  if ('scheduledAt' in input && (input.scheduledAt === undefined || input.scheduledAt === '')) {
    body.scheduledAt = null;
  }
  if ('publishedAt' in input && (input.publishedAt === undefined || input.publishedAt === '')) {
    body.publishedAt = null;
  }
  delete body.id;
  delete body.reads;
  delete body.createdAt;
  delete body.updatedAt;
  delete body.isRead;
  return JSON.stringify(body);
};

export const announcementService = {
  list: async (params = {}) => {
    const res = await request(`/announcements${buildQuery(params)}`);
    return res.data || [];
  },

  stats: async () => {
    const res = await request('/announcements/stats');
    return res.data || {};
  },

  listForEmployee: async (params = {}) => {
    const res = await request(`/announcements/employee${buildQuery(params)}`);
    return {
      items: res.data || [],
      meta: res.meta || { unread: 0, urgent: 0 },
    };
  },

  get: async (id) => {
    const res = await request(`/announcements/${id}`);
    return res.data;
  },

  getForEmployee: async (id) => {
    const res = await request(`/announcements/employee/${id}`);
    return res.data;
  },

  create: async (input) => {
    const res = await request('/announcements', {
      method: 'POST',
      body: toBody(input),
    });
    notify();
    return res.data;
  },

  update: async (id, input) => {
    const res = await request(`/announcements/${id}`, {
      method: 'PUT',
      body: toBody(input),
    });
    notify();
    return res.data;
  },

  updateStatus: async (id, action) => {
    const res = await request(`/announcements/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ action }),
    });
    notify();
    return res.data;
  },

  remove: async (id) => {
    await request(`/announcements/${id}`, { method: 'DELETE' });
    notify();
    return true;
  },

  duplicate: async (id) => {
    const res = await request(`/announcements/${id}/duplicate`, { method: 'POST' });
    notify();
    return res.data;
  },

  markRead: async (id, read = true) => {
    await request(`/announcements/${id}/read`, {
      method: 'PATCH',
      body: JSON.stringify({ read: Boolean(read) }),
    });
    notify();
    return true;
  },
};
