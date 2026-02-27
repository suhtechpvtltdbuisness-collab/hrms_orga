import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Pencil, Check, X, RefreshCw } from "lucide-react";
import noRecordsImage from '../../../../assets/no-records.svg';
import FilterDropdown from '../../../../components/ui/FilterDropdown';
import { payrollService } from '../../../../service';

// ─── Accordion ────────────────────────────────────────────────────────────────
const AccordionItem = ({ title, isOpen, onToggle, children }) => (
    <div className="flex flex-col">
        <div className={`border rounded-lg overflow-hidden ${isOpen ? 'bg-white border-gray-200' : 'bg-[#F5F5F5] border-[#CBCBCB]'}`}>
            <button onClick={onToggle} className="w-full px-[16px] h-[52px] flex justify-between items-center transition-colors text-left">
                <span className="text-[#1E1E1E] font-normal text-[16px] leading-none" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                    {title}
                </span>
                {isOpen ? <ChevronUp className="text-gray-500" size={24} /> : <ChevronDown className="text-gray-500" size={24} />}
            </button>
        </div>
        {isOpen && <div className="pt-4 animate-fadeIn">{children}</div>}
    </div>
);

// ─── Input (connected to formData) ────────────────────────────────────────────
const InputField = ({ label, name, placeholder, value, onChange, type = "text", prefix }) => (
    <div>
        <label className="block text-base font-normal text-[#656565] mb-1.5 leading-[140%]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
            {label}
        </label>
        <div className="relative">
            {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{prefix}</span>}
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value || ''}
                onChange={onChange}
                className={`w-full ${prefix ? 'pl-7' : 'px-4'} pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 text-base font-normal placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-all`}
                style={{ fontFamily: '"Nunito Sans", sans-serif' }}
            />
        </div>
    </div>
);

// ─── Select (connected to formData) ───────────────────────────────────────────
const SelectField = ({ label, name, placeholder, options = [], value, onChange }) => (
    <div>
        <label className="block text-base font-normal text-[#000000] mb-1.5 leading-[140%]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
            {label}
        </label>
        <FilterDropdown
            placeholder={placeholder}
            options={options.map(o => typeof o === 'string' ? { label: o, value: o } : o)}
            value={value}
            onChange={(val) => onChange({ target: { name, value: val } })}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 text-base font-normal outline-none transition-all flex items-center justify-between"
            minWidth="100%"
        />
    </div>
);

// ─── Currency formatter ────────────────────────────────────────────────────────
const fmt = (val) => val ? `₹${Number(val).toLocaleString('en-IN')}` : '—';

// ─── Main Component ───────────────────────────────────────────────────────────
const Payroll = ({ formData = {}, onChange, employeeId, employeeName, empId, payrollSavedAt }) => {
    const [isPayrollOpen, setIsPayrollOpen] = useState(true);
    const [isEarningsOpen, setIsEarningsOpen] = useState(true);
    const [payrollList, setPayrollList] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editState, setEditState] = useState({});

    // ── Fetch list ────────────────────────────────────────────────────────
    const fetchPayrolls = async () => {
        const idToUse = empId || employeeId;
        if (!idToUse) return;
        setIsFetching(true);
        setFetchError(null);
        try {
            const res = await payrollService.getPayrolls({ empId: Number(idToUse) });
            if (res.success) {
                const all = Array.isArray(res.data) ? res.data : [];
                // Filter by empId on frontend (safety net if backend ignores query param)
                const filtered = all.filter(r => String(r.empId) === String(idToUse));
                setPayrollList(filtered.length > 0 ? filtered : all);
            } else {
                setFetchError(res.message || 'Failed to load payroll records.');
            }
        } catch {
            setFetchError('Something went wrong while loading payroll records.');
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchPayrolls();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [employeeId, empId, payrollSavedAt]);

    // ── Inline Edit ────────────────────────────────────────────────────────
    const startEdit = (rec) => { setEditingId(rec.id); setEditState({ ...rec }); };
    const cancelEdit = () => { setEditingId(null); setEditState({}); };
    const saveEdit = async (rec) => {
        const res = await payrollService.updatePayroll(rec.id, editState);
        if (res.success) {
            setPayrollList(prev => prev.map(p => p.id === rec.id ? { ...p, ...editState } : p));
            setEditingId(null);
        } else {
            alert(res.message || 'Failed to update payroll');
        }
    };

    return (
        <div className="h-full font-sans flex flex-col gap-4">

            {/* Employee Banner */}
            {employeeId && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {employeeName?.charAt(0)?.toUpperCase() || 'E'}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">{employeeName}</p>
                            <p className="text-xs text-gray-600">Employee ID: {employeeId}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Payroll Accordion ──────────────────────────────────────── */}
            <AccordionItem title="Payroll" isOpen={isPayrollOpen} onToggle={() => setIsPayrollOpen(!isPayrollOpen)}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <InputField
                        label="Salary Structure"
                        name="structure"
                        placeholder="e.g. CTC breakdown with components"
                        value={formData.structure}
                        onChange={onChange}
                    />
                    <InputField
                        label="CTC"
                        name="ctc"
                        placeholder="e.g. 1200000"
                        type="number"
                        prefix="₹"
                        value={formData.ctc}
                        onChange={onChange}
                    />
                    <InputField
                        label="Monthly Gross"
                        name="monthlyGross"
                        placeholder="e.g. 100000"
                        type="number"
                        prefix="₹"
                        value={formData.monthlyGross}
                        onChange={onChange}
                    />
                    <InputField
                        label="Monthly Net Pay"
                        name="monthlyPay"
                        placeholder="e.g. 85000"
                        type="number"
                        prefix="₹"
                        value={formData.monthlyPay}
                        onChange={onChange}
                    />
                    <SelectField
                        label="Payment Mode"
                        name="paymentMode"
                        placeholder="Select payment mode"
                        options={[
                            { label: 'Bank Transfer', value: 'bank_transfer' },
                            { label: 'Cheque', value: 'cheque' },
                            { label: 'Cash', value: 'cash' },
                        ]}
                        value={formData.paymentMode}
                        onChange={onChange}
                    />
                    <InputField
                        label="Department ID"
                        name="departmentId"
                        placeholder="e.g. 3"
                        type="number"
                        value={formData.departmentId}
                        onChange={onChange}
                    />
                </div>
            </AccordionItem>

            {/* ── Earnings Accordion ─────────────────────────────────────── */}
            <AccordionItem title="Earnings" isOpen={isEarningsOpen} onToggle={() => setIsEarningsOpen(!isEarningsOpen)}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <InputField
                        label="Basic Salary"
                        name="baseSalary"
                        placeholder="e.g. 60000"
                        type="number"
                        prefix="₹"
                        value={formData.baseSalary}
                        onChange={onChange}
                    />
                    <InputField
                        label="HRA"
                        name="hra"
                        placeholder="e.g. 20000"
                        type="number"
                        prefix="₹"
                        value={formData.hra}
                        onChange={onChange}
                    />
                    <InputField
                        label="Conveyance Allowance"
                        name="conveyancePay"
                        placeholder="e.g. 2000"
                        type="number"
                        prefix="₹"
                        value={formData.conveyancePay}
                        onChange={onChange}
                    />
                    <InputField
                        label="Overtime Earnings"
                        name="overtimePay"
                        placeholder="e.g. 0"
                        type="number"
                        prefix="₹"
                        value={formData.overtimePay}
                        onChange={onChange}
                    />
                    <InputField
                        label="Special Allowance"
                        name="specialPay"
                        placeholder="e.g. 3000"
                        type="number"
                        prefix="₹"
                        value={formData.specialPay}
                        onChange={onChange}
                    />
                    {/* Auto-calculated Gross */}
                    <div>
                        <label className="block text-base font-normal text-[#656565] mb-1.5 leading-[140%]">
                            Total Earnings <span className="text-xs text-gray-400">(auto)</span>
                        </label>
                        <input
                            type="text"
                            readOnly
                            value={`₹${(
                                (Number(formData.baseSalary) || 0) +
                                (Number(formData.hra) || 0) +
                                (Number(formData.conveyancePay) || 0) +
                                (Number(formData.overtimePay) || 0) +
                                (Number(formData.specialPay) || 0)
                            ).toLocaleString('en-IN')}`}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 text-base cursor-not-allowed"
                        />
                    </div>
                </div>
            </AccordionItem>

            {/* ── Payroll Records Table ──────────────────────────────────── */}
            <div className="bg-white py-[10px] px-0 rounded-xl flex flex-col mb-16">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-[16px] font-medium text-[#1E1E1E]" style={{ fontFamily: '"Inter", sans-serif' }}>
                        Payroll History
                    </h2>
                    <button
                        onClick={fetchPayrolls}
                        disabled={isFetching}
                        className="flex items-center gap-1 text-gray-400 text-sm hover:text-purple-600 transition-colors disabled:opacity-50"
                        title="Refresh"
                    >
                        <RefreshCw size={13} className={isFetching ? 'animate-spin' : ''} />
                    </button>
                </div>

                {fetchError && (
                    <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{fetchError}</div>
                )}

                <div className="overflow-x-auto flex-1">
                    <table className="w-full border-separate border-spacing-0">
                        <thead className="h-[48px]">
                            <tr className="bg-[#FFFFFF] text-[14px]">
                                {['#', 'CTC', 'Monthly Gross', 'Monthly Net', 'Base Salary', 'HRA', 'Payment Mode', 'Actions'].map((h, i, arr) => (
                                    <th key={i} className={`py-2 px-4 text-left text-[14px] font-normal text-[#757575] whitespace-nowrap border-t border-b border-[#CECECE]
                                        ${i === 0 ? 'border-l rounded-l-[8px]' : ''}
                                        ${i === arr.length - 1 ? 'border-r rounded-r-[8px]' : ''}`}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {payrollList.map((rec, idx) => (
                                <tr key={rec.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4 text-[13px] text-gray-500 border-b border-[#F0F0F0]">{idx + 1}</td>
                                    <td className="py-3 px-4 text-[13px] text-gray-700 font-medium border-b border-[#F0F0F0]">{fmt(rec.ctc)}</td>
                                    <td className="py-3 px-4 text-[13px] text-gray-700 border-b border-[#F0F0F0]">{fmt(rec.monthlyGross)}</td>
                                    <td className="py-3 px-4 text-[13px] text-gray-700 border-b border-[#F0F0F0]">{fmt(rec.monthlyPay)}</td>
                                    <td className="py-3 px-4 text-[13px] text-gray-700 border-b border-[#F0F0F0]">{fmt(rec.baseSalary)}</td>
                                    <td className="py-3 px-4 text-[13px] text-gray-700 border-b border-[#F0F0F0]">{fmt(rec.hra)}</td>
                                    <td className="py-3 px-4 border-b border-[#F0F0F0]">
                                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 capitalize">
                                            {rec.paymentMode?.replace('_', ' ') || '—'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 border-b border-[#F0F0F0]">
                                        {editingId === rec.id
                                            ? <div className="flex gap-2">
                                                <button onClick={() => saveEdit(rec)} className="p-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"><Check size={14} /></button>
                                                <button onClick={cancelEdit} className="p-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"><X size={14} /></button>
                                            </div>
                                            : <button onClick={() => startEdit(rec)} className="p-1 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"><Pencil size={14} /></button>
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Loading */}
                {isFetching && (
                    <div className="flex flex-col gap-3 pt-4">{[1, 2, 3].map(i => <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />)}</div>
                )}

                {/* Empty */}
                {!isFetching && payrollList.length === 0 && (
                    <div className="flex flex-col items-center justify-center pt-16 pb-8">
                        <img src={noRecordsImage} alt="No Records found" className="mb-6 w-full h-auto max-w-[501px]" />
                        <h3 className="text-[24px] font-medium text-black mb-2" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>No Records found</h3>
                        <p className="text-[#B0B0B0] text-lg" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>There are no records to show at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Payroll;
