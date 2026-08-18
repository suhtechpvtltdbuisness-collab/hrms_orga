import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronDown, Download, Eye, FileText, Filter, MoreVertical, Plus, RotateCcw, Timer, Trash2, Upload, X, XCircle, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import FilterDropdown from '../../../components/ui/FilterDropdown';
import { energyPointService, getSecureFileUrl } from '../../../service';

const emptyFilters = { name: '', user: '', rule: '', referenceDocument: '' };
const emptyForm = { name: '', user: '', rule: '', points: '', status: 'Pending', referenceDocument: '', referenceDocumentUrl: '' };
const getStatus = (value = '') => {
    const status = value.toLowerCase();
    if (status.includes('approve') || status === 'auto') return ['bg-emerald-50 text-emerald-600', CheckCircle2];
    if (status.includes('reject')) return ['bg-red-50 text-red-500', XCircle];
    if (status.includes('review')) return ['bg-amber-50 text-amber-600', Timer];
    return ['bg-blue-50 text-blue-600', Timer];
};
const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const EnergyPointLogList = () => {
    const [logs, setLogs] = useState([]);
    const [selected, setSelected] = useState([]);
    const [draft, setDraft] = useState(emptyFilters);
    const [filters, setFilters] = useState(emptyFilters);
    const [options, setOptions] = useState({ names: [], users: [], rules: [], documents: [] });
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterRequest, setFilterRequest] = useState(0);
    const [showAddModal, setShowAddModal] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [openMenu, setOpenMenu] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const loadOptions = useCallback(async () => {
        const [logsResult, rulesResult] = await Promise.all([energyPointService.getLogs({ page: 1, limit: 200 }), energyPointService.getRules({ page: 1, limit: 200 })]);
        const allLogs = logsResult.success ? logsResult.data?.logs || [] : [];
        const unique = (values) => [...new Set(values.filter(Boolean))];
        setOptions({
            names: unique(allLogs.map((item) => item.name)), users: unique(allLogs.map((item) => item.user)),
            rules: rulesResult.success ? unique((rulesResult.data?.rules || []).map((item) => item.ruleName)) : [],
            documents: unique(allLogs.map((item) => item.referenceDocument || item.referenceDocumentType)),
        });
    }, []);
    const loadLogs = useCallback(async () => {
        void filterRequest;
        setLoading(true); setError('');
        const result = await energyPointService.getLogs({ page, limit, ...Object.fromEntries(Object.entries(filters).filter(([, value]) => value)) });
        if (result.success) {
            setLogs(result.data?.logs || []); setTotal(result.data?.total || 0); setPages(result.data?.totalPages || 1);
        } else {
            setLogs([]); setError(result.message || 'Failed to load energy point logs');
        }
        setLoading(false);
    }, [filters, limit, page, filterRequest]);
    useEffect(() => { void Promise.resolve().then(loadOptions); }, [loadOptions]);
    useEffect(() => { void Promise.resolve().then(loadLogs); }, [loadLogs]);

    const shownPages = useMemo(() => {
        const start = Math.max(1, Math.min(page - 1, pages - 2));
        return Array.from({ length: Math.min(3, pages) }, (_, index) => start + index);
    }, [page, pages]);
    const reset = () => { setDraft({ ...emptyFilters }); setFilters({ ...emptyFilters }); setPage(1); setFilterRequest((value) => value + 1); toast.success('Filters reset'); };
    const applyFilters = () => {
        setPage(1);
        setFilters({ ...draft });
        setFilterRequest((value) => value + 1);
        toast.success('Filters applied');
    };
    const exportCsv = () => {
        if (!logs.length) { toast.error('No logs available to export'); return; }
        const rows = logs.map((log, index) => [log.srNo || (page - 1) * limit + index + 1, log.user || log.name || '', log.status || '', log.points ?? '', log.referenceDocument || log.referenceDocumentType || '']);
        const csv = [['Sr No.', 'User', 'Status', 'Points', 'Reference document'], ...rows].map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n');
        const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
        const link = document.createElement('a'); link.href = url; link.download = 'energy-point-logs.csv'; link.click(); URL.revokeObjectURL(url); toast.success('Energy logs exported');
    };
    const openReference = (log) => {
        const reference = log.referenceDocumentUrl || log.referenceUrl || log.referenceDocument;
        if (reference && /^(https?:|blob:|data:|\/)/i.test(reference)) window.open(getSecureFileUrl(reference), '_blank', 'noopener,noreferrer');
        else toast.error('Reference document is not available');
    };
    const createLog = async (event) => {
        event.preventDefault(); setSubmitting(true);
        const result = await energyPointService.createLog({ ...form, points: Number(form.points) });
        if (result.success) {
            toast.success(result.message || 'Energy log added'); setShowAddModal(false); setForm(emptyForm); setPage(1); await Promise.all([loadLogs(), loadOptions()]);
        } else toast.error(result.message || 'Failed to add energy log');
        setSubmitting(false);
    };
    const uploadReference = async (event) => {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file) return;
        const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png', 'image/jpeg'];
        if (!allowed.includes(file.type)) { toast.error('Please upload a PDF, DOC, DOCX, PNG or JPG file'); return; }
        if (file.size > 10 * 1024 * 1024) { toast.error('Document must be smaller than 10 MB'); return; }
        setUploading(true);
        const result = await energyPointService.uploadDocument(file);
        if (result.success && result.file) {
            const uploadedUrl = result.file.url || result.file.path || result.file.location || '';
            setForm((old) => ({ ...old, referenceDocument: file.name, referenceDocumentUrl: uploadedUrl }));
            toast.success('Document uploaded');
        } else toast.error(result.message || 'Failed to upload document');
        setUploading(false);
    };
    const deleteLog = async (log) => {
        setOpenMenu(null);
        if (!window.confirm(`Delete energy log for ${log.user || log.name || 'this user'}?`)) return;
        setDeletingId(log.id);
        const result = await energyPointService.deleteLog(log.id);
        if (result.success) { toast.success(result.message || 'Energy log deleted'); setSelected((old) => old.filter((id) => id !== log.id)); await loadLogs(); }
        else toast.error(result.message || 'Failed to delete energy log');
        setDeletingId(null);
    };
    const dropdownClass = 'flex h-12 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-600 outline-none transition hover:border-violet-300';
    const first = total ? (page - 1) * limit + 1 : 0;
    const last = Math.min(page * limit, total);

    return (
        <div className="min-h-full bg-[#f7f7fb] p-4 font-[Poppins] sm:p-6">
            <div className="mx-auto max-w-[1600px] space-y-5">
                <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600"><Zap size={24} fill="currentColor" /></div><div><h1 className="text-2xl font-semibold tracking-tight text-slate-900">Energy Point Log List</h1><p className="mt-1 text-sm text-slate-500">View and manage energy point logs</p></div></div>
                    <div className="flex gap-3"><button type="button" onClick={() => setShowAddModal(true)} className="flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-violet-700 to-purple-600 px-5 text-sm font-medium text-white shadow-lg shadow-violet-200"><Plus size={18} /> Add Energy Log</button><button type="button" onClick={exportCsv} className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"><Download size={17} /> Export <ChevronDown size={16} /></button></div>
                </header>

                <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_auto_auto] xl:items-end">
                        {[
                            ['Name', 'name', options.names, 'Select name'], ['User', 'user', options.users, 'Select user'], ['Rule', 'rule', options.rules, 'Select rule'], ['Reference Document', 'referenceDocument', options.documents, 'Select document'],
                        ].map(([label, key, values, placeholder]) => <div key={key}><label className="mb-2 block text-sm font-medium text-slate-700">{label}</label><FilterDropdown label={placeholder} placeholder={placeholder} options={values} value={draft[key]} onChange={(value) => setDraft((old) => ({ ...old, [key]: value }))} className={`${dropdownClass} w-full`} /></div>)}
                        <button type="button" onClick={reset} className="flex h-12 items-center justify-center gap-2 rounded-xl bg-violet-50 px-5 text-sm font-medium text-violet-700 hover:bg-violet-100"><RotateCcw size={17} /> Reset</button>
                        <button type="button" onClick={applyFilters} disabled={loading} className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-700 to-purple-600 px-5 text-sm font-medium text-white shadow-md shadow-violet-200 transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60"><Filter size={17} /> {loading ? 'Applying...' : 'Apply Filters'}</button>
                    </div>
                </section>
                {error && <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

                <section className="flex h-[560px] flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                    <div className="min-h-0 flex-1 overflow-auto"><table className="w-full min-w-[1050px] border-collapse text-left text-sm">
                        <thead className="sticky top-0 z-10 bg-[#f8f7ff] text-slate-600 shadow-[0_1px_0_#f1f1f5]"><tr><th className="w-16 px-6 py-5"><input type="checkbox" aria-label="Select all logs" checked={logs.length > 0 && selected.length === logs.length} onChange={(event) => setSelected(event.target.checked ? logs.map((item) => item.id) : [])} className="h-5 w-5 rounded accent-violet-600" /></th><th className="px-4 py-5 font-semibold">Sr No.</th><th className="px-4 py-5 font-semibold">User</th><th className="px-4 py-5 font-semibold">Status</th><th className="px-4 py-5 font-semibold">Points</th><th className="px-4 py-5 font-semibold">Reference document</th><th className="px-6 py-5 text-center font-semibold">Action</th></tr></thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? <tr><td colSpan={7} className="h-52 text-center text-slate-500">Loading energy point logs...</td></tr> : logs.length === 0 ? <tr><td colSpan={7} className="h-52 text-center text-slate-500">No energy point logs found</td></tr> : logs.map((log, index) => {
                                const [statusClass, StatusIcon] = getStatus(log.status); const documentName = log.referenceDocument || log.referenceDocumentType || 'No document'; const points = Number(log.points || 0); const userName = log.user || log.name || 'Unknown user';
                                return <tr key={log.id} className="text-slate-700 transition hover:bg-violet-50/20"><td className="px-6 py-4"><input type="checkbox" aria-label={`Select ${userName}`} checked={selected.includes(log.id)} onChange={() => setSelected((old) => old.includes(log.id) ? old.filter((id) => id !== log.id) : [...old, log.id])} className="h-5 w-5 rounded accent-violet-600" /></td><td className="px-4 py-4 text-slate-600">{log.srNo || (page - 1) * limit + index + 1}</td>
                                    <td className="px-4 py-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 font-semibold text-violet-700">{userName.slice(0, 2).toUpperCase()}</div><div><p className="font-semibold text-slate-900">{userName}</p><p className="mt-0.5 text-xs text-slate-500">{log.designation || log.role || log.rule || 'Employee'}</p></div></div></td>
                                    <td className="px-4 py-4"><span className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium ${statusClass}`}><StatusIcon size={14} />{log.status || 'Pending'}</span></td><td className={`px-4 py-4 font-semibold ${points < 0 ? 'text-red-500' : 'text-emerald-600'}`}>{points > 0 ? '+' : ''}{points}</td>
                                    <td className="px-4 py-4"><div className="flex items-center gap-3"><div className="flex h-10 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500"><FileText size={18} /></div><div><p className="max-w-[260px] truncate font-medium text-slate-800">{documentName}</p><p className="mt-0.5 text-xs text-slate-500">{formatDate(log.createdAt || log.date || log.updatedAt)}</p></div></div></td>
                                    <td className="px-6 py-4"><div className="flex justify-center gap-2"><button type="button" aria-label="View reference" onClick={() => openReference(log)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-100 text-violet-600 hover:bg-violet-50"><Eye size={18} /></button><div className="relative"><button type="button" aria-label="More actions" disabled={deletingId === log.id} onClick={() => setOpenMenu((id) => id === log.id ? null : log.id)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50"><MoreVertical size={18} /></button>{openMenu === log.id && <div className="absolute right-0 z-20 mt-1 w-40 overflow-hidden rounded-xl border border-slate-100 bg-white py-1 text-left shadow-xl"><button type="button" onClick={() => { setOpenMenu(null); openReference(log); }} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"><Eye size={16} /> View document</button><button type="button" onClick={() => deleteLog(log)} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"><Trash2 size={16} /> Delete log</button></div>}</div></div></td></tr>;
                            })}
                        </tbody>
                    </table></div>
                    <footer className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 px-6 py-5 text-sm text-slate-500 md:flex-row"><p>Showing {first} to {last} of {total} entries</p><div className="flex items-center gap-2"><button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page === 1} className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 disabled:opacity-40"><ArrowLeft size={16} /> Previous</button>{shownPages.map((number) => <button type="button" key={number} onClick={() => setPage(number)} className={`h-10 min-w-10 rounded-xl px-3 font-medium ${number === page ? 'bg-violet-700 text-white shadow-md shadow-violet-200' : 'border border-slate-200 hover:bg-slate-50'}`}>{number}</button>)}<button type="button" onClick={() => setPage((value) => Math.min(pages, value + 1))} disabled={page >= pages} className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 disabled:opacity-40">Next <ArrowRight size={16} /></button></div><FilterDropdown label={`${limit} / page`} options={[10, 20, 50]} value={limit} onChange={(value) => { setLimit(Number(value)); setPage(1); }} className="flex h-10 min-w-32 items-center justify-between rounded-xl border border-slate-200 bg-white px-4" disableAllOption /></footer>
                </section>

                {showAddModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm" onMouseDown={() => !submitting && !uploading && setShowAddModal(false)}><form onSubmit={createLog} onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between"><div><h2 className="text-xl font-semibold text-slate-900">Add Energy Log</h2><p className="mt-1 text-sm text-slate-500">Create a new energy point entry</p></div><button type="button" aria-label="Close modal" disabled={submitting || uploading} onClick={() => setShowAddModal(false)} className="rounded-full bg-slate-100 p-2 text-slate-500"><X size={18} /></button></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium text-slate-700">Name<input required value={form.name} onChange={(event) => setForm((old) => ({ ...old, name: event.target.value }))} className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-violet-500" placeholder="Log name" /></label><label className="text-sm font-medium text-slate-700">User<FilterDropdown label="Select user" placeholder="Select user" options={options.users} value={form.user} onChange={(value) => setForm((old) => ({ ...old, user: value }))} className={`${dropdownClass} mt-2 w-full`} disableAllOption /></label><label className="text-sm font-medium text-slate-700">Rule<FilterDropdown label="Select rule" placeholder="Select rule" options={options.rules} value={form.rule} onChange={(value) => setForm((old) => ({ ...old, rule: value }))} className={`${dropdownClass} mt-2 w-full`} disableAllOption /></label><label className="text-sm font-medium text-slate-700">Points<input required type="number" value={form.points} onChange={(event) => setForm((old) => ({ ...old, points: event.target.value }))} className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-violet-500" placeholder="e.g. 50" /></label><label className="text-sm font-medium text-slate-700">Status<FilterDropdown label="Select status" options={['Pending', 'In Review', 'Approved', 'Rejected']} value={form.status} onChange={(value) => setForm((old) => ({ ...old, status: value }))} className={`${dropdownClass} mt-2 w-full`} disableAllOption /></label><div className="text-sm font-medium text-slate-700">Reference Document<label className={`mt-2 flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed px-4 transition ${form.referenceDocument ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-violet-300 bg-violet-50 text-violet-700 hover:bg-violet-100'} ${uploading ? 'pointer-events-none opacity-60' : ''}`}><Upload size={17} /><span className="max-w-[190px] truncate">{uploading ? 'Uploading...' : form.referenceDocument || 'Upload document'}</span><input type="file" className="hidden" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={uploadReference} disabled={uploading} /></label><p className="mt-1 text-xs font-normal text-slate-400">PDF, DOC, DOCX, PNG or JPG · Max 10 MB</p></div></div><div className="mt-6 flex justify-end gap-3"><button type="button" disabled={submitting || uploading} onClick={() => setShowAddModal(false)} className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-medium text-slate-700 disabled:opacity-50">Cancel</button><button type="submit" disabled={submitting || uploading || !form.user || !form.rule} className="h-11 rounded-xl bg-violet-700 px-5 text-sm font-medium text-white disabled:opacity-50">{submitting ? 'Adding...' : 'Add Energy Log'}</button></div></form></div>}
            </div>
        </div>
    );
};
export default EnergyPointLogList;
