import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import CustomDatePicker from '../../../../components/ui/CustomDatePicker';
import FilterDropdown from '../../../../components/ui/FilterDropdown';

const RequestAttendance = () => {
    const navigate = useNavigate();
    
    // State
    const [employeeId, setEmployeeId] = useState('HR-EMP-0123');
    const [fromDate, setFromDate] = useState('26/01/2026');
    const [toDate, setToDate] = useState('29/01/2026');
    const [isHalfDay, setIsHalfDay] = useState(false);
    const [halfDayDate, setHalfDayDate] = useState('29/01/2026');
    const [reason, setReason] = useState('Work From Home');
    const [explanation, setExplanation] = useState('');

    const EMPLOYEE_OPTIONS = ["HR-EMP-0123", "HR-EMP-0124", "HR-EMP-0125"];

    return (
        <div className="bg-white px-4 sm:px-4 md:px-6 py-4 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-9rem)] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-10rem)] xl:h-[calc(100vh-11rem)] flex flex-col font-sans border border-[#D9D9D9]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
            
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-4 text-sm text-gray-500 shrink-0">
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
                 <span className="text-[#6B7280]">Attendance Request</span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-3 shrink-0">
                <h1 className="text-[20px] font-semibold text-[#1E1E1E]" style={{ fontFamily: 'Poppins, sans-serif' }}>Attendance Request</h1>
                <button 
                    className="bg-[#7D1EDB] text-white px-4 py-2 rounded-full font-medium hover:bg-purple-700 transition-colors"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                    Save
                </button>
            </div>

            {/* Content Container */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                
                {/* Employee Details Section */}
                <div className="border border-[#D6D6D6] rounded-lg p-4 mb-3">
                    {/* Row 1: Employee, Name, Dept */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div className="flex flex-col gap-2">
                            <label className="text-[14px] font-normal text-[#1E1E1E]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Employee</label>
                            <FilterDropdown
                                options={EMPLOYEE_OPTIONS}
                                value={employeeId}
                                onChange={setEmployeeId}
                                className="w-full bg-white border border-[#E5E7EB] rounded-[8px] px-4 py-2 flex items-center justify-between outline-none"
                                dropdownWidth="150px"
                                align="left"
                                buttonTextClassName="text-[#1E1E1E]"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[14px] font-normal text-[#1E1E1E]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Employee Name</label>
                            <div className="w-full bg-[#F5F5F5] border border-[#E5E7EB] rounded-[8px] px-4 py-2 text-[#6B7280]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                Alice John
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[14px] font-normal text-[#1E1E1E]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Department</label>
                            <div className="w-full bg-[#F5F5F5] border border-[#E5E7EB] rounded-[8px] px-4 py-2 text-[#6B7280]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                Sales
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div className="flex flex-col gap-2">
                            <label className="text-[14px] font-normal text-[#1E1E1E]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>From Date</label>
                            <CustomDatePicker
                                value={fromDate}
                                onChange={setFromDate}
                                className="w-full bg-white border border-[#E5E7EB] rounded-[8px] px-4 py-2 text-[#1E1E1E] outline-none"
                            />
                        </div>
                         <div className="flex flex-col gap-2">
                            <label className="text-[14px] font-normal text-[#1E1E1E]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>To Date</label>
                            <CustomDatePicker
                                value={toDate}
                                onChange={setToDate}
                                className="w-full bg-white border border-[#E5E7EB] rounded-[8px] px-4 py-2 text-[#1E1E1E] outline-none"
                            />
                        </div>
                    </div>

                    {/* Row 3: Half Day */}
                    <div className="mb-3">
                        <label className="flex items-center gap-2 cursor-pointer mb-2 w-fit">
                            <input 
                                type="checkbox" 
                                checked={isHalfDay} 
                                onChange={(e) => setIsHalfDay(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-[#7D1EDB] focus:ring-[#7D1EDB]"
                            />
                            <span className="text-[14px] text-[#1E1E1E]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Half Day</span>
                        </label>
                         <div className="flex flex-col gap-2 w-full md:w-1/3">
                            <label className="text-[14px] font-normal text-[#1E1E1E]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Half Day Date</label>
                            <CustomDatePicker
                                value={halfDayDate}
                                onChange={setHalfDayDate}
                                className="w-full bg-white border border-[#E5E7EB] rounded-[8px] px-4 py-2 text-[#1E1E1E] outline-none"
                                disabled={!isHalfDay}
                            />
                        </div>
                    </div>
                </div>

                {/* Reason Section */}
                <div className="border border-[#D6D6D6] rounded-lg p-4">
                    <h3 className="text-[16px] font-semibold text-[#1E1E1E] mb-2" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Reason</h3>
                    
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-2 w-full md:w-1/3">
                            <label className="text-[14px] font-normal text-[#1E1E1E]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Reason</label>
                            <input
                                type="text"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="w-full bg-white border border-[#E5E7EB] rounded-[8px] px-4 py-2 text-[#1E1E1E] outline-none"
                                style={{ fontFamily: 'Inter, sans-serif' }}
                            />
                        </div>

                         <div className="flex flex-col gap-2">
                            <label className="text-[14px] font-normal text-[#1E1E1E]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Explanation</label>
                            <textarea
                                value={explanation}
                                onChange={(e) => setExplanation(e.target.value)}
                                placeholder="Enter explanation"
                                className="w-full bg-white border border-[#E5E7EB] rounded-[8px] px-4 py-2 text-[#1E1E1E] outline-none resize-none h-24"
                                style={{ fontFamily: 'Inter, sans-serif' }}
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default RequestAttendance;
