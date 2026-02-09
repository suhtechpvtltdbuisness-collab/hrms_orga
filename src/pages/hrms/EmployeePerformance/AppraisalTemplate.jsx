import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Plus } from 'lucide-react';

const AppraisalTemplate = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-white px-4 sm:px-4 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col font-inter" style={{ fontFamily: 'Inter, sans-serif' }}>
            
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
                <span className="text-[#6B7280]">Appraisal Template</span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-6 shrink-0">
                <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Appraisal Template</h1>

                <button
                    className="flex items-center justify-center gap-2 rounded-full py-3 px-4 text-white font-medium hover:bg-purple-700 transition-colors bg-[#7D1EDB]"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                    onClick={() => navigate('/hrms/appraisal-template/new')}
                >
                    <span className='text-[16px] font-normal text-white'>Add Appraisal Template</span>
                    <Plus size={18} />
                </button>
            </div>

            {/* Content (Empty State) */}
            <div className="flex-1 flex flex-col items-center justify-center overflow-y-auto min-h-0 w-full">
                <div className="flex flex-col items-center justify-center text-center py-4">
                    <img 
                        src="/images/emptyAttendance.png" 
                        alt="No Appraisal Templates" 
                        className="mb-6 w-[280px] md:w-[320px]" 
                    />
                    <h3 className="text-[16px] font-semibold text-[#757575] mb-4" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>You haven't created appraisal template yet</h3>
                    
                    <button
                        className="flex items-center justify-center px-4 py-3 bg-[#7D1EDB] text-white rounded-full font-medium hover:bg-purple-700 transition-all shadow-sm"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                        onClick={() => navigate('/hrms/appraisal-template/new')}
                    >
                        Create appraisal template
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AppraisalTemplate;
