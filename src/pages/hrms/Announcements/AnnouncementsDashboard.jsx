/* eslint-disable no-unused-vars */
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Megaphone, Plus, Search, SlidersHorizontal, MoreHorizontal, Paperclip, CalendarClock, Users, Eye, Pencil, Copy, Archive, Trash2, Send, Ban } from 'lucide-react';
import { useAnnouncements } from '../../../features/announcements/hooks/useAnnouncements';
import { announcementService } from '../../../features/announcements/services/announcementService';
import { Badge, EmptyState, Modal, priorityTone, statusTone } from '../../../features/announcements/components';
import { departments as fallbackDepartments } from '../../../features/announcements/data';

const format = (d) => (d ? new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d)) : '—');

const STATUS_ACTIONS = {
  Archive: 'archive',
  Publish: 'publish',
  'Cancel schedule': 'cancel_schedule',
};

export default function AnnouncementsDashboard() {
  const { items, loading, error, refresh } = useAnnouncements();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [priority, setPriority] = useState('All');
  const [department, setDepartment] = useState('All');
  const [audience, setAudience] = useState('All');
  const [sort, setSort] = useState('Newest');
  const [page, setPage] = useState(1);
  const [menu, setMenu] = useState(null);
  const [modal, setModal] = useState(null);
  const [busy, setBusy] = useState(false);
  const pageSize = 5;

  const departmentOptions = useMemo(() => {
    const fromItems = items.flatMap((a) => a.departments || []).filter((d) => d && d !== 'All departments');
    return [...new Set([...fallbackDepartments, ...fromItems])];
  }, [items]);

  const filtered = useMemo(
    () =>
      items
        .filter(
          (a) =>
            (!query || `${a.title} ${a.description} ${a.content} ${a.author}`.toLowerCase().includes(query.toLowerCase())) &&
            (status === 'All' || a.status === status) &&
            (priority === 'All' || a.priority === priority) &&
            (department === 'All' || a.departments?.includes(department)) &&
            (audience === 'All' || a.audience === audience),
        )
        .sort((a, b) =>
          sort === 'Oldest'
            ? new Date(a.createdAt) - new Date(b.createdAt)
            : sort === 'Title'
              ? a.title.localeCompare(b.title)
              : new Date(b.createdAt) - new Date(a.createdAt),
        ),
    [items, query, status, priority, department, audience, sort],
  );

  const stats = ['All', 'Published', 'Draft', 'Scheduled', 'Archived'].map((x, i) => ({
    label: i ? ` ${x}` : 'Total announcements',
    value: i ? items.filter((a) => a.status === x).length : items.length,
    status: x,
  }));

  const action = async (type, a) => {
    setMenu(null);
    if (type === 'Edit') return navigate(`/hrms/announcements/${a.id}/edit`);
    if (type === 'Duplicate') {
      try {
        setBusy(true);
        await announcementService.duplicate(a.id);
        toast.success('Draft duplicated');
        await refresh();
      } catch (err) {
        toast.error(err.message || 'Unable to duplicate');
      } finally {
        setBusy(false);
      }
      return;
    }
    if (['Publish', 'Archive', 'Delete', 'Cancel schedule'].includes(type)) {
      setModal({ type, a });
    }
  };

  const confirmAction = async () => {
    const { type, a } = modal;
    try {
      setBusy(true);
      if (type === 'Delete') await announcementService.remove(a.id);
      else await announcementService.updateStatus(a.id, STATUS_ACTIONS[type]);
      toast.success(
        type === 'Delete'
          ? 'Announcement deleted'
          : type === 'Cancel schedule'
            ? 'Schedule cancelled'
            : `Announcement ${type.toLowerCase()}ed`,
      );
      setModal(null);
      await refresh();
    } catch (err) {
      toast.error(err.message || 'Action failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-88px)] rounded-2xl bg-[#f7f7fa] p-4 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-violet-600">
            <Megaphone size={17} /> Communications
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Announcements</h1>
          <p className="mt-1 text-sm text-slate-500">Create, schedule and track company-wide updates.</p>
        </div>
        <button
          onClick={() => navigate('/hrms/announcements/new')}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-200"
        >
          <Plus size={17} /> New announcement
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
        {stats.map((s, i) => (
          <button
            onClick={() => {
              setStatus(s.status);
              setPage(1);
            }}
            key={s.label}
            className={`rounded-2xl border bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 ${status === s.status ? 'border-violet-400 ring-2 ring-violet-100' : 'border-slate-100'}`}
          >
            <div
              className={`mb-3 grid h-9 w-9 place-items-center rounded-xl ${i === 1 ? 'bg-emerald-50 text-emerald-600' : i === 2 ? 'bg-slate-100 text-slate-600' : i === 3 ? 'bg-blue-50 text-blue-600' : i === 4 ? 'bg-amber-50 text-amber-600' : 'bg-violet-50 text-violet-600'}`}
            >
              <Megaphone size={17} />
            </div>
            <p className="text-2xl font-bold text-slate-900">{s.value}</p>
            <p className="mt-1 text-xs text-slate-500">{s.label}</p>
          </button>
        ))}
      </div>

      <section className="mt-5 rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-2 border-b p-4">
          <div className="flex min-w-[230px] flex-1 items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 focus-within:ring-2 focus-within:ring-violet-100">
            <Search size={16} className="text-slate-400" />
            <input
              className="w-full text-sm outline-none"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search title, content or author..."
            />
          </div>
          <SlidersHorizontal size={16} className="ml-1 text-slate-400" />
          {[
            ['Status', status, setStatus, ['All', 'Published', 'Draft', 'Scheduled', 'Archived']],
            ['Priority', priority, setPriority, ['All', 'Normal', 'Important', 'Urgent']],
            ['Department', department, setDepartment, ['All', ...departmentOptions]],
            ['Audience', audience, setAudience, ['All', 'All Employees', 'Specific Departments', 'Specific Employees', 'Managers/Admins']],
            ['Sort', sort, setSort, ['Newest', 'Oldest', 'Title']],
          ].map(([name, val, fn, opts]) => (
            <select
              aria-label={name}
              key={name}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
              value={val}
              onChange={(e) => {
                fn(e.target.value);
                setPage(1);
              }}
            >
              {opts.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          ))}
        </div>

        {error ? (
          <div className="p-12 text-center text-rose-600">{error}</div>
        ) : loading ? (
          <div className="space-y-3 p-5">
            {[1, 2, 3, 4].map((x) => (
              <div key={x} className="h-20 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : !filtered.length ? (
          <div className="p-5">
            <EmptyState />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead>
                  <tr className="border-b bg-slate-50/70 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {['Announcement', 'Status', 'Priority', 'Audience', 'Published / scheduled', 'Engagement', ''].map((x) => (
                      <th key={x} className="px-5 py-3">
                        {x}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.slice((page - 1) * pageSize, page * pageSize).map((a) => (
                    <tr key={a.id} className="border-b border-slate-100 hover:bg-violet-50/30">
                      <td className="max-w-sm px-5 py-4">
                        <button onClick={() => navigate(`/hrms/announcements/${a.id}`)} className="block text-left">
                          <span className="font-semibold text-slate-800 hover:text-violet-700">{a.title}</span>
                          <span className="mt-1 block truncate text-xs text-slate-400">{a.description}</span>
                          <span className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                            By {a.author} · Created {format(a.createdAt)}{' '}
                            {a.attachments?.length > 0 && (
                              <>
                                <Paperclip size={11} />
                                {a.attachments.length}
                              </>
                            )}
                          </span>
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <Badge className={statusTone[a.status]}>{a.status}</Badge>
                      </td>
                      <td className="px-5 py-4">
                        <Badge className={priorityTone[a.priority]}>{a.priority}</Badge>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          {a.audience}
                        </div>
                        <p className="mt-1 text-xs text-slate-400">{a.departments?.join(', ')}</p>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {a.status === 'Scheduled' ? (
                          <span className="flex items-center gap-1 text-blue-600">
                            <CalendarClock size={14} />
                            {format(a.scheduledAt)}
                          </span>
                        ) : (
                          format(a.publishedAt)
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-slate-700">
                          {a.reads} / {a.recipients}
                        </p>
                        <div className="mt-1 h-1.5 w-20 rounded bg-slate-100">
                          <div
                            className="h-full rounded bg-violet-500"
                            style={{ width: `${a.recipients ? Math.round((a.reads / a.recipients) * 100) : 0}%` }}
                          />
                        </div>
                      </td>
                      <td className="relative px-5 py-4">
                        <button disabled={busy} onClick={() => setMenu(menu === a.id ? null : a.id)} className="rounded-lg p-2 hover:bg-slate-100">
                          <MoreHorizontal size={18} />
                        </button>
                        {menu === a.id && (
                          <div className="absolute right-10 top-10 z-20 w-44 rounded-xl border bg-white p-1.5 shadow-xl">
                            {[
                              [Eye, 'View'],
                              [Pencil, 'Edit'],
                              [Copy, 'Duplicate'],
                              ...(a.status === 'Draft' ? [[Send, 'Publish']] : []),
                              ...(a.status === 'Scheduled' ? [[Ban, 'Cancel schedule']] : []),
                              ...(a.status === 'Published' ? [[Archive, 'Archive']] : []),
                              [Trash2, 'Delete'],
                            ].map(([Icon, x]) => (
                              <button
                                key={x}
                                onClick={() => (x === 'View' ? navigate(`/hrms/announcements/${a.id}`) : action(x, a))}
                                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50 ${x === 'Delete' ? 'text-rose-600' : 'text-slate-600'}`}
                              >
                                <Icon size={15} />
                                {x}
                              </button>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between p-4 text-sm text-slate-500">
              <span>
                Showing {Math.min((page - 1) * pageSize + 1, filtered.length)}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}
              </span>
              <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg border px-3 py-1.5 disabled:opacity-40">
                  Previous
                </button>
                <button disabled={page * pageSize >= filtered.length} onClick={() => setPage((p) => p + 1)} className="rounded-lg border px-3 py-1.5 disabled:opacity-40">
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {modal && (
        <Modal
          tone={['Delete', 'Archive'].includes(modal.type) ? 'danger' : 'violet'}
          title={`${modal.type} announcement?`}
          body={
            modal.type === 'Delete'
              ? 'Are you sure you want to delete this announcement? This cannot be undone.'
              : modal.type === 'Archive'
                ? 'Are you sure you want to archive this announcement?'
                : modal.type === 'Publish'
                  ? 'Are you sure you want to publish this announcement?'
                  : 'The announcement will return to drafts.'
          }
          confirm={modal.type}
          onClose={() => !busy && setModal(null)}
          onConfirm={confirmAction}
        />
      )}
    </div>
  );
}
