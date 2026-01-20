import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import FilterDropdown from '../../../components/ui/FilterDropdown';
import CustomDatePicker from '../../../components/ui/CustomDatePicker';

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

    const DEPARTMENT_OPTIONS = ["Engineering", "Product Design", "Marketing", "Sales", "HR"];
    const EMPLOYMENT_TYPE_OPTIONS = ["Full-time", "Part-time", "Contract", "Internship"];
    const EXPERIENCE_OPTIONS = ["0-1 years", "1-3 years", "3-5 years", "5-7 years", "7+ years"];
    const SOURCE_OPTIONS = ["Company Website", "LinkedIn", "Indeed", "Naukri", "Other"];

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
                                <div className="relative">
                                    <FilterDropdown
                                        options={DEPARTMENT_OPTIONS}
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
