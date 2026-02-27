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

const InputField = ({ label, type = "text", placeholder, name, value, onChange, ...props }) => {
    return (
        <div>
            <label className="block text-base font-normal text-[#1F1F1F] mb-1.5 leading-[140%]">{label}</label>
            <div className="relative">
                <input
                    type={type}
                    placeholder={placeholder || label}
                    name={name}
                    value={value || ''}
                    onChange={onChange}
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

const Employment = ({ formData = {}, onChange, employeeId, employeeName }) => {
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
            {/* Employee Info Banner */}
            {employeeId && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {employeeName?.charAt(0)?.toUpperCase() || 'E'}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">{employeeName}</p>
                            <p className="text-xs text-gray-600">Employee ID: {employeeId}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* ---------------------- JOB DETAILS ---------------------- */}
            <AccordionItem
                title="Job Details"
                isOpen={sections.jobDetails}
                onToggle={() => toggleSection("jobDetails")}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <InputField label="Job Title" name="employmentJobTitle" value={formData.employmentJobTitle} onChange={onChange} placeholder="Enter job title" />
                    <InputField label="Department" name="employmentDepartment" value={formData.employmentDepartment} onChange={onChange} placeholder="Enter department" />
                    <InputField label="Team/Sub-Department" name="employmentTeamSubDepartment" value={formData.employmentTeamSubDepartment} onChange={onChange} placeholder="Enter team/sub-department" />
                    <InputField label="Reporting Manager" name="employmentReportingManager" value={formData.employmentReportingManager} onChange={onChange} placeholder="Enter name" />

                    <InputField label="Reporting Manager" name="employmentReportingManagerAlt" value={formData.employmentReportingManagerAlt} onChange={onChange} placeholder="Enter name" />

                    <div>
                        <label className="block text-base font-normal text-[#1F1F1F] mb-1.5 leading-[140%]">Date of Joining</label>
                        <div className="relative">
                            <CustomDatePicker
                                value={formData.employmentJoiningDate}
                                onChange={(val) => onChange({ target: { name: 'employmentJoiningDate', value: val } })}
                                placeholder="Select Date"
                                className="bg-white border-gray-200"
                            />
                        </div>
                    </div>
                    <InputField label="Work Location" name="employmentWorkLocation" value={formData.employmentWorkLocation} onChange={onChange} placeholder="Enter location" />
                    <InputField label="Branch" name="employmentBranch" value={formData.employmentBranch} onChange={onChange} placeholder="Enter Branch name" />
                    <InputField label="Prohibition Period" name="employmentProbationPeriod" value={formData.employmentProbationPeriod} onChange={onChange} placeholder="Enter Period" />

                    <InputField label="Prohibition Period" name="employmentProbationPeriodAlt" value={formData.employmentProbationPeriodAlt} onChange={onChange} placeholder="Enter Period" />

                    <div>
                        <label className="block text-base font-normal text-[#1F1F1F] mb-1.5 leading-[140%]">Confirm Date</label>
                        <div className="relative">
                            <CustomDatePicker
                                value={formData.employmentConfirmDate}
                                onChange={(val) => onChange({ target: { name: 'employmentConfirmDate', value: val } })}
                                placeholder="Select Date"
                                className="bg-white border-gray-200"
                            />
                        </div>
                    </div>
                    <InputField label="Employment Status" name="employmentStatus" value={formData.employmentStatus} onChange={onChange} placeholder="Active" />
                    <InputField label="Employment Status" name="employmentStatusAlt" value={formData.employmentStatusAlt} onChange={onChange} placeholder="Active" />
                    <div>
                        <label className="block text-base font-normal text-[#1F1F1F] mb-1.5 leading-[140%]">Prohibition End Date</label>
                        <div className="relative">
                            <CustomDatePicker
                                value={formData.employmentProbationEndDate}
                                onChange={(val) => onChange({ target: { name: 'employmentProbationEndDate', value: val } })}
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
                    <InputField label="Contract Types" name="employmentContractType" value={formData.employmentContractType} onChange={onChange} placeholder="Enter contract type" />
                    <InputField label="Contract Types" name="employmentContractTypeAlt" value={formData.employmentContractTypeAlt} onChange={onChange} placeholder="Enter contract type" />
                    <div>
                        <label className="block text-base font-normal text-[#1F1F1F] mb-1.5 leading-[140%]">Contract Start Date</label>
                        <div className="relative">
                            <CustomDatePicker
                                value={formData.employmentContractStartDate}
                                onChange={(val) => onChange({ target: { name: 'employmentContractStartDate', value: val } })}
                                placeholder="Select Date"
                                className="bg-white border-gray-200"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-base font-normal text-[#1F1F1F] mb-1.5 leading-[140%]">Contract End Date</label>
                        <div className="relative">
                            <CustomDatePicker
                                value={formData.employmentContractEndDate}
                                onChange={(val) => onChange({ target: { name: 'employmentContractEndDate', value: val } })}
                                placeholder="Select Date"
                                className="bg-white border-gray-200"
                            />
                        </div>
                    </div>

                    <InputField label="Contract Duration" name="employmentContractDuration" value={formData.employmentContractDuration} onChange={onChange} placeholder="Enter duration" />
                    <InputField label="Contract Pay" name="employmentContractPay" value={formData.employmentContractPay} onChange={onChange} placeholder="Enter pay amount" />
                    <InputField label="Renewal Status" name="employmentRenewalStatus" value={formData.employmentRenewalStatus} onChange={onChange} placeholder="Enter status" />
                </div>
            </AccordionItem>

            {/* ---------------------- WORK MODE & SHIFT DETAILS ---------------------- */}
            <AccordionItem
                title="Work Mode & Shift Details"
                isOpen={sections.shiftDetails}
                onToggle={() => toggleSection("shiftDetails")}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <InputField label="Work Mode" name="employmentWorkMode" value={formData.employmentWorkMode} onChange={onChange} placeholder="Enter work mode" />
                    <InputField label="Current Shift" name="employmentCurrentShift" value={formData.employmentCurrentShift} onChange={onChange} placeholder="Enter current shift" />
                    <InputField label="Shift Timings" name="employmentShiftTimings" value={formData.employmentShiftTimings} onChange={onChange} placeholder="Enter shift timings" />

                    <InputField label="Weekly Off Patterns" name="employmentWeeklyOffPatterns" value={formData.employmentWeeklyOffPatterns} onChange={onChange} placeholder="Enter weekly off pattern" />
                    <InputField label="Overtime Eligibility" name="employmentOvertimeEligibility" value={formData.employmentOvertimeEligibility} onChange={onChange} placeholder="Enter eligibility" />
                    <InputField label="Assigned Schedule Templates" name="employmentScheduleTemplates" value={formData.employmentScheduleTemplates} onChange={onChange} placeholder="Enter template" />
                </div>
            </AccordionItem>

            {/* ---------------------- SHIFT SCHEDULE ---------------------- */}
            <AccordionItem
                title="Shift Schedule"
                isOpen={sections.shiftSchedule}
                onToggle={() => toggleSection("shiftSchedule")}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <InputField label="Assigned Shift" name="employmentAssignedShift" value={formData.employmentAssignedShift} onChange={onChange} placeholder="Enter assigned shift" />
                    <InputField label="Shift Start Time" name="employmentShiftStartTime" value={formData.employmentShiftStartTime} onChange={onChange} placeholder="Enter Start Time" />
                    <InputField label="Shift End Time" name="employmentShiftEndTime" value={formData.employmentShiftEndTime} onChange={onChange} placeholder="Enter End Time" />

                    <InputField label="Break Timings" name="employmentBreakTimings" value={formData.employmentBreakTimings} onChange={onChange} placeholder="Enter break timings" />
                    <InputField label="Weekly Off" name="employmentWeeklyOff" value={formData.employmentWeeklyOff} onChange={onChange} placeholder="Enter weekly off" />
                </div>
            </AccordionItem>

            {/* ---------------------- WORK SCHEDULE ---------------------- */}
            <AccordionItem
                title="Work Schedule"
                isOpen={sections.workSchedule}
                onToggle={() => toggleSection("workSchedule")}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <InputField label="Weekly Schedule" name="employmentWeeklySchedule" value={formData.employmentWeeklySchedule} onChange={onChange} placeholder="Enter weekly schedule" />
                    <InputField label="Working Hours Per Day" name="employmentWorkingHoursPerDay" value={formData.employmentWorkingHoursPerDay} onChange={onChange} placeholder="Enter hours" />
                    <InputField label="Total Weekly Work Hours" name="employmentTotalWeeklyWorkHours" value={formData.employmentTotalWeeklyWorkHours} onChange={onChange} placeholder="Enter total hours" />

                    <InputField label="Flexible Hours" name="employmentFlexibleHours" value={formData.employmentFlexibleHours} onChange={onChange} placeholder="Yes/No" />
                    <InputField label="Custom Schedule" name="employmentCustomSchedule" value={formData.employmentCustomSchedule} onChange={onChange} placeholder="Yes/No" />
                </div>
            </AccordionItem>

            {/* ---------------------- ROSTER MANAGEMENT ---------------------- */}
            <AccordionItem
                title="Roster Management"
                isOpen={sections.roster}
                onToggle={() => toggleSection("roster")}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <InputField label="Monthly Roster Calendar" name="employmentMonthlyRosterCalendar" value={formData.employmentMonthlyRosterCalendar} onChange={onChange} placeholder="Select calendar" />
                    <InputField label="Rotational Shift Cycle" name="employmentRotationalShiftCycle" value={formData.employmentRotationalShiftCycle} onChange={onChange} placeholder="Enter cycle" />
                    <InputField label="Upcoming Shift Assignment" name="employmentUpcomingShiftAssignment" value={formData.employmentUpcomingShiftAssignment} onChange={onChange} placeholder="Enter assignment" />

                    <InputField label="Swap Requests" name="employmentSwapRequests" value={formData.employmentSwapRequests} onChange={onChange} placeholder="Enter requests" />
                    <InputField label="Attendance Linked Roster" name="employmentAttendanceLinkedRoster" value={formData.employmentAttendanceLinkedRoster} onChange={onChange} placeholder="Yes/No" />
                </div>
            </AccordionItem>

            {/* ---------------------- ROLE ASSIGNMENTS ---------------------- */}
            <AccordionItem
                title="Role Assignments"
                isOpen={sections.roleAssignments}
                onToggle={() => toggleSection("roleAssignments")}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <InputField label="Primary Roles" name="employmentPrimaryRoles" value={formData.employmentPrimaryRoles} onChange={onChange} placeholder="Enter primary role" />
                    <InputField label="Additional Roles" name="employmentAdditionalRoles" value={formData.employmentAdditionalRoles} onChange={onChange} placeholder="Enter additional roles" />
                    <InputField label="Module Access" name="employmentModuleAccess" value={formData.employmentModuleAccess} onChange={onChange} placeholder="Enter module access" />

                    <InputField label="Module Access" name="employmentModuleAccessAlt" value={formData.employmentModuleAccessAlt} onChange={onChange} placeholder="Enter module access" />

                    <div>
                        <label className="block text-base font-normal text-[#1F1F1F] mb-1.5 leading-[140%]">Role Effective From</label>
                        <div className="relative">
                            <CustomDatePicker
                                value={formData.employmentRoleEffectiveDate}
                                onChange={(val) => onChange({ target: { name: 'employmentRoleEffectiveDate', value: val } })}
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
                    <InputField label="Levels" name="employmentPermissionLevels" value={formData.employmentPermissionLevels} onChange={onChange} placeholder="Enter levels" />
                    <InputField label="Access Scope" name="employmentAccessScope" value={formData.employmentAccessScope} onChange={onChange} placeholder="Enter scope" />
                    <InputField label="Approval Rights" name="employmentApprovalRights" value={formData.employmentApprovalRights} onChange={onChange} placeholder="Yes/No" />

                    <InputField label="Data Visibility" name="employmentDataVisibility" value={formData.employmentDataVisibility} onChange={onChange} placeholder="Enter visibility" />
                    <InputField label="Special Permission" name="employmentSpecialPermission" value={formData.employmentSpecialPermission} onChange={onChange} placeholder="Enter special permission" />
                </div>
            </AccordionItem>

            {/* ---------------------- SECURITY SETTINGS ---------------------- */}
            <AccordionItem
                title="Security Settings"
                isOpen={sections.securitySettings}
                onToggle={() => toggleSection("securitySettings")}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <InputField label="MFA Enabled" name="employmentMfaEnabled" value={formData.employmentMfaEnabled} onChange={onChange} placeholder="Yes/No" />
                    <InputField label="Restricted IP Login" name="employmentRestrictedIpLogin" value={formData.employmentRestrictedIpLogin} onChange={onChange} placeholder="Yes/No" />
                    <InputField label="Device Access Controls" name="employmentDeviceAccessControls" value={formData.employmentDeviceAccessControls} onChange={onChange} placeholder="Yes/No" />

                    <InputField label="Last Role Updated By" name="employmentLastRoleUpdatedBy" value={formData.employmentLastRoleUpdatedBy} onChange={onChange} placeholder="Enter name" />
                </div>
            </AccordionItem>
        </div>
    );
};

export default Employment;
