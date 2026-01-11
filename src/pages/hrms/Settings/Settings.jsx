import React, { useState } from 'react';
import SettingsAccordion from './SettingsAccordion';
import EmployeeIDSettings from './EmployeeIDSettings';
import AttendanceSettings from './AttendanceSettings';
import LeaveSettings from './LeaveSettings';
import OnboardingSettings from './OnboardingSettings';
import PayrollSettings from './PayrollSettings';
import DepartmentSettings from './DepartmentSettings';
import RecruitmentSettings from './RecruitmentSettings';
import EmployeeDocumentSettings from './EmployeeDocumentSettings';
import NotificationSettings from './NotificationSettings';
import OrganizationSettings from './OrganizationSettings';

const Settings = () => {
    const [openSections, setOpenSections] = useState([]);

    const settingsSections = [
        { id: 1, title: 'Employee ID Settings', component: <EmployeeIDSettings /> },
        { id: 2, title: 'Attendance Settings', component: <AttendanceSettings /> },
        { id: 3, title: 'Leave And Holiday Settings', component: <LeaveSettings /> },
        { id: 4, title: 'Onboarding Settings', component: <OnboardingSettings /> },
        { id: 5, title: 'Payroll Settings', component: <PayrollSettings /> },
        { id: 6, title: 'Department And Designation Settings', component: <DepartmentSettings /> },
        { id: 7, title: 'Recruitment Settings', component: <RecruitmentSettings /> },
        { id: 8, title: 'Employee Document Settings', component: <EmployeeDocumentSettings /> },
        { id: 9, title: 'Notification Settings', component: <NotificationSettings /> },
        { id: 10, title: 'Organization Settings', component: <OrganizationSettings /> },
    ];

    const toggleSection = (id) => {
        setOpenSections(prev =>
            prev.includes(id)
                ? prev.filter(sectionId => sectionId !== id)
                : [...prev, id]
        );
    };

    return (
        <div
            className="bg-white px-4 sm:px-6 md:px-8 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-9rem)] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-10rem)] xl:h-[calc(100vh-11rem)] overflow-y-auto border border-[#D9D9D9] flex flex-col font-['Poppins',sans-serif]"
        >
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-[20px] font-semibold text-gray-600 leading-[140%] capitalize font-['Poppins']">
                    Settings
                </h1>
            </div>

            {/* Settings Sections Container */}
            <div className="bg-white rounded-[24px] border border-[#D9D9D9] p-4 flex-1 overflow-y-auto">
                <div className="space-y-3">
                    {settingsSections.map((section) => (
                        <SettingsAccordion
                            key={section.id}
                            title={section.title}
                            open={openSections.includes(section.id)}
                            onClick={() => toggleSection(section.id)}
                        >
                            {section.component || (
                                <p className="text-sm text-gray-600">
                                    Content for {section.title} will be displayed here.
                                </p>
                            )}
                        </SettingsAccordion>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Settings;
