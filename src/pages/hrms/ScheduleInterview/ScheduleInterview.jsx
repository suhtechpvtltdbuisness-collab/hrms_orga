import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Calendar, Clock, ChevronDown } from 'lucide-react';

const ScheduleInterview = () => {
    const navigate = useNavigate();

    const [interviewType, setInterviewType] = useState('HR Round');
    const [interviewMode, setInterviewMode] = useState('Online');

    /* ── shared card style ── */
    const card = {
        border: '1px solid #E4E4E4',
        borderRadius: '4px',
        backgroundColor: '#FFFFFF',
    };

    /* ── shared label style ── */
    const label = {
        display: 'block',
        fontSize: '13px',
        color: '#374151',
        marginBottom: '6px',
        fontFamily: '"Nunito Sans", sans-serif',
    };

    /* ── shared input style ── */
    const input = {
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
        backgroundColor: '#FFFFFF',
    };

    /* ── radio option ── */
    const RadioOption = ({ name, value, current, onChange, label: lbl }) => (
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
                type="radio"
                name={name}
                checked={current === value}
                onChange={() => onChange(value)}
                style={{ width: '16px', height: '16px', accentColor: '#7D1EDB' }}
            />
            <span style={{ fontSize: '14px', color: '#374151', fontFamily: '"Nunito Sans", sans-serif' }}>{lbl}</span>
        </label>
    );

    return (
        <div
            style={{
                fontFamily: 'Poppins, sans-serif',
                backgroundColor: '#F2F2F7',
                minHeight: 'calc(100vh - 5rem)',
                overflowY: 'auto',
            }}
        >
            {/* Outer padding: horizontal 20px for consistent alignment with title */}
            <div style={{ padding: '10px 20px 40px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

                {/* Breadcrumb + Title — same horizontal alignment as cards */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                        <div
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                            onClick={() => navigate('/hrms/ats-screening')}
                        >
                            <ArrowLeft size={14} style={{ color: '#111827' }} />
                            <span style={{ fontSize: '13px', fontWeight: 500, color: '#7D1EDB' }}>ATS Screening</span>
                        </div>
                        <ChevronRight size={15} style={{ color: '#9CA3AF' }} />
                        <span style={{ fontSize: '13px', color: '#667085' }}>Schedule Interview</span>
                    </div>

                    <h1 style={{
                        fontSize: '20px',
                        fontWeight: 600,
                        color: '#494949',
                        margin: '0 0 4px 0',
                        fontFamily: '"Nunito Sans", sans-serif',
                        lineHeight: '140%',
                    }}>
                        Schedule Interview
                    </h1>
                </div>

                {/* ── Card 1: Candidate Information ── */}
                <div style={{ ...card, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0, fontFamily: '"Nunito Sans", sans-serif' }}>
                        Candidate Information
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                        <div>
                            <span style={label}>Name</span>
                            <input type="text" placeholder="Enter name" style={input} />
                        </div>
                        <div>
                            <span style={label}>Email</span>
                            <input type="email" placeholder="Enter mail ID" style={input} />
                        </div>
                        <div>
                            <span style={label}>Phone number</span>
                            <input type="text" placeholder="Enter phone number" style={input} />
                        </div>
                        <div>
                            <span style={label}>Experience</span>
                            <input type="text" placeholder="Enter experience" style={input} />
                        </div>
                    </div>

                    <button
                        style={{
                            height: '38px',
                            padding: '0 22px',
                            backgroundColor: 'transparent',
                            color: '#7D1EDB',
                            fontWeight: 500,
                            borderRadius: '999px',
                            border: '1.5px solid #7D1EDB',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontFamily: 'Poppins, sans-serif',
                            width: 'fit-content',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.backgroundColor = '#F5EEFB';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                    >
                        View Resume
                    </button>
                </div>

                {/* ── Card 2: Interview Type ── */}
                <div style={{ ...card, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '520px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0, fontFamily: '"Nunito Sans", sans-serif' }}>
                        Interview Type
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                        <RadioOption name="interviewType" value="Round 1(Technical)" current={interviewType} onChange={setInterviewType} label="Round 1(Technical)" />
                        <RadioOption name="interviewType" value="Round 2(Managerial)" current={interviewType} onChange={setInterviewType} label="Round 2(Managerial)" />
                        <RadioOption name="interviewType" value="HR Round" current={interviewType} onChange={setInterviewType} label="HR Round" />
                    </div>
                </div>

                {/* ── Card 3: Interview Mode ── */}
                <div style={{ ...card, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '520px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0, fontFamily: '"Nunito Sans", sans-serif' }}>
                        Interview Mode
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
                        <RadioOption name="interviewMode" value="Online" current={interviewMode} onChange={setInterviewMode} label="Online" />
                        <RadioOption name="interviewMode" value="Offline" current={interviewMode} onChange={setInterviewMode} label="Offline" />
                        <RadioOption name="interviewMode" value="Hybrid" current={interviewMode} onChange={setInterviewMode} label="Hybrid" />
                    </div>
                </div>

                {/* ── Card 4: Interview Timing + Panel (two side-by-side cards) ── */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {/* Timing — Figma: 433px wide, 106px tall */}
                    <div style={{
                        width: '433px',
                        minHeight: '106px',
                        border: '1px solid #E4E4E4',
                        borderRadius: '4px',
                        backgroundColor: '#FFFFFF',
                        padding: '16px 20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        boxSizing: 'border-box',
                    }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0, fontFamily: '"Nunito Sans", sans-serif' }}>
                            Interview Timing
                        </h3>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ position: 'relative', flex: 1 }}>
                                <input
                                    type="text"
                                    placeholder="mm/dd/yyyy"
                                    style={{ ...input, paddingRight: '36px' }}
                                />
                                <Calendar style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} size={15} />
                            </div>
                            <div style={{ position: 'relative', flex: 1 }}>
                                <input
                                    type="text"
                                    placeholder="Select Time"
                                    style={{ ...input, paddingRight: '36px' }}
                                />
                                <Clock style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} size={15} />
                            </div>
                        </div>
                    </div>

                    {/* Panel — same Figma specs as Timing card */}
                    <div style={{
                        width: '433px',
                        minHeight: '106px',
                        border: '1px solid #E4E4E4',
                        borderRadius: '4px',
                        backgroundColor: '#FFFFFF',
                        padding: '16px 20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        boxSizing: 'border-box',
                    }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0, fontFamily: '"Nunito Sans", sans-serif' }}>
                            Interview Pannel
                        </h3>
                        <div style={{ position: 'relative' }}>
                            <select
                                style={{
                                    ...input,
                                    paddingRight: '36px',
                                    appearance: 'none',
                                    cursor: 'pointer',
                                }}
                            >
                                <option value="">Select interview pannel</option>
                                <option value="hr">HR Pannel</option>
                                <option value="tech">Tech Pannel</option>
                            </select>
                            <ChevronDown style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} size={15} />
                        </div>
                    </div>
                </div>

                {/* ── Card 5: Email Preview ── */}
                {/* Figma: Fill width, height 224.45px, radius 4px, border 1px #E4E4E4, padding 16px 20px, gap 8px */}
                <div style={{
                    width: '100%',
                    minHeight: '224.45px',
                    border: '1px solid #E4E4E4',
                    borderRadius: '4px',
                    backgroundColor: '#FFFFFF',
                    padding: '16px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    boxSizing: 'border-box',
                }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0, fontFamily: '"Nunito Sans", sans-serif' }}>
                        Email Preview To Candidate
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: '"Nunito Sans", sans-serif', fontSize: '13px', color: '#374151' }}>
                        <p style={{ margin: 0 }}><span style={{ color: '#6B7280' }}>Date:</span> <strong>10/01/2026</strong></p>
                        <p style={{ margin: 0 }}><span style={{ color: '#6B7280' }}>Time:</span> <strong>10:00 AM</strong></p>
                        <p style={{ margin: 0 }}><span style={{ color: '#6B7280' }}>Interview Pannel:</span> <strong>HR</strong></p>
                        <p style={{ margin: 0 }}><span style={{ color: '#6B7280' }}>Mode:</span> <strong>Online</strong></p>
                        <p style={{ margin: 0 }}>
                            <span style={{ color: '#6B7280' }}>Zoom meet link: </span>
                            <a href="#" style={{ color: '#7D1EDB', textDecoration: 'none' }}
                                onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                                onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                            >https://hiuhe.h..</a>
                        </p>
                        <p style={{ margin: 0 }}><span style={{ color: '#6B7280' }}>Instructions:</span> <strong>Please be on time</strong></p>
                    </div>
                </div>

                {/* ── Action Buttons Row — Figma: width 708px, height 48px, gap 30px ── */}
                <div style={{
                    width: '708px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '30px',
                    marginTop: '20px',
                }}>
                    {/* Send Interview Invitation */}
                    <button
                        style={{
                            height: '48px',
                            padding: '0 24px',
                            backgroundColor: '#7D1EDB',
                            color: '#FFFFFF',
                            fontWeight: 500,
                            borderRadius: '999px',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontFamily: 'Poppins, sans-serif',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#6B18C1'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#7D1EDB'}
                    >
                        Send Interview Invitation
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                            <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                    </button>

                    {/* Cancel */}
                    <button
                        style={{
                            height: '48px',
                            padding: '0 32px',
                            backgroundColor: 'transparent',
                            color: '#FF3B30',
                            fontWeight: 500,
                            borderRadius: '999px',
                            border: '1.5px solid #FF3B30',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontFamily: 'Poppins, sans-serif',
                            whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FFF0EF'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        Cancel
                    </button>

                    {/* Save Draft */}
                    <button
                        style={{
                            height: '48px',
                            padding: '0 32px',
                            backgroundColor: 'transparent',
                            color: '#7D1EDB',
                            fontWeight: 500,
                            borderRadius: '999px',
                            border: '1.5px solid #7D1EDB',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontFamily: 'Poppins, sans-serif',
                            whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F5EEFB'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        Save Draft
                    </button>
                </div>
            </div>
        </div>
    );
};


export default ScheduleInterview;
