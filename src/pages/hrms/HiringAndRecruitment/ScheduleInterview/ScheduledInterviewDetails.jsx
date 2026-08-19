import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Calendar, ChevronDown, ExternalLink, Copy } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Spinner from '../../../../components/ui/Spinner';
import { hiringService } from '../../../../service';

const ScheduledInterviewDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [interview, setInterview] = useState(null);
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) loadData(Number(id));
    }, [id]);

    const loadData = async (interviewId) => {
        setLoading(true);
        const result = await hiringService.getInterviewById(interviewId);
        if (result.success && result.data) {
            setInterview(result.data);
            if (result.data.jobApplicationId) {
                const appResult = await hiringService.getApplicationById(result.data.jobApplicationId);
                if (appResult.success && appResult.data) {
                    setApplication(appResult.data);
                }
            }
        } else {
            toast.error(result.message || 'Failed to load interview');
        }
        setLoading(false);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return 'N/A';
        const d = new Date(dateStr);
        return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const getModeFromInstruction = (instruction, interviewMode) => {
        if (interviewMode) return interviewMode;
        if (!instruction) return 'Online';
        const parts = instruction.split(' - ');
        return parts.length > 1 ? parts[1] : 'Online';
    };

    const getTypeFromInstruction = (instruction, interviewType) => {
        if (interviewType) return interviewType;
        if (!instruction) return 'HR Round';
        const parts = instruction.split(' - ');
        return parts[0];
    };

    const copyMeetLink = async (url) => {
        if (!url) return;
        try {
            await navigator.clipboard.writeText(url);
            toast.success('Meet link copied');
        } catch {
            toast.error('Could not copy link');
        }
    };

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
        backgroundColor: '#F3F4F6',
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner size={32} color="#7D1EDB" />
            </div>
        );
    }

    if (!interview) {
        return (
            <div className="flex items-center justify-center h-screen text-gray-400">
                <p>Interview not found</p>
            </div>
        );
    }

    const interviewMode = getModeFromInstruction(interview.instruction, interview.interviewMode);
    const interviewType = getTypeFromInstruction(interview.instruction, interview.interviewType);
    const requiresMeet = interviewMode === 'Online' || interviewMode === 'Hybrid';
    const meetUrl = interview.meetingLink || '';

    return (
        <div 
            className="bg-white px-4 sm:px-4 md:px-6 py-4 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-9rem)] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-10rem)] xl:h-[calc(100vh-11rem)] flex flex-col border border-[#D9D9D9]"
            style={{ fontFamily: 'Poppins, sans-serif' }}
        >
            {/* Breadcrumb + Title */}
            <div className="mb-4 shrink-0">
                <div className="flex items-center text-sm text-[#7D1EDB] mb-2">
                    <div className="flex items-center gap-3" onClick={() => navigate('/hrms')}>
                        <ArrowLeft size={14} className="text-gray-900 cursor-pointer" />
                        <span className="cursor-pointer hover:text-purple-500">HRMS Dashboard</span>
                    </div>
                    <ChevronRight size={16} className="mx-1 text-[#9CA3AF]" />
                    <span className="text-[#667085] text-[14px] font-base">Scheduled Interview</span>
                </div>

                <h1 className="text-xl font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                    Scheduled Interview {interview.jobTitle ? `- ${interview.jobTitle}` : ''}
                </h1>
            </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-4">
                {/* ── Candidate Information ── */}
                <div style={cardStyle} className="mb-4">
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0 }}>Candidate Information</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                        <div>
                            <span style={labelStyle}>Name</span>
                            <input type="text" value={interview.candidateName || 'N/A'} readOnly style={inputStyle} />
                        </div>
                        <div>
                            <span style={labelStyle}>Email</span>
                            <input type="email" value={interview.candidateEmail || (application?.applicantEmail || 'N/A')} readOnly style={inputStyle} />
                        </div>
                        <div>
                            <span style={labelStyle}>Phone number</span>
                            <input type="text" value={application?.applicantPhone || 'N/A'} readOnly style={inputStyle} />
                        </div>
                        <div>
                            <span style={labelStyle}>Experience</span>
                            <input type="text" value={application?.applicantExperience || 'N/A'} readOnly style={inputStyle} />
                        </div>
                    </div>
                    {application?.resume && (
                        <button
                            onClick={() => window.open(application.resume, '_blank')}
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
                    )}
                </div>

                {/* ── Interview Type ── */}
                <div style={cardStyle} className="mb-4 w-1/2">
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0 }}>Interview Type</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                         <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #7D1EDB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#7D1EDB' }}></div>
                         </div>
                         <span style={{ fontSize: '14px', color: '#111827' }}>{interviewType}</span>
                    </div>
                </div>

                {/* ── Interview Mode ── */}
                <div style={cardStyle} className="mb-4 w-1/2">
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0 }}>Interview Mode</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                         <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #7D1EDB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#7D1EDB' }}></div>
                         </div>
                         <span style={{ fontSize: '14px', color: '#111827' }}>{interviewMode}</span>
                    </div>
                </div>

                {/* ── Interview Timing & Panel ── */}
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div style={{ ...cardStyle, flex: 1 }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0 }}>Interview Timing</h3>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ position: 'relative', flex: 1 }}>
                                <input type="text" value={formatDate(interview.scheduledAt)} readOnly style={inputStyle} />
                                <Calendar style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} size={15} />
                            </div>
                            <div style={{ position: 'relative', flex: 1 }}>
                                <input type="text" value={formatTime(interview.scheduledAt)} readOnly style={inputStyle} />
                                <ChevronDown style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} size={15} />
                            </div>
                        </div>
                    </div>
                    <div style={{ ...cardStyle, flex: 1 }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0 }}>Interview Panel</h3>
                        <div style={{ position: 'relative' }}>
                            <input type="text" value={interview.interviewerId ? `Panel ${interview.interviewerId}` : 'N/A'} readOnly style={inputStyle} />
                        </div>
                    </div>
                </div>

                {/* ── Email Preview ── */}
                <div style={cardStyle}>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0 }}>Email Preview To Candidate</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#374151', fontFamily: '"Nunito Sans", sans-serif' }}>
                        <p style={{ margin: 0 }}>Date: <strong>{formatDate(interview.scheduledAt)}</strong></p>
                        <p style={{ margin: 0 }}>Time: <strong>{formatTime(interview.scheduledAt)}</strong></p>
                        <p style={{ margin: 0 }}>Interview Type: <strong>{interviewType}</strong></p>
                        <p style={{ margin: 0 }}>Interview Panel: <strong>{interview.panel === 'Tech' ? 'Tech Panel' : interview.panel ? 'HR Panel' : 'N/A'}</strong></p>
                        <p style={{ margin: 0 }}>Mode: <strong>{interviewMode}</strong></p>
                        {requiresMeet ? (
                            meetUrl ? (
                                <div style={{ marginTop: '4px' }}>
                                    <p style={{ margin: '0 0 8px 0' }}>Google Meet: <strong style={{ wordBreak: 'break-all' }}>{meetUrl}</strong></p>
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                        <button
                                            type="button"
                                            onClick={() => window.open(meetUrl, '_blank', 'noopener,noreferrer')}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                padding: '8px 16px',
                                                backgroundColor: '#7D1EDB',
                                                color: '#FFFFFF',
                                                border: 'none',
                                                borderRadius: '999px',
                                                cursor: 'pointer',
                                                fontSize: '13px',
                                                fontWeight: 600,
                                            }}
                                        >
                                            <ExternalLink size={14} /> Join Meeting
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => copyMeetLink(meetUrl)}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                padding: '8px 16px',
                                                backgroundColor: '#FFFFFF',
                                                color: '#7D1EDB',
                                                border: '1.5px solid #7D1EDB',
                                                borderRadius: '999px',
                                                cursor: 'pointer',
                                                fontSize: '13px',
                                                fontWeight: 600,
                                            }}
                                        >
                                            <Copy size={14} /> Copy Link
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p style={{ margin: 0 }}>Meeting link: <strong>Not available</strong></p>
                            )
                        ) : (
                            <p style={{ margin: 0 }}>Meeting link: <strong>Not applicable for offline interviews</strong></p>
                        )}
                        <p style={{ margin: 0 }}>Instructions: <strong>Please be on time{requiresMeet && meetUrl ? ' and join using the meeting link above' : ''}.</strong></p>
                    </div>
                </div>

                {/* ── Action Buttons ── */}
                <div className="flex gap-8 mt-4">
                    <button 
                        className="h-12 px-8 bg-[#7D1EDB] text-white font-semibold rounded-full hover:bg-purple-700 transition-colors"
                        style={{ fontSize: '15px', fontFamily: 'Poppins, sans-serif' }}
                        onClick={() => navigate(`/hrms/hiring-and-recruitment/interview-result/${id}`)}
                    >
                        Share Feedback
                    </button>
                    <button 
                        className="h-12 px-8 bg-transparent text-[#7D1EDB] font-semibold rounded-full border-1.5 border-[#7D1EDB] hover:bg-purple-50 transition-colors"
                        style={{ fontSize: '15px', fontFamily: 'Poppins, sans-serif' }}
                        onClick={() => navigate('/hrms/hiring-and-recruitment/new-hiring/ats-screening/schedule-interview/scheduled-interview-list')}
                    >
                        Cancel
                    </button>
                </div>
                </div>{/* End Inner Scroll */}
        </div>
    );
};

export default ScheduledInterviewDetails;
