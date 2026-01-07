import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Download,
    Plus,
    ChevronDown,
    Eye,
    ArrowLeft,
    ArrowRight,
} from 'lucide-react';

const FilterDropdown = ({ label, options, value, onChange, minWidth = '150px' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between px-4 py-3 bg-[#EEECFF] text-[#7D1EDB] rounded-[12px] text-sm font-normal outline-none hover:bg-purple-100 transition-colors"
                style={{ minWidth }}
            >
                <span>{value || label}</span>
                <ChevronDown size={16} className={`transition-transform duration-200 ml-2 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div
                    className="absolute top-full left-0 mt-2 bg-white z-20 flex flex-col font-light"
                    style={{
                        width: minWidth,
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: '0px 4px 14px 0px #0000001A',
                        fontFamily: 'Montserrat, sans-serif'
                    }}
                >
                    <div
                        onClick={() => { onChange(''); setIsOpen(false); }}
                        className="px-4 flex items-center cursor-pointer hover:bg-purple-50 transition-colors"
                        style={{ minHeight: '44px', fontSize: '16px', color: '#333333' }}
                    >
                        All
                    </div>
                    {options.map((opt) => (
                        <div
                            key={opt}
                            onClick={() => { onChange(opt); setIsOpen(false); }}
                            className="px-4 py-2 flex items-center cursor-pointer hover:bg-purple-50 transition-colors"
                            style={{ minHeight: '44px', fontSize: '16px', color: '#333333', lineHeight: '1.2' }}
                        >
                            {opt}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const EmployeeList = () => {
    // Mock Data
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [employees] = useState([
        { srNo: "01", name: "Rohan Sharma", empId: "EMP-001", department: "Engineering", designation: "Frontend Developer", joiningDate: "10 Jan 2023", contact: "rohan.s@tech.com", status: "Active" },
        { srNo: "02", name: "Priya Singh", empId: "EMP-002", department: "HR", designation: "HR Manager", joiningDate: "15 Mar 2022", contact: "priya.singh@tech.com", status: "Active" },
        { srNo: "03", name: "Amit Patel", empId: "EMP-003", department: "Sales", designation: "Sales Executive", joiningDate: "22 Jun 2023", contact: "amit.p@tech.com", status: "Active" },
        { srNo: "04", name: "Sarah Jenkins", empId: "EMP-004", department: "Marketing", designation: "Content Strategist", joiningDate: "05 Sep 2021", contact: "sarah.j@tech.com", status: "Active" },
        { srNo: "05", name: "Michael Chen", empId: "EMP-005", department: "Engineering", designation: "Backend Developer", joiningDate: "12 Nov 2022", contact: "michael.c@tech.com", status: "Active" },
        { srNo: "06", name: "Anjali Gupta", empId: "EMP-006", department: "Finance", designation: "Accountant", joiningDate: "30 Jan 2020", contact: "anjali.g@tech.com", status: "Active" },
        { srNo: "07", name: "David Kim", empId: "EMP-007", department: "Design", designation: "UI/UX Designer", joiningDate: "14 Jul 2023", contact: "david.k@tech.com", status: "Active" },
        { srNo: "08", name: "Emily Davis", empId: "EMP-008", department: "Engineering", designation: "QA Engineer", joiningDate: "01 Feb 2022", contact: "emily.d@tech.com", status: "Active" },
        { srNo: "09", name: "James Wilson", empId: "EMP-009", department: "Operations", designation: "Operations Manager", joiningDate: "18 Apr 2019", contact: "james.w@tech.com", status: "Active" },
        { srNo: "10", name: "Sofia Rodriguez", empId: "EMP-010", department: "Sales", designation: "Sales Lead", joiningDate: "09 Oct 2021", contact: "sofia.r@tech.com", status: "Active" },
        { srNo: "11", name: "Daniel Lee", empId: "EMP-011", department: "Engineering", designation: "DevOps Engineer", joiningDate: "25 May 2023", contact: "daniel.l@tech.com", status: "Active" },
        { srNo: "12", name: "Neha Verma", empId: "EMP-012", department: "HR", designation: "Recruiter", joiningDate: "11 Aug 2022", contact: "neha.v@tech.com", status: "Active" },
        { srNo: "13", name: "Christopher Martin", empId: "EMP-013", department: "Management", designation: "Director", joiningDate: "01 Jan 2018", contact: "chris.m@tech.com", status: "Active" },
        { srNo: "14", name: "Isabella Garcia", empId: "EMP-014", department: "Marketing", designation: "SEO Specialist", joiningDate: "19 Dec 2022", contact: "isabella.g@tech.com", status: "Active" },
        { srNo: "15", name: "Arjun Kumar", empId: "EMP-015", department: "Engineering", designation: "Full Stack Developer", joiningDate: "03 Mar 2021", contact: "arjun.k@tech.com", status: "Active" }
    ]);

    // Sorting & Search Logic
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        department: '',
        designation: '',
        status: ''
    });

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

    return (
        <div className="bg-white px-4 sm:px-6 md:px-8 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-9rem)] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-10rem)] xl:h-[calc(100vh-11rem)] flex flex-col border border-[#D9D9D9] font-sans" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-xl font-semibold text-gray-800">Employee List</h1>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    {/* Export Button */}
                    <button
                        className="flex items-center justify-center gap-2 text-purple-600 font-medium hover:bg-purple-50 transition-colors bg-white w-full sm:w-auto min-w-[110px]"
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
            <div className="flex-1 min-h-0 overflow-y-auto">
                <table className="w-full">
                    <thead className="sticky top-0 bg-white z-10">
                        <tr className="text-left">
                            <th className="py-4 px-2 w-10 bg-white">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border border-[#7D1EDB] accent-[#7D1EDB] cursor-pointer"
                                    style={{ borderColor: '#7D1EDB' }}
                                    checked={employees.length > 0 && selectedEmployees.length === employees.length}
                                    onChange={handleSelectAll}
                                />
                            </th>

                            <th onClick={() => handleSort('srNo')} className="py-4 px-2 text-[14px] font-normal text-[#707070] uppercase tracking-wider bg-white cursor-pointer select-none">
                                <div className="flex items-center hover:text-gray-900 transition-colors whitespace-nowrap">
                                    SR NO <img src="/images/sort_arrow.svg" alt="sort" className={`ml-1 transition-transform duration-200 ${sortConfig.key === 'srNo' && sortConfig.direction === 'descending' ? 'rotate-180' : ''}`} />
                                </div>
                            </th>
                            <th onClick={() => handleSort('name')} className="py-4 px-2 text-[14px] font-normal text-[#707070] uppercase tracking-wider bg-white cursor-pointer select-none">
                                <div className="flex items-center hover:text-gray-900 transition-colors whitespace-nowrap">
                                    EMP NAME <img src="/images/sort_arrow.svg" alt="sort" className={`ml-1 transition-transform duration-200 ${sortConfig.key === 'name' && sortConfig.direction === 'descending' ? 'rotate-180' : ''}`} />
                                </div>
                            </th>
                            <th onClick={() => handleSort('empId')} className="py-4 px-2 text-[14px] font-normal text-[#707070] uppercase tracking-wider bg-white cursor-pointer select-none">
                                <div className="flex items-center hover:text-gray-900 transition-colors whitespace-nowrap">
                                    EMP ID <img src="/images/sort_arrow.svg" alt="sort" className={`ml-1 transition-transform duration-200 ${sortConfig.key === 'empId' && sortConfig.direction === 'descending' ? 'rotate-180' : ''}`} />
                                </div>
                            </th>
                            <th onClick={() => handleSort('department')} className="py-4 px-2 text-[14px] font-normal text-[#707070] uppercase tracking-wider bg-white cursor-pointer select-none">
                                <div className="flex items-center hover:text-gray-900 transition-colors whitespace-nowrap">
                                    DEPARTMENT <img src="/images/sort_arrow.svg" alt="sort" className={`ml-1 transition-transform duration-200 ${sortConfig.key === 'department' && sortConfig.direction === 'descending' ? 'rotate-180' : ''}`} />
                                </div>
                            </th>
                            <th onClick={() => handleSort('designation')} className="py-4 px-2 text-[14px] font-normal text-[#707070] uppercase tracking-wider bg-white cursor-pointer select-none">
                                <div className="flex items-center hover:text-gray-900 transition-colors whitespace-nowrap">
                                    DESIGNATION <img src="/images/sort_arrow.svg" alt="sort" className={`ml-1 transition-transform duration-200 ${sortConfig.key === 'designation' && sortConfig.direction === 'descending' ? 'rotate-180' : ''}`} />
                                </div>
                            </th>
                            <th onClick={() => handleSort('joiningDate')} className="py-4 px-2 text-[14px] font-normal text-[#707070] uppercase tracking-wider bg-white cursor-pointer select-none">
                                <div className="flex items-center hover:text-gray-900 transition-colors whitespace-nowrap">
                                    JOINING DATE <img src="/images/sort_arrow.svg" alt="sort" className={`ml-1 transition-transform duration-200 ${sortConfig.key === 'joiningDate' && sortConfig.direction === 'descending' ? 'rotate-180' : ''}`} />
                                </div>
                            </th>
                            <th onClick={() => handleSort('contact')} className="py-4 px-2 text-[14px] font-normal text-[#707070] uppercase tracking-wider bg-white cursor-pointer select-none">
                                <div className="flex items-center hover:text-gray-900 transition-colors whitespace-nowrap">
                                    CONTACT <img src="/images/sort_arrow.svg" alt="sort" className={`ml-1 transition-transform duration-200 ${sortConfig.key === 'contact' && sortConfig.direction === 'descending' ? 'rotate-180' : ''}`} />
                                </div>
                            </th>
                            <th onClick={() => handleSort('status')} className="py-4 px-2 text-[14px] font-normal text-[#707070] uppercase tracking-wider bg-white cursor-pointer select-none">
                                <div className="flex items-center hover:text-gray-900 transition-colors whitespace-nowrap">
                                    STATUS <img src="/images/sort_arrow.svg" alt="sort" className={`ml-1 transition-transform duration-200 ${sortConfig.key === 'status' && sortConfig.direction === 'descending' ? 'rotate-180' : ''}`} />
                                </div>
                            </th>
                            <th className="py-4 px-2 text-[14px] font-normal text-[#707070] uppercase tracking-wider bg-white">ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
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

                                    <td className="py-4 px-2 text-[16px] font-normal text-[#1E1E1E]">{employee.srNo}</td>
                                    <td className="py-4 px-2 text-[16px] font-normal text-[#7268FF]">{employee.name}</td>
                                    <td className="py-4 px-2 text-[16px] font-normal text-[#1E1E1E]">{employee.empId}</td>
                                    <td className="py-4 px-2 text-[16px] font-normal text-gray-900">{employee.department}</td>
                                    <td className="py-4 px-2 text-[16px] font-normal text-[#1E1E1E]">{employee.designation}</td>
                                    <td className="py-4 px-2 text-[16px] font-normal text-[#1E1E1E]">{employee.joiningDate}</td>
                                    <td className="py-4 px-2 text-[16px] font-normal text-[#1E1E1E]">{employee.contact}</td>
                                    <td className="py-4 px-2">
                                        <span className={`inline-flex items-center justify-center px-4 py-1 rounded-[18px] text-sm h-[34px] min-w-[80px] font-normal whitespace-nowrap ${employee.status === 'Active' ? 'bg-[#76DB1E33] text-[#34C759]' :
                                            // employee.status === 'Inactive' ? 'bg-[#FF3B301A] text-[#FF3B30]' :
                                            //     employee.status === 'On Leave' ? 'bg-[#FF95001A] text-[#FF9500]' :
                                            'bg-gray-100 text-gray-600'
                                            }`}>
                                            {employee.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-2">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => navigate('/hrms/employees-details')}
                                                className="text-purple-600 hover:text-purple-800 transition-colors cursor-pointer">
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => navigate("/hrms/employees-details-update")}
                                                className="text-purple-600 hover:text-purple-800 transition-colors cursor-pointer"
                                            >
                                                <img src="/images/pencil_Icon.svg" alt="edit" style={{ width: '15px', height: '15px' }} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10" className="py-16 text-center">
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
        </div>
    );
};

export default EmployeeList;
