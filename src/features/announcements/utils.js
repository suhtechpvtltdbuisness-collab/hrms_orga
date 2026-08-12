export function canEmployeeView(announcement, employee = {}) {
  if (!announcement || announcement.status !== 'Published') return false;
  if (announcement.expiryDate && new Date(`${announcement.expiryDate}T23:59:59`) < new Date()) return false;
  if (announcement.audience === 'All Employees') return true;
  if (announcement.audience === 'Specific Departments') {
    return announcement.departments?.includes(employee.department);
  }
  if (announcement.audience === 'Specific Employees') {
    const identities = [employee.id, employee.name, employee.fullName, employee.email].filter(Boolean).map(String);
    return announcement.employees?.some(value => identities.includes(String(value)));
  }
  return false;
}

export function relativeTime(value) {
  const seconds = Math.max(1, Math.floor((Date.now() - new Date(value).getTime()) / 1000));
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
