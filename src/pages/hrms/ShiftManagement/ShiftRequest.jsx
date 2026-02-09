import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Plus } from 'lucide-react';

const ShiftRequest = () => {
    const navigate = useNavigate();

    // Mock Data
    const shiftRequests = [
        { id: 1, employeeName: "Alice John", status: "Submitted", shiftType: "Day" },
        { id: 2, employeeName: "Carol White", status: "Submitted", shiftType: "Day" },
        { id: 3, employeeName: "Mike Miller", status: "Submitted", shiftType: "Day" },
    ];

    // State for checkbox selection
    const [selectedRows, setSelectedRows] = useState([]);

    // Handle Individual Selection
    const handleSelectRow = (id) => {
        setSelectedRows(prev => {
            if (prev.includes(id)) {
                return prev.filter(rowId => rowId !== id);
            } else {
                return [...prev, id];
            }
        });
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
                <span className="text-[#6B7280]">Shift Request</span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-4 shrink-0">
                <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Shift Request</h1>

                <button
                    onClick={() => navigate('/hrms/shift-request/new')}
                    className="flex items-center justify-center gap-2 rounded-full py-2 px-4 text-white font-medium hover:bg-purple-700 transition-colors bg-[#7D1EDB]"
                >
                    <span className='text-[16px] font-medium text-white' style={{ fontFamily: 'Poppins, sans-serif' }}>New Shift Request</span>
                    <Plus size={18} />
                </button>
            </div>

            {/* Table */}
            <div className="h-fit min-h-0 overflow-y-auto border border-[#CECECE] rounded-lg">
                <table className="w-full relative border-collapse">
                    <thead className="sticky top-0 z-10 bg-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        <tr className="text-left text-[14px] border-b border-[#CECECE]">
                            <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 w-[5%]">
                            </th>
                            <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 w-[35%]">
                                Employee Name
                            </th>
                            <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 w-[30%] text-center">
                                Status
                            </th>
                            <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 w-[30%] text-right">
                                Shift Type
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {shiftRequests.map((request, index) => (
                            <tr key={request.id} className="hover:bg-gray-50 transition-colors text-[14px] font-medium text-[#1E1E1E]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                                <td className="py-3 px-6">
                                    <div className="relative flex items-center justify-center">
                                        <input 
                                            type="checkbox" 
                                            className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-black bg-white checked:bg-white checked:border-black"
                                            checked={selectedRows.includes(request.id)}
                                            onChange={() => handleSelectRow(request.id)}
                                        />
                                        <svg 
                                            className="pointer-events-none absolute w-3 h-3 text-black hidden peer-checked:block" 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            viewBox="0 0 24 24" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            strokeWidth="3" 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round"
                                        >
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                </td>
                                <td className="py-3 px-6">
                                    {request.employeeName}
                                </td>
                                <td className="py-3 px-6 text-center">
                                    <span className="inline-block px-3 py-1 bg-[#E4F8D2] text-[#76DB1E] rounded-full text-xs font-medium">
                                        {request.status}
                                    </span>
                                </td>
                                <td className="py-3 px-6 text-right">
                                    {request.shiftType}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ShiftRequest;
