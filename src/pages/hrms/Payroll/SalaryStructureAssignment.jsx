import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import CustomDatePicker from '../../../components/ui/CustomDatePicker';
import FilterDropdown from '../../../components/ui/FilterDropdown';

const SalaryStructureAssignment = () => {
    const navigate = useNavigate();

    // Initial State
    const [formData, setFormData] = useState({
        employee: 'EMP-0123',
        employeeName: 'Alice Smith',
        department: 'Development',
        designation: 'Software Engineer',
        salaryStructure: 'Monthly Salary Structure',
        company: 'SUH Tech',
        fromDate: '26/01/2026',
        baseSalary: '50,000',
        isActive: true
    });

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

    const handleDateChange = (date) => {
        setFormData(prev => ({ ...prev, fromDate: date }));
    };

    // Dropdown Options
    const EMPLOYEE_OPTIONS = ['EMP-0123', 'EMP-0124', 'EMP-0125'];
    const DEPARTMENT_OPTIONS = ['Development', 'Sales', 'HR', 'Marketing'];
    const DESIGNATION_OPTIONS = ['Software Engineer', 'Senior Engineer', 'Manager'];
    const STRUCTURE_OPTIONS = ['Monthly Salary Structure', 'Contract Structure'];

    return (
        <div className="bg-white px-4 sm:px-4 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col font-popins" style={{ fontFamily: 'Poppins, sans-serif' }}>
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
                <span className="text-[#6B7280]">Salary Structure Assignment</span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-4 shrink-0">
                <div className="flex items-center gap-4">
                    <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Salary Structure Assignment</h1>
                    <span className="px-2 py-1 bg-white border border-[#CAC4D0] rounded-lg text-[14px] text-[#1E1E1E] font-Roboto">Is Active</span>
                </div>
                
                <button
                    className="flex items-center justify-center gap-2 rounded-full py-2 px-3 text-white font-normal hover:bg-purple-700 transition-colors bg-[#7D1EDB]"
                    onClick={() => {}}
                >
                    <span className='text-[16px] font-normal text-white font-popins'>Save</span>
                </button>
            </div>

            {/* Form Content - Scrollable Area */}
            <div className="flex-1 w-full max-w-full overflow-y-auto pr-2 font-inter">
                
                {/* Employee Information */}
                <div className="border border-[#D6D6D6] rounded-lg p-4 mb-4">
                    <h2 className="text-[16px] font-medium text-[#1E1E1E] mb-3" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Employee Information</h2>
                    
                    {/* First Row: Employee, Name, Department */}
                    <div className="w-full lg:w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
                        {/* Employee */}
                        <div>
                            <label className="block text-[16px] font-normal font-inter text-[#1E1E1E] mb-1">Employee</label>
                            <FilterDropdown
                                options={EMPLOYEE_OPTIONS}
                                value={formData.employee}
                                onChange={(val) => handleDropdownChange('employee', val)}
                                className="w-full h-[38px] px-3 bg-white border border-[#E0E0E0] rounded-lg text-[16px] font-normal font-inter text-[#1E1E1E] focus:ring-1 focus:ring-[#7D1EDB] flex items-center justify-between"
                                showArrow={true}
                                dropdownWidth="100%"
                                align='left'
                                disableAllOption={true}
                            />
                        </div>
                        {/* Employee Name */}
                        <div>
                            <label className="block text-[16px] font-normal font-inter text-[#1E1E1E] mb-1">Employee Name</label>
                            <input 
                                type="text"
                                name="employeeName"
                                value={formData.employeeName}
                                onChange={handleChange}
                                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[16px] font-normal font-inter text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB]"
                            />
                        </div>
                        {/* Department */}
                        <div>
                            <label className="block text-[16px] font-normal font-inter text-[#1E1E1E] mb-1">Department</label>
                            <FilterDropdown
                                options={DEPARTMENT_OPTIONS}
                                value={formData.department}
                                onChange={(val) => handleDropdownChange('department', val)}
                                className="w-full h-[38px] px-3 bg-white border border-[#E0E0E0] rounded-lg text-[16px] font-normal font-inter text-[#1E1E1E] focus:ring-1 focus:ring-[#7D1EDB] flex items-center justify-between"
                                showArrow={true}
                                dropdownWidth="100%"
                                align='left'
                                disableAllOption={true}
                            />
                        </div>
                    </div>

                    {/* Second Row: Designation */}
                    <div className="w-full lg:w-[33%] md:w-[50%] mb-3">
                         {/* Designation */}
                         <div>
                            <label className="block text-[16px] font-normal font-inter text-[#1E1E1E] mb-1">Designation</label>
                            <FilterDropdown
                                options={DESIGNATION_OPTIONS}
                                value={formData.designation}
                                onChange={(val) => handleDropdownChange('designation', val)}
                                className="w-full h-[38px] px-3 bg-white border border-[#E0E0E0] rounded-lg text-[16px] font-normal font-inter text-[#1E1E1E] focus:ring-1 focus:ring-[#7D1EDB] flex items-center justify-between"
                                showArrow={true}
                                dropdownWidth="100%"
                                align='left'
                                disableAllOption={true}
                            />
                        </div>
                    </div>
                </div>

                {/* Structure Information */}
                <div className="border border-[#D6D6D6] rounded-lg p-4 mb-4">
                    <h2 className="text-[16px] font-medium text-[#1E1E1E] mb-3" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Structure Information</h2>
                    <div className="w-full lg:w-[66%] grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                         {/* Salary Structure */}
                         <div>
                            <label className="block text-[16px] font-normal font-inter text-[#1E1E1E] mb-1">Salary Structure</label>
                            <FilterDropdown
                                options={STRUCTURE_OPTIONS}
                                value={formData.salaryStructure}
                                onChange={(val) => handleDropdownChange('salaryStructure', val)}
                                className="w-full h-[38px] px-3 bg-white border border-[#E0E0E0] rounded-lg text-[16px] font-normal font-inter text-[#1E1E1E] focus:ring-1 focus:ring-[#7D1EDB] flex items-center justify-between"
                                showArrow={true}
                                dropdownWidth="100%"
                                align='left'
                                disableAllOption={true}
                            />
                        </div>
                        {/* Company */}
                        <div>
                            <label className="block text-[16px] font-normal font-inter text-[#1E1E1E] mb-1">Company</label>
                            <input 
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[16px] font-normal font-inter text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB]"
                            />
                        </div>
                    </div>
                </div>

                {/* Timeline */}
                <div className="border border-[#D6D6D6] rounded-lg p-4 mb-4">
                    <h2 className="text-[16px] font-medium text-[#1E1E1E] mb-3" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Timeline</h2>
                    <div className="w-full lg:w-[66%] grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        {/* From Date */}
                        <div>
                            <label className="block text-[16px] font-normal font-inter text-[#1E1E1E] mb-1">From Date</label>
                            <CustomDatePicker 
                                value={formData.fromDate}
                                onChange={handleDateChange}
                                className="w-full"
                            />
                        </div>
                        {/* Base Salary */}
                        <div>
                            <label className="block text-[16px] font-normal font-inter text-[#1E1E1E] mb-1">Base Salary</label>
                            <input 
                                type="text"
                                name="baseSalary"
                                value={formData.baseSalary}
                                onChange={handleChange}
                                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[16px] font-normal font-inter text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB]"
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SalaryStructureAssignment;
