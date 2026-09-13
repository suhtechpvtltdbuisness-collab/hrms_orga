// Persistent, browser-local messaging backend. It keeps conversations and
// messages in localStorage and broadcasts every change, so two tabs signed in
// as different people (admin + employee) exchange messages live.
import { demoDirectory } from '../projects/demoDirectory';

const KEY = 'orga.messages.demo.v1';
const CHANNEL = 'orga.messages.changed';
const ME = '__me__';

const now = () => new Date().toISOString();
const uid = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
const readUser = () => { try { return JSON.parse(localStorage.getItem('userData') || '{}'); } catch { return {}; } };
const meId = () => { const user = readUser(); return user?.id ? String(user.id) : 'me'; };
const meName = () => readUser()?.name || 'You';

const directoryEntry = (id) => demoDirectory.find((person) => person.id === String(id));
export const personOf = (id) => {
  if (String(id) === meId()) return { id: meId(), name: meName(), email: readUser()?.email || '', self: true };
  const match = directoryEntry(id);
  return match ? { ...match, self: false } : { id: String(id), name: `User ${id}`, email: '', self: false };
};

const seed = () => {
  const conversations = [
    { id: 'conv-design', type: 'group', name: 'Website refresh', participantIds: [ME, 'demo-user-1', 'demo-user-2', 'demo-user-3'], createdBy: 'demo-user-1', createdAt: '2026-08-20T09:00:00.000Z', archived: false },
    { id: 'conv-priya', type: 'direct', name: '', participantIds: [ME, 'demo-user-1'], createdBy: 'demo-user-1', createdAt: '2026-08-28T09:00:00.000Z', archived: false },
    { id: 'conv-hr', type: 'group', name: 'HR announcements', participantIds: [ME, 'demo-user-4', 'demo-user-5', 'demo-user-6'], createdBy: 'demo-user-4', createdAt: '2026-09-01T09:00:00.000Z', archived: false },
  ];
  const messages = [
    { id: uid('msg'), conversationId: 'conv-design', senderId: 'demo-user-1', body: 'Morning team — design review is at 3pm today.', createdAt: '2026-09-10T03:30:00.000Z', readBy: ['demo-user-1'] },
    { id: uid('msg'), conversationId: 'conv-design', senderId: 'demo-user-3', body: 'The design system tokens are merged, I will demo them.', createdAt: '2026-09-10T04:05:00.000Z', readBy: ['demo-user-3'] },
    { id: uid('msg'), conversationId: 'conv-priya', senderId: 'demo-user-1', body: 'Can you share the careers page copy before EOD?', createdAt: '2026-09-11T05:15:00.000Z', readBy: ['demo-user-1'] },
    { id: uid('msg'), conversationId: 'conv-hr', senderId: 'demo-user-4', body: 'Reminder: submit your timesheets before Friday.', createdAt: '2026-09-12T06:00:00.000Z', readBy: ['demo-user-4'] },
  ];
  return { conversations, messages };
};

function write(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent(CHANNEL));
  } catch { /* storage unavailable: keep working in memory */ }
  return state;
}

const read = () => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.conversations) return parsed;
    }
  } catch { /* fall through to a fresh seed */ }
  return write(seed());
};

const mutate = (updater) => {
  const state = read();
  const result = updater(state);
  write(state);
  return result;
};

// Seeded conversations carry a "__me__" placeholder so they belong to whoever
// is signed in, rather than to one hardcoded demo account.
const participantsOf = (conversation) => Array.from(new Set(conversation.participantIds.map((id) => (id === ME ? meId() : String(id)))));
const isMember = (conversation) => participantsOf(conversation).includes(meId());

const conversationMessages = (state, conversationId) => state.messages
  .filter((message) => message.conversationId === conversationId && !message.deleted)
  .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

const titleOf = (conversation) => {
  if (conversation.type === 'group') return conversation.name || 'Group conversation';
  const other = participantsOf(conversation).find((id) => id !== meId());
  // A seeded thread can resolve to the signed-in user on both sides; show it as
  // a personal note rather than an empty name.
  return other ? personOf(other).name : 'Saved messages';
};

const decorate = (state, conversation) => {
  const messages = conversationMessages(state, conversation.id);
  const last = messages[messages.length - 1];
  return {
    id: conversation.id,
    type: conversation.type,
    title: titleOf(conversation),
    archived: Boolean(conversation.archived),
    participants: participantsOf(conversation).map(personOf),
    participantIds: participantsOf(conversation),
    createdAt: conversation.createdAt,
    unreadCount: messages.filter((message) => message.senderId !== meId() && !(message.readBy || []).includes(meId())).length,
    lastMessage: last ? { id: last.id, body: last.body, createdAt: last.createdAt, senderName: personOf(last.senderId).name, mine: last.senderId === meId() } : null,
    updatedAt: last?.createdAt || conversation.createdAt,
  };
};

const decorateMessage = (message) => ({
  id: message.id,
  conversationId: message.conversationId,
  body: message.body,
  createdAt: message.createdAt,
  editedAt: message.editedAt || null,
  sender: personOf(message.senderId),
  mine: message.senderId === meId(),
  readBy: message.readBy || [],
});

export const messageStore = {
  isDemo: true,
  reset: () => write(seed()),

  // Change notifications so an open thread updates when another tab writes.
  subscribe(listener) {
    const onStorage = (event) => { if (!event || event.key === KEY) listener(); };
    window.addEventListener(CHANNEL, onStorage);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(CHANNEL, onStorage);
      window.removeEventListener('storage', onStorage);
    };
  },

  conversations(params = {}) {
    const state = read();
    const q = String(params.search || '').toLowerCase();
    const items = state.conversations
      .filter((conversation) => isMember(conversation) && (params.includeArchived ? true : !conversation.archived))
      .map((conversation) => decorate(state, conversation))
      .filter((conversation) => !q
        || conversation.title.toLowerCase().includes(q)
        || conversation.participants.some((person) => person.name.toLowerCase().includes(q))
        || (conversation.lastMessage?.body || '').toLowerCase().includes(q))
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    return { items, unreadTotal: items.reduce((sum, item) => sum + item.unreadCount, 0) };
  },

  conversation(id) {
    const state = read();
    const conversation = state.conversations.find((item) => item.id === String(id));
    if (!conversation || !isMember(conversation)) throw new Error('Conversation not found');
    return decorate(state, conversation);
  },

  messages(id) {
    const state = read();
    const conversation = state.conversations.find((item) => item.id === String(id));
    if (!conversation || !isMember(conversation)) throw new Error('Conversation not found');
    return { items: conversationMessages(state, conversation.id).map(decorateMessage) };
  },

  createConversation(payload = {}) {
    return mutate((state) => {
      const others = Array.from(new Set((payload.participantIds || []).map(String).filter((id) => id && id !== meId())));
      if (!others.length) throw new Error('Select at least one person');
      const type = payload.type === 'group' || others.length > 1 ? 'group' : 'direct';
      if (type === 'group' && !String(payload.name || '').trim()) throw new Error('Group conversations need a name');
      if (type === 'direct') {
        // One direct thread per pair — reopen it instead of creating a duplicate.
        const existing = state.conversations.find((item) => item.type === 'direct'
          && isMember(item)
          && participantsOf(item).length === 2
          && participantsOf(item).includes(others[0]));
        if (existing) {
          existing.archived = false;
          return decorate(state, existing);
        }
      }
      const conversation = {
        id: uid('conv'),
        type,
        name: type === 'group' ? String(payload.name).trim() : '',
        participantIds: [meId(), ...others],
        createdBy: meId(),
        createdAt: now(),
        archived: false,
      };
      state.conversations.unshift(conversation);
      return decorate(state, conversation);
    });
  },

  send(id, body) {
    return mutate((state) => {
      const conversation = state.conversations.find((item) => item.id === String(id));
      if (!conversation || !isMember(conversation)) throw new Error('Conversation not found');
      const text = String(body || '').trim();
      if (!text) throw new Error('Message cannot be empty');
      if (text.length > 4000) throw new Error('Message is too long');
      const message = { id: uid('msg'), conversationId: conversation.id, senderId: meId(), body: text, createdAt: now(), readBy: [meId()] };
      state.messages.push(message);
      conversation.archived = false;
      return decorateMessage(message);
    });
  },

  editMessage(messageId, body) {
    return mutate((state) => {
      const message = state.messages.find((item) => item.id === String(messageId));
      if (!message) throw new Error('Message not found');
      if (message.senderId !== meId()) throw new Error('You can only edit your own messages');
      const text = String(body || '').trim();
      if (!text) throw new Error('Message cannot be empty');
      message.body = text;
      message.editedAt = now();
      return decorateMessage(message);
    });
  },

  deleteMessage(messageId) {
    return mutate((state) => {
      const message = state.messages.find((item) => item.id === String(messageId));
      if (!message) throw new Error('Message not found');
      if (message.senderId !== meId()) throw new Error('You can only delete your own messages');
      message.deleted = true;
      return { id: message.id, deleted: true };
    });
  },

  markRead(id) {
    return mutate((state) => {
      const conversation = state.conversations.find((item) => item.id === String(id));
      if (!conversation || !isMember(conversation)) return { updated: 0 };
      let updated = 0;
      conversationMessages(state, conversation.id).forEach((message) => {
        if (message.senderId !== meId() && !(message.readBy || []).includes(meId())) {
          message.readBy = [...(message.readBy || []), meId()];
          updated += 1;
        }
      });
      return { updated };
    });
  },

  addParticipants(id, userIds = []) {
    return mutate((state) => {
      const conversation = state.conversations.find((item) => item.id === String(id));
      if (!conversation || !isMember(conversation)) throw new Error('Conversation not found');
      if (conversation.type !== 'group') throw new Error('Only group conversations can add people');
      const current = participantsOf(conversation);
      const added = userIds.map(String).filter((userId) => userId && !current.includes(userId));
      if (!added.length) throw new Error('Those people are already in this conversation');
      conversation.participantIds = [...conversation.participantIds, ...added];
      return decorate(state, conversation);
    });
  },

  leave(id) {
    return mutate((state) => {
      const conversation = state.conversations.find((item) => item.id === String(id));
      if (!conversation || !isMember(conversation)) throw new Error('Conversation not found');
      if (conversation.type === 'group') {
        conversation.participantIds = conversation.participantIds.filter((participantId) => (participantId === ME ? false : String(participantId) !== meId()));
      } else {
        conversation.archived = true;
      }
      return { id: conversation.id, left: true };
    });
  },

  unreadTotal() {
    return { total: this.conversations().unreadTotal };
  },
};
