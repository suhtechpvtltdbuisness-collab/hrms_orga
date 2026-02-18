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

    // Fetch employees from API
    useEffect(() => {
        const fetchEmployees = async () => {
            setIsLoading(true);
            try {
                // Get admin ID from stored user data
                const userData = JSON.parse(localStorage.getItem("userData") || "{}");
                const adminId = userData.id;
                
                if (adminId) {
                    const response = await employeeService.getAllEmployees(adminId);
                    if (response.success && response.data) {
                        // Map API data to table format
                        const mappedEmployees = response.data.map((item, index) => ({
                            srNo: String(index + 1).padStart(2, '0'),
                            name: item.user?.name || '-',
                            empId: `EMP-${String(item.user?.id).padStart(3, '0')}`,
                            department: item.user?.department || '-',
                            designation: item.user?.designation || '-',
                            joiningDate: item.user?.createdAt ? new Date(item.user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-',
                            contact: item.user?.email || '-',
                            phone: item.user?.phone || '-',
                            status: item.user?.active ? 'Active' : 'Inactive',
                            gender: item.user?.gender || '-',
                            id: item.user?.id,
                            employeeId: item.employee?.id,
                        }));
                        setEmployees(mappedEmployees);
                    }
                }
            } catch (error) {
                console.error("Error fetching employees:", error);
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
        <div className="bg-white px-4 sm:px-4 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col border border-[#D9D9D9] font-sans" style={{ fontFamily: 'Poppins, sans-serif' }}>
            
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 shrink-0">
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
                <span className="text-[#6B7280]">Employee List</span>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-xl font-semibold text-gray-800">Employee List</h1>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    {/* Export Button */}
                    <button
                        onClick={handleExportPDF}
                        className="flex items-center cursor-pointer justify-center gap-2 text-[#7D1EDB] font-medium hover:bg-purple-50 transition-colors bg-white w-full sm:w-auto min-w-[110px]"
                        style={{
                            height: '48px',
                            padding: '10px 16px',
                            borderRadius: '26px',
                            border: '1px solid #7D1EDB'
                        }}
                    >
                        <span>Export</span>
                        <Download size={18} />
                    </button>

                    {/* Add Employee Button */}
                    <Link
                        to="/hrms/employees/add"
                        className="flex items-center justify-center gap-2 text-white font-medium hover:bg-purple-700 transition-colors bg-[#7D1EDB] w-full sm:w-auto min-w-[177px]"
                        style={{
                            height: '48px',
                            padding: '10px 16px',
                            borderRadius: '26px'
                        }}
                    >
                        <span>Add Employee</span>
                        <Plus size={18} />
                    </Link>
                </div>
            </div>

            {/* Filters Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-4">
                {/* Search Bar */}
                <div className="relative w-full lg:w-[380px]">
                    <div
                        className="flex items-center bg-gray-50 text-gray-400 w-full"
                        style={{
                            height: '48px',
                            padding: '2px 32px 2px 24px',
                            borderRadius: '32px',
                            border: '1px solid transparent'
                        }}
                    >
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name,id,email..."
                            className="bg-transparent w-full outline-none text-gray-700 placeholder-[#B3B3B3] text-base font-normal"
                        />
                    </div>
                </div>

                {/* Filter Dropdowns */}
                <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                    {/* Department Filter */}
                    <FilterDropdown
                        label="Department"
                        options={DEPARTMENT_OPTIONS}
                        value={filters.department}
                        onChange={(val) => setFilters(prev => ({ ...prev, department: val }))}
                        minWidth="148px"
                    />

                    {/* Designation Filter */}
                    <FilterDropdown
                        label="Designation"
                        options={DESIGNATION_OPTIONS}
                        value={filters.designation}
                        onChange={(val) => setFilters(prev => ({ ...prev, designation: val }))}
                        minWidth="158px"
                    />

                    {/* Status Filter */}
                    <FilterDropdown
                        label="Status"
                        options={STATUS_OPTIONS}
                        value={filters.status}
                        onChange={(val) => setFilters(prev => ({ ...prev, status: val }))}
                        minWidth="120px"
                    />
                </div>
            </div>

            {/* Table Section */}
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto">
                <table className="w-full table-fixed">
                    <thead className="sticky top-0 bg-white z-10">
                        <tr className="text-left border-b border-gray-200">
                            <th className="py-3 px-1 w-[40px] bg-white">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border border-[#7D1EDB] accent-[#7D1EDB] cursor-pointer"
                                    style={{ borderColor: '#7D1EDB' }}
                                    checked={employees.length > 0 && selectedEmployees.length === employees.length}
                                    onChange={handleSelectAll}
                                />
                            </th>

                            <th onClick={() => handleSort('srNo')} className="py-3 px-1 w-[60px] text-[12px] font-normal text-[#707070] uppercase tracking-wider bg-white cursor-pointer select-none">
                                <div className="flex items-center hover:text-gray-900 transition-colors whitespace-nowrap">
                                    SR NO <img src="/images/sort_arrow.svg" alt="sort" className={`ml-1 transition-transform duration-200 ${sortConfig.key === 'srNo' && sortConfig.direction === 'descending' ? 'rotate-180' : ''}`} />
                                </div>
                            </th>
                            <th onClick={() => handleSort('name')} className="py-3 px-1 w-[140px] text-[12px] font-normal text-[#707070] uppercase tracking-wider bg-white cursor-pointer select-none">
                                <div className="flex items-center hover:text-gray-900 transition-colors whitespace-nowrap">
                                    EMP NAME <img src="/images/sort_arrow.svg" alt="sort" className={`ml-1 transition-transform duration-200 ${sortConfig.key === 'name' && sortConfig.direction === 'descending' ? 'rotate-180' : ''}`} />
                                </div>
                            </th>
                            <th onClick={() => handleSort('empId')} className="py-3 px-1 w-[90px] text-[12px] font-normal text-[#707070] uppercase tracking-wider bg-white cursor-pointer select-none">
                                <div className="flex items-center hover:text-gray-900 transition-colors whitespace-nowrap">
                                    EMP ID <img src="/images/sort_arrow.svg" alt="sort" className={`ml-1 transition-transform duration-200 ${sortConfig.key === 'empId' && sortConfig.direction === 'descending' ? 'rotate-180' : ''}`} />
                                </div>
                            </th>
                            <th onClick={() => handleSort('department')} className="py-3 px-1 w-[110px] text-[12px] font-normal text-[#707070] uppercase tracking-wider bg-white cursor-pointer select-none">
                                <div className="flex items-center hover:text-gray-900 transition-colors whitespace-nowrap">
                                    DEPARTMENT <img src="/images/sort_arrow.svg" alt="sort" className={`ml-1 transition-transform duration-200 ${sortConfig.key === 'department' && sortConfig.direction === 'descending' ? 'rotate-180' : ''}`} />
                                </div>
                            </th>
                            <th onClick={() => handleSort('designation')} className="py-3 px-1 w-[130px] text-[12px] font-normal text-[#707070] uppercase tracking-wider bg-white cursor-pointer select-none">
                                <div className="flex items-center hover:text-gray-900 transition-colors whitespace-nowrap">
                                    DESIGNATION <img src="/images/sort_arrow.svg" alt="sort" className={`ml-1 transition-transform duration-200 ${sortConfig.key === 'designation' && sortConfig.direction === 'descending' ? 'rotate-180' : ''}`} />
                                </div>
                            </th>
                            <th onClick={() => handleSort('joiningDate')} className="py-3 px-1 w-[130px] text-[12px] font-normal text-[#707070] uppercase tracking-wider bg-white cursor-pointer select-none">
                                <div className="flex items-center hover:text-gray-900 transition-colors whitespace-nowrap">
                                    JOINING DATE <img src="/images/sort_arrow.svg" alt="sort" className={`ml-1 transition-transform duration-200 ${sortConfig.key === 'joiningDate' && sortConfig.direction === 'descending' ? 'rotate-180' : ''}`} />
                                </div>
                            </th>
                            <th onClick={() => handleSort('contact')} className="py-3 px-1 w-[170px] text-[12px] font-normal text-[#707070] uppercase tracking-wider bg-white cursor-pointer select-none">
                                <div className="flex items-center hover:text-gray-900 transition-colors whitespace-nowrap">
                                    CONTACT <img src="/images/sort_arrow.svg" alt="sort" className={`ml-1 transition-transform duration-200 ${sortConfig.key === 'contact' && sortConfig.direction === 'descending' ? 'rotate-180' : ''}`} />
                                </div>
                            </th>
                            <th onClick={() => handleSort('status')} className="py-3 px-1 w-[90px] text-[12px] font-normal text-[#707070] uppercase tracking-wider bg-white cursor-pointer select-none">
                                <div className="flex items-center hover:text-gray-900 transition-colors whitespace-nowrap">
                                    STATUS <img src="/images/sort_arrow.svg" alt="sort" className={`ml-1 transition-transform duration-200 ${sortConfig.key === 'status' && sortConfig.direction === 'descending' ? 'rotate-180' : ''}`} />
                                </div>
                            </th>
                            <th className="py-3 px-1 w-[70px] text-[12px] font-normal text-[#707070] uppercase tracking-wider bg-white">ACTION</th>
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
                                                        navigate(`/hrms/employees-details-update/${employee.id}`);
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
