import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Plus, Pencil, Trash2, X, Search, RotateCcw } from 'lucide-react';
import FilterDropdown from '../../../components/ui/FilterDropdown';
import { payrollModuleService } from '../../../service';
import toast from 'react-hot-toast';

const SalaryComponent = () => {
    const navigate = useNavigate();

    // Mode state: 'list' | 'form'
    const [viewMode, setViewMode] = useState('list');
    const [components, setComponents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');

    // Form/Edit state
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        type: 'earning',
        amountType: 'fixed',
        amount: '',
        formula: '',
        dependsOnPaymentDays: true,
        taxable: true,
        defaultAccount: 'ICICI-Salary Account',
        costCenter: 'Operations',
        active: true,
        description: ''
    });

    const [deleteId, setDeleteId] = useState(null);
    const [isActionLoading, setIsActionLoading] = useState(false);

    // Fetch all components
    const fetchComponents = async () => {
        setIsLoading(true);
        try {
            const res = await payrollModuleService.getSalaryComponents();
            if (res.success && res.data) {
                setComponents(res.data);
            } else {
                toast.error(res.message || 'Failed to fetch salary components');
            }
        } catch (err) {
            toast.error('Failed to load salary components');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchComponents();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleDropdownChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Open Form for Adding
    const handleAddNew = () => {
        setEditId(null);
        setFormData({
            name: '',
            code: '',
            type: 'earning',
            amountType: 'fixed',
            amount: '',
            formula: '',
            dependsOnPaymentDays: true,
            taxable: true,
            defaultAccount: 'ICICI-Salary Account',
            costCenter: 'Operations',
            active: true,
            description: ''
        });
        setViewMode('form');
    };

    // Open Form for Editing
    const handleEdit = (comp) => {
        setEditId(comp.id);
        setFormData({
            name: comp.name || '',
            code: comp.code || '',
            type: comp.type || 'earning',
            amountType: comp.amountType || 'fixed',
            amount: comp.amount || '',
            formula: comp.formula || '',
            dependsOnPaymentDays: comp.dependsOnPaymentDays ?? true,
            taxable: comp.taxable ?? true,
            defaultAccount: comp.defaultAccount || 'ICICI-Salary Account',
            costCenter: comp.costCenter || 'Operations',
            active: comp.active ?? true,
            description: comp.description || ''
        });
        setViewMode('form');
    };

    // Save/Update Handler
    const handleSave = async (e) => {
        e.preventDefault();
        if (!formData.name) {
            toast.error('Component Name is required');
            return;
        }

        const payload = {
            ...formData,
            amount: formData.amountType === 'fixed' ? Number(formData.amount) || 0 : 0,
            formula: formData.amountType === 'formula' ? formData.formula : ''
        };

        setIsActionLoading(true);
        try {
            let res;
            if (editId) {
                res = await payrollModuleService.updateSalaryComponent(editId, payload);
            } else {
                res = await payrollModuleService.createSalaryComponent(payload);
            }

            if (res.success) {
                toast.success(editId ? 'Component updated successfully' : 'Component created successfully');
                setViewMode('list');
                fetchComponents();
            } else {
                toast.error(res.message || 'Failed to save component');
            }
        } catch (err) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsActionLoading(false);
        }
    };

    // Delete Handler
    const handleDelete = async () => {
        if (!deleteId) return;
        setIsActionLoading(true);
        try {
            const res = await payrollModuleService.deleteSalaryComponent(deleteId);
            if (res.success) {
                toast.success('Component deleted successfully');
                setDeleteId(null);
                fetchComponents();
            } else {
                toast.error(res.message || 'Failed to delete component');
            }
        } catch (err) {
            toast.error('Failed to delete component');
        } finally {
            setIsActionLoading(false);
        }
    };

    // Options
    const TYPE_OPTIONS = ['earning', 'deduction'];
    const AMOUNT_TYPE_OPTIONS = ['fixed', 'formula'];
    const PAYMENT_DAYS_OPTIONS = ['Yes', 'No'];
    const ACCOUNT_OPTIONS = ['ICICI-Salary Account', 'HDFC-Salary Account', 'SBI-Salary Account', 'Cash'];
    const COST_CENTER_OPTIONS = ['Operations', 'Sales', 'Marketing', 'IT', 'HR'];

    // Filtering
    const filteredComponents = components.filter(comp => {
        const matchesSearch = !searchQuery || 
            comp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            comp.code.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === 'All' || comp.type === typeFilter;
        return matchesSearch && matchesType;
    });

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
                <span className="text-[#6B7280]">Salary Component</span>
            </div>

            {viewMode === 'list' ? (
                <>
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4 shrink-0">
                        <div>
                            <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Salary Components</h1>
                            <p className="text-sm text-gray-400">Manage earnings and deductions definitions</p>
                        </div>
                        
                        <button
                            className="flex items-center justify-center gap-2 rounded-full py-2 px-4 text-white font-normal hover:bg-purple-700 transition-colors bg-[#7D1EDB]"
                            onClick={handleAddNew}
                        >
                            <Plus size={16} />
                            <span className='text-[16px] font-normal text-white' style={{ fontFamily: 'Poppins, sans-serif' }}>Add Component</span>
                        </button>
                    </div>

                    {/* Filters Bar */}
                    <div className="flex gap-4 mb-4 items-center flex-wrap shrink-0">
                        <div className="relative max-w-xs flex-1">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text"
                                placeholder="Search by name or code..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7D1EDB]"
                            />
                        </div>
                        <FilterDropdown
                            label="Type"
                            options={['All', 'earning', 'deduction']}
                            value={typeFilter}
                            onChange={(val) => setTypeFilter(val)}
                            minWidth="140px"
                        />
                        <button 
                            onClick={fetchComponents}
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
                                <tr className="text-left">
                                    <th className="px-4 py-3 text-[14px] font-medium text-[#757575] font-poppins">Code</th>
                                    <th className="px-4 py-3 text-[14px] font-medium text-[#757575] font-poppins">Name</th>
                                    <th className="px-4 py-3 text-[14px] font-medium text-[#757575] font-poppins">Type</th>
                                    <th className="px-4 py-3 text-[14px] font-medium text-[#757575] font-poppins">Amount Type</th>
                                    <th className="px-4 py-3 text-[14px] font-medium text-[#757575] font-poppins">Value / Formula</th>
                                    <th className="px-4 py-3 text-[14px] font-medium text-[#757575] font-poppins">Taxable</th>
                                    <th className="px-4 py-3 text-[14px] font-medium text-[#757575] font-poppins">Status</th>
                                    <th className="px-4 py-3 text-[14px] font-medium text-[#757575] font-poppins text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center text-gray-500">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7D1EDB] mx-auto mb-2"></div>
                                            Loading components...
                                        </td>
                                    </tr>
                                ) : filteredComponents.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center text-gray-400">No components found</td>
                                    </tr>
                                ) : (
                                    filteredComponents.map((comp) => (
                                        <tr key={comp.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 text-sm font-semibold text-[#1E1E1E]">{comp.code}</td>
                                            <td className="px-4 py-3 text-sm text-[#1E1E1E]">{comp.name}</td>
                                            <td className="px-4 py-3 text-sm">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                                                    comp.type === 'earning' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {comp.type}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600 capitalize">{comp.amountType}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                                                {comp.amountType === 'fixed' ? `₹${comp.amount}` : comp.formula}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                {comp.taxable ? 'Yes' : 'No'}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                    comp.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                    {comp.active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex gap-2 justify-end">
                                                    <button 
                                                        onClick={() => handleEdit(comp)} 
                                                        className="p-1.5 rounded-lg hover:bg-purple-50 text-[#7D1EDB]"
                                                        title="Edit"
                                                    >
                                                        <Pencil size={15} />
                                                    </button>
                                                    <button 
                                                        onClick={() => setDeleteId(comp.id)} 
                                                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
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
                            {editId ? 'Edit Salary Component' : 'Create Salary Component'}
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
                    <div className="flex-1 w-full max-w-full overflow-y-auto pr-2 font-inter pb-6">
                        
                        {/* Basic Information */}
                        <div className="border border-[#D6D6D6] rounded-lg p-4 mb-3">
                            <h2 className="text-[16px] font-medium text-[#1E1E1E] mb-3" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Basic Information</h2>
                            <div className="w-full lg:w-[66%] grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                {/* Component Name */}
                                <div>
                                    <label className="block text-sm font-medium text-[#1E1E1E] mb-1">Component Name *</label>
                                    <input 
                                        type="text"
                                        name="name"    
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. Basic Salary"
                                        className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:border-[#7D1EDB]"
                                    />
                                </div>
                                {/* Component Code */}
                                <div>
                                    <label className="block text-sm font-medium text-[#1E1E1E] mb-1">Component Code</label>
                                    <input 
                                        type="text"
                                        name="code"    
                                        value={formData.code}
                                        onChange={handleChange}
                                        placeholder="e.g. BASIC (auto if empty)"
                                        className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:border-[#7D1EDB]"
                                    />
                                </div>
                                {/* Type */}
                                <div>
                                    <label className="block text-sm font-medium text-[#1E1E1E] mb-1">Type</label>
                                    <FilterDropdown
                                        options={TYPE_OPTIONS}
                                        value={formData.type}
                                        onChange={(val) => handleDropdownChange('type', val)}
                                        className="w-full h-[38px] px-3 bg-white border border-[#E0E0E0] rounded-lg text-[14px] text-[#1E1E1E] focus:ring-1 focus:ring-[#7D1EDB] flex items-center justify-between"
                                        showArrow={true}
                                        dropdownWidth="100%"
                                        align='left'
                                        disableAllOption={true}
                                    />
                                </div>
                            </div>
                            {/* Description */}
                            <div className="">
                                <label className="block text-sm font-medium text-[#1E1E1E] mb-1">Description</label>
                                <textarea 
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Enter component details..."
                                    className="w-full h-20 border border-[#E0E0E0] rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:border-[#7D1EDB] resize-none"
                                />
                            </div>
                        </div>

                        {/* Calculation Rules */}
                        <div className="border border-[#D6D6D6] rounded-lg p-4 mb-3">
                            <h2 className="text-[16px] font-medium text-[#1E1E1E] mb-3" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Calculation Rules</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                {/* Amount Type */}
                                <div>
                                    <label className="block text-sm font-medium text-[#1E1E1E] mb-1">Amount Type</label>
                                    <FilterDropdown
                                        options={AMOUNT_TYPE_OPTIONS}
                                        value={formData.amountType}
                                        onChange={(val) => handleDropdownChange('amountType', val)}
                                        className="w-full h-[38px] px-3 bg-white border border-[#E0E0E0] rounded-lg text-[14px] text-[#1E1E1E] focus:ring-1 focus:ring-[#7D1EDB] flex items-center justify-between"
                                        showArrow={true}
                                        dropdownWidth="100%"
                                        align='left'
                                        disableAllOption={true}
                                    />
                                </div>
                                {/* Amount (Fixed) */}
                                {formData.amountType === 'fixed' && (
                                    <div>
                                        <label className="block text-sm font-medium text-[#1E1E1E] mb-1">Fixed Amount</label>
                                        <input 
                                            type="number"
                                            name="amount"
                                            value={formData.amount}
                                            onChange={handleChange}
                                            min="0"
                                            placeholder="Enter amount in ₹"
                                            className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:border-[#7D1EDB]"
                                        />
                                    </div>
                                )}
                                {/* Formula */}
                                {formData.amountType === 'formula' && (
                                    <div>
                                        <label className="block text-sm font-medium text-[#1E1E1E] mb-1">Formula *</label>
                                        <input 
                                            type="text"
                                            name="formula"
                                            value={formData.formula}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g. base * 0.4"
                                            className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:border-[#7D1EDB]"
                                        />
                                    </div>
                                )}
                                {/* Depends On Payment days */}
                                <div>
                                    <label className="block text-sm font-medium text-[#1E1E1E] mb-1">Depends On Payment Days</label>
                                    <FilterDropdown
                                        options={['Yes', 'No']}
                                        value={formData.dependsOnPaymentDays ? 'Yes' : 'No'}
                                        onChange={(val) => handleDropdownChange('dependsOnPaymentDays', val === 'Yes')}
                                        className="w-full h-[38px] px-3 bg-white border border-[#E0E0E0] rounded-lg text-[14px] text-[#1E1E1E] focus:ring-1 focus:ring-[#7D1EDB] flex items-center justify-between"
                                        showArrow={true}
                                        dropdownWidth="100%"
                                        align='left'
                                        disableAllOption={true}
                                    />
                                </div>
                            </div>
                            
                            {/* Toggles */}
                            <div className="w-full lg:w-[66%] grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                <div className="flex items-center justify-between max-w-xs">
                                    <span className="text-sm font-medium text-[#1E1E1E]">Is Tax Applicable</span>
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

                        {/* Accounting */}
                        <div className="border border-[#D6D6D6] rounded-lg p-4">
                            <h2 className="text-[16px] font-medium text-[#1E1E1E] mb-3" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Accounting</h2>
                            <div className="w-full lg:w-[66%] grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                {/* Default Account */}
                                <div>
                                    <label className="block text-sm font-medium text-[#1E1E1E] mb-1">Default Account</label>
                                    <FilterDropdown
                                        options={ACCOUNT_OPTIONS}
                                        value={formData.defaultAccount}
                                        onChange={(val) => handleDropdownChange('defaultAccount', val)}
                                        className="w-full h-[38px] px-3 bg-white border border-[#E0E0E0] rounded-lg text-[14px] text-[#1E1E1E] focus:ring-1 focus:ring-[#7D1EDB] flex items-center justify-between"
                                        showArrow={true}
                                        dropdownWidth="100%"
                                        align='left'
                                        disableAllOption={true}
                                    />
                                </div>
                                {/* Cost Center */}
                                <div>
                                    <label className="block text-sm font-medium text-[#1E1E1E] mb-1">Cost Center</label>
                                    <FilterDropdown
                                        options={COST_CENTER_OPTIONS}
                                        value={formData.costCenter}
                                        onChange={(val) => handleDropdownChange('costCenter', val)}
                                        className="w-full h-[38px] px-3 bg-white border border-[#E0E0E0] rounded-lg text-[14px] text-[#1E1E1E] focus:ring-1 focus:ring-[#7D1EDB] flex items-center justify-between"
                                        showArrow={true}
                                        dropdownWidth="100%"
                                        align='left'
                                        disableAllOption={true}
                                    />
                                </div>
                            </div>

                            {/* Status Toggle */}
                            <div className="mt-3">
                                <div className="w-full md:w-[50%] lg:w-[33%] flex items-center justify-between max-w-xs">
                                     <span className="text-sm font-medium text-[#1E1E1E]">Active Status</span>
                                     <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            name="active"
                                            checked={formData.active} 
                                            onChange={handleChange} 
                                            className="sr-only peer" 
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7D1EDB]"></div>
                                    </label>
                                </div>
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
                        <h3 className="text-base font-semibold mb-2">Delete Salary Component?</h3>
                        <p className="text-sm text-gray-400 mb-5">This action cannot be undone. Salaries depending on this component might be affected.</p>
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

export default SalaryComponent;
