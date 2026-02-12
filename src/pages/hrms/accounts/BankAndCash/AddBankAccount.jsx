import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import FilterDropdown from '../../../../components/ui/FilterDropdown';

const AddBankAccount = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const editingAccount = location.state?.account;

    const [formData, setFormData] = useState({
        id: '',
        accountType: '',
        bankName: '',
        accountNumber: '',
        openingBalance: '',
        linkedGLAccount: ''
    });

    const glAccounts = [
        "FIN-001-Parent Account",
    ];

    useEffect(() => {
        if (editingAccount) {
            setFormData(editingAccount);
        }
    }, [editingAccount]);

    const accountTypeOptions = [
        "Bank",
        "Cash"
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Input Constraints
        if (name === 'bankName') {
            // Allow only letters and spaces
            if (value && !/^[a-zA-Z\s]*$/.test(value)) return;
        }
        
        if (name === 'accountNumber') {
             // Allow only numbers
            if (value && !/^\d*$/.test(value)) return;
        }

        if (name === 'openingBalance') {
            // Allow numbers and one decimal point
            if (value && !/^\d*\.?\d*$/.test(value)) return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDropdownChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (!formData.bankName || !formData.accountNumber) {
            alert("Bank Name and Account Number are required!");
            return;
        }

        // Validate Account Number: must be exactly 12 digits
        if (!/^\d{12}$/.test(formData.accountNumber)) {
            alert("Account Number must be exactly 12 digits!");
            return;
        }

        const existingAccounts = JSON.parse(localStorage.getItem('hrms_bank_accounts')) || [];
        
        let updatedAccounts;
        if (editingAccount) {
            updatedAccounts = existingAccounts.map(acc => 
                acc.id === formData.id ? formData : acc
            );
        } else {
            const newAccount = { ...formData, id: Date.now().toString() };
            updatedAccounts = [...existingAccounts, newAccount];
        }

        localStorage.setItem('hrms_bank_accounts', JSON.stringify(updatedAccounts));
        navigate('/hrms/bank-and-cash');
    };

    return (
        <div className="bg-white px-4 sm:px-4 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col font-inter" style={{ fontFamily: 'Inter, sans-serif' }}>
            
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 shrink-0" style={{ fontFamily: 'Mulish, sans-serif' }}>
                 <img 
                    src="/images/arrow_left_alt.svg" 
                    alt="Back" 
                    className="w-3 h-3 cursor-pointer hover:scale-110 transition-transform" 
                    onClick={() => navigate('/hrms/bank-and-cash')}
                />
                 <span 
                    className='cursor-pointer text-[#7D1EDB]'
                    onClick={() => navigate('/hrms/bank-and-cash')}
                >
                    Bank And Cash Account
                </span> 
                <ChevronRight size={14}/> 
                <span className="text-[#6B7280]">{editingAccount ? 'Edit Account' : 'Add Account'}</span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-6 shrink-0">
                <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>{editingAccount ? 'Edit Account' : 'Add Account'}</h1>
                
                <div className="flex items-center gap-4">
                    <button
                        className="px-3 py-2 border border-[#7D1EDB] rounded-full text-[#7D1EDB] font-medium text-[16px] hover:bg-purple-50 transition-colors"
                        onClick={() => navigate('/hrms/bank-and-cash')}
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-3 py-2 bg-[#7D1EDB] rounded-full text-white font-medium text-[16px] hover:bg-purple-700 transition-colors"
                        onClick={handleSave}
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        Save
                    </button>
                </div>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto pr-2">
                <div className="border border-[#C9C9C9] rounded-xl p-4">
                    <h2 className="text-[15px] font-semibold text-[#1E1E1E] mb-3" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>{editingAccount ? 'Edit Account Details' : 'Add A New Account'}</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                         {/* Account Type */}
                         <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-2">Account Type</label>
                            <FilterDropdown
                                options={accountTypeOptions}
                                value={formData.accountType}
                                onChange={(val) => handleDropdownChange('accountType', val)}
                                className="w-full h-[42px] px-4 bg-white border border-[#D9D9D9] rounded-lg text-[16px] font-normal text-[#1E1E1E] focus:ring-1 focus:ring-[#7D1EDB] flex items-center justify-between"
                                showArrow={true}
                                dropdownWidth="100%"
                                minWidth="100%"
                                align='left'
                                placeholder="Select Type"
                                disableAllOption={true}
                            />
                        </div>

                        {/* Bank Name */}
                        <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-2">Bank Name</label>
                            <input 
                                type="text"
                                name="bankName"
                                value={formData.bankName}
                                onChange={handleChange}
                                placeholder="Enter bank name"
                                className="w-full border border-[#D9D9D9] rounded-lg px-4 py-2 text-[16px] font-normal text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB] placeholder:text-[#9E9E9E]"
                            />
                        </div>

                        {/* Account Number */}
                        <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-2">Account Number</label>
                            <input 
                                type="text"
                                name="accountNumber"
                                value={formData.accountNumber}
                                onChange={handleChange}
                                placeholder="Enter account number"
                                className="w-full border border-[#D9D9D9] rounded-lg px-4 py-2 text-[16px] font-normal text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB] placeholder:text-[#9E9E9E]"
                            />
                        </div>

                         {/* Opening Balance */}
                         <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-2">Opening Balance</label>
                            <input 
                                type="text"
                                name="openingBalance"
                                value={formData.openingBalance}
                                onChange={handleChange}
                                placeholder="Enter opening balance"
                                className="w-full border border-[#D9D9D9] rounded-lg px-4 py-2 text-[16px] font-normal text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB] placeholder:text-[#9E9E9E]"
                            />
                        </div>

                        {/* Linked GL Account */}
                        <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-2">Linked GL Account</label>
                            <FilterDropdown
                                options={glAccounts}
                                value={formData.linkedGLAccount}
                                onChange={(val) => handleDropdownChange('linkedGLAccount', val)}
                                className="w-full h-[42px] px-4 bg-white border border-[#D9D9D9] rounded-lg text-[16px] font-normal text-[#1E1E1E] focus:ring-1 focus:ring-[#7D1EDB] flex items-center justify-between"
                                showArrow={true}
                                dropdownWidth="100%"
                                minWidth="100%"
                                align='left'
                                placeholder="Select account"
                                disableAllOption={true}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mt-4">
                         <button
                            className="px-3 py-2.5 bg-[#7D1EDB] rounded-full text-white font-medium text-[16px] hover:bg-purple-700 transition-colors"
                            onClick={handleSave}
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                            {editingAccount ? 'Update Account' : 'Create Account'}
                        </button>
                        <button
                            className="px-3 py-2.5 border border-[#7D1EDB] rounded-full text-[#7D1EDB] font-medium text-[16px] hover:bg-purple-50 transition-colors"
                            onClick={() => navigate('/hrms/bank-and-cash')}
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddBankAccount;
