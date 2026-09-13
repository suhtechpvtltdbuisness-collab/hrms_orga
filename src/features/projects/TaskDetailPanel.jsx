import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Archive, MessageSquare, Send, X } from 'lucide-react';
import { projectOptions, projectService } from './projectService';
import { dueLabel, formatDate, formatDateTime, initials, isOverdue, priorityTone, statusLabels, statusTone } from './taskUi';

// Shared task detail view. Managers get the full edit surface; assignees get
// status, progress and comments only — matching the backend authorization rules.
export default function TaskDetailPanel({ task, members = [], canManage = false, onUpdate, onArchive, onClose }) {
  const [comments, setComments] = useState([]);
  const [draft, setDraft] = useState('');
  const [posting, setPosting] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);
  const [progress, setProgress] = useState(task?.progress ?? 0);
  const [busy, setBusy] = useState(false);

  useEffect(() => { setProgress(task?.progress ?? 0); }, [task?.id, task?.progress]);

  useEffect(() => {
    let active = true;
    setLoadingComments(true);
    projectService.comments(task.projectId, task.id)
      .then((data) => { if (active) setComments(data?.items ?? data ?? []); })
      .catch(() => { if (active) setComments([]); })
      .finally(() => { if (active) setLoadingComments(false); });
    return () => { active = false; };
  }, [task.id, task.projectId]);

  const patch = async (changes) => {
    try {
      setBusy(true);
      await onUpdate(changes);
    } finally {
      setBusy(false);
    }
  };

  const postComment = async (event) => {
    event.preventDefault();
    const message = draft.trim();
    if (!message) return;
    try {
      setPosting(true);
      const comment = await projectService.addComment(task.projectId, task.id, message);
      setComments((current) => [...current, comment?.comment || comment]);
      setDraft('');
    } catch (error) {
      toast.error(error.message || 'Unable to post comment');
    } finally {
      setPosting(false);
    }
  };

  return <div className="flex h-full flex-col">
    <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">{task.projectName || 'Project'}</p>
        <h2 className="mt-1 text-lg font-bold text-slate-900">{task.title}</h2>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone(task.status)}`}>{statusLabels[task.status] || task.status}</span>
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${priorityTone(task.priority)}`}>{task.priority || 'MEDIUM'}</span>
          <span className={`text-xs font-medium ${isOverdue(task) ? 'text-rose-600' : 'text-slate-500'}`}>{dueLabel(task)}</span>
        </div>
      </div>
      {onClose && <button onClick={onClose} aria-label="Close task" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"><X size={18} /></button>}
    </div>

    <div className="flex-1 space-y-5 overflow-y-auto p-5">
      <p className="text-sm leading-6 text-slate-600">{task.description || 'No description provided.'}</p>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Assigned to</p><p className="mt-1 text-sm font-semibold text-slate-800">{task.assignee?.name || 'Unassigned'}</p></div>
        <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Due date</p><p className="mt-1 text-sm font-semibold text-slate-800">{formatDate(task.dueDate)}</p></div>
        <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Start date</p><p className="mt-1 text-sm font-semibold text-slate-800">{formatDate(task.startDate)}</p></div>
        <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Project</p><p className="mt-1 text-sm font-semibold text-slate-800">{task.projectName || '—'}</p></div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">Status
          <select disabled={busy} value={task.status} onChange={(event) => patch({ status: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm">
            {projectOptions.statuses.map((item) => <option key={item} value={item}>{statusLabels[item]}</option>)}
          </select>
        </label>
        {canManage && <label className="text-sm font-medium text-slate-700">Priority
          <select disabled={busy} value={task.priority || 'MEDIUM'} onChange={(event) => patch({ priority: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm">
            {projectOptions.priorities.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>}
        {canManage && <label className="text-sm font-medium text-slate-700">Assignee
          <select disabled={busy} value={task.assigneeId ? String(task.assigneeId) : ''} onChange={(event) => patch({ assigneeId: event.target.value || null })} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm">
            <option value="">Unassigned</option>
            {members.map((member) => <option key={member.userId || member.id} value={member.userId || member.id}>{member.name}</option>)}
          </select>
        </label>}
        {canManage && <label className="text-sm font-medium text-slate-700">Due date
          <input type="date" disabled={busy} value={task.dueDate || ''} onChange={(event) => patch({ dueDate: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm" />
        </label>}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-700"><span>Progress</span><span className="font-bold text-violet-600">{progress}%</span></div>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={progress}
          disabled={busy}
          onChange={(event) => setProgress(Number(event.target.value))}
          onMouseUp={() => progress !== task.progress && patch({ progress })}
          onTouchEnd={() => progress !== task.progress && patch({ progress })}
          onKeyUp={() => progress !== task.progress && patch({ progress })}
          className="w-full accent-violet-600"
        />
      </div>

      <div>
        <p className="flex items-center gap-2 text-sm font-semibold text-slate-800"><MessageSquare size={15} className="text-violet-500" />Comments</p>
        <div className="mt-3 space-y-3">
          {loadingComments ? <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
            : !comments.length ? <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No comments yet. Start the conversation below.</p>
              : comments.map((comment) => <div key={comment.id} className="flex gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">{initials(comment.author?.name)}</div>
                <div className="flex-1 rounded-xl bg-slate-50 p-3">
                  <p className="text-xs font-semibold text-slate-700">{comment.author?.name || 'Someone'} <span className="ml-1 font-normal text-slate-400">{formatDateTime(comment.createdAt)}</span></p>
                  <p className="mt-1 text-sm text-slate-700">{comment.message}</p>
                </div>
              </div>)}
        </div>
        <form onSubmit={postComment} className="mt-3 flex gap-2">
          <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write a comment…" className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-400" />
          <button disabled={posting || !draft.trim()} className="flex items-center gap-1.5 rounded-xl bg-violet-600 px-3.5 py-2 text-sm font-semibold text-white disabled:opacity-50"><Send size={15} />{posting ? 'Posting…' : 'Post'}</button>
        </form>
      </div>
    </div>

    {canManage && onArchive && <div className="border-t border-slate-100 p-4">
      <button onClick={() => onArchive(task)} className="flex items-center gap-2 rounded-xl border border-rose-200 px-3.5 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"><Archive size={15} />Archive task</button>
    </div>}
  </div>;
}
