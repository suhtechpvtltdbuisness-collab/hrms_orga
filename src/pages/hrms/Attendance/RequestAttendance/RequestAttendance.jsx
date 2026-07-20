import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CalendarClock, Check, Clock3, Search, UserRound, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Spinner from '../../../../components/ui/Spinner';
import { attendanceService } from '../../../../service';

const STATUS_STYLE = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-rose-50 text-rose-700 border-rose-200',
};

const formatDate = (value) => value ? new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const normalizeRequest = (item) => ({
  id: item.id || item._id,
  employeeName: item.employeeName || item.employee?.name || item.user?.name || 'Employee',
  employeeId: item.employeeCode || item.empId || item.employee?.employeeId || '—',
  department: item.departmentName || item.department?.name || item.employee?.department?.name || '—',
  fromDate: item.fromDate || item.date || item.attendanceDate,
  toDate: item.toDate || item.fromDate || item.date || item.attendanceDate,
  requestType: item.requestType || item.reason || 'Attendance correction',
  explanation: item.explanation || item.description || item.notes || 'No explanation provided',
  status: String(item.status || 'pending').toLowerCase(),
  createdAt: item.createdAt,
});

const RequestAttendance = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [selected, setSelected] = useState(null);
  const [actionLoading, setActionLoading] = useState('');

  const loadRequests = useCallback(async () => {
    setLoading(true);
    const result = await attendanceService.getAttendanceRequests();
    if (result.success) setRequests((result.data || []).map(normalizeRequest));
    else toast.error(result.message || 'Could not load attendance requests');
    setLoading(false);
  }, []);

  useEffect(() => { loadRequests(); }, [loadRequests]);

  const filtered = useMemo(() => requests.filter((request) => {
    const matchesStatus = status === 'all' || request.status === status;
    const haystack = `${request.employeeName} ${request.employeeId} ${request.department} ${request.requestType}`.toLowerCase();
    return matchesStatus && haystack.includes(search.toLowerCase());
  }), [requests, search, status]);

  const counts = useMemo(() => ({
    all: requests.length,
    pending: requests.filter((item) => item.status === 'pending').length,
    approved: requests.filter((item) => item.status === 'approved').length,
    rejected: requests.filter((item) => item.status === 'rejected').length,
  }), [requests]);

  const updateRequest = async (request, nextStatus) => {
    setActionLoading(nextStatus);
    const result = nextStatus === 'approved'
      ? await attendanceService.approveAttendanceRequest(request.id)
      : await attendanceService.rejectAttendanceRequest(request.id);
    if (result.success) {
      toast.success(`Request ${nextStatus}`);
      setRequests((current) => current.map((item) => item.id === request.id ? { ...item, status: nextStatus } : item));
      setSelected((current) => current?.id === request.id ? { ...current, status: nextStatus } : current);
    } else toast.error(result.message);
    setActionLoading('');
  };

  return (
    <div className="mx-2 my-4 flex h-[calc(100vh-10rem)] flex-col overflow-hidden rounded-xl border border-[#D9D9D9] bg-white px-4 py-5 sm:mx-4 sm:px-6" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
      <button onClick={() => navigate('/hrms')} className="mb-3 flex w-fit items-center gap-2 text-sm font-medium text-[#7D1EDB]"><ArrowLeft size={16} />HRMS Dashboard</button>
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div><h1 className="text-xl font-semibold text-slate-900">Attendance Requests</h1><p className="mt-1 text-sm text-slate-500">Review employee attendance corrections and regularisation requests.</p></div>
        <button onClick={loadRequests} className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Refresh</button>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[['all','All requests'],['pending','Pending'],['approved','Approved'],['rejected','Rejected']].map(([key, label]) => <button key={key} onClick={() => setStatus(key)} className={`rounded-xl border p-3 text-left transition ${status === key ? 'border-[#7D1EDB] bg-violet-50' : 'border-slate-200 bg-white'}`}><p className="text-xs font-medium text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold text-slate-900">{counts[key]}</p></button>)}
      </div>

      <div className="relative mb-4 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search employee or request type" className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-violet-200" /></div>

      <div className="flex-1 overflow-auto rounded-xl border border-slate-200">
        {loading ? <div className="flex h-52 items-center justify-center"><Spinner size={28} /></div> : filtered.length === 0 ? <div className="flex h-52 flex-col items-center justify-center text-center text-slate-400"><CalendarClock size={38} className="mb-3 text-violet-300" /><p className="font-semibold text-slate-600">No attendance requests found</p><p className="mt-1 text-sm">New employee requests will appear here.</p></div> : <table className="w-full min-w-[850px] text-left text-sm"><thead className="sticky top-0 bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">Employee</th><th className="px-4 py-3">Request</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Submitted</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Action</th></tr></thead><tbody>{filtered.map((request) => <tr key={request.id} className="border-t border-slate-100 hover:bg-violet-50/30"><td className="px-4 py-3"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-violet-700"><UserRound size={16} /></span><div><p className="font-semibold text-slate-800">{request.employeeName}</p><p className="text-xs text-slate-500">{request.employeeId} · {request.department}</p></div></div></td><td className="px-4 py-3 font-medium text-slate-700">{request.requestType}</td><td className="px-4 py-3 text-slate-600">{formatDate(request.fromDate)}{request.toDate !== request.fromDate ? ` – ${formatDate(request.toDate)}` : ''}</td><td className="px-4 py-3 text-slate-500">{formatDate(request.createdAt)}</td><td className="px-4 py-3"><span className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_STYLE[request.status] || STATUS_STYLE.pending}`}>{request.status}</span></td><td className="px-4 py-3 text-right"><button onClick={() => setSelected(request)} className="font-semibold text-[#7D1EDB] hover:underline">View details</button></td></tr>)}</tbody></table>}
      </div>

      {selected && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onMouseDown={() => setSelected(null)}><div onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-violet-600">Attendance request</p><h2 className="mt-1 text-xl font-bold text-slate-900">{selected.employeeName}</h2><p className="text-sm text-slate-500">{selected.employeeId} · {selected.department}</p></div><button onClick={() => setSelected(null)} className="rounded-lg p-1 hover:bg-slate-100"><X size={20} /></button></div><div className="my-5 grid grid-cols-2 gap-3"><div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-400">Request type</p><p className="mt-1 font-semibold text-slate-700">{selected.requestType}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-400">Requested dates</p><p className="mt-1 font-semibold text-slate-700">{formatDate(selected.fromDate)} – {formatDate(selected.toDate)}</p></div></div><div className="rounded-xl border border-slate-200 p-4"><p className="text-xs font-semibold uppercase text-slate-400">Employee explanation</p><p className="mt-2 text-sm leading-6 text-slate-700">{selected.explanation}</p></div>{selected.status === 'pending' && <div className="mt-6 flex justify-end gap-3"><button disabled={!!actionLoading} onClick={() => updateRequest(selected, 'rejected')} className="flex items-center gap-2 rounded-full border border-rose-200 px-5 py-2.5 font-semibold text-rose-600 disabled:opacity-50"><X size={16} />Reject</button><button disabled={!!actionLoading} onClick={() => updateRequest(selected, 'approved')} className="flex items-center gap-2 rounded-full bg-[#7D1EDB] px-5 py-2.5 font-semibold text-white disabled:opacity-50">{actionLoading === 'approved' ? <Spinner size={16} color="#fff" /> : <Check size={16} />}Approve</button></div>}{selected.status !== 'pending' && <div className={`mt-5 flex items-center gap-2 rounded-xl border p-3 text-sm font-semibold capitalize ${STATUS_STYLE[selected.status]}`}><Clock3 size={16} />This request is {selected.status}.</div>}</div></div>}
    </div>
  );
};

export default RequestAttendance;
