import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { ArrowLeft, Check, CheckCheck, Loader2, LogOut, MessageSquare, Pencil, Plus, Search, Send, Trash2, UserPlus, Users, X } from 'lucide-react';
import { employeeService } from '../../service';
import { mergeDirectory } from '../projects/demoDirectory';
import { isDemoMode, messageService } from './messageService';
import { avatarTone, clockTime, groupByDay, initials, listStamp } from './chatUi';

const readUser = () => { try { return JSON.parse(localStorage.getItem('userData') || '{}'); } catch { return {}; } };
const normalizePeople = (rows) => (Array.isArray(rows) ? rows : []).map((row) => {
  const user = row?.user || row;
  return user?.id ? { id: String(user.id), name: user.name || user.email || `User ${user.id}`, email: user.email || '' } : null;
}).filter(Boolean);

const Avatar = ({ name, size = 'h-10 w-10', text = 'text-xs' }) => <div className={`grid ${size} shrink-0 place-items-center rounded-full font-bold ${text} ${avatarTone(name)}`}>{initials(name)}</div>;

export default function ChatWorkspace({ title = 'Messages', subtitle = 'Talk to your team in one place.', canStartGroups = true }) {
  const currentUser = useMemo(readUser, []);
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [people, setPeople] = useState([]);
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [error, setError] = useState('');
  const [usingDemo, setUsingDemo] = useState(false);
  const [sending, setSending] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editDraft, setEditDraft] = useState('');
  const [composeForm, setComposeForm] = useState({ participantIds: [], name: '', search: '' });
  const bottomRef = useRef(null);
  const activeIdRef = useRef(null);

  const active = useMemo(() => conversations.find((item) => item.id === activeId) || null, [conversations, activeId]);
  useEffect(() => { activeIdRef.current = activeId; }, [activeId]);

  const loadPeople = useCallback(async () => {
    let rows = [];
    try {
      if (currentUser?.id) {
        const response = await employeeService.getAllEmployeesByAdminId(currentUser.id, 1, 200);
        rows = response?.data || [];
      }
    } catch {
      rows = [];
    }
    const directory = normalizePeople(rows).filter((person) => person.id !== String(currentUser?.id));
    setPeople(directory.length ? directory : mergeDirectory([], null).filter((person) => person.id !== String(currentUser?.id)));
  }, [currentUser]);

  const loadConversations = useCallback(async (term = '') => {
    const data = await messageService.conversations(term ? { search: term } : {});
    const items = data?.items ?? data ?? [];
    setConversations(items);
    return items;
  }, []);

  const loadThread = useCallback(async (conversationId) => {
    if (!conversationId) return;
    const data = await messageService.messages(conversationId);
    setMessages(data?.items ?? data ?? []);
  }, []);

  useEffect(() => { loadPeople(); }, [loadPeople]);

  useEffect(() => {
    let active_ = true;
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError('');
        const items = await loadConversations(search);
        if (!active_) return;
        setUsingDemo(isDemoMode());
        setActiveId((current) => current || items[0]?.id || null);
      } catch (loadError) {
        if (active_) setError(loadError.message || 'Unable to load conversations');
      } finally {
        if (active_) setLoading(false);
      }
    }, 200);
    return () => { active_ = false; clearTimeout(timer); };
  }, [search, loadConversations]);

  // Open thread: load it, then mark it read so badges clear.
  useEffect(() => {
    if (!activeId) { setMessages([]); return; }
    let active_ = true;
    (async () => {
      try {
        setLoadingThread(true);
        await loadThread(activeId);
        await messageService.markRead(activeId);
        if (active_) await loadConversations(search);
      } catch (threadError) {
        if (active_) toast.error(threadError.message || 'Unable to open conversation');
      } finally {
        if (active_) setLoadingThread(false);
      }
    })();
    return () => { active_ = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  // Another tab (or the other panel) wrote something — refresh quietly.
  useEffect(() => messageService.subscribe(() => {
    loadConversations(search).catch(() => {});
    if (activeIdRef.current) loadThread(activeIdRef.current).catch(() => {});
  }), [loadConversations, loadThread, search]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ block: 'end' }); }, [messages.length, activeId]);

  const send = async (event) => {
    event.preventDefault();
    const body = draft.trim();
    if (!body || !activeId) return;
    try {
      setSending(true);
      setDraft('');
      await messageService.send(activeId, body);
      await Promise.all([loadThread(activeId), loadConversations(search)]);
    } catch (sendError) {
      setDraft(body);
      toast.error(sendError.message || 'Unable to send message');
    } finally {
      setSending(false);
    }
  };

  const saveEdit = async (event) => {
    event.preventDefault();
    const body = editDraft.trim();
    if (!body) return;
    try {
      await messageService.editMessage(activeId, editing, body);
      setEditing(null);
      await loadThread(activeId);
    } catch (editError) {
      toast.error(editError.message || 'Unable to edit message');
    }
  };

  const remove = async (messageId) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await messageService.deleteMessage(activeId, messageId);
      await Promise.all([loadThread(activeId), loadConversations(search)]);
    } catch (deleteError) {
      toast.error(deleteError.message || 'Unable to delete message');
    }
  };

  const startConversation = async (event) => {
    event.preventDefault();
    try {
      const conversation = await messageService.createConversation({
        participantIds: composeForm.participantIds,
        name: composeForm.name,
        type: composeForm.participantIds.length > 1 ? 'group' : 'direct',
      });
      const created = conversation?.conversation || conversation;
      setShowCompose(false);
      setComposeForm({ participantIds: [], name: '', search: '' });
      await loadConversations(search);
      setActiveId(created.id);
      toast.success('Conversation ready');
    } catch (createError) {
      toast.error(createError.message || 'Unable to start the conversation');
    }
  };

  const addPeople = async (userIds) => {
    try {
      await messageService.addParticipants(activeId, userIds);
      await loadConversations(search);
      toast.success('People added');
    } catch (addError) {
      toast.error(addError.message || 'Unable to add people');
    }
  };

  const leave = async () => {
    if (!window.confirm(active.type === 'group' ? 'Leave this group conversation?' : 'Archive this conversation?')) return;
    try {
      await messageService.leave(activeId);
      setShowDetails(false);
      const items = await loadConversations(search);
      setActiveId(items[0]?.id || null);
      toast.success(active.type === 'group' ? 'You left the conversation' : 'Conversation archived');
    } catch (leaveError) {
      toast.error(leaveError.message || 'Unable to update the conversation');
    }
  };

  const toggleComposeMember = (id) => setComposeForm((current) => ({
    ...current,
    participantIds: current.participantIds.includes(id) ? current.participantIds.filter((item) => item !== id) : [...current.participantIds, id],
  }));

  const composeCandidates = people.filter((person) => person.name.toLowerCase().includes(composeForm.search.toLowerCase()));
  const unreadTotal = conversations.reduce((sum, item) => sum + item.unreadCount, 0);

  return <div className="flex h-[calc(100vh-150px)] min-h-[520px] flex-col">
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-violet-600"><MessageSquare size={17} />Team inbox</div>
        <h1 className="text-2xl font-bold text-slate-900">{title}{unreadTotal > 0 && <span className="ml-2 rounded-full bg-violet-600 px-2.5 py-1 align-middle text-xs font-bold text-white">{unreadTotal} unread</span>}</h1>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      <button onClick={() => setShowCompose(true)} className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-200"><Plus size={17} />New message</button>
    </div>

    {usingDemo && <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">Demo mode: the messaging API is not connected yet, so conversations live in this browser only.</div>}

    <div className="mt-4 grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-3">
      <section className={`flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm ${activeId ? 'hidden lg:flex' : 'flex'}`}>
        <div className="border-b border-slate-100 p-3">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
            <Search size={16} className="text-slate-400" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search people and messages…" className="w-full text-sm outline-none" />
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {error ? <div className="p-8 text-center text-sm"><p className="text-rose-600">{error}</p><button onClick={() => loadConversations(search)} className="mt-2 font-semibold text-violet-600">Try again</button></div>
            : loading ? <div className="flex items-center justify-center gap-2 p-10 text-sm text-slate-500"><Loader2 size={16} className="animate-spin" />Loading…</div>
              : !conversations.length ? <div className="p-10 text-center text-sm text-slate-500">No conversations yet. Start one with the button above.</div>
                : conversations.map((conversation) => <button
                  key={conversation.id}
                  onClick={() => setActiveId(conversation.id)}
                  className={`flex w-full items-center gap-3 border-b border-slate-50 p-3.5 text-left transition hover:bg-slate-50 ${activeId === conversation.id ? 'bg-violet-50/60' : ''}`}
                >
                  <Avatar name={conversation.title} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-slate-800">{conversation.title}</p>
                      <span className="shrink-0 text-[11px] text-slate-400">{listStamp(conversation.updatedAt)}</span>
                    </div>
                    <div className="mt-0.5 flex items-center justify-between gap-2">
                      <p className={`truncate text-xs ${conversation.unreadCount ? 'font-semibold text-slate-700' : 'text-slate-500'}`}>
                        {conversation.lastMessage ? `${conversation.lastMessage.mine ? 'You: ' : conversation.type === 'group' ? `${conversation.lastMessage.senderName}: ` : ''}${conversation.lastMessage.body}` : 'No messages yet'}
                      </p>
                      {conversation.unreadCount > 0 && <span className="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-violet-600 px-1.5 text-[11px] font-bold text-white">{conversation.unreadCount}</span>}
                    </div>
                  </div>
                </button>)}
        </div>
      </section>

      <section className={`flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm lg:col-span-2 ${activeId ? 'flex' : 'hidden lg:flex'}`}>
        {!active ? <div className="grid flex-1 place-items-center p-10 text-center text-sm text-slate-500">
          <div><MessageSquare className="mx-auto mb-3 text-violet-300" size={28} />Select a conversation to start chatting.</div>
        </div> : <>
          <div className="flex items-center gap-3 border-b border-slate-100 p-4">
            <button onClick={() => setActiveId(null)} aria-label="Back to conversations" className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"><ArrowLeft size={18} /></button>
            <Avatar name={active.title} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-slate-900">{active.title}</p>
              <p className="truncate text-xs text-slate-500">{active.type === 'group' ? `${active.participants.length} members · ${active.participants.map((person) => person.self ? 'You' : person.name).join(', ')}` : active.participants.find((person) => !person.self)?.email || 'Direct message'}</p>
            </div>
            <button onClick={() => setShowDetails(true)} aria-label="Conversation details" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><Users size={18} /></button>
          </div>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-slate-50/60 p-4">
            {loadingThread && !messages.length ? <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-500"><Loader2 size={16} className="animate-spin" />Loading messages…</div>
              : !messages.length ? <p className="py-10 text-center text-sm text-slate-500">No messages yet — say hello.</p>
                : groupByDay(messages).map((group) => <div key={group.label} className="space-y-2.5">
                  <div className="flex justify-center"><span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-500 shadow-sm">{group.label}</span></div>
                  {group.items.map((message) => <div key={message.id} className={`group flex gap-2.5 ${message.mine ? 'flex-row-reverse' : ''}`}>
                    {!message.mine && <Avatar name={message.sender?.name} size="h-8 w-8" text="text-[10px]" />}
                    <div className={`max-w-[78%] ${message.mine ? 'items-end text-right' : ''}`}>
                      {active.type === 'group' && !message.mine && <p className="mb-0.5 px-1 text-[11px] font-semibold text-slate-500">{message.sender?.name}</p>}
                      {editing === message.id ? <form onSubmit={saveEdit} className="flex items-center gap-2">
                        <input autoFocus value={editDraft} onChange={(event) => setEditDraft(event.target.value)} className="w-64 rounded-xl border border-violet-300 px-3 py-2 text-sm outline-none" />
                        <button className="rounded-lg bg-violet-600 p-2 text-white"><Check size={14} /></button>
                        <button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-slate-200 p-2 text-slate-500"><X size={14} /></button>
                      </form> : <div className={`rounded-2xl px-3.5 py-2.5 text-sm leading-6 shadow-sm ${message.mine ? 'rounded-tr-sm bg-violet-600 text-white' : 'rounded-tl-sm bg-white text-slate-700'}`}>
                        <p className="whitespace-pre-wrap break-words">{message.body}</p>
                        <p className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${message.mine ? 'text-violet-200' : 'text-slate-400'}`}>
                          {message.editedAt && <span>edited</span>}
                          {clockTime(message.createdAt)}
                          {message.mine && (message.readBy.length > 1 ? <CheckCheck size={12} /> : <Check size={12} />)}
                        </p>
                      </div>}
                      {message.mine && editing !== message.id && <div className="mt-1 hidden gap-2 group-hover:flex">
                        <button onClick={() => { setEditing(message.id); setEditDraft(message.body); }} className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-violet-600"><Pencil size={11} />Edit</button>
                        <button onClick={() => remove(message.id)} className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-rose-600"><Trash2 size={11} />Delete</button>
                      </div>}
                    </div>
                  </div>)}
                </div>)}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={send} className="flex items-end gap-2 border-t border-slate-100 p-3">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); send(event); } }}
              rows={1}
              placeholder="Write a message…  (Enter to send, Shift + Enter for a new line)"
              className="max-h-32 min-h-[44px] flex-1 resize-y rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-violet-400"
            />
            <button disabled={sending || !draft.trim()} className="flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"><Send size={16} />{sending ? 'Sending…' : 'Send'}</button>
          </form>
        </>}
      </section>
    </div>

    {showCompose && <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-900/40 p-4">
      <form onSubmit={startConversation} className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-slate-900">New message</h2>
        <p className="mt-1 text-sm text-slate-500">Pick one person for a direct message{canStartGroups ? ', or several to start a group.' : '.'}</p>
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
          <Search size={16} className="text-slate-400" />
          <input value={composeForm.search} onChange={(event) => setComposeForm({ ...composeForm, search: event.target.value })} placeholder="Search people…" className="w-full text-sm outline-none" />
        </div>
        <div className="mt-3 max-h-64 space-y-1.5 overflow-y-auto rounded-2xl border border-slate-200 p-2">
          {!composeCandidates.length ? <p className="p-4 text-center text-sm text-slate-500">No people found.</p> : composeCandidates.map((person) => <label key={person.id} className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 hover:bg-slate-50">
            <input type="checkbox" checked={composeForm.participantIds.includes(person.id)} onChange={() => toggleComposeMember(person.id)} className="accent-violet-600" />
            <Avatar name={person.name} size="h-8 w-8" text="text-[10px]" />
            <span className="min-w-0"><span className="block truncate text-sm font-semibold text-slate-800">{person.name}</span><span className="block truncate text-xs text-slate-500">{person.email || 'Organization member'}</span></span>
          </label>)}
        </div>
        {composeForm.participantIds.length > 1 && <label className="mt-4 block text-sm font-medium text-slate-700">Group name
          <input required value={composeForm.name} onChange={(event) => setComposeForm({ ...composeForm, name: event.target.value })} placeholder="e.g. Website refresh" className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm" />
        </label>}
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={() => setShowCompose(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold">Cancel</button>
          <button disabled={!composeForm.participantIds.length} className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">Start conversation</button>
        </div>
      </form>
    </div>}

    {showDetails && active && <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-900/40 p-4" onClick={() => setShowDetails(false)}>
      <div onClick={(event) => event.stopPropagation()} className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3"><Avatar name={active.title} size="h-12 w-12" text="text-sm" /><div><h2 className="font-bold text-slate-900">{active.title}</h2><p className="text-xs text-slate-500">{active.type === 'group' ? `Group · ${active.participants.length} members` : 'Direct message'}</p></div></div>
          <button onClick={() => setShowDetails(false)} aria-label="Close details" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"><X size={18} /></button>
        </div>
        <div className="mt-5 space-y-2">
          {active.participants.map((person) => <div key={person.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
            <Avatar name={person.name} size="h-8 w-8" text="text-[10px]" />
            <div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-800">{person.name}{person.self && ' (you)'}</p><p className="truncate text-xs text-slate-500">{person.email || 'Organization member'}</p></div>
          </div>)}
        </div>
        {active.type === 'group' && <div className="mt-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-800"><UserPlus size={15} className="text-violet-500" />Add people</p>
          <div className="mt-2 max-h-40 space-y-1 overflow-y-auto rounded-xl border border-slate-200 p-2">
            {people.filter((person) => !active.participantIds.includes(person.id)).map((person) => <button key={person.id} onClick={() => addPeople([person.id])} className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-violet-50">
              <Avatar name={person.name} size="h-7 w-7" text="text-[10px]" />{person.name}
            </button>)}
            {!people.filter((person) => !active.participantIds.includes(person.id)).length && <p className="p-2 text-center text-xs text-slate-500">Everyone is already here.</p>}
          </div>
        </div>}
        <button onClick={leave} className="mt-6 flex items-center gap-2 rounded-xl border border-rose-200 px-3.5 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50">
          <LogOut size={15} />{active.type === 'group' ? 'Leave conversation' : 'Archive conversation'}
        </button>
      </div>
    </div>}
  </div>;
}
