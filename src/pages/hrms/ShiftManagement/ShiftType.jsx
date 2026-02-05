import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Plus } from 'lucide-react';

const ShiftType = () => {
    const navigate = useNavigate();

    // Mock Data
    const shiftTypes = [
        { id: 1, name: "Morning Shift", startTime: "9:00", endTime: "2:00", totalHours: "7.0 hrs" },
        { id: 2, name: "Night Shift", startTime: "9:00", endTime: "2:00", totalHours: "7.0 hrs" },
        { id: 3, name: "Evening Shift", startTime: "9:00", endTime: "2:00", totalHours: "7.0 hrs" },
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
        <div className="bg-white px-4 sm:px-4 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col font-popins" style={{ fontFamily: 'Poppins, sans-serif' }}>
            
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 shrink-0">
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
                <span className="text-[#6B7280]">Shift Type</span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-4 shrink-0">
                <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Shift Type</h1>

                <button
                    className="flex items-center justify-center gap-2 rounded-full py-2 px-4 text-white font-medium hover:bg-purple-700 transition-colors bg-[#7D1EDB]"
                    onClick={() => navigate('/hrms/shift-type/new')}
                >
                    <span className='text-[16px] font-medium text-white font-popins'>Add Shift Type</span>
                    <Plus size={18} />
                </button>
            </div>

            {/* Table */}
            <div className="h-fit min-h-0 overflow-y-auto border border-[#CECECE] rounded-lg">
                <table className="w-full relative border-collapse">
                    <thead className="sticky top-0 z-10 bg-white">
                        <tr className="text-left text-[14px] font-popins border-b border-[#CECECE]">
                            <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 w-[5%]">
                            </th>
                            <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 w-[25%]">
                                Name
                            </th>
                            <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 w-[20%] text-center">
                                Start Time
                            </th>
                            <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 w-[20%] text-center">
                                End Time
                            </th>
                            <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 w-[20%] text-right">
                                Total Hours
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {shiftTypes.map((shift, index) => (
                            <tr key={shift.id} className="hover:bg-gray-50 transition-colors text-[14px] font-medium text-[#1E1E1E]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                                <td className="py-3 px-6">
                                    <input 
                                        type="checkbox" 
                                        className="w-4 h-4 rounded border-[#1F1F1F] text-[#7D1EDB] focus:ring-[#7D1EDB]" 
                                        checked={selectedRows.includes(shift.id)}
                                        onChange={() => handleSelectRow(shift.id)}
                                    />
                                </td>
                                <td className="py-3 px-6 cursor-pointer" onClick={() => navigate(`/hrms/shift-type/${shift.id}`)}>
                                    {shift.name}
                                </td>
                                <td className="py-3 px-6 text-center">
                                    {shift.startTime}
                                </td>
                                <td className="py-3 px-6 text-center">
                                    {shift.endTime}
                                </td>
                                <td className="py-3 px-6 text-right">
                                    {shift.totalHours}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ShiftType;
