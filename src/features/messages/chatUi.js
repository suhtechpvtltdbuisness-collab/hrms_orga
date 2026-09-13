export const initials = (name) => String(name || 'U').trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();

const startOfDay = (value) => { const date = new Date(value); date.setHours(0, 0, 0, 0); return date.getTime(); };

export const clockTime = (value) => new Date(value).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

// "12:04", "Yesterday", "9 Sept" — the usual chat list stamp.
export const listStamp = (value) => {
  if (!value) return '';
  const days = Math.round((startOfDay(Date.now()) - startOfDay(value)) / 86400000);
  if (days === 0) return clockTime(value);
  if (days === 1) return 'Yesterday';
  if (days < 7) return new Date(value).toLocaleDateString('en-IN', { weekday: 'short' });
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

export const dayDivider = (value) => {
  const days = Math.round((startOfDay(Date.now()) - startOfDay(value)) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
};

// A stable colour per person so avatars stay recognisable across the app.
const avatarTones = ['bg-violet-100 text-violet-700', 'bg-blue-100 text-blue-700', 'bg-emerald-100 text-emerald-700', 'bg-amber-100 text-amber-700', 'bg-rose-100 text-rose-700', 'bg-sky-100 text-sky-700'];
export const avatarTone = (key) => {
  const text = String(key || '');
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) hash = (hash * 31 + text.charCodeAt(index)) % avatarTones.length;
  return avatarTones[hash];
};

export const groupByDay = (messages) => messages.reduce((groups, message) => {
  const label = dayDivider(message.createdAt);
  const last = groups[groups.length - 1];
  if (last && last.label === label) last.items.push(message);
  else groups.push({ label, items: [message] });
  return groups;
}, []);
