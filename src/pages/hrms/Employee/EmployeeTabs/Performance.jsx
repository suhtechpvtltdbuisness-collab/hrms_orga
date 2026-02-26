import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Star, Pencil, Check, X, RefreshCw } from "lucide-react";
import noRecordsImage from '../../../../assets/no-records.svg';
import FilterDropdown from '../../../../components/ui/FilterDropdown';
import CustomDatePicker from '../../../../components/ui/CustomDatePicker';
import { performanceService } from '../../../../service';

// ─── Accordion ────────────────────────────────────────────────────────────────
const AccordionItem = ({ title, isOpen, onToggle, children }) => (
    <div className="flex flex-col">
        <div className={`border rounded-lg overflow-hidden ${isOpen ? 'bg-white border-gray-200' : 'bg-[#F5F5F5] border-[#CBCBCB]'}`}>
            <button onClick={onToggle} className="w-full px-6 h-[52px] flex justify-between items-center transition-colors text-left">
                <span className="text-[#000000] font-normal text-[16px] leading-none" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>{title}</span>
                {isOpen ? <ChevronUp className="text-gray-500" size={24} /> : <ChevronDown className="text-gray-500" size={24} />}
            </button>
        </div>
        {isOpen && <div className="pt-4 animate-fadeIn">{children}</div>}
    </div>
);

// ─── Interactive Star Rating ──────────────────────────────────────────────────
const StarRating = ({ label, value = 0, onChange, readOnly }) => (
    <div>
        <label className="block text-base font-normal text-[#656565] mb-1.5 leading-[140%]">{label}</label>
        <div className="flex gap-1 py-3">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    size={24}
                    fill={star <= value ? '#7D1EDB' : 'none'}
                    className={`transition-colors ${readOnly ? 'text-[#A1A1A1]' : 'cursor-pointer hover:text-purple-500'} ${star <= value ? 'text-[#7D1EDB]' : 'text-[#A1A1A1]'}`}
                    onClick={() => !readOnly && onChange && onChange(star)}
                />
            ))}
        </div>
    </div>
);

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const colors = {
        Excellent: 'bg-green-100 text-green-700',
        Good: 'bg-blue-100 text-blue-700',
        Average: 'bg-yellow-100 text-yellow-700',
        Poor: 'bg-red-100 text-red-700',
    };
    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
            {status || '—'}
        </span>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Performance = ({ formData = {}, onChange, employeeId, employeeName, empId, performanceSavedAt }) => {
    const [isSummaryOpen, setIsSummaryOpen] = useState(true);
    const [date, setDate] = useState('');
    const [status, setStatus] = useState('');
    const [rating, setRating] = useState(0);
    const [performanceList, setPerformanceList] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editState, setEditState] = useState({});

    // ── Fetch list ────────────────────────────────────────────────────────
    const fetchPerformances = async () => {
        const idToUse = empId || employeeId;
        if (!idToUse) return;
        setIsFetching(true);
        setFetchError(null);
        try {
            const res = await performanceService.getPerformances({ empId: Number(idToUse) });
            if (res.success) {
                const all = Array.isArray(res.data) ? res.data : [];
                // Response is [{ performance: {...}, employee: {...} }]
                // Filter by empId on frontend too (safety net)
                const rows = all
                    .filter(r => r.performance && String(r.performance.empId) === String(idToUse))
                    .map(r => r.performance);
                setPerformanceList(rows.length > 0 ? rows : all.map(r => r.performance || r));
            } else {
                setFetchError(res.message || 'Failed to load performance records.');
            }
        } catch {
            setFetchError('Something went wrong while loading performance records.');
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchPerformances();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [employeeId, empId, performanceSavedAt]);

    // ── Expose current form values upward via onChange so AddEmployee can read them ──
    useEffect(() => {
        if (onChange) {
            onChange({ target: { name: '__perfMeta', value: { date, status, rating } } });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [date, status, rating]);

    // ── Inline Edit (PUT /performance/:id) ────────────────────────────────
    const startEdit = (record) => {
        setEditingId(record.id);
        setEditState({ date: record.date, status: record.status, rating: record.rating });
    };

    const cancelEdit = () => { setEditingId(null); setEditState({}); };

    const saveEdit = async (record) => {
        const res = await performanceService.updatePerformance(record.id, editState);
        if (res.success) {
            setPerformanceList(prev => prev.map(p => p.id === record.id ? { ...p, ...editState } : p));
            setEditingId(null);
        } else {
            alert(res.message || 'Failed to update');
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

            {/* ── Performance Summary Accordion ─────────────────────────── */}
            <AccordionItem
                title="Performance Summary"
                isOpen={isSummaryOpen}
                onToggle={() => setIsSummaryOpen(!isSummaryOpen)}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* date → stored in local state, picked up by AddEmployee via formData.__perfMeta */}
                    <div>
                        <label className="block text-base font-normal text-[#656565] mb-1.5 leading-[140%]">
                            Last Review Date
                        </label>
                        <CustomDatePicker
                            value={date}
                            onChange={setDate}
                            placeholder="Select Date"
                            className="bg-white border-gray-200"
                        />
                    </div>

                    {/* status */}
                    <div>
                        <label className="block text-base font-normal text-[#656565] mb-1.5 leading-[140%]">
                            Performance Status
                        </label>
                        <FilterDropdown
                            placeholder="Select status"
                            options={['Excellent', 'Good', 'Average', 'Poor'].map(o => ({ label: o, value: o }))}
                            value={status}
                            onChange={setStatus}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 text-base font-normal outline-none flex items-center justify-between"
                            minWidth="100%"
                        />
                    </div>

                    {/* rating (1–5 stars, interactive) */}
                    <StarRating
                        label="Overall Rating"
                        value={rating}
                        onChange={setRating}
                    />
                </div>
            </AccordionItem>

            {/* ── Performance Records Table ──────────────────────────────── */}
            <div className="bg-white py-[10px] px-0 rounded-xl flex flex-col mb-16">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-[16px] font-medium text-[#1E1E1E]">Performance Records</h2>
                    <button
                        onClick={fetchPerformances}
                        disabled={isFetching}
                        className="flex items-center gap-1 text-gray-400 text-sm hover:text-purple-600 transition-colors disabled:opacity-50"
                        title="Refresh"
                    >
                        <RefreshCw size={13} className={isFetching ? 'animate-spin' : ''} />
                    </button>
                </div>

                {fetchError && (
                    <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                        {fetchError}
                    </div>
                )}

                <div className="overflow-x-auto flex-1">
                    <table className="w-full border-separate border-spacing-0">
                        <thead className="h-[48px]">
                            <tr className="bg-[#FFFFFF] text-[14px]">
                                {['#', 'Date', 'Status', 'Rating', 'Actions'].map((h, i, arr) => (
                                    <th key={i} className={`py-2 px-4 text-left text-[14px] font-normal text-[#757575] whitespace-nowrap border-t border-b border-[#CECECE]
                                        ${i === 0 ? 'border-l rounded-l-[8px]' : ''}
                                        ${i === arr.length - 1 ? 'border-r rounded-r-[8px]' : ''}`}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {performanceList.map((rec, idx) => (
                                <tr key={rec.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4 text-[13px] text-gray-500 border-b border-[#F0F0F0]">{idx + 1}</td>

                                    {/* Date cell */}
                                    <td className="py-3 px-4 text-[13px] text-gray-700 border-b border-[#F0F0F0]">
                                        {editingId === rec.id
                                            ? <input type="date" value={editState.date || ''} onChange={e => setEditState(p => ({ ...p, date: e.target.value }))} className="border border-gray-300 rounded px-2 py-1 text-sm" />
                                            : rec.date ? new Date(rec.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
                                        }
                                    </td>

                                    {/* Status cell */}
                                    <td className="py-3 px-4 border-b border-[#F0F0F0]">
                                        {editingId === rec.id
                                            ? <select value={editState.status || ''} onChange={e => setEditState(p => ({ ...p, status: e.target.value }))} className="border border-gray-300 rounded px-2 py-1 text-sm">
                                                {['Excellent', 'Good', 'Average', 'Poor'].map(s => <option key={s}>{s}</option>)}
                                            </select>
                                            : <StatusBadge status={rec.status} />
                                        }
                                    </td>

                                    {/* Rating cell */}
                                    <td className="py-3 px-4 border-b border-[#F0F0F0]">
                                        {editingId === rec.id
                                            ? <div className="flex gap-0.5">
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <Star key={s} size={18} fill={s <= editState.rating ? '#7D1EDB' : 'none'} className={`cursor-pointer ${s <= editState.rating ? 'text-[#7D1EDB]' : 'text-gray-300'}`} onClick={() => setEditState(p => ({ ...p, rating: s }))} />
                                                ))}
                                            </div>
                                            : <div className="flex gap-0.5">
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <Star key={s} size={16} fill={s <= rec.rating ? '#7D1EDB' : 'none'} className={s <= rec.rating ? 'text-[#7D1EDB]' : 'text-gray-300'} />
                                                ))}
                                            </div>
                                        }
                                    </td>

                                    {/* Actions */}
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
                    <div className="flex flex-col gap-3 pt-4">
                        {[1, 2, 3].map(i => <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />)}
                    </div>
                )}

                {/* Empty */}
                {!isFetching && performanceList.length === 0 && (
                    <div className="flex flex-col items-center justify-center pt-16 pb-8">
                        <img src={noRecordsImage} alt="No Records found" className="mb-6 w-full h-auto max-w-[426px]" />
                        <h3 className="text-[24px] font-medium text-black mb-2" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>No Records found</h3>
                        <p className="text-[#B0B0B0] text-lg" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>There are no records to show at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Performance;
