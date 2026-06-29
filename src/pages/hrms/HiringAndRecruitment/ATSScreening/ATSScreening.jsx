import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronRight, ArrowLeft, BarChart2, FileText, CheckCircle2, ThumbsDown, Clock } from 'lucide-react';
import { hiringService } from '../../../../service';
import Spinner from '../../../../components/ui/Spinner';
import { toast } from 'react-hot-toast';

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
    const [searchParams] = useSearchParams();
    const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 375);
    const applicationId = searchParams.get('applicationId');

    const [loading, setLoading] = React.useState(true);
    const [analyzing, setAnalyzing] = React.useState(false);
    const [updating, setUpdating] = React.useState(null);
    const [application, setApplication] = React.useState(null);
    const [atsData, setAtsData] = React.useState(null);
    const [hrNotes, setHrNotes] = React.useState('');
    const [savingNotes, setSavingNotes] = React.useState(false);
    const notesTimerRef = React.useRef(null);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 375);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    React.useEffect(() => {
        if (applicationId) {
            loadApplication(applicationId);
        } else {
            setLoading(false);
        }
    }, [applicationId]);

    const loadApplication = async (id) => {
        setLoading(true);
        const result = await hiringService.getApplicationById(id);
        if (result.success) {
            setApplication(result.data);
            if (result.data.hrNotes) {
                setHrNotes(result.data.hrNotes);
            }
            if (result.data.atsData) {
                setAtsData(result.data.atsData);
            } else {
                runAtsAnalysis(id);
            }
        } else {
            toast.error(result.message || 'Failed to load application');
        }
        setLoading(false);
    };

    const runAtsAnalysis = async (id) => {
        setAnalyzing(true);
        const result = await hiringService.analyzeApplication(id);
        if (result.success) {
            setAtsData(result.data);
        }
        setAnalyzing(false);
    };

    const handleSaveNotes = async (notes) => {
        if (!applicationId) return;
        setSavingNotes(true);
        const result = await hiringService.updateApplicationNotes(applicationId, notes);
        if (result.success) {
            toast.success('Notes saved');
        }
        setSavingNotes(false);
    };

    const handleNotesChange = (e) => {
        setHrNotes(e.target.value);
        if (notesTimerRef.current) clearTimeout(notesTimerRef.current);
        notesTimerRef.current = setTimeout(() => {
            handleSaveNotes(e.target.value);
        }, 1000);
    };

    const handleUpdateStatus = async (status) => {
        if (!applicationId) return;
        setUpdating(status);
        const result = await hiringService.updateApplicationStatus(applicationId, status);
        if (result.success) {
            toast.success(`Application ${status.replace('_', ' ')} successfully`);
            if (status === 'shortlisted') {
                navigate(`/hrms/hiring-and-recruitment/new-hiring/ats-screening/schedule-interview?applicationId=${applicationId}`);
            }
        } else {
            toast.error(result.message);
        }
        setUpdating(null);
    };

    const skillsList = application?.applicantSkills
        ? application.applicantSkills.split(/[,;]\s*/).filter(Boolean)
        : [];

    return (
        <div className="bg-white px-4 sm:px-4 md:px-6 py-4 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-9rem)] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-10rem)] xl:h-[calc(100vh-11rem)] flex flex-col font-sans border border-[#D9D9D9] overflow-hidden" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
            <div className="shrink-0 mb-4">
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '10px' }}>
                    <div
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                        onClick={() => navigate('/hrms/hiring-and-recruitment/new-hiring')}
                    >
                        <ArrowLeft size={14} style={{ color: '#111827' }} />
                        <span style={{ fontSize: '13px', fontWeight: 500, color: '#7D1EDB' }}>New Hiring</span>
                    </div>
                    <ChevronRight size={15} style={{ color: '#9CA3AF' }} />
                    <span style={{ fontSize: '13px', color: '#667085' }}>ATS Screening</span>
                </div>
                <h1 style={{ fontSize: '20px', fontWeight: 600, color: '#494949', margin: '0 0 16px 0', fontFamily: '"Nunito Sans", sans-serif', lineHeight: '140%' }}>ATS Screening</h1>
            </div>

            <div className="custom-scrollbar pr-2 pb-4" style={{ flex: 1, overflowY: 'auto' }}>
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Spinner size={32} color="#7D1EDB" />
                    </div>
                ) : !application ? (
                    <div className="flex items-center justify-center h-64 text-gray-400">
                        <p>No application selected. Please select a candidate from New Hiring.</p>
                    </div>
                ) : (
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>

                    {/* LEFT COLUMN: Resume Score */}
                    <div style={{
                        flex: '0 0 auto',
                        width: isMobile ? '100%' : 'clamp(280px, 35%, 420px)',
                        border: '1px solid #CECECE',
                        borderRadius: '8px',
                        padding: isMobile ? '16px' : '24px',
                        backgroundColor: '#FFFFFF',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        boxSizing: 'border-box',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <BarChart2 size={20} style={{ width: '20px', height: '18px', color: '#7D1EDB' }} />
                            <span style={{ fontSize: '15px', fontWeight: 600, color: '#111827' }}>Resume Score</span>
                        </div>

                        {analyzing ? (
                            <div className="flex items-center justify-center py-8">
                                <Spinner size={24} color="#7D1EDB" />
                                <span className="ml-2 text-sm text-gray-500">Analyzing resume...</span>
                            </div>
                        ) : atsData ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <div className="flex justify-between items-center">
                                    <span style={{ fontFamily: '"Nunito Sans", sans-serif', fontSize: '13px', fontWeight: 500, color: '#111827' }}>Skill Match</span>
                                    <span style={{ fontFamily: '"Nunito Sans", sans-serif', fontSize: '13px', fontWeight: 700, color: '#111827' }}>{atsData.skillMatch}%</span>
                                </div>
                                <div style={{ width: '100%', backgroundColor: '#E5E7EB', borderRadius: '999px', height: '8px' }}>
                                    <div style={{ width: `${atsData.skillMatch}%`, height: '8px', borderRadius: '999px', backgroundColor: '#2176FF' }}></div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <div className="flex justify-between items-center">
                                    <span style={{ fontFamily: '"Nunito Sans", sans-serif', fontSize: '13px', fontWeight: 500, color: '#111827' }}>Experience Fit</span>
                                    <span style={{ fontFamily: '"Nunito Sans", sans-serif', fontSize: '13px', fontWeight: 700, color: '#111827' }}>{atsData.experienceFit}%</span>
                                </div>
                                <div style={{ width: '100%', backgroundColor: '#E5E7EB', borderRadius: '999px', height: '8px' }}>
                                    <div style={{ width: `${atsData.experienceFit}%`, height: '8px', borderRadius: '999px', backgroundColor: '#2176FF' }}></div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <div className="flex justify-between items-center">
                                    <span style={{ fontFamily: '"Nunito Sans", sans-serif', fontSize: '13px', fontWeight: 500, color: '#111827' }}>Education Fit</span>
                                    <span style={{ fontFamily: '"Nunito Sans", sans-serif', fontSize: '13px', fontWeight: 700, color: '#111827' }}>{atsData.educationFit}%</span>
                                </div>
                                <div style={{ width: '100%', backgroundColor: '#E5E7EB', borderRadius: '999px', height: '8px' }}>
                                    <div style={{ width: `${atsData.educationFit}%`, height: '8px', borderRadius: '999px', backgroundColor: '#2176FF' }}></div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <div className="flex justify-between items-center">
                                    <span style={{ fontFamily: '"Nunito Sans", sans-serif', fontSize: '13px', fontWeight: 500, color: '#111827' }}>Role Match</span>
                                    <span style={{ fontFamily: '"Nunito Sans", sans-serif', fontSize: '13px', fontWeight: 700, color: '#111827' }}>{atsData.roleMatch}%</span>
                                </div>
                                <div style={{ width: '100%', backgroundColor: '#E5E7EB', borderRadius: '999px', height: '8px' }}>
                                    <div style={{ width: `${atsData.roleMatch}%`, height: '8px', borderRadius: '999px', backgroundColor: '#2176FF' }}></div>
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '16px' }}>
                                <p style={{ fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '10px' }}>ATS Verdict</p>
                                <textarea
                                    readOnly
                                    value={atsData.atsVerdict || 'Strong fit'}
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
                        ) : (
                            <div className="flex items-center justify-center py-8">
                                <span className="text-sm text-gray-400">Unable to analyze resume</span>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Resume Preview + HR Notes */}
                    <div style={{ flex: '1 1 0', minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '16px', alignSelf: 'flex-start', width: '100%' }}>

                        {/* Resume Preview */}
                        <div style={{
                            width: '100%',
                            border: '1px solid #DDDDDD',
                            borderRadius: '8px',
                            padding: isMobile ? '16px' : '20px',
                            backgroundColor: '#FFFFFF',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '11px',
                            boxSizing: 'border-box',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FileText size={18} style={{ color: '#6B7280' }} />
                                <span style={{ fontFamily: '"Nunito Sans", sans-serif', fontSize: '16px', fontWeight: 600, lineHeight: '100%', color: '#000000' }}>Resume preview</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                <h3 style={{ fontFamily: '"Nunito Sans", sans-serif', fontSize: '16px', fontWeight: 600, color: '#000000', margin: 0, lineHeight: '100%' }}>{application.applicantName}</h3>
                                <p style={{ fontFamily: '"Nunito Sans", sans-serif', fontSize: '12px', fontWeight: 500, color: '#000000', margin: 0, lineHeight: '100%' }}>{application.applicantEmail}</p>
                            </div>

                            <div>
                                <h4 style={{ fontFamily: '"Nunito Sans", sans-serif', fontSize: '13px', fontWeight: 600, color: '#000000', margin: '0 0 5px 0', lineHeight: '100%' }}>Professional summary:</h4>
                                <p style={{ fontFamily: '"Nunito Sans", sans-serif', fontSize: '11px', fontWeight: 400, color: '#000000', margin: 0, lineHeight: '100%' }}>
                                    Candidate with {application.applicantExperience || 'relevant'} experience in {application.applicantSkills ? application.applicantSkills.split(/[,;]/)[0] : 'the industry'}.
                                </p>
                            </div>

                            <div>
                                <h4 style={{ fontFamily: '"Nunito Sans", sans-serif', fontSize: '13px', fontWeight: 600, color: '#000000', margin: '0 0 8px 0', lineHeight: '100%' }}>Key skills:</h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {skillsList.length > 0 ? skillsList.map((skill, i) => (
                                        <Pill key={i} text={skill.trim()} isActive={i % 2 === 0} />
                                    )) : (
                                        <span style={{ fontSize: '11px', color: '#9CA3AF' }}>No skills listed</span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h4 style={{ fontFamily: '"Nunito Sans", sans-serif', fontSize: '13px', fontWeight: 600, color: '#000000', margin: '0 0 5px 0', lineHeight: '100%' }}>Experience:</h4>
                                <div style={{ fontFamily: '"Nunito Sans", sans-serif', fontSize: '11px', fontWeight: 400, color: '#000000', display: 'flex', flexDirection: 'column', gap: '3px', lineHeight: '100%' }}>
                                    <p style={{ margin: 0 }}>{application.applicantExperience || 'N/A'} experience</p>
                                    <p style={{ margin: 0 }}>{application.jobTitle ? `Applying for: ${application.jobTitle}` : ''}</p>
                                </div>
                            </div>
                        </div>

                        {/* HR Notes + Action Buttons */}
                        <div style={{
                            width: '100%',
                            border: '1px solid #DDDDDD',
                            borderRadius: '8px',
                            padding: isMobile ? '16px' : '20px',
                            backgroundColor: '#FFFFFF',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '24px',
                            boxSizing: 'border-box',
                        }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2.5 2.5H17.5V13.3333H6.66667L2.5 17.5V2.5Z" stroke="#808080" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M6.66663 6.66667H13.3333" stroke="#808080" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M6.66663 10H10" stroke="#808080" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        <span style={{ fontSize: '15px', fontWeight: 600, color: '#111827' }}>HR Notes</span>
                                    </div>
                                    {savingNotes && <Spinner size={14} color="#7D1EDB" />}
                                </div>
                                <textarea
                                    placeholder="Add comments or observations here...."
                                    value={hrNotes}
                                    onChange={handleNotesChange}
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

                            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                                <button
                                    disabled={updating === 'shortlisted'}
                                    onClick={() => handleUpdateStatus('shortlisted')}
                                    style={{
                                        height: '44px',
                                        padding: '0 24px',
                                        backgroundColor: updating === 'shortlisted' ? '#9B5DE5' : '#7D1EDB',
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
                                        minWidth: isMobile ? '100%' : '180px',
                                        justifyContent: 'center',
                                        opacity: updating === 'shortlisted' ? 0.7 : 1,
                                    }}
                                    onMouseEnter={e => { if (updating !== 'shortlisted') e.currentTarget.style.backgroundColor = '#6B18C1'; }}
                                    onMouseLeave={e => { if (updating !== 'shortlisted') e.currentTarget.style.backgroundColor = '#7D1EDB'; }}
                                >
                                    {updating === 'shortlisted' ? <Spinner size={16} color="#fff" /> : <CheckCircle2 size={17} />}
                                    {updating === 'shortlisted' ? 'Processing...' : 'Select for interview'}
                                </button>

                                <button
                                    disabled={updating === 'rejected'}
                                    onClick={() => handleUpdateStatus('rejected')}
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
                                        minWidth: isMobile ? '100%' : '120px',
                                        justifyContent: 'center',
                                        opacity: updating === 'rejected' ? 0.7 : 1,
                                    }}
                                    onMouseEnter={e => { if (updating !== 'rejected') e.currentTarget.style.backgroundColor = '#E0332A'; }}
                                    onMouseLeave={e => { if (updating !== 'rejected') e.currentTarget.style.backgroundColor = '#FF3B30'; }}
                                >
                                    {updating === 'rejected' ? <Spinner size={16} color="#fff" /> : <ThumbsDown size={17} />}
                                    {updating === 'rejected' ? 'Processing...' : 'Reject'}
                                </button>

                                <button
                                    disabled={updating === 'under_review'}
                                    onClick={() => handleUpdateStatus('under_review')}
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
                                        minWidth: isMobile ? '100%' : '180px',
                                        justifyContent: 'center',
                                        opacity: updating === 'under_review' ? 0.7 : 1,
                                    }}
                                    onMouseEnter={e => { if (updating !== 'under_review') e.currentTarget.style.backgroundColor = '#F5EEFB'; }}
                                    onMouseLeave={e => { if (updating !== 'under_review') e.currentTarget.style.backgroundColor = 'transparent'; }}
                                >
                                    {updating === 'under_review' ? <Spinner size={16} color="#7D1EDB" /> : <Clock size={17} />}
                                    {updating === 'under_review' ? 'Processing...' : 'Keep under review'}
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
                )}
            </div>
        </div>
    );
};

export default ATSScreening;