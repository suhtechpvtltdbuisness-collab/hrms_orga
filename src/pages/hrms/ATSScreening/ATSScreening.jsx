import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, BarChart2, FileText, CheckCircle2, ThumbsDown, Clock } from 'lucide-react';

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div className="flex justify-between items-center">
                <span style={{ fontFamily: '"Nunito Sans", sans-serif', fontSize: '13px', fontWeight: 500, color: '#111827' }}>{label}</span>
                <span style={{ fontFamily: '"Nunito Sans", sans-serif', fontSize: '13px', fontWeight: 700, color: '#111827' }}>{percentage}%</span>
            </div>
            <div style={{ width: '100%', backgroundColor: '#E5E7EB', borderRadius: '999px', height: '8px' }}>
                <div style={{ width: `${percentage}%`, height: '8px', borderRadius: '999px', backgroundColor: '#2176FF' }}></div>
            </div>
        </div>
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
            <div style={{ padding: '20px 24px 24px 24px' }}>

                {/* Breadcrumb */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '10px' }}>
                    <div
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                        onClick={() => navigate('/hrms/new-hiring')}
                    >
                        <ArrowLeft size={14} style={{ color: '#111827' }} />
                        <span style={{ fontSize: '13px', fontWeight: 500, color: '#7D1EDB' }}>New Hiring</span>
                    </div>
                    <ChevronRight size={15} style={{ color: '#9CA3AF' }} />
                    <span style={{ fontSize: '13px', color: '#667085' }}>ATS Screening</span>
                </div>

                {/* Page Title */}
                <h1 style={{ fontSize: '20px', fontWeight: 600, color: '#494949', margin: '0 0 16px 0', fontFamily: '"Nunito Sans", sans-serif', lineHeight: '140%' }}>ATS Screening</h1>

                {/* Main Two-Column Layout */}
                <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>

                    {/* ─── LEFT COLUMN: Resume Score ─── */}
                    {/* Figma: width≈418.51, height≈430, padding: 24px, border: 1px solid #CECECE, border-radius: 8px, gap: 16px */}
                    <div style={{
                        flex: '0 0 auto',
                        width: 'clamp(280px, 35%, 420px)',
                        border: '1px solid #CECECE',
                        borderRadius: '8px',
                        padding: '24px',
                        backgroundColor: '#FFFFFF',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                    }}>
                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <BarChart2 size={20} style={{ color: '#7D1EDB' }} />
                            <span style={{ fontSize: '15px', fontWeight: 600, color: '#111827' }}>Resume Score</span>
                        </div>

                        {/* Progress Bars — gap: 16px between each */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {renderProgressBar('Skill Match', 85)}
                            {renderProgressBar('Experience Fit', 78)}
                            {renderProgressBar('Education Fit', 92)}
                            {renderProgressBar('Role Match', 88)}
                        </div>

                        {/* ATS Verdict */}
                        <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '16px' }}>
                            <p style={{ fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '10px' }}>ATS Verdict</p>
                            <textarea
                                readOnly
                                value="Strong fit"
                                style={{
                                    width: '100%',
                                    height: '100px',
                                    padding: '12px',
                                    border: '1px solid #D1D5DB',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    color: '#374151',
                                    resize: 'none',
                                    backgroundColor: '#FFFFFF',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    fontFamily: '"Nunito Sans", sans-serif',
                                }}
                            />
                        </div>
                    </div>

                    {/* ─── RIGHT COLUMN: Resume Preview + HR Notes ─── */}
                    <div style={{ flex: '1 1 0', minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '16px', alignSelf: 'flex-start', width: '100%' }}>

                        {/* Resume Preview */}
                        {/* Figma: width≈624.18, height≈391, padding: 20px, border: 1px solid #DDDDDD, border-radius: 8px, gap: 11px */}
                        <div style={{
                            border: '1px solid #DDDDDD',
                            borderRadius: '8px',
                            padding: '20px',
                            backgroundColor: '#FFFFFF',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '11px',
                        }}>
                            {/* Header */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FileText size={18} style={{ color: '#6B7280' }} />
                                <span style={{ fontSize: '15px', fontWeight: 600, color: '#111827' }}>Resume Preview</span>
                            </div>

                            {/* Name + Email */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', margin: 0 }}>Sarah Johnson</h3>
                                <p style={{ fontSize: '12px', color: '#667085', margin: 0, fontFamily: '"Nunito Sans", sans-serif' }}>Sarahj450@Gmail.Com</p>
                            </div>

                            {/* Professional Summary */}
                            <div>
                                <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#111827', margin: '0 0 5px 0' }}>Professional Summary:</h4>
                                <p style={{ fontSize: '12px', color: '#4B5563', margin: 0, lineHeight: '1.6', fontFamily: '"Nunito Sans", sans-serif' }}>
                                    Experienced Professional With Strong Background In The Industry. Proven Track Record Of Delivering
                                    Results And Leading Successful Projects
                                </p>
                            </div>

                            {/* Key Skills */}
                            <div>
                                <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#111827', margin: '0 0 8px 0' }}>Key Skills:</h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    <Pill text="Project Management" isActive={true} />
                                    <Pill text="Leadership" isActive={false} />
                                    <Pill text="Communication" isActive={true} />
                                    <Pill text="Analytics" isActive={false} />
                                    <Pill text="Strategy" isActive={true} />
                                </div>
                            </div>

                            {/* Experience */}
                            <div>
                                <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#111827', margin: '0 0 5px 0' }}>Experience:</h4>
                                <div style={{ fontFamily: '"Nunito Sans", sans-serif', fontSize: '12px', color: '#4B5563', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                    <p style={{ margin: 0 }}>Senior Manager</p>
                                    <p style={{ margin: 0 }}>SUH Tech - 2020</p>
                                </div>
                            </div>
                        </div>

                        {/* HR Notes + Action Buttons */}
                        {/* Figma: width≈678.33, height≈238.87, gap: 24px — buttons inside card */}
                        <div style={{
                            border: '1px solid #DDDDDD',
                            borderRadius: '8px',
                            padding: '20px',
                            backgroundColor: '#FFFFFF',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '24px',
                        }}>
                            {/* HR Notes Header + Textarea */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.5 2.5H17.5V13.3333H6.66667L2.5 17.5V2.5Z" stroke="#808080" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M6.66663 6.66667H13.3333" stroke="#808080" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M6.66663 10H10" stroke="#808080" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span style={{ fontSize: '15px', fontWeight: 600, color: '#111827' }}>HR Notes</span>
                                </div>
                                <textarea
                                    placeholder="Add comments or observations here...."
                                    style={{
                                        width: '100%',
                                        height: '80px',
                                        padding: '12px 16px',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        color: '#374151',
                                        backgroundColor: '#F9FAFB',
                                        resize: 'none',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                        fontFamily: '"Nunito Sans", sans-serif',
                                    }}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                                <button
                                    onClick={() => navigate('/hrms/schedule-interview')}
                                    style={{
                                        height: '44px',
                                        padding: '0 24px',
                                        backgroundColor: '#7D1EDB',
                                        color: '#FFFFFF',
                                        fontWeight: 500,
                                        borderRadius: '999px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontSize: '14px',
                                        fontFamily: 'Poppins, sans-serif',
                                        minWidth: '180px',
                                        justifyContent: 'center',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#6B18C1'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#7D1EDB'}
                                >
                                    Select for interview
                                    <CheckCircle2 size={17} />
                                </button>

                                <button
                                    style={{
                                        height: '44px',
                                        padding: '0 28px',
                                        backgroundColor: '#FF3B30',
                                        color: '#FFFFFF',
                                        fontWeight: 500,
                                        borderRadius: '999px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontSize: '14px',
                                        fontFamily: 'Poppins, sans-serif',
                                        minWidth: '120px',
                                        justifyContent: 'center',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#E0332A'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FF3B30'}
                                >
                                    Reject
                                    <ThumbsDown size={17} />
                                </button>

                                <button
                                    style={{
                                        height: '44px',
                                        padding: '0 20px',
                                        backgroundColor: 'transparent',
                                        color: '#7D1EDB',
                                        fontWeight: 500,
                                        borderRadius: '999px',
                                        border: '1.5px solid #7D1EDB',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontSize: '14px',
                                        fontFamily: 'Poppins, sans-serif',
                                        minWidth: '180px',
                                        justifyContent: 'center',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F5EEFB'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    Keep under review
                                    <Clock size={17} />
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ATSScreening;
