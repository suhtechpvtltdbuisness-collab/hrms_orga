import React, { useState } from 'react';
import { ChevronLeft, Plus, User, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DeleteDepartment from './DeleteDepartment'; // Adjust path if needed

const DepartmentDetails = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Overview');
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Mock Data
    const departmentInfo = {
        name: "Finance",
        description: "Financial Panning, Reporting And Analysis Department Responsible For Company Finances",
        head: "John Smith",
        employees: "18",
        location: "Delhi",
        createdOn: "15/01/2023",
        lastUpdated: "11/10/2024",
        status: "Active"
    };

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    return (
        <div className="bg-white p-4 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-9rem)] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-10rem)] xl:h-[calc(100vh-11rem)] flex flex-col border border-[#D9D9D9] font-sans" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>

            {/* Breadcrumb */}
            <div className="flex items-center text-[14px] text-[#7D1EDB] mb-4 shrink-0" style={{ fontFamily: 'Mulish, sans-serif' }}>
                <div className="flex items-center gap-3" onClick={() => navigate('/hrms/departments')}>
                    <img src="/images/arrow_left_alt.svg" alt="Back" className="cursor-pointer" />
                    <span className="font-light cursor-pointer hover:text-purple-500">Department List</span>
                </div>
                <ChevronLeft size={16} className="mx-1 rotate-180" />
                <span className="text-[#667085] text-[14px] font-light">Department Details</span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-start mb-6 shrink-0">
                <div>
                    <h1 className="text-[20px] font-semibold  text-[#494949]">{departmentInfo.name}</h1>
                    <p className="text-[#8C8C8C] font-light text-[17px]">{departmentInfo.description}</p>
                </div>
                <button className="flex items-center justify-center text-[16px] font-medium mt-1 pt-0.5 gap-[14px] w-[100px] h-[48px] border border-[#7D1EDB] text-[#7D1EDB] rounded-full hover:bg-[#EEECFF] transition-colors">
                    <span>Edit</span>
                    <img src="/images/pencil_Icon.svg" alt="Edit" style={{ height: '14px', width: '14px' }} />
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-2 bg-[#EEECFF] py-[7px] px-[9px] rounded-lg shrink-0" style={{ width: '500px', height: '49.93px' }}>
                {['Overview', 'Employees', 'Org Structure', 'Settings'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2 rounded-md text-[16px] font-medium transition-all ${activeTab === tab
                            ? 'bg-[#7D1EDB] text-white shadow-md'
                            : 'text-[#000000] hover:text-[#1E1E1E]'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Scrollable Content Area */}
            <div className="overflow-y-auto custom-scrollbar flex-1 min-h-0 pr-2">

                {/* Quick Stats */}
                <div className="grid grid-cols-6 gap-8 mb-8 px-2 mt-4">
                    <div>
                        <p className="text-[#7F7F7F] text-[18px] mb-1">Department Head</p>
                        <p className="text-[#8E8E8E] text-[17px] font-medium">{departmentInfo.head}</p>
                    </div>
                    <div>
                        <p className="text-[#7F7F7F] text-[18px] mb-1">Employees</p>
                        <p className="text-[#1E1E1E] text-[17px] font-medium">{departmentInfo.employees}</p>
                    </div>
                    <div>
                        <p className="text-[#7F7F7F] text-[18px] mb-1">Location</p>
                        <p className="text-[#1E1E1E] text-[17px] font-medium">{departmentInfo.location}</p>
                    </div>
                    <div>
                        <p className="text-[#7F7F7F] text-[18px] mb-1">Status</p>
                        <span className="inline-block text-[16px] px-4 py-1.5 bg-[#76DB1E33] text-[#34C759] rounded-full font-medium">
                            {departmentInfo.status}
                        </span>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Department Information Card */}
                    <div className="lg:col-span-2 bg-white rounded-xl p-6 pr-18 border border-[#D1D1D1] flex flex-col justify-between" style={{ fontFamily: 'Inter, sans-serif' }}>
                        <h2 className="text-[20px] font-semibold text-[#000000] mb-2" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Department Information</h2>

                        <div className="grid grid-cols-3 gap-x-4 gap-y-4 text-[16px] font-base">
                            <div>
                                <label className="block text-[#1E1E1E] mb-1">Department Head</label>
                                <div className="px-4 py-2 rounded-lg text-[#1E1E1E]" style={{ background: '#F2F2F7', border: '1px solid #D9D9D9' }}>{departmentInfo.head}</div>
                            </div>
                            <div>
                                <label className="block text-[#1E1E1E] mb-1">Employees</label>
                                <div className="px-4 py-2 rounded-lg text-[#1E1E1E]" style={{ background: '#F2F2F7', border: '1px solid #D9D9D9' }}>{departmentInfo.employees}</div>
                            </div>
                            <div>
                                <label className="block text-[#1E1E1E] mb-1">Location</label>
                                <div className="px-4 py-2 rounded-lg text-[#1E1E1E]" style={{ background: '#F2F2F7', border: '1px solid #D9D9D9' }}>{departmentInfo.location}</div>
                            </div>

                            <div>
                                <label className="block text-[#1E1E1E] mb-1">Created On</label>
                                <div className="px-4 py-2 rounded-lg text-[#1E1E1E]" style={{ background: '#F2F2F7', border: '1px solid #D9D9D9' }}>{departmentInfo.createdOn}</div>
                            </div>
                            <div>
                                <label className="block text-[#1E1E1E] mb-1">Last Updated</label>
                                <div className="px-4 py-2 rounded-lg text-[#1E1E1E]" style={{ background: '#F2F2F7', border: '1px solid #D9D9D9' }}>{departmentInfo.lastUpdated}</div>
                            </div>
                            <div>
                                <label className="block text-[#1E1E1E] mb-1">Status</label>
                                <div className="px-4 py-2 rounded-lg text-[#1E1E1E]" style={{ background: '#F2F2F7', border: '1px solid #D9D9D9' }}>{departmentInfo.status}</div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Card */}
                    <div className="bg-white rounded-xl p-6 border border-[#CBCBCB] h-full">
                        <h2 className="text-[20px] font-semibold text-[#1E1E1E] mb-6">Quick Actions</h2>
                        <div className="space-y-4">
                            <button className="w-[274px] flex items-center justify-center gap-2 py-3 border border-[#8A2BE2] text-[#8A2BE2] rounded-full hover:bg-purple-50 transition-colors">
                                <span>Add Employee</span>
                                <Plus size={18} />
                            </button>
                            <button className="w-[274px] flex items-center justify-center gap-2 py-3 border border-[#8A2BE2] text-[#8A2BE2] rounded-full hover:bg-purple-50 transition-colors">
                                <span>Change Department Head</span>
                                <img src="../images/head.svg" alt="user" />
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            {/* Delete Button */}
            <div className="mt-4 mb-4 px-2 shrink-0">
                <button
                    onClick={handleDeleteClick}
                    className="flex items-center gap-2 px-6 py-3 bg-[#FF383C] text-white text-[17px] font-Poppins font-medium rounded-full hover:bg-[#E03125] transition-colors "
                >
                    <span>Delete Department</span>
                    <Trash2 size={18} />
                </button>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <DeleteDepartment
                    onCancel={() => setShowDeleteModal(false)}
                    onDelete={() => {
                        // Handle successful deletion logic here (e.g., navigate back)
                        // console.log("Deleted");
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
