import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronDown } from 'lucide-react';
import CustomDatePicker from '../../../components/ui/CustomDatePicker';
import FilterDropdown from '../../../components/ui/FilterDropdown';

const NewLeavePeriod = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fromDate: '26/01/2026',
        toDate: '29/01/2026',
        holidayList: 'Holiday List 2021-2022',
        isActive: true
    });
    
    const holidayOptions = [
        { label: "Create a new holiday list", value: "Create a new holiday list" },
        { label: "Advanced Search", value: "Advanced Search" }
    ];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleDateChange = (date, name) => {
        setFormData(prev => ({
            ...prev,
            [name]: date
        }));
    };

    const handleHolidaySelect = (optionValue) => {
        if (optionValue === "Create a new holiday list") {
            console.log("Create new holiday list clicked");
        } else if (optionValue === "Advanced Search") {
             console.log("Advanced search clicked");
        }
        else {
             setFormData(prev => ({ ...prev, holidayList: optionValue }));
        }
    };

    return (
        <div className="bg-white px-4 sm:px-4 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col font-popins" style={{ fontFamily: 'Poppins, sans-serif' }}>
             {/* Breadcrumb */}
             <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 shrink-0">
                <img 
                    src="/images/arrow_left_alt.svg" 
                    alt="Back" 
                    className="w-3 h-3 cursor-pointer hover:scale-110 transition-transform" 
                    onClick={() => navigate('/hrms/leave-period')}
                />
                <span 
                    className='cursor-pointer text-[#7D1EDB]'
                    onClick={() => navigate('/hrms')}
                >
                    HRMS Dashboard
                </span> 
                <ChevronRight size={14}/> 
                 <span 
                    className='cursor-pointer text-[#667085]'
                    onClick={() => navigate('/hrms/leave-period')}
                >
                    Leave Period
                </span>
                <ChevronRight size={14}/> 
                <span className="text-[#6B7280]">New Leave Period</span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-6 shrink-0">
                <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>New Leave Period</h1>

                <button
                    className="flex items-center rounded-full py-3 px-4 justify-center gap-2 text-white font-medium hover:bg-purple-700 transition-colors bg-[#7D1EDB]">
                    <span className='text-[16px] font-medium text-white font-popins'>Save</span>
                </button>
            </div>

            {/* Form Container */}
            <div className="border border-[#E5E7EB] rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {/* From Date */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[14px] text-[#494949] font-medium">From Date</label>
                        <div className="w-full">
                            <CustomDatePicker
                                value={formData.fromDate}
                                onChange={(date) => handleDateChange(date, 'fromDate')}
                                placeholder="Select date"
                                className="bg-white h-[40px] px-4 rounded-lg focus:border-[#7D1EDB] border-[#D9D9D9]"
                            />
                        </div>
                    </div>

                    {/* To Date */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[14px] text-[#494949] font-medium">To Date</label>
                        <div className="w-full">
                            <CustomDatePicker
                                value={formData.toDate}
                                onChange={(date) => handleDateChange(date, 'toDate')}
                                placeholder="Select date"
                                className="bg-white h-[40px] px-4 rounded-lg focus:border-[#7D1EDB] border-[#D9D9D9]"
                            />
                        </div>
                    </div>

                    {/* Holiday List */}
                    <div className="flex flex-col gap-2 relative">
                         <label className="text-[14px] text-[#494949] font-normal">Holiday List</label>
                         <div className="w-full">
                            <FilterDropdown
                                options={holidayOptions}
                                value={formData.holidayList}
                                onChange={handleHolidaySelect}
                                placeholder="Select Holiday List"
                                className="w-full h-[40px] px-4 border border-[#D9D9D9] rounded-lg text-[#1E1E1E] bg-white flex items-center justify-between"
                                optionFontFamily="'Inter', sans-serif"
                                dropdownWidth="100%"
                            />
                         </div>
                    </div>
                </div>

                {/* Is Active Checkbox */}
                <div className="flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <div className="relative flex items-center">
                         <input 
                            type="checkbox" 
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleInputChange}
                            id="isActive"
                            className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 shadow-sm checked:border-[#7D1EDB] checked:bg-[#7D1EDB] hover:border-[#7D1EDB] focus:ring-0 focus:ring-offset-0"
                        />
                         <svg 
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none hidden peer-checked:block text-white" 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="3" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        >
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                    <label htmlFor="isActive" className="text-[14px] text-[#1E1E1E] cursor-pointer select-none">Is Active</label>
                </div>
            </div>

        </div>
    );
};

export default NewLeavePeriod;
