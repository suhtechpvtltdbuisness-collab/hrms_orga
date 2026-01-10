import React from 'react';
import { Plus } from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';

const DepartmentOverview = () => {
    const { departmentInfo, isEditing, formData, handleInputChange } = useOutletContext();
    const navigate = useNavigate();

    const getValue = (key) => isEditing ? (formData?.[key] || '') : (departmentInfo?.[key] || '');

    return (
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-8 mb-8 px-2 mt-4 font-normal">
                <div>
                    <p className="text-[#7F7F7F] text-[18px] mb-1">Department Head</p>
                    <p className="text-[#8E8E8E] text-[17px]">{getValue('head')}</p>
                </div>
                <div>
                    <p className="text-[#7F7F7F] text-[18px] mb-1">Employees</p>
                    <p className="text-[#1E1E1E] text-[17px]">{getValue('employees')}</p>
                </div>
                <div>
                    <p className="text-[#7F7F7F] text-[18px] mb-1">Location</p>
                    <p className="text-[#1E1E1E] text-[17px]">{getValue('location')}</p>
                </div>
                <div>
                    <p className="text-[#7F7F7F] text-[18px] mb-1">Status</p>
                    <span className={`inline-block text-[16px] px-4 py-1.5 rounded-full ${getValue('status') === 'Active' ? 'bg-[#76DB1E33] text-[#34C759]' : 'bg-[#FF3B301A] text-[#FF3B30]'
                        }`}>
                        {getValue('status')}
                    </span>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Department Information Card */}
                <div className="lg:col-span-2 bg-white rounded-xl p-6 pr-18 border border-[#D1D1D1] flex flex-col justify-between" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <h2 className="text-[20px] font-semibold text-[#000000] mb-2" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Department Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4 text-[16px] font-base">
                        <div>
                            <label className="block text-[#1E1E1E] mb-1">Department Head</label>
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
                            <label className="block text-[#1E1E1E] mb-1">Employees</label>
                            {isEditing ? (
                                <input
                                    type="number"
                                    value={formData?.employees || ''}
                                    onChange={(e) => handleInputChange('employees', e.target.value)}
                                    className="px-4 py-2 rounded-lg text-[#1E1E1E] w-full outline-none focus:ring-1 focus:ring-purple-500"
                                    style={{ background: '#F2F2F7', border: '1px solid #D9D9D9' }}
                                />
                            ) : (
                                <div className="px-4 py-2 rounded-lg text-[#1E1E1E]" style={{ background: '#F2F2F7', border: '1px solid #D9D9D9' }}>{departmentInfo.employees}</div>
                            )}
                        </div>
                        <div>
                            <label className="block text-[#1E1E1E] mb-1">Location</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData?.location || ''}
                                    onChange={(e) => handleInputChange('location', e.target.value)}
                                    className="px-4 py-2 rounded-lg text-[#1E1E1E] w-full outline-none focus:ring-1 focus:ring-purple-500"
                                    style={{ background: '#F2F2F7', border: '1px solid #D9D9D9' }}
                                />
                            ) : (
                                <div className="px-4 py-2 rounded-lg text-[#1E1E1E]" style={{ background: '#F2F2F7', border: '1px solid #D9D9D9' }}>{departmentInfo.location}</div>
                            )}
                        </div>

                        <div>
                            <label className="block text-[#1E1E1E] mb-1">Created On</label>

                            {isEditing ? (
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={formData?.createdOn ? formData.createdOn.split('/').reverse().join('-') : ''}
                                        onChange={(e) => handleInputChange('createdOn', e.target.value.split('-').reverse().join('/'))}
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
                                <div className="px-4 py-2 rounded-lg text-[#1E1E1E]" style={{ background: '#F2F2F7', border: '1px solid #D9D9D9' }}>{departmentInfo.createdOn || 'N/A'}</div>
                            )}
                        </div>
                        <div>
                            <label className="block text-[#1E1E1E] mb-1">Last Updated</label>
                            {isEditing ? (
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={formData?.lastUpdated ? formData.lastUpdated.split('/').reverse().join('-') : ''}
                                        onChange={(e) => handleInputChange('lastUpdated', e.target.value.split('-').reverse().join('/'))}
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
                                </div>
                            ) : (
                                <div className="px-4 py-2 rounded-lg text-[#1E1E1E]" style={{ background: '#F2F2F7', border: '1px solid #D9D9D9' }}>{departmentInfo.lastUpdated || 'N/A'}</div>
                            )}
                        </div>
                        <div>
                            <label className="block text-[#1E1E1E] mb-1">Status</label>
                            {isEditing ? (
                                <select
                                    value={formData?.status || 'Active'}
                                    onChange={(e) => handleInputChange('status', e.target.value)}
                                    className="px-4 py-2 rounded-lg text-[#1E1E1E] w-full outline-none focus:ring-1 focus:ring-purple-500 appearance-none bg-white"
                                    style={{ background: '#F2F2F7', border: '1px solid #D9D9D9' }}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            ) : (
                                <div className="px-4 py-2 rounded-lg text-[#1E1E1E]" style={{ background: '#F2F2F7', border: '1px solid #D9D9D9' }}>{departmentInfo.status}</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions Card */}
                <div className="bg-white rounded-xl p-6 border border-[#CBCBCB] h-full">
                    <h2 className="text-[20px] font-semibold text-[#1E1E1E] mb-2">Quick Actions</h2>
                    <div className="space-y-2 font-medium px-2">
                        <button onClick={() => navigate('/hrms/employees')} className="w-full flex items-center justify-center gap-2 py-3 border border-[#7D1EDB] text-[#7D1EDB] rounded-full hover:bg-purple-50 transition-colors">
                            <span>Add Employee</span>
                            <Plus size={18} />
                        </button>
                        <button className="w-full flex items-center justify-center gap-2 py-3 border border-[#7D1EDB] text-[#7D1EDB] rounded-full hover:bg-purple-50 transition-colors">
                            <span>Change Department Head</span>
                            <img src="/images/head.svg" alt="user" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DepartmentOverview;
