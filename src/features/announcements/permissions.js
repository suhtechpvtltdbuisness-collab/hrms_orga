const permissions = {
  admin: ['view','create','edit','publish','schedule','archive','delete','analytics'],
  manager: ['view','create','edit','publish'],
  employee: ['view','read','download'],
};
export const can = (role, action) => (permissions[role] || []).includes(action);
