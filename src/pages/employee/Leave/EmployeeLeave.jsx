import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  BadgeCheck,
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
  RefreshCw,
  Send,
  Sparkles,
  Wallet,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  authService,
  leaveManagementService,
} from '../../../service';

const STATUS_META = {
  pending: {
    label: 'Pending',
    tone: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: Clock3,
  },
  submitted: {
    label: 'Pending',
    tone: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: Clock3,
  },
  approved: {
    label: 'Approved',
    tone: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: CheckCircle2,
  },
  rejected: {
    label: 'Rejected',
    tone: 'bg-rose-100 text-rose-700 border-rose-200',
    icon: AlertCircle,
  },
  paid: {
    label: 'Paid',
    tone: 'bg-sky-100 text-sky-700 border-sky-200',
    icon: BadgeCheck,
  },
};

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const normalizeEncashmentRequest = (item) => {
  const source = item?.request || item?.encashment || item?.data || item || {};
  const employee = source.employee || item?.employee || source.user || item?.user || {};
  const rawStatus = String(
    source.status ||
      item?.status ||
      source.requestStatus ||
      source.approvalStatus ||
      'pending',
  ).toLowerCase();

  return {
    id: source.id || item?.id || source._id || '',
    empId: source.empId || item?.empId || employee.id || employee.userId || '',
    empName: employee.name || source.empName || item?.empName || '—',
    empEmail: employee.email || source.empEmail || item?.empEmail || '',
    leaveType: source.leaveType || item?.leaveType || source.leaveTypeName || item?.leaveTypeName || '',
    leaveTypeName: source.leaveTypeName || item?.leaveTypeName || source.leaveType || item?.leaveType || '',
    daysRequested: Number(source.daysRequested || source.requestedDays || source.days || item?.daysRequested || item?.days || 0),
    dailyRate: Number(source.dailyRate || item?.dailyRate || 0),
    amount: Number(source.amount || item?.amount || 0),
    requestDate: source.createdAt || item?.createdAt || source.requestDate || item?.requestDate || '',
    remarks: source.remarks || item?.remarks || '',
    adminRemarks: source.adminRemarks || item?.adminRemarks || source.rejectionReason || item?.rejectionReason || '',
    status: rawStatus,
    raw: source,
  };
};

const EmployeeLeave = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submittingAll, setSubmittingAll] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const [employee, setEmployee] = useState(null);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [requests, setRequests] = useState([]);
  const [dailyRate, setDailyRate] = useState(0);

  const [form, setForm] = useState({
    leaveTypeId: '',
    days: 1,
  });

  const loadData = useCallback(async ({ quiet = false } = {}) => {
    if (!quiet) setLoading(true);
    setError('');

    try {
      const profileRes = await authService.getProfile();
      const storedUser = JSON.parse(localStorage.getItem('userData') || '{}');
      const profileUser = profileRes.success ? (profileRes.data?.user || profileRes.data || storedUser) : storedUser;
      const userId = profileUser?.id || profileUser?._id;

      if (!userId) {
        setError('We could not identify your account. Please log in again.');
        return;
      }

      setEmployee(profileUser);

      const [eligibilityRes, requestsRes] = await Promise.all([
        leaveManagementService.getEncashmentEligibility(),
        leaveManagementService.getEncashmentRequests({ empId: userId }),
      ]);

      if (eligibilityRes.success) {
        const eligibility = eligibilityRes.data || {};
        const eligibleTypes = Array.isArray(eligibility.leaveTypes) ? eligibility.leaveTypes : [];
        setLeaveTypes(eligibleTypes.map((type) => ({
          id: type.leaveTypeId,
          name: type.leaveTypeName,
          requestType: type.code || type.leaveTypeName,
          encashable: true,
          availableDays: Number(type.availableToEncash || 0),
          allocatedDays: Number(type.allocatedDays || 0),
          usedDays: Number(type.usedDays || 0),
          unusedDays: Number(type.unusedDays || 0),
          pendingDays: Number(type.pendingEncashmentDays || 0),
          maximumAmount: Number(type.maximumAmount || 0),
        })));
        setDailyRate(Number(eligibility.dailyRate || 0));
      } else {
        setLeaveTypes([]);
        setDailyRate(0);
        setError(eligibilityRes.message || 'Leave encashment eligibility is unavailable.');
      }

      if (requestsRes.success) {
        const list = Array.isArray(requestsRes.data) ? requestsRes.data : [];
        const normalizedRequests = list.map(normalizeEncashmentRequest);
        setRequests(
          normalizedRequests.filter((request) => String(request.empId) === String(userId)),
        );
      } else {
        setRequests([]);
      }

    } catch (err) {
      console.error(err);
      setError('Something went wrong while loading leave encashment data.');
    } finally {
      if (!quiet) setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const encashableTypes = useMemo(() => {
    const filtered = leaveTypes.filter((type) => type.encashable !== false);
    return filtered.length > 0 ? filtered : leaveTypes;
  }, [leaveTypes]);

  const balanceRows = encashableTypes;

  const selectedType = useMemo(
    () => encashableTypes.find((type) => String(type.id) === String(form.leaveTypeId)) || encashableTypes[0] || null,
    [encashableTypes, form.leaveTypeId],
  );

  const selectedTypeBalance = useMemo(
    () => balanceRows.find((row) => String(row.id) === String(selectedType?.id)) || null,
    [balanceRows, selectedType],
  );

  const availableEncashableDays = useMemo(() => {
    const total = balanceRows.reduce((sum, row) => sum + Math.max(0, Number(row.availableDays || 0)), 0);
    return total;
  }, [balanceRows]);

  const pendingRequestsCount = useMemo(
    () => requests.filter((req) => ['pending', 'submitted'].includes(req.status)).length,
    [requests],
  );

  const approvedEncashmentAmount = useMemo(
    () => requests
      .filter((req) => ['approved', 'paid'].includes(req.status))
      .reduce((sum, req) => sum + Number(req.amount || 0), 0),
    [requests],
  );

  const requestedAmount = useMemo(() => {
    const days = Math.max(0, Number(form.days || 0));
    return days * Math.max(0, Number(dailyRate || 0));
  }, [dailyRate, form.days]);

  const selectedTypeAvailability = selectedTypeBalance?.availableDays ?? 0;

  useEffect(() => {
    if (!form.leaveTypeId && encashableTypes.length > 0) {
      setForm((prev) => ({ ...prev, leaveTypeId: String(encashableTypes[0].id) }));
    }
  }, [encashableTypes, form.leaveTypeId]);

  useEffect(() => {
    if (!selectedType) return;
    setForm((prev) => ({
      ...prev,
      days: Math.max(1, Math.min(Number(prev.days || 1), Math.max(1, Number(selectedTypeAvailability || 0) || 1))),
    }));
  }, [selectedType, selectedTypeAvailability]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData({ quiet: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedType) {
      toast.error('Please choose a leave type.');
      return;
    }

    const days = Number(form.days);
    if (!Number.isFinite(days) || days <= 0) {
      toast.error('Please enter a valid number of days.');
      return;
    }

    if (selectedTypeAvailability <= 0) {
      toast.error('No encashable balance is available for this leave type.');
      return;
    }

    if (days > selectedTypeAvailability) {
      toast.error(`You can only encash up to ${selectedTypeAvailability} day(s) for this leave type.`);
      return;
    }

    if (!dailyRate) {
      toast.error('Daily rate is not available yet. Please refresh or contact HR.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        leaveTypeId: Number(selectedType.id),
        daysRequested: days,
      };

      const res = await leaveManagementService.createEncashmentRequest(payload);
      if (res.success) {
        toast.success(res.message || 'Leave encashment request submitted successfully.');
        setForm((prev) => ({ ...prev, days: 1 }));
        await loadData({ quiet: true });
      } else {
        toast.error(res.message || 'Failed to submit encashment request.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong while submitting your request.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEncashAll = async () => {
    if (availableEncashableDays <= 0) {
      toast.error('No unused encashable leave is currently available.');
      return;
    }
    const confirmed = window.confirm(
      `Submit all ${availableEncashableDays} currently available day(s) for encashment?`,
    );
    if (!confirmed) return;

    setSubmittingAll(true);
    try {
      const res = await leaveManagementService.createEncashAllRequest();
      if (!res.success) {
        toast.error(res.message || 'Failed to submit all available leave.');
        return;
      }
      toast.success(res.message || 'All available leave submitted for encashment.');
      await loadData({ quiet: true });
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong while submitting all available leave.');
    } finally {
      setSubmittingAll(false);
    }
  };

  const summaryCards = [
    {
      label: 'Leave Balance',
      value: `${balanceRows.reduce((sum, row) => sum + Math.max(0, row.availableDays || 0), 0)} days`,
      sub: 'Available across eligible leave types',
      icon: Wallet,
      tone: 'from-violet-500 to-indigo-500',
    },
    {
      label: 'Eligible for Encashment',
      value: `${availableEncashableDays} days`,
      sub: selectedType ? `Focused on ${selectedType.name}` : 'Encashable leave balance',
      icon: Sparkles,
      tone: 'from-emerald-500 to-teal-500',
    },
    {
      label: 'Pending Requests',
      value: String(pendingRequestsCount),
      sub: 'Requests awaiting review',
      icon: Clock3,
      tone: 'from-amber-500 to-orange-500',
    },
    {
      label: 'Approved / Paid',
      value: formatCurrency(approvedEncashmentAmount),
      sub: 'Total approved encashment value',
      icon: BadgeCheck,
      tone: 'from-sky-500 to-cyan-500',
    },
  ];

  const currentUserName = employee?.name || employee?.fullName || 'Employee';
  const currentUserCode = employee?.employeeId || employee?.empId || `EMP${employee?.id || ''}`;
  const currentUserEmail = employee?.email || '';

  return (
    <div className="bg-white px-4 sm:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl min-h-[calc(100vh-10rem)] flex flex-col border border-[#E5E7EB]" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
        <span className="cursor-pointer text-[#7D1EDB]" onClick={() => navigate('/employee')}>
          HRMS Dashboard
        </span>
        <span>›</span>
        <span className="text-[#6B7280]">Leave Encashment</span>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[28px] sm:text-[32px] font-semibold text-[#494949] leading-tight">Leave Encashment</h1>
          <p className="text-sm sm:text-base text-gray-400 mt-1">
            Self-service request flow for encashing eligible leave days.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing || loading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-[#E5E7EB] bg-white text-[#4B5563] hover:bg-gray-50 transition-colors disabled:opacity-60"
        >
          {refreshing ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {summaryCards.map((card) => (
          <div key={card.label} className="rounded-3xl border border-[#EDEDED] bg-white shadow-[0_8px_24px_rgba(125,30,219,0.05)] p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-xs uppercase tracking-[0.18em] text-gray-400 font-semibold">{card.label}</p>
                <p className="mt-3 text-2xl font-bold text-[#1E1E1E]">{card.value}</p>
                <p className="mt-1 text-sm text-gray-500">{card.sub}</p>
              </div>
              <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${card.tone} flex items-center justify-center text-white shadow-lg`}>
                <card.icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr] gap-5">
        <div className="rounded-[28px] border border-[#E8E8E8] bg-white shadow-[0_10px_30px_rgba(17,24,39,0.05)] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl font-semibold text-[#1F2937]">Request Leave Encashment</h2>
              <p className="text-sm text-gray-500 mt-1">Choose an encashable leave type, enter days, and submit your request.</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 rounded-2xl bg-violet-50 px-4 py-3 border border-violet-100">
              <FileText size={18} className="text-violet-600" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-500">Daily Rate</p>
                <p className="text-sm font-bold text-violet-700">{dailyRate ? formatCurrency(dailyRate) : 'Not available'}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[1.15fr_0.85fr] gap-4 mb-5">
            <div className="rounded-2xl border border-[#EEE] bg-[#FAFAFF] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Employee</p>
              <p className="text-lg font-semibold text-[#1E1E1E]">{currentUserName}</p>
              <p className="text-sm text-gray-500 mt-1">{currentUserCode || '—'} {currentUserEmail ? `· ${currentUserEmail}` : ''}</p>
            </div>
            <div className="rounded-2xl border border-[#EEE] bg-[#FAFAFF] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Available Encashable Days</p>
              <p className="text-lg font-semibold text-[#1E1E1E]">{availableEncashableDays} days</p>
              <p className="text-sm text-gray-500 mt-1">Based on your current leave balance</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-[#374151] mb-2">Leave Type *</label>
                <select
                  value={form.leaveTypeId}
                  onChange={(e) => setForm((prev) => ({ ...prev, leaveTypeId: e.target.value }))}
                  className="w-full rounded-2xl border border-[#DDE1E7] bg-white px-4 py-3.5 text-sm text-[#1F2937] outline-none focus:ring-2 focus:ring-violet-100 focus:border-violet-300"
                >
                  {encashableTypes.length === 0 ? (
                    <option value="">No encashable leave types available</option>
                  ) : (
                    encashableTypes.map((type) => (
                      <option key={String(type.id)} value={String(type.id)}>
                        {type.name} {type.availableDays !== undefined ? `(${type.availableDays} available)` : ''}
                      </option>
                    ))
                  )}
                </select>
                <p className="mt-2 text-xs text-gray-500">
                  Only leave types marked encashable by HR are shown here.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#374151] mb-2">Days to Encash *</label>
                <input
                  type="number"
                  min="1"
                  max={Math.max(1, selectedTypeAvailability || 1)}
                  step="1"
                  value={form.days}
                  onChange={(e) => setForm((prev) => ({ ...prev, days: e.target.value }))}
                  className="w-full rounded-2xl border border-[#DDE1E7] bg-white px-4 py-3.5 text-sm text-[#1F2937] outline-none focus:ring-2 focus:ring-violet-100 focus:border-violet-300"
                  placeholder="Enter number of days"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Available for this leave type: {selectedTypeAvailability} day(s)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-[#E9E9F0] bg-[#FCFCFF] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Selected Balance</p>
                <p className="mt-2 text-lg font-bold text-[#1E1E1E]">
                  {selectedTypeBalance ? `${selectedTypeBalance.availableDays} days` : '—'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedType
                    ? `${selectedType.usedDays} used · ${selectedType.pendingDays} pending`
                    : 'Choose a leave type'}
                </p>
              </div>
              <div className="rounded-2xl border border-[#E9E9F0] bg-[#FCFCFF] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Calculated Amount</p>
                <p className="mt-2 text-lg font-bold text-violet-700">{formatCurrency(requestedAmount)}</p>
                <p className="text-xs text-gray-500 mt-1">{formatCurrency(dailyRate)} × {Number(form.days || 0)} day(s)</p>
              </div>
              <div className="rounded-2xl border border-[#E9E9F0] bg-[#FCFCFF] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Request Status</p>
                <p className="mt-2 text-lg font-bold text-[#1E1E1E]">Draft</p>
                <p className="text-xs text-gray-500 mt-1">You can review before submitting</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
              <p className="text-xs text-gray-500">
                {dailyRate
                  ? `The request will be submitted using the current daily rate of ${formatCurrency(dailyRate)}.`
                  : 'Daily rate is not available yet. Please refresh if you expect salary data to be loaded.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={handleEncashAll}
                  disabled={submittingAll || submitting || loading || availableEncashableDays <= 0}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#7D1EDB] bg-white px-5 py-3 text-sm font-semibold text-[#7D1EDB] transition-colors hover:bg-violet-50 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submittingAll ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  Encash All Available
                </button>
                <button
                  type="submit"
                  disabled={submittingAll || submitting || loading || !encashableTypes.length || selectedTypeAvailability <= 0}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#7D1EDB] px-5 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  Submit Request
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="rounded-[28px] border border-[#E8E8E8] bg-white shadow-[0_10px_30px_rgba(17,24,39,0.05)] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl font-semibold text-[#1F2937]">Request History</h2>
              <p className="text-sm text-gray-500 mt-1">Only your submitted encashment requests are shown here.</p>
            </div>
            <div className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
              {requests.length} total
            </div>
          </div>

          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center text-center">
              <Loader2 size={28} className="animate-spin text-violet-600" />
              <p className="mt-3 text-sm text-gray-500">Loading your encashment history...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-600">
                <Wallet size={28} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[#1F2937]">No requests found</h3>
              <p className="mt-2 text-sm text-gray-500 max-w-sm">
                Once you submit a leave encashment request, it will appear here with its current approval status.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-[#ECECEC]">
              <div className="hidden lg:grid grid-cols-[1.1fr_0.9fr_0.7fr_0.9fr_0.9fr_1.2fr] gap-3 bg-[#FAFAFA] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                <div>Leave Type</div>
                <div>Request Date</div>
                <div>Days</div>
                <div>Amount</div>
                <div>Status</div>
                <div>Admin Remarks</div>
              </div>

              <div className="divide-y divide-gray-100">
                {requests.map((req) => {
                  const meta = STATUS_META[req.status] || STATUS_META.pending;
                  const StatusIcon = meta.icon;
                  return (
                    <div key={req.id} className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr_0.7fr_0.9fr_0.9fr_1.2fr] gap-3 px-4 py-4 hover:bg-gray-50 transition-colors">
                      <div>
                        <p className="text-sm font-semibold text-[#1F2937]">{req.leaveTypeName || req.leaveType || '—'}</p>
                        <p className="text-xs text-gray-500 mt-1">{req.empEmail || currentUserEmail || currentUserCode}</p>
                      </div>
                      <div className="text-sm text-gray-600">{formatDate(req.requestDate)}</div>
                      <div className="text-sm text-gray-600">{Number(req.daysRequested || 0)} day(s)</div>
                      <div className="text-sm font-semibold text-violet-700">{formatCurrency(req.amount)}</div>
                      <div>
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${meta.tone}`}>
                          <StatusIcon size={12} />
                          {meta.label}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {req.adminRemarks ? (
                          <span className="line-clamp-2">{req.adminRemarks}</span>
                        ) : (
                          <span className="text-gray-400">No remarks yet</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeLeave;
