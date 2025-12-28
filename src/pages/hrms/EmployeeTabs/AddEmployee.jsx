import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, ArrowLeft } from 'lucide-react';
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

const AddEmployee = () => {
    const navigate = useNavigate();
    const { tab } = useParams();

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
        <div className="mx-5 mt-5 font-sans">
            {/* Main Content Container with Border */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden min-h-[calc(100vh-200px)]">

                {/* Breadcrumb */}
                <div className="flex items-center text-sm text-[#7D1EDB] my-3 mx-4">
                    <div className="flex items-center gap-3" onClick={() => navigate('/hrms/employees')}>
                        <ArrowLeft size={14} className="text-gray-900 cursor-pointer" />
                        <span className="cursor-pointer hover:text-purple-500" >Employee List</span>
                    </div>
                    <ChevronRight size={16} className="mx-1" />
                    <span className="text-[#667085] text-[14px] font-base">Add Employee</span>
                </div>

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 mx-4 gap-4 sm:gap-0">
                    <h1 className="text-xl font-bold text-gray-900">Add Employee</h1>
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


                <div className="border border-[#D9D9D9] mx-4 rounded-3xl h-[calc(100vh-200px)] mb-4 p-1 relative">

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
                            {activeTabObj.component || (
                                <div className="p-10 text-center text-gray-500 bg-white rounded-b-xl min-h-[400px]">
                                    {activeTabObj.name}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AddEmployee;
