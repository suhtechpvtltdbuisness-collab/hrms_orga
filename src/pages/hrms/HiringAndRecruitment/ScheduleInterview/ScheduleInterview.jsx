import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ChevronRight, ArrowLeft, Calendar, Clock, ChevronDown, X } from 'lucide-react';
import Spinner from '../../../../components/ui/Spinner';
import { hiringService } from '../../../../service';

const ScheduleInterview = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [interviewType, setInterviewType] = useState('HR Round');
    const [interviewMode, setInterviewMode] = useState('Online');
    const [isReadMode, setIsReadMode] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [activeJobs, setActiveJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [selectedCandidateId, setSelectedCandidateId] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [loadingJobs, setLoadingJobs] = useState(true);
    const [loadingCandidates, setLoadingCandidates] = useState(false);
    const [loadingApplication, setLoadingApplication] = useState(false);
    const [existingResumeUrl, setExistingResumeUrl] = useState('');

    const dateInputRef = useRef(null);
    const timeInputRef = useRef(null);
    const fileInputRef = useRef(null);

    const applicationId = searchParams.get('applicationId');

    useEffect(() => {
        loadActiveJobs();
    }, []);

    useEffect(() => {
        if (applicationId) {
            preloadApplication(Number(applicationId));
        }
    }, [applicationId]);

    useEffect(() => {
        if (selectedJobId) {
            loadCandidates(selectedJobId);
        }
    }, [selectedJobId]);

    const applyApplicationToForm = (app) => {
        setSelectedJobId(app.jobId);
        setSelectedCandidateId(app.id);
        setExistingResumeUrl(app.resume || '');
        setFormData(prev => ({
            ...prev,
            _appId: app.id,
            name: app.applicantName || '',
            email: app.applicantEmail || '',
            phone: app.applicantPhone || '',
            experience: app.applicantExperience || '',
        }));
    };

    const preloadApplication = async (id) => {
        if (!Number.isInteger(id) || id <= 0) return;
        setLoadingApplication(true);
        const result = await hiringService.getApplicationById(id);
        if (result.success && result.data) {
            applyApplicationToForm(result.data);
        } else {
            toast.error(result.message || 'Failed to load candidate details');
        }
        setLoadingApplication(false);
    };

    const loadActiveJobs = async () => {
        setLoadingJobs(true);
        const result = await hiringService.getAllJobs();
        if (result.success) {
            const active = (result.data || []).filter(j => j.isActive);
            setActiveJobs(active);
            if (active.length > 0 && !applicationId) setSelectedJobId(active[0].id);
        }
        setLoadingJobs(false);
    };

    const loadCandidates = async (jobId) => {
        setLoadingCandidates(true);
        const [appsResult, interviewsResult] = await Promise.all([
            hiringService.getApplicationsByJobId(jobId),
            hiringService.getAllInterviews(),
        ]);

        if (appsResult.success) {
            const postInterviewStatuses = new Set([
                'selected',
                'offer_sent',
                'offer_accepted',
                'offer_declined',
                'onboarding_started',
                'onboarded',
                'employee_created',
                'rejected',
            ]);

            const selectedApplicationIds = new Set(
                (interviewsResult.success ? interviewsResult.data : [])
                    .filter((interview) => String(interview.status || '').toLowerCase().includes('selected'))
                    .map((interview) => interview.jobApplicationId)
                    .filter(Boolean),
            );

            const eligible = (appsResult.data || []).filter((app) => {
                const status = String(app.status || '').toLowerCase();
                if (postInterviewStatuses.has(status)) return false;
                if (selectedApplicationIds.has(app.id)) return false;
                return true;
            });

            setCandidates(eligible);

            if (selectedCandidateId && !eligible.some((app) => app.id === selectedCandidateId)) {
                setSelectedCandidateId(null);
                setExistingResumeUrl('');
                setFormData((prev) => ({
                    ...prev,
                    _appId: undefined,
                    name: '',
                    email: '',
                    phone: '',
                    experience: '',
                }));
            }
        }
        setLoadingCandidates(false);
    };

    const handleCandidateSelect = (e) => {
        const id = Number(e.target.value);
        setSelectedCandidateId(id || null);
        const app = candidates.find(c => c.id === id);
        if (app) {
            setExistingResumeUrl(app.resume || '');
            setFormData(prev => ({
                ...prev,
                _appId: id,
                name: app.applicantName || '',
                email: app.applicantEmail || '',
                phone: app.applicantPhone || '',
                experience: app.applicantExperience || '',
            }));
        } else {
            setExistingResumeUrl('');
            setFormData(prev => ({
                ...prev,
                _appId: undefined,
                name: '',
                email: '',
                phone: '',
                experience: '',
            }));
        }
    };

    const handleJobChange = (e) => {
        const jobId = Number(e.target.value);
        setSelectedJobId(jobId);
        setSelectedCandidateId(null);
        setExistingResumeUrl('');
        setFormData(prev => ({
            ...prev,
            _appId: undefined,
            name: '',
            email: '',
            phone: '',
            experience: '',
        }));
    };

    const handlePreviewExistingResume = async () => {
        if (!existingResumeUrl) {
            toast.error('No resume available for preview');
            return;
        }
        const proxyUrl = `${window.location.origin}/api/upload/blob?url=${encodeURIComponent(existingResumeUrl)}`;
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(proxyUrl, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            if (!response.ok) throw new Error('Failed to fetch resume');
            const blob = await response.blob();
            window.open(URL.createObjectURL(blob), '_blank');
        } catch {
            toast.error('Unable to preview resume');
        }
    };

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

    const [resumeFile, setResumeFile] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        const { name, email, phone, experience, date, time, panel } = formData;
        if (!name || !email || !phone || !experience || !date || !time || !panel) {
            toast.error('Please fill in all candidate and interview details.');
            return;
        }
        setSubmitting(true);
        const loadingToast = toast.loading('Scheduling interview...');
        
        let resumeUrl = null;
        if (resumeFile) {
            const uploadResult = await hiringService.uploadFile(resumeFile);
            if (uploadResult.success && uploadResult.files?.length > 0) {
                resumeUrl = uploadResult.files[0].url;
            }
        }

        const selectedAppId = formData._appId || (applicationId ? Number(applicationId) : undefined);
        const interviewPayload = {
            jobApplicationId: selectedAppId,
            interviewerId: panel === 'Tech' ? 1 : 1,
            scheduledAt: new Date(`${date}T${time}`).toISOString(),
            instruction: `${interviewType} - ${interviewMode}`,
            meetingLink: '',
            status: 'scheduled',
            interviewType,
            interviewMode,
            panel,
            candidateEmail: email,
        };

        const result = await hiringService.createInterview(interviewPayload);
        toast.dismiss(loadingToast);
        if (result.success) {
            setIsReadMode(true);
            toast.success('Interview scheduled successfully!');
        } else {
            toast.error(result.message);
        }
        setSubmitting(false);
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
        <div className="bg-white px-4 sm:px-4 md:px-6 py-4 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-9rem)] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-10rem)] xl:h-[calc(100vh-11rem)] flex flex-col font-sans border border-[#D9D9D9] overflow-hidden" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
            <style>{`
                input[type="date"]::-webkit-calendar-picker-indicator,
                input[type="time"]::-webkit-calendar-picker-indicator {
                    display: none !important;
                    -webkit-appearance: none;
                }
            `}</style>
            
            {/* Header shrink wrapper */}
            <div className="shrink-0 mb-4">
                {/* Breadcrumb + Title */}
                <div>
                    <div className="flex items-center text-sm text-[#7D1EDB] mb-2">
                        <div className="flex items-center gap-3" onClick={() => navigate('/hrms')}>
                            <ArrowLeft size={14} className="text-gray-900 cursor-pointer" />
                            <span className="cursor-pointer hover:text-purple-500">HRMS Dashboard</span>
                        </div>
                        <ChevronRight size={16} className="mx-1 text-[#9CA3AF]" />
                        <span className="text-[#667085] text-[14px] font-base">Schedule Interview</span>
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
                            Schedule Interview
                        </h1>
                        <button
                            style={{
                                backgroundColor: '#7D1EDB',
                                color: '#FFFFFF',
                                fontWeight: 600,
                                padding: '8px 32px',
                                borderRadius: '999px',
                                border: 'none',
                                cursor: submitting || isReadMode ? 'default' : 'pointer',
                                fontSize: '16px',
                                fontFamily: 'Poppins, sans-serif',
                                opacity: submitting || isReadMode ? 0.7 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                            onClick={handleSave}
                            disabled={submitting || isReadMode}
                        >
                            {submitting && <Spinner size={16} color="#FFF" />}
                            {submitting ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="custom-scrollbar pr-2 pb-4" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* ── Card 0: Job Opening & Candidate Selection ── */}
                <div style={{ ...card, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0, fontFamily: '"Nunito Sans", sans-serif' }}>
                        Select Job Opening & Candidate
                    </h3>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <div style={{ flex: '1', minWidth: '200px' }}>
                            <span style={label}>Job Opening</span>
                            <select
                                value={selectedJobId || ''}
                                onChange={handleJobChange}
                                disabled={loadingJobs || loadingApplication || isReadMode}
                                style={{
                                    ...input,
                                    width: '100%',
                                    backgroundColor: '#F5F5F5',
                                    border: '1px solid #D9D9D9',
                                    borderRadius: '8px',
                                    padding: '8px 36px 8px 16px',
                                    appearance: 'none',
                                    cursor: 'pointer',
                                    opacity: loadingJobs ? 0.5 : 1,
                                }}
                            >
                                {loadingJobs ? (
                                    <option>Loading...</option>
                                ) : (
                                    activeJobs.map(job => (
                                        <option key={job.id} value={job.id}>{job.title}</option>
                                    ))
                                )}
                            </select>
                        </div>
                        <div style={{ flex: '1', minWidth: '200px' }}>
                            <span style={label}>Candidate</span>
                            <select
                                value={selectedCandidateId || ''}
                                onChange={handleCandidateSelect}
                                disabled={loadingCandidates || loadingApplication || isReadMode || !selectedJobId}
                                style={{
                                    ...input,
                                    width: '100%',
                                    backgroundColor: '#F5F5F5',
                                    border: '1px solid #D9D9D9',
                                    borderRadius: '8px',
                                    padding: '8px 36px 8px 16px',
                                    appearance: 'none',
                                    cursor: 'pointer',
                                    opacity: loadingCandidates ? 0.5 : 1,
                                }}
                            >
                                <option value="">Select candidate</option>
                                {candidates.map(app => (
                                    <option key={app.id} value={app.id}>{app.applicantName}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* ── Card 1: Candidate Information ── */}
                <style>{`
                    .autofill-grey:-webkit-autofill,
                    .autofill-grey:-webkit-autofill:hover, 
                    .autofill-grey:-webkit-autofill:focus, 
                    .autofill-grey:-webkit-autofill:active {
                        -webkit-box-shadow: 0 0 0 30px #F5F5F5 inset !important;
                        -webkit-text-fill-color: #111827 !important;
                        transition: background-color 5000s ease-in-out 0s;
                    }
                `}</style>
                <div style={{ ...card, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0, fontFamily: '"Nunito Sans", sans-serif' }}>
                        Candidate Information
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                        <div>
                            <span style={label}>Name</span>
                            <input className="autofill-grey" type="text" name="name" placeholder="Enter name" style={{ ...input, backgroundColor: '#F5F5F5', border: '1px solid #D9D9D9' }} value={formData.name} onChange={handleInputChange} disabled={isReadMode} />
                        </div>
                        <div>
                            <span style={label}>Email</span>
                            <input className="autofill-grey" type="email" name="email" placeholder="Enter mail ID" style={{ ...input, backgroundColor: '#F5F5F5', border: '1px solid #D9D9D9' }} value={formData.email} onChange={handleInputChange} disabled={isReadMode} />
                        </div>
                        <div>
                            <span style={label}>Phone number</span>
                            <input className="autofill-grey" type="text" name="phone" placeholder="Enter phone number" style={{ ...input, backgroundColor: '#F5F5F5', border: '1px solid #D9D9D9' }} value={formData.phone} onChange={handleInputChange} disabled={isReadMode} />
                        </div>
                        <div>
                            <span style={label}>Experience</span>
                            <input className="autofill-grey" type="text" name="experience" placeholder="Enter experience" style={{ ...input, backgroundColor: '#F5F5F5', border: '1px solid #D9D9D9' }} value={formData.experience} onChange={handleInputChange} disabled={isReadMode} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {!resumeFile && existingResumeUrl ? (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 16px',
                                backgroundColor: '#F5EEFB',
                                borderRadius: '999px',
                                border: '1px solid #7D1EDB',
                            }}>
                                <span
                                    style={{
                                        fontSize: '14px',
                                        color: '#7D1EDB',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        maxWidth: '200px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        fontFamily: 'Poppins, sans-serif',
                                    }}
                                    onClick={handlePreviewExistingResume}
                                    title="Click to view resume"
                                >
                                    Candidate Resume
                                </span>
                                <X
                                    size={16}
                                    style={{ color: '#7D1EDB', cursor: 'pointer', marginLeft: '4px' }}
                                    onClick={() => setExistingResumeUrl('')}
                                />
                            </div>
                        ) : !resumeFile ? (
                            <>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setResumeFile(e.target.files[0]);
                                        }
                                    }}
                                />
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
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    Add Resume
                                </button>
                            </>
                        ) : (
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '8px', 
                                padding: '8px 16px', 
                                backgroundColor: '#F5EEFB', 
                                borderRadius: '999px', 
                                border: '1px solid #7D1EDB' 
                            }}>
                                <span 
                                    style={{ 
                                        fontSize: '14px', 
                                        color: '#7D1EDB', 
                                        fontWeight: 500, 
                                        cursor: 'pointer',
                                        maxWidth: '200px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        fontFamily: 'Poppins, sans-serif'
                                    }}
                                    onClick={() => {
                                        const fileURL = URL.createObjectURL(resumeFile);
                                        window.open(fileURL, '_blank');
                                    }}
                                    title="Click to view resume"
                                >
                                    {resumeFile.name}
                                </span>
                                <X 
                                    size={16} 
                                    style={{ color: '#7D1EDB', cursor: 'pointer', marginLeft: '4px' }} 
                                    onClick={() => setResumeFile(null)}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Card 2: Interview Type ── */}
                <div style={{ ...card, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '520px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0, fontFamily: '"Nunito Sans", sans-serif' }}>
                        Interview Type
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                        {isReadMode ? (
                            <RadioOption name="interviewType" value={interviewType} current={interviewType} onChange={setInterviewType} label={interviewType} />
                        ) : (
                            <>
                                <RadioOption name="interviewType" value="Round 1(Technical)" current={interviewType} onChange={setInterviewType} label="Round 1(Technical)" />
                                <RadioOption name="interviewType" value="Round 2(Managerial)" current={interviewType} onChange={setInterviewType} label="Round 2(Managerial)" />
                                <RadioOption name="interviewType" value="HR Round" current={interviewType} onChange={setInterviewType} label="HR Round" />
                            </>
                        )}
                    </div>
                </div>

                {/* ── Card 3: Interview Mode ── */}
                <div style={{ ...card, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '520px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0, fontFamily: '"Nunito Sans", sans-serif' }}>
                        Interview Mode
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
                        {isReadMode ? (
                            <RadioOption name="interviewMode" value={interviewMode} current={interviewMode} onChange={setInterviewMode} label={interviewMode} />
                        ) : (
                            <>
                                <RadioOption name="interviewMode" value="Online" current={interviewMode} onChange={setInterviewMode} label="Online" />
                                <RadioOption name="interviewMode" value="Offline" current={interviewMode} onChange={setInterviewMode} label="Offline" />
                                <RadioOption name="interviewMode" value="Hybrid" current={interviewMode} onChange={setInterviewMode} label="Hybrid" />
                            </>
                        )}
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
                                        backgroundColor: '#F5F5F5',
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
                                        backgroundColor: '#F5F5F5',
                                        border: '1px solid #D9D9D9',
                                        borderRadius: '8px',
                                        cursor: isReadMode ? 'default' : 'pointer',
                                    }}
                                    value={formData.time}
                                    onChange={handleInputChange}
                                    disabled={isReadMode}
                                    onClick={() => !isReadMode && timeInputRef.current?.showPicker?.()}
                                />
                                {isReadMode ? (
                                    <ChevronDown 
                                        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} 
                                        size={18} 
                                    />
                                ) : (
                                    <Clock 
                                        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', cursor: 'pointer' }} 
                                        size={15} 
                                        onClick={() => timeInputRef.current?.showPicker?.()}
                                    />
                                )}
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
                            {isReadMode ? (
                                <input
                                    type="text"
                                    readOnly
                                    value={formData.panel || "HR"}
                                    style={{
                                        ...input,
                                        width: '303px',
                                        height: '40px',
                                        backgroundColor: '#F5F5F5',
                                        border: '1px solid #D9D9D9',
                                        borderRadius: '8px',
                                        padding: '0 16px',
                                        cursor: 'default',
                                    }}
                                />
                            ) : (
                                <select
                                    name="panel"
                                    style={{
                                        ...input,
                                        width: '303px',
                                        height: '40px',
                                        minWidth: '120px',
                                        backgroundColor: '#F5F5F5',
                                        border: '1px solid #D9D9D9',
                                        borderRadius: '8px',
                                        padding: '8px 36px 8px 16px',
                                        appearance: 'none',
                                        cursor: 'pointer',
                                        opacity: 1,
                                    }}
                                    value={formData.panel}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select interview panel</option>
                                    <option value="HR">HR Panel</option>
                                    <option value="Tech">Tech Panel</option>
                                </select>
                            )}
                            {!isReadMode && <ChevronDown style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} size={16} />}
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
                        <p style={{ margin: 0 }}><span style={{ color: '#000000', opacity: 0.7 }}>Date:</span> <strong>{formData.date || "10/01/2026"}</strong></p>
                        <p style={{ margin: 0 }}><span style={{ color: '#000000', opacity: 0.7 }}>Time:</span> <strong>{formData.time || "10:00 AM"}</strong></p>
                        <p style={{ margin: 0 }}><span style={{ color: '#000000', opacity: 0.7 }}>Interview Type:</span> <strong>{interviewType}</strong></p>
                        <p style={{ margin: 0 }}><span style={{ color: '#000000', opacity: 0.7 }}>Interview Panel:</span> <strong>{formData.panel === 'Tech' ? 'Tech Panel' : formData.panel ? 'HR Panel' : 'HR Panel'}</strong></p>
                        <p style={{ margin: 0 }}><span style={{ color: '#000000', opacity: 0.7 }}>Mode:</span> <strong>{interviewMode}</strong></p>
                        <p style={{ margin: 0 }}>
                            <span style={{ color: '#000000', opacity: 0.7 }}>Meeting Link: </span>
                            <strong>The meet link will be shared soon.</strong>
                        </p>
                        <p style={{ margin: 0 }}><span style={{ color: '#000000', opacity: 0.7 }}>Instructions:</span> <strong>Please be on time</strong></p>
                    </div>
                </div>

            </div>
        </div>
    );
};


export default ScheduleInterview;
