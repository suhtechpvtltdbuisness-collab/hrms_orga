import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Pencil, Copy, Archive, Trash2, Send, Ban, Users, Calendar, Clock, Paperclip } from 'lucide-react';
import { announcementService } from '../../../features/announcements/services/announcementService';
import { Attachments, Badge, Modal, priorityTone, statusTone } from '../../../features/announcements/components';

const fmt = (d) => (d ? new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—');

const STATUS_ACTIONS = {
  Archive: 'archive',
  Unpublish: 'unpublish',
  'Cancel schedule': 'cancel_schedule',
  Publish: 'publish',
};

export default function AnnouncementDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [a, setA] = useState(null);
  const [modal, setModal] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await announcementService.get(id);
        if (!cancelled) setA(data);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Unable to load announcement');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) {
    return (
      <div className="m-6 rounded-2xl border bg-white p-8 text-center">
        <p className="text-rose-600">{error}</p>
        <button onClick={() => navigate('/hrms/announcements')} className="mt-4 text-sm font-semibold text-violet-600">
          Back to announcements
        </button>
      </div>
    );
  }

  if (!a) return <div className="m-6 h-72 animate-pulse rounded-2xl bg-white" />;

  const act = async () => {
    try {
      setBusy(true);
      if (modal === 'Delete') {
        await announcementService.remove(id);
        toast.success('Announcement deleted');
        navigate('/hrms/announcements');
        return;
      }
      const updated = await announcementService.updateStatus(id, STATUS_ACTIONS[modal]);
      setA(updated);
      toast.success('Announcement updated');
      setModal(null);
    } catch (err) {
      toast.error(err.message || 'Action failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-88px)] rounded-2xl bg-[#f7f7fa] p-4 sm:p-6">
      <button onClick={() => navigate('/hrms/announcements')} className="mb-5 flex items-center gap-2 text-sm font-medium text-slate-500">
        <ArrowLeft size={17} /> Back to announcements
      </button>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <main className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={statusTone[a.status]}>{a.status}</Badge>
            <Badge className={priorityTone[a.priority]}>{a.priority}</Badge>
            <Badge className="bg-violet-50 text-violet-700">{a.type}</Badge>
          </div>
          <h1 className="mt-5 text-2xl font-bold text-slate-900 sm:text-3xl">{a.title}</h1>
          <p className="mt-3 text-base text-slate-500">{a.description}</p>
          <div className="mt-5 flex flex-wrap gap-4 border-y py-4 text-xs text-slate-500">
            <span>
              By <b className="text-slate-700">{a.author}</b>
            </span>
            <span>Created {fmt(a.createdAt)}</span>
            <span>Published {fmt(a.publishedAt)}</span>
          </div>
          <article className="prose mt-7 max-w-none text-sm leading-7 text-slate-700" dangerouslySetInnerHTML={{ __html: a.content }} />
          <div className="mt-8 border-t pt-6">
            <h2 className="mb-3 flex items-center gap-2 font-semibold">
              <Paperclip size={17} /> Attachments
            </h2>
            <Attachments files={a.attachments} />
          </div>
        </main>

        <aside className="space-y-5">
          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="mb-4 font-semibold">Actions</h2>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => navigate(`/hrms/announcements/${id}/edit`)} className="flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold">
                <Pencil size={15} /> Edit
              </button>
              <button
                disabled={busy}
                onClick={async () => {
                  try {
                    setBusy(true);
                    await announcementService.duplicate(id);
                    toast.success('Draft duplicated');
                    navigate('/hrms/announcements');
                  } catch (err) {
                    toast.error(err.message || 'Unable to duplicate');
                  } finally {
                    setBusy(false);
                  }
                }}
                className="flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold"
              >
                <Copy size={15} /> Duplicate
              </button>
              {a.status === 'Draft' && (
                <button onClick={() => setModal('Publish')} className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-3 py-2.5 text-sm font-semibold text-white">
                  <Send size={15} /> Publish
                </button>
              )}
              {a.status === 'Published' && (
                <>
                  <button onClick={() => setModal('Unpublish')} className="flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm">
                    <Ban size={15} /> Unpublish
                  </button>
                  <button onClick={() => setModal('Archive')} className="flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm">
                    <Archive size={15} /> Archive
                  </button>
                </>
              )}
              {a.status === 'Scheduled' && (
                <button onClick={() => setModal('Cancel schedule')} className="col-span-2 flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm">
                  <Ban size={15} /> Cancel schedule
                </button>
              )}
              <button onClick={() => setModal('Delete')} className="col-span-2 flex items-center justify-center gap-2 rounded-xl border border-rose-200 px-3 py-2.5 text-sm font-semibold text-rose-600">
                <Trash2 size={15} /> Delete
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="mb-4 font-semibold">Audience</h2>
            <p className="flex gap-2 text-sm text-slate-600">
              <Users size={17} />
              {a.audience}
            </p>
            <p className="mt-2 text-xs text-slate-400">{a.departments?.join(', ')}</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-violet-50 p-3">
                <p className="text-xl font-bold text-violet-700">{a.reads}</p>
                <p className="text-xs text-violet-500">Employees read</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xl font-bold text-slate-700">{a.recipients}</p>
                <p className="text-xs text-slate-500">Total recipients</p>
              </div>
            </div>
            <div className="mt-4 h-2 rounded bg-slate-100">
              <div className="h-full rounded bg-violet-600" style={{ width: `${a.recipients ? Math.round((a.reads / a.recipients) * 100) : 0}%` }} />
            </div>
            <p className="mt-2 text-xs text-slate-400">
              {a.reads} / {a.recipients} employees read · {a.recipients ? Math.round((a.reads / a.recipients) * 100) : 0}%
            </p>
          </section>

          <section className="rounded-2xl border border-slate-100 bg-white p-5 text-sm text-slate-600 shadow-sm">
            <p className="flex gap-2">
              <Calendar size={16} /> Expires {a.expiryDate ? new Date(a.expiryDate).toLocaleDateString('en-IN') : 'Never'}
            </p>
            {a.scheduledAt && (
              <p className="mt-3 flex gap-2 text-blue-600">
                <Clock size={16} /> Scheduled {fmt(a.scheduledAt)}
              </p>
            )}
          </section>
        </aside>
      </div>

      {modal && (
        <Modal
          title={`${modal} announcement?`}
          body={modal === 'Delete' ? 'Are you sure you want to delete this announcement?' : modal === 'Archive' ? 'Are you sure you want to archive this announcement?' : 'Please confirm this status change.'}
          tone={['Delete', 'Archive'].includes(modal) ? 'danger' : 'violet'}
          confirm={modal}
          onClose={() => !busy && setModal(null)}
          onConfirm={act}
        />
      )}
    </div>
  );
}
