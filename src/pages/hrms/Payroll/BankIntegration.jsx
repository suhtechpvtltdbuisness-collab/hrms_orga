import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import CustomDatePicker from '../../../components/ui/CustomDatePicker';
import FilterDropdown from '../../../components/ui/FilterDropdown';

const BankIntegration = () => {
    const navigate = useNavigate();

    // Initial State
    const [formData, setFormData] = useState({
        bankAccount: 'hdfc@123',
        bankName: 'HDFC Bank',
        ifscCode: 'hdfc123',
        paymentDate: '26/01/2026',
        totalAmount: '50,000',
        paymentMode: 'NEFT'
    });

    const paymentModeOptions = ['NEFT', 'UPI', 'RTGS', 'IMPS', 'Bank Transfer'];

    const employees = [
        { srNo: '01', bankAccount: 'hdfc@123', netPay: '40,000', status: 'Paid', refNo: 'NEFT123' },
        { srNo: '02', bankAccount: 'hdfc@123', netPay: '40,000', status: 'Paid', refNo: 'NEFT123' },
        { srNo: '03', bankAccount: 'hdfc@123', netPay: '40,000', status: 'Paid', refNo: 'NEFT123' },
    ];

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
                <span className="text-[#6B7280]">Bank Integration For Salary Payout</span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-4 shrink-0">
                <div className="flex items-center gap-4">
                    <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Bank Integration For Salary Payout</h1>
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
                
                {/* Bank Details */}
                <div className="border border-[#D6D6D6] rounded-lg p-4 mb-4">
                    <h2 className="text-[16px] font-medium text-[#1E1E1E] mb-3" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Bank Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Bank Account */}
                        <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">Bank Account</label>
                            <input 
                                type="text"
                                name="bankAccount"
                                value={formData.bankAccount}
                                onChange={handleChange}
                                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[16px] font-normal text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB]"
                            />
                        </div>
                        {/* Bank Name */}
                        <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">Bank Name</label>
                            <input 
                                type="text"
                                name="bankName"
                                value={formData.bankName}
                                onChange={handleChange}
                                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[16px] font-normal text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB]"
                            />
                        </div>
                        {/* IFSC Code */}
                        <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">IFSC Code</label>
                            <input 
                                type="text"
                                name="ifscCode"
                                value={formData.ifscCode}
                                onChange={handleChange}
                                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[16px] font-normal text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB]"
                            />
                        </div>
                    </div>
                </div>

                {/* Payment Info */}
                <div className="border border-[#D6D6D6] rounded-lg p-4 mb-4">
                    <h2 className="text-[16px] font-medium text-[#1E1E1E] mb-3" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Payment Info</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Payment Date */}
                        <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">Payment Date</label>
                            <CustomDatePicker 
                                value={formData.paymentDate}
                                onChange={(date) => handleDateChange('paymentDate', date)}
                                className="w-full bg-white"
                            />
                        </div>
                        {/* Total Amount */}
                        <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">Total Amount</label>
                            <input 
                                type="text"
                                name="totalAmount"
                                value={formData.totalAmount}
                                onChange={handleChange}
                                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[16px] font-normal text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB]"
                            />
                        </div>
                         {/* Payment Mode */}
                         <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">Payment Mode</label>
                            <FilterDropdown
                                options={paymentModeOptions}
                                value={formData.paymentMode}
                                onChange={(val) => handleDropdownChange('paymentMode', val)}
                                className="w-full h-[40px] px-3 bg-white border border-[#E0E0E0] rounded-lg text-[16px] font-normal text-[#1E1E1E] focus:ring-1 focus:ring-[#7D1EDB] flex items-center justify-between"
                                showArrow={true}
                                dropdownWidth="150px"
                                minWidth="100%"
                                align='right'
                                disableAllOption={true}
                            />
                        </div>
                    </div>
                </div>

                {/* Employee Data */}
                <div className="border border-[#D6D6D6] rounded-lg p-4 mb-4">
                    <h2 className="text-[16px] font-medium text-[#1E1E1E] mb-3" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Employee Data</h2>
                    
                    <div className="overflow-x-auto border border-[#E0E0E0] rounded-lg">
                        <table className="w-full">
                            <thead className="bg-[#FFFFFF] border-b border-[#E0E0E0]">
                                <tr>
                                    <th className="px-6 py-3 text-center text-[14px] font-normal text-[#757575] "style={{ fontFamily: '"Poppins", sans-serif' }}>Sr.No.</th>
                                    <th className="px-6 py-3 text-center text-[14px] font-normal text-[#757575] "style={{ fontFamily: '"Poppins", sans-serif' }}>Employee Bank Account</th>
                                    <th className="px-6 py-3 text-center text-[14px] font-normal text-[#757575] "style={{ fontFamily: '"Poppins", sans-serif' }}>Net Pay</th>
                                    <th className="px-6 py-3 text-center text-[14px] font-normal text-[#757575] "style={{ fontFamily: '"Poppins", sans-serif' }}>Status</th>
                                    <th className="px-6 py-3 text-center text-[14px] font-normal text-[#757575] "style={{ fontFamily: '"Poppins", sans-serif' }}>Reference No.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((emp, index) => (
                                    <tr key={index} className="last:border-b-0 hover:bg-gray-50 border-b border-[#E0E0E0]">
                                        <td className="px-6 py-3 text-center text-[14px] text-[#1E1E1E]">{emp.srNo}</td>
                                        <td className="px-6 py-3 text-center text-[14px] text-[#1E1E1E]">{emp.bankAccount}</td>
                                        <td className="px-6 py-3 text-center text-[14px] text-[#1E1E1E]">{emp.netPay}</td>
                                        <td className="px-6 py-3 text-center">
                                            <span className="bg-[#E4F8D2] text-[#76DB1E] text-[12px] px-2 py-1.5 rounded-full font-medium">
                                                {emp.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-center text-[14px] text-[#1E1E1E]">{emp.refNo}</td>
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

export default BankIntegration;
