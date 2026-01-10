import React from 'react';
import { Eye, ArrowRight, Plus } from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';

const DepartmentEmployees = () => {
    const { departmentInfo, isEditing, formData, handleInputChange } = useOutletContext();
    const navigate = useNavigate();

    const getValue = (key) => isEditing ? (formData?.[key] || '') : (departmentInfo?.[key] || '');

    return (
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-8 mb-8 px-2 mt-4">
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
                    <span className={`inline-block text-[16px] px-4 py-1.5 rounded-full font-medium ${departmentInfo.status === 'Active' ? 'bg-[#76DB1E33] text-[#34C759]' : 'bg-[#FF3B301A] text-[#FF3B30]'
                        }`}>
                        {departmentInfo.status}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Employee Information Card  */}
                <div className="lg:col-span-2 bg-white rounded-xl p-6 pr-18 border border-[#D1D1D1] flex flex-col" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <h2 className="text-[20px] font-semibold text-[#000000] mb-2" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Employee Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4 text-[16px] font-base">
                        <div>
                            <label className="block text-[#1E1E1E] mb-1">Employee Name</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData?.head || ''}
                                    onChange={(e) => handleInputChange('head', e.target.value)}
                                    className="px-4 py-2 rounded-lg text-[#1E1E1E] w-full outline-none focus:ring-1 focus:ring-purple-500"
                                    style={{ background: '#F2F2F7', border: '1px solid #D9D9D9' }}
                                />
                            ) : (
                                <div className="px-4 py-2 rounded-lg text-[#1E1E1E]" style={{ background: '#F2F2F7', border: '1px solid #D9D9D9' }}>{departmentInfo.head}</div>
                            )}
                        </div>
                        <div>
                            <label className="block text-[#1E1E1E] mb-1">Designation</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData?.headDesignation || ''}
                                    onChange={(e) => handleInputChange('headDesignation', e.target.value)}
                                    className="px-4 py-2 rounded-lg text-[#1E1E1E] w-full outline-none focus:ring-1 focus:ring-purple-500"
                                    style={{ background: '#F2F2F7', border: '1px solid #D9D9D9' }}
                                />
                            ) : (
                                <div className="px-4 py-2 rounded-lg text-[#1E1E1E]" style={{ background: '#F2F2F7', border: '1px solid #D9D9D9' }}>{departmentInfo.headDesignation || 'Sales'}</div>
                            )}
                        </div>
                        <div>
                            <label className="block text-[#1E1E1E] mb-1">Email</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData?.headEmail || ''}
                                    onChange={(e) => handleInputChange('headEmail', e.target.value)}
                                    className="px-4 py-2 rounded-lg text-[#1E1E1E] w-full outline-none focus:ring-1 focus:ring-purple-500"
                                    style={{ background: '#F2F2F7', border: '1px solid #D9D9D9' }}
                                />
                            ) : (
                                <div className="px-4 py-2 rounded-lg text-[#1E1E1E]" style={{ background: '#F2F2F7', border: '1px solid #D9D9D9' }}>{departmentInfo.headEmail || 'john12@gmail.com'}</div>
                            )}
                        </div>
                        <div>
                            <label className="block text-[#1E1E1E] mb-1">Status</label>
                            {isEditing ? (
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={formData?.headJoinedDate ? formData.headJoinedDate.split('/').reverse().join('-') : ''}
                                        onChange={(e) => handleInputChange('headJoinedDate', e.target.value.split('-').reverse().join('/'))}
                                        className="px-4 py-2 rounded-lg text-[#1E1E1E] w-full outline-none focus:ring-1 focus:ring-purple-500 appearance-none bg-[#F2F2F7] border border-[#D9D9D9]"
                                        style={{
                                            background: '#F2F2F7',
                                            border: '1px solid #D9D9D9',
                                            WebkitAppearance: 'none'
                                        }}
                                        onClick={(e) => e.target.showPicker && e.target.showPicker()}
                                    />
                                    <img
                                        src="/images/calender.svg"
                                        alt="calendar"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none w-5 h-5"
                                    />
                                    <style jsx>{`
                                        input[type="date"]::-webkit-calendar-picker-indicator {
                                            opacity: 0;
                                            position: absolute;
                                            right: 0;
                                            top: 0;
                                            width: 100%;
                                            height: 100%;
                                            cursor: pointer;
                                        }
                                    `}</style>
                                </div>
                            ) : (
                                <div className="px-4 py-2 rounded-lg text-[#1E1E1E]" style={{ background: '#F2F2F7', border: '1px solid #D9D9D9' }}>{departmentInfo.headJoinedDate || '15/01/2023'}</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions Card */}
                <div className="bg-white rounded-xl p-6 pb-3 border border-[#CBCBCB] h-full">
                    <h2 className="text-[20px] font-semibold text-[#1E1E1E] mb-2">Quick Actions</h2>
                    <div className="space-y-2 px-2 font-medium">
                        <button className="w-full flex items-center justify-center gap-2 py-3  border border-[#7D1EDB] text-[#7D1EDB] rounded-full hover:bg-purple-50 transition-colors">
                            <span>View Profile</span>
                            <Eye size={18} />
                        </button>
                        <button className="w-full flex items-center justify-center gap-2 py-3 border border-[#7D1EDB] text-[#7D1EDB] rounded-full hover:bg-purple-50 transition-colors">
                            <span>Move to another department</span>
                            <ArrowRight size={18} />
                        </button>
                        <button className="w-full flex items-center justify-center gap-2 py-3 border border-[#7D1EDB] text-[#7D1EDB] rounded-full hover:bg-purple-50 transition-colors">
                            <span>Add Employee to Department</span>
                            <Plus size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DepartmentEmployees;
