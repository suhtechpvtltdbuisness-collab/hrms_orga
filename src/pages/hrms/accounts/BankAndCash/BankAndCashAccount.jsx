import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Plus } from 'lucide-react';

const BankAndCashAccount = () => {
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        const storedAccounts = JSON.parse(localStorage.getItem('hrms_bank_accounts')) || [];
        setAccounts(storedAccounts);
    }, []);

    const handleDelete = (id) => {
        const updatedAccounts = accounts.filter(acc => acc.id !== id);
        localStorage.setItem('hrms_bank_accounts', JSON.stringify(updatedAccounts));
        setAccounts(updatedAccounts);
    };

    const handleEdit = (account) => {
        navigate('/hrms/bank-and-cash/add', { state: { account } });
    };

    return (
        <div className="bg-white px-4 sm:px-4 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col font-inter" style={{ fontFamily: 'Inter, sans-serif' }}>
            
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 shrink-0" style={{ fontFamily: 'Mulish, sans-serif' }}>
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
                <span className="text-[#6B7280]">Bank And Cash Account</span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-4 shrink-0">
                <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Bank And Cash Account</h1>
                
                <button
                    className="flex items-center justify-center gap-2 rounded-full py-2 px-3 text-white font-normal hover:bg-purple-700 transition-colors bg-[#7D1EDB]"
                    onClick={() => navigate('/hrms/bank-and-cash/add')}
                >
                     <span className='text-[16px] font-normal text-white flex items-center gap-1' style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Add Account <Plus size={18} strokeWidth={2} />
                     </span>
                </button>
            </div>

            {/* Content Scroll Area */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {accounts.length > 0 ? (
                    accounts.map((account, index) => (
                        <div key={index} className="border border-[#E0E0E0] rounded-lg p-4 bg-white flex justify-between items-center">
                            <div className='flex flex-col gap-1'>
                                <h3 className="text-[16px] font-semibold text-[#1E1E1E]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                                    {account.bankName}
                                </h3>
                                <div className="text-[15px] text-[#757575] space-y-1">
                                    <p>Account No.- {account.accountNumber ? `XXXX${account.accountNumber.slice(-3)}` : ''}</p>
                                    <p>Balance:{account.openingBalance}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button 
                                    className="flex items-center gap-2 px-3 py-2 border border-[#7D1EDB] rounded-full text-[#7D1EDB] hover:bg-purple-50 transition-colors"
                                    onClick={(e) => { e.stopPropagation(); handleEdit(account); }}
                                >
                                    <span className="text-[16px] font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>Edit</span>
                                    <img src="/images/Edit.svg" alt="Edit" className="w-4 h-4" />
                                </button>
                                <button 
                                    className="flex items-center gap-2 px-3 py-2 border border-[#7D1EDB] rounded-full text-[#7D1EDB] hover:bg-purple-50 transition-colors"
                                    onClick={(e) => { e.stopPropagation(); handleDelete(account.id); }}
                                >
                                    <span className="text-[16px] font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>Delete</span>
                                    <img src="/images/delete.svg" alt="Delete" className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="border border-[#E0E0E0] rounded-lg p-4 bg-white">
                        <h3 className="text-base font-medium text-[#1E1E1E] mb-2" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                            Bank Accounts
                        </h3>
                        <p className="text-sm text-[#757575]" style={{ fontFamily: 'Inter, sans-serif' }}>
                            No bank accounts yet
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BankAndCashAccount;
