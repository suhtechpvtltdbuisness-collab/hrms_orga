
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import FilterDropdown from '../../../../components/ui/FilterDropdown';
import CustomDatePicker from '../../../../components/ui/CustomDatePicker';

const RecordPayment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    
    // Detect mode: 'view', 'edit', or 'create'
    let mode = location.state?.mode;
    if (!mode) {
        if (location.pathname.includes('/view/')) mode = 'view';
        else if (location.pathname.includes('/edit/')) mode = 'edit';
        else mode = 'create';
    }
    
    const paymentFromState = location.state?.payment;

    // Form State
    const [paymentData, setPaymentData] = useState({
        paymentMode: '',
        amount: '',
        paymentDate: '',
    });

    // Load payment data for view/edit modes
    useEffect(() => {
        const loadPaymentData = (payment) => {
            setPaymentData({
                paymentMode: payment.method || '',
                amount: payment.amount || '',
                paymentDate: payment.paymentDate || '',
            });
        };

        if (mode !== 'create') {
            if (paymentFromState) {
                loadPaymentData(paymentFromState);
            } else if (id) {
                const storedPayments = JSON.parse(localStorage.getItem('invoicePayments')) || [];
                const foundPayment = storedPayments.find(p => String(p.id) === String(id));
                if (foundPayment) {
                    loadPaymentData(foundPayment);
                }
            }
        }
    }, [mode, paymentFromState, id]);

    const handleSave = () => {
        if (!paymentData.paymentMode || !paymentData.amount || !paymentData.paymentDate) {
            alert("Please fill in all required fields");
            return;
        }

        const newPayment = {
            id: Date.now(),
            invoiceNumber: `INV-${String(Math.floor(Math.random() * 900) + 100)}`,
            customer: 'New Customer',
            paymentDate: paymentData.paymentDate,
            amount: Number(paymentData.amount),
            method: paymentData.paymentMode,
            status: 'Pending',
        };

        const existingPayments = JSON.parse(localStorage.getItem('invoicePayments')) || [];
        localStorage.setItem('invoicePayments', JSON.stringify([newPayment, ...existingPayments]));

        console.log("Saving payment:", newPayment);
        navigate('/hrms/invoice-payment-allocation');
    };

    const handleUpdate = () => {
        if (!paymentData.paymentMode || !paymentData.amount || !paymentData.paymentDate) {
            alert("Please fill in all required fields");
            return;
        }

        const paymentPayload = {
            id: paymentFromState.id,
            invoiceNumber: paymentFromState.invoiceNumber,
            customer: paymentFromState.customer,
            paymentDate: paymentData.paymentDate,
            amount: Number(paymentData.amount),
            method: paymentData.paymentMode,
            status: paymentFromState.status,
        };

        const existingPayments = JSON.parse(localStorage.getItem('invoicePayments')) || [];
        const updatedPayments = existingPayments.map(p =>
            p.id === paymentPayload.id ? paymentPayload : p
        );
        localStorage.setItem('invoicePayments', JSON.stringify(updatedPayments));

        console.log("Updating payment:", paymentPayload);
        navigate('/hrms/invoice-payment-allocation');
    };

    return (
        <div className="bg-white px-4 sm:px-4 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col font-inter" style={{ fontFamily: 'Inter, sans-serif' }}>
            
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 shrink-0" style={{ fontFamily: 'Mulish, sans-serif' }}>
                 <img 
                    src="/images/arrow_left_alt.svg" 
                    alt="Back" 
                    className="w-3 h-3 cursor-pointer hover:scale-110 transition-transform" 
                    onClick={() => navigate('/hrms/invoice-payment-allocation')}
                />
                 <span 
                    className='cursor-pointer text-[#7D1EDB]'
                    onClick={() => navigate('/hrms/invoice-payment-allocation')}
                >
                    Invoice Payment Allocation
                </span> 
                <ChevronRight size={14}/> 
                <span className="text-[#6B7280]">
                    {mode === 'create' ? 'Record Payment' : paymentFromState?.invoiceNumber || 'Payment Details'}
                </span>
            </div>

             {/* Header */}
             <div className="flex justify-between items-center mb-4 shrink-0">
                <div className="flex items-center gap-3">
                    <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {mode === 'create' ? 'Record Payment' : paymentFromState?.invoiceNumber || 'Payment Details'}
                    </h1>
                    {mode !== 'create' && (
                        <span className="px-3 py-1 rounded-full text-[12px] font-medium border border-[#D9D9D9] text-[#1E1E1E] bg-white">
                            {paymentFromState?.status || 'Paid'}
                        </span>
                    )}
                </div>
                
                <div className="flex gap-3">
                    <button
                        className="px-4 py-2 rounded-full border border-[#7D1EDB] text-[#7D1EDB] font-normal hover:bg-purple-50 transition-colors"
                        onClick={() => navigate('/hrms/invoice-payment-allocation')}
                    >
                        {mode === 'view' ? 'Back' : 'Cancel'}
                    </button>
                    {mode !== 'view' && (
                        <button
                            className="px-4 py-2 rounded-full bg-[#7D1EDB] text-white font-normal hover:bg-purple-700 transition-colors"
                            onClick={mode === 'edit' ? handleUpdate : handleSave}
                        >
                            {mode === 'edit' ? 'Update' : 'Save'}
                        </button>
                    )}
                </div>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto pr-2">
                {/* Payment Details Card */}
                <div className="border border-[#E0E0E0] rounded-lg p-4 mb-4">
                    <h3 className="text-[15px] font-semibold text-[#000000] mb-3" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Payment Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* Payment Mode */}
                        <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">Payment Mode</label>
                            <FilterDropdown
                                label="Payment Mode"
                                placeholder="Select mode"
                                options={[
                                    { label: 'Bank Transfer', value: 'Bank Transfer' },
                                    { label: 'Cash', value: 'Cash' },
                                    { label: 'Check', value: 'Check' },
                                    { label: 'UPI', value: 'UPI' },
                                    { label: 'Credit Card', value: 'Credit Card' }
                                ]}
                                value={paymentData.paymentMode}
                                onChange={(val) => setPaymentData({...paymentData, paymentMode: val})}
                                disabled={mode === 'view'}
                                disableAllOption={true}
                                className="w-full flex items-center justify-between border border-[#D9D9D9] rounded-lg px-4 py-2 text-[16px] text-[#1E1E1E] bg-white outline-none hover:border-[#7D1EDB] transition-colors"
                                buttonTextClassName="text-[#1E1E1E]"
                            />
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">Amount</label>
                            <input 
                                type="text"
                                className="w-full border border-[#D9D9D9] rounded-lg px-4 py-2 text-[16px] text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB] placeholder-[#B3B3B3]"
                                placeholder="Enter amount"
                                value={paymentData.amount}
                                disabled={mode === 'view'}
                                onChange={(e) => {
                                    if (/^\d*\.?\d*$/.test(e.target.value)) {
                                        setPaymentData({...paymentData, amount: e.target.value});
                                    }
                                }}
                            />
                        </div>

                        {/* Payment Date */}
                        <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">Payment Date</label>
                            <CustomDatePicker
                                value={paymentData.paymentDate}
                                onChange={(date) => setPaymentData({...paymentData, paymentDate: date})}
                                placeholder="Select date"
                                disabled={mode === 'view'}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                {mode === 'create' && (
                    <div className="flex gap-3">
                        <button
                            className="px-6 py-2 rounded-full bg-[#7D1EDB] text-white font-medium hover:bg-purple-700 transition-colors"
                            onClick={handleSave}
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                            Record Invoice
                        </button>
                        <button
                            className="px-6 py-2 rounded-full border border-[#7D1EDB] text-[#7D1EDB] font-medium hover:bg-purple-50 transition-colors"
                            onClick={() => navigate('/hrms/invoice-payment-allocation')}
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecordPayment;
