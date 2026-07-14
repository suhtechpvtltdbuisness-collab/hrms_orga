import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Plus, Eye, CheckCircle2, RotateCcw, Search } from 'lucide-react';
import CustomDatePicker from '../../../components/ui/CustomDatePicker';
import FilterDropdown from '../../../components/ui/FilterDropdown';
import { payrollModuleService, employeeService } from '../../../service';
import toast from 'react-hot-toast';

const pad2 = (value) => String(value).padStart(2, '0');

const formatLocalDate = (date) => {
    const d = date instanceof Date ? date : new Date(date);
    if (Number.isNaN(d.getTime())) return '';
    return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
};

const formatApiDate = (date) => {
    const d = date instanceof Date ? date : new Date(date);
    if (Number.isNaN(d.getTime())) return '';
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};

const parseDateInput = (value) => {
    if (!value) return null;

    if (typeof value === 'string' && value.includes('/')) {
        const [day, month, year] = value.split('/');
        const parsed = new Date(Number(year), Number(month) - 1, Number(day));
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    }

    if (typeof value === 'string' && value.includes('-')) {
        const [year, month, day] = value.split('-');
        const parsed = new Date(Number(year), Number(month) - 1, Number(day));
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    }

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getInclusiveDays = (startValue, endValue) => {
    const start = parseDateInput(startValue);
    const end = parseDateInput(endValue);
    if (!start || !end) return '';

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (end < start) return '';

    const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return String(diff + 1);
};

const getDefaultPayrollForm = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const totalDays = getInclusiveDays(start, end) || '30';

    return {
        empId: '',
        periodStart: formatLocalDate(start),
        periodEnd: formatLocalDate(end),
        totalWorkingDays: totalDays,
        paidDays: totalDays,
        baseSalary: '',
        pfRate: '0.12',
        esicRate: '0.0075',
        ptAmount: '200',
        tdsAmount: '0'
    };
};

const PayrollEntry = () => {
    const navigate = useNavigate();

    // Mode state: 'list' | 'form' | 'detail'
    const [viewMode, setViewMode] = useState('list');
    const [entries, setEntries] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Form state
    const [formData, setFormData] = useState(getDefaultPayrollForm);

    const [selectedEntry, setSelectedEntry] = useState(null);
    const [isActionLoading, setIsActionLoading] = useState(false);

    // Fetch entries & employees
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            const adminId = userData?.id || userData?._id;

            if (!adminId) {
                toast.error('Could not determine Admin ID');
                setIsLoading(false);
                return;
            }

            const [entriesRes, empRes] = await Promise.all([
                payrollModuleService.getPayrollEntries(),
                employeeService.getAllEmployeesByAdminId(adminId)
            ]);

            if (entriesRes.success && entriesRes.data) {
                setEntries(entriesRes.data);
            } else {
                toast.error(entriesRes.message || 'Failed to fetch payroll entries');
            }

            if (empRes.success && empRes.data) {
                setEmployees(empRes.data);
            } else {
                toast.error(empRes.message || 'Failed to fetch employees');
            }
        } catch {
            toast.error('Failed to load payroll details');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (name, dateStr) => {
        setFormData(prev => {
            const next = { ...prev, [name]: dateStr };
            if (name === 'periodStart' || name === 'periodEnd') {
                const totalDays = getInclusiveDays(
                    name === 'periodStart' ? dateStr : prev.periodStart,
                    name === 'periodEnd' ? dateStr : prev.periodEnd
                );
                next.totalWorkingDays = totalDays || '';
                if (totalDays && (!prev.paidDays || prev.paidDays === prev.totalWorkingDays)) {
                    next.paidDays = totalDays;
                }
            }
            return next;
        });
    };

    // Calculate & Create
    const handleCalculate = async (e) => {
        e.preventDefault();
        if (!formData.empId) {
            toast.error('Please select an employee');
            return;
        }

        const periodStartDate = parseDateInput(formData.periodStart);
        const periodEndDate = parseDateInput(formData.periodEnd);

        if (!periodStartDate || !periodEndDate) {
            toast.error('Please select a valid payroll period');
            return;
        }

        if (periodEndDate < periodStartDate) {
            toast.error('Period End must be on or after Period Start');
            return;
        }

        const payload = {
            empId: Number(formData.empId),
            periodStart: formatApiDate(periodStartDate),
            periodEnd: formatApiDate(periodEndDate),
            totalWorkingDays: Number(formData.totalWorkingDays),
            paidDays: Number(formData.paidDays),
            baseSalary: formData.baseSalary ? Number(formData.baseSalary) : undefined,
            statutoryDeductions: {
                pfRate: Number(formData.pfRate) || 0,
                esicRate: Number(formData.esicRate) || 0,
                ptAmount: Number(formData.ptAmount) || 0,
                tdsAmount: Number(formData.tdsAmount) || 0
            }
        };

        setIsActionLoading(true);
        try {
            const res = await payrollModuleService.createPayrollEntry(payload);
            if (res.success) {
                toast.success('Payroll calculated successfully');
                setViewMode('list');
                fetchData();
            } else {
                toast.error(res.message || 'Failed to calculate payroll');
            }
        } catch {
            toast.error('No salary structure assignment exists for this employee/period');
        } finally {
            setIsActionLoading(false);
        }
    };

    // Finalize/Post Payroll Run
    const handleFinalize = async (id) => {
        setIsActionLoading(true);
        try {
            const res = await payrollModuleService.finalizePayrollEntry(id);
            if (res.success) {
                toast.success('Payroll finalized, Salary Slip generated, and ledger entries posted!');
                fetchData();
                if (viewMode === 'detail') {
                    setViewMode('list');
                }
            } else {
                toast.error(res.message || 'Failed to finalize');
            }
        } catch {
            toast.error('Failed to finalize payroll entry');
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleViewDetails = (entry) => {
        setSelectedEntry(entry);
        setViewMode('detail');
    };

    const handleAddNew = () => {
        setFormData(getDefaultPayrollForm());
        setViewMode('form');
    };

    const filteredEntries = entries.filter(e => {
        const name = e.employeeName || '';
        return !searchQuery || name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="bg-white px-4 sm:px-4 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col border border-[#D9D9D9]">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 shrink-0" style={{ fontFamily: '"Mulish", sans-serif' }}>
                <img 
                    src="/images/arrow_left_alt.svg" 
                    alt="Back" 
                    className="w-3 h-3 cursor-pointer hover:scale-110 transition-transform" 
                    onClick={() => viewMode !== 'list' ? setViewMode('list') : navigate('/hrms')}
                />
                <span 
                    className='cursor-pointer text-[#7D1EDB]'
                    onClick={() => navigate('/hrms')}
                >
                    HRMS Dashboard
                </span> 
                <ChevronRight size={14}/> 
                <span className="text-[#6B7280]">Payroll Processing</span>
            </div>

            {viewMode === 'list' ? (
                <>
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4 shrink-0">
                        <div>
                            <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Payroll Processing</h1>
                            <p className="text-sm text-gray-400">Calculate salaries, apply statutory deductions, and post payroll to ledger</p>
                        </div>
                        
                        <button
                            className="flex items-center justify-center gap-2 rounded-full py-2 px-4 text-white font-normal hover:bg-purple-700 transition-colors bg-[#7D1EDB]"
                            onClick={handleAddNew}
                        >
                            <Plus size={16} />
                            <span className='text-[16px] font-normal text-white' style={{ fontFamily: 'Poppins, sans-serif' }}>New Payroll Run</span>
                        </button>
                    </div>

                    {/* Search and reload */}
                    <div className="flex gap-4 mb-4 items-center flex-wrap shrink-0">
                        <div className="relative max-w-xs flex-1">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text"
                                placeholder="Search by employee..."
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

                    {/* Table */}
                    <div className="flex-1 w-full overflow-y-auto border border-[#CECECE] rounded-lg">
                        <table className="w-full border-collapse font-inter">
                            <thead className="bg-white sticky top-0 z-10 border-b border-[#CECECE]">
                                <tr className="text-left font-poppins">
                                    <th className="px-4 py-3 text-[14px] font-medium text-[#757575]">Employee</th>
                                    <th className="px-4 py-3 text-[14px] font-medium text-[#757575]">Period Start</th>
                                    <th className="px-4 py-3 text-[14px] font-medium text-[#757575]">Period End</th>
                                    <th className="px-4 py-3 text-[14px] font-medium text-[#757575]">Paid Days</th>
                                    <th className="px-4 py-3 text-[14px] font-medium text-[#757575]">Gross Pay</th>
                                    <th className="px-4 py-3 text-[14px] font-medium text-[#757575]">Deductions</th>
                                    <th className="px-4 py-3 text-[14px] font-medium text-[#757575]">Net Pay</th>
                                    <th className="px-4 py-3 text-[14px] font-medium text-[#757575]">Status</th>
                                    <th className="px-4 py-3 text-[14px] font-medium text-[#757575] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={9} className="py-12 text-center text-gray-500">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7D1EDB] mx-auto mb-2"></div>
                                            Loading entries...
                                        </td>
                                    </tr>
                                ) : filteredEntries.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="py-12 text-center text-gray-400">No payroll entries found</td>
                                    </tr>
                                ) : (
                                    filteredEntries.map((e) => {
                                        const entry = e.payrollEntry || {};
                                        return (
                                            <tr key={entry.id || e.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 text-sm font-semibold text-[#1E1E1E]">{e.employeeName || '—'}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {entry.periodStart ? new Date(entry.periodStart).toLocaleDateString() : '—'}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {entry.periodEnd ? new Date(entry.periodEnd).toLocaleDateString() : '—'}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{entry.paidDays} / {entry.totalWorkingDays}</td>
                                                <td className="px-4 py-3 text-sm font-medium text-gray-900">₹{entry.grossPay}</td>
                                                <td className="px-4 py-3 text-sm text-red-600">₹{entry.totalDeductions}</td>
                                                <td className="px-4 py-3 text-sm font-semibold text-green-700">₹{entry.netPay}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                                                        entry.status === 'finalized' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                        {entry.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex gap-2 justify-end">
                                                        <button 
                                                            onClick={() => handleViewDetails(e)} 
                                                            className="p-1.5 rounded-lg hover:bg-purple-50 text-[#7D1EDB]"
                                                            title="View Details"
                                                        >
                                                            <Eye size={15} />
                                                        </button>
                                                        {entry.status === 'calculated' && (
                                                            <button 
                                                                onClick={() => handleFinalize(entry.id)} 
                                                                disabled={isActionLoading}
                                                                className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 disabled:opacity-40 disabled:cursor-not-allowed"
                                                                title="Finalize"
                                                            >
                                                                <CheckCircle2 size={15} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : viewMode === 'form' ? (
                <form onSubmit={handleCalculate} className="flex-1 flex flex-col min-h-0 font-inter">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4 shrink-0">
                        <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                            New Payroll Run
                        </h1>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                className="px-4 py-2 border border-gray-200 rounded-full hover:bg-gray-50 text-sm font-medium"
                                onClick={() => setViewMode('list')}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isActionLoading}
                                className="bg-[#7D1EDB] text-white py-2 px-4 rounded-full text-[14px] hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isActionLoading ? 'Calculating...' : 'Calculate & Create Draft'}
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 pb-6">
                        
                        {/* Target Selection */}
                        <div className="border border-[#D6D6D6] rounded-lg p-4 mb-4">
                            <h2 className="text-[16px] font-medium text-[#1E1E1E] mb-3" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Employee Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#1E1E1E] mb-1">Employee *</label>
                                    <select
                                        name="empId"
                                        value={formData.empId}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:border-[#7D1EDB] bg-white"
                                    >
                                        <option value="">Select Employee</option>
                                        {employees.map(item => {
                                            const u = item.user || item;
                                            return (
                                                <option key={u.id} value={u.id}>
                                                    {u.name} (EMP-{String(u.id).padStart(3, '0')})
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1E1E1E] mb-1">Override Base Salary (Optional)</label>
                                    <input 
                                        type="number"
                                        name="baseSalary"
                                        value={formData.baseSalary}
                                        onChange={handleChange}
                                        placeholder="Leave blank to use assigned structure base"
                                        className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:border-[#7D1EDB]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Calendar Periods */}
                        <div className="border border-[#D6D6D6] rounded-lg p-4 mb-4">
                            <h2 className="text-[16px] font-medium text-[#1E1E1E] mb-3" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Payroll Period</h2>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#1E1E1E] mb-1">Period Start *</label>
                                    <CustomDatePicker 
                                        value={formData.periodStart}
                                        onChange={(val) => handleDateChange('periodStart', val)}
                                        className="w-full bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1E1E1E] mb-1">Period End *</label>
                                    <CustomDatePicker 
                                        value={formData.periodEnd}
                                        onChange={(val) => handleDateChange('periodEnd', val)}
                                        className="w-full bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1E1E1E] mb-1">Total Calendar Days</label>
                                    <input 
                                        type="number"
                                        name="totalWorkingDays"
                                        value={formData.totalWorkingDays}
                                        readOnly
                                        className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:border-[#7D1EDB]"
                                    />
                                    <p className="mt-1 text-xs text-gray-400">Auto-calculated from the selected period.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1E1E1E] mb-1">Paid Days *</label>
                                    <input 
                                        type="number"
                                        name="paidDays"
                                        value={formData.paidDays}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:border-[#7D1EDB]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Statutory Deductions */}
                        <div className="border border-[#D6D6D6] rounded-lg p-4">
                            <h2 className="text-[16px] font-medium text-[#1E1E1E] mb-3" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Statutory Rules Configuration</h2>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#1E1E1E] mb-1">Provident Fund (PF) Rate</label>
                                    <input 
                                        type="number"
                                        step="0.01"
                                        name="pfRate"
                                        value={formData.pfRate}
                                        onChange={handleChange}
                                        className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:border-[#7D1EDB]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1E1E1E] mb-1">ESIC Rate</label>
                                    <input 
                                        type="number"
                                        step="0.0001"
                                        name="esicRate"
                                        value={formData.esicRate}
                                        onChange={handleChange}
                                        className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:border-[#7D1EDB]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1E1E1E] mb-1">Professional Tax (PT) Amount</label>
                                    <input 
                                        type="number"
                                        name="ptAmount"
                                        value={formData.ptAmount}
                                        onChange={handleChange}
                                        className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:border-[#7D1EDB]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1E1E1E] mb-1">Income Tax Deductions (TDS)</label>
                                    <input 
                                        type="number"
                                        name="tdsAmount"
                                        value={formData.tdsAmount}
                                        onChange={handleChange}
                                        className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:border-[#7D1EDB]"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                </form>
            ) : (
                /* Detail View */
                <div className="flex-1 flex flex-col min-h-0 font-inter">
                    <div className="flex justify-between items-center mb-4 shrink-0">
                        <h2 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                            Payroll Run Details: {selectedEntry.employeeName}
                        </h2>
                        <div className="flex gap-2">
                            <button
                                className="px-4 py-2 border border-gray-200 rounded-full hover:bg-gray-50 text-sm font-medium"
                                onClick={() => setViewMode('list')}
                            >
                                Back to List
                            </button>
                            {selectedEntry.payrollEntry?.status === 'calculated' && (
                                <button
                                    onClick={() => handleFinalize(selectedEntry.payrollEntry?.id)}
                                    disabled={isActionLoading}
                                    className="bg-green-600 text-white py-2 px-4 rounded-full text-[14px] hover:bg-green-700 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <CheckCircle2 size={16} /> {isActionLoading ? 'Finalizing...' : 'Finalize & Post'}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 pb-6 space-y-4">
                        {/* Summary Details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border border-[#CECECE] rounded-lg bg-gray-50">
                            <div>
                                <span className="text-xs text-gray-500">Gross Earnings</span>
                                <p className="text-lg font-bold text-gray-900">₹{selectedEntry.payrollEntry?.grossPay}</p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500">Deductions</span>
                                <p className="text-lg font-bold text-red-600">₹{selectedEntry.payrollEntry?.totalDeductions}</p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500">Net Take-Home Pay</span>
                                <p className="text-lg font-bold text-green-700">₹{selectedEntry.payrollEntry?.netPay}</p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500">Paid Days</span>
                                <p className="text-lg font-bold text-gray-900">{selectedEntry.payrollEntry?.paidDays} Days</p>
                            </div>
                        </div>

                        {/* Breakdown Tables */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Earnings Breakdown */}
                            <div className="border border-[#CECECE] rounded-lg overflow-hidden">
                                <div className="bg-gray-100 p-3 border-b border-[#CECECE] font-semibold text-sm">Earnings Breakdown</div>
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-[#CECECE] text-left text-gray-500">
                                            <th className="p-3">Component</th>
                                            <th className="p-3 text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(selectedEntry.payrollEntry?.earnings || []).map((e, idx) => (
                                            <tr key={idx} className="border-b last:border-b-0">
                                                <td className="p-3 font-medium">{e.name || e.componentName || 'Salary Component'}</td>
                                                <td className="p-3 text-right font-semibold">₹{e.amount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Deductions Breakdown */}
                            <div className="border border-[#CECECE] rounded-lg overflow-hidden">
                                <div className="bg-gray-100 p-3 border-b border-[#CECECE] font-semibold text-sm">Deductions Breakdown</div>
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-[#CECECE] text-left text-gray-500">
                                            <th className="p-3">Component</th>
                                            <th className="p-3 text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(selectedEntry.payrollEntry?.deductions || []).map((d, idx) => (
                                            <tr key={idx} className="border-b last:border-b-0">
                                                <td className="p-3 font-medium">{d.name || d.componentName || 'Deduction'}</td>
                                                <td className="p-3 text-right font-semibold text-red-600">₹{d.amount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Statutory Deductions Details */}
                        <div className="border border-[#CECECE] rounded-lg p-4 bg-gray-50">
                            <h3 className="font-semibold text-sm mb-3">Statutory Deductions Details</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <span className="text-xs text-gray-500">PF Rate</span>
                                    <p className="font-semibold text-gray-900">{(selectedEntry.payrollEntry?.statutoryDeductions?.pfRate * 100).toFixed(1)}%</p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500">ESIC Rate</span>
                                    <p className="font-semibold text-gray-900">{(selectedEntry.payrollEntry?.statutoryDeductions?.esicRate * 100).toFixed(2)}%</p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500">Professional Tax (PT)</span>
                                    <p className="font-semibold text-gray-900">₹{selectedEntry.payrollEntry?.statutoryDeductions?.ptAmount ?? 0}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500">Income Tax (TDS)</span>
                                    <p className="font-semibold text-gray-900">₹{selectedEntry.payrollEntry?.statutoryDeductions?.tdsAmount ?? 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PayrollEntry;
