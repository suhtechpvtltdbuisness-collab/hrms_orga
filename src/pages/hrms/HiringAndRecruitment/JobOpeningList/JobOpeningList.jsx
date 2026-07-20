import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, BriefcaseBusiness, ChevronRight, MapPin, Plus, Search, Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Spinner from '../../../../components/ui/Spinner';
import { hiringService } from '../../../../service';

const emptyApplication = { name: '', email: '', phone: '', experience: '', skills: '', coverLetter: '' };

const JobOpeningList = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedJob, setSelectedJob] = useState(null);
    const [showApply, setShowApply] = useState(false);
    const [application, setApplication] = useState(emptyApplication);
    const [resume, setResume] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => { loadJobs(); }, []);

    const loadJobs = async () => {
        setLoading(true);
        const result = await hiringService.getAllJobs();
        if (result.success) setJobs(result.data || []);
        else toast.error(result.message || 'Failed to load job openings');
        setLoading(false);
    };

    const filteredJobs = useMemo(() => jobs.filter(job => {
        const text = `${job.title || ''} ${job.department?.name || job.departmentName || ''} ${job.location || ''}`.toLowerCase();
        return text.includes(search.toLowerCase());
    }), [jobs, search]);

    const openApplication = (job = selectedJob) => {
        if (!job) {
            toast.error('Please select a job opening first');
            return;
        }
        setSelectedJob(job);
        setShowApply(true);
    };

    const submitApplication = async (event) => {
        event.preventDefault();
        if (!application.name.trim() || !application.email.trim() || !resume) {
            toast.error('Name, email and resume are required');
            return;
        }
        setSubmitting(true);
        const uploadResult = await hiringService.uploadFile(resume);
        if (!uploadResult.success || !uploadResult.files?.[0]?.url) {
            toast.error(uploadResult.message || 'Resume upload failed');
            setSubmitting(false);
            return;
        }
        const result = await hiringService.createApplication(selectedJob.id, {
            applicantName: application.name,
            applicantEmail: application.email,
            applicantPhone: application.phone,
            applicantExperience: application.experience,
            applicantSkills: application.skills,
            coverLetter: application.coverLetter,
            resume: uploadResult.files[0].url,
        });
        if (result.success) {
            toast.success('Application submitted successfully');
            setShowApply(false);
            setApplication(emptyApplication);
            setResume(null);
        } else toast.error(result.message || 'Application could not be submitted');
        setSubmitting(false);
    };

    return (
        <div className="bg-white px-4 sm:px-6 py-5 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] border border-[#D9D9D9] overflow-y-auto" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
            <div className="flex items-center text-sm text-[#7D1EDB] mb-3">
                <button className="flex items-center gap-3" onClick={() => navigate('/hrms')}><ArrowLeft size={15} className="text-gray-900" />HRMS Dashboard</button>
                <ChevronRight size={16} className="mx-1" /><span className="text-[#667085]">Job Openings</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div><h1 className="text-xl font-semibold text-gray-900">Job Openings</h1><p className="text-sm text-gray-500 mt-1">Select an opening from the list to apply.</p></div>
                <div className="flex gap-3">
                    <button onClick={() => navigate('/hrms/hiring-and-recruitment/job-opening/new')} className="px-5 py-2.5 border border-[#7D1EDB] text-[#7D1EDB] rounded-full font-medium flex items-center gap-2"><Plus size={17} />Add Job Opening</button>
                    <button onClick={() => openApplication()} className="px-6 py-2.5 bg-[#7D1EDB] text-white rounded-full font-medium hover:bg-purple-700">Apply</button>
                </div>
            </div>

            <div className="relative max-w-md mb-5">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search job title, department or location" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-200" />
            </div>

            {loading ? <div className="h-48 flex items-center justify-center"><Spinner size={28} /></div> : filteredJobs.length === 0 ? (
                <div className="border border-dashed border-gray-300 rounded-xl py-16 text-center"><BriefcaseBusiness className="mx-auto text-gray-400 mb-3" size={36} /><h2 className="font-semibold text-gray-800">No job openings found</h2><p className="text-sm text-gray-500 mt-1">Create a new opening to get started.</p></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredJobs.map(job => <button key={job.id} onClick={() => setSelectedJob(job)} onDoubleClick={() => openApplication(job)} className={`text-left border rounded-xl p-5 transition ${selectedJob?.id === job.id ? 'border-[#7D1EDB] ring-2 ring-purple-100' : 'border-gray-200 hover:border-purple-300'}`}>
                        <div className="flex justify-between gap-3"><h2 className="font-semibold text-gray-900 text-lg">{job.title}</h2><span className={`h-fit px-2.5 py-1 rounded-full text-xs ${job.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{job.isActive ? 'Active' : 'Closed'}</span></div>
                        <p className="text-sm text-gray-600 mt-2">{job.department?.name || job.departmentName || 'General'} · {job.employeeType?.replaceAll('_', ' ') || 'Full-time'}</p>
                        <div className="flex items-center text-sm text-gray-500 mt-4"><MapPin size={15} className="mr-1.5" />{job.location || 'Location not specified'}</div>
                        <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-100"><span className="text-sm text-gray-500">{job.numberOfOpenings || 1} opening(s)</span><span onClick={e => { e.stopPropagation(); openApplication(job); }} className="text-[#7D1EDB] font-semibold text-sm">Apply now</span></div>
                    </button>)}
                </div>
            )}

            {showApply && <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onMouseDown={() => !submitting && setShowApply(false)}>
                <form onSubmit={submitApplication} onMouseDown={e => e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-xl">
                    <div className="flex justify-between gap-4 mb-5"><div><h2 className="text-xl font-semibold text-gray-900">Apply for {selectedJob?.title}</h2><p className="text-sm text-gray-500 mt-1">Fill in your details and attach your resume.</p></div><button type="button" onClick={() => setShowApply(false)}><X size={22} /></button></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[['name','Full name *','Enter full name'],['email','Email *','Enter email address'],['phone','Phone number','Enter phone number'],['experience','Experience','e.g. 3 years'],['skills','Skills','e.g. React, Node.js']].map(([name,label,placeholder]) => <label key={name} className={name === 'skills' ? 'sm:col-span-2 text-sm font-medium' : 'text-sm font-medium'}>{label}<input name={name} value={application[name]} onChange={e => setApplication(prev => ({ ...prev, [name]: e.target.value }))} placeholder={placeholder} type={name === 'email' ? 'email' : 'text'} className="block w-full mt-2 px-4 py-2.5 border border-gray-300 rounded-lg font-normal outline-none focus:ring-2 focus:ring-purple-200" /></label>)}
                        <label className="sm:col-span-2 text-sm font-medium">Cover letter<textarea value={application.coverLetter} onChange={e => setApplication(prev => ({ ...prev, coverLetter: e.target.value }))} rows={3} placeholder="Tell us why you are a good fit" className="block w-full mt-2 px-4 py-2.5 border border-gray-300 rounded-lg font-normal resize-none outline-none focus:ring-2 focus:ring-purple-200" /></label>
                        <label className="sm:col-span-2 border border-dashed border-gray-300 rounded-lg p-4 cursor-pointer flex items-center gap-3"><Upload size={20} className="text-[#7D1EDB]" /><span className="text-sm text-gray-600">{resume?.name || 'Upload resume *'}</span><input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => setResume(e.target.files?.[0] || null)} /></label>
                    </div>
                    <div className="flex justify-end gap-3 mt-6"><button type="button" onClick={() => setShowApply(false)} className="px-5 py-2.5 border border-gray-300 rounded-full">Cancel</button><button disabled={submitting} className="px-6 py-2.5 bg-[#7D1EDB] text-white rounded-full disabled:opacity-50 flex items-center gap-2">{submitting && <Spinner size={16} color="#fff" />}Submit Application</button></div>
                </form>
            </div>}
        </div>
    );
};

export default JobOpeningList;
