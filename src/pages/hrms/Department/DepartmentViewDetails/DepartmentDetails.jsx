import React, { useState, useEffect } from 'react';
import { ChevronLeft, Trash2 } from 'lucide-react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import DeleteDepartment from './DeleteDepartment';

const DepartmentDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(null);

    const defaultDepartment = {
        name: "Finance",
        description: "Financial Panning, Reporting And Analysis Department Responsible For Company Finances",
        head: "John Smith",
        employees: "18",
        location: "Delhi",
        createdOn: "15/01/2023",
        lastUpdated: "11/10/2024",
        status: "Active",
        headDesignation: "Sales",
        headEmail: "john12@gmail.com",
        headJoinedDate: "15/01/2023",
        headStatus: "Active"
    };

    const [departmentInfo, setDepartmentInfo] = useState({
        ...defaultDepartment,
        ...(location.state?.department || {})
    });

    useEffect(() => {
        if (departmentInfo) {
            setFormData(departmentInfo);
        }
    }, [departmentInfo]);

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleEditClick = () => {
        setIsEditing(true);
        if (!formData) setFormData(departmentInfo);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setFormData(departmentInfo);
    };

    const handleSaveClick = () => {
        setIsEditing(false);
        if (formData) {
            setDepartmentInfo(formData); 
            console.log("Saving data:", formData);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const currentTab = location.pathname.split('/').pop().toLowerCase();

    const tabs = [
        { label: 'Overview', path: 'overview' },
        { label: 'Employees', path: 'employees' },
        { label: 'Org Structure', path: 'org-structure' },
        { label: 'Settings', path: 'settings' }
    ];

    const activeTabObj = tabs.find(t => t.path === currentTab) || tabs[0];
    const activeTab = activeTabObj.label;

    const handleTabClick = (path) => {
        navigate(path, { state: { department: isEditing ? formData : departmentInfo } });
    };

    return (
        <div className="bg-white p-4 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-9rem)] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-10rem)] xl:h-[calc(100vh-11rem)] flex flex-col border border-[#D9D9D9] font-sans" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>

            {/* Breadcrumb */}
            <div className="flex items-center text-[14px] text-[#7D1EDB] mb-4 shrink-0" style={{ fontFamily: 'Mulish, sans-serif' }}>
                <div className="flex items-center gap-3" onClick={() => navigate('/hrms/departments')}>
                    <img src="/images/arrow_left_alt.svg" alt="Back" className="cursor-pointer" />
                    <span className="font-normal cursor-pointer hover:text-purple-500">Department List</span>
                </div>
                <ChevronLeft size={16} className="mx-1 rotate-180" />
                <span className="text-[#667085] text-[14px] font-normal">Department Details</span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-start mb-6 shrink-0">
                <div>
                    <h1 className="text-[20px] font-semibold  text-[#494949]">{formData?.name || departmentInfo.name}</h1>
                    <p className="text-[#8C8C8C] font-light text-[17px]">{formData?.description || departmentInfo.description}</p>
                </div>
                <div className="flex gap-4">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleCancelClick}
                                className="flex items-center justify-center text-[16px] font-medium mt-1 pt-0.5 w-[100px] h-[48px] border border-[#7D1EDB] text-[#7D1EDB] rounded-full hover:bg-[#EEECFF] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveClick}
                                className="flex items-center justify-center text-[16px] font-medium mt-1 pt-0.5 w-[100px] h-[48px] bg-[#7D1EDB] text-white rounded-full hover:bg-[#6c1ac0] transition-colors"
                            >
                                Save
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleEditClick}
                            className="flex items-center justify-center text-[16px] font-medium mt-1 pt-0.5 gap-[14px] w-[100px] h-[48px] border border-[#7D1EDB] text-[#7D1EDB] rounded-full hover:bg-[#EEECFF] transition-colors"
                        >
                            <span>Edit</span>
                            <img src="/images/pencil_Icon.svg" alt="Edit" style={{ height: '14px', width: '14px' }} />
                        </button>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-2 bg-[#EEECFF] py-[7px] px-[9px] rounded-lg shrink-0" style={{ width: '500px', height: '49.93px' }}>
                {tabs.map((tab) => (
                    <button
                        key={tab.label}
                        onClick={() => handleTabClick(tab.path)}
                        className={`px-5 py-2 rounded-[11px] text-[16px] font-medium cursor-pointer transition-all ${activeTab === tab.label
                            ? 'bg-[#7D1EDB] text-white '
                            : 'text-[#000000] hover:text-[#1E1E1E]'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>


            <Outlet context={{ departmentInfo, isEditing, formData, handleInputChange }} />

            {/* Delete Button */}
            <div className="mt-4 mb-4 px-2 shrink-0">
                <button
                    onClick={handleDeleteClick}
                    className="flex items-center gap-2 px-6 py-3 bg-[#FF383C] text-white text-[17px] font-Poppins font-medium rounded-full hover:bg-[#E03125] transition-colors "
                >
                    <span>Delete Department</span>
                    <img src="/images/Trash.svg" alt="trash" style={{ height: '18px', width: '17px' }} />
                </button>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <DeleteDepartment
                    onCancel={() => setShowDeleteModal(false)}
                    onDelete={() => {
                        setTimeout(() => {
                            navigate(-1);
                        }, 2000);
                    }}
                />
            )}
        </div>
    );
};

export default DepartmentDetails;
