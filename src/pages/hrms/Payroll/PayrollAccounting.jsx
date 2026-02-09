import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import CustomDatePicker from '../../../components/ui/CustomDatePicker';
import FilterDropdown from '../../../components/ui/FilterDropdown';

const PayrollAccounting = () => {
    const navigate = useNavigate();

    // Initial State
    const [formData, setFormData] = useState({
        company: 'SUH Tech',
        postingDate: '20/01/2026',
        voucherType: 'Alice Smith', 
        debitAccount: 'HDFC Bank',
        creditAccount: 'ICICI Bank',
        amount: '50,000',
        payrollDate: '26/01/2026'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
                <span className="text-[#6B7280]">Payroll Accounting</span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-4 shrink-0">
                <div className="flex items-center gap-4">
                    <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Payroll Accounting</h1>
                    <span className="px-3 py-1 bg-white border border-[#E0E0E0] rounded-lg text-[14px] text-[#1E1E1E] font-Roboto">Submitted</span>
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
                
                {/* Accounting Details */}
                <div className="border border-[#D6D6D6] rounded-lg p-4 mb-4">
                    <h2 className="text-[16px] font-medium text-[#1E1E1E] mb-3" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Accounting Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        {/* Posting Date */}
                        <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">Posting Date</label>
                            <CustomDatePicker 
                                value={formData.postingDate}
                                onChange={(date) => handleDateChange('postingDate', date)}
                                className="w-full bg-white"
                            />
                        </div>
                        {/* Voucher Type */}
                        <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">Voucher Type</label>
                            <input 
                                type="text"
                                name="voucherType"
                                value={formData.voucherType}
                                onChange={handleChange}
                                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[16px] font-normal text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB]"
                            />
                        </div>
                    </div>
                </div>

                {/* Accounts */}
                <div className="border border-[#D6D6D6] rounded-lg p-4 mb-4">
                    <h2 className="text-[16px] font-medium text-[#1E1E1E] mb-3" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Accounts</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Debit Account */}
                        <div>
                            <label className="block text-[16px] font-normal fon text-[#1E1E1E] mb-1">Debit Account</label>
                            <input 
                                type="text"
                                name="debitAccount"
                                value={formData.debitAccount}
                                onChange={handleChange}
                                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[16px] font-normal text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB]"
                            />
                        </div>
                        {/* Credit Account */}
                        <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">Credit Account</label>
                            <input 
                                type="text"
                                name="creditAccount"
                                value={formData.creditAccount}
                                onChange={handleChange}
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
                                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[16px] font-normal text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB]"
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

                {/* References */}
                <div className="border border-[#D6D6D6] rounded-lg p-4 mb-4">
                    <h2 className="text-[16px] font-medium text-[#1E1E1E] mb-3" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>References</h2>
                    <div className="flex gap-6">
                        {/* Payroll Entry Card */}
                        <div className="flex items-center justify-between p-4 border border-[#E0E0E0] rounded-lg min-w-[250px]">
                            <span className="text-[16px] font-normal text-[#1E1E1E]">Payroll Entry</span>
                            <button className="px-3 py-2 border border-[#7D1EDB] rounded-full text-[#7D1EDB] font-medium text-[16px] hover:bg-purple-50 transition-colors">
                                View
                            </button>
                        </div>
                         {/* Salary Slips Card */}
                         <div className="flex items-center justify-between p-4 border border-[#E0E0E0] rounded-lg min-w-[250px]">
                            <span className="text-[16px] font-normal text-[#1E1E1E]">Salary Slips</span>
                            <button className="px-3 py-2 border border-[#7D1EDB] rounded-full text-[#7D1EDB] font-medium text-[16px] hover:bg-purple-50 transition-colors">
                                View
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PayrollAccounting;
