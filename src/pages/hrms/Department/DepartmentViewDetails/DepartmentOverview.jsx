import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import FilterDropdown from '../../../../components/ui/FilterDropdown';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { employeeService } from '../../../../service';

const DepartmentOverview = () => {
    const { departmentInfo, isEditing, formData, handleInputChange } = useOutletContext();
    const navigate = useNavigate();
    const [managers, setManagers] = useState([]);

    useEffect(() => {
        const fetchManagers = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                const adminId = userData?.id || userData?._id;
                if (adminId) {
                    const response = await employeeService.getAllEmployeesByAdminId(adminId);
                    if (response.success && response.data) {
                        const mapped = response.data.map(item => {
                            const u = item.user || item;
                            return { label: u.name, value: u.id };
                        });
                        setManagers(mapped);
                    }
                }
            } catch (err) {
                console.error("Failed to load managers:", err);
            }
        };
        fetchManagers();
    }, []);

    const getDisplayValue = (key) => {
        return departmentInfo?.[key] || '—';
    };

    const getManagerName = () => {
        if (isEditing) {
            const selected = managers.find(m => m.value === formData?.managerId);
            return selected ? selected.label : 'Select a manager';
        }
        return departmentInfo?.managerName || '—';
    };

    return (
        <div className="flex-1 pr-2">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8 mb-8 px-2 mt-4 font-normal">
                <div>
                    <p className="text-[#7F7F7F] text-[18px] mb-1">Department Head</p>
                    <p className="text-[#8E8E8E] text-[17px]">{getManagerName()}</p>
                </div>
                <div>
                    <p className="text-[#7F7F7F] text-[18px] mb-1">Employees Assigned</p>
                    <p className="text-[#1E1E1E] text-[17px]">{getDisplayValue('employeeCount')}</p>
                </div>
                <div>
                    <p className="text-[#7F7F7F] text-[18px] mb-1">Department Code</p>
                    <p className="text-[#1E1E1E] text-[17px]">{getDisplayValue('departmentCode')}</p>
                </div>
                <div>
                    <p className="text-[#7F7F7F] text-[18px] mb-1">Status</p>
                    <span className={`inline-block text-[16px] px-4 py-1.5 rounded-full ${
                        (isEditing ? formData?.status : departmentInfo?.status) === 'Active' 
                            ? 'bg-[#76DB1E33] text-[#34C759]' 
                            : 'bg-[#FF3B301A] text-[#FF3B30]'
                    }`}>
                        {isEditing ? formData?.status : departmentInfo?.status}
                    </span>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Department Information Card */}
                <div className="lg:col-span-2 bg-white rounded-xl p-6 pr-18 border border-[#D1D1D1] flex flex-col justify-between" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <h2 className="text-[20px] font-semibold text-[#000000] mb-6" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Department Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-[16px] font-base">
                        <div>
                            <label className="block text-[#1E1E1E] mb-1 font-medium">Department Name</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData?.departmentName || ''}
                                    onChange={(e) => handleInputChange('departmentName', e.target.value)}
                                    className="px-4 py-2 rounded-lg text-[#1E1E1E] w-full outline-none focus:ring-1 focus:ring-purple-500"
                                    style={{ background: '#F2F2F7', border: '1px solid #D9D9D9' }}
                                />
                            ) : (
                                <div className="px-4 py-2 rounded-lg text-[#1E1E1E]" style={{ background: '#F2F2F7', border: '1px solid #D9D9D9' }}>{getDisplayValue('departmentName')}</div>
                            )}
                        </div>

                        <div>
                            <label className="block text-[#1E1E1E] mb-1 font-medium">Department Code</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData?.departmentCode || ''}
                                    onChange={(e) => handleInputChange('departmentCode', e.target.value)}
                                    className="px-4 py-2 rounded-lg text-[#1E1E1E] w-full outline-none focus:ring-1 focus:ring-purple-500"
                                    style={{ background: '#F2F2F7', border: '1px solid #D9D9D9' }}
                                />
                            ) : (
                                <div className="px-4 py-2 rounded-lg text-[#1E1E1E]" style={{ background: '#F2F2F7', border: '1px solid #D9D9D9' }}>{getDisplayValue('departmentCode')}</div>
                            )}
                        </div>

                        <div>
                            <label className="block text-[#1E1E1E] mb-1 font-medium">Department Head</label>
                            {isEditing ? (
                                <FilterDropdown
                                    options={managers}
                                    value={formData?.managerId || ''}
                                    onChange={(val) => handleInputChange('managerId', val)}
                                    className="w-full px-4 py-2 border border-[#D9D9D9] bg-[#F2F2F7] rounded-lg text-[#1E1E1E] flex items-center justify-between"
                                    minWidth="100%"
                                    placeholder="Select head"
                                />
                            ) : (
                                <div className="px-4 py-2 rounded-lg text-[#1E1E1E]" style={{ background: '#F2F2F7', border: '1px solid #D9D9D9' }}>{getManagerName()}</div>
                            )}
                        </div>

                        <div>
                            <label className="block text-[#1E1E1E] mb-1 font-medium">Status</label>
                            {isEditing ? (
                                <FilterDropdown
                                    options={['Active', 'Inactive']}
                                    value={formData?.status || 'Active'}
                                    onChange={(val) => handleInputChange('status', val)}
                                    className="w-full px-4 py-2 border border-[#D9D9D9] bg-[#F2F2F7] rounded-lg text-[#1E1E1E] flex items-center justify-between"
                                    minWidth="100%"
                                />
                            ) : (
                                <div className="px-4 py-2 rounded-lg text-[#1E1E1E]" style={{ background: '#F2F2F7', border: '1px solid #D9D9D9' }}>{getDisplayValue('status')}</div>
                            )}
                        </div>

                        <div>
                            <label className="block text-[#1E1E1E] mb-1 font-medium">Created On</label>
                            <div className="px-4 py-2 rounded-lg text-[#1E1E1E]" style={{ background: '#F2F2F7', border: '1px solid #D9D9D9' }}>
                                {departmentInfo?.createdAt ? new Date(departmentInfo.createdAt).toLocaleDateString() : 'N/A'}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[#1E1E1E] mb-1 font-medium">Last Updated</label>
                            <div className="px-4 py-2 rounded-lg text-[#1E1E1E]" style={{ background: '#F2F2F7', border: '1px solid #D9D9D9' }}>
                                {departmentInfo?.updatedAt ? new Date(departmentInfo.updatedAt).toLocaleDateString() : 'N/A'}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="block text-[#1E1E1E] mb-1 font-medium">Description</label>
                        {isEditing ? (
                            <textarea
                                value={formData?.description || ''}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                className="px-4 py-2 rounded-lg text-[#1E1E1E] w-full outline-none focus:ring-1 focus:ring-purple-500 resize-none h-20"
                                style={{ background: '#F2F2F7', border: '1px solid #D9D9D9' }}
                            />
                        ) : (
                            <div className="px-4 py-2 rounded-lg text-[#1E1E1E] min-h-[5rem]" style={{ background: '#F2F2F7', border: '1px solid #D9D9D9' }}>{getDisplayValue('description')}</div>
                        )}
                    </div>
                </div>

                {/* Quick Actions Card */}
                <div className="bg-white rounded-xl p-6 border border-[#CBCBCB] h-fit">
                    <h2 className="text-[20px] font-semibold text-[#1E1E1E] mb-4">Quick Actions</h2>
                    <div className="space-y-3 font-medium">
                        <button onClick={() => navigate('/hrms/employees')} className="w-full flex items-center justify-center gap-2 py-3 border border-[#7D1EDB] text-[#7D1EDB] rounded-full hover:bg-purple-50 transition-colors">
                            <span>Manage Employees</span>
                            <Plus size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DepartmentOverview;
