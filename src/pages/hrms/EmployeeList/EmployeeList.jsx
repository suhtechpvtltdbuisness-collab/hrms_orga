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

    return (
        <div className="bg-white p-6 mx-4 mt-4 rounded-xl h-[calc(100vh-50px)] flex flex-col border border-[#D9D9D9] font-sans" style={{ fontFamily: 'Poppins, sans-serif' }}>
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
                        <Plus size={18} />
                        <span>Add Employee</span>
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
                            border: '1px solid transparent' // Can allow border color change on focus if needed
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Search by name,id,email..."
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
            <div className="overflow-x-auto overflow-y-auto flex-1 min-h-0">
                <table className="w-full">
                    <thead>
                        <tr className="text-left border-b border-gray-100">
                            <th className="py-4 px-4 w-10">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                            </th>
                            <th className="py-4 px-4 text-sm font-normal text-[#707070] uppercase tracking-wider">
                                <div className="flex items-center cursor-pointer hover:text-gray-700">
                                    SR NO <ChevronDown className="ml-1 w-3 h-3" />
                                </div>
                            </th>
                            <th className="py-4 px-4 text-sm font-normal text-[#707070] uppercase tracking-wider">
                                <div className="flex items-center cursor-pointer hover:text-gray-700">
                                    EMP NAME <ChevronDown className="ml-1 w-3 h-3" />
                                </div>
                            </th>
                            <th className="py-4 px-4 text-sm font-normal text-[#707070] uppercase tracking-wider">
                                <div className="flex items-center cursor-pointer hover:text-gray-700">
                                    EMP ID <ChevronDown className="ml-1 w-3 h-3" />
                                </div>
                            </th>
                            <th className="py-4 px-4 text-sm font-normal text-[#707070] uppercase tracking-wider">
                                <div className="flex items-center cursor-pointer hover:text-gray-700">
                                    DEPARTMENT <ChevronDown className="ml-1 w-3 h-3" />
                                </div>
                            </th>
                            <th className="py-4 px-4 text-sm font-normal text-[#707070] uppercase tracking-wider">
                                <div className="flex items-center cursor-pointer hover:text-gray-700">
                                    DESIGNATION <ChevronDown className="ml-1 w-3 h-3" />
                                </div>
                            </th>
                            <th className="py-4 px-4 text-sm font-normal text-[#707070] uppercase tracking-wider">
                                <div className="flex items-center cursor-pointer hover:text-gray-700">
                                    JOINING DATE <ChevronDown className="ml-1 w-3 h-3" />
                                </div>
                            </th>
                            <th className="py-4 px-4 text-sm font-normal text-[#707070] uppercase tracking-wider">
                                <div className="flex items-center cursor-pointer hover:text-gray-700">
                                    CONTACT <ChevronDown className="ml-1 w-3 h-3" />
                                </div>
                            </th>
                            <th className="py-4 px-4 text-sm font-normal text-[#707070] uppercase tracking-wider">
                                <div className="flex items-center cursor-pointer hover:text-gray-700">
                                    STATUS <ChevronDown className="ml-1 w-3 h-3" />
                                </div>
                            </th>
                            <th className="py-4 px-4 text-sm font-normal text-[#707070] uppercase tracking-wider">ACTION</th>
                        </tr>
                    </thead>
                    <tbody >
                        {employees.length > 0 ? (
                            employees.map((employee, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 group transition-colors">
                                    <td className="py-2 px-4">
                                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                                    </td>
                                    <td className="py-4 px-4 text-sm font-normal text-[#1E1E1E]">{employee.srNo}</td>
                                    <td className="py-4 px-4 text-sm font-medium text-purple-600">{employee.name}</td>
                                    <td className="py-4 px-4 text-sm font-normal text-[#1E1E1E]">{employee.empId}</td>
                                    <td className="py-4 px-4 text-sm font-normal text-gray-900">{employee.department}</td>
                                    <td className="py-4 px-4 text-sm font-normal text-[#1E1E1E]">{employee.designation}</td>
                                    <td className="py-4 px-4 text-sm font-normal text-[#1E1E1E]">{employee.joiningDate}</td>
                                    <td className="py-4 px-4 text-sm font-normal text-[#1E1E1E]">{employee.contact}</td>
                                    <td className="py-4 px-4">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-normal bg-[#76DB1E33] text-[#34C759]">
                                            {employee.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <button className="text-purple-600 hover:text-purple-800 transition-colors">
                                                <Eye size={18} />
                                            </button>
                                            <button className="text-purple-600 hover:text-purple-800 transition-colors">
                                                <Pencil size={18} />
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
            <div className="relative flex items-center justify-center mt-6 pt-4 border-t border-gray-100 text-sm text-gray-500">
                <div className="absolute left-0">Showing 1-10 Of 100</div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 hover:text-gray-900 transition-colors">
                        <ChevronLeft size={16} /> Previous
                    </button>
                    <div className="flex gap-1 ">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-600 text-white font-medium">1</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600">2</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600">3</button>
                        <span className="w-8 h-8 flex items-center justify-center text-gray-400">...</span>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600">6</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600">7</button>
                    </div>
                    <button className="flex items-center gap-1 hover:text-gray-900 transition-colors">
                        Next <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmployeeList;
