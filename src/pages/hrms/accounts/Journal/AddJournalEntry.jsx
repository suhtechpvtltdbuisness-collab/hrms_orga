import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, X } from 'lucide-react';
import FilterDropdown from '../../../../components/ui/FilterDropdown';
import CustomDatePicker from '../../../../components/ui/CustomDatePicker';

const AddJournalEntry = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    
    const [formData, setFormData] = useState({
        entryDate: '',
        remarks: '',
        entries: []
    });

    const [accountOptions, setAccountOptions] = useState([]);

    useEffect(() => {
        // Load accounts from localStorage for the dropdown
        const accounts = JSON.parse(localStorage.getItem('hrms_accounts')) || [];
        setAccountOptions(accounts.map(acc => acc.accountName));

        // Load entry data if in edit mode
        if (id) {
            const entries = JSON.parse(localStorage.getItem('hrms_journal_entries')) || [];
            const entryToEdit = entries.find(e => e.id === parseInt(id));
            if (entryToEdit) {
                setFormData(entryToEdit);
            }
        }
    }, [id]);

    const handleHeaderChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLineChange = (index, field, value) => {
        const newEntries = [...formData.entries];
        
        // constraints
        if (field === 'debit' || field === 'credit') {
             if (value && !/^\d*\.?\d*$/.test(value)) return;
        }

        newEntries[index][field] = value;
        setFormData(prev => ({ ...prev, entries: newEntries }));
    };

    const addLine = () => {
        setFormData(prev => ({
            ...prev,
            entries: [...prev.entries, { account: '', debit: '', credit: '' }]
        }));
    };

    const removeLine = (index) => {
        const newEntries = formData.entries.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, entries: newEntries }));
    };

    const calculateTotals = () => {
        let totalDebit = 0;
        let totalCredit = 0;

        formData.entries.forEach(entry => {
            totalDebit += parseFloat(entry.debit || 0);
            totalCredit += parseFloat(entry.credit || 0);
        });

        return {
            totalDebit: totalDebit.toFixed(2),
            totalCredit: totalCredit.toFixed(2),
            balance: (totalDebit - totalCredit).toFixed(2)
        };
    };

    const { totalDebit, totalCredit, balance } = calculateTotals();

    const handleSave = () => {
       if (!formData.entryDate || !formData.remarks || formData.entries.length === 0) {
           alert("Please fill all required fields");
           return;
       }

       const existingEntries = JSON.parse(localStorage.getItem('hrms_journal_entries')) || [];
       
       if (id) {
           const updatedEntries = existingEntries.map(entry => {
               if (entry.id === parseInt(id)) {
                   return {
                       ...entry,
                       ...formData,
                       totalDebit,
                       totalCredit,
                       balance
                   };
               }
               return entry;
           });
           localStorage.setItem('hrms_journal_entries', JSON.stringify(updatedEntries));
       } else {
           const newEntry = {
               id: Date.now(),
               ...formData,
               totalDebit,
               totalCredit,
               balance
           };
           localStorage.setItem('hrms_journal_entries', JSON.stringify([...existingEntries, newEntry]));
       }

       navigate('/hrms/journal-entry');
    };

    return (
        <div className="bg-white px-4 sm:px-4 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col" style={{ fontFamily: 'Inter, sans-serif' }}>
            
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 shrink-0" style={{ fontFamily: 'Mulish, sans-serif' }}>
                 <img 
                    src="/images/arrow_left_alt.svg" 
                    alt="Back" 
                    className="w-3 h-3 cursor-pointer hover:scale-110 transition-transform" 
                    onClick={() => navigate('/hrms/journal-entry')}
                />
                 <span 
                    className='cursor-pointer text-[#7D1EDB]'
                    onClick={() => navigate('/hrms/journal-entry')}
                >
                    Journal Entries
                </span> 
                <ChevronRight size={14}/> 
                <span className="text-[#6B7280]">{id ? 'Edit Journal Entry' : 'Add New Journal Entry'}</span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-4 shrink-0">
                <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>{id ? 'Edit Journal Entry' : 'Add New Journal Entry'}</h1>
                
                <div className="flex items-center gap-4">
                    <button
                        className="px-3 py-2 border border-[#7D1EDB] rounded-full text-[#7D1EDB] font-medium text-[16px] hover:bg-purple-50 transition-colors"
                        onClick={() => navigate('/hrms/journal-entry')}
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-3 py-2 bg-[#7D1EDB] rounded-full text-white font-medium text-[16px] hover:bg-purple-700 transition-colors"
                        onClick={handleSave}
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        {id ? 'Update' : 'Save'}
                    </button>
                </div>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto pr-2">
                <div className="border border-[#C9C9C9] rounded-xl p-4">
                    <h2 className="text-[15px] font-semibold text-[#1E1E1E] mb-3" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>{id ? 'Edit Journal Entry' : 'Create Journal Entry'}</h2>
                    
                    {/* Header Fields */}
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="w-full md:w-1/3">
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-2">Entry Date</label>
                            <CustomDatePicker
                                value={formData.entryDate}
                                onChange={(date) => setFormData(prev => ({ ...prev, entryDate: date }))}
                                placeholder="Select date"
                                className="w-full border border-[#D9D9D9] rounded-lg px-4 py-2 text-[16px] font-normal text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB] placeholder:text-[#9E9E9E]"
                            />
                        </div>
                        <div className="w-full md:w-2/3">
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-2">Remarks</label>
                            <input 
                                type="text"
                                name="remarks"
                                value={formData.remarks}
                                onChange={handleHeaderChange}
                                placeholder="Enter remarks"
                                className="w-full border border-[#D9D9D9] rounded-lg px-4 py-2 text-[16px] font-normal text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB] placeholder:text-[#9E9E9E]"
                            />
                        </div>
                    </div>

                    {/* Lines Section */}
                    <div className="border border-[#D7D7D7] rounded-lg p-4">
                        <div className="space-y-4">
                            {formData.entries.length > 0 && (
                                <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 mb-2 items-center">
                                     <div className="text-[16px] font-normal text-[#1E1E1E]">Account</div>
                                     <div className="text-[16px] font-normal text-[#1E1E1E]">Debit</div>
                                     <div className="text-[16px] font-normal text-[#1E1E1E]">Credit</div>
                                     <div className="w-[48px]"></div>
                                </div>
                            )}
                            {formData.entries.map((entry, index) => (
                                <div key={index} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 items-start">
                                    <div>
                                        <FilterDropdown
                                            options={accountOptions}
                                            value={entry.account}
                                            onChange={(val) => handleLineChange(index, 'account', val)}
                                            className="w-full h-[42px] px-4 bg-white border border-[#D9D9D9] rounded-lg text-[16px] font-normal text-[#1E1E1E] focus:ring-1 focus:ring-[#7D1EDB] flex items-center justify-between"
                                            showArrow={true}
                                            dropdownWidth="100%"
                                            minWidth="100%"
                                            align='left'
                                            placeholder="Select account"
                                            backgr
                                        />
                                    </div>
                                    <div>
                                        <input 
                                            type="text"
                                            value={entry.debit}
                                            onChange={(e) => handleLineChange(index, 'debit', e.target.value)}
                                            placeholder="Enter amount"
                                            className="w-full border border-[#D9D9D9] rounded-lg px-4 py-2 text-[16px] font-normal text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB] placeholder:text-[#9E9E9E]"
                                        />
                                    </div>
                                    <div>
                                        <input 
                                            type="text"
                                            value={entry.credit}
                                            onChange={(e) => handleLineChange(index, 'credit', e.target.value)}
                                            placeholder="Enter amount"
                                            className="w-full border border-[#D9D9D9] rounded-lg px-4 py-2 text-[16px] font-normal text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB] placeholder:text-[#9E9E9E]"
                                        />
                                    </div>
                                    <div className="mt-px">
                                        <button 
                                            onClick={() => removeLine(index)}
                                            className="h-[42px] px-3 border border-[#D9D9D9] rounded-lg text-[#1F1F1F] flex items-center justify-center hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div className="mt-2 space-y-2">
                            <div className="flex justify-between text-[14px] text-[#1E1E1E]">
                                <span>Total Debits:</span>
                                <span>{totalDebit}</span>
                            </div>
                            <div className="flex justify-between text-[14px] text-[#1E1E1E]">
                                <span>Total Credits:</span>
                                <span>{totalCredit}</span>
                            </div>
                            <div className="border-t border-[#A9A9A9] pt-2 flex justify-between text-[14px] font-medium text-[#1E1E1E]">
                                <span>Balance:</span>
                                <span>{balance}</span>
                            </div>
                        </div>

                        {/* Add Line Button */}
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={addLine}
                                className="px-3 py-2 border border-[#7D1EDB] rounded-full text-[#7D1EDB] text-[16px] font-medium hover:bg-purple-50 transition-colors"
                            >
                                Add Line
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-4">
                        <button
                            className="px-3 py-2 bg-[#7D1EDB] rounded-full text-white font-medium text-[16px] hover:bg-purple-700 transition-colors"
                            onClick={handleSave}
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                            Create Entry
                        </button>
                         <button
                            className="px-3 py-2 border border-[#7D1EDB] rounded-full text-[#7D1EDB] font-medium text-[16px] hover:bg-purple-50 transition-colors"
                            onClick={() => navigate('/hrms/journal-entry')}
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

export default AddJournalEntry;
