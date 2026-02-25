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
import { employeeService } from '../../../../service';

const AddEmployee = () => {
    const navigate = useNavigate();
    const { tab } = useParams();
    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [employeeId, setEmployeeId] = useState(null);
    const [isEmployeeSaved, setIsEmployeeSaved] = useState(false);

    // On mount: always clear stale data and start fresh for a new employee
    useEffect(() => {
        localStorage.removeItem('createdEmployee');
        localStorage.removeItem('employeeSectionDrafts');
        setFormData({});
        setEmployeeId(null);
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
                // Update employeeId and populate form with returned data
                const userId = savedData?.user?.id || savedData?.id;
                if (userId) {
                    setEmployeeId(userId);
                }
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
                        {!isEmployeeSaved && (
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
                                    employeeName: formData.name || 'New Employee'
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