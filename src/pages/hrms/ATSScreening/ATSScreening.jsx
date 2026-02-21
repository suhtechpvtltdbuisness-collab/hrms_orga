import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, BarChart2, FileText, MessageSquare, CheckCircle2, ThumbsDown, Clock } from 'lucide-react';

const Pill = ({ text, isActive }) => (
    <span 
        className="inline-flex items-center justify-center whitespace-nowrap"
        style={{
            fontFamily: '"Nunito Sans", sans-serif',
            fontWeight: 400,
            fontSize: '12px',
            lineHeight: '100%',
            textTransform: 'capitalize',
            color: '#000000',
            backgroundColor: isActive ? '#E1FCB7' : '#E5E7EB',
            borderRadius: '10px',
            padding: '5px 10px',
        }}
    >
        {text}
    </span>
);



const ATSScreening = () => {
    const navigate = useNavigate();

    const renderProgressBar = (label, percentage) => (
        <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-900" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>{label}</span>
                <span className="text-sm font-medium text-gray-900" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>{percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-[#2176FF] h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );

    return (
        <div className="bg-white px-4 sm:px-6 md:px-8 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-9rem)] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-10rem)] xl:h-[calc(100vh-11rem)] overflow-y-auto border border-[#D9D9D9]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            
            {/* Breadcrumb matching NewHiring style and Image 2 hierarchy */}
            <div className="flex items-center text-sm text-[#7D1EDB] mb-4">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/hrms/new-hiring')}>
                    <ArrowLeft size={14} className="text-gray-900" />
                    <span className="hover:text-purple-500 font-medium">New Hiring</span>
                </div>
                <ChevronRight size={16} className="mx-1 mt-0.5 text-gray-400" />
                <span className="text-[#667085] text-sm font-base">ATS Screening</span>
            </div>

            {/* Header matching NewHiring text style */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
                <h1 className="text-xl font-semibold text-gray-900">ATS Screening</h1>
            </div>

            {/* Inner Content Layout with #F2F2F7 background */}
            <div className="bg-[#F2F2F7] rounded-[24px] p-6 flex flex-col lg:flex-row gap-6">
                    
                    {/* Left Column: Resume Score */}
                    <div className="w-full lg:w-[350px] shrink-0">
                        <div className="border border-[#D9D9D9] rounded-[16px] p-6 bg-white flex flex-col">
                            <div className="flex items-center gap-3 mb-6">
                                <BarChart2 className="text-[#7D1EDB]" size={20} />
                                <h2 className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Resume Score</h2>
                            </div>

                            <div>
                                {renderProgressBar('Skill Match', 85)}
                                {renderProgressBar('Experience Fit', 78)}
                                {renderProgressBar('Education Fit', 92)}
                                {renderProgressBar('Role Match', 88)}
                            </div>

                        <div className="border-t border-[#D9D9D9] pt-6 mt-6">
                            <h3 className="text-sm text-gray-700 font-medium mb-3">ATS Verdict</h3>
                            <textarea 
                                readOnly
                                value="Strong fit"
                                className="w-full h-24 p-3 border border-[#D9D9D9] rounded-lg text-gray-800 text-sm resize-none bg-white focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column: Resume Preview & HR Notes */}
                <div className="flex-1 flex flex-col gap-6">
                    
                    {/* Resume Preview */}
                    <div className="border border-[#D9D9D9] rounded-[16px] p-6 bg-white">
                        <div className="flex items-center gap-3 mb-6">
                            <FileText className="text-gray-500" size={20} />
                            <h2 className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Resume Preview</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-[15px] font-semibold text-gray-900 mb-1">Sarah Johnson</h3>
                                <p className="text-[13px] text-gray-700">Sarahj450@Gmail.Com</p>
                            </div>

                            <div>
                                <h4 className="text-[13px] font-semibold text-gray-900 mb-2">Professional Summary:</h4>
                                <p className="text-[12px] text-gray-700 leading-relaxed" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                                    Experienced Professional With Strong Background In The Industry. Proven Track Record Of Delivering
                                    Results And Leading Successful Projects
                                </p>
                            </div>

                            <div>
                                <h4 className="text-[13px] font-semibold text-gray-900 mb-3">Key Skills:</h4>
                                <div className="flex flex-wrap gap-[10px]">
                                    <Pill text="Project Management" isActive={true} />
                                    <Pill text="Leadership" isActive={false} />
                                    <Pill text="Communication" isActive={true} />
                                    <Pill text="Analytics" isActive={false} />
                                    <Pill text="Strategy" isActive={true} />
                                </div>
                            </div>

                            <div>
                                <h4 className="text-[13px] font-semibold text-gray-900 mb-1">Experience:</h4>
                                <div className="text-[12px] text-gray-800 space-y-1 mt-2" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                                    <p>Senior Manager</p>
                                    <p>SUH Tech - 2020</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* HR Notes & Actions */}
                    <div className="border border-[#D9D9D9] rounded-[16px] p-6 bg-white">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="relative" style={{ width: '20px', height: '20px' }}>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ top: '2px', left: '2px', position: 'absolute' }}>
                                    <path d="M2.5 2.5H17.5V13.3333H6.66667L2.5 17.5V2.5Z" stroke="#808080" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M6.66663 6.66667H13.3333" stroke="#808080" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M6.66663 10H10" stroke="#808080" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <h2 className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>HR Notes</h2>
                        </div>
                        
                        <textarea 
                            placeholder="Add comments or observations here...."
                            className="w-full h-[80px] p-4 bg-[#FFFFFF] rounded-xl border border-gray-100 text-sm text-gray-700 resize-none focus:outline-none mb-6"
                        />

                        <div className="flex flex-wrap items-center gap-4">
                            <button 
                                onClick={() => navigate('/hrms/schedule-interview')}
                                className="flex-1 min-w-[180px] h-[44px] bg-[#7D1EDB] text-white font-medium rounded-full hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 text-[15px]"
                            >
                                Select for interview
                                <CheckCircle2 size={18} />
                            </button>
                            <button className="flex-1 min-w-[140px] h-[44px] bg-[#FF3B30] text-white font-medium rounded-full hover:bg-red-600 transition-colors flex items-center justify-center gap-2 text-[15px]">
                                Reject
                                <ThumbsDown size={18} />
                            </button>
                            <button className="flex-1 min-w-[180px] h-[44px] border border-[#7D1EDB] text-[#7D1EDB] font-medium rounded-full hover:bg-purple-50 transition-colors flex items-center justify-center gap-2 text-[15px]">
                                Keep under review
                                <Clock size={18} />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ATSScreening;
