import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Search, Download, RefreshCw } from 'lucide-react';
import CustomDatePicker from '../../../components/ui/CustomDatePicker';
import FilterDropdown from '../../../components/ui/FilterDropdown';
import { payrollModuleService } from '../../../service';
import toast from 'react-hot-toast';

const BankIntegration = () => {
    const navigate = useNavigate();

    // Initial State
    const [filterDates, setFilterDates] = useState({
        periodStart: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        periodEnd: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0]
    });

    const [bankDetails, setBankDetails] = useState({
        bankAccount: '10992344556',
        bankName: 'HDFC Bank',
        ifscCode: 'HDFC0001232',
        paymentMode: 'NEFT'
    });

    const [payouts, setPayouts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [note, setNote] = useState('');

    const paymentModeOptions = ['NEFT', 'RTGS', 'IMPS', 'Bank Transfer'];

    // Fetch bank payout rows
    const fetchPayouts = async () => {
        setIsLoading(true);
        try {
            const res = await payrollModuleService.getBankExport(filterDates);
            if (res.success && res.data) {
                setPayouts(res.data.rows || []);
                setNote(res.data.note || '');
                if ((res.data.rows || []).length === 0) {
                    toast.error('No finalized payroll runs found for this period');
                } else {
                    toast.success('Payout data loaded successfully');
                }
            } else {
                toast.error(res.message || 'Failed to fetch payout records');
            }
        } catch (err) {
            toast.error('Failed to connect to bank payout service');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPayouts();
    }, []);

    const handleBankChange = (e) => {
        const { name, value } = e.target;
        setBankDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleDropdownChange = (name, value) => {
        setBankDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (name, date) => {
        setFilterDates(prev => ({ ...prev, [name]: date }));
    };

    // Export CSV of bank transfers
    const handleExportCSV = () => {
        if (payouts.length === 0) {
            toast.error('No payouts to export');
            return;
        }

        // CSV Header
        const headers = [
            'Source Account',
            'Source Bank',
            'Employee Name',
            'Employee Email',
            'Department',
            'Net Pay (INR)',
            'Period Start',
            'Period End',
            'Payout Mode',
            'Status'
        ];

        // CSV Rows
        const rows = payouts.map(p => [
            bankDetails.bankAccount,
            bankDetails.bankName,
            p.employeeName,
            p.employeeEmail || '—',
            p.departmentName || '—',
            p.netPay,
            p.periodStart,
            p.periodEnd,
            bankDetails.paymentMode,
            p.payoutStatus
        ]);

        const csvContent = "data:text/csv;charset=utf-8," 
            + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Bank_Salary_Payout_${filterDates.periodStart}_to_${filterDates.periodEnd}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Bank export CSV downloaded successfully!');
    };

    return (
        <div className="bg-white px-4 sm:px-4 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col border border-[#D9D9D9] font-inter">
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
                <span className="text-[#6B7280]">Bank Payout Export</span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-4 shrink-0">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Bank Integration & Salary Payout</h1>
                    <p className="text-sm text-gray-400">Generate formatted files for corporate banking portals and record transfer details</p>
                </div>

                <button
                    onClick={handleExportCSV}
                    className="flex items-center justify-center gap-2 rounded-full py-2 px-4 text-white font-normal hover:bg-purple-700 transition-colors bg-[#7D1EDB]"
                >
                    <Download size={16} />
                    <span>Download Bank Upload File</span>
                </button>
            </div>

            {/* Form Content - Scrollable Area */}
            <div className="flex-1 w-full max-w-full overflow-y-auto pr-2">
                
                {/* Period filter */}
                <div className="border border-[#D6D6D6] rounded-lg p-4 mb-4">
                    <h2 className="text-[16px] font-medium text-[#1E1E1E] mb-3" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Select Payout period</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-[#1E1E1E] mb-1">Period Start</label>
                            <CustomDatePicker 
                                value={filterDates.periodStart}
                                onChange={(date) => handleDateChange('periodStart', date)}
                                className="w-full bg-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#1E1E1E] mb-1">Period End</label>
                            <CustomDatePicker 
                                value={filterDates.periodEnd}
                                onChange={(date) => handleDateChange('periodEnd', date)}
                                className="w-full bg-white"
                            />
                        </div>
                        <button 
                            onClick={fetchPayouts}
                            disabled={isLoading}
                            className="bg-[#7D1EDB] text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                            Retrieve Payouts
                        </button>
                    </div>
                </div>

                {/* Bank Account Details */}
                <div className="border border-[#D6D6D6] rounded-lg p-4 mb-4">
                    <h2 className="text-[16px] font-medium text-[#1E1E1E] mb-3" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Corporate Bank Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Bank Account */}
                        <div>
                            <label className="block text-sm font-medium text-[#1E1E1E] mb-1">Source Account Number</label>
                            <input 
                                type="text"
                                name="bankAccount"
                                value={bankDetails.bankAccount}
                                onChange={handleBankChange}
                                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:border-[#7D1EDB]"
                            />
                        </div>
                        {/* Bank Name */}
                        <div>
                            <label className="block text-sm font-medium text-[#1E1E1E] mb-1">Source Bank Name</label>
                            <input 
                                type="text"
                                name="bankName"
                                value={bankDetails.bankName}
                                onChange={handleBankChange}
                                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:border-[#7D1EDB]"
                            />
                        </div>
                        {/* IFSC Code */}
                        <div>
                            <label className="block text-sm font-medium text-[#1E1E1E] mb-1">Source IFSC Code</label>
                            <input 
                                type="text"
                                name="ifscCode"
                                value={bankDetails.ifscCode}
                                onChange={handleBankChange}
                                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:border-[#7D1EDB]"
                            />
                        </div>
                        {/* Payment Mode */}
                        <div>
                            <label className="block text-sm font-medium text-[#1E1E1E] mb-1">Payout Mode</label>
                            <FilterDropdown
                                options={paymentModeOptions}
                                value={bankDetails.paymentMode}
                                onChange={(val) => handleDropdownChange('paymentMode', val)}
                                className="w-full h-[40px] px-3 bg-white border border-[#E0E0E0] rounded-lg text-[14px] focus:ring-1 focus:ring-[#7D1EDB] flex items-center justify-between"
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
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-[16px] font-medium text-[#1E1E1E]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Payout Disbursals</h2>
                        {note && <span className="text-xs text-gray-400 italic bg-gray-50 px-2 py-1 rounded">{note}</span>}
                    </div>
                    
                    <div className="overflow-x-auto border border-[#CECECE] rounded-lg">
                        <table className="w-full">
                            <thead className="bg-[#FFFFFF] border-b border-[#CECECE]">
                                <tr className="text-left font-poppins">
                                    <th className="px-6 py-3 text-[14px] font-medium text-[#757575]">Employee Name</th>
                                    <th className="px-6 py-3 text-[14px] font-medium text-[#757575]">Department</th>
                                    <th className="px-6 py-3 text-[14px] font-medium text-[#757575]">Period Start</th>
                                    <th className="px-6 py-3 text-[14px] font-medium text-[#757575]">Period End</th>
                                    <th className="px-6 py-3 text-[14px] font-medium text-[#757575]">Net Take-Home Pay</th>
                                    <th className="px-6 py-3 text-[14px] font-medium text-[#757575]">Disbursal Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-gray-500">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#7D1EDB] mx-auto mb-2"></div>
                                            Loading disbursals...
                                        </td>
                                    </tr>
                                ) : payouts.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-gray-400">No payout disbursals retrieved for selected period</td>
                                    </tr>
                                ) : (
                                    payouts.map((emp, index) => (
                                        <tr key={index} className="last:border-b-0 hover:bg-gray-50 border-b border-[#CECECE]">
                                            <td className="px-6 py-3 text-sm font-semibold text-[#1E1E1E]">{emp.employeeName}</td>
                                            <td className="px-6 py-3 text-sm text-gray-600">{emp.departmentName || '—'}</td>
                                            <td className="px-6 py-3 text-sm text-gray-600">{new Date(emp.periodStart).toLocaleDateString()}</td>
                                            <td className="px-6 py-3 text-sm text-gray-600">{new Date(emp.periodEnd).toLocaleDateString()}</td>
                                            <td className="px-6 py-3 text-sm font-semibold text-green-700">₹{emp.netPay}</td>
                                            <td className="px-6 py-3">
                                                <span className="bg-[#E4F8D2] text-[#76DB1E] text-[12px] px-2.5 py-1 rounded-full font-medium capitalize">
                                                    {emp.payoutStatus.replace(/_/g, ' ')}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default BankIntegration;
