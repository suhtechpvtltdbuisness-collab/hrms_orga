// Fallback people roster used when the employee directory API is unavailable.
// Ids are stable so demo memberships survive reloads.
export const demoDirectory = [
  { id: 'demo-user-1', name: 'Priya Nair', email: 'priya.nair@example.com', type: 'manager' },
  { id: 'demo-user-2', name: 'Rohan Verma', email: 'rohan.verma@example.com', type: 'employee' },
  { id: 'demo-user-3', name: 'Meera Joshi', email: 'meera.joshi@example.com', type: 'employee' },
  { id: 'demo-user-4', name: 'Amit Sharma', email: 'amit.sharma@example.com', type: 'manager' },
  { id: 'demo-user-5', name: 'Kavya Iyer', email: 'kavya.iyer@example.com', type: 'employee' },
  { id: 'demo-user-6', name: 'Arjun Mehta', email: 'arjun.mehta@example.com', type: 'employee' },
];

export const mergeDirectory = (people, currentUser) => {
  const merged = [...(Array.isArray(people) ? people : [])];
  demoDirectory.forEach((person) => {
    if (!merged.some((item) => String(item.id) === person.id)) merged.push({ ...person });
  });
  if (currentUser?.id && !merged.some((item) => String(item.id) === String(currentUser.id))) {
    merged.unshift({ id: String(currentUser.id), name: currentUser.name || 'Current user', email: currentUser.email || '', type: currentUser.type || '' });
  }
  return merged;
};
