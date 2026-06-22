import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Eye, RotateCcw, Search } from 'lucide-react';
import { payrollModuleService } from '../../../service';
import toast from 'react-hot-toast';

const PayrollAccounting = () => {
    const navigate = useNavigate();

    const [entries, setEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    // Fetch entries
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await payrollModuleService.getPayrollAccountingEntries();
            if (res.success && res.data) {
                setEntries(res.data);
            } else {
                toast.error(res.message || 'Failed to fetch accounting entries');
            }
        } catch (err) {
            toast.error('Failed to load accounting entries');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleViewDetails = (item) => {
        setSelectedEntry(item);
        setIsDetailOpen(true);
    };

    const filteredEntries = entries.filter(item => {
        const name = item.employeeName || '';
        const msg = item.payrollAccounting?.message || '';
        return !searchQuery || 
            name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            msg.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="bg-white px-4 sm:px-4 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col border border-[#D9D9D9]">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 shrink-0" style={{ fontFamily: '"Mulish", sans-serif' }}>
                <img 
                    src="/images/arrow_left_alt.svg" 
                    alt="Back" 
                    className="w-3 h-3 cursor-pointer hover:scale-110 transition-transform" 
                    onClick={() => navigate('/hrms')}
                />
                <span 
                    className='cursor-pointer text-[#7D1EDB]'
                    onClick={() => navigate('/hrms')}
                >
                    HRMS Dashboard
                </span> 
                <ChevronRight size={14}/> 
                <span className="text-[#6B7280]">Payroll Ledger Postings</span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-4 shrink-0 font-poppins">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#494949]">Payroll Accounting Ledger</h1>
                    <p className="text-sm text-gray-400">Track automatic general ledger postings when payroll is finalized</p>
                </div>
            </div>

            {/* Search and reload */}
            <div className="flex gap-4 mb-4 items-center flex-wrap shrink-0">
                <div className="relative max-w-xs flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text"
                        placeholder="Search postings..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7D1EDB]"
                    />
                </div>
                <button 
                    onClick={fetchData}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600"
                    title="Reload"
                >
                    <RotateCcw size={16} />
                </button>
            </div>

            {/* List View Table */}
            <div className="flex-1 w-full overflow-y-auto border border-[#CECECE] rounded-lg">
                <table className="w-full border-collapse font-inter">
                    <thead className="bg-white sticky top-0 z-10 border-b border-[#CECECE]">
                        <tr className="text-left font-poppins">
                            <th className="px-4 py-3 text-[14px] font-medium text-[#757575]">Posting ID</th>
                            <th className="px-4 py-3 text-[14px] font-medium text-[#757575]">Employee</th>
                            <th className="px-4 py-3 text-[14px] font-medium text-[#757575]">Period Start</th>
                            <th className="px-4 py-3 text-[14px] font-medium text-[#757575]">Period End</th>
                            <th className="px-4 py-3 text-[14px] font-medium text-[#757575]">Net Salary Paid</th>
                            <th className="px-4 py-3 text-[14px] font-medium text-[#757575]">GL Status</th>
                            <th className="px-4 py-3 text-[14px] font-medium text-[#757575]">Integration Message</th>
                            <th className="px-4 py-3 text-[14px] font-medium text-[#757575] text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={8} className="py-12 text-center text-gray-500">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7D1EDB] mx-auto mb-2"></div>
                                    Loading postings...
                                </td>
                            </tr>
                        ) : filteredEntries.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="py-12 text-center text-gray-400">No ledger entries found</td>
                            </tr>
                        ) : (
                            filteredEntries.map((item) => {
                                const acc = item.payrollAccounting || item;
                                const entry = item.payrollEntry || {};
                                return (
                                    <tr key={acc.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 text-sm font-semibold text-[#7D1EDB]">GL-{(acc.id)}</td>
                                        <td className="px-4 py-3 text-sm font-semibold text-[#1E1E1E]">{item.employeeName || '—'}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {entry.periodStart ? new Date(entry.periodStart).toLocaleDateString() : '—'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {entry.periodEnd ? new Date(entry.periodEnd).toLocaleDateString() : '—'}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">₹{entry.netPay || '—'}</td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                                                acc.status === 'stubbed' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                                            }`}>
                                                {acc.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{acc.message || '—'}</td>
                                        <td className="px-4 py-3 text-right">
                                            <button 
                                                onClick={() => handleViewDetails(item)} 
                                                className="p-1.5 rounded-lg hover:bg-purple-50 text-[#7D1EDB]"
                                                title="View Ledger Payload"
                                            >
                                                <Eye size={15} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal for Details payload */}
            {isDetailOpen && selectedEntry && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 font-inter">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl flex flex-col max-h-[80vh]">
                        {/* Header */}
                        <div className="flex justify-between items-start border-b pb-3 mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Ledger Posting Voucher</h3>
                                <p className="text-xs text-gray-400">Employee: {selectedEntry.employeeName}</p>
                            </div>
                            <button onClick={() => setIsDetailOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <span className="text-xl">×</span>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                            <div className="space-y-2">
                                <span className="text-xs text-gray-400 font-semibold uppercase">Posting Message</span>
                                <p className="text-sm p-3 bg-gray-50 border rounded-lg text-gray-700">
                                    {selectedEntry.payrollAccounting?.message || 'Accounting successfully stubbed.'}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <span className="text-xs text-gray-400 font-semibold uppercase">JSON Payload</span>
                                <pre className="text-xs p-3 bg-gray-900 text-green-400 rounded-lg overflow-x-auto max-h-60">
                                    {JSON.stringify(selectedEntry.payrollAccounting?.payload || {}, null, 2)}
                                </pre>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex gap-2 justify-end border-t pt-3 mt-4">
                            <button
                                onClick={() => setIsDetailOpen(false)}
                                className="bg-[#7D1EDB] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-purple-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PayrollAccounting;
