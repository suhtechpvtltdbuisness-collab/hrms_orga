
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, UploadCloud, X, Download, FileText } from 'lucide-react';
import CustomDatePicker from '../../../../components/ui/CustomDatePicker';
import FilterDropdown from '../../../../components/ui/FilterDropdown';

const AddExpense = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isViewMode = !!id;
    
    const [isEditing, setIsEditing] = useState(!id);
    const [expenseData, setExpenseData] = useState({
        title: '',
        category: '',
        amount: '',
        date: '',
        paymentType: '',
        description: '',
        bill: null
    });

    useEffect(() => {
        if (id) {
             const existingExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
             const expense = existingExpenses.find(e => e.id.toString() === id);
             if (expense) {
                 setExpenseData(expense);
                 if (!expense.bill && expense.amount > 5000) {
                     setExpenseData(prev => ({...prev, bill: 'Restaurant Bill.pdf'}));
                 }
             }
        }
    }, [id]);

    const handleSave = () => {
        // Basic validation
        if (!expenseData.title || !expenseData.amount || !expenseData.date) {
            alert("Please fill in required fields (Title, Amount, Date)");
            return;
        }

        const existingExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
        
        if (id) {
            // Update existing
            const updatedExpenses = existingExpenses.map(ex => 
                ex.id.toString() === id ? { ...ex, ...expenseData, amount: Number(expenseData.amount) } : ex
            );
            localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
            setIsEditing(false);
        } else {
            // Create new
            const newExpense = {
                id: Date.now(),
                ...expenseData,
                amount: Number(expenseData.amount),
                status: 'Submitted', 
                date: typeof expenseData.date === 'string' ? expenseData.date : expenseData.date?.toLocaleDateString('en-GB')
            };
            localStorage.setItem('expenses', JSON.stringify([newExpense, ...existingExpenses]));
            navigate('/hrms/expenses/expense');
        }
    };
    
    const toggleEdit = () => {
        setIsEditing(true);
    };

    const handleRemoveBill = () => {
        setExpenseData({ ...expenseData, bill: null });
    };

    const handleUploadMock = () => {
        setExpenseData({ ...expenseData, bill: 'Uploaded_Bill.pdf' });
    };

    return (
        <div className="bg-white px-4 sm:px-4 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col font-inter">
            
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 shrink-0" style={{ fontFamily: 'Mulish, sans-serif' }}>
                 <img 
                    src="/images/arrow_left_alt.svg" 
                    alt="Back" 
                    className="w-3 h-3 cursor-pointer hover:scale-110 transition-transform" 
                    onClick={() => navigate('/hrms/expenses/expense')}
                />
                 <span 
                    className='cursor-pointer text-[#7D1EDB]'
                    onClick={() => navigate('/hrms')}
                >
                    HRMS Dashboard
                </span> 
                <ChevronRight size={14}/> 
                <span 
                    className='cursor-pointer text-[#7D1EDB] hover:text-[#7D1EDB]'
                    onClick={() => navigate('/hrms/expenses/expense')}
                >
                    Expense
                </span>
                <ChevronRight size={14}/>
                <span className="text-gray-500">
                    {id ? (expenseData.title || 'Expense Details') : 'New Expense'}
                </span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-4 shrink-0">
                <div className="flex items-center gap-3">
                    <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
                        {id ? 'Expense Details' : 'New Expense'}
                    </h1>
                    {/* Show status badge if in view/edit mode */}
                    {id && expenseData.status && (
                        <div className="px-3 py-1 rounded-md bg-white border border-[#E0E0E0] text-[12px] font-medium text-[#1E1E1E]">
                            {expenseData.status}
                        </div>
                    )}
                </div>
                
                {(!id || isEditing) ? (
                    <button
                        className="px-4 py-2 rounded-full bg-[#7D1EDB] text-white font-medium hover:bg-purple-700 transition-colors"
                        onClick={handleSave}
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        {id ? 'Save' : 'Submit'}
                    </button>
                ) : (
                    <button
                        className="px-4 py-2 rounded-full border border-[#7D1EDB] text-[#7D1EDB] font-medium hover:bg-purple-50 transition-colors"
                        onClick={toggleEdit} // Simply enables edit mode
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        Edit
                    </button>
                )}
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto pr-2 pb-4">
                
                <div className="border border-[#E0E0E0] rounded-xl p-4 mb-4">
                    <h3 className="text-[16px] font-semibold text-[#1E1E1E] mb-4" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
                        Expense Details
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {/* Expense Title */}
                        <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-2">Expense Title</label>
                            <input 
                                type="text"
                                className={`w-full border border-[#D9D9D9] rounded-lg px-4 py-2.5 text-[16px] text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB] placeholder-[#757575] ${!isEditing ? 'bg-gray-50' : ''}`}
                                placeholder="Enter title"
                                value={expenseData.title}
                                onChange={(e) => setExpenseData({...expenseData, title: e.target.value})}
                                disabled={!isEditing}
                            />
                        </div>

                        {/* Expense Category */}
                        <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-2">Expense Category</label>
                            <FilterDropdown
                                options={[
                                    'Travel',
                                    'Meal & Entertainment',
                                    'Professional Development',
                                    'Supplies',
                                    'Software',
                                    'Other'
                                ]}
                                value={expenseData.category}
                                onChange={(val) => setExpenseData({...expenseData, category: val})}
                                placeholder="Select category"
                                className="w-full bg-white border border-[#D9D9D9] text-[#1E1E1E] rounded-lg h-[46px] flex items-center justify-between px-4"
                                minWidth="100%"
                                disableAllOption={true}
                                disabled={!isEditing}
                            />
                        </div>

                        {/* Amount */}
                        <div>
                             <label className="block text-[16px] font-normal text-[#1E1E1E] mb-2">Amount</label>
                            <input 
                                type="text"
                                className={`w-full border border-[#D9D9D9] rounded-lg px-4 py-2.5 text-[16px] text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB] placeholder-[#757575] ${!isEditing ? 'bg-gray-50' : ''}`}
                                placeholder="Enter amount"
                                value={expenseData.amount}
                                onChange={(e) => {
                                    if (/^\d*\.?\d*$/.test(e.target.value)) {
                                        setExpenseData({...expenseData, amount: e.target.value});
                                    }
                                }}
                                disabled={!isEditing}
                            />
                        </div>

                        {/* Expense Date */}
                        <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-2">Expense Date</label>
                            <CustomDatePicker 
                                value={expenseData.date}
                                onChange={(date) => setExpenseData({...expenseData, date: date})}
                                placeholder="Select date"
                                disabled={!isEditing}
                            />
                        </div>

                        {/* Payment Type */}
                        <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-2">Payment Type</label>
                            <FilterDropdown
                                options={[
                                    'Company Paid',
                                    'Self Paid'
                                ]}
                                value={expenseData.paymentType}
                                onChange={(val) => setExpenseData({...expenseData, paymentType: val})}
                                placeholder="Select type"
                                className="w-full bg-white border border-[#D9D9D9] text-[#1E1E1E] rounded-lg h-[46px] flex items-center justify-between px-4"
                                minWidth="100%"
                                disableAllOption={true}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-[16px] font-normal text-[#1E1E1E] mb-2">Description</label>
                        <textarea 
                            className={`w-full border border-[#D9D9D9] rounded-lg px-4 py-3 text-[16px] text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB] placeholder-[#757575] min-h-[100px] resize-none ${!isEditing ? 'bg-gray-50' : ''}`}
                            placeholder="Enter text"
                            value={expenseData.description}
                            onChange={(e) => setExpenseData({...expenseData, description: e.target.value})}
                            disabled={!isEditing}
                        />
                    </div>
                </div>

                {/* Upload Bill Section */}
                <div className="border border-[#E0E0E0] rounded-xl p-6">
                    <h3 className="text-[16px] font-semibold text-[#1E1E1E] mb-4" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
                        Upload Bill
                    </h3>
                    
                    {/* Logic for Bill Display */}
                    {isEditing ? (
                        /* Edit Mode */
                        expenseData.bill ? (
                            /* Has Bill: Show file with cut option */
                             <div className="w-[50%] flex items-center justify-between border border-[#E0E0E0] rounded-lg p-4 bg-white">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                                         <FileText size={20} className="text-[#7D1EDB]" />
                                    </div>
                                    <span className="text-[16px] font-medium text-[#1E1E1E]">{expenseData.bill}</span>
                                </div>
                                <button 
                                    onClick={handleRemoveBill}
                                    className="p-2 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        ) : (
                             /* No Bill: Show upload area */
                            <div 
                                className="border-2 border-dashed border-[#E0E0E0] rounded-lg bg-[#F9FAFB] h-40 flex flex-col items-center justify-center cursor-pointer hover:bg-purple-50 hover:border-purple-200 transition-colors group"
                                onClick={handleUploadMock}
                            >
                                <img 
                                    src="/images/uploadDoc.svg" 
                                    alt="Upload Document" 
                                    className="w-12 h-10 mb-4"
                                />
                                <span className="text-[16px] font-medium text-[#1E1E1E] mb-1" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
                                    Upload Bill
                                </span>
                                <span className="text-[12px] text-[#7D1EDB] font-medium">
                                    Drag & Drop Or Click To Browse
                                </span>
                            </div>
                        )
                    ) : (
                        /* View Mode */
                        expenseData.bill ? (
                             /* Has Bill: Show file with download button */
                            <div className="w-[50%] flex items-center justify-between border border-[#E0E0E0] rounded-lg p-4 bg-white">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                                         <FileText size={20} className="text-[#7D1EDB]" />
                                    </div>
                                    <span className="text-[16px] font-medium text-[#1E1E1E]">{expenseData.bill}</span>
                                </div>
                                <button className="px-4 py-2 border border-[#7D1EDB] text-[#7D1EDB] rounded-full text-[16px] font-medium hover:bg-purple-50 transition-colors">
                                    Download
                                </button>
                            </div>
                        ) : (
                            /* No Bill */
                           <div className="text-center py-8 text-gray-500 italic">
                               No bill attached
                           </div>
                        )
                    )}
                </div>

            </div>
        </div>
    );
};

export default AddExpense;
