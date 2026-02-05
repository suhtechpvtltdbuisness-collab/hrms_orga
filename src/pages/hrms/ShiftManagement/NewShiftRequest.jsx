import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import CustomDatePicker from '../../../components/ui/CustomDatePicker';
import FilterDropdown from '../../../components/ui/FilterDropdown';

const NewShiftRequest = () => {
    const navigate = useNavigate();
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [shiftType, setShiftType] = useState('Day');

    return (
        <div className="bg-white px-4 sm:px-4 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col font-inter" style={{ fontFamily: 'Inter, sans-serif' }}>
            
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 shrink-0">
                <img 
                    src="/images/arrow_left_alt.svg" 
                    alt="Back" 
                    className="w-3 h-3 cursor-pointer hover:scale-110 transition-transform" 
                    onClick={() => navigate('/hrms/shift-request')}
                />
                <span 
                    className='cursor-pointer text-[#7D1EDB]'
                    onClick={() => navigate('/hrms/shift-request')}
                >
                    Shift Request
                </span> 
                <ChevronRight size={14}/> 
                <span className="text-[#494949]">New Shift Request</span>
            </div>

            {/* Header */}
            <h1 className="text-[20px] font-semibold text-[#494949] mb-4 shrink-0" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>New Shift Request</h1>

            <div className="flex-1 overflow-y-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
                <div className="border border-[#D6D6D6] rounded-lg p-4 mb-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        
                        {/* Shift Type */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[14px] font-normal text-[#1E1E1E]">Shift Type</label>
                            <FilterDropdown
                                options={["Day", "Night", "Evening"]}
                                value={shiftType}
                                onChange={setShiftType}
                                className="w-full h-11 px-4 bg-white border border-[#D6D6D6] rounded-lg text-[#1E1E1E] focus:ring-1 focus:ring-[#7D1EDB] flex items-center justify-between"
                                showArrow={true}
                                placeholder="Select Shift"
                                dropdownWidth="150px"
                                align='right'
                            />
                        </div>

                        {/* Employee ID */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[14px] font-normal text-[#1E1E1E]">Employee ID</label>
                            <input 
                                type="text"
                                defaultValue="EMP-0123"
                                className="w-full h-11 px-4 border border-[#D6D6D6] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#7D1EDB]"
                            />
                        </div>

                        {/* Employee Name */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[14px] font-normal text-[#1E1E1E]">Employee Name</label>
                            <input 
                                type="text"
                                defaultValue="Mike Miller"
                                className="w-full h-11 px-4 border border-[#D6D6D6] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#7D1EDB]"
                            />
                        </div>

                        {/* From Date */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[14px] font-normal text-[#1E1E1E]">From Date</label>
                            <CustomDatePicker 
                                value={fromDate} 
                                onChange={setFromDate} 
                                placeholder="26/01/2026"
                                className="w-full h-11 bg-white"
                            />
                        </div>

                        {/* To Date */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[14px] font-normal text-[#1E1E1E]">To Date</label>
                            <CustomDatePicker 
                                value={toDate} 
                                onChange={setToDate} 
                                placeholder="29/01/2026"
                                className="w-full h-11 bg-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Comment Section */}
                <div className="border border-[#CECECE] rounded-lg p-4">
                    <h3 className="text-[16px] font-medium text-[#1E1E1E] mb-2">Add a comment</h3>
                    <textarea 
                        placeholder="Enter comment"
                        className="w-full h-24 p-3 border border-[#D6D6D6] rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-[#7D1EDB]"
                    ></textarea>
                </div>
            </div>
        </div>
    );
};

export default NewShiftRequest;
