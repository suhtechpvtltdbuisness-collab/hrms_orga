import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Plus, Pencil, Trash2, X, Search, RotateCcw } from 'lucide-react';
import CustomDatePicker from '../../../components/ui/CustomDatePicker';
import { payrollModuleService } from '../../../service';
import toast from 'react-hot-toast';

const SalaryStructure = () => {
    const navigate = useNavigate();

    // Mode state: 'list' | 'form'
    const [viewMode, setViewMode] = useState('list');
    const [structures, setStructures] = useState([]);
    const [availableComponents, setAvailableComponents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Form/Edit state
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        effectiveFrom: new Date().toISOString().split('T')[0],
        effectiveTo: '',
        active: true
    });

    const [earnings, setEarnings] = useState([]);
    const [deductions, setDeductions] = useState([]);
    const [deleteId, setDeleteId] = useState(null);
    const [isActionLoading, setIsActionLoading] = useState(false);

    // Fetch structures and components
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [structuresRes, componentsRes] = await Promise.all([
                payrollModuleService.getSalaryStructures(),
                payrollModuleService.getSalaryComponents()
            ]);

            if (structuresRes.success && structuresRes.data) {
                setStructures(structuresRes.data);
            } else {
                toast.error(structuresRes.message || 'Failed to fetch salary structures');
            }

            if (componentsRes.success && componentsRes.data) {
                setAvailableComponents(componentsRes.data);
            } else {
                toast.error(componentsRes.message || 'Failed to fetch salary components');
            }
        } catch (err) {
            toast.error('Failed to load payroll data');
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

    const handleDateChange = (name, dateStr) => {
        // CustomDatePicker returns DD/MM/YYYY or similar, but the backend wants YYYY-MM-DD.
        // If CustomDatePicker returns standard format, let's keep it or convert it.
        // Let's check how date is formatted. Let's store as YYYY-MM-DD.
        setFormData(prev => ({ ...prev, [name]: dateStr }));
    };

    // Earnings/Deductions handlers
    const addEarning = () => {
        setEarnings([...earnings, { id: Date.now(), salaryComponentId: '', amount: '', formula: '' }]);
    };

    const removeEarning = (id) => {
        setEarnings(earnings.filter(e => e.id !== id));
    };

    const addDeduction = () => {
        setDeductions([...deductions, { id: Date.now(), salaryComponentId: '', amount: '', formula: '' }]);
    };

    const removeDeduction = (id) => {
        setDeductions(deductions.filter(d => d.id !== id));
    };

    const handleTableChange = (type, id, field, value) => {
        const list = type === 'earning' ? earnings : deductions;
        const setter = type === 'earning' ? setEarnings : setDeductions;

        setter(list.map(item => {
            if (item.id === id) {
                const updated = { ...item, [field]: value };
                // Auto-fill defaults if component changes
                if (field === 'salaryComponentId') {
                    const selected = availableComponents.find(c => String(c.id) === String(value));
                    if (selected) {
                        updated.amount = selected.amountType === 'fixed' ? selected.amount : '';
                        updated.formula = selected.amountType === 'formula' ? selected.formula : '';
                    }
                }
                return updated;
            }
            return item;
        }));
    };

    // Open Form for Adding
    const handleAddNew = () => {
        setEditId(null);
        setFormData({
            name: '',
            description: '',
            effectiveFrom: new Date().toISOString().split('T')[0],
            effectiveTo: '',
            active: true
        });
        setEarnings([]);
        setDeductions([]);
        setViewMode('form');
    };

    // Open Form for Editing
    const handleEdit = (struct) => {
        setEditId(struct.id);
        
        // Format dates
        const effFrom = struct.effectiveFrom ? struct.effectiveFrom.split('T')[0] : '';
        const effTo = struct.effectiveTo ? struct.effectiveTo.split('T')[0] : '';

        setFormData({
            name: struct.name || '',
            description: struct.description || '',
            effectiveFrom: effFrom,
            effectiveTo: effTo,
            active: struct.active ?? true
        });

        // Filter and set structure components
        const structComps = struct.components || [];
        const earnComps = [];
        const dedComps = [];

        structComps.forEach((sc, idx) => {
            const comp = sc.component || sc;
            const fullComp = availableComponents.find(c => c.id === sc.salaryComponentId);
            const compType = fullComp ? fullComp.type : 'earning';
            
            const item = {
                id: sc.id || idx,
                salaryComponentId: sc.salaryComponentId,
                amount: sc.amount || '',
                formula: sc.formula || ''
            };

            if (compType === 'earning') {
                earnComps.push(item);
            } else {
                dedComps.push(item);
            }
        });

        setEarnings(earnComps);
        setDeductions(dedComps);
        setViewMode('form');
    };

    // Save handler
    const handleSave = async (e) => {
        e.preventDefault();
        if (!formData.name) {
            toast.error('Structure Name is required');
            return;
        }

        // Validate components
        const combined = [...earnings, ...deductions];
        const invalid = combined.find(c => !c.salaryComponentId);
        if (invalid) {
            toast.error('Please select a salary component for all rows');
            return;
        }

        const componentsPayload = combined.map(c => ({
            salaryComponentId: Number(c.salaryComponentId),
            amount: Number(c.amount) || 0,
            formula: c.formula || ''
        }));

        const payload = {
            ...formData,
            components: componentsPayload
        };

        setIsActionLoading(true);
        try {
            let res;
            if (editId) {
                res = await payrollModuleService.updateSalaryStructure(editId, payload);
            } else {
                res = await payrollModuleService.createSalaryStructure(payload);
            }

            if (res.success) {
                toast.success(editId ? 'Salary structure updated successfully' : 'Salary structure created successfully');
                setViewMode('list');
                fetchData();
            } else {
                toast.error(res.message || 'Failed to save salary structure');
            }
        } catch (err) {
            toast.error('Failed to save salary structure');
        } finally {
            setIsActionLoading(false);
        }
    };

    // Delete handler
    const handleDelete = async () => {
        setIsActionLoading(true);
        try {
            const res = await payrollModuleService.deleteSalaryStructure(deleteId);
            if (res.success) {
                toast.success('Salary structure deleted successfully');
                setDeleteId(null);
                fetchData();
            } else {
                toast.error(res.message || 'Failed to delete salary structure');
            }
        } catch (err) {
            toast.error('Failed to delete salary structure');
        } finally {
            setIsActionLoading(false);
        }
    };

    // Split components for dropdown selection
    const earningComponents = availableComponents.filter(c => c.type === 'earning');
    const deductionComponents = availableComponents.filter(c => c.type === 'deduction');

    // Filtering structures list
    const filteredStructures = structures.filter(s => 
        !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                <span className="text-[#6B7280]">Salary Structure</span>
            </div>

            {viewMode === 'list' ? (
                <>
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4 shrink-0">
                        <div>
                            <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Salary Structures</h1>
                            <p className="text-sm text-gray-400">Define employee salary templates and components formulas</p>
                        </div>
                        
                        <button
                            className="flex items-center justify-center gap-2 rounded-full py-2 px-4 text-white font-normal hover:bg-purple-700 transition-colors bg-[#7D1EDB]"
                            onClick={handleAddNew}
                        >
                            <Plus size={16} />
                            <span className='text-[16px] font-normal text-white' style={{ fontFamily: 'Poppins, sans-serif' }}>Add Structure</span>
                        </button>
                    </div>

                    {/* Search and reload */}
                    <div className="flex gap-4 mb-4 items-center flex-wrap shrink-0">
                        <div className="relative max-w-xs flex-1">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text"
                                placeholder="Search structures..."
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
                                    <th className="px-4 py-3 text-[14px] font-medium text-[#757575]">Structure Name</th>
                                    <th className="px-4 py-3 text-[14px] font-medium text-[#757575]">Description</th>
                                    <th className="px-4 py-3 text-[14px] font-medium text-[#757575]">Effective From</th>
                                    <th className="px-4 py-3 text-[14px] font-medium text-[#757575]">Effective To</th>
                                    <th className="px-4 py-3 text-[14px] font-medium text-[#757575]">Components Count</th>
                                    <th className="px-4 py-3 text-[14px] font-medium text-[#757575]">Status</th>
                                    <th className="px-4 py-3 text-[14px] font-medium text-[#757575] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-gray-500">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7D1EDB] mx-auto mb-2"></div>
                                            Loading structures...
                                        </td>
                                    </tr>
                                ) : filteredStructures.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-gray-400">No structures found</td>
                                    </tr>
                                ) : (
                                    filteredStructures.map((struct) => (
                                        <tr key={struct.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 text-sm font-semibold text-[#1E1E1E]">{struct.name}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{struct.description || '—'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {struct.effectiveFrom ? new Date(struct.effectiveFrom).toLocaleDateString() : '—'}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {struct.effectiveTo ? new Date(struct.effectiveTo).toLocaleDateString() : 'Active Ongoing'}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {(struct.components || []).length} Components
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                    struct.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                    {struct.active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex gap-2 justify-end">
                                                    <button 
                                                        onClick={() => handleEdit(struct)} 
                                                        className="p-1.5 rounded-lg hover:bg-purple-50 text-[#7D1EDB]"
                                                        title="Edit"
                                                    >
                                                        <Pencil size={15} />
                                                    </button>
                                                    <button 
                                                        onClick={() => setDeleteId(struct.id)} 
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
                            {editId ? 'Edit Salary Structure' : 'Create Salary Structure'}
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
                        
                        {/* Basic Information */}
                        <div className="border border-[#D6D6D6] rounded-lg p-4 mb-4">
                            <h2 className="text-[16px] font-medium text-[#1E1E1E] mb-3" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Basic Information</h2>
                            <div className="w-full lg:w-[66%] grid grid-cols-1 md:grid-cols-2 gap-3 mb-3" style={{ fontFamily: '"Inter", sans-serif' }}>
                                {/* Salary Structure Name */}
                                <div>
                                    <label className="block text-sm font-medium text-[#1E1E1E] mb-1">Salary Structure Name *</label>
                                    <input 
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. Executive Salary Package"
                                        className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:border-[#7D1EDB]"
                                    />
                                </div>
                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-[#1E1E1E] mb-1">Description</label>
                                    <input 
                                        type="text"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="e.g. Standard package for senior employees"
                                        className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:border-[#7D1EDB]"
                                    />
                                </div>
                            </div>
                            {/* Is Active Toggle */}
                            <div className="w-full lg:w-[66%] grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                                <div className="flex items-center justify-between max-w-xs">
                                    <span className="text-sm font-medium text-[#1E1E1E]">Is Active</span>
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

                        {/* Earnings Table */}
                        <div className="border border-[#D6D6D6] rounded-lg p-4 mb-4">
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-[16px] font-medium text-[#1E1E1E]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Earnings Table</h2>
                                <button 
                                    type="button"
                                    onClick={addEarning}
                                    className="bg-[#7D1EDB] text-white py-1.5 px-3 rounded-full text-[13px] hover:bg-purple-700 transition-colors"
                                >
                                    Add Earning component
                                </button>
                            </div>
                            
                            <div className="overflow-x-auto border border-[#CECECE] rounded-lg">
                                <table className="w-full">
                                    <thead className="bg-white border-b border-[#CECECE] text-left">
                                        <tr className="font-poppins">
                                            <th className="px-4 py-2 text-[13px] font-medium text-[#757575] w-12">Sr.</th>
                                            <th className="px-4 py-2 text-[13px] font-medium text-[#757575] w-64">Salary Component</th>
                                            <th className="px-4 py-2 text-[13px] font-medium text-[#757575] w-40">Amount (₹)</th>
                                            <th className="px-4 py-2 text-[13px] font-medium text-[#757575]">Formula</th>
                                            <th className="px-4 py-2 text-[13px] font-medium text-[#757575] w-16 text-right">Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {earnings.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="py-4 text-center text-sm text-gray-400">No earning components added</td>
                                            </tr>
                                        ) : (
                                            earnings.map((row, index) => (
                                                <tr key={row.id} className="border-b last:border-b-0">
                                                    <td className="px-4 py-2 text-sm text-[#1E1E1E]">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <select
                                                            value={row.salaryComponentId}
                                                            onChange={(e) => handleTableChange('earning', row.id, 'salaryComponentId', e.target.value)}
                                                            required
                                                            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-[#7D1EDB]"
                                                        >
                                                            <option value="">Select Component</option>
                                                            {earningComponents.map(c => (
                                                                <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <input 
                                                            type="number" 
                                                            value={row.amount}
                                                            onChange={(e) => handleTableChange('earning', row.id, 'amount', e.target.value)}
                                                            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-[#7D1EDB]"
                                                            placeholder="Amount"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <input 
                                                            type="text" 
                                                            value={row.formula}
                                                            onChange={(e) => handleTableChange('earning', row.id, 'formula', e.target.value)}
                                                            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-[#7D1EDB]"
                                                            placeholder="Formula (e.g. base * 0.5)"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2 text-right">
                                                        <button 
                                                            type="button"
                                                            onClick={() => removeEarning(row.id)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Deduction Table */}
                        <div className="border border-[#D6D6D6] rounded-lg p-4 mb-4">
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-[16px] font-medium text-[#1E1E1E]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Deduction Table</h2>
                                <button 
                                    type="button"
                                    onClick={addDeduction}
                                    className="bg-[#7D1EDB] text-white py-1.5 px-3 rounded-full text-[13px] hover:bg-purple-700 transition-colors"
                                >
                                    Add Deduction component
                                </button>
                            </div>
                            
                            <div className="overflow-x-auto border border-[#CECECE] rounded-lg">
                                <table className="w-full">
                                    <thead className="bg-white border-b border-[#CECECE] text-left">
                                        <tr className="font-poppins">
                                            <th className="px-4 py-2 text-[13px] font-medium text-[#757575] w-12">Sr.</th>
                                            <th className="px-4 py-2 text-[13px] font-medium text-[#757575] w-64">Salary Component</th>
                                            <th className="px-4 py-2 text-[13px] font-medium text-[#757575] w-40">Amount (₹)</th>
                                            <th className="px-4 py-2 text-[13px] font-medium text-[#757575]">Formula</th>
                                            <th className="px-4 py-2 text-[13px] font-medium text-[#757575] w-16 text-right">Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {deductions.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="py-4 text-center text-sm text-gray-400">No deduction components added</td>
                                            </tr>
                                        ) : (
                                            deductions.map((row, index) => (
                                                <tr key={row.id} className="border-b last:border-b-0">
                                                    <td className="px-4 py-2 text-sm text-[#1E1E1E]">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <select
                                                            value={row.salaryComponentId}
                                                            onChange={(e) => handleTableChange('deduction', row.id, 'salaryComponentId', e.target.value)}
                                                            required
                                                            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-[#7D1EDB]"
                                                        >
                                                            <option value="">Select Component</option>
                                                            {deductionComponents.map(c => (
                                                                <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <input 
                                                            type="number" 
                                                            value={row.amount}
                                                            onChange={(e) => handleTableChange('deduction', row.id, 'amount', e.target.value)}
                                                            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-[#7D1EDB]"
                                                            placeholder="Amount"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <input 
                                                            type="text" 
                                                            value={row.formula}
                                                            onChange={(e) => handleTableChange('deduction', row.id, 'formula', e.target.value)}
                                                            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-[#7D1EDB]"
                                                            placeholder="Formula"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2 text-right">
                                                        <button 
                                                            type="button"
                                                            onClick={() => removeDeduction(row.id)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Conditions */}
                        <div className="border border-[#D6D6D6] rounded-lg p-4 mb-4">
                            <h2 className="text-[16px] font-medium text-[#1E1E1E] mb-3" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Conditions</h2>
                            <div className="w-full lg:w-[66%] grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                {/* Effective From */}
                                <div>
                                    <label className="block text-sm font-medium text-[#1E1E1E] mb-1">Effective From *</label>
                                    <CustomDatePicker 
                                        value={formData.effectiveFrom}
                                        onChange={(val) => handleDateChange('effectiveFrom', val)}
                                        className="w-full bg-white"
                                    />
                                </div>
                                {/* Effective To */}
                                <div>
                                    <label className="block text-sm font-medium text-[#1E1E1E] mb-1">Effective To</label>
                                    <CustomDatePicker 
                                        value={formData.effectiveTo}
                                        onChange={(val) => handleDateChange('effectiveTo', val)}
                                        className="w-full bg-white"
                                    />
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
                        <h3 className="text-base font-semibold mb-2">Delete Salary Structure?</h3>
                        <p className="text-sm text-gray-400 mb-5">This action cannot be undone. Employees assigned this structure will need to be re-assigned.</p>
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

export default SalaryStructure;
