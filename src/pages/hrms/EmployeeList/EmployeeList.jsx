import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Download,
    Plus,
    Search,
    ChevronDown,
    Eye,
    Pencil,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal
} from 'lucide-react';

const EmployeeList = () => {
    // Mock Data
    // const [employees] = useState([]); 
    const [employees] = useState(Array(10).fill({
        name: "Olivia Rhye",
        empId: "Emp-00123",
        department: "Engineering",
        designation: "Software Engineer",
        joiningDate: "15 Jan 2022",
        contact: "Olivia.R@Corp.Com",
        status: "Active"
    }).map((emp, index) => ({ ...emp, srNo: String(index + 1).padStart(2, '0') })));

    const [searchQuery, setSearchQuery] = useState('');

    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.contact.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold text-gray-800">Employee List</h1>

                <div className="flex gap-4">
                    {/* Export Button */}
                    <button
                        className="flex items-center justify-center gap-2 text-purple-600 font-medium hover:bg-purple-50 transition-colors bg-white"
                        style={{
                            width: '110px',
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
                        className="flex items-center justify-center gap-2 text-white font-medium hover:bg-purple-700 transition-colors bg-[#7D1EDB]"
                        style={{
                            width: '177px',
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
            <div className="flex justify-between items-center mb-4 h-12">
                {/* Search Bar */}
                <div className="relative">
                    <div
                        className="flex items-center bg-gray-50 text-gray-400"
                        style={{
                            width: '380px',
                            height: '48px',
                            padding: '2px 32px 2px 24px',
                            borderRadius: '32px',
                            border: '1px solid transparent' 
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Search by name,id,email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent w-full outline-none text-gray-700 placeholder-[#B3B3B3] text-base font-normal"
                        />
                    </div>
                </div>

                {/* Filter Dropdowns */}
                <div className="flex gap-3">
                    {['Department', 'Designation', 'Status'].map((filter) => (
                        <button
                            key={filter}
                            className="flex items-center gap-2 px-4 py-3 text-sm font-normal text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                            style={{ backgroundColor: '#EEECFF' }}
                        >
                            {filter}
                            <ChevronDown size={16} />
                        </button>
                    ))}
                </div>
            </div>

            {/* Table Section */}
            <div className="flex-1 min-h-0 overflow-y-auto">
                <table className="w-full">
                    <thead className="sticky top-0 bg-white z-10">
                        <tr className="text-left border-b border-gray-100">
                            <th className="py-4 px-4 w-10 bg-white">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border border-[#7D1EDB] accent-[#7D1EDB] cursor-pointer"
                                    style={{ borderColor: '#7D1EDB' }}
                                    checked={employees.length > 0 && selectedEmployees.length === employees.length}
                                    onChange={handleSelectAll}
                                />
                            </th>

                            <th className="py-4 px-4 text-[14px] font-normal text-[#707070] uppercase tracking-wider bg-white">
                                <div className="flex items-center cursor-pointer hover:text-gray-700">
                                    SR NO <img src="/images/sort_arrow.svg" alt="sort" className="ml-1" />
                                </div>
                            </th>
                            <th className="py-4 px-4 text-[14px] font-normal text-[#707070] uppercase tracking-wider bg-white">
                                <div className="flex items-center cursor-pointer hover:text-gray-700">
                                    EMP NAME <img src="/images/sort_arrow.svg" alt="sort" className="ml-1" />
                                </div>
                            </th>
                            <th className="py-4 px-4 text-[14px] font-normal text-[#707070] uppercase tracking-wider bg-white">
                                <div className="flex items-center cursor-pointer hover:text-gray-700">
                                    EMP ID <img src="/images/sort_arrow.svg" alt="sort" className="ml-1" />
                                </div>
                            </th>
                            <th className="py-4 px-4 text-[14px] font-normal text-[#707070] uppercase tracking-wider bg-white">
                                <div className="flex items-center cursor-pointer hover:text-gray-700">
                                    DEPARTMENT <img src="/images/sort_arrow.svg" alt="sort" className="ml-1" />
                                </div>
                            </th>
                            <th className="py-4 px-4 text-[14px] font-normal text-[#707070] uppercase tracking-wider bg-white">
                                <div className="flex items-center cursor-pointer hover:text-gray-700">
                                    DESIGNATION <img src="/images/sort_arrow.svg" alt="sort" className="ml-1" />
                                </div>
                            </th>
                            <th className="py-4 px-4 text-[14px] font-normal text-[#707070] uppercase tracking-wider bg-white">
                                <div className="flex items-center cursor-pointer hover:text-gray-700">
                                    JOINING DATE <img src="/images/sort_arrow.svg" alt="sort" className="ml-1" />
                                </div>
                            </th>
                            <th className="py-4 px-4 text-[14px] font-normal text-[#707070] uppercase tracking-wider bg-white">
                                <div className="flex items-center cursor-pointer hover:text-gray-700">
                                    CONTACT <img src="/images/sort_arrow.svg" alt="sort" className="ml-1" />
                                </div>
                            </th>
                            <th className="py-4 px-4 text-[14px] font-normal text-[#707070] uppercase tracking-wider bg-white">
                                <div className="flex items-center cursor-pointer hover:text-gray-700">
                                    STATUS <img src="/images/sort_arrow.svg" alt="sort" className="ml-1" />
                                </div>
                            </th>
                            <th className="py-4 px-4 text-[14px] font-normal text-[#707070] uppercase tracking-wider bg-white">ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.length > 0 ? (
                            filteredEmployees.map((employee, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 group transition-colors border-b border-gray-50 font-Poppins">
                                    <td className="py-2 px-4">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border border-[#7D1EDB] accent-[#7D1EDB] cursor-pointer"
                                            style={{ borderColor: '#7D1EDB' }}
                                            checked={selectedEmployees.includes(employee.srNo)}
                                            onChange={() => handleSelectEmployee(employee.srNo)}
                                        />
                                    </td>

                                    <td className="py-4 px-4 text-[16px] font-normal text-[#1E1E1E]">{employee.srNo}</td>
                                    <td className="py-4 px-4 text-[16px] font-normal text-[#7268FF]">{employee.name}</td>
                                    <td className="py-4 px-4 text-[16px] font-normal text-[#1E1E1E]">{employee.empId}</td>
                                    <td className="py-4 px-4 text-[16px] font-normal text-gray-900">{employee.department}</td>
                                    <td className="py-4 px-4 text-[16px] font-normal text-[#1E1E1E]">{employee.designation}</td>
                                    <td className="py-4 px-4 text-[16px] font-normal text-[#1E1E1E]">{employee.joiningDate}</td>
                                    <td className="py-4 px-4 text-[16px] font-normal text-[#1E1E1E]">{employee.contact}</td>
                                    <td className="py-4 px-4">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-normal bg-[#76DB1E33] text-[#34C759]">
                                            {employee.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
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
                                <td colSpan="10" className="py-10 text-center">
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
            <div className="relative flex items-center justify-center mt-6 pt-4 border-t border-gray-100 text-sm text-gray-500">
                <div className="absolute left-0">Showing 1-10 Of 100</div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 hover:text-gray-900 transition-colors">
                        <ChevronLeft size={16} /> Previous
                    </button>
                    <div className="flex gap-1 ">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-600 text-white font-medium">1</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-[#1E1E1E]">2</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-[#1E1E1E]">3</button>
                        <span className="w-8 h-8 flex items-center justify-center text-[#1E1E1E]">...</span>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-[#1E1E1E]">6</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-[#1E1E1E]">7</button>
                    </div>
                    <button className="flex items-center gap-1 text-[#1E1E1E] transition-colors">
                        Next <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmployeeList;