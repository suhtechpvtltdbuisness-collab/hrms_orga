import React, { useState, useRef } from 'react';
import { X, Calendar } from 'lucide-react';
import FilterDropdown from '../../../../components/ui/FilterDropdown';

const AssignReportingManager = ({ isOpen, onClose, onAssign, employee }) => {
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    designation: '',
    joiningDate: '',
    reportingManager: ''
  });

  const DEPARTMENT_OPTIONS = ["Technical", "Product", "Business", "Operations", "Finance", "Security"];
  const DESIGNATION_OPTIONS = ["Frontend Developer", "Backend Developer", "DevOps", "UI/UX Designer", "Product Management"];
  const REPORTING_MANAGER_OPTIONS = ["John Doe", "Jane Smith", "Mike Johnson"];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = Object.values(formData).every(value => value && value.trim() !== '');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#100F0F59] font-sans" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
      <div className="bg-white rounded-[20px] w-[90%] max-w-[750px] p-8 relative shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-[20px] font-semibold text-[#1E1E1E]" style={{ fontFamily: '"Poppins", sans-serif' }}>Assign Reporting Manager</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={22} className="text-[#667085]" />
          </button>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-4 mb-8">
            <div className="w-[70px] h-[70px] rounded-full overflow-hidden">
                    <img src="/images/Ellipse 595.svg" alt="User" className="w-full h-full object-cover" />
            </div>
            <div>
                <h3 className="text-[18px] font-bold text-[#000000]">{employee?.name || 'Sophia Miller'}</h3>
                <p className="text-[12px] text-[#ABABAB]">Emp code-{employee?.empId || '0123'}</p>
            </div>
            <div className="flex flex-col ml-4 gap-1">
                <p className="text-[12px] text-[#ABABAB]">Dept: <span className="text-[#ABABAB] font-normal">{employee?.department || 'Development'}</span></p>
                <p className="text-[12px] text-[#ABABAB]">Designation: <span className="text-[#ABABAB] font-normal">{employee?.designation || 'Developer'}</span></p>
            </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
            {/* Name */}
            <div>
                <label className="block text-[14px] font-medium text-[#1E1E1E] mb-2">Name</label>
                <input 
                    type="text" 
                    placeholder="Enter name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full h-[48px] px-4 rounded-[12px] bg-white border border-[#D9D9D9] text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB] placeholder:text-[#757575]"
                />
            </div>

             {/* Dept & Designation */}
            <div className="grid grid-cols-2 gap-6">
                 <div>
                    <label className="block text-[14px] font-medium text-[#1E1E1E] mb-2">Department</label>
                    <FilterDropdown 
                        options={DEPARTMENT_OPTIONS}
                        value={formData.department}
                        onChange={(val) => handleInputChange('department', val)}
                        placeholder="Select department"
                        maxHeight="200px"
                        className="w-full h-[48px] bg-white! rounded-[12px] border border-[#D9D9D9] flex items-center justify-between px-4"
                    />
                </div>
                 <div>
                    <label className="block text-[14px] font-medium text-[#1E1E1E] mb-2">Designation</label>
                    <input 
                        type="text" 
                        placeholder="Enter designation"
                        value={formData.designation}
                        onChange={(e) => handleInputChange('designation', e.target.value)}
                        className="w-full h-[48px] px-4 rounded-[12px] bg-white border border-[#D9D9D9] text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB] placeholder:text-[#757575]"
                    />
                </div>
            </div>

            {/* Joining Date & Reporting Manager */}
            <div className="grid grid-cols-2 gap-6">
                 <div>
                    <label className="block text-[14px] font-medium text-[#1E1E1E] mb-2">Joining Date</label>
                    <div className="relative">
                        <input 
                            type="date"
                            value={formData.joiningDate}
                            onChange={(e) => handleInputChange('joiningDate', e.target.value)}
                            className="w-full h-[48px] px-4 rounded-[12px] bg-white border border-[#D9D9D9] text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB] appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                        />
                         <img src="/images/calender.svg" alt="calendar" className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none w-5 h-5" />
                    </div>
                </div>
                 <div>
                    <label className="block text-[14px] font-medium text-[#1E1E1E] mb-2">Reporting Manager</label>
                    <FilterDropdown 
                        options={REPORTING_MANAGER_OPTIONS}
                        value={formData.reportingManager}
                        onChange={(val) => handleInputChange('reportingManager', val)}
                        placeholder="Select reporting manager"
                        className="w-full h-[48px] bg-white! rounded-[12px] border border-[#D9D9D9] flex items-center justify-between px-4"
                    />
                </div>
            </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-4 mt-8 font-popins">
            <button 
                onClick={onClose}
                className="px-8 h-[48px] w-[126px] rounded-full border border-[#7D1EDB] text-[#7D1EDB] font-medium text-[16px] hover:bg-purple-50 transition-colors"
            >
                Cancel
            </button>
            <button 
                onClick={onAssign}
                disabled={!isFormValid}
                className={`px-8 h-[48px] w-[126px] rounded-full bg-[#7D1EDB] text-white font-medium text-[16px] transition-colors ${!isFormValid ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#6c1ac0]'}`}
            >
                Assign
            </button>
        </div>
      </div>
    </div>
  );
};

export default AssignReportingManager;
