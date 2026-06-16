import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, ArrowRight, Search, Check, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { employeeService } from '../../../service';
import CustomDatePicker from '../../../components/ui/CustomDatePicker';

const ShiftAssignment = () => {
    const navigate = useNavigate();

    const [employees, setEmployees] = useState([]);
    const [assignments, setAssignments] = useState({});
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDate, setSelectedDate] = useState(() => {
        // Default to today's date formatted as DD/MM/YYYY
        const d = new Date();
        return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    });
    const [bulkShift, setBulkShift] = useState("Day");

    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Load assignments from localStorage
    const loadAssignments = (date) => {
        const stored = localStorage.getItem(`hrms_shift_assignments_${date}`);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error("Failed to parse shift assignments:", e);
            }
        }
        return {};
    };

    // Load employees and merge with shift assignments
    useEffect(() => {
        const fetchEmployeesAndShifts = async () => {
            setIsLoading(true);
            try {
                const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                const adminId = userData?.id || userData?._id;

                if (!adminId) {
                    toast.error('Could not determine admin ID. Please log in again.');
                    setIsLoading(false);
                    return;
                }

                // Load assignments for the currently selected date
                const dateAssignments = loadAssignments(selectedDate);
                setAssignments(dateAssignments);

                const response = await employeeService.getAllEmployeesByAdminId(adminId);
                if (response.success && response.data) {
                    const mapped = response.data.map((item, index) => {
                        const u = item.user || item;
                        return {
                            id: u.id || index + 1,
                            name: u.name || '-',
                            empId: `EMP-${String(u.id || index + 1).padStart(3, '0')}`,
                        };
                    });
                    setEmployees(mapped);
                } else {
                    toast.error(response.message || 'Failed to load employees.');
                }
            } catch (error) {
                console.error("Error fetching employees:", error);
                toast.error('Something went wrong while loading employee roster.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchEmployeesAndShifts();
        setSelectedRows([]);
        setCurrentPage(1);
    }, [selectedDate]);

    // Handle shift type change inline for an employee
    const handleShiftChange = (employeeId, shiftType) => {
        setAssignments(prev => ({
            ...prev,
            [employeeId]: shiftType
        }));
    };

    // Apply Bulk Assignment
    const handleBulkApply = () => {
        if (selectedRows.length === 0) {
            toast.error("Please select employees first.");
            return;
        }
        const updated = { ...assignments };
        selectedRows.forEach(empId => {
            updated[empId] = bulkShift;
        });
        setAssignments(updated);
        setSelectedRows([]);
        toast.success(`Assigned ${bulkShift} shift to selected employees.`);
    };

    // Save all assignments to localStorage
    const handleSave = () => {
        localStorage.setItem(`hrms_shift_assignments_${selectedDate}`, JSON.stringify(assignments));
        toast.success(`Shift roster saved for ${selectedDate}!`);
    };

    // Filter Logic
    const filteredEmployees = employees.filter(emp => {
        const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              emp.empId.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allIds = currentItems.map(item => item.id);
            setSelectedRows(allIds);
        } else {
            setSelectedRows([]);
        }
    };

    const handleSelectRow = (id) => {
        setSelectedRows(prev => {
            if (prev.includes(id)) {
                return prev.filter(rowId => rowId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const formatDateStr = (dateVal) => {
        if (!dateVal) return "";
        const d = new Date(dateVal);
        return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    };

    return (
        <div className="bg-white px-4 sm:px-4 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col">
            
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
                <span className="text-[#6B7280]">Shift Assignment</span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-4 shrink-0">
                <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Shift Assignment</h1>

                <button
                    onClick={handleSave}
                    className="flex items-center justify-center gap-2 py-2 px-5 rounded-full text-white font-medium hover:bg-purple-700 transition-colors bg-[#7D1EDB] shadow-md cursor-pointer"
                >
                    <Save size={16} />
                    <span className='text-[16px] font-medium text-white' style={{ fontFamily: 'Poppins, sans-serif' }}>Save Roster</span>
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-4 items-center flex-wrap shrink-0" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                <div className="flex-1 min-w-[200px] relative">
                    <input 
                        type="text"
                        placeholder="Search by ID or Name..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full h-10 pl-10 pr-4 border border-[#CECECE] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#7D1EDB] text-sm"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                <div className="min-w-[180px] flex items-center gap-2">
                    <label className="text-xs text-gray-500 font-semibold shrink-0">Date:</label>
                    <CustomDatePicker
                        value={selectedDate}
                        onChange={(date) => {
                            if (date) {
                                setSelectedDate(formatDateStr(date));
                            }
                        }}
                        placeholder="Select Date"
                        className="w-full h-10 bg-white"
                    />
                </div>
            </div>

            {/* Bulk Assignment Bar */}
            {selectedRows.length > 0 && (
                <div className="flex gap-4 mb-4 p-3 bg-purple-50 border border-purple-100 rounded-lg shrink-0 items-center justify-between" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    <span className="text-xs text-[#7D1EDB] font-semibold">
                        {selectedRows.length} employee{selectedRows.length > 1 ? 's' : ''} selected
                    </span>
                    <div className="flex items-center gap-2">
                        <select 
                            value={bulkShift}
                            onChange={(e) => setBulkShift(e.target.value)}
                            className="h-8 px-2 border border-[#CECECE] rounded-lg bg-white text-xs text-[#494949]"
                        >
                            <option value="Day">Day Shift</option>
                            <option value="Night">Night Shift</option>
                            <option value="Evening">Evening Shift</option>
                            <option value="Unassigned">Unassigned</option>
                        </select>
                        <button
                            onClick={handleBulkApply}
                            className="px-4 py-1.5 bg-[#7D1EDB] hover:bg-purple-700 text-white rounded-full text-xs font-semibold cursor-pointer transition-colors shadow-sm flex items-center gap-1"
                        >
                            <Check size={12} /> Assign to Selected
                        </button>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="flex-1 min-h-0 overflow-y-auto border border-[#CECECE] rounded-lg">
                <table className="w-full relative border-collapse">
                    <thead className="sticky top-0 z-10 bg-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        <tr className="text-left text-[13px] border-b border-[#CECECE]">
                            <th className="py-3 px-6 text-[#757575] font-normal w-[10%] text-center">
                                <input 
                                    type="checkbox" 
                                    className="w-4 h-4 rounded border-[#1F1F1F] text-[#7D1EDB] focus:ring-[#7D1EDB]"
                                    checked={currentItems.length > 0 && selectedRows.length === currentItems.length}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th className="py-3 px-6 text-[#757575] font-normal w-[15%]">
                                Employee ID
                            </th>
                            <th className="py-3 px-6 text-[#757575] font-normal w-[30%]">
                                Employee Name
                            </th>
                            <th className="py-3 px-6 text-[#757575] font-normal w-[20%] text-center">
                                Shift Assignment
                            </th>
                            <th className="py-3 px-6 text-[#757575] font-normal w-[15%] text-center">
                                Roster Date
                            </th>
                            <th className="py-3 px-6 text-[#757575] font-normal w-[10%] text-right">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="py-8 text-center text-gray-500">
                                    Loading employee roster...
                                </td>
                            </tr>
                        ) : currentItems.length > 0 ? (
                            currentItems.map((emp) => {
                                const currentShift = assignments[emp.id] || "Unassigned";
                                return (
                                    <tr key={emp.id} className="hover:bg-gray-50 transition-colors text-[13px] font-medium text-[#1E1E1E] border-b border-[#E5E7EB]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                                        <td className="py-3.5 px-6 text-center">
                                            <input 
                                                type="checkbox" 
                                                className="w-4 h-4 rounded border-[#1F1F1F] text-[#7D1EDB] focus:ring-[#7D1EDB]"
                                                checked={selectedRows.includes(emp.id)}
                                                onChange={() => handleSelectRow(emp.id)}
                                            />
                                        </td>
                                        <td className="py-3.5 px-6 text-gray-500 font-semibold">
                                            {emp.empId}
                                        </td>
                                        <td className="py-3.5 px-6 text-gray-800">
                                            {emp.name}
                                        </td>
                                        <td className="py-3.5 px-6 text-center">
                                            <select
                                                value={currentShift}
                                                onChange={(e) => handleShiftChange(emp.id, e.target.value)}
                                                className="h-8 px-2 border border-[#CECECE] rounded-lg bg-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#7D1EDB] w-40 text-center mx-auto"
                                            >
                                                <option value="Unassigned">Unassigned</option>
                                                <option value="Day">Day Shift</option>
                                                <option value="Night">Night Shift</option>
                                                <option value="Evening">Evening Shift</option>
                                            </select>
                                        </td>
                                        <td className="py-3.5 px-6 text-center text-gray-600 font-normal">
                                            {selectedDate}
                                        </td>
                                        <td className="py-3.5 px-6 text-right">
                                            {currentShift === "Unassigned" ? (
                                                <span className="inline-block px-2.5 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs font-bold border border-gray-200">
                                                    Off-Duty
                                                </span>
                                            ) : (
                                                <span className="inline-block px-2.5 py-0.5 bg-[#E4F8D2] text-[#76DB1E] rounded-full text-xs font-bold border border-[#D0F2B4]">
                                                    Scheduled
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={6} className="py-8 text-center text-gray-400">
                                    No employees found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            {totalPages > 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center mt-4 px-2 shrink-0 text-sm text-gray-500 gap-4">
                    <div className="text-center md:text-left font-inter">
                        Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredEmployees.length)} Of {filteredEmployees.length}
                    </div>

                    <div className="flex items-center justify-center md:justify-end lg:justify-center gap-2">
                        <button 
                            onClick={handlePrev}
                            disabled={currentPage === 1}
                            className={`flex items-center gap-1 text-sm font-inter ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <ArrowLeft size={16} /> Previous
                        </button>
                        
                        <div className="flex gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                <button
                                    key={number}
                                    onClick={() => setCurrentPage(number)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium ${
                                        currentPage === number
                                            ? 'bg-[#7D1EDB] text-white'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    {number}
                                </button>
                            ))}
                        </div>

                        <button 
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                            className={`flex items-center gap-1 text-sm font-inter ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Next <ArrowRight size={16} />
                        </button>
                    </div>
                    
                    <div className="hidden lg:block"></div>
                </div>
            )}
        </div>
    );
};

export default ShiftAssignment;
