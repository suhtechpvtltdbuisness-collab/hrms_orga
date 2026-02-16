import React, { useState } from 'react';
import { X, Calendar, ChevronDown } from 'lucide-react';
import FilterDropdown from '../../../../../components/ui/FilterDropdown';
import CustomDatePicker from '../../../../../components/ui/CustomDatePicker';

const AddProject = ({ isOpen, onClose, onAdd, employee }) => {
  const [formData, setFormData] = useState({
    project: '',
    role: '',
    startDate: '',
    endDate: ''
  });

  const PROJECT_OPTIONS = ["HRMS", "E-Commerce", "Finance App", "Healthcare Portal"];
  const ROLE_OPTIONS = ["Frontend Developer", "Backend Developer", "UI/UX Designer", "QA Engineer"];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = Object.values(formData).every(value => value && value.trim() !== '');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#100F0F59] font-sans" style={{ fontFamily: '"Inter", sans-serif' }}>
      <div className="bg-white rounded-[20px] w-[90%] max-w-[700px] p-8 relative shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-[20px] font-semibold text-[#1E1E1E]">Add to Project</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-[#667085]" />
          </button>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-4 mb-8">
            <div className="w-[60px] h-[60px] rounded-full overflow-hidden shrink-0">
                    <img src="/images/Ellipse 595.svg" alt="User" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col gap-2">
                <div>
                    <h3 className="text-[18px] font-bold text-[#000000]">{employee?.name || 'Sophia Miller'}</h3>
                    <p className="text-[12px] text-[#ABABAB]">{employee?.role || 'UI/UX Designer'}</p>
                </div>
                 <div className="flex gap-2 flex-wrap">
                     {employee?.skills?.map((skill, index) => (
                         <span key={index} className="px-3 py-1 bg-[#EEF2FF] text-[#000000] rounded-full text-[12px] border-[0.2px] border-[#C6C6C6] font-medium" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>{skill}</span>
                     ))}
                </div>
            </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
             {/* Select Project */}
             <div>
                <label className="block text-[16px] font-medium text-[#1E1E1E] mb-2">Select Project</label>
                <FilterDropdown 
                    options={PROJECT_OPTIONS}
                    value={formData.project}
                    onChange={(val) => handleInputChange('project', val)}
                    placeholder="Choose a project"
                    className="w-full h-[48px] bg-white! rounded-[12px] border border-[#D9D9D9] flex items-center justify-between px-4"
                />
            </div>

            {/* Assign Role */}
             <div>
                <label className="block text-[16px] font-medium text-[#1E1E1E] mb-2">Assign Role</label>
                <FilterDropdown 
                    options={ROLE_OPTIONS}
                    value={formData.role}
                    onChange={(val) => handleInputChange('role', val)}
                    placeholder="Select a role"
                    className="w-full h-[48px] bg-white! rounded-[12px] border border-[#D9D9D9] flex items-center justify-between px-4"
                />
            </div>


            {/* Start Date & End Date */}
            <div className="grid grid-cols-2 gap-6">
                 <div>
                    <label className="block text-[16px] font-medium text-[#1E1E1E] mb-2">Start Date</label>
                    <div className="relative">
                        <CustomDatePicker
                            value={formData.startDate}
                            onChange={(val) => handleInputChange('startDate', val)}
                            placeholder="Select Date"
                            className="w-full h-[48px] px-4 rounded-[12px] bg-white border border-[#D9D9D9] text-[#1E1E1E]"
                        />
                    </div>
                </div>
                 <div>
                    <label className="block text-[16px] font-medium text-[#1E1E1E] mb-2">End Date</label>
                    <div className="relative">
                        <CustomDatePicker
                             value={formData.endDate}
                             onChange={(val) => handleInputChange('endDate', val)}
                             placeholder="Select Date"
                             className="w-full h-[48px] px-4 rounded-[12px] bg-white border border-[#D9D9D9] text-[#1E1E1E]"
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-4 mt-8">
            <button 
                onClick={onClose}
                className="px-8 h-[48px] rounded-full border border-[#7D1EDB] text-[#7D1EDB] font-medium text-[16px] hover:bg-purple-50 transition-colors"
                style={{ fontFamily: '"Poppins", sans-serif' }}
            >
                Cancel
            </button>
            <button 
                onClick={() => onAdd(formData)}
                disabled={!isFormValid}
                className={`px-8 h-[48px] rounded-full bg-[#7D1EDB] text-white font-medium text-[16px] transition-colors ${!isFormValid ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#6c1ac0]'}`}
                style={{ fontFamily: '"Poppins", sans-serif' }}
            >
                Add to project
            </button>
        </div>
      </div>
    </div>
  );
};

export default AddProject;
