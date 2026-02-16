import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import FilterDropdown from '../../../components/ui/FilterDropdown';

const NewEnergyPointRule = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        enabled: true,
        ruleName: '',
        referenceDocumentType: '',
        forDocumentEvent: 'Custom',
        points: 5,
        allotPointsToUser: false,
        userField: 'Owner',
        multiplierField: '',
        applyOnlyOnce: false,
        condition: "doc.status== 'closed'"
    });

    const DOCUMENT_EVENT_OPTIONS = ["Custom","New",  "Submit", "Cancel", "Update"];
    const USER_FIELD_OPTIONS = ["Activity Name", "Owner", "User", "Modified By"];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleDropdownChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="bg-white px-4 sm:px-4 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col font-popins" style={{ fontFamily: 'Poppins, sans-serif' }}>
            
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 shrink-0">
                <img 
                    src="/images/arrow_left_alt.svg" 
                    alt="Back" 
                    className="w-3 h-3 cursor-pointer hover:scale-110 transition-transform" 
                    onClick={() => navigate('/hrms/energy-point-rule')}
                />
                <span 
                    className='cursor-pointer text-[#7D1EDB]'
                    onClick={() => navigate('/hrms/energy-point-rule')}
                >
                    Energy Point Rule
                </span> 
                <ChevronRight size={14}/> 
                <span className="text-[#6B7280]">Add New Energy Point Rule</span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-4 shrink-0">
                <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>New Energy Point Rule</h1>
                
                <button
                    className="flex items-center justify-center gap-2 rounded-full py-2 px-4 text-white font-normal hover:bg-purple-700 transition-colors bg-[#7D1EDB]"
                    onClick={() => navigate('/hrms/energy-point-rule')}
                >
                    <span className='text-[16px] font-normal text-white font-popins'>Save</span>
                </button>
            </div>

            {/* Content Container */}
            <div className="flex-1 w-full max-w-full overflow-y-auto">
                
                {/* Enabled Checkbox Card */}
                <div className="border border-[#E0E0E0] rounded-lg p-4 mb-6">
                    <label className="flex items-center gap-2 cursor-pointer w-fit">
                        <input 
                            type="checkbox" 
                            name="enabled"
                            checked={formData.enabled}
                            onChange={handleChange}
                            className="w-4 h-4 rounded border-[#1F1F1F] text-[#1E1E1E] focus:ring-0"
                        />
                        <span className="text-sm font-medium text-[#1E1E1E]">Enabled</span>
                    </label>
                </div>

                {/* Form Grid */}
                <div className="border border-[#E0E0E0] rounded-lg p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    
                    {/* Left Column */}
                    <div className="space-y-2">
                        
                        {/* Rule Name */}
                        <div>
                            <label className="block text-sm font-normal text-[#1E1E1E] mb-1">Rule Name</label>
                            <input 
                                type="text"
                                name="ruleName"
                                value={formData.ruleName}
                                onChange={handleChange}
                                placeholder="Employee onboarding task"
                                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB]"
                            />
                        </div>

                         {/* Reference Document Type */}
                         <div>
                            <label className="block text-sm font-normal text-[#1E1E1E] mb-1">Reference Document Type</label>
                            <input 
                                type="text"
                                name="referenceDocumentType"
                                value={formData.referenceDocumentType}
                                onChange={handleChange}
                                placeholder="Employee onboarding activity"
                                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm text-[#1F1F1F] focus:outline-none focus:border-[#7D1EDB]"
                            />
                        </div>

                        {/* For Document Event */}
                        <div>
                            <label className="block text-sm font-normal text-[#1E1E1E] mb-1">For Document Event</label>
                            <FilterDropdown
                                options={DOCUMENT_EVENT_OPTIONS}
                                value={formData.forDocumentEvent}
                                onChange={(val) => handleDropdownChange('forDocumentEvent', val)}
                                className="w-full h-[38px] px-3 bg-white border border-[#E0E0E0] rounded-lg text-[#1E1E1E] focus:ring-1 focus:ring-[#7D1EDB] flex items-center justify-between"
                                showArrow={true}
                                placeholder="Select Event"
                                dropdownWidth="300px"
                                align='left'
                            />
                        </div>

                        {/* Points */}
                         <div>
                            <label className="block text-sm font-normal text-[#1E1E1E] mb-1">Points</label>
                            <input 
                                type="number"
                                name="points"
                                value={formData.points}
                                onChange={handleChange}
                                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB]"
                            />
                        </div>

                        {/* Allot Points Checkbox */}
                         <div>
                            <label className="flex items-center gap-2 cursor-pointer w-fit">
                                <input 
                                    type="checkbox" 
                                    name="allotPointsToUser"
                                    checked={formData.allotPointsToUser}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded border-[#B3B3B3] text-[#7D1EDB] focus:ring-0"
                                />
                                <span className="text-sm font-normal text-[#1E1E1E]">Allot Points To Assigned User</span>
                            </label>
                             <p className="text-xs text-[#757575] mt-1 ml-6">Users assigned to reference document will get points</p>
                        </div>

                         {/* User Field */}
                         <div>
                            <label className="block text-sm font-normal text-[#1E1E1E] mb-1">User Filed</label>
                            <FilterDropdown
                                options={USER_FIELD_OPTIONS}
                                value={formData.userField}
                                onChange={(val) => handleDropdownChange('userField', val)}
                                className="w-full h-[38px] px-3 bg-white border border-[#E0E0E0] rounded-lg text-[#1E1E1E] focus:ring-1 focus:ring-[#7D1EDB] flex items-center justify-between"
                                showArrow={true}
                                placeholder="Select User Field"
                                dropdownWidth="300px"
                                align='left'
                            />
                            <p className="text-xs text-[#757575] mt-1">The user from this field will be rewarded points</p>
                        </div>

                        {/* Multiplier Field */}
                        <div>
                            <label className="block text-sm font-normal text-[#1E1E1E] mb-1">Multiplier Filed</label>
                            <input 
                                type="text"
                                name="multiplierField"
                                value={formData.multiplierField}
                                onChange={handleChange}
                                disabled
                                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm bg-[#F5F5F5] cursor-not-allowed"
                            />
                        </div>

                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col h-full">
                         {/* Apply Only Once */}
                         <div className="mb-4">
                            <label className="flex items-center gap-2 cursor-pointer w-fit">
                                <input 
                                    type="checkbox" 
                                    name="applyOnlyOnce"
                                    checked={formData.applyOnlyOnce}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded border-[#B3B3B3] text-[#7D1EDB] focus:ring-0"
                                />
                                <span className="text-sm font-normal text-[#1E1E1E]">Apply Only Once</span>
                            </label>
                            <p className="text-xs text-[#757575] mt-1 ml-6">Apply this rule only once per dcument</p>
                        </div>

                        {/* Condition */}
                        <div className="flex-1 flex flex-col">
                             <label className="block text-sm font-medium text-[#1E1E1E] mb-2">Condition</label>
                             <textarea 
                                name="condition"
                                value={formData.condition}
                                onChange={handleChange}
                                className="w-full border border-[#E0E0E0] rounded-lg p-3 text-sm text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB] resize-none min-h-[200px]"
                             />
                             <p className="text-xs text-[#757575] mt-2">
                                If the condition is unsatisfied user will be rewarded with points.<br/>
                                eg: doc.status=='closed'
                             </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default NewEnergyPointRule;
