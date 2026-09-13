// Shared presentation helpers so the admin task board and the employee task
// page label, colour and sort tasks identically.
export const statusLabels = { TODO: 'To do', IN_PROGRESS: 'In progress', IN_REVIEW: 'In review', COMPLETED: 'Completed', BLOCKED: 'Blocked' };

export const statusTone = (value) => ({
  TODO: 'bg-slate-100 text-slate-600',
  IN_PROGRESS: 'bg-blue-50 text-blue-700',
  IN_REVIEW: 'bg-amber-50 text-amber-700',
  COMPLETED: 'bg-emerald-50 text-emerald-700',
  BLOCKED: 'bg-rose-50 text-rose-700',
}[value] || 'bg-slate-100 text-slate-600');

export const priorityTone = (value) => ({
  LOW: 'bg-slate-100 text-slate-600',
  MEDIUM: 'bg-sky-50 text-sky-700',
  HIGH: 'bg-orange-50 text-orange-700',
  URGENT: 'bg-rose-50 text-rose-700',
}[value] || 'bg-slate-100 text-slate-600');

export const columnAccent = {
  TODO: 'bg-slate-400',
  IN_PROGRESS: 'bg-blue-500',
  IN_REVIEW: 'bg-amber-500',
  COMPLETED: 'bg-emerald-500',
  BLOCKED: 'bg-rose-500',
};

export const formatDate = (value) => value
  ? new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  : '—';

export const formatDateTime = (value) => value
  ? new Date(value).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  : '—';

const startOfToday = () => { const today = new Date(); today.setHours(0, 0, 0, 0); return today; };

export const isOverdue = (task) => Boolean(task?.dueDate) && task.status !== 'COMPLETED' && new Date(task.dueDate) < startOfToday();

export const dueLabel = (task) => {
  if (!task?.dueDate) return 'No due date';
  const days = Math.round((new Date(task.dueDate).setHours(0, 0, 0, 0) - startOfToday()) / 86400000);
  if (task.status === 'COMPLETED') return `Due ${formatDate(task.dueDate)}`;
  if (days < 0) return `Overdue by ${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'}`;
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  return `Due in ${days} days`;
};

export const initials = (name) => String(name || 'U').trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();

// Sort: overdue first, then by due date, then by priority weight.
const weight = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
export const sortTasks = (tasks) => [...tasks].sort((a, b) => {
  if (isOverdue(a) !== isOverdue(b)) return isOverdue(a) ? -1 : 1;
  const aDue = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
  const bDue = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
  if (aDue !== bDue) return aDue - bDue;
  return (weight[a.priority] ?? 9) - (weight[b.priority] ?? 9);
});

export const readUser = () => { try { return JSON.parse(localStorage.getItem('userData') || '{}'); } catch { return {}; } };

export const isAdminUser = (person, currentUser) => {
  if (!person) return false;
  const id = String(person.userId || person.id || '');
  if (currentUser?.id && id && id === String(currentUser.id)) return true;
  if (person.isAdmin === true) return true;
  const type = String(person.type || '').toLowerCase();
  return type === 'admin' || type === 'organization';
};

export const toAssignableEmployee = (row) => {
  const user = row?.user || row;
  if (!user?.id) return null;
  const type = String(user.type || row?.type || 'employee').toLowerCase();
  if (user.isAdmin === true || type === 'admin' || type === 'organization') return null;
  return {
    id: String(user.id),
    userId: String(user.id),
    name: user.name || user.email || `User ${user.id}`,
    email: user.email || '',
    type: type || 'employee',
    isAdmin: false,
  };
};

export const employeeAssignees = (rows = [], currentUser) =>
  (Array.isArray(rows) ? rows : [])
    .map(toAssignableEmployee)
    .filter(Boolean)
    .filter((person) => !isAdminUser(person, currentUser));
