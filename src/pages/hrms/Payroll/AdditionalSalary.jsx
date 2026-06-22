import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Plus, Pencil, Trash2, X, Search, RotateCcw } from 'lucide-react';
import CustomDatePicker from '../../../components/ui/CustomDatePicker';
import FilterDropdown from '../../../components/ui/FilterDropdown';
import { payrollModuleService, employeeService } from '../../../service';
import toast from 'react-hot-toast';

const AdditionalSalary = () => {
    const navigate = useNavigate();

    // Mode state: 'list' | 'form'
    const [viewMode, setViewMode] = useState('list');
    const [records, setRecords] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [components, setComponents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Form/Edit state
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        empId: '',
        salaryComponentId: '',
        componentName: '',
        type: 'earning',
        amount: '',
        payrollPeriodStart: new Date().toISOString().split('T')[0],
        payrollPeriodEnd: new Date().toISOString().split('T')[0],
        taxable: true,
        reason: '',
        status: 'draft'
    });

    const [deleteId, setDeleteId] = useState(null);
    const [isActionLoading, setIsActionLoading] = useState(false);

    // Fetch records
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            const adminId = userData?.id || userData?._id;

            if (!adminId) {
                toast.error('Could not determine Admin ID. Please log in again.');
                setIsLoading(false);
                return;
            }

            const [recordsRes, empRes, componentsRes] = await Promise.all([
                payrollModuleService.getAdditionalSalaries(),
                employeeService.getAllEmployeesByAdminId(adminId),
                payrollModuleService.getSalaryComponents()
            ]);

            if (recordsRes.success && recordsRes.data) {
                setRecords(recordsRes.data);
            } else {
                toast.error(recordsRes.message || 'Failed to fetch additional salaries');
            }

            if (empRes.success && empRes.data) {
                setEmployees(empRes.data);
            } else {
                toast.error(empRes.message || 'Failed to fetch employees');
            }

            if (componentsRes.success && componentsRes.data) {
                setComponents(componentsRes.data);
            } else {
                toast.error(componentsRes.message || 'Failed to fetch components');
            }

        } catch (err) {
            toast.error('Failed to load payroll details');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleDropdownChange = (name, value) => {
        setFormData(prev => {
            const updates = { [name]: value };
            if (name === 'salaryComponentId' && value) {
                const selected = components.find(c => String(c.id) === String(value));
                if (selected) {
                    updates.componentName = selected.name;
                    updates.type = selected.type;
                    updates.taxable = selected.taxable;
                    if (selected.amountType === 'fixed') {
                        updates.amount = selected.amount || '';
                    }
                }
            }
            return { ...prev, ...updates };
        });
    };

    const handleDateChange = (name, dateStr) => {
        setFormData(prev => ({ ...prev, [name]: dateStr }));
    };

    // Open Form for Adding
    const handleAddNew = () => {
        setEditId(null);
        setFormData({
            empId: '',
            salaryComponentId: '',
            componentName: '',
            type: 'earning',
            amount: '',
            payrollPeriodStart: new Date().toISOString().split('T')[0],
            payrollPeriodEnd: new Date().toISOString().split('T')[0],
            taxable: true,
            reason: '',
            status: 'draft'
        });
        setViewMode('form');
    };

    // Open Form for Editing
    const handleEdit = (item) => {
        const rec = item.additionalSalary || item;
        setEditId(rec.id);
        
        // Format dates
        const pStart = rec.payrollPeriodStart ? rec.payrollPeriodStart.split('T')[0] : '';
        const pEnd = rec.payrollPeriodEnd ? rec.payrollPeriodEnd.split('T')[0] : '';

        setFormData({
            empId: String(rec.empId),
            salaryComponentId: rec.salaryComponentId ? String(rec.salaryComponentId) : '',
            componentName: rec.componentName || '',
            type: rec.type || 'earning',
            amount: rec.amount || '',
            payrollPeriodStart: pStart,
            payrollPeriodEnd: pEnd,
            taxable: rec.taxable ?? true,
            reason: rec.reason || '',
            status: rec.status || 'draft'
        });
        setViewMode('form');
    };

    // Save handler
    const handleSave = async (e) => {
        e.preventDefault();
        if (!formData.empId) {
            toast.error('Please select an employee');
            return;
        }
        if (!formData.componentName) {
            toast.error('Component Name is required');
            return;
        }
        if (!formData.amount) {
            toast.error('Amount is required');
            return;
        }

        const payload = {
            ...formData,
            empId: Number(formData.empId),
            salaryComponentId: formData.salaryComponentId ? Number(formData.salaryComponentId) : null,
            amount: Number(formData.amount)
        };

        setIsActionLoading(true);
        try {
            let res;
            if (editId) {
                res = await payrollModuleService.updateAdditionalSalary(editId, payload);
            } else {
                res = await payrollModuleService.createAdditionalSalary(payload);
            }

            if (res.success) {
                toast.success(editId ? 'Additional salary updated successfully' : 'Additional salary created successfully');
                setViewMode('list');
                fetchData();
            } else {
                toast.error(res.message || 'Failed to save additional salary');
            }
        } catch (err) {
            toast.error('Failed to save additional salary');
        } finally {
            setIsActionLoading(false);
        }
    };

    // Delete handler
    const handleDelete = async () => {
        setIsActionLoading(true);
        try {
            const res = await payrollModuleService.deleteAdditionalSalary(deleteId);
            if (res.success) {
                toast.success('Additional salary deleted successfully');
                setDeleteId(null);
                fetchData();
            } else {
                toast.error(res.message || 'Failed to delete record');
            }
        } catch (err) {
            toast.error('Failed to delete record');
        } finally {
            setIsActionLoading(false);
        }
    };

    // Filtering list
    const filteredRecords = records.filter(item => {
        const name = item.employeeName || '';
        const compName = item.additionalSalary?.componentName || item.componentName || '';
        return !searchQuery || 
            name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            compName.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const statusOptions = ['draft', 'approved', 'processed'];

    return (
        <div className="bg-white px-4 sm:px-4 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col border border-[#D9D9D9]">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 shrink-0" style={{ fontFamily: '"Mulish", sans-serif' }}>
                <img 
                    src="/images/arrow_left_alt.svg" 
                    alt="Back" 
                    className="w-3 h-3 cursor-pointer hover:scale-110 transition-transform" 
                    onClick={() => viewMode === 'form' ? setViewMode('list') : navigate('/hrms')}
                />
                <span 
                    className='cursor-pointer text-[#7D1EDB]'
                    onClick={() => navigate('/hrms')}
                >
                    HRMS Dashboard
                </span> 
                <ChevronRight size={14}/> 
                <span className="text-[#6B7280]">Additional Salary</span>
            </div>

            {viewMode === 'list' ? (
                <>
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4 shrink-0">
                        <div>
                            <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Additional Salaries</h1>
                            <p className="text-sm text-gray-400">One-time earnings or deductions (e.g. bonuses, fine/penalties)</p>
                        </div>
                        
                        <button
                            className="flex items-center justify-center gap-2 rounded-full py-2 px-4 text-white font-normal hover:bg-purple-700 transition-colors bg-[#7D1EDB]"
                            onClick={handleAddNew}
                        >
                            <Plus size={16} />
                            <span className='text-[16px] font-normal text-white' style={{ fontFamily: 'Poppins, sans-serif' }}>Add Additional Salary</span>
                        </button>
                    </div>

                    {/* Search and reload */}
                    <div className="flex gap-4 mb-4 items-center flex-wrap shrink-0">
                        <div className="relative max-w-xs flex-1">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text"
                                placeholder="Search by employee or component..."
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
                        <table className="w-full border-collapse">
                            <thead className="bg-white sticky top-0 z-10 border-b border-[#CECECE]">
                                <tr className="text-left font-poppins">
                                    <th className="px-4 py-3 text-[14px] font-medium text-[#757575]">Employee Name</th>
                                    <th className="px-4 py-3 text-[14px] font-medium text-[#757575]">Component Name</th>
                                    <th className="px-4 py-3 text-[14px] font-medium text-[#757575]">Type</th>
                                    <th className="px-4 py-3 text-[14px] font-medium text-[#757575]">Amount (₹)</th>
                                    <th className="px-4 py-3 text-[14px] font-medium text-[#757575]">Period Start</th>
                                    <th className="px-4 py-3 text-[14px] font-medium text-[#757575]">Period End</th>
                                    <th className="px-4 py-3 text-[14px] font-medium text-[#757575]">Status</th>
                                    <th className="px-4 py-3 text-[14px] font-medium text-[#757575] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center text-gray-500">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7D1EDB] mx-auto mb-2"></div>
                                            Loading records...
                                        </td>
                                    </tr>
                                ) : filteredRecords.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center text-gray-400">No additional salary records found</td>
                                    </tr>
                                ) : (
                                    filteredRecords.map((item) => {
                                        const rec = item.additionalSalary || item;
                                        return (
                                            <tr key={rec.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 text-sm font-semibold text-[#1E1E1E]">{item.employeeName || '—'}</td>
                                                <td className="px-4 py-3 text-sm text-[#1E1E1E]">{rec.componentName}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                                                        rec.type === 'earning' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                        {rec.type}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm font-medium text-gray-900">₹{rec.amount}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {rec.payrollPeriodStart ? new Date(rec.payrollPeriodStart).toLocaleDateString() : '—'}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {rec.payrollPeriodEnd ? new Date(rec.payrollPeriodEnd).toLocaleDateString() : '—'}
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                                                        rec.status === 'approved' ? 'bg-green-100 text-green-700' : 
                                                        rec.status === 'processed' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                        {rec.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex gap-2 justify-end">
                                                        <button 
                                                            onClick={() => handleEdit(item)} 
                                                            className="p-1.5 rounded-lg hover:bg-purple-50 text-[#7D1EDB]"
                                                            title="Edit"
                                                        >
                                                            <Pencil size={15} />
                                                        </button>
                                                        <button 
                                                            onClick={() => setDeleteId(rec.id)} 
                                                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>
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
            ) : (
                <form onSubmit={handleSave} className="flex-1 flex flex-col min-h-0">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4 shrink-0">
                        <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                            {editId ? 'Edit Additional Salary' : 'Create Additional Salary'}
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
                                className="flex items-center justify-center gap-2 rounded-full py-2 px-4 text-white font-normal hover:bg-purple-700 transition-colors bg-[#7D1EDB] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className='text-[16px] font-normal text-white' style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    {isActionLoading ? 'Saving...' : 'Save'}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Form Content - Scrollable Area */}
                    <div className="flex-1 w-full max-w-full overflow-y-auto pr-2 pb-6">
                        
                        {/* Employee Assignment */}
                        <div className="border border-[#D6D6D6] rounded-lg p-4 mb-4">
                            <h2 className="text-[16px] font-medium text-[#1E1E1E] mb-3" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Employee Details</h2>
                            <div className="w-full lg:w-[66%] grid grid-cols-1 md:grid-cols-2 gap-4 mb-3" style={{ fontFamily: '"Inter", sans-serif' }}>
                                {/* Employee Select */}
                                <div>
                                    <label className="block text-sm font-medium text-[#1E1E1E] mb-1">Employee *</label>
                                    <select
                                        name="empId"
                                        value={formData.empId}
                                        onChange={handleChange}
                                        required
                                        disabled={!!editId}
                                        className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:border-[#7D1EDB] bg-white disabled:bg-gray-50"
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
                            </div>
                        </div>

                        {/* Salary Component selection */}
                        <div className="border border-[#D6D6D6] rounded-lg p-4 mb-4">
                            <h2 className="text-[16px] font-medium text-[#1E1E1E] mb-3" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Salary Component & Amount</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3" style={{ fontFamily: '"Inter", sans-serif' }}>
                                {/* Salary Component Select (Optional) */}
                                <div>
                                    <label className="block text-sm font-medium text-[#1E1E1E] mb-1">Link Component (Optional)</label>
                                    <select
                                        name="salaryComponentId"
                                        value={formData.salaryComponentId}
                                        onChange={(e) => handleDropdownChange('salaryComponentId', e.target.value)}
                                        className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:border-[#7D1EDB] bg-white"
                                    >
                                        <option value="">Custom Component</option>
                                        {components.map(c => (
                                            <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                                        ))}
                                    </select>
                                </div>
                                {/* Component Name (Manual text if no component linked) */}
                                <div>
                                    <label className="block text-sm font-medium text-[#1E1E1E] mb-1">Component Name *</label>
                                    <input 
                                        type="text"
                                        name="componentName"
                                        value={formData.componentName}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. Performance Bonus"
                                        className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:border-[#7D1EDB]"
                                    />
                                </div>
                                {/* Type */}
                                <div>
                                    <label className="block text-sm font-medium text-[#1E1E1E] mb-1">Type</label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:border-[#7D1EDB] bg-white"
                                    >
                                        <option value="earning">Earning</option>
                                        <option value="deduction">Deduction</option>
                                    </select>
                                </div>
                                {/* Amount */}
                                <div>
                                    <label className="block text-sm font-medium text-[#1E1E1E] mb-1">Amount (₹) *</label>
                                    <input 
                                        type="number"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        required
                                        min="1"
                                        placeholder="e.g. 5000"
                                        className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:border-[#7D1EDB]"
                                    />
                                </div>
                                {/* Taxable Toggle */}
                                <div className="flex items-center justify-between max-w-xs mt-6">
                                    <span className="text-sm font-medium text-[#1E1E1E]">Is Taxable Benefit</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            name="taxable"
                                            checked={formData.taxable} 
                                            onChange={handleChange} 
                                            className="sr-only peer" 
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7D1EDB]"></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Period & Reason */}
                        <div className="border border-[#D6D6D6] rounded-lg p-4 mb-4">
                            <h2 className="text-[16px] font-medium text-[#1E1E1E] mb-3" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Period & Verification</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                {/* Period Start */}
                                <div>
                                    <label className="block text-sm font-medium text-[#1E1E1E] mb-1">Payroll Period Start *</label>
                                    <CustomDatePicker 
                                        value={formData.payrollPeriodStart}
                                        onChange={(val) => handleDateChange('payrollPeriodStart', val)}
                                        className="w-full bg-white"
                                    />
                                </div>
                                {/* Period End */}
                                <div>
                                    <label className="block text-sm font-medium text-[#1E1E1E] mb-1">Payroll Period End *</label>
                                    <CustomDatePicker 
                                        value={formData.payrollPeriodEnd}
                                        onChange={(val) => handleDateChange('payrollPeriodEnd', val)}
                                        className="w-full bg-white"
                                    />
                                </div>
                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-medium text-[#1E1E1E] mb-1">Verification Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:border-[#7D1EDB] bg-white capitalize"
                                    >
                                        {statusOptions.map(st => (
                                            <option key={st} value={st}>{st}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="mt-3">
                                <label className="block text-sm font-medium text-[#1E1E1E] mb-1">Reason / Description</label>
                                <textarea 
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleChange}
                                    placeholder="Enter reasoning for this additional payment or deduction..."
                                    className="w-full h-20 border border-[#E0E0E0] rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:border-[#7D1EDB] resize-none"
                                />
                            </div>
                        </div>

                    </div>
                </form>
            )}

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={22} className="text-red-500" />
                        </div>
                        <h3 className="text-base font-semibold mb-2">Delete Record?</h3>
                        <p className="text-sm text-gray-400 mb-5">This action cannot be undone. This additional salary will be removed.</p>
                        <div className="flex gap-3 justify-center">
                            <button 
                                onClick={() => setDeleteId(null)} 
                                className="px-5 py-2 text-sm border border-gray-200 rounded-full hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleDelete} 
                                disabled={isActionLoading}
                                className="px-5 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isActionLoading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdditionalSalary;
