import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ChevronRight, ArrowLeft, Briefcase, Mail, Phone, FileText, ChevronDown, ThumbsDown, ThumbsUp, ArrowRight, Copy, Check, X } from 'lucide-react';
import Spinner from '../../../../components/ui/Spinner';
import FilterDropdown from '../../../../components/ui/FilterDropdown';
import { getSecureFileUrl, hiringService } from '../../../../service';

const NewHiring = () => {
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [candidateList, setCandidateList] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 375);
    const [activeJobs, setActiveJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingActiveJobs, setLoadingActiveJobs] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showResumeModal, setShowResumeModal] = useState(false);
    const [resumeBlobUrl, setResumeBlobUrl] = useState('');
    const [resumeLoading, setResumeLoading] = useState(false);

    // Add candidate modal state
    const [candidateForm, setCandidateForm] = useState({
        name: '',
        email: '',
        phone: '',
        experience: '',
        skills: '',
        source: 'Manual Upload',
    });
    const [resumeFile, setResumeFile] = useState(null);

    // Filter states
    const [statusFilter, setStatusFilter] = useState('');
    const [experienceFilter, setExperienceFilter] = useState('');
    const [skillFilter, setSkillFilter] = useState('');
    const [sourceFilter, setSourceFilter] = useState('');

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 375);
        window.addEventListener('resize', handleResize);
        loadActiveJobs();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const loadActiveJobs = async () => {
        setLoadingActiveJobs(true);
        const result = await hiringService.getAllJobs();
        if (result.success) {
            const active = (result.data || []).filter(j => j.isActive);
            setActiveJobs(active);
            if (active.length > 0) {
                setSelectedJobId(active[0].id);
                loadCandidates(active[0].id);
            }
        }
        setLoadingActiveJobs(false);
    };

    const loadCandidates = async (jobId) => {
        setLoading(true);
        const result = await hiringService.getApplicationsByJobId(jobId);
        if (result.success) {
            const mapped = (result.data || []).map((app, idx) => ({
                id: app.id,
                srNo: String(idx + 1).padStart(2, '0'),
                name: app.applicantName,
                experience: app.applicantExperience || 'N/A',
                skills: app.applicantSkills || 'N/A',
                source: app.coverLetter || 'Website',
                status: app.status.charAt(0).toUpperCase() + app.status.slice(1),
                email: app.applicantEmail || '',
                phone: app.applicantPhone || '',
                resume: app.resume,
            }));
            setCandidateList(mapped);
            setSelectedCandidate(null);
            setSelectedIds([]);
        }
        setLoading(false);
    };

    const handleJobChange = (jobId) => {
        setSelectedJobId(jobId);
        setSelectedIds([]);
        setSelectedCandidate(null);
        loadCandidates(jobId);
    };

    const filteredCandidates = candidateList.filter(candidate => {
        const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !statusFilter || candidate.status === statusFilter;
        const matchesExperience = !experienceFilter || candidate.experience === experienceFilter;
        const matchesSkill = !skillFilter || candidate.skills === skillFilter;
        const matchesSource = !sourceFilter || candidate.source === sourceFilter;
        return matchesSearch && matchesStatus && matchesExperience && matchesSkill && matchesSource;
    });

    const handleAddCandidate = async () => {
        if (!selectedJobId) {
            toast.error('Please select a job opening first');
            return;
        }
        if (!candidateForm.name.trim()) {
            toast.error('Please enter candidate name');
            return;
        }
        if (candidateForm.phone && !/^\d{10}$/.test(candidateForm.phone)) {
            toast.error('Enter a valid 10-digit phone number');
            return;
        }
        if (!resumeFile) {
            toast.error('Please upload a resume');
            return;
        }
        setUploading(true);
        const loadingToast = toast.loading('Adding candidate...');

        const uploadResult = await hiringService.uploadFile(resumeFile);
        if (!uploadResult.success) {
            toast.dismiss(loadingToast);
            setUploading(false);
            toast.error('Failed to upload resume');
            return;
        }
        const resumeUrl = uploadResult.files[0].url;
        const appData = {
            applicantName: candidateForm.name,
            applicantEmail: candidateForm.email,
            applicantPhone: candidateForm.phone,
            applicantExperience: candidateForm.experience,
            applicantSkills: candidateForm.skills,
            resume: resumeUrl,
            coverLetter: candidateForm.source,
        };
        const result = await hiringService.createApplication(selectedJobId, appData);
        toast.dismiss(loadingToast);
        if (result.success) {
            toast.success('Candidate added successfully!');
            setShowAddModal(false);
            setCandidateForm({ name: '', email: '', phone: '', experience: '', skills: '', source: 'Manual Upload' });
            setResumeFile(null);
            loadCandidates(selectedJobId);
        } else {
            toast.error(result.message);
        }
        setUploading(false);
    };

    const handleSelectAll = () => {
        if (selectedIds.length === filteredCandidates.length && filteredCandidates.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredCandidates.map(c => c.id));
        }
    };

    const toggleSelection = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
        );
    };

    const updateCandidateStatus = async (id, status) => {
        setUpdatingStatus(id);
        const result = await hiringService.updateApplicationStatus(id, status);
        if (result.success) {
            toast.success(`Candidate ${status === 'shortlisted' ? 'shortlisted' : 'rejected'} successfully`);
            loadCandidates(selectedJobId);
        } else {
            toast.error(result.message);
        }
        setUpdatingStatus(null);
    };

    const handleCandidateClick = (candidate) => {
        setSelectedCandidate(prev => prev?.id === candidate.id ? null : candidate);
    };

    const handlePreviewResume = async () => {
        if (!selectedCandidate?.resume) {
            toast.error('No resume available for preview');
            return;
        }
        const proxyUrl = getSecureFileUrl(selectedCandidate.resume);
        setShowResumeModal(true);
        setResumeLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(proxyUrl, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            if (!response.ok) throw new Error('Failed to fetch');
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setResumeBlobUrl(url);
        } catch {
            setResumeBlobUrl('');
            toast.error('Unable to preview resume');
        }
        setResumeLoading(false);
    };

    useEffect(() => {
        return () => {
            if (resumeBlobUrl) URL.revokeObjectURL(resumeBlobUrl);
        };
    }, [resumeBlobUrl]);

    return (
        <div className="bg-white px-4 sm:px-4 md:px-6 py-4 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-9rem)] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-10rem)] xl:h-[calc(100vh-11rem)] flex flex-col font-sans border border-[#D9D9D9] overflow-hidden" style={{ fontFamily: 'Poppins, sans-serif' }}>
            <div className="shrink-0 mb-3">
            
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-[#7D1EDB] mb-2">
                <div className="flex items-center gap-3" onClick={() => navigate('/hrms')}>
                    <ArrowLeft size={14} className="text-gray-900 cursor-pointer" />
                    <span className="cursor-pointer hover:text-purple-500">HRMS Dashboard</span>
                </div>
                <ChevronRight size={16} className="mx-1" />
                <span className="text-[#667085] text-[14px] font-base">New Hiring</span>
            </div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-4">
                <h1 className="text-xl font-semibold text-gray-900">New Hiring</h1>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <button 
                        className="px-6 py-2.5 bg-[#7D1EDB] text-white font-medium rounded-full hover:bg-purple-700 transition-colors shadow-sm w-full sm:w-auto flex items-center justify-center gap-2"
                        onClick={() => setShowAddModal(true)}
                    >
                        Add Candidate
                    </button>
                </div>
            </div>
        </div>

        <div className="custom-scrollbar pr-2 pb-4" style={{ flex: 1, overflowY: 'auto' }}>

            <div className="flex flex-col lg:flex-row gap-6">
                
                {/* Left Content Area */}
                <div className="flex-1 space-y-6 min-w-0">
                    
                    {/* Active Job Openings Banner */}
                    {activeJobs.length === 0 ? (
                    <div className="border border-dashed border-gray-300 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between bg-gray-50/50">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" stroke="#6B7280" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="#6B7280" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M2 12h20" stroke="#6B7280" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
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
                            onClick={() => navigate('/hrms/hiring-and-recruitment/job-opening/new')}
                            className="mt-4 sm:mt-0 text-[#2176FF] font-medium flex items-center gap-1"
                        >
                            + Create job opening
                        </button>
                    </div>
                    ) : (
                    <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
                        <div className="flex items-center gap-3">
                            <Briefcase size={20} className="text-purple-600" />
                            <span className="text-sm font-medium text-gray-700">Select Job Opening:</span>
                            <select
                                value={selectedJobId || ''}
                                onChange={(e) => handleJobChange(Number(e.target.value))}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                            >
                                {activeJobs.map(job => (
                                    <option key={job.id} value={job.id}>{job.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    )}

                        {/* Resume List Section */}
                        <div>
                            <h3 className="text-gray-900 font-medium mb-4">Resume List</h3>
                            
                            {/* Filters */}
                            <div className="flex flex-wrap gap-2 mb-6 items-center">
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        placeholder="Search by name..." 
                                        style={{
                                            width: '167px',
                                            height: '48px',
                                            borderRadius: '32px',
                                            border: '1px solid #EEECFF',
                                            backgroundColor: '#F9FAFB',
                                            padding: '2px 16px 2px 24px',
                                            outline: 'none',
                                            boxSizing: 'border-box',
                                            fontFamily: 'Poppins, sans-serif',
                                            fontSize: '13px',
                                            color: '#334155',
                                            textOverflow: 'ellipsis'
                                        }}
                                        className="placeholder-[#9CA3AF] transition-colors focus:border-[#7D1EDB]"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                                    <FilterDropdown
                                        label="Status"
                                        options={['Shortlisted', 'Rejected', 'New']}
                                        value={statusFilter}
                                        onChange={setStatusFilter}
                                        minWidth="130px"
                                    />
                                    <FilterDropdown
                                        label="Experience"
                                        options={[...new Set(candidateList.map(c => c.experience))]}
                                        value={experienceFilter}
                                        onChange={setExperienceFilter}
                                        minWidth="130px"
                                    />
                                    <FilterDropdown
                                        label="Skills"
                                        options={[...new Set(candidateList.map(c => c.skills))]}
                                        value={skillFilter}
                                        onChange={setSkillFilter}
                                        minWidth="130px"
                                    />
                                    <FilterDropdown
                                        label="Source"
                                        options={[...new Set(candidateList.map(c => c.source))]}
                                        value={sourceFilter}
                                        onChange={setSourceFilter}
                                        minWidth="130px"
                                    />
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto border border-gray-200 rounded-xl">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="text-gray-500 border-b border-gray-200">
                                            <th className="px-4 py-4 font-medium w-12">
                                                <div 
                                                    className="cursor-pointer flex items-center justify-center border-2 border-[#7D1EDB] rounded-[4px] transition-colors"
                                                    style={{ 
                                                        width: '18px', 
                                                        height: '18px', 
                                                        backgroundColor: selectedIds.length === filteredCandidates.length && filteredCandidates.length > 0 ? '#7D1EDB' : 'transparent' 
                                                    }}
                                                    onClick={handleSelectAll}
                                                >
                                                    {(selectedIds.length === filteredCandidates.length && filteredCandidates.length > 0) && <Check size={12} color="white" />}
                                                </div>
                                            </th>
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
                                        {loading ? (
                                            Array.from({ length: 4 }).map((_, i) => (
                                                <tr key={i} className="border-b border-gray-100">
                                                    {Array.from({ length: 8 }).map((_, j) => (
                                                        <td key={j} className="px-4 py-4">
                                                            <div className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: j === 1 ? '40px' : j === 2 ? '120px' : '80px' }} />
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))
                                        ) : filteredCandidates.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <FileText size={28} className="text-gray-300" />
                                                        <p className="text-sm">No candidates found</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredCandidates.map((candidate) => (
                                                <tr
                                                    key={candidate.id}
                                                    className={`border-b border-gray-100 last:border-0 cursor-pointer transition-colors ${
                                                        selectedCandidate?.id === candidate.id ? 'bg-purple-50' : 'hover:bg-gray-50'
                                                    }`}
                                                    onClick={() => handleCandidateClick(candidate)}
                                                >
                                                    <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                                                        <div 
                                                            className="cursor-pointer flex items-center justify-center border-2 border-[#7D1EDB] rounded-[4px] transition-colors"
                                                            style={{ 
                                                                width: '18px', 
                                                                height: '18px', 
                                                                backgroundColor: selectedIds.includes(candidate.id) ? '#7D1EDB' : 'transparent' 
                                                            }}
                                                            onClick={() => toggleSelection(candidate.id)}
                                                        >
                                                            {selectedIds.includes(candidate.id) && <Check size={12} color="white" />}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-gray-700">{candidate.srNo}</td>
                                                    <td
                                                        className="px-4 py-4"
                                                        style={{ color: '#7268FF', fontWeight: 500, fontSize: '16px', lineHeight: '140%', fontFamily: 'Poppins, sans-serif' }}
                                                    >{candidate.name}</td>
                                                    <td className="px-4 py-4 text-gray-700">{candidate.experience}</td>
                                                    <td className="px-4 py-4 text-gray-700">{candidate.skills}</td>
                                                    <td className="px-4 py-4 text-gray-700">{candidate.source}</td>
                                                    <td className="px-4 py-4">
                                                        <span 
                                                            className="inline-flex items-center justify-center rounded-full font-medium"
                                                            style={{ 
                                                                backgroundColor: candidate.status === 'Rejected' ? 'rgba(255, 59, 48, 0.1)' : 'rgba(118, 219, 30, 0.2)',
                                                                color: candidate.status === 'Rejected' ? '#FF3B30' : '#34C759', 
                                                                padding: '4px 12px',
                                                                fontSize: '14px',
                                                                lineHeight: '20px'
                                                            }}
                                                        >
                                                            {candidate.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="relative inline-block" style={{ width: '18px', height: '20px' }}>
                                                            <Copy 
                                                                className="absolute cursor-pointer hover:text-[#7D1EDB] transition-colors"
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
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                </div>

                {/* Right Panel - Candidate Details */}
                <div className="w-full lg:w-[300px] xl:w-[340px] border border-gray-200 rounded-xl p-6 bg-white shrink-0 overflow-hidden">
                    {selectedCandidate ? (
                        <>
                    <h2 className="text-xl font-semibold text-gray-900 mb-1 truncate">{selectedCandidate.name}</h2>
                    <p className="text-sm text-gray-600 mb-6">Candidate</p>

                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div 
                            style={{ 
                                flex: 1, 
                                height: '88.56px', 
                                background: '#F0F0F0', 
                                borderRadius: '5px',
                                padding: '14px 9px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                                opacity: 1
                            }}
                        >
                            <div className="flex items-center gap-2 text-gray-500">
                                <Briefcase size={14} />
                                <span style={{ fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600, fontSize: '13px', color: '#000000' }}>Experience</span>
                            </div>
                            <p className="font-semibold text-gray-900 text-sm">{selectedCandidate.experience}</p>
                        </div>
                        <div 
                            style={{ 
                                flex: 1, 
                                height: '88.56px', 
                                background: '#F0F0F0', 
                                borderRadius: '5px',
                                padding: '14px 9px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                                opacity: 1
                            }}
                        >
                            <div className="flex items-center gap-2 text-gray-500">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                <span style={{ fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600, fontSize: '13px', color: '#000000' }}>Status</span>
                            </div>
                            <p className="font-semibold text-gray-900 text-sm truncate">{selectedCandidate.status}</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Contact Information</h4>
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Mail size={16} className="text-gray-400" />
                                <span className="truncate">{selectedCandidate.email || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Phone size={16} className="text-gray-400" />
                                <span className="truncate">{selectedCandidate.phone || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    <button 
                        className="w-full py-2.5 border border-[#7D1EDB] text-[#7D1EDB] font-medium rounded-full mb-6 hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
                        onClick={handlePreviewResume}
                    >
                        <FileText size={16} />
                        Preview Resume
                        <ChevronDown size={16} />
                    </button>

                    {!['shortlisted', 'rejected'].includes(String(selectedCandidate.status || '').toLowerCase()) && (
                        <div className="flex gap-3 mb-4">
                            <button 
                                disabled={updatingStatus === selectedCandidate.id}
                                className="flex-1 py-2.5 bg-[#FF3B30] text-white font-medium rounded-full hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                onClick={() => updateCandidateStatus(selectedCandidate.id, 'rejected')}
                            >
                                {updatingStatus === selectedCandidate.id ? <Spinner size={16} color="#fff" /> : <ThumbsDown size={16} />}
                                Reject
                            </button>
                            <button 
                                disabled={updatingStatus === selectedCandidate.id}
                                className="flex-1 py-2.5 bg-[#7D1EDB] text-white font-medium rounded-full hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                onClick={() => updateCandidateStatus(selectedCandidate.id, 'shortlisted')}
                            >
                                {updatingStatus === selectedCandidate.id ? <Spinner size={16} color="#fff" /> : <ThumbsUp size={16} />}
                                Shortlisted
                            </button>
                        </div>
                    )}

                    <button 
                        className="w-full py-2.5 border border-[#7D1EDB] text-[#7D1EDB] font-medium rounded-full hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
                        onClick={() => navigate(`/hrms/hiring-and-recruitment/new-hiring/ats-screening?applicationId=${selectedCandidate.id}`)}
                    >
                        Move to ATS screening
                        <ArrowRight size={16} />
                    </button>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <p className="text-sm">Select a candidate</p>
                        </div>
                    )}
                </div>

            </div>

            </div>

            {/* Add Candidate Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-5 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Add Candidate</h2>
                            <button
                                onClick={() => { setShowAddModal(false); setResumeFile(null); }}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Candidate Name *</label>
                                <input
                                    type="text"
                                    placeholder="Enter candidate name"
                                    value={candidateForm.name}
                                    onChange={(e) => setCandidateForm(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        placeholder="Enter email"
                                        value={candidateForm.email}
                                        onChange={(e) => setCandidateForm(prev => ({ ...prev, email: e.target.value }))}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        inputMode="numeric"
                                        maxLength={10}
                                        pattern="[0-9]{10}"
                                        placeholder="10-digit phone number"
                                        value={candidateForm.phone}
                                        onChange={(e) => setCandidateForm(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 3 years"
                                        value={candidateForm.experience}
                                        onChange={(e) => setCandidateForm(prev => ({ ...prev, experience: e.target.value }))}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. React, Node.js"
                                        value={candidateForm.skills}
                                        onChange={(e) => setCandidateForm(prev => ({ ...prev, skills: e.target.value }))}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                                <input
                                    type="text"
                                    placeholder="e.g. LinkedIn, Website"
                                    value={candidateForm.source}
                                    onChange={(e) => setCandidateForm(prev => ({ ...prev, source: e.target.value }))}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Resume *</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                    {resumeFile ? (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-700 truncate mr-2">{resumeFile.name}</span>
                                            <button
                                                onClick={() => setResumeFile(null)}
                                                className="text-red-500 hover:text-red-700 text-sm font-medium shrink-0"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="text-sm text-gray-500 mb-2">Drag & drop or click to upload resume</p>
                                            <button
                                                onClick={() => document.getElementById('modal-resume-upload').click()}
                                                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                                            >
                                                Browse Files
                                            </button>
                                        </div>
                                    )}
                                    <input
                                        id="modal-resume-upload"
                                        type="file"
                                        className="hidden"
                                        accept=".pdf,.doc,.docx"
                                        onChange={(e) => setResumeFile(e.target.files[0])}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 p-5 border-t border-gray-200">
                            <button
                                onClick={() => { setShowAddModal(false); setResumeFile(null); }}
                                className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={uploading}
                                onClick={handleAddCandidate}
                                className="px-6 py-2.5 bg-[#7D1EDB] text-white font-medium rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center gap-2 disabled:opacity-50"
                            >
                                {uploading ? <Spinner size={16} color="#fff" /> : null}
                                {uploading ? 'Adding...' : 'Add Candidate'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Resume Preview Modal */}
            {showResumeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl w-full max-w-4xl mx-4 h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 shrink-0">
                            <h2 className="text-lg font-semibold text-gray-900">Resume Preview</h2>
                            <button
                                onClick={() => { setShowResumeModal(false); if (resumeBlobUrl) URL.revokeObjectURL(resumeBlobUrl); setResumeBlobUrl(''); }}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>
                        <div className="flex-1 p-4">
                            {resumeLoading ? (
                                <div className="flex items-center justify-center h-full">
                                    <Spinner size={32} color="#7D1EDB" />
                                </div>
                            ) : resumeBlobUrl ? (
                                <object
                                    data={resumeBlobUrl}
                                    className="w-full h-full rounded-lg border border-gray-200"
                                    type="application/pdf"
                                >
                                    <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
                                        <FileText size={48} className="text-gray-300" />
                                        <p className="text-sm">Preview not available</p>
                                    </div>
                                </object>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
                                    <FileText size={48} className="text-gray-300" />
                                    <p className="text-sm">Could not load resume</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewHiring;
