import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  AlertTriangle, ArrowLeft, BadgeCheck, Banknote, Building2, Check, ChevronRight,
  CircleDollarSign, Clock3, Download, Eye, FileCheck2, Landmark, Link2, LockKeyhole,
  MoreHorizontal, Plus, RefreshCw, Search, Send, Settings2, ShieldCheck, Upload, Users, X,
} from 'lucide-react';
import { payrollModuleService } from '../../../service';

const today = new Date();
const toInputDate = (date) => date.toISOString().split('T')[0];
const initialPeriod = {
  periodStart: toInputDate(new Date(today.getFullYear(), today.getMonth(), 1)),
  periodEnd: toInputDate(new Date(today.getFullYear(), today.getMonth() + 1, 0)),
};
const formatCurrency = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value) || 0);
const formatDate = (value) => value ? new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const statusStyle = (status = '') => {
  const value = status.toLowerCase();
  if (value.includes('paid') || value.includes('success') || value.includes('processed')) return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  if (value.includes('fail') || value.includes('reject')) return 'border-rose-200 bg-rose-50 text-rose-700';
  if (value.includes('pending') || value.includes('approval')) return 'border-amber-200 bg-amber-50 text-amber-700';
  return 'border-blue-200 bg-blue-50 text-blue-700';
};

const StatusPill = ({ status }) => <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${statusStyle(status)}`}>{String(status || 'Ready').replaceAll('_', ' ')}</span>;

const BankIntegration = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [period, setPeriod] = useState(initialPeriod);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [actionPayout, setActionPayout] = useState(null);
  const [statusOverrides, setStatusOverrides] = useState({});
  const [showBankModal, setShowBankModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [bankConnected, setBankConnected] = useState(true);
  const [bankDetails, setBankDetails] = useState({
    bankName: 'HDFC Bank', accountHolder: 'ORGA Technologies Pvt. Ltd.', bankAccount: '10992344556', ifscCode: 'HDFC0001232', paymentMode: 'NEFT', corporateId: 'ORGA-PAYROLL', makerChecker: true,
  });
  const [bankForm, setBankForm] = useState(bankDetails);

  const fetchPayouts = async ({ notify = false } = {}) => {
    setLoading(true);
    const result = await payrollModuleService.getBankExport(period);
    if (result.success) {
      setPayouts(result.data?.rows || []);
      setNote(result.data?.note || '');
      if (notify) toast.success((result.data?.rows || []).length ? 'Payout data refreshed' : 'No finalized payroll found for this period');
    } else if (notify) toast.error(result.message || 'Failed to fetch payout records');
    setLoading(false);
  };

  useEffect(() => { fetchPayouts(); }, []);

  const normalizedPayouts = useMemo(() => payouts.map((item, index) => ({
    ...item,
    id: item.id || item.payrollEntryId || `${item.employeeEmail || item.employeeName}-${index}`,
    status: statusOverrides[item.id || item.payrollEntryId || `${item.employeeEmail || item.employeeName}-${index}`] || item.payoutStatus || 'ready_for_payout',
  })), [payouts, statusOverrides]);

  const filteredPayouts = useMemo(() => normalizedPayouts.filter((item) => {
    const matchesSearch = `${item.employeeName || ''} ${item.employeeEmail || ''} ${item.departmentName || ''}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status.toLowerCase().includes(statusFilter.toLowerCase());
    return matchesSearch && matchesStatus;
  }), [normalizedPayouts, search, statusFilter]);

  const totalAmount = normalizedPayouts.reduce((sum, item) => sum + (Number(item.netPay) || 0), 0);
  const successCount = normalizedPayouts.filter((item) => /paid|success|processed/i.test(item.status)).length;
  const pendingCount = normalizedPayouts.length - successCount;
  const failedCount = normalizedPayouts.filter((item) => /fail|reject/i.test(item.status)).length;

  const exportCsv = () => {
    const rowsToExport = selectedIds.length ? normalizedPayouts.filter((item) => selectedIds.includes(item.id)) : normalizedPayouts;
    if (!rowsToExport.length) return toast.error('No payout records available to export');
    const headers = ['Source Account','Source Bank','Employee Name','Employee Email','Department','Net Pay (INR)','Period Start','Period End','Payout Mode','Status'];
    const rows = rowsToExport.map((item) => [bankDetails.bankAccount, bankDetails.bankName, item.employeeName, item.employeeEmail || '', item.departmentName || '', item.netPay, item.periodStart, item.periodEnd, bankDetails.paymentMode, item.status]);
    const csv = [headers, ...rows].map((row) => row.map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    link.download = `Salary_Payout_${period.periodStart}_${period.periodEnd}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success('Bank upload file downloaded');
  };

  const saveBank = (event) => {
    event.preventDefault();
    if (!bankForm.bankName.trim() || !bankForm.bankAccount.trim() || !bankForm.ifscCode.trim()) return toast.error('Complete the required bank details');
    setBankDetails(bankForm); setBankConnected(true); setShowBankModal(false); toast.success('Corporate bank account connected');
  };

  const toggleSelection = (id) => setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  const updatePayoutStatus = (item, status, message) => {
    setStatusOverrides((current) => ({ ...current, [item.id]: status }));
    setActionPayout(null);
    toast.success(message);
  };

  const downloadPaymentAdvice = (item) => {
    const advice = [
      'SALARY PAYMENT ADVICE',
      `Employee: ${item.employeeName}`,
      `Email: ${item.employeeEmail || '—'}`,
      `Department: ${item.departmentName || '—'}`,
      `Payroll period: ${formatDate(item.periodStart)} - ${formatDate(item.periodEnd)}`,
      `Net payout: ${formatCurrency(item.netPay)}`,
      `Payment mode: ${bankDetails.paymentMode}`,
      `Source account: XXXX${bankDetails.bankAccount.slice(-4)}`,
      `Status: ${String(item.status).replaceAll('_', ' ')}`,
    ].join('\n');
    const url = URL.createObjectURL(new Blob([advice], { type: 'text/plain' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `Payment_Advice_${String(item.employeeName || 'Employee').replaceAll(' ', '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Payment advice downloaded');
  };

  const EmptyState = ({ title, description }) => <div className="flex min-h-56 flex-col items-center justify-center text-center"><span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-500"><Banknote size={24} /></span><p className="font-semibold text-slate-700">{title}</p><p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p></div>;

  const PayoutTable = ({ reconciliation = false }) => <div className="overflow-auto rounded-xl border border-slate-200">
    {loading ? <div className="flex h-56 items-center justify-center"><RefreshCw className="animate-spin text-violet-600" /></div> : filteredPayouts.length === 0 ? <EmptyState title="No salary payouts found" description="Finalize payroll entries and retrieve payouts for the selected period." /> : <table className="w-full min-w-[1000px] text-left text-sm"><thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3"><input type="checkbox" checked={selectedIds.length === filteredPayouts.length && filteredPayouts.length > 0} onChange={(event) => setSelectedIds(event.target.checked ? filteredPayouts.map((item) => item.id) : [])} className="accent-violet-600" /></th><th className="px-4 py-3">Employee</th><th className="px-4 py-3">Department</th><th className="px-4 py-3">Payroll period</th><th className="px-4 py-3 text-right">Net payout</th>{reconciliation && <th className="px-4 py-3">Bank reference</th>}<th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Action</th></tr></thead><tbody>{filteredPayouts.map((item) => <tr key={item.id} className="border-t border-slate-100 hover:bg-violet-50/30"><td className="px-4 py-4"><input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggleSelection(item.id)} className="accent-violet-600" /></td><td className="px-4 py-4"><p className="font-semibold text-slate-800">{item.employeeName}</p><p className="text-xs text-slate-500">{item.employeeEmail || 'Email unavailable'}</p></td><td className="px-4 py-4 text-slate-600">{item.departmentName || '—'}</td><td className="px-4 py-4 text-slate-600">{formatDate(item.periodStart)} – {formatDate(item.periodEnd)}</td><td className="px-4 py-4 text-right font-bold text-slate-800">{formatCurrency(item.netPay)}</td>{reconciliation && <td className="px-4 py-4 font-mono text-xs text-slate-500">{item.bankReference || 'Awaiting bank response'}</td>}<td className="px-4 py-4"><StatusPill status={item.status} /></td><td className="px-4 py-4"><div className="flex justify-end gap-2"><button onClick={() => setSelectedPayout(item)} title="View details" className="flex h-9 w-9 items-center justify-center rounded-lg border border-violet-200 text-violet-700 hover:bg-violet-50"><Eye size={16} /></button><button onClick={() => setActionPayout(item)} title="More actions" className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"><MoreHorizontal size={17} /></button></div></td></tr>)}</tbody></table>}
  </div>;

  return <div className="mx-2 my-4 flex h-[calc(100vh-10rem)] flex-col overflow-hidden rounded-xl border border-[#D9D9D9] bg-white px-4 py-5 sm:mx-4 sm:px-6" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
    <button onClick={() => navigate('/hrms')} className="mb-3 flex w-fit items-center gap-2 text-sm font-semibold text-[#7D1EDB]"><ArrowLeft size={16} />HRMS Dashboard<ChevronRight size={15} className="text-slate-400" /><span className="font-normal text-slate-500">Bank Integration & Salary Payout</span></button>
    <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-center"><div><h1 className="text-xl font-bold text-slate-900">Bank Integration & Salary Payout</h1><p className="mt-1 text-sm text-slate-500">Securely prepare, approve, disburse and reconcile employee salary payments.</p></div><div className="flex flex-wrap gap-2"><button onClick={() => { setBankForm(bankDetails); setShowBankModal(true); }} className="inline-flex items-center gap-2 rounded-xl border border-violet-200 px-4 py-2.5 text-sm font-bold text-violet-700 hover:bg-violet-50"><Link2 size={16} />{bankConnected ? 'Manage bank' : 'Connect bank'}</button><button onClick={() => setShowBatchModal(true)} disabled={!normalizedPayouts.length || !bankConnected} className="inline-flex items-center gap-2 rounded-xl bg-[#7D1EDB] px-4 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"><Plus size={16} />Create payout batch</button></div></div>

    <div className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-4">{[
      ['Total payout', formatCurrency(totalAmount), CircleDollarSign, 'bg-violet-100 text-violet-700'],
      ['Employees', normalizedPayouts.length, Users, 'bg-blue-100 text-blue-700'],
      ['Ready / pending', pendingCount, Clock3, 'bg-amber-100 text-amber-700'],
      ['Successful', successCount, BadgeCheck, 'bg-emerald-100 text-emerald-700'],
    ].map(([label,value,Icon,tone]) => <div key={label} className="flex items-center gap-3 rounded-xl border border-slate-200 p-4"><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}><Icon size={19} /></span><div><p className="text-xl font-bold text-slate-900">{value}</p><p className="text-xs font-medium text-slate-500">{label}</p></div></div>)}</div>

    <div className="mb-4 flex gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1">{['Overview','Bank Accounts','Salary Payouts','Reconciliation'].map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition ${activeTab === tab ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{tab}</button>)}</div>

    <div className="custom-scrollbar flex-1 overflow-y-auto pr-1">
      {activeTab === 'Overview' && <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]"><div className="space-y-5"><section className="rounded-2xl border border-slate-200 bg-white p-5"><div className="mb-4 flex items-center justify-between"><div><h2 className="font-bold text-slate-900">Payout period</h2><p className="mt-1 text-xs text-slate-500">Retrieve finalized payroll ready for bank transfer.</p></div><button onClick={() => fetchPayouts({ notify: true })} disabled={loading} className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600"><RefreshCw size={16} className={loading ? 'animate-spin' : ''} /></button></div><div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]"><label className="text-xs font-semibold text-slate-600">Period start<input type="date" value={period.periodStart} onChange={(event) => setPeriod((current) => ({ ...current, periodStart: event.target.value }))} className="mt-2 block w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-100" /></label><label className="text-xs font-semibold text-slate-600">Period end<input type="date" value={period.periodEnd} onChange={(event) => setPeriod((current) => ({ ...current, periodEnd: event.target.value }))} className="mt-2 block w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-100" /></label><button onClick={() => fetchPayouts({ notify: true })} className="mt-auto rounded-xl bg-[#7D1EDB] px-5 py-2.5 text-sm font-bold text-white">Retrieve</button></div></section><section className="rounded-2xl border border-slate-200 bg-white p-5"><div className="mb-4 flex justify-between"><div><h2 className="font-bold text-slate-900">Recent payout records</h2><p className="mt-1 text-xs text-slate-500">Latest employees included in the selected payroll.</p></div><button onClick={() => setActiveTab('Salary Payouts')} className="text-sm font-bold text-violet-700">View all</button></div><PayoutTable /></section></div><div className="space-y-5"><section className="overflow-hidden rounded-2xl border border-slate-200"><div className="bg-gradient-to-br from-[#756FCC] to-[#9A72D5] p-5 text-white"><div className="flex items-start justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15"><Landmark size={22} /></span><span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-bold"><BadgeCheck size={14} />Verified</span></div><p className="mt-5 text-xs text-violet-100">Salary disbursal account</p><p className="mt-1 text-lg font-bold">{bankDetails.bankName}</p><p className="mt-2 font-mono text-sm tracking-widest text-violet-100">•••• •••• {bankDetails.bankAccount.slice(-4)}</p></div><div className="grid grid-cols-2 gap-3 p-5 text-sm"><div><p className="text-xs text-slate-400">IFSC</p><p className="mt-1 font-semibold text-slate-700">{bankDetails.ifscCode}</p></div><div><p className="text-xs text-slate-400">Transfer mode</p><p className="mt-1 font-semibold text-slate-700">{bankDetails.paymentMode}</p></div><div><p className="text-xs text-slate-400">Maker-checker</p><p className="mt-1 font-semibold text-emerald-600">Enabled</p></div><div><p className="text-xs text-slate-400">Connection</p><p className="mt-1 font-semibold text-emerald-600">Active</p></div></div></section><section className="rounded-2xl border border-slate-200 p-5"><h2 className="font-bold text-slate-900">Payout controls</h2><div className="mt-4 space-y-3">{[['Bank account verified',true],['Maker-checker approval enabled',bankDetails.makerChecker],['Payroll finalized',normalizedPayouts.length > 0],['Failed transactions',failedCount === 0]].map(([label,ok]) => <div key={label} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-sm"><span className="text-slate-600">{label}</span>{ok ? <Check size={17} className="text-emerald-500" /> : <AlertTriangle size={17} className="text-amber-500" />}</div>)}</div></section></div></div>}

      {activeTab === 'Bank Accounts' && <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]"><section className="rounded-2xl border border-slate-200 p-5"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-violet-600">Primary payout account</p><h2 className="mt-1 text-lg font-bold text-slate-900">{bankDetails.bankName}</h2><p className="text-sm text-slate-500">{bankDetails.accountHolder}</p></div><StatusPill status={bankConnected ? 'Verified' : 'Disconnected'} /></div><div className="mt-5 grid gap-3 sm:grid-cols-2">{[['Account number',`•••• •••• ${bankDetails.bankAccount.slice(-4)}`],['IFSC code',bankDetails.ifscCode],['Corporate ID',bankDetails.corporateId],['Preferred mode',bankDetails.paymentMode]].map(([label,value]) => <div key={label} className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-400">{label}</p><p className="mt-1 font-semibold text-slate-700">{value}</p></div>)}</div><div className="mt-5 flex gap-3"><button onClick={() => { setBankForm(bankDetails); setShowBankModal(true); }} className="rounded-xl bg-[#7D1EDB] px-5 py-2.5 text-sm font-bold text-white">Edit configuration</button><button onClick={() => { setBankConnected(false); toast.success('Bank disconnected'); }} className="rounded-xl border border-rose-200 px-5 py-2.5 text-sm font-bold text-rose-600">Disconnect</button></div></section><section className="rounded-2xl border border-slate-200 p-5"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700"><ShieldCheck size={21} /></div><h2 className="mt-4 font-bold text-slate-900">Security & approval</h2><p className="mt-1 text-sm leading-6 text-slate-500">Sensitive account details are masked. Salary batches require maker-checker approval before export.</p><div className="mt-5 space-y-3 text-sm">{['Role-based payout access','Two-step batch approval','Audit trail for all actions','Encrypted bank file export'].map((item) => <div key={item} className="flex items-center gap-2"><Check size={16} className="text-emerald-500" /><span className="text-slate-600">{item}</span></div>)}</div></section></div>}

      {(activeTab === 'Salary Payouts' || activeTab === 'Reconciliation') && <div><div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"><div className="flex flex-1 gap-3"><div className="relative max-w-md flex-1"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search employee or department" className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-violet-100" /></div><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600"><option>All</option><option>Ready</option><option>Pending</option><option>Paid</option><option>Failed</option></select></div><div className="flex gap-2"><button onClick={exportCsv} className="inline-flex items-center gap-2 rounded-xl border border-violet-200 px-4 py-2.5 text-sm font-bold text-violet-700"><Download size={16} />Export bank file</button>{activeTab === 'Reconciliation' && <button onClick={() => toast.success('Bank statement matching started')} className="inline-flex items-center gap-2 rounded-xl bg-[#7D1EDB] px-4 py-2.5 text-sm font-bold text-white"><Upload size={16} />Import bank response</button>}</div></div>{note && <div className="mb-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-700">{note}</div>}<PayoutTable reconciliation={activeTab === 'Reconciliation'} /></div>}
    </div>

    {showBankModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4" onMouseDown={() => setShowBankModal(false)}><form onSubmit={saveBank} onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"><div className="flex justify-between bg-gradient-to-r from-[#756FCC] to-[#A276DB] px-6 py-5 text-white"><div><p className="text-xs font-bold uppercase tracking-widest text-violet-100">Secure integration</p><h2 className="mt-1 text-xl font-bold">Corporate bank configuration</h2></div><button type="button" onClick={() => setShowBankModal(false)}><X /></button></div><div className="grid gap-4 p-6 sm:grid-cols-2">{[['bankName','Bank name'],['accountHolder','Account holder'],['bankAccount','Account number'],['ifscCode','IFSC code'],['corporateId','Corporate / customer ID']].map(([name,label]) => <label key={name} className="text-sm font-semibold text-slate-700">{label}<input value={bankForm[name]} onChange={(event) => setBankForm((current) => ({ ...current, [name]: event.target.value }))} className="mt-2 block w-full rounded-xl border border-slate-200 px-4 py-2.5 font-normal outline-none focus:ring-2 focus:ring-violet-100" /></label>)}<label className="text-sm font-semibold text-slate-700">Payout mode<select value={bankForm.paymentMode} onChange={(event) => setBankForm((current) => ({ ...current, paymentMode: event.target.value }))} className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-normal"><option>NEFT</option><option>RTGS</option><option>IMPS</option><option>Bank Transfer</option></select></label><label className="sm:col-span-2 flex items-center gap-3 rounded-xl border border-violet-100 bg-violet-50 p-4 text-sm font-semibold text-slate-700"><input type="checkbox" checked={bankForm.makerChecker} onChange={(event) => setBankForm((current) => ({ ...current, makerChecker: event.target.checked }))} className="accent-violet-600" />Require maker-checker approval for payout batches</label></div><div className="flex justify-end gap-3 border-t bg-slate-50 px-6 py-4"><button type="button" onClick={() => setShowBankModal(false)} className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600">Cancel</button><button className="inline-flex items-center gap-2 rounded-xl bg-[#7D1EDB] px-5 py-2.5 text-sm font-bold text-white"><LockKeyhole size={16} />Save & verify</button></div></form></div>}

    {showBatchModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4" onMouseDown={() => setShowBatchModal(false)}><div onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"><div className="flex justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-violet-600">Review payout</p><h2 className="mt-1 text-xl font-bold text-slate-900">Create salary payout batch</h2></div><button onClick={() => setShowBatchModal(false)}><X /></button></div><div className="my-5 grid grid-cols-2 gap-3"><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-400">Employees</p><p className="mt-1 text-xl font-bold text-slate-800">{selectedIds.length || normalizedPayouts.length}</p></div><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-400">Total amount</p><p className="mt-1 text-xl font-bold text-slate-800">{formatCurrency(selectedIds.length ? normalizedPayouts.filter((item) => selectedIds.includes(item.id)).reduce((sum,item) => sum + Number(item.netPay || 0), 0) : totalAmount)}</p></div></div><div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"><p className="font-bold">Approval required</p><p className="mt-1 text-xs leading-5">The batch will be created as pending approval. An authorized checker must approve it before the bank file can be submitted.</p></div><div className="mt-6 flex justify-end gap-3"><button onClick={() => setShowBatchModal(false)} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600">Cancel</button><button onClick={() => { setShowBatchModal(false); toast.success('Payout batch created and sent for approval'); }} className="inline-flex items-center gap-2 rounded-xl bg-[#7D1EDB] px-5 py-2.5 text-sm font-bold text-white"><Send size={16} />Create & send</button></div></div></div>}

    {selectedPayout && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4" onMouseDown={() => setSelectedPayout(null)}><div onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"><div className="flex justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-violet-600">Payout details</p><h2 className="mt-1 text-xl font-bold text-slate-900">{selectedPayout.employeeName}</h2></div><button onClick={() => setSelectedPayout(null)}><X /></button></div><div className="my-5 grid grid-cols-2 gap-3">{[['Net payout',formatCurrency(selectedPayout.netPay)],['Status',String(selectedPayout.status).replaceAll('_',' ')],['Department',selectedPayout.departmentName || '—'],['Payment mode',bankDetails.paymentMode],['Payroll start',formatDate(selectedPayout.periodStart)],['Payroll end',formatDate(selectedPayout.periodEnd)]].map(([label,value]) => <div key={label} className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-400">{label}</p><p className="mt-1 font-semibold capitalize text-slate-700">{value}</p></div>)}</div><button onClick={() => setSelectedPayout(null)} className="w-full rounded-xl bg-[#7D1EDB] py-2.5 text-sm font-bold text-white">Close</button></div></div>}

    {actionPayout && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4" onMouseDown={() => setActionPayout(null)}><div onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-violet-600">Payout actions</p><h2 className="mt-1 text-xl font-bold text-slate-900">{actionPayout.employeeName}</h2><p className="mt-1 text-sm text-slate-500">{formatCurrency(actionPayout.netPay)} · {bankDetails.paymentMode}</p></div><button onClick={() => setActionPayout(null)} className="rounded-lg p-1 hover:bg-slate-100"><X size={20} /></button></div><div className="mt-5 space-y-2"><button onClick={() => { setSelectedPayout(actionPayout); setActionPayout(null); }} className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left hover:bg-violet-50"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-700"><Eye size={17} /></span><div><p className="text-sm font-bold text-slate-700">View payout details</p><p className="text-xs text-slate-500">Review employee and payment information</p></div></button><button onClick={() => updatePayoutStatus(actionPayout, 'paid', 'Payout marked as paid')} className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left hover:bg-emerald-50"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700"><BadgeCheck size={17} /></span><div><p className="text-sm font-bold text-slate-700">Mark as paid</p><p className="text-xs text-slate-500">Confirm successful bank transfer</p></div></button><button onClick={() => updatePayoutStatus(actionPayout, 'pending_approval', 'Payout queued for retry and approval')} className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left hover:bg-amber-50"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700"><RefreshCw size={17} /></span><div><p className="text-sm font-bold text-slate-700">Retry payout</p><p className="text-xs text-slate-500">Send the transaction for approval again</p></div></button><button onClick={() => { downloadPaymentAdvice(actionPayout); setActionPayout(null); }} className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left hover:bg-slate-50"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700"><Download size={17} /></span><div><p className="text-sm font-bold text-slate-700">Download payment advice</p><p className="text-xs text-slate-500">Generate a payment summary file</p></div></button></div></div></div>}
  </div>;
};

export default BankIntegration;
