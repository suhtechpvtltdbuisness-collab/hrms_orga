import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronDown } from 'lucide-react';
import CustomDatePicker from '../../../components/ui/CustomDatePicker';
import FilterDropdown from '../../../components/ui/FilterDropdown';

const PayrollEntry = () => {
    const navigate = useNavigate();

    // Initial State
    const [formData, setFormData] = useState({
        company: 'SUH Tech',
        payrollFrequency: 'Monthly',
        startDate: '26/01/2026',
        endDate: '26/01/2026',
        postingDate: '26/01/2026',
        costCenter: 'Operations',
        paymentAccount: 'Salary Account',
        filterEmployeeName: '',
        filterDepartment: '',
        filterDesignation: ''
    });

    const [selectedEmployees, setSelectedEmployees] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDropdownChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (name, date) => {
        setFormData(prev => ({ ...prev, [name]: date }));
    };

    // Mock Data
    const FREQUENCY_OPTIONS = ['Monthly', 'Daily', 'Yearly', 'Quarterly', 'Half-Yearly', 'Weekly', 'Bi-Weekly'];
    const ACCOUNT_OPTIONS = ['HDFC Bank – Salary Account', 'ICICI Bank – Payroll Account', 'SBI – Corporate Account', 'Axis Bank – Operations Account', 'Yes Bank – Salary Disbursement'];
    
    const employees = [
        { id: 'EMP-0123', name: 'Alice Carol', department: 'Engineering', designation: 'Developer' },
        { id: 'EMP-0124', name: 'Carol White', department: 'Technical', designation: 'Developer' },
        { id: 'EMP-0125', name: 'Mike Miller', department: 'Product', designation: 'Developer' },
        { id: 'EMP-0126', name: 'Nisha Gupta', department: 'Engineering', designation: 'Developer' },
        { id: 'EMP-0127', name: 'Alice Carol', department: 'Engineering', designation: 'UIUX' },
        { id: 'EMP-0128', name: 'Alice Carol', department: 'Engineering', designation: 'Business' },
        { id: 'EMP-0129', name: 'Alice Carol', department: 'Engineering', designation: 'Developer' },
        { id: 'EMP-0130', name: 'Alice Carol', department: 'Engineering', designation: 'Developer' },
    ];

    const toggleEmployee = (id) => {
        setSelectedEmployees(prev => 
            prev.includes(id) ? prev.filter(eid => eid !== id) : [...prev, id]
        );
    };

    const toggleAllEmployees = () => {
        if (selectedEmployees.length === employees.length) {
            setSelectedEmployees([]);
        } else {
            setSelectedEmployees(employees.map(e => e.id));
        }
    };

    const filteredEmployees = employees.filter(emp => {
        const matchName = !formData.filterEmployeeName || emp.name === formData.filterEmployeeName;
        const matchDept = !formData.filterDepartment || emp.department === formData.filterDepartment;
        const matchDesig = !formData.filterDesignation || emp.designation === formData.filterDesignation;
        return matchName && matchDept && matchDesig;
    });

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
                <span className="text-[#6B7280]">Payroll Entry</span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-4 shrink-0">
                <div className="flex items-center gap-4">
                    <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Payroll Entry</h1>
                    <span className="px-3 py-1 bg-white border border-[#E0E0E0] rounded-lg text-[14px] text-[#1E1E1E] font-Roboto">Submitted</span>
                </div>
                
                <button
                    className="flex items-center justify-center gap-2 rounded-full py-2 px-3 text-white font-normal hover:bg-purple-700 transition-colors bg-[#7D1EDB]"
                    onClick={() => {}}
                >
                    <span className='text-[16px] font-normal text-white'style={{ fontFamily: 'Poppins, sans-serif' }}>Save</span>
                </button>
            </div>

            {/* Form Content - Scrollable Area */}
            <div className="flex-1 w-full max-w-full overflow-y-auto pr-2"style={{ fontFamily: '"Inter", sans-serif' }}>
                
                {/* Period Details */}
                <div className="border border-[#D6D6D6] rounded-lg p-4 mb-4">
                    <h2 className="text-[16px] font-semibold text-[#000000] mb-3" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Period Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        {/* Company */}
                        <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">Company</label>
                            <input 
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[16px] font-normal text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB]"
                            />
                        </div>
                        {/* Payroll Frequency */}
                        <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">Payroll Frequency</label>
                            <FilterDropdown
                                options={FREQUENCY_OPTIONS}
                                value={formData.payrollFrequency}
                                onChange={(val) => handleDropdownChange('payrollFrequency', val)}
                                className="w-full h-[40px] px-3 bg-white border border-[#E0E0E0] rounded-lg text-[16px] font-normal text-[#1E1E1E] focus:ring-1 focus:ring-[#7D1EDB] flex items-center justify-between"
                                showArrow={true}
                                dropdownWidth="150px"
                                align='right'
                                disableAllOption={true}
                            />
                        </div>
                        {/* Start Date */}
                        <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">Start Date</label>
                            <CustomDatePicker 
                                value={formData.startDate}
                                onChange={(date) => handleDateChange('startDate', date)}
                                className="w-full bg-white"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         {/* End Date */}
                         <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">End Date</label>
                            <CustomDatePicker 
                                value={formData.endDate}
                                onChange={(date) => handleDateChange('endDate', date)}
                                className="w-full bg-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Processing */}
                <div className="border border-[#D6D6D6] rounded-lg p-4 mb-4">
                    <h2 className="text-[16px] font-medium text-[#1E1E1E] mb-3" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Processing</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Posting Date */}
                        <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">Posting Date</label>
                            <CustomDatePicker 
                                value={formData.postingDate}
                                onChange={(date) => handleDateChange('postingDate', date)}
                                className="w-full bg-white"
                            />
                        </div>
                        {/* Cost Center */}
                         <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">Cost Center</label>
                            <input 
                                type="text"
                                name="costCenter"
                                value={formData.costCenter}
                                onChange={handleChange}
                                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[16px] font-normal text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB]"
                            />
                        </div>
                        {/* Payment Account */}
                        <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">Payment Account</label>
                            <FilterDropdown
                                options={ACCOUNT_OPTIONS}
                                value={formData.paymentAccount}
                                onChange={(val) => handleDropdownChange('paymentAccount', val)}
                                className="w-full h-[40px] px-3 bg-white border border-[#E0E0E0] rounded-lg text-[16px] font-normal text-[#1E1E1E] focus:ring-1 focus:ring-[#7D1EDB] flex items-center justify-between"
                                showArrow={true}
                                dropdownWidth="250px"
                                align='left'
                                disableAllOption={true}
                            />
                        </div>
                    </div>
                </div>

                {/* Employee List */}
                <div className="border border-[#D6D6D6] rounded-lg p-4 mb-4">
                    <h2 className="text-[16px] font-medium text-[#1E1E1E] mb-3" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Employee List</h2>
                    
                    {/* Filters */}
                    <div className="flex gap-3 mb-4 flex-wrap">
                        <FilterDropdown
                            label="Employee Name"
                            options={[...new Set(employees.map(e => e.name))]}
                            value={formData.filterEmployeeName}
                            onChange={(val) => handleDropdownChange('filterEmployeeName', val)}
                            minWidth="160px"
                        />
                        <FilterDropdown
                            label="Department"
                            options={['Engineering', 'HR', 'Sales', 'Marketing', 'Technical', 'Product']}
                            value={formData.filterDepartment}
                            onChange={(val) => handleDropdownChange('filterDepartment', val)}
                            minWidth="140px"
                        />
                        <FilterDropdown
                            label="Designation"
                            options={['Developer', 'Manager', 'Designer', 'UIUX', 'Business']}
                            value={formData.filterDesignation}
                            onChange={(val) => handleDropdownChange('filterDesignation', val)}
                            minWidth="140px"
                        />
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto border border-[#CECECE] rounded-lg">
                        <table className="w-full">
                            <thead className="bg-white border-b border-[#CECECE]">
                                <tr>
                                    <th className="px-6 py-3 text-left w-12">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedEmployees.length === filteredEmployees.length && filteredEmployees.length > 0}
                                            onChange={toggleAllEmployees}
                                            className="w-5 h-5 rounded border-gray-300 text-[#7D1EDB] focus:ring-[#7D1EDB] cursor-pointer"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-[14px] font-normal text-[#757575] font-inter"style={{ fontFamily: '"Poppins", sans-serif' }}>Sr.No.</th>
                                    <th className="px-6 py-3 text-left text-[14px] font-normal text-[#757575] font-inter"style={{ fontFamily: '"Poppins", sans-serif' }}>Emp Name</th>
                                    <th className="px-6 py-3 text-left text-[14px] font-normal text-[#757575] font-inter"style={{ fontFamily: '"Poppins", sans-serif' }}>EMP ID</th>
                                    <th className="px-6 py-3 text-left text-[14px] font-normal text-[#757575] font-inter"style={{ fontFamily: '"Poppins", sans-serif' }}>Department</th>
                                    <th className="px-6 py-3 text-left text-[14px] font-normal text-[#757575] font-inter"style={{ fontFamily: '"Poppins", sans-serif' }}>Designation</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEmployees.map((emp, index) => (
                                    <tr key={emp.id} className="last:border-b-0 hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedEmployees.includes(emp.id)}
                                                onChange={() => toggleEmployee(emp.id)}
                                                 className="w-5 h-5 rounded border-gray-300 text-[#7D1EDB] focus:ring-[#7D1EDB] cursor-pointer"
                                            />
                                        </td>
                                        <td className="px-6 py-3 text-[14px] text-[#1E1E1E] font-inter">{String(index + 1).padStart(2, '0')}</td>
                                        <td className="px-6 py-3 text-[14px] text-[#1E1E1E] font-inter">{emp.name}</td>
                                        <td className="px-6 py-3 text-[14px] text-[#1E1E1E] font-inter">{emp.id}</td>
                                        <td className="px-6 py-3 text-[14px] text-[#1E1E1E] font-inter">{emp.department}</td>
                                        <td className="px-6 py-3 text-[14px] text-[#1E1E1E] font-inter">{emp.designation}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PayrollEntry;
