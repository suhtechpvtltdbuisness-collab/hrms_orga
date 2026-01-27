
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Calendar } from 'lucide-react';
import FilterDropdown from '../../../components/ui/FilterDropdown';
import CustomDatePicker from '../../../components/ui/CustomDatePicker';

const AddAttendance = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    series: 'HR-ATT-YYY',
    date: '',
    employee: '',
    employeeName: '',
    status: '',
    department: '',
    shift: '',
    lateEntry: false,
    earlyExit: false
  });

  const EMPLOYEE_OPTIONS = [
    { label: "HR-EMP-123", value: "HR-EMP-123" },
    { label: "HR-EMP-124", value: "HR-EMP-124" },
    { label: "HR-EMP-125", value: "HR-EMP-125" },
    { label: "HR-EMP-126", value: "HR-EMP-126" },
    { label: "HR-EMP-127", value: "HR-EMP-127" },
  ];

  const STATUS_OPTIONS = ["Present", "Absent", "Leave", "Holiday", "Half Day"];
  const SHIFT_OPTIONS = ["Morning", "Night", "Evening"];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDropdownChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white px-4 sm:px-4 md:px-6 py-4 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-9rem)] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-10rem)] xl:h-[calc(100vh-11rem)] flex flex-col font-sans border border-[#D9D9D9]" style={{ fontFamily: 'Poppins, sans-serif' }}>
        
         {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 shrink-0">
             <img 
                src="/images/arrow_left_alt.svg" 
                alt="Back" 
                className="w-3 h-3 cursor-pointer hover:scale-110 transition-transform" 
                onClick={() => navigate('/hrms/attendance')}
             />
             <span 
                className='cursor-pointer text-[#7D1EDB]'
                onClick={() => navigate('/hrms/attendance')}
             >
                Attendance
             </span> 
             <ChevronRight size={14}/> 
             <span className="text-[#6B7280]">Add Attendance</span>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-2 shrink-0">
            <h1 className="text-[20px] font-semibold text-[#1E1E1E]">Add Attendance</h1>
            <button 
                className="bg-[#7D1EDB] text-white px-4 py-2.5 rounded-full font-normal hover:bg-purple-700 transition-colors"
                style={{ borderRadius: '26px' }}
            >
                Save
            </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            {/* Form Container */}
            <div className="border border-[#D6D6D6] rounded-lg p-4 mb-4">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                     {/* Series */}
                     <div className="flex flex-col gap-2">
                        <label className="text-[14px] font-normal text-[#1E1E1E]" style={{ fontFamily: 'Inter, sans-serif' }}>Series</label>
                        <input 
                            type="text" 
                            value={formData.series}
                            disabled
                            className="w-full bg-[#F3F4F6] border border-[#E5E7EB] rounded-[8px] px-4 py-2 text-[#6B7280] outline-none"
                        />
                     </div>

                     {/* Attendance Date */}
                     <div className="flex flex-col gap-2 relative">
                        <label className="text-[14px] font-normal text-[#1E1E1E]" style={{ fontFamily: 'Inter, sans-serif' }}>Attendance Date</label>
                        <CustomDatePicker
                            value={formData.date}
                            onChange={(date) => handleDropdownChange('date', date)}
                            placeholder="Select date"
                            className="w-full bg-white border border-[#E5E7EB] rounded-[8px] px-4 py-2 text-[#1E1E1E] outline-none"
                        />
                     </div>

                     {/* Employee */}
                     <div className="flex flex-col gap-2">
                        <label className="text-[14px] font-normal text-[#1E1E1E]" style={{ fontFamily: 'Inter, sans-serif' }}>Employee</label>
                        <FilterDropdown 
                            options={EMPLOYEE_OPTIONS}
                            value={formData.employee}
                            onChange={(val) => handleDropdownChange('employee', val)}
                            placeholder="Select employee"
                            className="w-full bg-white border border-[#E5E7EB] rounded-[8px] px-4 py-2 flex items-center justify-between outline-none"
                            dropdownWidth="150px"
                            align="right"
                            optionFontFamily="'Nunito Sans', sans-serif"
                        />
                     </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     {/* Employee Name */}
                     <div className="flex flex-col gap-2">
                        <label className="text-[14px] font-normal text-[#1E1E1E]" style={{ fontFamily: 'Inter, sans-serif' }}>Employee Name</label>
                        <input 
                            type="text" 
                            name="employeeName"
                            value={formData.employeeName}
                            onChange={handleInputChange}
                            className="w-full bg-[#F3F4F6] border border-[#E5E7EB] rounded-[8px] px-4 py-2 outline-none" 
                             // Assuming read-only if fetched from employee ID, or editable? Design shows grey bg usually for disabled. keeping enabled for now or disabled based on series style
                             disabled 
                        />
                     </div>

                     {/* Status */}
                      <div className="flex flex-col gap-2">
                        <label className="text-[14px] font-normal text-[#1E1E1E]" style={{ fontFamily: 'Inter, sans-serif' }}>Status</label>
                        <FilterDropdown 
                            options={STATUS_OPTIONS}
                            value={formData.status}
                            onChange={(val) => handleDropdownChange('status', val)}
                            placeholder="Select status"
                            className="w-full bg-white border border-[#E5E7EB] rounded-[8px] px-4 py-2 flex items-center justify-between outline-none"
                            dropdownWidth="150px"
                            align="right"
                            optionFontFamily="'Nunito Sans', sans-serif"
                        />
                     </div>

                     {/* Department */}
                     <div className="flex flex-col gap-2">
                        <label className="text-[14px] font-normal text-[#1E1E1E]" style={{ fontFamily: 'Inter, sans-serif' }}>Department</label>
                         <input 
                            type="text" 
                            name="department"
                            value={formData.department}
                             disabled
                            className="w-full bg-[#F3F4F6] border border-[#E5E7EB] rounded-[8px] px-4 py-2 outline-none"
                        />
                     </div>
                </div>

            </div>

            {/* Details Section */}
            <div className="border border-[#D6D6D6] rounded-lg p-4">
                <h2 className="text-[16px] font-medium text-[#1E1E1E] mb-4">Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                     {/* Shift */}
                     <div className="flex flex-col gap-2">
                        <label className="text-[14px] font-normal text-[#1E1E1E]" style={{ fontFamily: 'Inter, sans-serif' }}>Shift</label>
                         <FilterDropdown 
                            options={SHIFT_OPTIONS}
                            value={formData.shift}
                            onChange={(val) => handleDropdownChange('shift', val)}
                            placeholder="Select shift"
                            className="w-full bg-white border border-[#E5E7EB] rounded-[8px] px-4 py-2 flex items-center justify-between outline-none"
                            dropdownWidth="150px"
                            align="right"
                            optionFontFamily="'Nunito Sans', sans-serif"
                        />
                     </div>
                     
                     {/* Checkboxes */}
                     <div className="flex items-center gap-6 mt-6">
                         <label className="flex items-center gap-2 cursor-pointer">
                             <input 
                                type="checkbox" 
                                name="lateEntry"
                                checked={formData.lateEntry}
                                onChange={handleInputChange}
                                className="w-4 h-4 rounded border-gray-300 text-[#7D1EDB] focus:ring-[#7D1EDB]"
                             />
                             <span className="text-[14px] text-[#1E1E1E]">Late Entry</span>
                         </label>

                         <label className="flex items-center gap-2 cursor-pointer">
                             <input 
                                type="checkbox" 
                                name="earlyExit"
                                checked={formData.earlyExit}
                                onChange={handleInputChange}
                                 className="w-4 h-4 rounded border-gray-300 text-[#7D1EDB] focus:ring-[#7D1EDB]"
                             />
                             <span className="text-[14px] text-[#1E1E1E]">Early Exit</span>
                         </label>
                     </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default AddAttendance;
