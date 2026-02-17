import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { userService } from '../../../../service';
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
    const [formData, setFormData] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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

    const handleSave = async () => {
        if (!formData.name || !formData.email || !formData.password) {
            toast.error("Please fill in all required fields (Name, Email, Password)");
            return;
        }

        const payload = {
            ...formData,
            isAdmin: false,
            type: "employee",
            // Map specific fields if needed, e.g., contact info
            eContactName: formData.contactName,
            eContactNumber: formData.contactNumber,
            eRelation: formData.relation,
            // Ensure department and designation are sent if selected
            department: formData.department, // IDs from dropdown
            designation: formData.designation 
        };

        try {
            const response = await userService.createEmployee(payload);
            if (response.success) {
                toast.success("Employee created successfully!");
                navigate('/hrms/employees');
            } else {
                toast.error(response.message || "Failed to create employee");
            }
        } catch (error) {
            console.error("Error creating employee:", error);
            toast.error("An error occurred");
        }
    };

    return (
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0 shrink-0">
                <h1 className="text-xl font-bold text-gray-900">Add Employee</h1>
                <div className="flex gap-4 w-full sm:w-auto">
                    <button
                        onClick={() => navigate('/hrms/employees')}
                        className="px-6 py-2.5 border border-purple-600 text-purple-600 font-medium rounded-full hover:bg-purple-50 transition-colors bg-white w-full sm:w-[100px]"
                        style={{ borderRadius: '30px' }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2.5 bg-[#7D1EDB] text-white font-medium rounded-full hover:bg-purple-700 transition-colors shadow-sm w-full sm:w-[100px]"
                        style={{ borderRadius: '30px' }}
                    >
                        Save
                    </button>
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
                            React.cloneElement(activeTabObj.component, { formData, onChange: handleInputChange })
                        ) : (
                            <div className="p-10 text-center text-gray-500 bg-white rounded-b-xl min-h-[400px]">
                                {activeTabObj.name}
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AddEmployee;