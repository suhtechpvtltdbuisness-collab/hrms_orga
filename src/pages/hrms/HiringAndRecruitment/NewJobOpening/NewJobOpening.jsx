import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Upload, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import FilterDropdown from '../../../../components/ui/FilterDropdown';
import CustomDatePicker from '../../../../components/ui/CustomDatePicker';
import Spinner from '../../../../components/ui/Spinner';
import { hiringService, departmentService, designationService } from '../../../../service';

const NewJobOpening = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        jobTitle: '',
        department: '',
        employmentType: '',
        designation: '',
        numberOfOpenings: '',
        jobLocation: '',
        jobSummary: '',
        keyResponsibilities: '',
        requiredSkills: '',
        experience: '',
        currentSalary: '',
        expectedSalary: '',
        applicationDeadline: '',
        applicationSource: 'Company Website',
        jobVisibility: 'Public'
    });
    const [jdFile, setJdFile] = useState(null);
    const [jdUploading, setJdUploading] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    const EMPLOYMENT_TYPE_OPTIONS = ["Full-time", "Part-time", "Contract", "Internship"];
    const EXPERIENCE_OPTIONS = ["0-1 years", "1-3 years", "3-5 years", "5-7 years", "7+ years"];
    const SOURCE_OPTIONS = ["Company Website", "LinkedIn", "Indeed", "Naukri", "Other"];

    useEffect(() => {
        loadDepartments();
    }, []);

    useEffect(() => {
        loadDesignations(formData.department);
    }, [formData.department]);

    const loadDepartments = async () => {
        const result = await departmentService.getDepartmentsDropdown();
        if (result.success) {
            setDepartments(result.data || []);
        }
    };

    const loadDesignations = async (departmentName) => {
        const deptObj = departments.find(d => d.name === departmentName);
        const departmentId = deptObj?.id || undefined;
        const result = await designationService.getDesignationDropdown(departmentId);
        if (result.success) {
            setDesignations(result.data || []);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleJdUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setJdUploading(true);
        const result = await hiringService.uploadFile(file);
        if (result.success && result.files?.length > 0) {
            setJdFile({ name: file.name, url: result.files[0].url });
            toast.success('JD uploaded successfully');
        } else {
            toast.error(result.message || 'Failed to upload JD');
        }
        setJdUploading(false);
    };

    const handlePublishJob = async () => {
        if (!formData.jobTitle.trim()) {
            toast.error('Please enter a job title before publishing.');
            return;
        }
        setSubmitting(true);
        const loadingToast = toast.loading('Publishing job...');
        const payload = buildPayload(true);
        const result = await hiringService.createJob(payload);
        toast.dismiss(loadingToast);
        if (result.success) {
            toast.success('Job opening published successfully!');
            navigate('/hrms/hiring-and-recruitment/job-opening');
        } else {
            toast.error(result.message);
        }
        setSubmitting(false);
    };

    const buildPayload = (isActive) => {
        const deptObj = departments.find(d => d.name === formData.department);
        const salaryRange = formData.currentSalary && formData.expectedSalary
            ? `${formData.currentSalary} - ${formData.expectedSalary}`
            : formData.currentSalary || formData.expectedSalary || '';
        return {
            title: formData.jobTitle,
            departmentId: deptObj?.id || null,
            employeeType: formData.employmentType?.toLowerCase().replace(/\s+/g, '_') || null,
            designation: formData.designation,
            numberOfOpenings: formData.numberOfOpenings ? Number(formData.numberOfOpenings) : 1,
            location: formData.jobLocation,
            jobSummary: formData.jobSummary,
            keyResponsibilities: formData.keyResponsibilities,
            requiredSkills: formData.requiredSkills,
            experience: formData.experience,
            salaryRange,
            applicationDeadline: formData.applicationDeadline
                ? (() => {
                    const parts = formData.applicationDeadline.split('/');
                    if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
                    return formData.applicationDeadline;
                  })()
                : null,
            applicationSource: formData.applicationSource,
            jobVisibility: formData.jobVisibility,
            jdFileUrl: jdFile?.url || null,
            isActive,
        };
    };

    return (
        <div className="bg-white px-4 sm:px-4 md:px-6 py-4 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-9rem)] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-10rem)] xl:h-[calc(100vh-11rem)] flex flex-col font-sans border border-[#D9D9D9] overflow-hidden" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
            
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-[#7D1EDB] mb-2 shrink-0">
                <div className="flex items-center gap-3" onClick={() => navigate('/hrms')}>
                    <ArrowLeft size={14} className="text-gray-900 cursor-pointer" />
                    <span className="cursor-pointer hover:text-purple-500"> HRMS Dashboard</span>
                </div>
                <ChevronRight size={16} className="mx-1" />
                <span className="text-[#667085] text-[14px] font-base">Job Opening</span>
            </div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0 shrink-0">
                <h1 className="text-xl font-semibold text-gray-900">Add Job Opening</h1>
                <div className="flex gap-4 w-full sm:w-auto">
                    <button
                        onClick={handlePublishJob}
                        disabled={submitting}
                        className="px-6 py-2.5 bg-[#7D1EDB] text-white font-medium rounded-full hover:bg-purple-700 transition-colors shadow-sm w-full sm:w-auto disabled:opacity-50 flex items-center gap-2 justify-center"
                        style={{ borderRadius: '30px' }}
                    >
                        {submitting ? <Spinner size={16} color="#fff" /> : null}
                        Publish Job
                    </button>
                </div>
            </div>

            {/* Form Content */}
            <div className="custom-scrollbar pr-2 pb-4" style={{ flex: 1, overflowY: 'auto' }}>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Left Column - Wider */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Basic Job Details */}
                    <div className="border border-gray-200 rounded-lg p-6 bg-white">
                        <h2 className="text-lg font-medium text-gray-800 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            Basic Job Details
                        </h2>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Job Title */}
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    Job Title
                                </label>
                                <input
                                    type="text"
                                    name="jobTitle"
                                    value={formData.jobTitle}
                                    onChange={handleInputChange}
                                    placeholder="Enter job title"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                    style={{ fontFamily: 'Poppins, sans-serif' }}
                                />
                            </div>

                            {/* Department */}
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    Department
                                </label>
                                <div className="relative">
                                    <FilterDropdown
                                        options={departments.map(d => d.name)}
                                        value={formData.department}
                                        onChange={(val) => setFormData(prev => ({ ...prev, department: val }))}
                                        placeholder="Select department"
                                        className="w-full h-[42px] flex items-center justify-between px-4 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                            </div>

                            {/* Employment Type */}
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    Employment Type
                                </label>
                                <div className="relative">
                                    <FilterDropdown
                                        options={EMPLOYMENT_TYPE_OPTIONS}
                                        value={formData.employmentType}
                                        onChange={(val) => setFormData(prev => ({ ...prev, employmentType: val }))}
                                        placeholder="Select type"
                                        className="w-full h-[42px] flex items-center justify-between px-4 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                            </div>

                            {/* Designation */}
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    Designation
                                </label>
                                <div className="relative">
                                    <FilterDropdown
                                        options={designations.map(d => d.name)}
                                        value={formData.designation}
                                        onChange={(val) => setFormData(prev => ({ ...prev, designation: val }))}
                                        placeholder="Select designation"
                                        className="w-full h-[42px] flex items-center justify-between px-4 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                            </div>

                            {/* Number of Openings */}
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    Number of Openings
                                </label>
                                <input
                                    type="number"
                                    name="numberOfOpenings"
                                    value={formData.numberOfOpenings}
                                    onChange={handleInputChange}
                                    placeholder="Enter number"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                    style={{ fontFamily: 'Poppins, sans-serif' }}
                                />
                            </div>

                            {/* Job Location */}
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    Job Location
                                </label>
                                <input
                                    type="text"
                                    name="jobLocation"
                                    value={formData.jobLocation}
                                    onChange={handleInputChange}
                                    placeholder="Enter location"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                    style={{ fontFamily: 'Poppins, sans-serif' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Job Description */}
                    <div className="border border-gray-200 rounded-lg p-6 bg-white">
                        <h2 className="text-lg font-medium text-gray-800 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            Job Description
                        </h2>

                        <div className="space-y-4">
                            {/* Job Summary */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    Job Summary
                                </label>
                                <textarea
                                    name="jobSummary"
                                    value={formData.jobSummary}
                                    onChange={handleInputChange}
                                    placeholder="Briefly describe the role and impact"
                                    rows={3}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none"
                                    style={{ fontFamily: 'Poppins, sans-serif' }}
                                />
                            </div>

                            {/* Key Responsibilities */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    Key Responsibilities
                                </label>
                                <textarea
                                    name="keyResponsibilities"
                                    value={formData.keyResponsibilities}
                                    onChange={handleInputChange}
                                    placeholder="Enter detailed responsibilities"
                                    rows={3}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none"
                                    style={{ fontFamily: 'Poppins, sans-serif' }}
                                />
                            </div>

                            {/* Required Skills & Qualifications */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    Required Skills & Qualifications
                                </label>
                                <textarea
                                    name="requiredSkills"
                                    value={formData.requiredSkills}
                                    onChange={handleInputChange}
                                    placeholder="Enter skills"
                                    rows={3}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none"
                                    style={{ fontFamily: 'Poppins, sans-serif' }}
                                />
                            </div>

                            {/* JD Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    Job Description Document (PDF)
                                </label>
                                {!jdFile ? (
                                    <div
                                        onClick={() => document.getElementById('jd-upload-input').click()}
                                        className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-purple-500 transition-colors"
                                    >
                                        <Upload size={24} className="mx-auto text-gray-400 mb-1" />
                                        <p className="text-sm text-gray-500">Click to upload JD document</p>
                                        <input
                                            id="jd-upload-input"
                                            type="file"
                                            className="hidden"
                                            accept=".pdf,.doc,.docx"
                                            onChange={handleJdUpload}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between bg-purple-50 border border-purple-200 rounded-lg p-3">
                                        <div className="flex items-center gap-2">
                                            <Upload size={16} className="text-purple-600" />
                                            <span className="text-sm text-purple-700 font-medium truncate max-w-[200px]">{jdFile.name}</span>
                                        </div>
                                        <X
                                            size={16}
                                            className="text-gray-400 cursor-pointer hover:text-red-500"
                                            onClick={() => setJdFile(null)}
                                        />
                                    </div>
                                )}
                                {jdUploading && <p className="text-xs text-purple-600 mt-1">Uploading...</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Narrower */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Experience and Compensation */}
                    <div className="border border-gray-200 rounded-lg p-6 bg-white">
                        <h2 className="text-lg font-medium text-gray-800 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            Experience and Compensation
                        </h2>

                        <div className="space-y-4">
                            {/* Experience */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    Experience(in years)
                                </label>
                                <div className="relative">
                                    <FilterDropdown
                                        options={EXPERIENCE_OPTIONS}
                                        value={formData.experience}
                                        onChange={(val) => setFormData(prev => ({ ...prev, experience: val }))}
                                        placeholder="Select experience"
                                        className="w-full h-[42px] flex items-center justify-between px-4 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                            </div>

                            {/* Current Salary */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    Current Salary(yearly)
                                </label>
                                <input
                                    type="text"
                                    name="currentSalary"
                                    value={formData.currentSalary}
                                    onChange={handleInputChange}
                                    placeholder="Enter Current salary"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                    style={{ fontFamily: 'Poppins, sans-serif' }}
                                />
                            </div>

                            {/* Expected Salary */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    Expected Salary(Yearly)
                                </label>
                                <input
                                    type="text"
                                    name="expectedSalary"
                                    value={formData.expectedSalary}
                                    onChange={handleInputChange}
                                    placeholder="Enter expected salary"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                    style={{ fontFamily: 'Poppins, sans-serif' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Application Settings */}
                    <div className="border border-gray-200 rounded-lg p-6 bg-white">
                        <h2 className="text-lg font-medium text-gray-800 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            Application Settings
                        </h2>

                        <div className="space-y-4">
                            {/* Application Deadline */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    Application Deadline
                                </label>
                                <div className="relative">
                                    <CustomDatePicker
                                        value={formData.applicationDeadline}
                                        onChange={(val) => setFormData(prev => ({ ...prev, applicationDeadline: val }))}
                                        placeholder="Select Date"
                                        allowFuture={true}
                                        className="bg-white border-gray-300 w-full px-4 py-2.5 rounded-lg text-sm"
                                    />
                                </div>
                            </div>

                            {/* Application Source */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    Application Source
                                </label>
                                <div className="relative">
                                    <FilterDropdown
                                        options={SOURCE_OPTIONS}
                                        value={formData.applicationSource}
                                        onChange={(val) => setFormData(prev => ({ ...prev, applicationSource: val }))}
                                        placeholder="Select source"
                                        className="w-full h-[42px] flex items-center justify-between px-4 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                            </div>
                            
                            {/* Job Visibility handled separately - NOT replacing with dropdown as it is Radio */}

                            {/* Job Visibility */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    Job Visibility
                                </label>
                                <div className="flex items-center gap-6">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="jobVisibility"
                                            value="Public"
                                            checked={formData.jobVisibility === 'Public'}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                            Public
                                        </span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="jobVisibility"
                                            value="Internal only"
                                            checked={formData.jobVisibility === 'Internal only'}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                            Internal only
                                        </span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="jobVisibility"
                                            value="All Employees"
                                            checked={formData.jobVisibility === 'All Employees'}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                            All Employees
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
};

export default NewJobOpening;
