import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Download, TrendingUp, DollarSign, FileText, Loader2, RefreshCw, WalletCards } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { payrollModuleService } from '../../../service';

const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

const dateLabel = (value) => {
  if (!value) return '—';
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const monthLabel = (value) => {
  if (!value) return 'Unknown period';
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  if (Number.isNaN(date.getTime())) return 'Unknown period';
  return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
};

const normalizeLine = (line, index) => ({
  id: line?.id ?? line?.code ?? index,
  label: line?.name || line?.componentName || line?.label || line?.code || 'Salary component',
  amount: Number(line?.amount || 0),
});

const normalizeSlip = (item) => {
  const slip = item?.salarySlip || item?.slip || item || {};
  const entry = item?.payrollEntry || {};
  const snapshot = slip.employeeSnapshot || {};
  return {
    id: slip.id,
    slipNumber: slip.slipNumber || `SLIP-${slip.id || ''}`,
    employeeName: snapshot.name || item?.employeeName || 'Employee',
    department: snapshot.department || '',
    salaryStructure: snapshot.salaryStructure || '',
    periodStart: snapshot.periodStart || entry.periodStart || '',
    periodEnd: snapshot.periodEnd || entry.periodEnd || '',
    grossPay: Number(slip.grossPay ?? entry.grossPay ?? 0),
    totalDeductions: Number(slip.totalDeductions ?? entry.totalDeductions ?? 0),
    netPay: Number(slip.netPay ?? entry.netPay ?? 0),
    earnings: (Array.isArray(slip.earnings) ? slip.earnings : []).map(normalizeLine),
    deductions: (Array.isArray(slip.deductions) ? slip.deductions : []).map(normalizeLine),
    status: String(slip.status || 'draft').toLowerCase(),
    finalizedAt: slip.finalizedAt || null,
  };
};

const statusStyle = {
  draft: 'bg-amber-100 text-amber-700',
  finalized: 'bg-emerald-100 text-emerald-700',
  signed_off: 'bg-sky-100 text-sky-700',
};

export default function EmployeePayroll() {
  const [payslips, setPayslips] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadPayslips = useCallback(async ({ quiet = false } = {}) => {
    if (!quiet) setLoading(true);
    setError('');
    try {
      const result = await payrollModuleService.getSalarySlips();
      if (!result.success) {
        setPayslips([]);
        setError(result.message || 'Failed to load salary slips.');
        return;
      }
      const rows = (Array.isArray(result.data) ? result.data : []).map(normalizeSlip);
      setPayslips(rows);
      setSelectedId((current) => rows.some((row) => row.id === current) ? current : rows[0]?.id ?? null);
    } catch (loadError) {
      console.error(loadError);
      setPayslips([]);
      setError('Something went wrong while loading payroll data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(loadPayslips, 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadPayslips]);

  const selectedSlip = useMemo(
    () => payslips.find((slip) => slip.id === selectedId) || payslips[0] || null,
    [payslips, selectedId],
  );

  const summaryCards = [
    {
      label: 'Monthly Gross',
      value: money(selectedSlip?.grossPay),
      sub: selectedSlip ? monthLabel(selectedSlip.periodEnd) : 'No salary slip',
      color: 'bg-violet-100 text-violet-600',
      icon: DollarSign,
    },
    {
      label: 'Net Salary',
      value: money(selectedSlip?.netPay),
      sub: 'After deductions',
      color: 'bg-green-100 text-green-600',
      icon: TrendingUp,
    },
    {
      label: 'Total Deductions',
      value: money(selectedSlip?.totalDeductions),
      sub: selectedSlip ? `${selectedSlip.deductions.length} component(s)` : 'No salary slip',
      color: 'bg-red-100 text-red-500',
      icon: FileText,
    },
    {
      label: 'Annualized Gross',
      value: money((selectedSlip?.grossPay || 0) * 12),
      sub: 'Based on selected month',
      color: 'bg-blue-100 text-blue-600',
      icon: WalletCards,
    },
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPayslips({ quiet: true });
  };

  const downloadPayslip = () => {
    if (!selectedSlip) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Salary Slip', 14, 18);
    doc.setFontSize(10);
    doc.text(`Slip: ${selectedSlip.slipNumber}`, 14, 27);
    doc.text(`Employee: ${selectedSlip.employeeName}`, 14, 33);
    doc.text(`Period: ${dateLabel(selectedSlip.periodStart)} - ${dateLabel(selectedSlip.periodEnd)}`, 14, 39);

    autoTable(doc, {
      startY: 47,
      head: [['Earnings', 'Amount']],
      body: selectedSlip.earnings.map((line) => [line.label, money(line.amount)]),
      foot: [['Gross Pay', money(selectedSlip.grossPay)]],
    });
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 8,
      head: [['Deductions', 'Amount']],
      body: selectedSlip.deductions.map((line) => [line.label, money(line.amount)]),
      foot: [['Total Deductions', money(selectedSlip.totalDeductions)]],
    });
    doc.setFontSize(13);
    doc.text(`Net Pay: ${money(selectedSlip.netPay)}`, 14, doc.lastAutoTable.finalY + 12);
    doc.save(`${selectedSlip.slipNumber}.pdf`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Payroll & Payslips</h1>
          <p className="text-sm text-gray-500 mt-0.5">View your finalized salary details and payslips</p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading || refreshing}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
        >
          {refreshing ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
          Refresh
        </button>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
              <card.icon className="w-4.5 h-4.5" />
            </div>
            <p className="text-xl font-bold text-gray-900">{card.value}</p>
            <p className="text-xs font-medium text-gray-500 mt-0.5">{card.label}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="rounded-2xl border border-gray-100 bg-white py-20 text-center shadow-sm">
          <Loader2 className="mx-auto h-7 w-7 animate-spin text-violet-600" />
          <p className="mt-3 text-sm text-gray-500">Loading payroll data...</p>
        </div>
      ) : !selectedSlip ? (
        <div className="rounded-2xl border border-gray-100 bg-white py-20 text-center shadow-sm">
          <FileText className="mx-auto h-9 w-9 text-gray-300" />
          <h2 className="mt-3 text-base font-semibold text-gray-800">No salary slips available</h2>
          <p className="mt-1 text-sm text-gray-500">A payslip will appear after HR finalizes your payroll.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">Payslip History</h2>
              <p className="mt-0.5 text-xs text-gray-400">{payslips.length} record(s)</p>
            </div>
            <div className="divide-y divide-gray-50 max-h-[520px] overflow-y-auto">
              {payslips.map((slip) => (
                <button
                  type="button"
                  key={slip.id}
                  onClick={() => setSelectedId(slip.id)}
                  className={`w-full px-5 py-3.5 flex items-center justify-between text-left transition-all ${selectedSlip.id === slip.id ? 'bg-violet-50 border-l-2 border-violet-500' : 'hover:bg-gray-50'}`}
                >
                  <div>
                    <p className={`text-sm font-semibold ${selectedSlip.id === slip.id ? 'text-violet-700' : 'text-gray-800'}`}>{monthLabel(slip.periodEnd)}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{dateLabel(slip.periodEnd)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-bold text-gray-700">{money(slip.netPay)}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${statusStyle[slip.status] || 'bg-gray-100 text-gray-600'}`}>
                      {slip.status.replace('_', ' ')}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Salary Breakdown</h2>
                <p className="text-xs text-gray-400 mt-0.5">{monthLabel(selectedSlip.periodEnd)} · {selectedSlip.slipNumber}</p>
              </div>
              <button onClick={downloadPayslip} className="flex items-center gap-1.5 px-3.5 py-2 bg-violet-600 text-white text-xs font-semibold rounded-lg hover:bg-violet-700">
                <Download className="w-3.5 h-3.5" /> Download PDF
              </button>
            </div>
            <div className="p-5 space-y-4">
              <PaySection title="Earnings" lines={selectedSlip.earnings} totalLabel="Gross Pay" total={selectedSlip.grossPay} tone="earning" />
              <PaySection title="Deductions" lines={selectedSlip.deductions} totalLabel="Total Deductions" total={selectedSlip.totalDeductions} tone="deduction" />
              <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl p-4 flex items-center justify-between">
                <span className="text-base font-bold text-gray-900">Net Pay</span>
                <span className="text-xl font-bold text-violet-700">{money(selectedSlip.netPay)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PaySection({ title, lines, totalLabel, total, tone }) {
  const amountClass = tone === 'earning' ? 'text-green-600' : 'text-red-500';
  return (
    <div>
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">{title}</p>
      <div className="space-y-2">
        {lines.length === 0 ? (
          <p className="py-2 text-sm text-gray-400">No {title.toLowerCase()} recorded.</p>
        ) : lines.map((line) => (
          <div key={line.id} className="flex items-center justify-between py-2 border-b border-gray-50">
            <span className="text-sm text-gray-600">{line.label}</span>
            <span className={`text-sm font-semibold ${amountClass}`}>{money(line.amount)}</span>
          </div>
        ))}
        <div className="flex items-center justify-between py-2">
          <span className="text-sm font-bold text-gray-800">{totalLabel}</span>
          <span className={`text-sm font-bold ${amountClass}`}>{money(total)}</span>
        </div>
      </div>
    </div>
  );
}
