import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ChevronRight, ArrowLeft, Calendar, Clock, ChevronDown } from 'lucide-react';

const ScheduleInterview = () => {
    const navigate = useNavigate();

    const [interviewType, setInterviewType] = useState('HR Round');
    const [interviewMode, setInterviewMode] = useState('Online');
    const [isReadMode, setIsReadMode] = useState(false);

    const dateInputRef = useRef(null);
    const timeInputRef = useRef(null);

    /* ── Form State ── */
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        experience: '',
        date: '',
        time: '',
        panel: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        const { name, email, phone, experience, date, time, panel } = formData;
        if (!name || !email || !phone || !experience || !date || !time || !panel) {
            toast.error('Please fill in all candidate and interview details.');
            return;
        }
        setIsReadMode(true);
        toast.success('Interview scheduled successfully!');
    };

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
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: isReadMode ? 'default' : 'pointer', opacity: isReadMode && current !== value ? 0.6 : 1 }}>
            <input
                type="radio"
                name={name}
                checked={current === value}
                onChange={() => !isReadMode && onChange(value)}
                disabled={isReadMode}
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
            <style>{`
                input[type="date"]::-webkit-calendar-picker-indicator,
                input[type="time"]::-webkit-calendar-picker-indicator {
                    display: none !important;
                    -webkit-appearance: none;
                }
            `}</style>
            {/* Outer padding: horizontal 20px for consistent alignment with title */}
            <div style={{ padding: '10px 20px 250px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

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

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h1 style={{
                            fontSize: '20px',
                            fontWeight: 600,
                            color: '#494949',
                            margin: '0',
                            fontFamily: '"Nunito Sans", sans-serif',
                            lineHeight: '140%',
                        }}>
                            Schedule Interview {isReadMode && <span style={{ fontSize: '14px', fontWeight: 400, color: '#6B7280', marginLeft: '8px' }}>(Read Mode)</span>}
                        </h1>
                        <button
                            style={{
                                backgroundColor: '#7D1EDB',
                                color: '#FFFFFF',
                                fontWeight: 600,
                                padding: '8px 32px',
                                borderRadius: '999px',
                                border: 'none',
                                cursor: isReadMode ? 'default' : 'pointer',
                                fontSize: '16px',
                                fontFamily: 'Poppins, sans-serif',
                                opacity: isReadMode ? 0.8 : 1
                            }}
                            onClick={handleSave}
                            disabled={isReadMode}
                        >
                            Save
                        </button>
                    </div>
                </div>

                {/* ── Card 1: Candidate Information ── */}
                <div style={{ ...card, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0, fontFamily: '"Nunito Sans", sans-serif' }}>
                        Candidate Information
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                        <div>
                            <span style={label}>Name</span>
                            <input type="text" name="name" placeholder="Enter name" style={{ ...input, backgroundColor: isReadMode ? '#F3F4F6' : '#FFFFFF' }} value={formData.name} onChange={handleInputChange} disabled={isReadMode} />
                        </div>
                        <div>
                            <span style={label}>Email</span>
                            <input type="email" name="email" placeholder="Enter mail ID" style={{ ...input, backgroundColor: isReadMode ? '#F3F4F6' : '#FFFFFF' }} value={formData.email} onChange={handleInputChange} disabled={isReadMode} />
                        </div>
                        <div>
                            <span style={label}>Phone number</span>
                            <input type="text" name="phone" placeholder="Enter phone number" style={{ ...input, backgroundColor: isReadMode ? '#F3F4F6' : '#FFFFFF' }} value={formData.phone} onChange={handleInputChange} disabled={isReadMode} />
                        </div>
                        <div>
                            <span style={label}>Experience</span>
                            <input type="text" name="experience" placeholder="Enter experience" style={{ ...input, backgroundColor: isReadMode ? '#F3F4F6' : '#FFFFFF' }} value={formData.experience} onChange={handleInputChange} disabled={isReadMode} />
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
                        onClick={() => toast.success('Loading resume...')}
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
                    {/* Timing — Figma: 425px wide (385 content + 40 padding), 106px tall */}
                    <div style={{
                        width: '425px',
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
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <div style={{ position: 'relative', width: '185px' }}>
                                <input
                                    ref={dateInputRef}
                                    type={isReadMode ? "text" : "date"}
                                    name="date"
                                    placeholder="mm/dd/yyyy"
                                    style={{ 
                                        ...input, 
                                        width: '185px',
                                        height: '40px',
                                        paddingRight: '36px', 
                                        backgroundColor: isReadMode ? '#F3F4F6' : '#F5F5F5',
                                        border: '1px solid #D9D9D9',
                                        borderRadius: '8px',
                                        cursor: isReadMode ? 'default' : 'pointer',
                                    }}
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    disabled={isReadMode}
                                    onClick={() => !isReadMode && dateInputRef.current?.showPicker?.()}
                                />
                                <Calendar 
                                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', cursor: isReadMode ? 'default' : 'pointer' }} 
                                    size={15} 
                                    onClick={() => !isReadMode && dateInputRef.current?.showPicker?.()}
                                />
                            </div>
                            <div style={{ position: 'relative', width: '185px' }}>
                                <input
                                    ref={timeInputRef}
                                    type={isReadMode ? "text" : "time"}
                                    name="time"
                                    placeholder="Select Time"
                                    style={{ 
                                        ...input, 
                                        width: '185px',
                                        height: '40px',
                                        paddingRight: '36px', 
                                        backgroundColor: isReadMode ? '#F3F4F6' : '#F5F5F5',
                                        border: '1px solid #D9D9D9',
                                        borderRadius: '8px',
                                        cursor: isReadMode ? 'default' : 'pointer',
                                    }}
                                    value={formData.time}
                                    onChange={handleInputChange}
                                    disabled={isReadMode}
                                    onClick={() => !isReadMode && timeInputRef.current?.showPicker?.()}
                                />
                                <Clock 
                                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', cursor: isReadMode ? 'default' : 'pointer' }} 
                                    size={15} 
                                    onClick={() => !isReadMode && timeInputRef.current?.showPicker?.()}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Panel — Figma: 425px wide */}
                    <div style={{
                        width: '425px',
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
                        <div style={{ position: 'relative', width: '303px' }}>
                            <select
                                name="panel"
                                style={{
                                    ...input,
                                    width: '303px',
                                    height: '40px',
                                    minWidth: '120px',
                                    backgroundColor: isReadMode ? '#F3F4F6' : '#F5F5F5',
                                    border: '1px solid #D9D9D9',
                                    borderRadius: '8px',
                                    padding: '8px 36px 8px 16px',
                                    appearance: 'none',
                                    cursor: isReadMode ? 'default' : 'pointer',
                                    opacity: 1,
                                    gap: '24px'
                                }}
                                value={formData.panel}
                                onChange={handleInputChange}
                                disabled={isReadMode}
                            >
                                <option value="">Select interview pannel</option>
                                <option value="hr">HR Pannel</option>
                                <option value="tech">Tech Pannel</option>
                            </select>
                            <ChevronDown style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} size={16} />
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

            </div>
        </div>
    );
};


export default ScheduleInterview;
