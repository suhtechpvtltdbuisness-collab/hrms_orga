import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import EmpUpdateEmployment from './EmpUpdateEmployment';
import EmpUpdateAttendance from './EmpUpdateAttendance';
import PersonalInfo from '../EmployeeTabs/PersonalInfo';
import EmpUpdateLeave from './EmpUpdateLeave';
import EmpUpdatePerformance from './EmpUpdatePerformance';
import EmpUpdateDocument from './EmpUpdateDocument';
import EmpUpdatePayroll from './EmpUpdatePayroll';
import EmpUpdateTrainingDevelopment from './EmpUpdateTrainingDevelopment';
import EmpUpdateOffBoarding from './EmpUpdateOffBoarding';
import EmpUpdateActivityLog from './EmpUpdateActivityLog';
import EmployeeProfileCard from '../EmployeeViewDetails/EmployeeProfileCard';
import { getEmployeeData, saveEmployeeData } from '../../../utils/employeeData';

const EmpUpdatePersonalInfo = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'Personal Information');
    const tabsRef = useRef(null);
    const [formData, setFormData] = useState(getEmployeeData());

    useEffect(() => {
        const el = tabsRef.current?.querySelector('[data-active="true"]');
        el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }, [activeTab]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const tabs = [
        "Personal Information",
        "Employment",
        "Attendance",
        "Leave",
        "Performance",
        "Documents",
        "Payroll",
        "Training & Development",
        "Off Boarding",
        "Activity Log"
    ];

    const tabPathMapping = {
        "Personal Information": "personal-information",
        "Employment": "employment",
        "Attendance": "attendance",
        "Leave": "leave",
        "Performance": "performance",
        "Documents": "documents",
        "Payroll": "payroll",
        "Training & Development": "training-development",
        "Off Boarding": "off-board",
        "Activity Log": "activity-log"
    };

    const handleBack = () => {
        const path = tabPathMapping[activeTab] || "personal-information";
        navigate(`/hrms/employees-details/${path}`);
    };

    const handleSave = () => {
        saveEmployeeData(formData);
        handleBack();
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Personal Information':
                return <PersonalInfo formData={formData} onChange={handleInputChange} />;
            case 'Employment':
                return <EmpUpdateEmployment />;

            case 'Attendance':
                return <EmpUpdateAttendance />;

            case 'Leave':
                return <EmpUpdateLeave />;

            case 'Performance':
                return <EmpUpdatePerformance />;

            case 'Documents':
                return <EmpUpdateDocument />;

            case 'Payroll':
                return <EmpUpdatePayroll />;

            case 'Training & Development':
                return <EmpUpdateTrainingDevelopment />;

            case 'Off Boarding':
                return <EmpUpdateOffBoarding />;

            case 'Activity Log':
                return <EmpUpdateActivityLog />;

            default:
                return (
                    <div className="p-10 text-center text-gray-500 bg-white min-h-[400px]">
                        {activeTab}
                    </div>
                );
        }
    };

    return (
        <div className="bg-white px-4 sm:px-6 md:px-8 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-9rem)] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-10rem)] xl:h-[calc(100vh-11rem)] flex flex-col border border-[#D9D9D9] font-sans" style={{ fontFamily: 'Poppins, sans-serif' }}>

            {/* Breadcrumb */}
            <div className="flex items-center text-sm mb-4 shrink-0">
                <span className="text-[#026E78] cursor-pointer hover:text-purple-600" onClick={() => navigate('/hrms/employees')}>Employee List</span>
                <ChevronRight size={16} className="mx-1 hover:text-purple-600" />
                <span className="text-[#667085] font-base">Employee details</span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-6 shrink-0">
                <h1 className="text-xl font-bold">Employee Information</h1>
                <div className="flex gap-4">
                    <button
                        onClick={handleBack}
                        className="px-6 py-2.5 border border-purple-600 text-purple-600 font-medium rounded-full hover:bg-purple-50 transition-colors bg-white"
                        style={{ width: '100px', borderRadius: '30px' }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2.5 bg-[#7D1EDB] text-white font-medium rounded-full hover:bg-purple-700 transition-colors shadow-sm"
                        style={{ width: '100px', borderRadius: '30px' }}
                    >
                        Save
                    </button>
                </div>
            </div>

            {/* Content Area - Split Layout */}
            <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 overflow-auto">

                {/* Left Side - Profile Card */}
                {activeTab === "Personal Information" && (
                    <div className="w-full lg:w-[320px] shrink-0 h-full">
                        <EmployeeProfileCard />
                    </div>
                )}

                {/* Right Side - Tabs & Content */}
                <div className="flex-1 min-w-0 h-full">
                    <div className="flex flex-col h-full bg-white border border-[#D9D9D9] rounded-[24px] overflow-hidden">

                        {/* Tabs Bar */}
                        <div className="sticky top-0 z-10 bg-white pt-3 pb-1 px-3 border-b border-gray-100">
                            <div ref={tabsRef} className="bg-[#EFEEE7] h-12 shrink-0 rounded-lg overflow-x-auto no-scrollbar flex">
                                {tabs.map((tab, index) => (
                                    <button
                                        key={tab}
                                        data-active={activeTab === tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 h-full flex items-center justify-center text-sm font-medium whitespace-nowrap transition-all
                                        ${index === 0 ? 'rounded-lg' : ''} 
                                        ${index === tabs.length - 1 ? 'rounded-lg' : ''}
                                        ${activeTab === tab
                                                ? 'bg-[#7D1EDB] text-white rounded-lg'
                                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}
                                    `}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content Area - Scrollable */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                            {renderContent()}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default EmpUpdatePersonalInfo;
