import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Plus, Pencil, Trash2, X, Search, RotateCcw } from 'lucide-react';
import CustomDatePicker from '../../../components/ui/CustomDatePicker';
import FilterDropdown from '../../../components/ui/FilterDropdown';
import { payrollModuleService, employeeService } from '../../../service';
import toast from 'react-hot-toast';

const SalaryStructureAssignment = () => {
    const navigate = useNavigate();

    // Mode state: 'list' | 'form'
    const [viewMode, setViewMode] = useState('list');
    const [assignments, setAssignments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [structures, setStructures] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Form/Edit state
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        empId: '',
        salaryStructureId: '',
        baseSalary: '',
        fromDate: new Date().toISOString().split('T')[0],
        toDate: '',
        isActive: true
    });

    const [deleteId, setDeleteId] = useState(null);
    const [isActionLoading, setIsActionLoading] = useState(false);

    // Fetch initial data
    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Get Admin User ID
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            const adminId = userData?.id || userData?._id;

            if (!adminId) {
                toast.error('Could not determine Admin ID. Please log in again.');
                setIsLoading(false);
                return;
            }

            const [assignRes, structuresRes, empRes] = await Promise.all([
                payrollModuleService.getSalaryStructureAssignments(),
                payrollModuleService.getSalaryStructures(),
                employeeService.getAllEmployeesByAdminId(adminId)
            ]);

            if (assignRes.success && assignRes.data) {
                setAssignments(assignRes.data);
            } else {
                toast.error(assignRes.message || 'Failed to fetch assignments');
            }

            if (structuresRes.success && structuresRes.data) {
                setStructures(structuresRes.data);
            } else {
                toast.error(structuresRes.message || 'Failed to fetch salary structures');
            }

            if (empRes.success && empRes.data) {
                setEmployees(empRes.data);
            } else {
                toast.error(empRes.message || 'Failed to fetch employees');
            }

        } catch (err) {
            toast.error('Failed to load payroll assignment details');
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
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (name, dateStr) => {
        setFormData(prev => ({ ...prev, [name]: dateStr }));
    };

    // Open Form for Adding
    const handleAddNew = () => {
        setEditId(null);
        setFormData({
            empId: '',
            salaryStructureId: '',
            baseSalary: '',
            fromDate: new Date().toISOString().split('T')[0],
            toDate: '',
            isActive: true
        });
        setViewMode('form');
    };

    // Open Form for Editing
    const handleEdit = (item) => {
        const assign = item.assignment || item;
        setEditId(assign.id);
        
        // Format dates
        const fromD = assign.fromDate ? assign.fromDate.split('T')[0] : '';
        const toD = assign.toDate ? assign.toDate.split('T')[0] : '';

        setFormData({
            empId: String(assign.empId),
            salaryStructureId: String(assign.salaryStructureId),
            baseSalary: assign.baseSalary || '',
            fromDate: fromD,
            toDate: toD,
            isActive: assign.isActive ?? true
        });
        setViewMode('form');
    };

    // Save/Update Handler
    const handleSave = async (e) => {
        e.preventDefault();
        if (!formData.empId) {
            toast.error('Please select an employee');
            return;
        }
        if (!formData.salaryStructureId) {
            toast.error('Please select a salary structure');
            return;
        }
        if (!formData.baseSalary) {
            toast.error('Base Salary is required');
            return;
        }

        const payload = {
            ...formData,
            empId: Number(formData.empId),
            salaryStructureId: Number(formData.salaryStructureId),
            baseSalary: Number(formData.baseSalary),
            fromDate: formData.fromDate,
            toDate: formData.toDate || null
        };

        setIsActionLoading(true);
        try {
            let res;
            if (editId) {
                res = await payrollModuleService.updateSalaryStructureAssignment(editId, payload);
            } else {
                res = await payrollModuleService.createSalaryStructureAssignment(payload);
            }

            if (res.success) {
                toast.success(editId ? 'Assignment updated successfully' : 'Assignment created successfully');
                setViewMode('list');
                fetchData();
            } else {
                toast.error(res.message || 'Failed to save assignment');
            }
        } catch (err) {
            toast.error('Overlapping assignment dates or database error');
        } finally {
            setIsActionLoading(false);
        }
    };

    // Delete Handler
    const handleDelete = async () => {
        setIsActionLoading(true);
        try {
            const res = await payrollModuleService.deleteSalaryStructureAssignment(deleteId);
            if (res.success) {
                toast.success('Assignment deleted successfully');
                setDeleteId(null);
                fetchData();
            } else {
                toast.error(res.message || 'Failed to delete assignment');
            }
        } catch (err) {
            toast.error('Failed to delete assignment');
        } finally {
            setIsActionLoading(false);
        }
    };

    // Filtering assignments list
    const filteredAssignments = assignments.filter(item => {
        const name = item.employeeName || '';
        const structName = item.structureName || '';
        return !searchQuery || 
            name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            structName.toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Active options list
    const activeStructures = structures.filter(s => s.active);

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
                <span className="text-[#6B7280]">Salary Assignment</span>
            </div>

            {viewMode === 'list' ? (
                <>
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4 shrink-0">
                        <div>
                            <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Salary Assignments</h1>
                            <p className="text-sm text-gray-400">Assign salary structures and base salaries to employees</p>
                        </div>
                        
                        <button
                            className="flex items-center justify-center gap-2 rounded-full py-2 px-4 text-white font-normal hover:bg-purple-700 transition-colors bg-[#7D1EDB]"
                            onClick={handleAddNew}
                        >
                            <Plus size={16} />
                            <span className='text-[16px] font-normal text-white' style={{ fontFamily: 'Poppins, sans-serif' }}>Add Assignment</span>
                        </button>
                    </div>

                    {/* Search and reload */}
                    <div className="flex gap-4 mb-4 items-center flex-wrap shrink-0">
                        <div className="relative max-w-xs flex-1">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text"
                                placeholder="Search by employee or structure..."
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
                                    <th className="px-4 py-3 text-[14px] font-medium text-[#757575]">Department</th>
                                    <th className="px-4 py-3 text-[14px] font-medium text-[#757575]">Salary Structure</th>
                                    <th className="px-4 py-3 text-[14px] font-medium text-[#757575]">Base Salary (₹)</th>
                                    <th className="px-4 py-3 text-[14px] font-medium text-[#757575]">From Date</th>
                                    <th className="px-4 py-3 text-[14px] font-medium text-[#757575]">To Date</th>
                                    <th className="px-4 py-3 text-[14px] font-medium text-[#757575]">Status</th>
                                    <th className="px-4 py-3 text-[14px] font-medium text-[#757575] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center text-gray-500">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7D1EDB] mx-auto mb-2"></div>
                                            Loading assignments...
                                        </td>
                                    </tr>
                                ) : filteredAssignments.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center text-gray-400">No assignments found</td>
                                    </tr>
                                ) : (
                                    filteredAssignments.map((item) => {
                                        const assign = item.assignment || item;
                                        return (
                                            <tr key={assign.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 text-sm font-semibold text-[#1E1E1E]">{item.employeeName || '—'}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{item.departmentName || '—'}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{item.structureName || '—'}</td>
                                                <td className="px-4 py-3 text-sm font-medium text-gray-900">₹{assign.baseSalary}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {assign.fromDate ? new Date(assign.fromDate).toLocaleDateString() : '—'}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {assign.toDate ? new Date(assign.toDate).toLocaleDateString() : 'Active Ongoing'}
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                        assign.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                        {assign.isActive ? 'Active' : 'Inactive'}
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
                                                            onClick={() => setDeleteId(assign.id)} 
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
                            {editId ? 'Edit Salary Assignment' : 'Create Salary Assignment'}
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
                        
                        {/* Employee Details Assignment */}
                        <div className="border border-[#D6D6D6] rounded-lg p-4 mb-4">
                            <h2 className="text-[16px] font-medium text-[#1E1E1E] mb-3" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Employee Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3" style={{ fontFamily: '"Inter", sans-serif' }}>
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
                                {/* Base Salary */}
                                <div>
                                    <label className="block text-sm font-medium text-[#1E1E1E] mb-1">Base Salary (₹ per Month) *</label>
                                    <input 
                                        type="number"
                                        name="baseSalary"
                                        value={formData.baseSalary}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        placeholder="e.g. 50000"
                                        className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:border-[#7D1EDB]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Salary Structure Assignment */}
                        <div className="border border-[#D6D6D6] rounded-lg p-4 mb-4">
                            <h2 className="text-[16px] font-medium text-[#1E1E1E] mb-3" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Salary Assignment</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3" style={{ fontFamily: '"Inter", sans-serif' }}>
                                {/* Salary Structure Select */}
                                <div>
                                    <label className="block text-sm font-medium text-[#1E1E1E] mb-1">Salary Structure *</label>
                                    <select
                                        name="salaryStructureId"
                                        value={formData.salaryStructureId}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:border-[#7D1EDB] bg-white"
                                    >
                                        <option value="">Select Structure</option>
                                        {activeStructures.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                                {/* Assignment Active Status */}
                                <div className="flex items-center justify-between max-w-xs mt-6">
                                    <span className="text-sm font-medium text-[#1E1E1E]">Is Active Assignment</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            name="isActive"
                                            checked={formData.isActive} 
                                            onChange={handleChange} 
                                            className="sr-only peer" 
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7D1EDB]"></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="border border-[#D6D6D6] rounded-lg p-4 mb-4">
                            <h2 className="text-[16px] font-medium text-[#1E1E1E] mb-3" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Applicable Dates</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                {/* From Date */}
                                <div>
                                    <label className="block text-sm font-medium text-[#1E1E1E] mb-1">From Date *</label>
                                    <CustomDatePicker 
                                        value={formData.fromDate}
                                        onChange={(val) => handleDateChange('fromDate', val)}
                                        className="w-full bg-white"
                                    />
                                </div>
                                {/* To Date */}
                                <div>
                                    <label className="block text-sm font-medium text-[#1E1E1E] mb-1">To Date</label>
                                    <CustomDatePicker 
                                        value={formData.toDate}
                                        onChange={(val) => handleDateChange('toDate', val)}
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
                        <h3 className="text-base font-semibold mb-2">Delete Assignment?</h3>
                        <p className="text-sm text-gray-400 mb-5">This action cannot be undone. The employee will no longer have this salary structure assigned.</p>
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

export default SalaryStructureAssignment;
