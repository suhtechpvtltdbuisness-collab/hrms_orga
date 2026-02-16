import React from 'react';
import { useOutletContext } from 'react-router-dom';
import FilterDropdown from '../../../../components/ui/FilterDropdown';
import CustomDatePicker from '../../../../components/ui/CustomDatePicker';

const DepartmentSettings = () => {
    const { departmentInfo, isEditing, formData, handleInputChange } = useOutletContext();

    if (!departmentInfo) return <div>Loading...</div>;


    const getValue = (key) => isEditing ? (formData?.[key] || '') : (departmentInfo?.[key] || '');

    return (
        <div className="flex-1 pr-2">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-8 mb-8 px-2 mt-4">
                <div>
                    <p className="text-[#7F7F7F] text-[18px] mb-1">Department Head</p>
                    <p className="text-[#8E8E8E] text-[17px] font-medium">{getValue('head')}</p>
                </div>
                <div>
                    <p className="text-[#7F7F7F] text-[18px] mb-1">Employees</p>
                    <p className="text-[#1E1E1E] text-[17px] font-medium">{getValue('employees')}</p>
                </div>
                <div>
                    <p className="text-[#7F7F7F] text-[18px] mb-1">Location</p>
                    <p className="text-[#1E1E1E] text-[17px] font-medium">{getValue('location')}</p>
                </div>
                <div>
                    <p className="text-[#7F7F7F] text-[18px] mb-1">Status</p>
                    <span className={`inline-block text-[16px] px-4 py-1.5 rounded-full font-medium ${getValue('status') === 'Active' ? 'bg-[#76DB1E33] text-[#34C759]' : 'bg-[#FF3B301A] text-[#FF3B30]'
                        }`}>
                        {getValue('status')}
                    </span>
                </div>
            </div>

            {/* Department Information Card */}
            <div className="bg-white rounded-xl w-full lg:w-2/3 p-6 pr-18 border border-[#D1D1D1] flex flex-col relative" style={{ fontFamily: 'Inter, sans-serif' }}>
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-[20px] font-semibold text-[#000000]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Department Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4 text-[16px] font-normal">

                    {/* Department Head */}
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

                    {/* Parent Department */}
                    <div>
                        <label className="block text-[#1E1E1E] mb-1">Parent Department</label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={formData?.parentDepartment || ''}
                                onChange={(e) => handleInputChange('parentDepartment', e.target.value)}
                                className="px-4 py-2 rounded-lg text-[#1E1E1E] w-full outline-none focus:ring-1 focus:ring-purple-500"
                                style={{ background: '#F2F2F7', border: '1px solid #D9D9D9' }}
                            />
                        ) : (
                            <div className="px-4 py-2 rounded-lg text-[#1E1E1E]" style={{ background: '#F2F2F7', border: '1px solid #D9D9D9' }}>{departmentInfo.parentDepartment || 'N/A'}</div>
                        )}
                    </div>

                    {/* Access Rules */}
                    <div>
                        <label className="block text-[#1E1E1E] mb-1">Access Rules</label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={formData?.accessRules || ''}
                                onChange={(e) => handleInputChange('accessRules', e.target.value)}
                                className="px-4 py-2 rounded-lg text-[#1E1E1E] w-full outline-none focus:ring-1 focus:ring-purple-500"
                                style={{ background: '#F2F2F7', border: '1px solid #D9D9D9' }}
                            />
                        ) : (
                            <div className="px-4 py-2 rounded-lg text-[#1E1E1E]" style={{ background: '#F2F2F7', border: '1px solid #D9D9D9' }}>{departmentInfo.accessRules || 'N/A'}</div>
                        )}
                    </div>

                    {/* Created On (with Calendar) */}
                    <div>
                        <label className="block text-[#1E1E1E] mb-1">Created On</label>
                        {isEditing ? (
                            <div style={{ width: '100%' }}>
                                <CustomDatePicker
                                    value={formData?.createdOn}
                                    onChange={(val) => handleInputChange('createdOn', val)}
                                    placeholder="Select Date"
                                />
                            </div>
                        ) : (
                            <div className="px-4 py-2 rounded-lg text-[#1E1E1E]" style={{ background: '#F2F2F7', border: '1px solid #D9D9D9' }}>{departmentInfo.createdOn || 'N/A'}</div>
                        )}
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-[#1E1E1E] mb-1">Status</label>
                        {isEditing ? (
                            <FilterDropdown
                                options={['Active', 'Inactive']}
                                value={formData?.status || 'Active'}
                                onChange={(val) => handleInputChange('status', val)}
                                className="w-full px-2 py-2 border border-[#D9D9D9] bg-[#F2F2F7] rounded-lg text-[#1E1E1E] flex items-center justify-between"
                                minWidth="100%"
                            />
                        ) : (
                            <div className="px-4 py-2 rounded-lg text-[#1E1E1E]" style={{ background: '#F2F2F7', border: '1px solid #D9D9D9' }}>{departmentInfo.status}</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DepartmentSettings;
