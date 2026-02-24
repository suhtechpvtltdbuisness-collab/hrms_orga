import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Briefcase, Mail, Phone, FileText, ChevronDown, Square, ThumbsDown, ThumbsUp, ArrowRight, Copy } from 'lucide-react';

const NewHiring = () => {
    const navigate = useNavigate();

    const candidates = [
        { id: 1, srNo: '01', name: 'Olivia Rhye', experience: '5 Years', skills: 'Figma', source: 'LinkedIn', status: 'Shortlisted' },
        { id: 2, srNo: '02', name: 'Olivia Rhye', experience: '5 Years', skills: 'Figma', source: 'LinkedIn', status: 'Shortlisted' },
        { id: 3, srNo: '03', name: 'Olivia Rhye', experience: '5 Years', skills: 'Figma', source: 'LinkedIn', status: 'Shortlisted' },
        { id: 4, srNo: '04', name: 'Olivia Rhye', experience: '5 Years', skills: 'Figma', source: 'LinkedIn', status: 'Shortlisted' },
        { id: 5, srNo: '05', name: 'Olivia Rhye', experience: '5 Years', skills: 'Figma', source: 'LinkedIn', status: 'Shortlisted' },
    ];

    return (
        <div className="bg-white px-4 sm:px-6 md:px-8 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-9rem)] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-10rem)] xl:h-[calc(100vh-11rem)] overflow-y-auto" style={{ fontFamily: 'Poppins, sans-serif' }}>
            
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-[#7D1EDB] mb-3">
                <div className="flex items-center gap-3" onClick={() => navigate('/hrms')}>
                    <ArrowLeft size={14} className="text-gray-900 cursor-pointer" />
                    <span className="cursor-pointer hover:text-purple-500"> Dashboard</span>
                </div>
                <ChevronRight size={16} className="mx-1" />
                <span className="text-[#667085] text-[14px] font-base">New Hiring</span>
            </div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
                <h1 className="text-xl font-semibold text-gray-900">New Hiring</h1>
                <div className="flex gap-4 w-full sm:w-auto">
                    <button className="px-6 py-2.5 border border-[#7D1EDB] text-[#7D1EDB] font-medium rounded-full hover:bg-purple-50 transition-colors bg-white w-full sm:w-auto">
                        Import Form Email
                    </button>
                    <button className="px-6 py-2.5 bg-[#7D1EDB] text-white font-medium rounded-full hover:bg-purple-700 transition-colors shadow-sm w-full sm:w-auto">
                        Add Resume
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                
                {/* Left Content Area */}
                <div className="flex-1 space-y-6">
                    
                    {/* Active Job Openings Banner */}
                    <div className="border border-dashed border-gray-300 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between bg-gray-50/50">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    {/* Briefcase */}
                                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" stroke="#6B7280" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="#6B7280" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M2 12h20" stroke="#6B7280" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                    {/* Circle-slash overlay (ban) */}
                                    <circle cx="18" cy="18" r="5.5" fill="white" stroke="#6B7280" strokeWidth="1.5"/>
                                    <line x1="14.5" y1="21.5" x2="21.5" y2="14.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-gray-900 font-medium">No Active Job Openings</h3>
                                <p className="text-gray-400 text-sm">Create Job Opening To Start Linking Candidates To Specific Roles</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => navigate('/hrms/job-opening/new')}
                            className="mt-4 sm:mt-0 text-[#2176FF] font-medium hover:underline flex items-center gap-1"
                        >
                            + Create job opening
                        </button>
                    </div>

                    {/* Resume List Section */}
                    <div>
                        <h3 className="text-gray-900 font-medium mb-4">Resume List</h3>
                        
                        {/* Filters */}
                        <div className="flex flex-wrap gap-3 mb-6">
                            <div className="relative flex-1 min-w-[200px]">
                                <input 
                                    type="text" 
                                    placeholder="Search by name..." 
                                    className="w-full pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-purple-300"
                                />
                            </div>
                            {['Status', 'Experience', 'Skills', 'Source'].map((label) => (
                                <div key={label} className="relative">
                                    <select
                                        style={{
                                            width: '120px',
                                            height: '48px',
                                            borderRadius: '12px',
                                            padding: '10px',
                                            paddingRight: '32px',
                                            gap: '6px',
                                            background: '#EEECFF',
                                            border: 'none',
                                            color: '#7D1EDB',
                                            fontFamily: 'Poppins, sans-serif',
                                            fontWeight: 400,
                                            fontSize: '14px',
                                            lineHeight: '140%',
                                            appearance: 'none',
                                            WebkitAppearance: 'none',
                                            outline: 'none',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <option>{label}</option>
                                    </select>
                                    <ChevronDown
                                        size={14}
                                        style={{ color: '#7D1EDB' }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto border border-gray-200 rounded-xl">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead>
                                    <tr className="text-gray-500 border-b border-gray-200">
                                        <th className="px-4 py-4 font-medium w-12"><Square size={15} style={{ color: '#7D1EDB' }} /></th>
                                        <th className="px-4 py-4 font-medium">SR NO</th>
                                        <th className="px-4 py-4 font-medium">CANDIDATE NAME</th>
                                        <th className="px-4 py-4 font-medium">EXPERIENCE</th>
                                        <th className="px-4 py-4 font-medium">SKILLS</th>
                                        <th className="px-4 py-4 font-medium">SOURCE</th>
                                        <th className="px-4 py-4 font-medium">STATUS</th>
                                        <th className="px-4 py-4 font-medium">ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {candidates.map((candidate) => (
                                        <tr key={candidate.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                            <td className="px-4 py-4"><Square size={15} style={{ color: '#7D1EDB' }} /></td>
                                            <td className="px-4 py-4 text-gray-700">{candidate.srNo}</td>
                                            <td className="px-4 py-4" style={{ color: '#7268FF', fontWeight: 500, fontSize: '16px', lineHeight: '140%', fontFamily: 'Poppins, sans-serif' }}>{candidate.name}</td>
                                            <td className="px-4 py-4 text-gray-700">{candidate.experience}</td>
                                            <td className="px-4 py-4 text-gray-700">{candidate.skills}</td>
                                            <td className="px-4 py-4 text-gray-700">{candidate.source}</td>
                                            <td className="px-4 py-4">
                                                <span 
                                                    className="inline-flex items-center justify-center rounded-full font-medium"
                                                    style={{ 
                                                        backgroundColor: 'rgba(118, 219, 30, 0.2)', // #76DB1E 20%
                                                        color: 'var(--Accents-Green, #34C759)', 
                                                        padding: '4px 12px',
                                                        fontSize: '14px',
                                                        lineHeight: '20px'
                                                    }}
                                                >
                                                    {candidate.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="relative inline-block" style={{ width: '20px', height: '20px' }}>
                                                    <Copy 
                                                        className="absolute cursor-pointer hover:text-gray-900 transition-colors"
                                                        style={{ 
                                                            width: '15.83px', 
                                                            height: '18.33px', 
                                                            top: '0.84px', 
                                                            left: '1.66px',
                                                            color: '#1F1F1F'
                                                        }} 
                                                        strokeWidth={1.5}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Candidate Details */}
                <div className="lg:w-[320px] xl:w-[380px] border border-gray-200 rounded-xl p-6 bg-white shrink-0">
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">Sarah Johnson</h2>
                    <p className="text-sm text-gray-600 mb-6">Senior Frontend Engineer</p>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-gray-500 mb-1">
                                <Briefcase size={14} />
                                <span className="text-xs font-medium uppercase">Experience</span>
                            </div>
                            <p className="font-medium text-gray-900 text-sm">5+ Years</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-gray-500 mb-1">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                <span className="text-xs font-medium uppercase">Location</span>
                            </div>
                            <p className="font-medium text-gray-900 text-sm">San Fransisco, CA</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Contact Information</h4>
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Mail size={16} className="text-gray-400" />
                                <span>sarahj450@gmail.com</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Phone size={16} className="text-gray-400" />
                                <span>+91 9178245632</span>
                            </div>
                        </div>
                    </div>

                    <button className="w-full py-2.5 border border-[#7D1EDB] text-[#7D1EDB] font-medium rounded-full mb-6 hover:bg-purple-50 transition-colors flex items-center justify-center gap-2">
                        <FileText size={16} />
                        Preview Resume
                        <ChevronDown size={16} />
                    </button>

                    <div className="flex gap-3 mb-4">
                        <button className="flex-1 py-2.5 bg-[#FF3B30] text-white font-medium rounded-full hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
                            Reject
                            <ThumbsDown size={16} />
                        </button>
                        <button className="flex-1 py-2.5 bg-[#7D1EDB] text-white font-medium rounded-full hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                            Shortlisted
                            <ThumbsUp size={16} />
                        </button>
                    </div>

                    <button 
                        className="w-full py-2.5 border border-[#7D1EDB] text-[#7D1EDB] font-medium rounded-full hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
                        onClick={() => navigate('/hrms/ats-screening')}
                    >
                        Move to ATS screening
                        <ArrowRight size={16} />
                    </button>
                </div>

            </div>

        </div>
    );
};

export default NewHiring;
