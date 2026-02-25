import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Calendar, Clock, ChevronDown } from 'lucide-react';

const ScheduledInterviewDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    /* ── shared card style ── */
    const cardStyle = {
        border: '1px solid #E4E4E4',
        borderRadius: '4px',
        backgroundColor: '#FFFFFF',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxSizing: 'border-box'
    };

    /* ── shared label style ── */
    const labelStyle = {
        display: 'block',
        fontSize: '13px',
        color: '#374151',
        marginBottom: '6px',
        fontFamily: '"Nunito Sans", sans-serif',
    };

    /* ── shared input style ── */
    const inputStyle = {
        width: '100%',
        height: '40px',
        padding: '0 14px',
        border: '1px solid #E5E7EB',
        borderRadius: '6px',
        fontSize: '13px',
        color: '#111827',
        outline: 'none',
        boxSizing: 'border-box',
        fontFamily: '"Nunito Sans", sans-serif',
        backgroundColor: '#F3F4F6', // Read-only look
    };

    return (
        <div 
            className="bg-[#F2F2F7] min-h-[calc(100vh-5rem)] overflow-y-auto"
            style={{ fontFamily: 'Poppins, sans-serif' }}
        >
            <div 
                className="bg-white px-4 sm:px-6 md:px-8 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl min-h-[calc(100vh-10rem)] shadow-sm border border-gray-100"
            >
                {/* Breadcrumb + Title */}
                <div className="mb-6">
                    <div className="flex items-center gap-1 text-sm text-[#7D1EDB] mb-4">
                        <div 
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => navigate('/hrms/schedule-interview-list')}
                        >
                            <ArrowLeft size={14} className="text-gray-900" />
                            <span className="hover:text-purple-500 font-medium">Schedule Interview List</span>
                        </div>
                        <ChevronRight size={16} className="text-[#9CA3AF]" />
                        <span className="text-[#667085]">Scheduled Interview</span>
                    </div>

                    <h1 className="text-xl font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                        Scheduled Interview
                    </h1>
                </div>

                {/* ── Candidate Information ── */}
                <div style={cardStyle} className="mb-4">
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0 }}>Candidate Information</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                        <div>
                            <span style={labelStyle}>Name</span>
                            <input type="text" value="Sarah Johnson" readOnly style={inputStyle} />
                        </div>
                        <div>
                            <span style={labelStyle}>Email</span>
                            <input type="email" value="sarahj450@gmail.com" readOnly style={inputStyle} />
                        </div>
                        <div>
                            <span style={labelStyle}>Phone number</span>
                            <input type="text" value="+91 9178751742" readOnly style={inputStyle} />
                        </div>
                        <div>
                            <span style={labelStyle}>Experience</span>
                            <input type="text" value="6 Years" readOnly style={inputStyle} />
                        </div>
                    </div>
                    <button 
                        style={{ 
                            height: '38px', 
                            padding: '0 22px', 
                            border: '1.5px solid #7D1EDB', 
                            color: '#7D1EDB', 
                            fontWeight: 500, 
                            borderRadius: '999px', 
                            backgroundColor: 'transparent', 
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontFamily: 'Poppins, sans-serif',
                            width: 'fit-content',
                            marginTop: '8px',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F5EEFB'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        View Resume
                    </button>
                </div>

                {/* ── Interview Type ── */}
                <div style={cardStyle} className="mb-4">
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0 }}>Interview Type</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                         <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #7D1EDB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#7D1EDB' }}></div>
                         </div>
                         <span style={{ fontSize: '14px', color: '#111827' }}>Round 2(Managerial)</span>
                    </div>
                </div>

                {/* ── Interview Mode ── */}
                <div style={cardStyle} className="mb-4">
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0 }}>Interview Mode</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                         <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #7D1EDB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#7D1EDB' }}></div>
                         </div>
                         <span style={{ fontSize: '14px', color: '#111827' }}>Online</span>
                    </div>
                </div>

                {/* ── Interview Timing & Panel ── */}
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div style={{ ...cardStyle, flex: 1 }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0 }}>Interview Timing</h3>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ position: 'relative', flex: 1 }}>
                                <input type="text" value="10/01/2026" readOnly style={inputStyle} />
                                <Calendar style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} size={15} />
                            </div>
                            <div style={{ position: 'relative', flex: 1 }}>
                                <input type="text" value="10:30 AM" readOnly style={inputStyle} />
                                <ChevronDown style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} size={15} />
                            </div>
                        </div>
                    </div>
                    <div style={{ ...cardStyle, flex: 1 }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0 }}>Interview Pannel</h3>
                        <div style={{ position: 'relative' }}>
                            <input type="text" value="HR" readOnly style={inputStyle} />
                        </div>
                    </div>
                </div>

                {/* ── Email Preview ── */}
                <div style={cardStyle}>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0 }}>Email Preview To Candidate</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#374151', fontFamily: '"Nunito Sans", sans-serif' }}>
                        <p style={{ margin: 0 }}>Date: <strong>10/01/2026</strong></p>
                        <p style={{ margin: 0 }}>Time: <strong>10:00 AM</strong></p>
                        <p style={{ margin: 0 }}>Interview Pannel: <strong>HR</strong></p>
                        <p style={{ margin: 0 }}>Mode: <strong>Online</strong></p>
                        <p style={{ margin: 0 }}>Zoom meet link: <a href="#" style={{ color: '#7D1EDB', textDecoration: 'none' }}>https://hiuhe.h</a></p>
                        <p style={{ margin: 0 }}>Instructions: <strong>Please be on time</strong></p>
                    </div>
                </div>

                {/* ── Action Buttons ── */}
                <div className="flex gap-8 mt-8">
                    <button 
                        className="h-12 px-8 bg-[#7D1EDB] text-white font-semibold rounded-full hover:bg-purple-700 transition-colors"
                        style={{ fontSize: '15px', fontFamily: 'Poppins, sans-serif' }}
                    >
                        Share Feedback
                    </button>
                    <button 
                        className="h-12 px-8 bg-transparent text-[#7D1EDB] font-semibold rounded-full border-1.5 border-[#7D1EDB] hover:bg-purple-50 transition-colors"
                        style={{ fontSize: '15px', fontFamily: 'Poppins, sans-serif' }}
                        onClick={() => navigate('/hrms/schedule-interview-list')}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScheduledInterviewDetails;
