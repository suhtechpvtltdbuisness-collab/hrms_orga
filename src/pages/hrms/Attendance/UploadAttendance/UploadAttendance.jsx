import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Upload } from 'lucide-react';
import CustomDatePicker from '../../../../components/ui/CustomDatePicker';

const UploadAttendance = () => {
    const navigate = useNavigate();
    const [fromDate, setFromDate] = useState('26/01/2026');
    const [toDate, setToDate] = useState('29/01/2026');

    return (
        <div className="bg-white px-4 sm:px-4 md:px-6 py-4 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-9rem)] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-10rem)] xl:h-[calc(100vh-11rem)] flex flex-col font-sans border border-[#D9D9D9]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
            
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
                 <span className="text-[#6B7280]">Upload Attendance</span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-6 shrink-0">
                <h1 className="text-[20px] font-semibold text-[#1E1E1E]" style={{ fontFamily: 'Poppins, sans-serif' }}>Upload Attendance</h1>
                <button 
                    className="bg-[#7D1EDB] text-white px-4 py-2 rounded-full font-medium hover:bg-purple-700 transition-colors"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                    Save
                </button>
            </div>

            {/* Content Container */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                
                {/* Download Template Section */}
                <div className="border border-[#D6D6D6] rounded-lg p-4 mb-3">
                    <h3 className="text-[16px] font-semibold text-[#1E1E1E] mb-2" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Download Template</h3>
                    
                    <div className="flex flex-col md:flex-row gap-4 mb-3">
                        <div className="flex flex-col gap-2 w-full md:w-1/3">
                            <label className="text-[14px] font-normal text-[#1E1E1E]" style={{ fontFamily: 'Inter, sans-serif' }}>Attendance From Date</label>
                            <CustomDatePicker
                                value={fromDate}
                                onChange={setFromDate}
                                className="w-full bg-[#FFFFFF] border border-[#D9D9D9] rounded-[8px] px-4 py-2 text-[#1E1E1E] outline-none"
                            />
                        </div>

                         <div className="flex flex-col gap-2 w-full md:w-1/3">
                            <label className="text-[14px] font-normal text-[#1E1E1E]" style={{ fontFamily: 'Inter, sans-serif' }}>Attendance To Date</label>
                            <CustomDatePicker
                                value={toDate}
                                onChange={setToDate}
                                className="w-full bg-[#FFFFFF] border border-[#D9D9D9] rounded-[8px] px-4 py-2 text-[#1E1E1E] outline-none"
                            />
                        </div>
                    </div>

                    <button className="px-2 py-2 border border-[#DCDCDC] rounded-[8px] text-sm text-[#374151] hover:bg-gray-50" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                        Get Template
                    </button>
                </div>

                {/* Import Attendance Section */}
                <div className="border border-[#D6D6D6] rounded-lg p-4">
                    <h3 className="text-[16px] font-semibold text-[#1E1E1E] mb-2" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Import Attendance</h3>
                    
                    <div className="border border-dashed bg-[#F7F7F7] border-[#C5C5C5] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors min-h-[160px]">
                        <img 
                            src="/images/uploadDoc.svg" 
                            alt="Upload Document" 
                            className="w-12 h-10 mb-4"
                        />
                        <h4 className="text-[16px] font-semibold text-[#1E1E1E] " style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Upload Document</h4>
                        <p className="text-[12px] text-[#7D1EDB]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Drag & Drop Or Click To Browse</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default UploadAttendance;
