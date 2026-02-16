import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import CustomDatePicker from '../../../components/ui/CustomDatePicker';
import FilterDropdown from '../../../components/ui/FilterDropdown';

const AdditionalSalary = () => {
    const navigate = useNavigate();

    // Initial State
    const [formData, setFormData] = useState({
        employeeId: '',
        employeeName: '',
        salaryComponent: '',
        amount: '',
        type: '',
        payrollDate: '26/01/2026',
        reason: ''
    });

    // Mock Data
    const employees = [
        { id: 'EMP-0123', name: 'Alice Smith' },
        { id: 'EMP-0124', name: 'Bob Johnson' },
        { id: 'EMP-0125', name: 'Charlie Brown' },
    ];

    const typeOptions = ['Earning', 'Deduction'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDropdownChange = (name, value) => {
        setFormData(prev => {
            const updates = { [name]: value };
            if (name === 'employeeId') {
                const employee = employees.find(emp => emp.id === value);
                if (employee) {
                    updates.employeeName = employee.name;
                } else {
                    updates.employeeName = '';
                }
            }
            return { ...prev, ...updates };
        });
    };

    const handleDateChange = (name, date) => {
        setFormData(prev => ({ ...prev, [name]: date }));
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
                <span className="text-[#6B7280]">Additional Salary</span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-4 shrink-0">
                <div className="flex items-center gap-4">
                    <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Additional Salary</h1>
                </div>
                
                <button
                    className="flex items-center justify-center gap-2 rounded-full py-2 px-3 text-white font-normal hover:bg-purple-700 transition-colors bg-[#7D1EDB]"
                    onClick={() => {}}
                >
                    <span className='text-[16px] font-normal text-white' style={{ fontFamily: 'Poppins, sans-serif' }}>Save</span>
                </button>
            </div>

            {/* Form Content - Scrollable Area */}
            <div className="flex-1 w-full max-w-full overflow-y-auto pr-2" style={{ fontFamily: '"Inter", sans-serif' }}>
                
                {/* Employee Information */}
                <div className="border border-[#D6D6D6] rounded-lg p-4 mb-4">
                    <h2 className="text-[16px] font-semibold text-[#000000] mb-3" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Employee Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Employee */}
                        <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">Employee</label>
                            <FilterDropdown
                                options={employees.map(e => ({ label: e.id, value: e.id }))}
                                value={formData.employeeId}
                                onChange={(val) => handleDropdownChange('employeeId', val)}
                                className="w-full h-[40px] px-3 bg-white border border-[#E0E0E0] rounded-lg text-[16px] font-normal text-[#1E1E1E] focus:ring-1 focus:ring-[#7D1EDB] flex items-center justify-between"
                                showArrow={true}
                                dropdownWidth="100%"
                                minWidth="100%"
                                align='left'
                                disableAllOption={true}
                                placeholder="Select Employee"
                            />
                        </div>
                        {/* Employee Name */}
                        <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">Employee Name</label>
                            <input 
                                type="text"
                                name="employeeName"
                                value={formData.employeeName}
                                readOnly
                                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[16px] font-normal text-[#1E1E1E] bg-[#FAFAFA] focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Salary Information */}
                <div className="border border-[#D6D6D6] rounded-lg p-4 mb-4">
                    <h2 className="text-[16px] font-medium text-[#1E1E1E] mb-3" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Salary Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Salary Component */}
                         <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">Salary Component</label>
                            <input 
                                type="text"
                                name="salaryComponent"
                                value={formData.salaryComponent}
                                onChange={handleChange}
                                placeholder="Bonus"
                                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[16px] font-normal text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB]"
                            />
                        </div>
                        {/* Amount */}
                        <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">Amount</label>
                            <input 
                                type="text"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                placeholder="₹50,000"
                                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[16px] font-normal text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB]"
                            />
                        </div>
                        {/* Type */}
                        <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">Type</label>
                            <FilterDropdown
                                options={typeOptions}
                                value={formData.type}
                                onChange={(val) => handleDropdownChange('type', val)}
                                className="w-full h-[40px] px-3 bg-white border border-[#E0E0E0] rounded-lg text-[16px] font-normal text-[#1E1E1E] focus:ring-1 focus:ring-[#7D1EDB] flex items-center justify-between"
                                showArrow={true}
                                dropdownWidth="100%"
                                minWidth="100%"
                                align='left'
                                disableAllOption={true}
                                placeholder="Earning"
                            />
                        </div>
                    </div>
                </div>

                {/* Timing */}
                <div className="border border-[#D6D6D6] rounded-lg p-4 mb-4">
                    <h2 className="text-[16px] font-medium text-[#1E1E1E] mb-3" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Timing</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Payroll Date */}
                        <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">Payroll Date</label>
                            <CustomDatePicker 
                                value={formData.payrollDate}
                                onChange={(date) => handleDateChange('payrollDate', date)}
                                className="w-full bg-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Remarks */}
                <div className="border border-[#D6D6D6] rounded-lg p-4 mb-4">
                    <h2 className="text-[16px] font-medium text-[#1E1E1E] mb-3" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Remarks</h2>
                    <div>
                        <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">Reason / Notes</label>
                        <textarea
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            placeholder="Enter reason"
                            className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[16px] font-normal text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB] min-h-[120px] resize-none"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdditionalSalary;
