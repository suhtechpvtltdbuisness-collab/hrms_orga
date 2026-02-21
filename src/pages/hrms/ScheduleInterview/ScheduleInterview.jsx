import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Calendar, Clock, ChevronDown } from 'lucide-react';

const ScheduleInterview = () => {
    const navigate = useNavigate();

    const [interviewType, setInterviewType] = useState('HR Round');
    const [interviewMode, setInterviewMode] = useState('Online');

    return (
        <div className="bg-white px-4 sm:px-6 md:px-8 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-9rem)] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-10rem)] xl:h-[calc(100vh-11rem)] overflow-y-auto border border-[#D9D9D9]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            
            {/* Breadcrumb matching Image 3 hierarchy */}
            <div className="flex items-center text-sm text-[#7D1EDB] mb-4">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/hrms/ats-screening')}>
                    <ArrowLeft size={14} className="text-gray-900" />
                    <span className="hover:text-purple-500 font-medium">ATS Screening</span>
                </div>
                <ChevronRight size={16} className="mx-1 mt-0.5 text-gray-400" />
                <span className="text-[#667085] text-sm font-base">Schedule Interview</span>
            </div>

            {/* Header matching NewHiring style */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
                <h1 className="text-xl font-semibold text-gray-900">Schedule Interview</h1>
            </div>

            {/* Content Boxes */}
            <div className="space-y-4">
                {/* Candidate Information */}
                <div className="border border-[#e5e7eb] rounded-[16px] p-6">
                    <h3 className="text-[15px] font-semibold text-gray-900 mb-6">Candidate Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div>
                            <label className="block text-[13px] text-gray-700 mb-2">Name</label>
                            <input type="text" placeholder="Enter name" className="w-full h-[44px] px-4 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500" />
                        </div>
                        <div>
                            <label className="block text-[13px] text-gray-700 mb-2">Email</label>
                            <input type="email" placeholder="Enter mail ID" className="w-full h-[44px] px-4 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500" />
                        </div>
                        <div>
                            <label className="block text-[13px] text-gray-700 mb-2">Phone number</label>
                            <input type="text" placeholder="Enter phone number" className="w-full h-[44px] px-4 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500" />
                        </div>
                        <div>
                            <label className="block text-[13px] text-gray-700 mb-2">Experience</label>
                            <input type="text" placeholder="Enter experience" className="w-full h-[44px] px-4 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500" />
                        </div>
                    </div>

                    <button className="min-w-[140px] h-[40px] bg-[#7D1EDB] text-white font-medium rounded-full hover:bg-purple-700 transition-colors px-6 text-[14px]">
                        View Resume
                    </button>
                </div>

                {/* Interview Type */}
                <div className="border border-[#e5e7eb] rounded-[16px] p-6 w-full md:w-1/2">
                    <h3 className="text-[14px] font-semibold text-gray-900 mb-4">Interview Type</h3>
                    <div className="flex flex-wrap items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="radio" 
                                name="interviewType" 
                                checked={interviewType === 'Round 1(Technical)'} 
                                onChange={() => setInterviewType('Round 1(Technical)')}
                                className="w-4 h-4 text-[#7D1EDB] accent-[#7D1EDB]" 
                            />
                            <span className="text-[14px] text-gray-700">Round 1(Technical)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="radio" 
                                name="interviewType" 
                                checked={interviewType === 'Round 2(Managerial)'} 
                                onChange={() => setInterviewType('Round 2(Managerial)')}
                                className="w-4 h-4 text-[#7D1EDB] accent-[#7D1EDB]" 
                            />
                            <span className="text-[14px] text-gray-700">Round 2(Managerial)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="radio" 
                                name="interviewType" 
                                checked={interviewType === 'HR Round'} 
                                onChange={() => setInterviewType('HR Round')}
                                className="w-4 h-4 text-[#7D1EDB] accent-[#7D1EDB]" 
                            />
                            <span className="text-[14px] text-gray-700">HR Round</span>
                        </label>
                    </div>
                </div>

                {/* Interview Mode */}
                <div className="border border-[#e5e7eb] rounded-[16px] p-6 w-full md:w-1/2">
                    <h3 className="text-[14px] font-semibold text-gray-900 mb-4">Interview Mode</h3>
                    <div className="flex flex-wrap items-center gap-8">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="radio" 
                                name="interviewMode" 
                                checked={interviewMode === 'Online'} 
                                onChange={() => setInterviewMode('Online')}
                                className="w-4 h-4 text-[#7D1EDB] accent-[#7D1EDB]" 
                            />
                            <span className="text-[14px] text-gray-700">Online</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="radio" 
                                name="interviewMode" 
                                checked={interviewMode === 'Offline'} 
                                onChange={() => setInterviewMode('Offline')}
                                className="w-4 h-4 text-[#7D1EDB] accent-[#7D1EDB]" 
                            />
                            <span className="text-[14px] text-gray-700">Offline</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="radio" 
                                name="interviewMode" 
                                checked={interviewMode === 'Hybrid'} 
                                onChange={() => setInterviewMode('Hybrid')}
                                className="w-4 h-4 text-[#7D1EDB] accent-[#7D1EDB]" 
                            />
                            <span className="text-[14px] text-gray-700">Hybrid</span>
                        </label>
                    </div>
                </div>

                {/* Interview Timing and Panel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-[#e5e7eb] rounded-[16px] p-6">
                        <h3 className="text-[14px] font-semibold text-gray-900 mb-4">Interview Timing</h3>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <input 
                                    type="text" 
                                    placeholder="mm/dd/yyyy" 
                                    className="w-full h-[40px] pl-4 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500" 
                                />
                                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            </div>
                            <div className="relative flex-1">
                                <input 
                                    type="text" 
                                    placeholder="Select Time" 
                                    className="w-full h-[40px] pl-4 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500" 
                                />
                                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            </div>
                        </div>
                    </div>

                    <div className="border border-[#e5e7eb] rounded-[16px] p-6">
                        <h3 className="text-[14px] font-semibold text-gray-900 mb-4">Interview Pannel</h3>
                        <div className="relative w-full max-w-[280px]">
                            <select className="w-full h-[40px] pl-4 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 appearance-none bg-transparent">
                                <option value="">Select interview pannel</option>
                                <option value="hr">HR Pannel</option>
                                <option value="tech">Tech Pannel</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        </div>
                    </div>
                </div>

                {/* Email Preview */}
                <div className="border border-[#e5e7eb] rounded-[16px] p-6 bg-[#FAFAFA]">
                    <h3 className="text-[14px] font-semibold text-gray-900 mb-4">Email Preview To Candidate</h3>
                    
                    <div className="space-y-3 text-[13px] text-gray-700" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                        <p><span className="text-gray-500 w-[120px] inline-block">Date:</span> <strong>10/01/2026</strong></p>
                        <p><span className="text-gray-500 w-[120px] inline-block">Time:</span> <strong>10:00 AM</strong></p>
                        <p><span className="text-gray-500 w-[120px] inline-block">Interview Pannel:</span> <strong>HR</strong></p>
                        <p><span className="text-gray-500 w-[120px] inline-block">Mode:</span> <strong>Online</strong></p>
                        <p><span className="text-gray-500 w-[120px] inline-block">Zoom meet link:</span> <a href="#" className="text-[#7D1EDB] hover:underline">https://hiuhe.h..</a></p>
                        <p><span className="text-gray-500 w-[120px] inline-block">Instructions:</span> <strong>Please be on time</strong></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScheduleInterview;
