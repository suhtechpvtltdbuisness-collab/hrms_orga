import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import FilterDropdown from '../../../components/ui/FilterDropdown';

const SalaryComponent = () => {
    const navigate = useNavigate();
    
    // Initial State
    const [formData, setFormData] = useState({
        componentName: 'Allowance',
        type: 'Earning',
        description: '',
        amount: '50,000',
        formula: 'Basic*10',
        dependsOnPaymentDays: 'Yes',
        isTaxApplicable: true,
        fixableBenefit: true,
        defaultAccount: 'ICICI-Salary Account',
        costCenter: 'Operations',
        status: false // Disabled
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleDropdownChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Dropdown Options
    const TYPE_OPTIONS = ['Earning', 'Deduction'];
    const PAYMENT_DAYS_OPTIONS = ['Yes', 'No'];
    const ACCOUNT_OPTIONS = ['ICICI-Salary Account', 'HDFC-Salary Account', 'Cash'];
    const COST_CENTER_OPTIONS = ['Operations', 'Sales', 'Marketing', 'IT'];

    return (
        <div className="bg-white px-4 sm:px-4 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col font-popins" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 shrink-0">
                <img 
                    src="/images/arrow_left_alt.svg" 
                    alt="Back" 
                    className="w-3 h-3 cursor-pointer hover:scale-110 transition-transform" 
                    onClick={() => navigate('/hrms')}
                />
                <span 
                    className='cursor-pointer text-[#7D1EDB]'
                    onClick={() => navigate('/hrms')}
                >
                    HRMS Dashboard
                </span> 
                <ChevronRight size={14}/> 
                <span className="text-[#6B7280]">Salary Component</span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-4 shrink-0">
                <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Salary Component</h1>
                
                <button
                    className="flex items-center justify-center gap-2 rounded-full py-2 px-3 text-white font-normal hover:bg-purple-700 transition-colors bg-[#7D1EDB]"
                    onClick={() => {}}
                >
                    <span className='text-[16px] font-normal text-white font-popins'>Save</span>
                </button>
            </div>

            {/* Form Content - Scrollable Area */}
            <div className="flex-1 w-full max-w-full overflow-y-auto pr-2 font-inter">
                
                {/* Basic Information */}
                <div className="border border-[#D6D6D6] rounded-lg p-4 mb-3">
                    <h2 className="text-[16px] font-medium text-[#1E1E1E] mb-2" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Basic Information</h2>
                    <div className="w-full lg:w-[66%] grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        {/* Component Name */}
                        <div>
                            <label className="block text-[16px] font-normal font-inter text-[#1E1E1E] mb-1">Component Name</label>
                            <input 
                                type="text"
                                name="componentName"
                                value={formData.componentName}
                                onChange={handleChange}
                                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[16px] font-normal font-inter text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB]"
                            />
                        </div>
                        {/* Type */}
                        <div>
                            <label className="block text-[16px] font-normal font-inter text-[#1E1E1E] mb-1">Type</label>
                            <FilterDropdown
                                options={TYPE_OPTIONS}
                                value={formData.type}
                                onChange={(val) => handleDropdownChange('type', val)}
                                className="w-full h-[38px] px-3 bg-white border border-[#E0E0E0] rounded-lg text-[16px] font-normal font-inter text-[#1E1E1E] focus:ring-1 focus:ring-[#7D1EDB] flex items-center justify-between"
                                showArrow={true}
                                dropdownWidth="100%"
                                align='left'
                                disableAllOption={true}
                            />
                        </div>
                    </div>
                    {/* Description */}
                    <div className="">
                        <label className="block text-[16px] font-normal font-inter text-[#1E1E1E] mb-1">Description</label>
                        <textarea 
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter description"
                            className="w-full h-24 border border-[#E0E0E0] rounded-lg px-3 py-2 text-[16px] font-normal font-inter text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB] resize-none"
                        />
                    </div>
                </div>

                {/* Calculation Rules */}
                <div className="border border-[#D6D6D6] rounded-lg p-4 mb-3">
                    <h2 className="text-[16px] font-medium text-[#1E1E1E] mb-2" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Calculation Rules</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
                        {/* Amount */}
                        <div>
                            <label className="block text-[16px] font-normal font-inter text-[#1E1E1E] mb-1">Amount</label>
                            <input 
                                type="text"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[16px] font-normal font-inter text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB]"
                            />
                        </div>
                        {/* Formula */}
                        <div>
                            <label className="block text-[16px] font-normal font-inter text-[#1E1E1E] mb-1">Formula</label>
                            <input 
                                type="text"
                                name="formula"
                                value={formData.formula}
                                onChange={handleChange}
                                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[16px] font-normal font-inter text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB]"
                            />
                        </div>
                        {/* Depends On Payment days */}
                        <div>
                            <label className="block text-[16px] font-normal font-inter text-[#1E1E1E] mb-1">Depends On Payment days</label>
                            <FilterDropdown
                                options={PAYMENT_DAYS_OPTIONS}
                                value={formData.dependsOnPaymentDays}
                                onChange={(val) => handleDropdownChange('dependsOnPaymentDays', val)}
                                className="w-full h-[38px] px-3 bg-white border border-[#E0E0E0] rounded-lg text-[16px] font-normal font-inter text-[#1E1E1E] focus:ring-1 focus:ring-[#7D1EDB] flex items-center justify-between"
                                showArrow={true}
                                dropdownWidth="100%"
                                align='left'
                                disableAllOption={true}
                            />
                        </div>
                    </div>
                    
                    {/* Toggles */}
                    <div className="w-full lg:w-[66%] grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between max-w-md">
                            <span className="text-[16px] font-normal font-inter text-[#1E1E1E]">Is Tax Applicable</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    name="isTaxApplicable"
                                    checked={formData.isTaxApplicable} 
                                    onChange={handleChange} 
                                    className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7D1EDB]"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between max-w-md">
                            <span className="text-[16px] font-normal font-inter text-[#1E1E1E]">Fixable Benefit</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    name="fixableBenefit"
                                    checked={formData.fixableBenefit} 
                                    onChange={handleChange} 
                                    className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7D1EDB]"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Accounting */}
                <div className="border border-[#D6D6D6] rounded-lg p-4">
                    <h2 className="text-[16px] font-medium text-[#1E1E1E] mb-3" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Accounting</h2>
                    <div className="w-full lg:w-[66%] grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        {/* Default Account */}
                        <div>
                            <label className="block text-[16px] font-normal font-inter text-[#1E1E1E] mb-1">Default Account</label>
                            <FilterDropdown
                                options={ACCOUNT_OPTIONS}
                                value={formData.defaultAccount}
                                onChange={(val) => handleDropdownChange('defaultAccount', val)}
                                className="w-full h-[38px] px-3 bg-white border border-[#E0E0E0] rounded-lg text-[16px] font-normal font-inter text-[#1E1E1E] focus:ring-1 focus:ring-[#7D1EDB] flex items-center justify-between"
                                showArrow={true}
                                dropdownWidth="100%"
                                align='left'
                                disableAllOption={true}
                            />
                        </div>
                        {/* Cost Center */}
                        <div>
                            <label className="block text-[16px] font-normal font-inter text-[#1E1E1E] mb-1">Cost Center</label>
                            <FilterDropdown
                                options={COST_CENTER_OPTIONS}
                                value={formData.costCenter}
                                onChange={(val) => handleDropdownChange('costCenter', val)}
                                className="w-full h-[38px] px-3 bg-white border border-[#E0E0E0] rounded-lg text-[16px] font-normal font-inter text-[#1E1E1E] focus:ring-1 focus:ring-[#7D1EDB] flex items-center justify-between"
                                showArrow={true}
                                dropdownWidth="100%"
                                align='left'
                                disableAllOption={true}
                            />
                        </div>
                    </div>

                    {/* Status Toggle */}
                    <div>
                        <div className="mb-1">
                             <label className="block text-[16px] font-normal font-inter text-[#1E1E1E]">Status</label>
                        </div>
                        <div className="w-full md:w-[50%] lg:w-[33%] flex items-center justify-between max-w-sm">
                             <span className="text-[16px] font-normal font-inter text-[#1E1E1E]">Disabled</span>
                             <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    name="status"
                                    checked={formData.status} 
                                    onChange={handleChange} 
                                    className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7D1EDB]"></div>
                            </label>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SalaryComponent;
