import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import noRecordsImage from '../../../../assets/no-records.svg';
import FilterDropdown from '../../../../components/ui/FilterDropdown';
import { leaveService } from '../../../../service';

// ─── Accordion ────────────────────────────────────────────────────────────────
const AccordionItem = ({ title, isOpen, onToggle, children }) => (
    <div className="flex flex-col">
        <div className={`border rounded-lg overflow-hidden ${isOpen ? 'bg-white border-gray-200' : 'bg-[#F5F5F5] border-[#CBCBCB]'}`}>
            <button
                onClick={onToggle}
                className="w-full px-4 h-[52px] flex justify-between items-center transition-colors text-left"
            >
                <span className="text-[#000000] font-normal text-[16px] leading-none" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                    {title}
                </span>
                {isOpen ? <ChevronUp className="text-gray-500" size={24} /> : <ChevronDown className="text-gray-500" size={24} />}
            </button>
        </div>
        {isOpen && <div className="pt-4 animate-fadeIn">{children}</div>}
    </div>
);

// ─── Input ────────────────────────────────────────────────────────────────────
const InputField = ({ label, type = "text", placeholder, value, onChange, name, readOnly }) => (
    <div>
        <label className="block text-base font-normal text-[#000000] mb-1.5 leading-[140%]">{label}</label>
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value || ''}
            onChange={onChange}
            readOnly={readOnly}
            className={`w-full px-4 py-3 border border-gray-200 rounded-lg text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-all ${readOnly ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-white text-[#000000]'}`}
        />
    </div>
);

// ─── Select (dropdown) ────────────────────────────────────────────────────────
const SelectField = ({ label, placeholder, options = [], value, onChange, name }) => (
    <div>
        <label className="block text-base font-normal text-[#000000] mb-1.5 leading-[140%]">{label}</label>
        <FilterDropdown
            placeholder={placeholder}
            options={options.map(opt => ({ label: opt, value: opt }))}
            value={value}
            onChange={(val) => onChange({ target: { name, value: val } })}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 text-base font-normal outline-none transition-colors flex items-center justify-between"
            minWidth="100%"
        />
    </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const Leave = ({ formData = {}, onChange, employeeId, employeeName, empId, leaveSavedAt }) => {
    const [isSummaryOpen, setIsSummaryOpen] = useState(true);
    const [leaveList, setLeaveList] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [fetchError, setFetchError] = useState(null);

    // ── Fetch leave records from GET /leave ───────────────────────────────
    const fetchLeaves = async () => {
        // empId = employees table ID → this is what the leave records store
        // employeeId = userId (users table) → NOT used for filtering leave records
        const leaveEmpId = empId || employeeId;
        if (!leaveEmpId) return;

        setIsFetching(true);
        setFetchError(null);
        try {
            // Try with empId filter first
            const res = await leaveService.getLeaves({ empId: Number(leaveEmpId) });
            if (res.success) {
                const allRecords = Array.isArray(res.data) ? res.data : [];

                // Backend may return ALL records without filtering (query param not supported)
                // → filter on frontend to show only this employee's records
                const filtered = allRecords.filter(
                    r => String(r.empId) === String(leaveEmpId)
                );

                // If filter gives 0 but we got results, show all (edge case where empId=userId)
                setLeaveList(filtered.length > 0 ? filtered : allRecords);
            } else {
                setFetchError(res.message || 'Failed to load leave records.');
            }
        } catch {
            setFetchError('Something went wrong while loading leave records.');
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [employeeId, empId, leaveSavedAt]); // re-fetch when leave is saved

    return (
        <div className="h-full font-sans flex flex-col gap-4">

            {/* Employee Info Banner */}
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

            {/* ── Leaves Summary Accordion — matches screenshot exactly ───── */}
            <AccordionItem
                title="Leaves Summary"
                isOpen={isSummaryOpen}
                onToggle={() => setIsSummaryOpen(!isSummaryOpen)}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                    {/* Row 1 — 4 dropdowns (API fields: sickLeave, casualLeave, paidLeave; total auto-calc) */}
                    <SelectField
                        label="Total leaves Allocated/Year"
                        placeholder="Select no of Leaves"
                        options={['10', '15', '20', '25', '30', '35', '40', '45', '50']}
                        name="totalLeavesAllocated"
                        value={formData.totalLeavesAllocated}
                        onChange={onChange}
                    />
                    <SelectField
                        label="Sick Leaves Balance"
                        placeholder="Select no of Leaves"
                        options={['5', '10', '12', '15', '20']}
                        name="sickLeave"
                        value={formData.sickLeave}
                        onChange={onChange}
                    />
                    <SelectField
                        label="Casual Leaves Balance"
                        placeholder="Select no of Leaves"
                        options={['5', '8', '10', '12', '15']}
                        name="casualLeave"
                        value={formData.casualLeave}
                        onChange={onChange}
                    />
                    <SelectField
                        label="Paid Leaves Balance"
                        placeholder="Select no of Leaves"
                        options={['5', '10', '15', '20', '25']}
                        name="paidLeave"
                        value={formData.paidLeave}
                        onChange={onChange}
                    />

                    {/* Row 2 — read-only display fields (not editable, not sent to API) */}
                    <InputField
                        label="Loss Of Pay Days"
                        placeholder="0"
                        type="number"
                        name="lossOfPayDays"
                        value={formData.lossOfPayDays}
                        onChange={onChange}
                        readOnly
                    />
                    <InputField
                        label="Carry forward Leaves"
                        placeholder="0"
                        type="number"
                        name="carryForwardLeaves"
                        value={formData.carryForwardLeaves}
                        onChange={onChange}
                        readOnly
                    />
                    <InputField
                        label="Comp Of Earned"
                        placeholder="0"
                        type="number"
                        name="compOfEarned"
                        value={formData.compOfEarned}
                        onChange={onChange}
                        readOnly
                    />
                    <InputField
                        label="Comp Of Availed"
                        placeholder="0"
                        type="number"
                        name="compOfAvailed"
                        value={formData.compOfAvailed}
                        onChange={onChange}
                        readOnly
                    />
                </div>
            </AccordionItem>

            {/* ── Leave History Section — matches screenshot columns exactly ─── */}
            <div className="bg-white py-[10px] px-0 rounded-xl flex flex-col mb-16">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-[16px] font-medium text-[#1E1E1E]">Leave History</h2>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={fetchLeaves}
                            disabled={isFetching}
                            className="flex items-center gap-1 text-gray-400 text-sm hover:text-purple-600 transition-colors disabled:opacity-50"
                            title="Refresh"
                        >
                            <RefreshCw size={13} className={isFetching ? 'animate-spin' : ''} />
                        </button>
                        <Link to="#" className="text-[#7D1EDB] font-medium hover:underline text-[16px] px-[16px]">
                            View All
                        </Link>
                    </div>
                </div>

                {/* Error */}
                {fetchError && (
                    <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                        {fetchError}
                    </div>
                )}

                {/* Table — exact columns from screenshot */}
                <div className="overflow-x-auto flex-1">
                    <table className="w-full border-separate border-spacing-0">
                        <thead className="h-[48px]">
                            <tr className="bg-[#FFFFFF] text-[14px] p-[10px] gap-[10px]">
                                {['Type', 'Total', 'Sick Leave', 'Casual Leave', 'Paid Leave', 'Taken', 'Date'].map((header, index, arr) => (
                                    <th
                                        key={index}
                                        className={`py-2 px-4 text-left text-[14px] font-normal text-[#757575] whitespace-nowrap border-t border-b border-[#CECECE]
                                            ${index === 0 ? 'border-l rounded-l-[8px]' : ''}
                                            ${index === arr.length - 1 ? 'border-r rounded-r-[8px]' : ''}
                                        `}
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {leaveList.map((leave) => (
                                <tr key={leave.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4 text-[13px] text-gray-800 capitalize border-b border-[#F0F0F0]">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize
                                            ${leave.type === 'sick' ? 'bg-red-100 text-red-700' :
                                                leave.type === 'casual' ? 'bg-blue-100 text-blue-700' :
                                                    leave.type === 'paid' ? 'bg-green-100 text-green-700' :
                                                        'bg-gray-100 text-gray-700'}`}
                                        >
                                            {leave.type || '—'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-[13px] text-gray-800 font-medium border-b border-[#F0F0F0]">{leave.total ?? '—'}</td>
                                    <td className="py-3 px-4 text-[13px] text-gray-700 border-b border-[#F0F0F0]">{leave.sickLeave ?? 0}</td>
                                    <td className="py-3 px-4 text-[13px] text-gray-700 border-b border-[#F0F0F0]">{leave.casualLeave ?? 0}</td>
                                    <td className="py-3 px-4 text-[13px] text-gray-700 border-b border-[#F0F0F0]">{leave.paidLeave ?? 0}</td>
                                    <td className="py-3 px-4 text-[13px] text-gray-700 border-b border-[#F0F0F0]">{leave.taken ?? 0}</td>
                                    <td className="py-3 px-4 text-[13px] text-gray-500 border-b border-[#F0F0F0] whitespace-nowrap">
                                        {leave.createdAt
                                            ? new Date(leave.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                                            : '—'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Loading skeleton */}
                {isFetching && (
                    <div className="flex flex-col gap-3 pt-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
                        ))}
                    </div>
                )}

                {/* Empty state — matches screenshot exactly */}
                {!isFetching && leaveList.length === 0 && (
                    <div className="flex flex-col items-center justify-center pt-16 pb-8">
                        <img
                            src={noRecordsImage}
                            alt="No Records found"
                            className="mb-6 w-full h-auto max-w-[501px]"
                        />
                        <h3 className="text-[24px] font-medium text-black mb-2" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>No Records found</h3>
                        <p className="text-[#B0B0B0] text-lg" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>There are no records to show at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leave;
