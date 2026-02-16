import React, { useState } from "react";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { useLocation } from "react-router-dom";

const AccordionItem = ({ title, isOpen, onToggle, children }) => {
    return (
        <div className="flex flex-col">
            <div
                className={`border rounded-lg overflow-hidden ${isOpen ? 'bg-white border-gray-200' : 'bg-[#F5F5F5] border-[#CBCBCB]'
                    }`}
            >
                <button
                    onClick={onToggle}
                    className="w-full px-6 h-[52px] flex justify-between items-center transition-colors text-left"
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

const InputField = ({ label, type = "text", placeholder, defaultValue, icon: Icon, tooltipContent }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div>
            <label className="block text-base font-normal text-[#757575] mb-1.5 leading-[140%]">{label}</label>
            <div className={`relative ${showTooltip ? 'z-50' : ''}`}>
                <input
                    type={type}
                    placeholder={placeholder || label}
                    defaultValue={defaultValue}
                    disabled
                    className="
                        w-full px-4 py-3 bg-[#F5F5F5] border border-[#D9D9D9] rounded-lg
                        text-[#757575] text-base placeholder-gray-400
                        focus:outline-none transition-all cursor-not-allowed
                    "
                />
                {Icon && (
                    <div 
                        className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-[#757575]"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                    >
                        <Icon size={20} />
                        {showTooltip && tooltipContent && (
                           <div className="absolute top-full right-0 mt-5 w-max max-w-[320px] z-50">
                                <div className="bg-[#8DC9C7] text-white text-[13px] rounded-lg p-4 shadow-xl relative animate-fadeIn font-sans tracking-wide">
                                    {tooltipContent}
                                    {/* Arrow */}
                                    <div className="absolute bottom-full right-3 border-15 border-transparent border-b-[#8DC9C7]"></div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const EmpEmployment = () => {
    const location = useLocation();
    const reportingManager = location.state?.reportingManager || '';

    const managerTooltip = (
        <div className="text-left space-y-1.5 min-w-[240px]">
             <div className="grid grid-cols-[90px_1fr] gap-2">
                <span className="font-light opacity-90">Name :</span>
                <span className="font-normal">{reportingManager || 'Samiksha Umbarje'}</span>
             </div>
             <div className="grid grid-cols-[90px_1fr] gap-2">
                <span className="font-light opacity-90">Designation :</span>
                <span className="font-normal">UI/UX Developer</span>
             </div>
             <div className="grid grid-cols-[90px_1fr] gap-2">
                <span className="font-light opacity-90">Email :</span>
                <span className="font-normal">samiksha@123gmail.com</span>
             </div>
             <div className="grid grid-cols-[90px_1fr] gap-2">
                <span className="font-light opacity-90">Assigned Date :</span>
                <span className="font-normal">12 January 2025</span>
             </div>
        </div>
    );

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
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    <InputField label="Job Title" placeholder="Enter job title" />
                    <InputField label="Department" placeholder="Enter department" />
                    <InputField label="Team/Sub-Department" placeholder="Enter team/sub-department" />
                    <InputField 
                        label="Reporting Manager" 
                        placeholder="Enter name" 
                        defaultValue={reportingManager || 'Samiksha Umbarje'} 
                        icon={Info}
                        tooltipContent={managerTooltip}
                    />

                    <InputField label="Date of Joining" type="date" placeholder="Select Date" />
                    <InputField label="Work Location" placeholder="Enter location" />
                    <InputField label="Branch" placeholder="Enter Branch name" />
                    <InputField label="Prohibition Period" placeholder="Select Date" type="date" />

                    <InputField label="Confirm Date" type="date" placeholder="Select Date" />
                    <InputField label="Employment Status" placeholder="Active" />
                    <InputField label="Prohibition End Date" type="date" placeholder="Select Date" />
                </div>
            </AccordionItem>

            {/* ---------------------- EMPLOYMENT HISTORY ---------------------- */}
            <AccordionItem
                title="Employment History"
                isOpen={sections.employmentHistory}
                onToggle={() => toggleSection("employmentHistory")}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    <InputField label="Previous Designations" placeholder="Enter designations" />
                    <InputField label="Department Transfers" placeholder="Enter department transfers" />
                    <InputField label="Manager Changes" placeholder="Enter manager changes" />

                    <InputField label="Salary Revision History" placeholder="Enter revision history" />
                    <InputField label="Promotion History" placeholder="Enter promotion history" />
                    <InputField label="Role Change Logs" placeholder="Enter role logs" />
                </div>
            </AccordionItem>

            {/* ---------------------- CONTRACT DETAILS ---------------------- */}
            <AccordionItem
                title="Contract Details"
                isOpen={sections.contractDetails}
                onToggle={() => toggleSection("contractDetails")}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    <InputField label="Contract Types" placeholder="Enter contract type" />
                    <InputField label="Contract Start Date" type="date" placeholder="Select Date" />
                    <InputField label="Contract End Date" type="date" placeholder="Select Date" />

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
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    <InputField label="Assigned Shift" placeholder="Enter assigned shift" />
                    <InputField label="Shift Start Time" type="time" placeholder="Select Time" />
                    <InputField label="Shift End Time" type="time" placeholder="Select Time" />

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
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    <InputField label="Primary Roles" placeholder="Enter primary role" />
                    <InputField label="Additional Roles" placeholder="Enter additional roles" />
                    <InputField label="Module Access" placeholder="Enter module access" />

                    <InputField label="Role Effective From" type="date" placeholder="Select Date" />
                </div>
            </AccordionItem>

            {/* ---------------------- PERMISSION LEVELS ---------------------- */}
            <AccordionItem
                title="Permission Levels"
                isOpen={sections.permissionLevels}
                onToggle={() => toggleSection("permissionLevels")}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    <InputField label="MFA Enabled" placeholder="Yes/No" />
                    <InputField label="Restricted IP Login" placeholder="Yes/No" />
                    <InputField label="Device Access Controls" placeholder="Yes/No" />

                    <InputField label="Last Role Updated By" placeholder="Enter name" />
                </div>
            </AccordionItem>
        </div>
    );
};

export default EmpEmployment;
