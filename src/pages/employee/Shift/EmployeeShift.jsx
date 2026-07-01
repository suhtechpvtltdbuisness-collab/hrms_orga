import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlarmClock, Clock, X, Loader2, RefreshCw, CalendarDays } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService, shiftAssignmentService, shiftService } from '../../../service';

const statusStyle = {
  active: { bg: 'bg-green-100', text: 'text-green-700' },
  scheduled: { bg: 'bg-violet-100', text: 'text-violet-700' },
  past: { bg: 'bg-gray-100', text: 'text-gray-500' },
  submitted: { bg: 'bg-amber-100', text: 'text-amber-700' },
  approved: { bg: 'bg-green-100', text: 'text-green-700' },
  rejected: { bg: 'bg-red-100', text: 'text-red-600' },
};

const dateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const displayDate = (value) => {
  if (!value) return '—';
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const displayTime = (value) => {
  if (!value) return '—';
  const [hours, minutes] = String(value).split(':').map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return String(value);
  const date = new Date(2000, 0, 1, hours, minutes);
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

const totalHours = (start, end) => {
  if (!start || !end) return '—';
  const toMinutes = (value) => {
    const [hours, minutes] = String(value).split(':').map(Number);
    return hours * 60 + minutes;
  };
  let duration = toMinutes(end) - toMinutes(start);
  if (duration <= 0) duration += 24 * 60;
  return `${(duration / 60).toFixed(1)} hrs`;
};

const normalizeAssignment = (item) => {
  const source = item?.shiftAssignment || item?.assignment || item || {};
  const shift = source.shift || source.shiftType || {};
  return {
    id: source.id || source.assignmentId,
    rosterDate: source.rosterDate || source.date,
    shiftTypeId: source.shiftTypeId || shift.id,
    shiftName: source.shiftName || source.shiftTypeName || shift.name || 'Assigned Shift',
    startTime: source.startTime || shift.startTime,
    endTime: source.endTime || shift.endTime,
    assignedBy: source.assignedBy,
  };
};

const normalizeRequest = (item) => ({
  id: item.id,
  shiftTypeId: item.shiftTypeId,
  shiftTypeName: item.shiftTypeName || item.shiftType?.name || 'Requested Shift',
  fromDate: item.fromDate,
  toDate: item.toDate,
  comment: item.comment || '',
  status: String(item.status || 'submitted').toLowerCase(),
  createdAt: item.createdAt,
  rejectionReason: item.rejectionReason || '',
});

export default function EmployeeShift() {
  const [assignments, setAssignments] = useState([]);
  const [requests, setRequests] = useState([]);
  const [shiftTypes, setShiftTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ shiftTypeId: '', fromDate: '', toDate: '', comment: '' });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const today = useMemo(() => new Date(), []);
  const todayKey = dateKey(today);
  const rangeStart = useMemo(() => {
    const date = new Date(today);
    date.setDate(date.getDate() - 90);
    return dateKey(date);
  }, [today]);
  const rangeEnd = useMemo(() => {
    const date = new Date(today);
    date.setDate(date.getDate() + 14);
    return dateKey(date);
  }, [today]);

  const loadData = useCallback(async ({ quiet = false } = {}) => {
    if (!quiet) setLoading(true);
    setError('');
    try {
      const profileResult = await authService.getProfile();
      const storedUser = JSON.parse(localStorage.getItem('userData') || '{}');
      const profile = profileResult.success ? (profileResult.data?.user || profileResult.data) : storedUser;
      const employeeId = Number(profile?.id || profile?._id);
      if (!employeeId) throw new Error('Unable to identify the employee account.');

      const [assignmentResult, requestResult, typeResult] = await Promise.all([
        shiftAssignmentService.getEmployeeAssignments(employeeId, rangeStart, rangeEnd),
        shiftService.getShiftRequests({ empId: employeeId }),
        shiftService.getShiftTypes(),
      ]);

      if (!assignmentResult.success) throw new Error(assignmentResult.message);
      if (!requestResult.success) throw new Error(requestResult.message);
      if (!typeResult.success) throw new Error(typeResult.message);

      setAssignments((assignmentResult.data || []).map(normalizeAssignment));
      setRequests((requestResult.data || []).map(normalizeRequest));
      setShiftTypes(Array.isArray(typeResult.data) ? typeResult.data : []);
    } catch (loadError) {
      console.error(loadError);
      setError(loadError.message || 'Failed to load shift information.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [rangeEnd, rangeStart]);

  useEffect(() => {
    const timeoutId = window.setTimeout(loadData, 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadData]);

  const assignmentMap = useMemo(
    () => new Map(assignments.map((assignment) => [assignment.rosterDate, assignment])),
    [assignments],
  );
  const currentShift = assignmentMap.get(todayKey) || null;

  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - today.getDay() + index);
    const key = dateKey(date);
    return {
      key,
      dayName: date.toLocaleDateString('en-IN', { weekday: 'short' }),
      date: date.getDate(),
      month: date.toLocaleDateString('en-IN', { month: 'short' }),
      isToday: key === todayKey,
      assignment: assignmentMap.get(key) || null,
    };
  }), [assignmentMap, today, todayKey]);

  const history = useMemo(
    () => [...assignments]
      .filter((assignment) => assignment.rosterDate <= todayKey)
      .sort((a, b) => b.rosterDate.localeCompare(a.rosterDate))
      .slice(0, 12),
    [assignments, todayKey],
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData({ quiet: true });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (form.fromDate > form.toDate) {
      toast.error('From date cannot be after to date.');
      return;
    }
    setSubmitting(true);
    const result = await shiftService.createShiftRequest({
      shiftTypeId: Number(form.shiftTypeId),
      fromDate: form.fromDate,
      toDate: form.toDate,
      comment: form.comment.trim(),
    });
    setSubmitting(false);
    if (!result.success) {
      toast.error(result.message || 'Failed to submit shift request.');
      return;
    }
    toast.success(result.message || 'Shift request submitted.');
    setShowModal(false);
    setForm({ shiftTypeId: '', fromDate: '', toDate: '', comment: '' });
    await loadData({ quiet: true });
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Shift</h1>
          <p className="text-sm text-gray-500 mt-0.5">View your assigned schedule and request changes</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleRefresh} disabled={loading || refreshing} className="flex items-center gap-2 px-3.5 py-2.5 border border-gray-200 bg-white text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 disabled:opacity-50">
            {refreshing ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />} Refresh
          </button>
          <button onClick={() => setShowModal(true)} disabled={loading || shiftTypes.length === 0} className="flex items-center gap-2 px-4 py-2.5 bg-[#7C3AED] text-white text-sm font-semibold rounded-xl hover:bg-[#6D28D9] disabled:opacity-50">
            <AlarmClock className="w-4 h-4" /> Request Shift Change
          </button>
        </div>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {loading ? (
        <div className="rounded-2xl border border-gray-100 bg-white py-20 text-center shadow-sm">
          <Loader2 className="mx-auto h-7 w-7 animate-spin text-violet-600" />
          <p className="mt-3 text-sm text-gray-500">Loading shift schedule...</p>
        </div>
      ) : (
        <>
          <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #756FCC 0%, #9B7FDC 50%, #B58CEC 100%)' }}>
            {currentShift ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0"><AlarmClock className="w-7 h-7" /></div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{currentShift.shiftName}</h2>
                  <p className="text-violet-100 text-sm mt-1">{displayTime(currentShift.startTime)} → {displayTime(currentShift.endTime)} · {totalHours(currentShift.startTime, currentShift.endTime)}</p>
                </div>
                <div className="bg-white/10 rounded-xl px-4 py-3 backdrop-blur text-center">
                  <p className="text-xs text-violet-100">Roster Date</p>
                  <p className="text-sm font-bold mt-0.5">{displayDate(currentShift.rosterDate)}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center"><CalendarDays className="w-7 h-7" /></div>
                <div><h2 className="text-xl font-bold">No shift assigned today</h2><p className="text-violet-100 text-sm mt-1">Contact HR if you expected a scheduled shift.</p></div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 overflow-x-auto">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">This Week&apos;s Schedule</h2>
            <div className="grid grid-cols-7 gap-2 min-w-[640px]">
              {weekDays.map((day) => (
                <div key={day.key} className={`flex flex-col items-center rounded-xl p-3 border ${day.isToday ? 'bg-violet-50 border-violet-400' : 'bg-gray-50 border-gray-100'}`}>
                  <p className={`text-[11px] font-bold uppercase ${day.isToday ? 'text-violet-700' : 'text-gray-400'}`}>{day.dayName}</p>
                  <p className={`text-lg font-bold mt-0.5 ${day.isToday ? 'text-violet-700' : 'text-gray-700'}`}>{day.date}</p>
                  <p className="text-[9px] text-gray-400">{day.month}</p>
                  {day.assignment ? <span className="mt-2 max-w-full truncate text-[9px] font-bold text-violet-700 bg-violet-100 px-1.5 py-0.5 rounded-full" title={day.assignment.shiftName}>{displayTime(day.assignment.startTime)}</span> : <span className="text-[9px] text-gray-400 mt-2">Off</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <DataCard title="Recent Assignments" empty="No shift assignments found in the last 90 days.">
              {history.map((assignment) => {
                const state = assignment.rosterDate === todayKey ? 'active' : 'past';
                const style = statusStyle[state];
                return <div key={assignment.id || assignment.rosterDate} className="flex items-start gap-3 px-5 py-4 border-b border-gray-50 last:border-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${state === 'active' ? 'bg-violet-600' : 'bg-gray-100'}`}><Clock className={`w-4 h-4 ${state === 'active' ? 'text-white' : 'text-gray-500'}`} /></div>
                  <div className="flex-1"><div className="flex justify-between gap-2"><p className="text-sm font-semibold text-gray-800">{assignment.shiftName}</p><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${style.bg} ${style.text}`}>{state}</span></div><p className="text-xs text-gray-500 mt-0.5">{displayTime(assignment.startTime)} – {displayTime(assignment.endTime)}</p><p className="text-[11px] text-gray-400 mt-0.5">{displayDate(assignment.rosterDate)}</p></div>
                </div>;
              })}
            </DataCard>

            <DataCard title="Shift Change Requests" empty="No shift change requests submitted.">
              {requests.map((request) => {
                const style = statusStyle[request.status] || statusStyle.submitted;
                return <div key={request.id} className="px-5 py-4 border-b border-gray-50 last:border-0"><div className="flex items-center justify-between mb-2"><span className="text-xs font-bold text-gray-400 font-mono">SHR-{String(request.id).padStart(3, '0')}</span><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${style.bg} ${style.text}`}>{request.status === 'submitted' ? 'pending' : request.status}</span></div><div className="mb-1.5"><span className="text-xs font-medium bg-violet-100 text-violet-700 px-2 py-0.5 rounded">{request.shiftTypeName}</span></div><p className="text-xs text-gray-400">{displayDate(request.fromDate)} – {displayDate(request.toDate)}{request.comment ? ` · “${request.comment}”` : ''}</p>{request.rejectionReason && <p className="text-xs text-red-500 mt-1">Reason: {request.rejectionReason}</p>}</div>;
              })}
            </DataCard>
          </div>
        </>
      )}

      {showModal && <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => !submitting && setShowModal(false)}><div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-center justify-between mb-5"><h2 className="text-base font-bold text-gray-900">Request Shift Change</h2><button disabled={submitting} onClick={() => setShowModal(false)} className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center"><X className="w-4 h-4 text-gray-500" /></button></div><form onSubmit={handleSubmit} className="space-y-4"><div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Current Shift</label><input value={currentShift?.shiftName || 'No shift assigned today'} disabled className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500" /></div><div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Requested Shift *</label><select required value={form.shiftTypeId} onChange={(event) => setForm({ ...form, shiftTypeId: event.target.value })} className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm"><option value="">Select shift</option>{shiftTypes.map((shift) => <option key={shift.id} value={shift.id}>{shift.name} ({displayTime(shift.startTime)} – {displayTime(shift.endTime)})</option>)}</select></div><div className="grid grid-cols-2 gap-3"><div><label className="block text-xs font-semibold text-gray-600 mb-1.5">From *</label><input required type="date" min={todayKey} value={form.fromDate} onChange={(event) => setForm({ ...form, fromDate: event.target.value, toDate: form.toDate && form.toDate < event.target.value ? event.target.value : form.toDate })} className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm" /></div><div><label className="block text-xs font-semibold text-gray-600 mb-1.5">To *</label><input required type="date" min={form.fromDate || todayKey} value={form.toDate} onChange={(event) => setForm({ ...form, toDate: event.target.value })} className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm" /></div></div><div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Reason</label><textarea rows={3} value={form.comment} onChange={(event) => setForm({ ...form, comment: event.target.value })} placeholder="Describe the reason for the shift change" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm resize-none" /></div><div className="flex gap-3 pt-1"><button type="button" disabled={submitting} onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl">Cancel</button><button type="submit" disabled={submitting} className="flex-1 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl disabled:opacity-50">{submitting ? <span className="inline-flex items-center gap-2"><Loader2 size={15} className="animate-spin" />Submitting</span> : 'Submit Request'}</button></div></form></div></div>}
    </div>
  );
}

function DataCard({ title, empty, children }) {
  const items = React.Children.toArray(children);
  return <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"><div className="px-5 py-4 border-b border-gray-100"><h2 className="text-sm font-semibold text-gray-900">{title}</h2></div>{items.length ? <div>{items}</div> : <p className="px-5 py-10 text-center text-sm text-gray-400">{empty}</p>}</div>;
}
