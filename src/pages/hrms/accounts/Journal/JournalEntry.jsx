import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Plus } from 'lucide-react';

const JournalEntry = () => {
    const navigate = useNavigate();
    const [state, setState] = React.useState({ entries: [] });

    React.useEffect(() => {
        const storedEntries = JSON.parse(localStorage.getItem('hrms_journal_entries')) || [];
        setState({ entries: storedEntries });
    }, []);

    const handleDelete = (id) => {
        const updatedEntries = state.entries.filter(entry => entry.id !== id);
        localStorage.setItem('hrms_journal_entries', JSON.stringify(updatedEntries));
        setState({ entries: updatedEntries });
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
                <span className="text-[#6B7280]">Journal Entry</span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-4 shrink-0">
                <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Journal Entry</h1>
                
                <button
                    className="flex items-center justify-center gap-2 rounded-full py-2 px-3 text-white font-normal hover:bg-purple-700 transition-colors bg-[#7D1EDB]"
                    onClick={() => navigate('/hrms/journal-entry/add')}
                >
                     <span className='text-[16px] font-normal text-white flex items-center gap-1' style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Add New Entry <Plus size={18} strokeWidth={2} />
                     </span>
                </button>
            </div>

            {/* Content Scroll Area */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {state.entries.length === 0 ? (
                    <div className="border border-[#E0E0E0] rounded-lg p-4 bg-white">
                        <h3 className="text-base font-medium text-[#1E1E1E] mb-2" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                            Journal Entry
                        </h3>
                        <p className="text-sm text-[#757575]" style={{ fontFamily: 'Inter, sans-serif' }}>
                            No journal entries yet
                        </p>
                    </div>
                ) : (
                    state.entries.map((entry) => (
                        <div key={entry.id} className="border border-[#C9C9C9] rounded-xl p-4 bg-white">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-[18px] font-semibold text-[#1E1E1E] mb-1" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                                        {entry.remarks}
                                    </h3>
                                    <p className="text-[14px] text-[#757575]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                                        Date: {entry.entryDate}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        className="flex items-center gap-1 px-3 py-2 border border-[#7D1EDB] rounded-full text-[#7D1EDB] text-[16px] font-medium hover:bg-purple-50 transition-colors"
                                        style={{ fontFamily: 'Poppins, sans-serif' }}
                                        onClick={() => navigate(`/hrms/journal-entry/edit/${entry.id}`)}
                                    >
                                        Edit <img src="/images/Edit.svg" alt="edit" className="w-4 h-4" />
                                    </button>
                                    <button 
                                        className="flex items-center gap-1 px-3 py-2 border border-[#7D1EDB] rounded-full text-[#7D1EDB] text-[16px] font-medium hover:bg-purple-50 transition-colors"
                                        style={{ fontFamily: 'Poppins, sans-serif' }}
                                        onClick={() => handleDelete(entry.id)}
                                    >
                                        Delete <img src="/images/delete.svg" alt="delete" className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="border border-[#C9C9C9] rounded-lg overflow-hidden">
                                <div className="grid grid-cols-[1fr_1fr_1fr] bg-[#FFFFFF] border-b border-[#C9C9C9] p-3 text-[14px] font-normal text-[#757575]"style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    <div>Account</div>
                                    <div className="text-center">Debit</div>
                                    <div className="text-center">Credit</div>
                                </div>
                                <div className="divide-y divide-[#E0E0E0]">
                                    {entry.entries.map((line, idx) => (
                                        <div key={idx} className="grid grid-cols-[1fr_1fr_1fr] p-3 text-[14px] text-[#1E1E1E]">
                                            <div>{line.account}</div>
                                            <div className="text-center">{line.debit || '-'}</div>
                                            <div className="text-center">{line.credit || '-'}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default JournalEntry;
