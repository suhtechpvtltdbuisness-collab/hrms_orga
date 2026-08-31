export const demoProjects = [
  { id: 'demo-website', name: 'Website refresh', description: 'Redesign the public marketing website and careers experience.', status: 'IN_PROGRESS', priority: 'HIGH', progress: 45, startDate: '2026-08-01', dueDate: '2026-09-30', owner: { name: 'Priya Nair' }, memberCount: 3 },
  { id: 'demo-policy', name: 'HR policy review', description: 'Review and publish annual leave and remote work policy.', status: 'TODO', priority: 'MEDIUM', progress: 10, startDate: '2026-09-01', dueDate: '2026-09-20', owner: { name: 'Amit Sharma' }, memberCount: 2 },
  { id: 'demo-onboarding', name: 'Onboarding improvement', description: 'Improve the first-week experience for new employees.', status: 'COMPLETED', priority: 'LOW', progress: 100, startDate: '2026-07-01', dueDate: '2026-08-15', owner: { name: 'Amit Sharma' }, memberCount: 4 }
];

export const demoTasks = [
  { id: 'demo-task-design', projectId: 'demo-website', projectName: 'Website refresh', title: 'Finalize the design system', description: 'Document approved type, colours, buttons and card patterns.', status: 'IN_PROGRESS', priority: 'HIGH', progress: 60, dueDate: '2026-09-05' },
  { id: 'demo-task-copy', projectId: 'demo-website', projectName: 'Website refresh', title: 'Write careers page copy', description: 'Prepare approved content for the careers landing page.', status: 'TODO', priority: 'MEDIUM', progress: 0, dueDate: '2026-09-12' },
  { id: 'demo-task-policy', projectId: 'demo-policy', projectName: 'HR policy review', title: 'Collect policy feedback', description: 'Consolidate feedback from managers and employees.', status: 'IN_REVIEW', priority: 'MEDIUM', progress: 80, dueDate: '2026-09-10' }
];
