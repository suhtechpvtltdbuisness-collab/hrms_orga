import { messageStore } from './messageStore';

const API = '/api/messages';
const messagesApiDisabled = import.meta.env.VITE_MESSAGES_API_ENABLED === 'false';

let demoMode = messagesApiDisabled;

export const isDemoMode = () => demoMode;

const headers = () => {
  const token = localStorage.getItem('authToken');
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
};

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

// Live API first; the persistent local store takes over when it is disabled or
// unreachable, so the screens behave identically either way.
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

export const messageService = {
  isDemoMode,
  // Live updates are local-only today; the API build should swap this for a socket.
  subscribe: (listener) => messageStore.subscribe(listener),
  conversations: (params = {}) => call(`/conversations?${query(params)}`, undefined, () => messageStore.conversations(params)),
  conversation: (id) => call(`/conversations/${id}`, undefined, () => messageStore.conversation(id)),
  messages: (id) => call(`/conversations/${id}/messages`, undefined, () => messageStore.messages(id)),
  createConversation: (payload) => call('/conversations', { method: 'POST', body: JSON.stringify(payload) }, () => messageStore.createConversation(payload)),
  send: (id, body) => call(`/conversations/${id}/messages`, { method: 'POST', body: JSON.stringify({ body }) }, () => messageStore.send(id, body)),
  editMessage: (id, messageId, body) => call(`/conversations/${id}/messages/${messageId}`, { method: 'PATCH', body: JSON.stringify({ body }) }, () => messageStore.editMessage(messageId, body)),
  deleteMessage: (id, messageId) => call(`/conversations/${id}/messages/${messageId}`, { method: 'DELETE' }, () => messageStore.deleteMessage(messageId)),
  markRead: (id) => call(`/conversations/${id}/read`, { method: 'POST' }, () => messageStore.markRead(id)),
  addParticipants: (id, userIds) => call(`/conversations/${id}/participants`, { method: 'POST', body: JSON.stringify({ userIds }) }, () => messageStore.addParticipants(id, userIds)),
  leave: (id) => call(`/conversations/${id}/participants/me`, { method: 'DELETE' }, () => messageStore.leave(id)),
  unreadTotal: () => call('/unread', undefined, () => messageStore.unreadTotal()),
};
