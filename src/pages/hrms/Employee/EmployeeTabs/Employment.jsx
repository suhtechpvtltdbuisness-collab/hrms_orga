import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Calendar, ArrowUp } from "lucide-react";
import CustomDatePicker from '../../../../components/ui/CustomDatePicker';
import FilterDropdown from '../../../../components/ui/FilterDropdown';
import { departmentService, designationService } from "../../../../service";

const AccordionItem = ({ title, isOpen, onToggle, children }) => {
    return (
        <div className="flex flex-col">
            <div
                className={`border rounded-lg overflow-hidden ${isOpen ? 'bg-white border-gray-200' : 'bg-[#F5F5F5] border-[#CBCBCB]'
                    }`}
            >
                <button
                    onClick={onToggle}
                    className="w-full px-4 h-[52px] flex justify-between items-center transition-colors text-left"
                >
                    <span className="text-[#000000] font-normal text-[16px] leading-none" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                        {title}
                    </span>
                    {isOpen ? <ChevronUp className="text-gray-500" size={24} /> : <ChevronDown className="text-gray-500" size={24} />}
                </button>
            </div>
            {isOpen && (
                <div className="pt-4 animate-fadeIn">
                    {children}
                </div>
            )}
        </div>
    );
};

const InputField = ({ label, type = "text", placeholder, defaultValue, ...props }) => {
    return (
        <div>
            <label className="block text-base font-normal text-[#1F1F1F] mb-1.5 leading-[140%]">{label}</label>
            <div className="relative">
                <input
                    type={type}
                    placeholder={placeholder || label}
                    defaultValue={defaultValue}
                    className={`
                        w-full px-4 py-3 bg-white border border-gray-200 rounded-lg
                        text-gray-700 text-base placeholder-gray-400
                        focus:outline-none focus:ring-2 focus:ring-purple-100
                        focus:border-purple-300 transition-all
                        ${type === 'date' ? 'appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer' : ''}
                    `}
                    {...props}
                />
                {type === 'date' && (
                    <img
                        src="/images/calender.svg"
                        alt="calendar"
                        className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none w-5 h-5"
                    />
                )}
            </div>
        </div>
    );
};

const Employment = ({ formData = {}, onChange }) => {
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const deptRes = await departmentService.getAllDepartments();
                if (deptRes.success) {
                    setDepartments(deptRes.data.map(d => ({ label: d.departmentName, value: d._id })));
                }
                const desigRes = await designationService.getAllDesignation();
                if (desigRes.success) {
                    setDesignations(desigRes.data.map(d => ({ label: d.name, value: d._id })));
                }
            } catch (error) {
                console.error("Failed to fetch dropdown data", error);
            }
        };
        fetchData();
    }, []);
    const [sections, setSections] = useState({
        jobDetails: true,
        employmentHistory: false,
        contractDetails: false,
        shiftDetails: false,
        shiftSchedule: false,
        workSchedule: false,
        roster: false,
        roleAssignments: false,
        permissionLevels: false,
        securitySettings: false,
    });

    const [dates, setDates] = useState({});

    const handleDateChange = (field, value) => {
        setDates(prev => ({ ...prev, [field]: value }));
    };

    const toggleSection = (section) => {
        setSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    return (
        <div className="h-full flex flex-col gap-4">

            {/* ---------------------- JOB DETAILS ---------------------- */}
            <AccordionItem
                title="Job Details"
                isOpen={sections.jobDetails}
                onToggle={() => toggleSection("jobDetails")}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Job Title / Designation */}
                    <div>
                        <label className="block text-base font-normal text-[#1F1F1F] mb-1.5 leading-[140%]">Designation</label>
                        <FilterDropdown
                            placeholder="Select Designation"
                            options={designations}
                            value={formData.designation}
                            onChange={(val) => onChange && onChange({ target: { name: 'designation', value: val } })}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 text-base"
                        />
                    </div>

                    {/* Department */}
                    <div>
                        <label className="block text-base font-normal text-[#1F1F1F] mb-1.5 leading-[140%]">Department</label>
                        <FilterDropdown
                            placeholder="Select Department"
                            options={departments}
                            value={formData.department}
                            onChange={(val) => onChange && onChange({ target: { name: 'department', value: val } })}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 text-base"
                        />
                    </div>
                    
                    <InputField label="Team/Sub-Department" placeholder="Enter team/sub-department" />
                    <InputField label="Reporting Manager" placeholder="Enter name" />

                    <InputField label="Reporting Manager" placeholder="Enter name" />

                    <div>
                        <label className="block text-base font-normal text-[#1F1F1F] mb-1.5 leading-[140%]">Date of Joining</label>
                        <div className="relative">
                            <CustomDatePicker
                                value={dates.joiningDate}
                                onChange={(val) => handleDateChange('joiningDate', val)}
                                placeholder="Select Date"
                                className="bg-white border-gray-200"
                            />
                        </div>
                    </div>
                    <InputField label="Work Location" placeholder="Enter location" />
                    <InputField label="Branch" placeholder="Enter Branch name" />
                    <InputField label="Prohibition Period" placeholder="Enter Period" />

                    <InputField label="Prohibition Period" placeholder="Enter Period" />

                    <div>
                        <label className="block text-base font-normal text-[#1F1F1F] mb-1.5 leading-[140%]">Confirm Date</label>
                        <div className="relative">
                            <CustomDatePicker
                                value={dates.confirmDate}
                                onChange={(val) => handleDateChange('confirmDate', val)}
                                placeholder="Select Date"
                                className="bg-white border-gray-200"
                            />
                        </div>
                    </div>
                    <InputField label="Employment Status" placeholder="Active" />
                    <InputField label="Employment Status" placeholder="Active" />
                    <div>
                        <label className="block text-base font-normal text-[#1F1F1F] mb-1.5 leading-[140%]">Prohibition End Date</label>
                        <div className="relative">
                            <CustomDatePicker
                                value={dates.prohibitionEndDate}
                                onChange={(val) => handleDateChange('prohibitionEndDate', val)}
                                placeholder="Select Date"
                                className="bg-white border-gray-200"
                            />
                        </div>
                    </div>
                </div>
            </AccordionItem>

            {/* ---------------------- EMPLOYMENT HISTORY ---------------------- */}
            <AccordionItem
                title="Employment History"
                isOpen={sections.employmentHistory}
                onToggle={() => toggleSection("employmentHistory")}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {["Previous Designations", "Department Transfers", "Manager Changes", "Role Change Logs", "Salary Revision History", "Promotion History"].map((item, index) => (
                        <div key={index} className="flex items-center gap-2 cursor-pointer group">
                            <span className="text-[#4F4F4F] text-[16px]" style={{ fontFamily: 'Inter, sans-serif' }}>{item}</span>
                            <ArrowUp size={16} className="text-[#4F4F4F] group-hover:text-purple-600 transition-colors" />
                        </div>
                    ))}
                </div>
            </AccordionItem>

            {/* ---------------------- CONTRACT DETAILS ---------------------- */}
            <AccordionItem
                title="Contract Details"
                isOpen={sections.contractDetails}
                onToggle={() => toggleSection("contractDetails")}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <InputField label="Contract Types" placeholder="Enter contract type" />
                    <InputField label="Contract Types" placeholder="Enter contract type" />
                    <div>
                        <label className="block text-base font-normal text-[#1F1F1F] mb-1.5 leading-[140%]">Contract Start Date</label>
                        <div className="relative">
                            <CustomDatePicker
                                value={dates.contractStartDate}
                                onChange={(val) => handleDateChange('contractStartDate', val)}
                                placeholder="Select Date"
                                className="bg-white border-gray-200"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-base font-normal text-[#1F1F1F] mb-1.5 leading-[140%]">Contract End Date</label>
                        <div className="relative">
                            <CustomDatePicker
                                value={dates.contractEndDate}
                                onChange={(val) => handleDateChange('contractEndDate', val)}
                                placeholder="Select Date"
                                className="bg-white border-gray-200"
                            />
                        </div>
                    </div>

                    <InputField label="Contract Duration" placeholder="Enter duration" />
                    <InputField label="Contract Pay" placeholder="Enter pay amount" />
                    <InputField label="Renewal Status" placeholder="Enter status" />
                </div>
            </AccordionItem>

            {/* ---------------------- WORK MODE & SHIFT DETAILS ---------------------- */}
            <AccordionItem
                title="Work Mode & Shift Details"
                isOpen={sections.shiftDetails}
                onToggle={() => toggleSection("shiftDetails")}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <InputField label="Work Mode" placeholder="Enter work mode" />
                    <InputField label="Current Shift" placeholder="Enter current shift" />
                    <InputField label="Shift Timings" placeholder="Enter shift timings" />

                    <InputField label="Weekly Off Patterns" placeholder="Enter weekly off pattern" />
                    <InputField label="Overtime Eligibility" placeholder="Enter eligibility" />
                    <InputField label="Assigned Schedule Templates" placeholder="Enter template" />
                </div>
            </AccordionItem>

            {/* ---------------------- SHIFT SCHEDULE ---------------------- */}
            <AccordionItem
                title="Shift Schedule"
                isOpen={sections.shiftSchedule}
                onToggle={() => toggleSection("shiftSchedule")}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <InputField label="Assigned Shift" placeholder="Enter assigned shift" />
                    <InputField label="Shift Start Time" placeholder="Enter Start Time" />
                    <InputField label="Shift End Time" placeholder="Enter End Time" />

                    <InputField label="Break Timings" placeholder="Enter break timings" />
                    <InputField label="Weekly Off" placeholder="Enter weekly off" />
                </div>
            </AccordionItem>

            {/* ---------------------- WORK SCHEDULE ---------------------- */}
            <AccordionItem
                title="Work Schedule"
                isOpen={sections.workSchedule}
                onToggle={() => toggleSection("workSchedule")}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <InputField label="Weekly Schedule" placeholder="Enter weekly schedule" />
                    <InputField label="Working Hours Per Day" placeholder="Enter hours" />
                    <InputField label="Total Weekly Work Hours" placeholder="Enter total hours" />

                    <InputField label="Flexible Hours" placeholder="Yes/No" />
                    <InputField label="Custom Schedule" placeholder="Yes/No" />
                </div>
            </AccordionItem>

            {/* ---------------------- ROSTER MANAGEMENT ---------------------- */}
            <AccordionItem
                title="Roster Management"
                isOpen={sections.roster}
                onToggle={() => toggleSection("roster")}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <InputField label="Monthly Roster Calendar" placeholder="Select calendar" />
                    <InputField label="Rotational Shift Cycle" placeholder="Enter cycle" />
                    <InputField label="Upcoming Shift Assignment" placeholder="Enter assignment" />

                    <InputField label="Swap Requests" placeholder="Enter requests" />
                    <InputField label="Attendance Linked Roster" placeholder="Yes/No" />
                </div>
            </AccordionItem>

            {/* ---------------------- ROLE ASSIGNMENTS ---------------------- */}
            <AccordionItem
                title="Role Assignments"
                isOpen={sections.roleAssignments}
                onToggle={() => toggleSection("roleAssignments")}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <InputField label="Primary Roles" placeholder="Enter primary role" />
                    <InputField label="Additional Roles" placeholder="Enter additional roles" />
                    <InputField label="Module Access" placeholder="Enter module access" />

                    <InputField label="Module Access" placeholder="Enter module access" />

                    <div>
                        <label className="block text-base font-normal text-[#1F1F1F] mb-1.5 leading-[140%]">Role Effective From</label>
                        <div className="relative">
                            <CustomDatePicker
                                value={dates.roleEffectiveDate}
                                onChange={(val) => handleDateChange('roleEffectiveDate', val)}
                                placeholder="Select Date"
                                className="bg-white border-gray-200"
                            />
                        </div>
                    </div>
                </div>
            </AccordionItem>

            {/* ---------------------- PERMISSION LEVELS ---------------------- */}
            <AccordionItem
                title="Permission Levels"
                isOpen={sections.permissionLevels}
                onToggle={() => toggleSection("permissionLevels")}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <InputField label="Levels" placeholder="Enter levels" />
                    <InputField label="Access Scope" placeholder="Enter scope" />
                    <InputField label="Approval Rights" placeholder="Yes/No" />

                    <InputField label="Data Visibility" placeholder="Enter visibility" />
                    <InputField label="Special Permission" placeholder="Enter special permission" />
                </div>
            </AccordionItem>

            {/* ---------------------- SECURITY SETTINGS ---------------------- */}
            <AccordionItem
                title="Security Settings"
                isOpen={sections.securitySettings}
                onToggle={() => toggleSection("securitySettings")}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <InputField label="MFA Enabled" placeholder="Yes/No" />
                    <InputField label="Restricted IP Login" placeholder="Yes/No" />
                    <InputField label="Device Access Controls" placeholder="Yes/No" />

                    <InputField label="Last Role Updated By" placeholder="Enter name" />
                </div>
            </AccordionItem>
        </div>
    );
};

export default Employment;
