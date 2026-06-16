import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Download,
    Plus,
    ChevronDown,
    Eye,
    ArrowLeft,
    ArrowRight,
    ChevronRight,
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import FilterDropdown from '../../../../components/ui/FilterDropdown';
import AssignReportingManager from '../../OnboardedEmployeeList/ReportingManager/Assign/AssignReportingManager';
import AssignedModal from '../../OnboardedEmployeeList/ReportingManager/Assign/AssignedModal';
import SuccessModal from '../../OnboardedEmployeeList/ReportingManager/Assign/SuccessModal';
import { employeeService } from '../../../../service';



const EmployeeList = () => {
    // Mock Data
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    // Fetch employees from API
    useEffect(() => {
        const fetchEmployees = async () => {
            setIsLoading(true);
            setFetchError(null);
            try {
                const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                const adminId = userData?.id;

                if (!adminId) {
                    setFetchError('Could not determine admin ID. Please log out and log in again.');
                    setIsLoading(false);
                    return;
                }

                const response = await employeeService.getAllEmployeesByAdminId(adminId);
                if (response.success && response.data) {
                    const mappedEmployees = response.data.map((item, index) => {
                        const u = item.user || item;
                        return {
                            srNo: String(index + 1).padStart(2, '0'),
                            name: u.name || '-',
                            empId: `EMP-${String(u.id || index + 1).padStart(3, '0')}`,
                            department: u.department || '-',
                            designation: u.designation || '-',
                            joiningDate: u.createdAt
                                ? new Date(u.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                                : '-',
                            contact: u.email || '-',
                            phone: u.phone || '-',
                            status: u.active ? 'Active' : 'Inactive',
                            gender: u.gender || '-',
                            id: u.id,
                            employeeId: item.employee?.id,
                        };
                    });
                    setEmployees(mappedEmployees);
                } else {
                    setFetchError(response.message || 'Failed to load employee data');
                }
            } catch {
                setFetchError('An unexpected error occurred while loading employees');
            } finally {
                setIsLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    // Sorting & Search Logic
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        department: '',
        designation: '',
        status: ''
    });

    // Action Menu State
    const [activeActionMenu, setActiveActionMenu] = useState(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (activeActionMenu && !event.target.closest('.action-menu-container')) {
                setActiveActionMenu(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeActionMenu]);

    // Modal States
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isAssignedModalOpen, setIsAssignedModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [selectedEmployeeForAssign, setSelectedEmployeeForAssign] = useState(null);

    const handleOpenAssignModal = (employee) => {
        setSelectedEmployeeForAssign(employee);
        setIsAssignModalOpen(true);
        setActiveActionMenu(null);
    };

    const handleAssignSubmit = () => {
        setIsAssignModalOpen(false);
        setIsAssignedModalOpen(true);
    };

    const handleAssignedOk = () => {
        setIsAssignedModalOpen(false);
        setIsSuccessModalOpen(true);
    };

    const STATUS_OPTIONS = ["Active", "Inactive", "Probation",];
    const DEPARTMENT_OPTIONS = ["Technical ", "Product", "Business", "Operations", "Finance", "Security"];
    const DESIGNATION_OPTIONS = ["Frontend Developer", "Backend Developer", "DevOps", "UI/UX Designer", "Product Management", "Business Analysis", "Sales", "Customer Support", "HR", "Finance", "Legal"];

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const filteredEmployees = React.useMemo(() => {
        return employees.filter(emp => {
            const matchesSearch = !searchQuery || (
                emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.designation.toLowerCase().includes(searchQuery.toLowerCase())
            );

            const matchesDepartment = !filters.department || emp.department === filters.department;
            const matchesDesignation = !filters.designation || emp.designation === filters.designation;
            const matchesStatus = !filters.status || emp.status === filters.status;

            return matchesSearch && matchesDepartment && matchesDesignation && matchesStatus;
        });
    }, [employees, searchQuery, filters]);

    const sortedEmployees = React.useMemo(() => {
        let sortableItems = [...filteredEmployees];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                // Handle Date Sorting
                if (sortConfig.key === 'joiningDate') {
                    aValue = new Date(aValue);
                    bValue = new Date(bValue);
                }

                if (sortConfig.key === 'srNo') {
                    aValue = parseInt(aValue, 10);
                    bValue = parseInt(bValue, 10);
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredEmployees, sortConfig]);

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedEmployees.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage);

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // State for checkbox selection
    const [selectedEmployees, setSelectedEmployees] = useState([]);

    // Handle Select All
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allSrNos = employees.map(emp => emp.srNo);
            setSelectedEmployees(allSrNos);
        } else {
            setSelectedEmployees([]);
        }
    };

    // Handle Individual Selection
    const handleSelectEmployee = (srNo) => {
        setSelectedEmployees(prev => {
            if (prev.includes(srNo)) {
                return prev.filter(id => id !== srNo);
            } else {
                return [...prev, srNo];
            }
        });
    };

    const navigate = useNavigate();

    const handleExportPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text('Employee List', 14, 22);

        const tableColumn = ["Sr No", "Name", "Emp ID", "Department", "Designation", "Joining Date", "Contact", "Status"];
        const tableRows = employees.map(emp => [
            emp.srNo,
            emp.name,
            emp.empId,
            emp.department,
            emp.designation,
            emp.joiningDate,
            emp.contact,
            emp.status
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 30,
        });

        doc.save('Employee_List.pdf');
    };

    return (
        <div className="page-wrapper">

            {/* Breadcrumb */}
            <div className="breadcrumb">
                <span className="bc-link" onClick={() => navigate('/hrms')}>HRMS Dashboard</span>
                <ChevronRight size={13} />
                <span>Employee List</span>
            </div>

            {/* Header */}
            <div className="page-header">
                <h1 className="page-title">Employee List</h1>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                    <button onClick={handleExportPDF} className="btn-ghost">
                        <Download size={15} /> Export PDF
                    </button>
                    <Link to="/hrms/employees/add" className="btn-primary" style={{ textDecoration:'none' }}>
                        <Plus size={15} /> Add Employee
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'space-between', alignItems:'center', marginBottom:14, gap:10, flexShrink:0 }}>
                <div className="search-bar" style={{ flex:'1', minWidth:220, maxWidth:320 }}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name, ID, email…"
                    />
                </div>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                    <FilterDropdown label="Department" options={DEPARTMENT_OPTIONS} value={filters.department} onChange={(val) => setFilters(prev => ({ ...prev, department: val }))} minWidth="148px" className="btn-ghost" />
                    <FilterDropdown label="Designation" options={DESIGNATION_OPTIONS} value={filters.designation} onChange={(val) => setFilters(prev => ({ ...prev, designation: val }))} minWidth="148px" className="btn-ghost" />
                    <FilterDropdown label="Status" options={STATUS_OPTIONS} value={filters.status} onChange={(val) => setFilters(prev => ({ ...prev, status: val }))} minWidth="120px" className="btn-ghost" />
                </div>
            </div>

            {/* Table */}
            <div style={{ flex:1, minHeight:0, overflow:'auto', border:'1px solid #E5E7EB', borderRadius:10 }}>
                <table className="data-table" style={{ minWidth:900 }}>
                    <thead>
                        <tr>
                            <th style={{ width:36, padding:'10px 12px' }}>
                                <input type="checkbox" style={{ accentColor:'#7C3AED' }}
                                    checked={employees.length > 0 && selectedEmployees.length === employees.length}
                                    onChange={handleSelectAll} />
                            </th>
                            <th onClick={() => handleSort('srNo')} style={{ cursor:'pointer' }}>SR NO.</th>
                            <th onClick={() => handleSort('name')} style={{ cursor:'pointer' }}>EMPLOYEE NAME</th>
                            <th onClick={() => handleSort('empId')} style={{ cursor:'pointer' }}>EMP ID</th>
                            <th onClick={() => handleSort('department')} style={{ cursor:'pointer' }}>DEPARTMENT</th>
                            <th onClick={() => handleSort('designation')} style={{ cursor:'pointer' }}>DESIGNATION</th>
                            <th onClick={() => handleSort('joiningDate')} style={{ cursor:'pointer' }}>JOINING DATE</th>
                            <th onClick={() => handleSort('contact')} style={{ cursor:'pointer' }}>CONTACT</th>
                            <th onClick={() => handleSort('status')} style={{ cursor:'pointer' }}>STATUS</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="10" className="py-12 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7D1EDB] mb-4"></div>
                                        <p className="text-gray-500">Loading employees...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : fetchError ? (
                            <tr>
                                <td colSpan="10" className="py-12 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <p className="text-red-500 font-medium">{fetchError}</p>
                                    </div>
                                </td>
                            </tr>
                        ) : currentItems.length > 0 ? (
                            currentItems.map((employee, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 group transition-colors font-Poppins">
                                    <td className="py-2 px-2">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border border-[#7D1EDB] accent-[#7D1EDB] cursor-pointer"
                                            style={{ borderColor: '#7D1EDB' }}
                                            checked={selectedEmployees.includes(employee.srNo)}
                                            onChange={() => handleSelectEmployee(employee.srNo)}
                                        />
                                    </td>

                                    <td className="py-3 px-2 text-[14px] font-normal text-[#1E1E1E]">{employee.srNo}</td>
                                    <td className="py-3 px-2 text-[14px] font-normal text-[#7268FF]">{employee.name}</td>
                                    <td className="py-3 px-2 text-[14px] font-normal text-[#1E1E1E]">{employee.empId}</td>
                                    <td className="py-3 px-2 text-[14px] font-normal text-gray-900">{employee.department}</td>
                                    <td className="py-3 px-2 text-[14px] font-normal text-[#1E1E1E]">{employee.designation}</td>
                                    <td className="py-3 px-2 text-[14px] font-normal text-[#1E1E1E]">{employee.joiningDate}</td>
                                    <td className="py-3 px-2 text-[14px] font-normal text-[#1E1E1E]">{employee.contact}</td>
                                    <td className="py-3 px-2">
                                        <span className={`inline-flex items-center justify-center px-4 py-1 rounded-[18px] text-sm h-[34px] min-w-[80px] font-normal whitespace-nowrap ${employee.status === 'Active' ? 'bg-[#76DB1E33] text-[#34C759]' :
                                            // employee.status === 'Inactive' ? 'bg-[#FF3B301A] text-[#FF3B30]' :
                                            //     employee.status === 'On Leave' ? 'bg-[#FF95001A] text-[#FF9500]' :
                                            'bg-gray-100 text-gray-600'
                                            }`}>
                                            {employee.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-2">
                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/hrms/employees-details/${employee.id}/personal-information`);
                                                }}
                                                className="focus:outline-none transition-transform hover:scale-110"
                                            >
                                                <img src="/images/view.svg" alt="View" className="w-5 h-5 cursor-pointer" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/hrms/employees-details/${employee.id}/personal-information?mode=edit`);
                                                }}
                                                className="focus:outline-none transition-transform hover:scale-110"
                                            >
                                                <img src="/images/pencil_Icon.svg" alt="Edit" className="w-4 h-4 cursor-pointer" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10" className="py-12 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <img src="/images/emptyEmpList.png" alt="No Employees" className="mb-6 max-w-[400px]" />
                                        <h3 className="text-2xl font-medium text-black mb-2">No Employees found</h3>
                                        <p className="text-[#B3B3B3] text-lg mb-8">Get started by adding employees to the system</p>
                                        <Link
                                            to="/hrms/employees/add"
                                            className="flex items-center justify-center gap-2 text-white font-medium hover:bg-purple-700 transition-colors bg-[#7D1EDB]"
                                            style={{
                                                width: '177px',
                                                height: '48px',
                                                padding: '10px 16px',
                                                borderRadius: '26px'
                                            }}
                                        >
                                            <Plus size={18} />
                                            <span>Add Employee</span>
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center mt-6 pt-4 text-sm text-gray-500 gap-4">
                <div className="text-center md:text-left">
                    Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, employees.length)} Of {employees.length}
                </div>

                <div className="flex items-center justify-center md:justify-end lg:justify-center gap-2">
                    <button
                        onClick={handlePrev}
                        disabled={currentPage === 1}
                        className={`flex items-center gap-1 transition-colors ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'hover:text-gray-900'}`}
                    >
                        <ArrowLeft size={16} /> Previous
                    </button>

                    <div className="flex gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                            <button
                                key={number}
                                onClick={() => paginate(number)}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg ${currentPage === number
                                    ? 'bg-purple-600 text-white font-medium'
                                    : 'text-[#1E1E1E] hover:bg-gray-100'
                                    }`}
                            >
                                {number}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className={`flex items-center gap-1 transition-colors ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-[#1E1E1E] hover:text-gray-900'}`}
                    >
                        Next <ArrowRight size={16} />
                    </button>
                </div>

                <div className="hidden lg:block"></div>
            </div>

            {/* Modals */}
            <AssignReportingManager
                isOpen={isAssignModalOpen}
                onClose={() => setIsAssignModalOpen(false)}
                onAssign={handleAssignSubmit}
                employee={selectedEmployeeForAssign}
            />
            <AssignedModal
                isOpen={isAssignedModalOpen}
                onClose={() => setIsAssignedModalOpen(false)}
                onOk={handleAssignedOk}
                onViewTeam={() => {
                    setIsAssignedModalOpen(false);
                    navigate('/hrms/onboarded-employee-list/team-list');
                }}
            />
            <SuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                message="Assigned reporting manager Successfully"
            />
        </div>
    );
};

export default EmployeeList;
