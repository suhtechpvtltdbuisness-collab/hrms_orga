import { seedAnnouncements } from '../data';

const KEY = 'orga_announcements_v2';
const READ_KEY = 'orga_announcement_reads';
const delay = (value) => new Promise(resolve => setTimeout(() => resolve(value), 180));
const notify = () => window.dispatchEvent(new Event('orga-announcements-change'));
const load = () => { try { const value = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(value) ? value : seedAnnouncements; } catch { return seedAnnouncements; } };
const save = (items) => { localStorage.setItem(KEY, JSON.stringify(items)); notify(); return items; };

export const announcementService = {
  list: () => delay(load()),
  get: (id) => delay(load().find(item => item.id === id)),
  create: (input) => { const now = new Date().toISOString(); const item = {...input,id:`ann-${Date.now()}`,createdAt:now,updatedAt:now,reads:0,recipients:input.audience === 'Specific Employees' ? input.employees.length : 156}; save([item,...load()]); return delay(item); },
  update: (id,input) => { const item = {...load().find(a=>a.id===id),...input,updatedAt:new Date().toISOString()}; save(load().map(a=>a.id===id?item:a)); return delay(item); },
  remove: (id) => delay(save(load().filter(a=>a.id!==id))),
  duplicate: (id) => { const source=load().find(a=>a.id===id); return announcementService.create({...source,id:undefined,title:`Copy of ${source.title}`,status:'Draft',publishedAt:undefined,scheduledAt:undefined}); },
  isRead: (id) => { try { return JSON.parse(localStorage.getItem(READ_KEY)||'[]').includes(id); } catch { return false; } },
  markRead: (id,read=true) => { let ids=[]; try { ids=JSON.parse(localStorage.getItem(READ_KEY)||'[]'); } catch { ids=[]; } ids=read?[...new Set([...ids,id])]:ids.filter(x=>x!==id); localStorage.setItem(READ_KEY,JSON.stringify(ids)); notify(); return delay(ids); },
};
