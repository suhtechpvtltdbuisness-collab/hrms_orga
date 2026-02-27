import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { Toast } from '../../../../components/common/Toast';
import PersonalInfo from './PersonalInfo';
import Employment from './Employment';
import Attendance from './Attendance';
import Leave from './Leave';
import Performance from './Performance';
import Documents from './Documents';
import Payroll from './Payroll';
import TrainingDevelopment from './TrainingDevelopment';
import OffBoarding from './OffBoarding';
import ActivityLog from './ActivityLog';
import { employeeService, leaveService, performanceService, payrollService } from '../../../../service';

const AddEmployee = () => {
    const navigate = useNavigate();
    const { tab } = useParams();
    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [isEmployeeSaved, setIsEmployeeSaved] = useState(false);
    const [leaveSavedAt, setLeaveSavedAt] = useState(null);             // triggers Leave list refresh
    const [performanceSavedAt, setPerformanceSavedAt] = useState(null);  // triggers Performance list refresh
    const [payrollSavedAt, setPayrollSavedAt] = useState(null);          // triggers Payroll list refresh

    // ═══════════════════════════════════════════════════════════════════
    // CENTRALIZED ID STORE
    // After POST /users, two different IDs come back:
    //   userId : users table primary key   → used by /employment API (field: employeeId)
    //   empId  : employees table primary key → used by /leave API (field: empId)
    //            and any future APIs that reference the employees table
    //
    // ADD A NEW API? Just pick the right ID:
    //   → References users table?     use ids.userId
    //   → References employees table? use ids.empId
    // ═══════════════════════════════════════════════════════════════════
    const [ids, setIds] = useState({ userId: null, empId: null });

    // Convenience aliases (backward compat with existing code)
    const employeeId = ids.userId;
    const empId = ids.empId;

    // ── Helper: extract both IDs from POST /users response ────────────
    const extractEmployeeIds = (savedData) => {
        // userId  → always at savedData.user.id (users table)
        const userId = savedData?.user?.id ?? savedData?.id ?? null;

        // empId   → the employees table record created alongside the user
        // Try every known response shape the backend might return:
        const empId =
            savedData?.employee?.id ??  // { employee: { id: X } }
            savedData?.user?.employee?.id ??  // { user: { employee: { id: X } } }
            savedData?.employeeId ??  // { employeeId: X } at root
            savedData?.user?.employeeId ??  // { user: { employeeId: X } }
            userId;                            // last resort: same as userId

        console.log('[IDs] userId (→ /employment employeeId):', userId);
        console.log('[IDs] empId  (→ /leave empId)           :', empId);
        return { userId, empId };
    };

    // On mount: always clear stale data and start fresh for a new employee
    useEffect(() => {
        localStorage.removeItem('createdEmployee');
        localStorage.removeItem('employeeSectionDrafts');
        localStorage.removeItem('createdEmployeeIds');
        setFormData({});
        setIds({ userId: null, empId: null });
        setIsEmployeeSaved(false);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const sectionFieldMap = {
        'personal-information': [
            'name', 'email', 'phone', 'password', 'employeeId', 'gender', 'dob', 'bloodGroup',
            'maritalStatus', 'address', 'contactName', 'contactNumber', 'relation', 'aadharNo',
            'pancardNo'
        ],
        employment: [
            'employmentJobTitle', 'employmentDepartment', 'employmentTeamSubDepartment',
            'employmentReportingManager', 'employmentReportingManagerAlt',
            'employmentJoiningDate', 'employmentWorkLocation', 'employmentBranch',
            'employmentProbationPeriod', 'employmentProbationPeriodAlt', 'employmentConfirmDate',
            'employmentStatus', 'employmentStatusAlt', 'employmentProbationEndDate',
            'employmentContractType', 'employmentContractTypeAlt', 'employmentContractStartDate',
            'employmentContractEndDate', 'employmentContractDuration', 'employmentContractPay',
            'employmentRenewalStatus', 'employmentWorkMode', 'employmentCurrentShift',
            'employmentShiftTimings', 'employmentWeeklyOffPatterns', 'employmentOvertimeEligibility',
            'employmentScheduleTemplates', 'employmentAssignedShift', 'employmentShiftStartTime',
            'employmentShiftEndTime', 'employmentBreakTimings', 'employmentWeeklyOff',
            'employmentWeeklySchedule', 'employmentWorkingHoursPerDay', 'employmentTotalWeeklyWorkHours',
            'employmentFlexibleHours', 'employmentCustomSchedule', 'employmentMonthlyRosterCalendar',
            'employmentRotationalShiftCycle', 'employmentUpcomingShiftAssignment', 'employmentSwapRequests',
            'employmentAttendanceLinkedRoster', 'employmentPrimaryRoles', 'employmentAdditionalRoles',
            'employmentModuleAccess', 'employmentModuleAccessAlt', 'employmentRoleEffectiveDate',
            'employmentPermissionLevels', 'employmentAccessScope', 'employmentApprovalRights',
            'employmentDataVisibility', 'employmentSpecialPermission', 'employmentMfaEnabled',
            'employmentRestrictedIpLogin', 'employmentDeviceAccessControls', 'employmentLastRoleUpdatedBy'
        ],
        leave: [
            'totalLeavesAllocated', 'sickLeavesBalance', 'casualLeavesBalance', 'paidLeavesBalance',
            'lossOfPayDays', 'carryForwardLeaves', 'compOfEarned', 'compOfAvailed'
        ]
    };

    const saveSectionDraft = (sectionKey) => {
        const fields = sectionFieldMap[sectionKey] || [];
        const sectionData = fields.reduce((acc, key) => {
            if (formData[key] !== undefined) {
                acc[key] = formData[key];
            }
            return acc;
        }, {});

        const drafts = JSON.parse(localStorage.getItem('employeeSectionDrafts') || '{}');
        drafts[sectionKey] = sectionData;
        localStorage.setItem('employeeSectionDrafts', JSON.stringify(drafts));
    };

    const handleSave = async () => {
        const activeSection = activeTabObj?.path || 'personal-information';

        // ════════════════════════════════════════════════════════════
        // EMPLOYMENT TAB → POST /employment
        // ════════════════════════════════════════════════════════════
        if (activeSection === 'employment') {
            if (!employeeId) {
                setToast({
                    type: 'error',
                    title: 'Save Personal Info First',
                    message: 'Please save Personal Information first to create the employee before adding employment details.'
                });
                return;
            }
            setIsLoading(true);
            try {
                // Convert DD/MM/YYYY → YYYY-MM-DD (PostgreSQL expects this format)
                const toISO = (d) => {
                    if (!d) return null;
                    const p = d.split('/');
                    return p.length === 3 ? `${p[2]}-${p[1]}-${p[0]}` : d;
                };

                const payload = {
                    employeeId: Number(employeeId),
                    departmentId: Number(formData.employmentDepartmentId) || null,
                    jobTitle: formData.employmentJobTitle || '',
                    subDepartment: formData.employmentTeamSubDepartment || '',
                    reportingManager: Number(formData.employmentReportingManagerId) || null,
                    dateOfJoining: toISO(formData.employmentJoiningDate),
                    workLocation: formData.employmentWorkLocation || '',
                    branch: formData.employmentBranch || '',
                    prohibitionPeriod: formData.employmentProbationPeriod || '',
                    confirmDate: toISO(formData.employmentConfirmDate),
                    empStatus: formData.employmentStatus?.toLowerCase() !== 'inactive',
                    prohibitionEnd: toISO(formData.employmentProbationEndDate),
                    contractType: formData.employmentContractType || '',
                    contractStart: toISO(formData.employmentContractStartDate),
                    contractEnd: toISO(formData.employmentContractEndDate),
                    contractPay: formData.employmentContractPay || '',
                    contractDuration: formData.employmentContractDuration || '',
                    renewalStatus: formData.employmentRenewalStatus?.toLowerCase() === 'yes',
                    workMode: formData.employmentWorkMode || '',
                    currentShift: Number(formData.employmentCurrentShift) || null,
                    shiftTiming: formData.employmentShiftTimings || '',
                    assignedTemplate: formData.employmentScheduleTemplates || '',
                    weeklyPattern: formData.employmentWeeklyOffPatterns || '',
                    overtime: formData.employmentOvertimeEligibility || '',
                    assignedShift: formData.employmentAssignedShift || '',
                    shiftStartTime: formData.employmentShiftStartTime || '',
                    shiftEndTime: formData.employmentShiftEndTime || '',
                    weeklyOff: formData.employmentWeeklyOff || '',
                    breakTiming: formData.employmentBreakTimings || '',
                    weeklySchedule: formData.employmentWeeklySchedule || '',
                    workingHours: Number(formData.employmentWorkingHoursPerDay) || 0,
                    totalWeeklyHours: Number(formData.employmentTotalWeeklyWorkHours) || 0,
                    customScheduled: formData.employmentCustomSchedule?.toLowerCase() === 'yes',
                    flexibleHours: Number(formData.employmentFlexibleHours) || 0,
                    monthlyRosterCalendar: formData.employmentMonthlyRosterCalendar || '',
                    rotationShiftCycle: formData.employmentRotationalShiftCycle || '',
                    upcomingShiftCycle: formData.employmentUpcomingShiftAssignment || '',
                    attendanceLinked: formData.employmentAttendanceLinkedRoster?.toLowerCase() === 'yes',
                    swapRequest: formData.employmentSwapRequests || '',
                    primaryRoles: formData.employmentPrimaryRoles || '',
                    additionalRoles: formData.employmentAdditionalRoles || '',
                    moduleAccess: formData.employmentModuleAccess || '',
                    roleEffectiveFrom: toISO(formData.employmentRoleEffectiveDate),
                    level: Number(formData.employmentPermissionLevels) || 0,
                    accessScope: formData.employmentAccessScope || '',
                    approvalRight: formData.employmentApprovalRights?.toLowerCase() === 'yes',
                    specialPermission: formData.employmentSpecialPermission || '',
                    dataVisibility: formData.employmentDataVisibility || '',
                };

                console.log('[Employment] POST /employment payload:', payload);
                const response = await employeeService.addEmploymentDetails(payload);
                console.log('[Employment] Response:', response);

                setToast(
                    response.success
                        ? { type: 'success', title: 'Employment Saved!', message: 'Employment details saved successfully.' }
                        : { type: 'error', title: 'Save Failed', message: response.message || 'Failed to save employment details.' }
                );
            } catch (err) {
                console.error('[Employment] Error:', err);
                setToast({ type: 'error', title: 'Error', message: 'Something went wrong while saving employment details.' });
            } finally {
                setIsLoading(false);
            }
            return;
        }

        // ════════════════════════════════════════════════════════════
        // LEAVE TAB → POST /leave
        // ════════════════════════════════════════════════════════════
        if (activeSection === 'leave') {
            if (!employeeId) {
                setToast({
                    type: 'error',
                    title: 'Save Personal Info First',
                    message: 'Please save Personal Information first before adding leave details.'
                });
                return;
            }
            setIsLoading(true);
            try {
                // Payload: { empId=userId, sickLeave, casualLeave, paidLeave, total }
                // empId = userId (users table ID) — confirmed by backend team
                const sick = Number(formData.sickLeave) || 0;
                const casual = Number(formData.casualLeave) || 0;
                const paid = Number(formData.paidLeave) || 0;

                const leavePayload = {
                    // empId → employees table ID (resolved via GET /users/employee/:userId)
                    // employeeId (userId) is for /employment API only
                    empId: Number(empId || employeeId), // empId = employees table PK
                    sickLeave: sick,
                    casualLeave: casual,
                    paidLeave: paid,
                    total: sick + casual + paid,        // auto-calculated
                };

                console.log('[Leave] payload:', leavePayload);
                const response = await leaveService.addLeave(leavePayload);
                console.log('[Leave] Response:', response);

                setToast(
                    response.success
                        ? { type: 'success', title: 'Leave Saved!', message: 'Leave details saved successfully.' }
                        : { type: 'error', title: 'Save Failed', message: response.message || 'Failed to save leave details.' }
                );
                // Trigger Leave list to re-fetch after successful save
                if (response.success) setLeaveSavedAt(Date.now());
            } catch (err) {
                console.error('[Leave] Error:', err);
                setToast({ type: 'error', title: 'Error', message: 'Something went wrong while saving leave details.' });
            } finally {
                setIsLoading(false);
            }
            return;
        }

        // ════════════════════════════════════════════════════════════
        // PERFORMANCE TAB → POST /performance
        // ════════════════════════════════════════════════════════════
        if (activeSection === 'performance') {
            if (!employeeId) {
                setToast({ type: 'error', title: 'Save Personal Info First', message: 'Please save Personal Information first.' });
                return;
            }
            // Performance fields are stored as __perfMeta in formData (set by Performance component)
            const perfMeta = formData.__perfMeta || {};
            const date = perfMeta.date || formData.date || '';
            const status = perfMeta.status || formData.status || '';
            const rating = Number(perfMeta.rating || formData.rating || 0);

            if (!date || !status || !rating) {
                setToast({ type: 'error', title: 'Incomplete', message: 'Please fill Date, Status, and Rating before saving.' });
                return;
            }
            setIsLoading(true);
            try {
                const perfPayload = {
                    empId: Number(empId || employeeId), // employees table ID
                    date: date,
                    rating: rating,
                    status: status,
                };
                console.log('[Performance] payload:', perfPayload);
                const response = await performanceService.addPerformance(perfPayload);
                console.log('[Performance] Response:', response);
                setToast(
                    response.success
                        ? { type: 'success', title: 'Performance Saved!', message: 'Performance record saved successfully.' }
                        : { type: 'error', title: 'Save Failed', message: response.message || 'Failed to save performance.' }
                );
                if (response.success) setPerformanceSavedAt(Date.now());
            } catch (err) {
                console.error('[Performance] Error:', err);
                setToast({ type: 'error', title: 'Error', message: 'Something went wrong while saving performance.' });
            } finally {
                setIsLoading(false);
            }
            return;
        }

        // ════════════════════════════════════════════════════════════
        // PAYROLL TAB → POST /payroll
        // ════════════════════════════════════════════════════════════
        if (activeSection === 'payroll') {
            if (!employeeId) {
                setToast({ type: 'error', title: 'Save Personal Info First', message: 'Please save Personal Information first.' });
                return;
            }
            setIsLoading(true);
            try {
                const payrollPayload = {
                    empId: Number(empId || employeeId),
                    structure: formData.structure || '',
                    ctc: formData.ctc || '0',
                    monthlyGross: formData.monthlyGross || '0',
                    monthlyPay: formData.monthlyPay || '0',
                    paymentMode: formData.paymentMode || 'bank_transfer',
                    departmentId: Number(formData.departmentId) || 0,
                    baseSalary: formData.baseSalary || '0',
                    hra: formData.hra || '0',
                    conveyancePay: formData.conveyancePay || '0',
                    overtimePay: formData.overtimePay || '0',
                    specialPay: formData.specialPay || '0',
                };
                console.log('[Payroll] payload:', payrollPayload);
                const response = await payrollService.addPayroll(payrollPayload);
                console.log('[Payroll] Response:', response);
                setToast(
                    response.success
                        ? { type: 'success', title: 'Payroll Saved!', message: 'Payroll details saved successfully.' }
                        : { type: 'error', title: 'Save Failed', message: response.message || 'Failed to save payroll.' }
                );
                if (response.success) setPayrollSavedAt(Date.now());
            } catch (err) {
                console.error('[Payroll] Error:', err);
                setToast({ type: 'error', title: 'Error', message: 'Something went wrong while saving payroll.' });
            } finally {
                setIsLoading(false);
            }
            return;
        }

        // ════════════════════════════════════════════════════════════
        // OTHER TABS (Attendance, Documents, etc.) → localStorage draft
        // ════════════════════════════════════════════════════════════
        if (activeSection !== 'personal-information') {
            saveSectionDraft(activeSection);
            setToast({
                type: 'success',
                title: 'Saved',
                message: `${activeTabObj?.name || 'Section'} details saved successfully`
            });
            return;
        }

        // Validate required fields
        if (!formData.name || !formData.email || !formData.password) {
            setToast({
                type: 'error',
                title: 'Validation Error',
                message: 'Please fill in Name, Email, and Password before saving.'
            });
            return;
        }

        setIsLoading(true);
        try {
            // Map form data to API format
            const employeeData = {
                name: formData.name || '',
                gender: formData.gender || '',
                dob: formData.dob || '',
                bloodGroup: formData.bloodGroup || '',
                password: formData.password || '',
                isAdmin: formData.isAdmin || false,
                maritalStatus: formData.maritalStatus === 'married',
                type: formData.type || 'employee',
                eContactName: formData.contactName || '',
                eContactNumber: formData.contactNumber || '',
                eRelation: formData.relation || '',
                email: formData.email || '',
                phone: formData.phone || '',
                address: formData.address || '',
            };

            const response = await employeeService.addEmployee(employeeData);

            if (response.success) {
                const savedData = response.data;
                // Store in localStorage for other tabs to use
                if (savedData) {
                    localStorage.setItem('createdEmployee', JSON.stringify(savedData));
                }

                // Log full response so we can see the exact shape
                console.log('[AddEmployee] Full API response data:', JSON.stringify(savedData, null, 2));

                // ── Step 1: Extract userId from POST /users response ──────
                const extractedIds = extractEmployeeIds(savedData);
                const userId = extractedIds.userId;

                // ── Step 2: Fetch the employees table record to get empId ──
                // POST /users creates a user AND an employee record, but the
                // response may not include employee.id directly.
                // GET /users/employee/:userId returns the full employee record
                // including the employees table primary key (empId).
                let resolvedEmpId = extractedIds.empId; // may equal userId if not found
                try {
                    const empRes = await employeeService.getEmployee(userId);
                    console.log('[IDs] GET /users/employee response:', empRes);
                    if (empRes.success && empRes.data) {
                        const emp = empRes.data;
                        // employees table ID can be at emp.id or emp.employee?.id
                        resolvedEmpId =
                            emp?.employee?.id ??
                            emp?.id ??
                            emp?.empId ??
                            resolvedEmpId;
                    }
                } catch (e) {
                    console.warn('[IDs] Could not fetch employee record, using fallback empId:', resolvedEmpId);
                }

                console.log('[IDs] Final userId:', userId, '| Final empId:', resolvedEmpId);
                const finalIds = { userId, empId: resolvedEmpId };
                setIds(finalIds);
                localStorage.setItem('createdEmployeeIds', JSON.stringify(finalIds));
                // Populate formData with returned API data so it displays correctly
                if (savedData?.user) {
                    setFormData(prev => ({
                        ...prev,
                        name: savedData.user.name || prev.name,
                        email: savedData.user.email || prev.email,
                        phone: savedData.user.phone || prev.phone,
                        gender: savedData.user.gender || prev.gender,
                        dob: savedData.user.dob || prev.dob,
                        bloodGroup: savedData.user.bloodGroup || prev.bloodGroup,
                        maritalStatus: savedData.user.maritalStatus ? 'married' : (prev.maritalStatus || 'single'),
                        address: savedData.user.address || prev.address,
                        contactName: savedData.user.eContactName || prev.contactName,
                        contactNumber: savedData.user.eContactNumber || prev.contactNumber,
                        relation: savedData.user.eRelation || prev.relation,
                        employeeId: savedData.user.id || prev.employeeId,
                    }));
                }
                setIsEmployeeSaved(true);
                setToast({
                    type: 'success',
                    title: 'Employee Added!',
                    message: `${savedData?.user?.name || 'Employee'} has been added successfully. You can now fill other sections.`
                });
            } else {
                setToast({
                    type: 'error',
                    title: 'Failed',
                    message: response.message || 'Failed to add employee'
                });
            }
        } catch (error) {
            setToast({
                type: 'error',
                title: 'Error',
                message: 'Something went wrong while adding employee'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const tabConfig = [
        { name: "Personal Information", path: "personal-information", component: <PersonalInfo /> },
        { name: "Employment", path: "employment", component: <Employment /> },
        { name: "Attendance", path: "attendance", component: <Attendance /> },
        { name: "Leave", path: "leave", component: <Leave /> },
        { name: "Performance", path: "performance", component: <Performance /> },
        { name: "Documents", path: "documents", component: <Documents /> },
        { name: "Payroll", path: "payroll", component: <Payroll /> },
        { name: "Training & Development", path: "training-development", component: <TrainingDevelopment /> },
        { name: "Off Boarding", path: "off-board", component: <OffBoarding /> },
        { name: "Activity Log", path: "activity-log", component: <ActivityLog /> }
    ];


    const activeTabObj = tabConfig.find(t => t.path === tab) || tabConfig[0];

    const tabsContainerRef = useRef(null);

    useEffect(() => {
        if (tabsContainerRef.current) {
            const activeTabElement = tabsContainerRef.current.querySelector('[data-active="true"]');
            if (activeTabElement) {
                activeTabElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }
    }, [activeTabObj]);

    return (
        <>
            <Toast toast={toast} onClose={() => setToast(null)} />
            <div className="bg-white px-4 sm:px-6 md:px-8 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-9rem)] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-10rem)] xl:h-[calc(100vh-11rem)] flex flex-col border border-[#D9D9D9] font-sans" style={{ fontFamily: 'Poppins, sans-serif' }}>

                {/* Breadcrumb */}
                <div className="flex items-center text-sm text-[#7D1EDB] mb-3 shrink-0">
                    <div className="flex items-center gap-3" onClick={() => navigate('/hrms/employees')}>
                        <ArrowLeft size={14} className="text-gray-900 cursor-pointer" />
                        <span className="cursor-pointer hover:text-purple-500" >Employee List</span>
                    </div>
                    <ChevronRight size={16} className="mx-1" />
                    <span className="text-[#667085] text-[14px] font-base">Add Employee</span>
                </div>

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 sm:gap-0 shrink-0">
                    <h1 className="text-xl font-bold text-gray-900">
                        {isEmployeeSaved ? `Employee: ${formData.name || 'Added'}` : 'Add Employee'}
                    </h1>
                    <div className="flex gap-4 w-full sm:w-auto">
                        <button
                            onClick={() => navigate('/hrms/employees')}
                            className="px-6 py-2.5 border border-purple-600 text-purple-600 font-medium rounded-full hover:bg-purple-50 transition-colors bg-white w-full sm:w-[110px]"
                            style={{ borderRadius: '30px' }}
                        >
                            {isEmployeeSaved ? 'Employee List' : 'Cancel'}
                        </button>
                        {/* Save button: always show on non-personal-info tabs after employee created */}
                        {(!isEmployeeSaved || activeTabObj?.path !== 'personal-information') && (
                            <button
                                onClick={handleSave}
                                disabled={isLoading}
                                className="px-6 py-2.5 bg-[#7D1EDB] text-white font-medium rounded-full hover:bg-purple-700 transition-colors shadow-sm w-full sm:w-[100px] disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ borderRadius: '30px' }}
                            >
                                {isLoading ? 'Saving...' : 'Save'}
                            </button>
                        )}
                        {isEmployeeSaved && employeeId && (
                            <button
                                onClick={() => navigate(`/hrms/employees-details/${employeeId}/personal-information`)}
                                className="px-6 py-2.5 bg-[#7D1EDB] text-white font-medium rounded-full hover:bg-purple-700 transition-colors shadow-sm w-full sm:w-[140px]"
                                style={{ borderRadius: '30px' }}
                            >
                                View Employee
                            </button>
                        )}
                    </div>
                </div>




                <div className="border border-[#D9D9D9] rounded-3xl mb-0 p-1 relative flex-1 min-h-0 flex flex-col">

                    <div className="overflow-y-auto custom-scrollbar h-full rounded-[20px]">

                        {/* Tabs Bar */}
                        <div className="sticky top-0 z-10 bg-white pt-3 pb-1 px-3">
                            <div
                                ref={tabsContainerRef}
                                className="bg-[#EFEEE7] h-12 shrink-0 rounded-lg overflow-x-auto no-scrollbar flex"
                            >
                                {tabConfig.map((t, index) => (
                                    <button
                                        key={t.path}
                                        data-active={activeTabObj.path === t.path}
                                        onClick={() => navigate(`/hrms/employees/add/${t.path}`)}
                                        className={`px-4 h-full flex items-center justify-center text-sm font-medium whitespace-nowrap transition-all
                                    ${index === 0 ? 'rounded-lg' : ''} 
                                    ${index === tabConfig.length - 1 ? 'rounded-lg' : ''}
                                    ${activeTabObj.path === t.path
                                                ? 'bg-[#7D1EDB] text-white rounded-lg'
                                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                                            }`}
                                    >
                                        {t.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-2 mx-1 flex-1">
                            {activeTabObj.component ? (
                                React.cloneElement(activeTabObj.component, {
                                    formData,
                                    onChange: handleInputChange,
                                    employeeId: employeeId,
                                    empId: empId,
                                    employeeName: formData.name || 'New Employee',
                                    leaveSavedAt,
                                    performanceSavedAt,
                                    payrollSavedAt,
                                })
                            ) : (
                                <div className="p-10 text-center text-gray-500 bg-white rounded-b-xl min-h-[400px]">
                                    {activeTabObj.name}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
};

export default AddEmployee;