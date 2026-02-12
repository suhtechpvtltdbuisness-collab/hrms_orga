import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Plus } from 'lucide-react';

const ChartOfAccounts = () => {
    const navigate = useNavigate();
    const [accountData, setAccountData] = useState([]);

    useEffect(() => {
        const storedAccounts = JSON.parse(localStorage.getItem('hrms_accounts')) || [];
        setAccountData(storedAccounts);
    }, []);

    const handleDelete = (id) => {
        const updatedAccounts = accountData.filter(acc => acc.id !== id);
        localStorage.setItem('hrms_accounts', JSON.stringify(updatedAccounts));
        setAccountData(updatedAccounts);
    };

    const handleEdit = (account) => {
        navigate('/hrms/chart-of-accounts/add', { state: { account } });
    };

    const accountTemplates = [
        { title: "ASSET", type: "Asset" },
        { title: "LIABILITY", type: "Liability" },
        { title: "EQUITY", type: "Equity" },
        { title: "REVENUE", type: "Income" }, // Mapped 'Revenue' to 'Income' from AddAccount options
        { title: "EXPENSE", type: "Expense" },
    ];

    // Group accounts by type
    const accountsByType = accountTemplates.map(template => {
        const accounts = accountData.filter(acc => 
            acc.accountType === template.type || 
            (template.type === 'Income' && acc.accountType === 'Revenue') // Handle potential naming mismatch
        );
        return {
            title: template.title,
            count: accounts.length,
            accounts: accounts
        };
    });

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
                <span className="text-[#6B7280]">Chart Of Accounts</span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-6 shrink-0">
                <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Chart Of Accounts</h1>
                
                <button
                    className="flex items-center justify-center gap-2 rounded-full py-2 px-3 text-white font-normal hover:bg-purple-700 transition-colors bg-[#7D1EDB]"
                    onClick={() => navigate('/hrms/chart-of-accounts/add')}
                >
                     <span className='text-[16px] font-normal text-white flex items-center gap-1' style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Add Account <Plus size={18} strokeWidth={2} />
                     </span>
                </button>
            </div>

            {/* Content Scroll Area */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {accountsByType.map((type, index) => (
                    <React.Fragment key={index}>
                        {type.accounts.length > 0 ? (
                            type.accounts.map((account, accIndex) => (
                                <div 
                                    key={accIndex} 
                                    className="border border-[#E0E0E0] rounded-lg p-4 bg-white flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
                                    onClick={() => navigate('/hrms/chart-of-accounts/add', { state: { account, viewMode: true } })}
                                >
                                    <div className='flex flex-col gap-1'>
                                        <h3 className="text-[16px] font-semibold text-[#1E1E1E]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                                            {account.accountCode ? `${account.accountCode}-` : ''}{account.accountName}
                                        </h3>
                                        {account.currency && <span className='text-sm text-gray-500' style={{ fontFamily: 'Inter, sans-serif' }}>Currency: {account.currency}</span>}
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
                                    {type.title}
                                </h3>
                                <p className="text-sm text-[#757575]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                    No accounts of this type
                                </p>
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default ChartOfAccounts;
