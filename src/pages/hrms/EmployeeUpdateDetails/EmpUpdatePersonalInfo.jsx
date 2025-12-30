import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import EmpUpdateEmployment from './EmpUpdateEmployment';
import EmpUpdateAttendance from './EmpUpdateAttendance';
import PersonalInfo from '../EmployeeTabs/PersonalInfo';
import EmpUpdateLeave from './EmpUpdateLeave';


const EmpUpdatePersonalInfo = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Personal Information');

    const tabs = [
        "Personal Information",
        "Employment",
        "Attendance",
        "Leave",
        "Performance",
        "Documents",
        "Payroll",
        "Training & Development",
        "Off Borading",
        "Activity Log"
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'Personal Information':
                return <PersonalInfo />;
            case 'Employment':
                return <EmpUpdateEmployment />;

            case 'Attendance':
                return <EmpUpdateAttendance />;

            case 'Leave':
                return <EmpUpdateLeave />;
            default:
                return (
                    <div className="p-10 text-center text-gray-500 bg-white rounded-b-xl min-h-[400px]">
                        {activeTab}
                    </div>
                );
        }
    };

    return (
        <div className="mx-5 mt-5 font-sans">


            {/* Main Content Container with Border */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden min-h-[calc(100vh-200px)]">

                {/* Breadcrumb */}
                <div className="flex items-center text-sm text-gray-500 my-3 mx-3">
                    <span className="cursor-pointer hover:text-purple-600" onClick={() => navigate('/hrms/employees')}>Employees</span>
                    <ChevronRight size={16} className="mx-1" />
                    <span className="text-gray-900 font-medium"> Employee Details </span>
                </div>

                {/* Header */}
                <div className="flex justify-between items-center mb-6 mx-3">
                    <h1 className="text-xl font-bold text-gray-900">Employee Details</h1>
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/hrms/employees')}
                            className="px-6 py-2.5 border border-purple-600 text-purple-600 font-medium rounded-full hover:bg-purple-50 transition-colors bg-white"
                            style={{ width: '100px', borderRadius: '30px' }}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-6 py-2.5 bg-[#7D1EDB] text-white font-medium rounded-full hover:bg-purple-700 transition-colors shadow-sm"
                            style={{ width: '100px', borderRadius: '30px' }}
                        >
                            Save
                        </button>
                    </div>
                </div>
                <div className="border border-[#D9D9D9] mx-4 rounded-3xl h-[calc(100vh-200px)] mb-4 py-2 flex flex-col">
                    {/* Tabs Bar */}
                    <div className="bg-[#EFEEE7] mx-4 mt-4 h-12 shrink-0 rounded-lg overflow-x-auto no-scrollbar flex">
                        {tabs.map((tab, index) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 h-full flex items-center justify-center text-sm font-medium whitespace-nowrap transition-all
                                ${index === 0 ? 'rounded-lg' : ''} 
                                ${index === tabs.length - 1 ? 'rounded-lg' : ''}
                                ${activeTab === tab
                                        ? 'bg-[#7D1EDB] text-white rounded-lg' 
                                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Content Area - inside the same container */}
                    <div className="p-2 mx-2 flex-1 overflow-y-auto custom-scrollbar">
                        {renderContent()}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default EmpUpdatePersonalInfo;
