import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Plus } from 'lucide-react';

const LeavePeriod = () => {
    const navigate = useNavigate();

    // Mock Data
    const leavePeriods = [
        { id: 1, srNo: 1, name: "HR-EMP-0123", fromDate: "26/01/2026", toDate: "29/01/2026" },
        { id: 2, srNo: 2, name: "HR-EMP-0124", fromDate: "29/01/2026", toDate: "01/02/2026" },
        { id: 3, srNo: 3, name: "HR-EMP-0124", fromDate: "06/01/2026", toDate: "08/01/2026" },
    ];

    return (
        <div className="bg-white px-4 sm:px-4 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col font-popins" style={{ fontFamily: 'Poppins, sans-serif' }}>
            
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
                <span className="text-[#6B7280]">Leave Period</span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-4 shrink-0">
                <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Leave Period</h1>

                <button
                    onClick={() => navigate('/hrms/leave-period/new')}
                    className="flex items-center justify-center gap-2 text-white font-medium hover:bg-purple-700 transition-colors bg-[#7D1EDB]"
                    style={{
                        width: 'auto',
                        minWidth: '180px',
                        height: '48px',
                        padding: '10px 24px',
                        borderRadius: '26px'
                    }}
                >
                    <span className='text-[16px] font-medium text-white font-popins cursor-pointer'>Add Leave Period</span>
                    <Plus size={20} />
                </button>
            </div>

            {/* Table */}
            <div className="h-fit min-h-0 overflow-y-auto border border-[#CECECE] rounded-lg">
                <table className="w-full relative border-collapse">
                    <thead className="sticky top-0 z-10 bg-white">
                        <tr className="text-left text-[14px] font-popins border-b border-[#CECECE]">
                            <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80" style={{ width: "25%" }}>
                                Sr No.
                            </th>
                            <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80" style={{ width: "25%" }}>
                                Name
                            </th>
                            <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80" style={{ width: "25%" }}>
                                From Date
                            </th>
                            <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80" style={{ width: "25%" }}>
                                To Date
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {leavePeriods.map((period, index) => (
                            <tr key={period.id} className="hover:bg-gray-50 transition-colors text-[14px] font-medium text-[#1E1E1E]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                                <td className="py-3 px-6 flex items-center gap-3">
                                    <input type="checkbox" className="w-4 h-4 rounded border-[#1F1F1F] text-[#7D1EDB] focus:ring-[#7D1EDB]" />
                                </td>
                                <td className="py-3 px-6">
                                    {period.name}
                                </td>
                                <td className="py-3 px-6">
                                    {period.fromDate}
                                </td>
                                <td className="py-3 px-6">
                                    {period.toDate}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeavePeriod;
