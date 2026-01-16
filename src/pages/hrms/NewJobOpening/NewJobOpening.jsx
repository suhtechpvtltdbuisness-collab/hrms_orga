import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft } from 'lucide-react';

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveDraft = () => {
        console.log('Saving draft...', formData);
        // Add save draft logic here
    };

    const handlePublishJob = () => {
        console.log('Publishing job...', formData);
        // Add publish job logic here
    };

    return (
        <div className="bg-white px-4 sm:px-6 md:px-8 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-9rem)] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-10rem)] xl:h-[calc(100vh-11rem)] overflow-y-auto border border-[#D9D9D9]" style={{ fontFamily: 'Poppins, sans-serif' }}>

            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-[#7D1EDB] mb-3">
                <div className="flex items-center gap-3" onClick={() => navigate('/hrms')}>
                    <ArrowLeft size={14} className="text-gray-900 cursor-pointer" />
                    <span className="cursor-pointer hover:text-purple-500">Dashboard</span>
                </div>
                <ChevronRight size={16} className="mx-1" />
                <span className="text-[#667085] text-[14px] font-base">Job Opening</span>
            </div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
                <h1 className="text-xl font-semibold text-gray-900">Add Job Opening</h1>
                <div className="flex gap-4 w-full sm:w-auto">
                    <button
                        onClick={handleSaveDraft}
                        className="px-4 py-2.5 border border-purple-600 text-purple-600 font-medium rounded-full hover:bg-purple-50 transition-colors bg-white"
                        style={{ borderRadius: '30px' }}
                    >
                        Save Draft
                    </button>
                    <button
                        onClick={handlePublishJob}
                        className="px-6 py-2.5 bg-[#7D1EDB] text-white font-medium rounded-full hover:bg-purple-700 transition-colors shadow-sm w-full sm:w-auto"
                        style={{ borderRadius: '30px' }}
                    >
                        Publish Job
                    </button>
                </div>
            </div>

            {/* Form Content */}
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
                                <select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm text-gray-500 appearance-none bg-white"
                                    style={{ fontFamily: 'Poppins, sans-serif', backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                                >
                                    <option value="">Select department</option>
                                    <option value="Engineering">Engineering</option>
                                    <option value="Product Design">Product Design</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Sales">Sales</option>
                                    <option value="HR">HR</option>
                                </select>
                            </div>

                            {/* Employment Type */}
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    Employment Type
                                </label>
                                <select
                                    name="employmentType"
                                    value={formData.employmentType}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm text-gray-500 appearance-none bg-white"
                                    style={{ fontFamily: 'Poppins, sans-serif', backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                                >
                                    <option value="">Select type</option>
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Internship">Internship</option>
                                </select>
                            </div>

                            {/* Designation */}
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    Designation
                                </label>
                                <input
                                    type="text"
                                    name="designation"
                                    value={formData.designation}
                                    onChange={handleInputChange}
                                    placeholder="Enter designation"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                    style={{ fontFamily: 'Poppins, sans-serif' }}
                                />
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
                                <select
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm text-gray-500 appearance-none bg-white"
                                    style={{ fontFamily: 'Poppins, sans-serif', backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                                >
                                    <option value="">Select experience</option>
                                    <option value="0-1">0-1 years</option>
                                    <option value="1-3">1-3 years</option>
                                    <option value="3-5">3-5 years</option>
                                    <option value="5-7">5-7 years</option>
                                    <option value="7+">7+ years</option>
                                </select>
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
                                <input
                                    type="date"
                                    name="applicationDeadline"
                                    value={formData.applicationDeadline}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm text-gray-500"
                                    style={{ fontFamily: 'Poppins, sans-serif' }}
                                />
                            </div>

                            {/* Application Source */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    Application Source
                                </label>
                                <select
                                    name="applicationSource"
                                    value={formData.applicationSource}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm text-gray-700 appearance-none bg-white"
                                    style={{ fontFamily: 'Poppins, sans-serif', backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                                >
                                    <option value="Company Website">Company Website</option>
                                    <option value="LinkedIn">LinkedIn</option>
                                    <option value="Indeed">Indeed</option>
                                    <option value="Naukri">Naukri</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

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
