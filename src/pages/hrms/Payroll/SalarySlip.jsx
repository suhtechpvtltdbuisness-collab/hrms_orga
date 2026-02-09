import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronDown, Plus, Trash2 } from 'lucide-react';
import CustomDatePicker from '../../../components/ui/CustomDatePicker';
import FilterDropdown from '../../../components/ui/FilterDropdown';

const SalarySlip = () => {
    const navigate = useNavigate();

    // Initial State
    const [formData, setFormData] = useState({
        employeeId: 'EMP-0123',
        employeeName: 'Alice Smith',
        department: 'Development',
        designation: 'Software Engineer',
        salaryStructure: 'Monthly Salary Structure',
        grossPay: '₹50,000',
        totalDeduction: '₹50,000',
        netPay: '₹50,000',
        paymentDays: '30',
        leaveWithoutPay: '1',
        postingDate: '26/01/2026'
    });

    const [earnings, setEarnings] = useState([
        { id: 1, component: 'Basic', amount: '4000' },
        { id: 2, component: 'House Rent Allowance', amount: '16000' },
        { id: 3, component: 'Medical Allowance', amount: '10000' },
    ]);

    const [deductions, setDeductions] = useState([
        { id: 1, component: 'Provident Fund', amount: '4000' },
    ]);

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

    // Earning Handlers
    const addEarning = () => {
        const newId = earnings.length > 0 ? Math.max(...earnings.map(e => e.id)) + 1 : 1;
        setEarnings([...earnings, { id: newId, component: '', amount: '' }]);
    };

    const removeEarning = (id) => {
        setEarnings(earnings.filter(e => e.id !== id));
    };

    const handleEarningChange = (id, field, value) => {
        if (field === 'component') {
            // Allow only alphabets and spaces
            if (/^[a-zA-Z\s]*$/.test(value)) {
                setEarnings(earnings.map(item => 
                    item.id === id ? { ...item, [field]: value } : item
                ));
            }
        } else if (field === 'amount') {
            // Allow only numbers
            if (/^[0-9]*$/.test(value)) {
                setEarnings(earnings.map(item => 
                    item.id === id ? { ...item, [field]: value } : item
                ));
            }
        }
    };

    return (
        <div className="bg-white px-4 sm:px-4 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 shrink-0"style={{ fontFamily: '"Mulish", sans-serif' }}>
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
                <span className="text-[#6B7280]">Salary Slip</span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-4 shrink-0">
                <div className="flex items-center gap-4">
                    <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Salary Slip</h1>
                    <span className="px-3 py-1 bg-white border border-[#E0E0E0] rounded-md text-[14px] text-[#1E1E1E]"style={{ fontFamily: '"Roboto", sans-serif' }}>Paid</span>
                </div>
                
                <button
                    className="flex items-center justify-center gap-2 rounded-full py-2 px-3 text-white font-normal hover:bg-purple-700 transition-colors bg-[#7D1EDB]"
                    onClick={() => {}}
                >
                    <span className='text-[16px] font-normal text-white font-popins'style={{ fontFamily: 'Poppins, sans-serif' }}>Save</span>
                </button>
            </div>

            {/* Form Content - Scrollable Area */}
            <div className="flex-1 w-full max-w-full overflow-y-auto pr-2"style={{ fontFamily: '"Inter", sans-serif' }}>
                
                {/* Employee Information */}
                <div className="border border-[#D6D6D6] rounded-lg p-4 mb-4">
                    <h2 className="text-[16px] font-semibold text-[#000000] mb-3" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Employee Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        {/* Employee */}
                        <div>
                            <label className="block text-[16px] font-normal font-inter text-[#1E1E1E] mb-1">Employee</label>
                            <FilterDropdown
                                options={['EMP-0123', 'EMP-0124', 'EMP-0125']}
                                value={formData.employeeId}
                                onChange={(val) => handleDropdownChange('employeeId', val)}
                                className="w-full h-[40px] px-3 bg-white border border-[#E0E0E0] rounded-lg text-[16px] font-normal font-inter text-[#1E1E1E] focus:ring-1 focus:ring-[#7D1EDB] flex items-center justify-between"
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
                                options={['Development', 'HR', 'Sales', 'Marketing']}
                                value={formData.department}
                                onChange={(val) => handleDropdownChange('department', val)}
                                className="w-full h-[40px] px-3 bg-white border border-[#E0E0E0] rounded-lg text-[16px] font-normal font-inter text-[#1E1E1E] focus:ring-1 focus:ring-[#7D1EDB] flex items-center justify-between"
                                showArrow={true}
                                dropdownWidth="100%"
                                align='left'
                                disableAllOption={true}
                            />
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Designation */}
                        <div>
                            <label className="block text-[16px] font-normal font-inter text-[#1E1E1E] mb-1">Designation</label>
                            <FilterDropdown
                                options={['Software Engineer', 'Senior Developer', 'Manager']}
                                value={formData.designation}
                                onChange={(val) => handleDropdownChange('designation', val)}
                                className="w-full h-[40px] px-3 bg-white border border-[#E0E0E0] rounded-lg text-[16px] font-normal font-inter text-[#1E1E1E] focus:ring-1 focus:ring-[#7D1EDB] flex items-center justify-between"
                                showArrow={true}
                                dropdownWidth="100%"
                                align='left'
                                disableAllOption={true}
                            />
                        </div>
                    </div>
                </div>

                {/* Salary Information */}
                 <div className="border border-[#D6D6D6] rounded-lg p-4 mb-4">
                    <h2 className="text-[16px] font-medium text-[#1E1E1E] mb-3" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Salary Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                         {/* Salary Structure */}
                         <div>
                            <label className="block text-[16px] font-normal font-inter text-[#1E1E1E] mb-1">Salary Structure</label>
                            <FilterDropdown
                                options={['Monthly Salary Structure', 'Weekly Structure', 'Daily Structure']}
                                value={formData.salaryStructure}
                                onChange={(val) => handleDropdownChange('salaryStructure', val)}
                                className="w-full h-[40px] px-3 bg-white border border-[#E0E0E0] rounded-lg text-[16px] font-normal font-inter text-[#1E1E1E] focus:ring-1 focus:ring-[#7D1EDB] flex items-center justify-between"
                                showArrow={true}
                                dropdownWidth="100%"
                                align='left'
                                disableAllOption={true}
                            />
                        </div>
                         {/* Gross Pay */}
                        <div>
                            <label className="block text-[16px] font-normal font-inter text-[#1E1E1E] mb-1">Gross Pay</label>
                             <div className="w-full h-[40px] px-3 bg-white border border-[#E0E0E0] rounded-lg text-[16px] font-normal font-inter text-[#1E1E1E] flex items-center justify-between">
                                {formData.grossPay} <ChevronDown size={20} className="text-[#888888]"/>
                             </div>
                        </div>
                         {/* Total Deduction */}
                        <div>
                            <label className="block text-[16px] font-normal font-inter text-[#1E1E1E] mb-1">Total Deduction</label>
                             <div className="w-full h-[40px] px-3 bg-white border border-[#E0E0E0] rounded-lg text-[16px] font-normal font-inter text-[#1E1E1E] flex items-center justify-between">
                                {formData.totalDeduction} <ChevronDown size={20} className="text-[#888888]"/>
                             </div>
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Net Pay */}
                        <div>
                            <label className="block text-[16px] font-normal font-inter text-[#1E1E1E] mb-1">Net Pay</label>
                             <div className="w-full h-[40px] px-3 bg-white border border-[#E0E0E0] rounded-lg text-[16px] font-normal font-inter text-[#1E1E1E] flex items-center justify-between">
                                {formData.netPay} <ChevronDown size={20} className="text-[#888888]"/>
                             </div>
                        </div>
                     </div>
                </div>

                {/* Components */}
                <div className="border border-[#D6D6D6] rounded-lg p-4 mb-4">
                    <h2 className="text-[16px] font-medium text-[#1E1E1E] mb-3" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Components</h2>
                    
                    {/* Earnings Table */}
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-[14px] font-normal text-[#1E1E1E]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Earnings Table</h3>
                         <button 
                            onClick={addEarning}
                            className="bg-[#7D1EDB] text-white px-3 py-2 rounded-full text-[16px] font-normal font-poppins hover:bg-purple-700 transition-colors"
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                            Add Earnings
                        </button>
                    </div>
                    <div className="overflow-x-auto border border-[#CECECE] rounded-lg mb-4">
                        <table className="w-full">
                            <thead className="bg-white border-b border-[#CECECE]">
                                <tr>
                                    <th className="px-6 py-3 text-left text-[14px] font-normal text-[#757575] first:w-20" style={{ fontFamily: '"Poppins", sans-serif' }}>Sr.No.</th>
                                    <th className="px-6 py-3 text-center text-[14px] font-normal text-[#757575]" style={{ fontFamily: '"Poppins", sans-serif' }}>Salary Component</th>
                                    <th className="px-6 py-3 text-center text-[14px] font-normal text-[#757575]" style={{ fontFamily: '"Poppins", sans-serif' }}>Amount/Formula</th>
                                    <th className="px-6 py-3 text-right text-[14px] font-normal text-[#757575] w-24" style={{ fontFamily: '"Poppins", sans-serif' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {earnings.map((item, index) => (
                                    <tr key={item.id} className="last:border-b-0">
                                        <td className="px-6 py-3 text-[14px] text-[#1E1E1E] font-inter">{String(index + 1).padStart(2, '0')}</td>
                                        <td className="px-6 py-3 text-center">
                                            <input 
                                                type="text" 
                                                value={item.component}
                                                onChange={(e) => handleEarningChange(item.id, 'component', e.target.value)}
                                                className="w-full text-center text-[14px] text-[#1E1E1E] font-inter focus:outline-none bg-transparent"
                                                placeholder="Component"
                                            />
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            <input 
                                                type="text" 
                                                value={item.amount}
                                                onChange={(e) => handleEarningChange(item.id, 'amount', e.target.value)}
                                                className="w-full text-center text-[14px] text-[#1E1E1E] font-inter focus:outline-none bg-transparent"
                                                placeholder="Amount"
                                            />
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <button 
                                                onClick={() => removeEarning(item.id)}
                                                className="text-[#1E1E1E] hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Deductions Table */}
                    <div className="overflow-x-auto border border-[#CECECE] rounded-lg">
                         <table className="w-full">
                             <thead className="bg-white border-b border-[#CECECE]">
                                <tr>
                                    <th className="px-6 py-3 text-left text-[14px] font-normal text-[#757575] first:w-20" style={{ fontFamily: '"Poppins", sans-serif' }}>Sr.No.</th>
                                    <th className="px-6 py-3 text-center text-[14px] font-normal text-[#757575]" style={{ fontFamily: '"Poppins", sans-serif' }}>Salary Component</th>
                                    <th className="px-6 py-3 text-right text-[14px] font-normal text-[#757575]" style={{ fontFamily: '"Poppins", sans-serif' }}>Amount/Formula</th>
                                </tr>
                            </thead>
                            <tbody>
                                 {deductions.map((item, index) => (
                                    <tr key={item.id} className="last:border-b-0">
                                        <td className="px-6 py-3 text-[14px] text-[#1E1E1E] font-inter">{String(index + 1).padStart(2, '0')}</td>
                                        <td className="px-6 py-3 text-center text-[14px] text-[#1E1E1E] font-inter">{item.component}</td>
                                        <td className="px-6 py-3 text-right text-[14px] text-[#1E1E1E] font-inter">{item.amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Attendance */}
                <div className="border border-[#D6D6D6] rounded-lg p-4 mb-4">
                     <h2 className="text-[16px] font-medium text-[#1E1E1E] mb-3" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Attendance</h2>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Payment Days */}
                        <div>
                            <label className="block text-[16px] font-normal font-inter text-[#1E1E1E] mb-1">Payment Days</label>
                            <input 
                                type="text"
                                name="paymentDays"
                                value={formData.paymentDays}
                                onChange={handleChange}
                                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[16px] font-normal font-inter text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB]"
                            />
                        </div>
                        {/* Leave Without Pay */}
                         <div>
                            <label className="block text-[16px] font-normal font-inter text-[#1E1E1E] mb-1">Leave Without Pay</label>
                            <input 
                                type="text"
                                name="leaveWithoutPay"
                                value={formData.leaveWithoutPay}
                                onChange={handleChange}
                                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[16px] font-normal font-inter text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB]"
                            />
                        </div>
                     </div>
                </div>

                {/* Status */}
                  <div className="border border-[#D6D6D6] rounded-lg p-4 mb-4">
                     <h2 className="text-[16px] font-medium text-[#1E1E1E] mb-3" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Status</h2>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Posting Date */}
                        <div>
                            <label className="block text-[16px] font-normal font-inter text-[#1E1E1E] mb-1">Posting Date</label>
                            <CustomDatePicker 
                                value={formData.postingDate}
                                onChange={(date) => handleDateChange('postingDate', date)}
                                className="w-full bg-white"
                            />
                        </div>
                     </div>
                  </div>

            </div>
        </div>
    );
};

export default SalarySlip;
