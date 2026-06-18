import React, { useState } from 'react';
import { Download, TrendingUp, DollarSign, FileText, ChevronRight, Eye } from 'lucide-react';

const payslips = [
  { month: 'May 2025', gross: 50000, net: 43500, status: 'paid', date: 'May 31, 2025' },
  { month: 'April 2025', gross: 50000, net: 43500, status: 'paid', date: 'Apr 30, 2025' },
  { month: 'March 2025', gross: 50000, net: 43500, status: 'paid', date: 'Mar 31, 2025' },
  { month: 'February 2025', gross: 48000, net: 41800, status: 'paid', date: 'Feb 28, 2025' },
  { month: 'January 2025', gross: 48000, net: 41800, status: 'paid', date: 'Jan 31, 2025' },
];

const breakdown = [
  { label: 'Basic Salary', amount: 25000, type: 'earning' },
  { label: 'HRA', amount: 10000, type: 'earning' },
  { label: 'Conveyance Allowance', amount: 5000, type: 'earning' },
  { label: 'Special Allowance', amount: 7000, type: 'earning' },
  { label: 'Overtime Pay', amount: 3000, type: 'earning' },
  { label: 'PF (Employee)', amount: -1800, type: 'deduction' },
  { label: 'Professional Tax', amount: -200, type: 'deduction' },
  { label: 'TDS', amount: -4500, type: 'deduction' },
];

export default function EmployeePayroll() {
  const [selectedSlip, setSelectedSlip] = useState(payslips[0]);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const earnings = breakdown.filter(b => b.type === 'earning').reduce((s,b) => s + b.amount, 0);
  const deductions = breakdown.filter(b => b.type === 'deduction').reduce((s,b) => s + b.amount, 0);
  const net = earnings + deductions;

  const fmt = (n) => '₹' + Math.abs(n).toLocaleString('en-IN');

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Payroll & Payslips</h1>
        <p className="text-sm text-gray-500 mt-0.5">View your salary details and download payslips</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Monthly Gross', val: '₹50,000', sub: 'May 2025', color: 'bg-violet-100 text-violet-600', icon: DollarSign },
          { label: 'Net Salary', val: '₹43,500', sub: 'After deductions', color: 'bg-green-100 text-green-600', icon: TrendingUp },
          { label: 'Total Deductions', val: '₹6,500', sub: 'PF + Tax', color: 'bg-red-100 text-red-500', icon: FileText },
          { label: 'Annual CTC', val: '₹6,00,000', sub: 'FY 2025-26', color: 'bg-blue-100 text-blue-600', icon: DollarSign },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${c.color}`}>
              <c.icon className="w-4.5 h-4.5" />
            </div>
            <p className="text-xl font-bold text-gray-900">{c.val}</p>
            <p className="text-xs font-medium text-gray-500 mt-0.5">{c.label}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Payslip List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Payslip History</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {payslips.map((p, i) => (
              <div
                key={i}
                onClick={() => setSelectedSlip(p)}
                className={`px-5 py-3.5 flex items-center justify-between cursor-pointer transition-all ${selectedSlip.month === p.month ? 'bg-violet-50 border-l-2 border-violet-500' : 'hover:bg-gray-50'}`}
              >
                <div>
                  <p className={`text-sm font-semibold ${selectedSlip.month === p.month ? 'text-violet-700' : 'text-gray-800'}`}>{p.month}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{p.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-700">₹{p.net.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-600">Paid</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Salary Breakdown */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Salary Breakdown</h2>
              <p className="text-xs text-gray-400 mt-0.5">{selectedSlip.month}</p>
            </div>
            <button className="flex items-center gap-1.5 px-3.5 py-2 bg-violet-600 text-white text-xs font-semibold rounded-lg hover:bg-violet-700 transition-all active:scale-95">
              <Download className="w-3.5 h-3.5" /> Download PDF
            </button>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Earnings</p>
              <div className="space-y-2">
                {breakdown.filter(b => b.type === 'earning').map((b, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50">
                    <span className="text-sm text-gray-600">{b.label}</span>
                    <span className="text-sm font-semibold text-green-600">{fmt(b.amount)}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-bold text-gray-800">Total Earnings</span>
                  <span className="text-sm font-bold text-green-600">{fmt(earnings)}</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Deductions</p>
              <div className="space-y-2">
                {breakdown.filter(b => b.type === 'deduction').map((b, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50">
                    <span className="text-sm text-gray-600">{b.label}</span>
                    <span className="text-sm font-semibold text-red-500">-{fmt(b.amount)}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-bold text-gray-800">Total Deductions</span>
                  <span className="text-sm font-bold text-red-500">-{fmt(deductions)}</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl p-4 flex items-center justify-between">
              <span className="text-base font-bold text-gray-900">Net Pay</span>
              <span className="text-xl font-bold text-violet-700">{fmt(net)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
