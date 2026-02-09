import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import CustomDatePicker from '../../../components/ui/CustomDatePicker';

const EnergyPointSettings = () => {
    const navigate = useNavigate();

    // State
    const [enabled, setEnabled] = useState(false);
    const [reviewLevels, setReviewLevels] = useState([
        { id: 1, srNo: "01", levelName: "Level 1", role: "HR Manager", reviewPoints: 25 }
    ]);
    const [allocationPeriod, setAllocationPeriod] = useState("Weekly");
    const [lastAllocationDate, setLastAllocationDate] = useState("2026-01-29");
    const [selectedRows, setSelectedRows] = useState([]);

    // Handlers
    const handleAddRow = () => {
        const newId = reviewLevels.length + 1;
        const newRow = {
            id: newId,
            srNo: newId.toString().padStart(2, '0'),
            levelName: `Level ${newId}`,
            role: "Select Role",
            reviewPoints: 0
        };
        setReviewLevels([...reviewLevels, newRow]);
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedRows(reviewLevels.map(item => item.id));
        } else {
            setSelectedRows([]);
        }
    };

    const handleSelectRow = (id) => {
        setSelectedRows(prev => {
            if (prev.includes(id)) {
                return prev.filter(rowId => rowId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const handleSave = () => {
        console.log("Saving settings...", { enabled, reviewLevels, allocationPeriod, lastAllocationDate });
        // Add API call here
    };

    return (
        <div className="bg-white px-4 sm:px-4 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col">
            
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 shrink-0"style={{ fontFamily: 'Mulish, sans-serif' }}>
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
                <span className="text-[#6B7280]">Energy Point Settings</span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-6 shrink-0">
                <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Energy Point Settings</h1>
                
                <button
                    className="flex items-center justify-center gap-2 rounded-full py-2 px-3 text-white font-normal hover:bg-purple-700 transition-colors bg-[#7D1EDB]"
                    onClick={handleSave}
                >
                    <span className='text-[16px] font-normal text-white'style={{ fontFamily: 'Poppins, sans-serif' }}>Save</span>
                </button>
            </div>

            {/* Content Scroll Area */}
            <div className="flex-1 overflow-y-auto pr-2">
                {/* Enabled Field */}
                <div className="border border-[#E0E0E0] rounded-lg p-4 mb-4">
                    <label className="flex items-center gap-3 cursor-pointer w-fit">
                        <div className="relative flex items-center justify-center w-5 h-5 border-2 border-black rounded-[4px]">
                            <input 
                                type="checkbox" 
                                checked={enabled}
                                onChange={(e) => setEnabled(e.target.checked)}
                                className="peer appearance-none w-full h-full cursor-pointer absolute inset-0 z-10 opacity-0"
                            />
                            {enabled && (
                                <svg className="w-3 h-3 text-black pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                        <span className="text-sm font-medium text-[#1E1E1E]">Enabled</span>
                    </label>
                </div>

                {/* Review Levels Section */}
                <div className="border border-[#E0E0E0] rounded-lg p-6 mb-6">
                    <h3 className="text-[16px] font-medium text-[#1E1E1E] mb-4">Review Levels</h3>
                    
                    {/* Table */}
                    <div className="border border-[#E0E0E0] rounded-lg overflow-hidden mb-4">
                        <table className="w-full border-collapse">
                            <thead style={{ fontFamily: 'Poppins, sans-serif' }}>
                                <tr className="border-b border-[#E0E0E0]">
                                    <th className="py-3 px-6 w-[50px] text-center">
                                        <div className="flex items-center justify-center h-full">
                                          <div className="relative flex items-center justify-center w-5 h-5 border-2 border-black rounded-[4px]">
                                              <input 
                                                  type="checkbox" 
                                                  checked={reviewLevels.length > 0 && selectedRows.length === reviewLevels.length}
                                                  onChange={handleSelectAll}
                                                  className="peer appearance-none w-full h-full cursor-pointer absolute inset-0 z-10 opacity-0"
                                              />
                                              {reviewLevels.length > 0 && selectedRows.length === reviewLevels.length && (
                                                  <svg className="w-3 h-3 text-black pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                  </svg>
                                              )}
                                          </div>
                                        </div>
                                    </th>
                                    <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 text-center">Sr No.</th>
                                    <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 text-center">Level Name</th>
                                    <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 text-center">Role</th>
                                    <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 text-center">Review Points</th>
                                    <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody style={{ fontFamily: 'Nunito-sans, sans-serif' }}>
                                {reviewLevels.map((row) => (
                                    <tr key={row.id} className="last:border-b-0 hover:bg-gray-50">
                                        <td className="py-3 px-6 text-center">
                                            <div className="flex items-center justify-center h-full">
                                                <div className="relative flex items-center justify-center w-5 h-5 border-2 border-black rounded-[4px]">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={selectedRows.includes(row.id)}
                                                        onChange={() => handleSelectRow(row.id)}
                                                        className="peer appearance-none w-full h-full cursor-pointer absolute inset-0 z-10 opacity-0"
                                                    />
                                                    {selectedRows.includes(row.id) && (
                                                        <svg className="w-3 h-3 text-black pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-6 text-center text-sm font-medium text-[#1E1E1E]">{row.srNo}</td>
                                        <td className="py-3 px-6 text-center text-sm font-medium text-[#1E1E1E]">{row.levelName}</td>
                                        <td className="py-3 px-6 text-center text-sm font-medium text-[#1E1E1E]">{row.role}</td>
                                        <td className="py-3 px-6 text-center text-sm font-medium text-[#1E1E1E]">{row.reviewPoints}</td>
                                        <td className="py-3 px-6 text-center">
                                            <button className="hover:scale-110 transition-transform">
                                                <img src="/pencil.svg" alt="Edit" className="w-[18px] h-[18px]" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <button 
                        onClick={handleAddRow}
                        className="px-3 py-2 rounded-full border border-[#7D1EDB] text-[#7D1EDB] text-sm font-medium hover:bg-purple-50 transition-colors"style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        Add Row
                    </button>

                    {/* Additional Settings */}
                    <div className="mt-6 space-y-4"style={{ fontFamily: 'Inter, sans-serif' }}>
                        <div>
                            <label className="block text-sm font-normal text-[#1E1E1E] mb-2">Point Allocation Periodically</label>
                            <input 
                                type="text"
                                value={allocationPeriod}
                                onChange={(e) => setAllocationPeriod(e.target.value)}
                                className="w-full sm:w-[300px] border border-[#E0E0E0] rounded-lg px-4 py-2.5 text-sm text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB]"
                                placeholder="Weekly"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-normal text-[#1E1E1E] mb-2">Last Point Allocation Date</label>
                            <div className="relative w-full sm:w-[300px]">
                                <CustomDatePicker
                                    value={lastAllocationDate}
                                    onChange={setLastAllocationDate}
                                    className="w-full border border-[#E0E0E0] rounded-lg px-4 py-2.5 text-sm text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB] bg-white"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnergyPointSettings;
