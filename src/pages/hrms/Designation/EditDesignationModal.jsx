
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import FilterDropdown from '../../../components/ui/FilterDropdown';
import SuccessModal from './SuccessModal';
import ErrorModal from './ErrorModal';

const EditDesignationModal = ({ isOpen, onClose, designation }) => {
    const [formData, setFormData] = useState({
        designationName: '',
        department: '',
        level: '',
        reportingManager: '',
        reassignReportingStructure: '',
        status: '',
        responsibilities: '',
        description: ''
    });

    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    const DEPARTMENT_OPTIONS = [
        "Engineering", "Product", "Sales", "Finance",
        "Human Resources", "Legal", "Design", "Administration", "Data & Analysis"
    ];
    const LEVEL_OPTIONS = ["L-1", "L-2", "L-3", "L-4", "L-5"];
    const STATUS_OPTIONS = ["Active", "Inactive"];
    const MANAGER_OPTIONS = ["Ankit Kumar", "Soumya Sindhu", "Anupam", "Rohit Sharma"];

    useEffect(() => {
        if (designation) {
            setFormData({
                designationName: designation.name || '',
                department: designation.department || '',
                level: designation.level || '',
                reportingManager: 'Director of Product',
                reassignReportingStructure: 'Rohit Sharma',
                status: designation.status || 'Active',
                responsibilities: designation.responsibilities || `• Define the product strategy and roadmap.
• Deliver MRDs and PRDs with prioritized features and corresponding justification.
• Work with external third parties to assess partnerships and licensing opportunities.
• Run beta and pilot programs with early-stage products and samples.
• Be an expert with respect to the competition.`,
                description: designation.description || "The Senior Product Manager is responsible for the product planning and execution throughout the Product Lifecycle, including: gathering and prioritizing product and customer requirements, defining the product vision, and working closely with engineering, sales, marketing and support to ensure revenue and customer satisfaction goals are met."
            });
        }
    }, [designation]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (!formData.designationName || !formData.department) {
             setShowError(true);
             return;
        }
        
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            onClose();
        }, 3000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-[#3B3A3A82] z-50 flex justify-center items-center">
            <div className="bg-white rounded-xl p-6 w-[95%] md:w-[720px] shadow-xl relative max-h-[90vh] overflow-y-auto custom-scrollbar" style={{ fontFamily: 'Inter, sans-serif' }}>
                
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-[18px] font-semibold text-[#393C46]">Edit Designation</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                {/* Form Fields - 2 Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-4">
                    {/* Designation Name */}
                    <div className="flex flex-col gap-[8px]">
                        <label className="text-[16px] font-normal text-[#1E1E1E]">Designation Name</label>
                        <input
                            type="text"
                            name="designationName"
                            value={formData.designationName}
                            onChange={handleInputChange}
                            className="w-full h-[40px] px-4 py-2 border border-[#D9D9D9] rounded-[8px] text-[16px] font-base outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all text-[#1E1E1E]"
                        />
                    </div>

                    {/* Department */}
                    <div className="flex flex-col gap-[8px]">
                        <label className="text-[16px] font-normal text-[#1E1E1E]">Department</label>
                        <div className="relative">
                            <FilterDropdown
                                options={DEPARTMENT_OPTIONS}
                                value={formData.department}
                                onChange={(val) => setFormData(prev => ({ ...prev, department: val }))}
                                className="w-full h-[40px] px-4 flex items-center justify-between bg-white border border-[#D9D9D9] rounded-[8px] text-[16px] text-[#1E1E1E] font-base outline-none focus:border-purple-600 transition-all"
                            />
                        </div>
                    </div>

                    {/* Level */}
                    <div className="flex flex-col gap-[8px]">
                        <label className="text-[16px] font-normal text-[#1E1E1E]">Level</label>
                         <div className="relative">
                           <input 
                                type="text"
                                name="level"
                                value={formData.level} 
                                onChange={handleInputChange}
                                className="w-full h-[40px] px-4 py-2 border border-[#D9D9D9] rounded-[8px] text-[16px] font-base outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all text-[#1E1E1E]"
                           />
                        </div>
                    </div>

                    {/* Reporting Manager */}
                    <div className="flex flex-col gap-[8px]">
                        <label className="text-[16px] font-normal text-[#1E1E1E]">Reporting Manager</label>
                         <input
                            type="text"
                            name="reportingManager"
                            value={formData.reportingManager}
                            onChange={handleInputChange}
                            className="w-full h-[40px] px-4 py-2 border border-[#D9D9D9] rounded-[8px] text-[16px] font-base outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all text-[#1E1E1E]"
                        />
                    </div>

                    {/* Reassign Reporting Structure */}
                    <div className="flex flex-col gap-[8px]">
                        <label className="text-[16px] font-normal text-[#1E1E1E]">Reassign Reporting Structure</label>
                        <div className="relative">
                             <FilterDropdown
                                options={MANAGER_OPTIONS}
                                value={formData.reassignReportingStructure}
                                onChange={(val) => setFormData(prev => ({ ...prev, reassignReportingStructure: val }))}
                                className="w-full h-[40px] px-4 flex items-center justify-between bg-white border border-[#D9D9D9] rounded-[8px] text-[16px] text-[#1E1E1E] font-base outline-none focus:border-purple-600 transition-all"
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div className="flex flex-col gap-[8px]">
                        <label className="text-[16px] font-normal text-[#1E1E1E]">Status</label>
                        <div className="relative">
                             <FilterDropdown
                                options={STATUS_OPTIONS}
                                value={formData.status}
                                onChange={(val) => setFormData(prev => ({ ...prev, status: val }))}
                                className="w-full h-[40px] px-4 flex items-center justify-between bg-white border border-[#D9D9D9] rounded-[8px] text-[16px] text-[#1E1E1E] font-base outline-none focus:border-purple-600 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Full Width Fields */}
                <div className="flex flex-col gap-4 mb-8">
                     {/* Responsibilities */}
                    <div className="flex flex-col gap-[8px]">
                        <label className="text-[16px] font-normal text-[#1E1E1E] h-">Responsibilities</label>
                        <textarea
                            name="responsibilities"
                            value={formData.responsibilities}
                            onChange={handleInputChange}
                            rows="4" 
                            className="w-full px-4 py-2 border h-[178px] border-[#D9D9D9] text-[#757575] rounded-[8px] text-[16px] font-base outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all resize-none"
                        />
                    </div>

                     {/* Description */}
                    <div className="flex flex-col gap-[8px]">
                        <label className="text-[16px] font-normal text-[#1E1E1E]">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="3"
                             className="w-full px-4 py-2 border h-[158px] border-[#D9D9D9] text-[#757575] rounded-[8px] text-[16px] font-base outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all resize-none"
                        />
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-10 py-2 border border-[#7D1EDB] rounded-full text-[#7D1EDB] font-medium hover:bg-purple-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-10 py-2 bg-[#7D1EDB] text-white rounded-full font-medium hover:bg-purple-700 transition-colors"
                    >
                        Save
                    </button>
                </div>
            </div>

            {/* Nested Success Modal (or handled side-by-side) */}
             <SuccessModal
                isOpen={showSuccess}
                onClose={() => {
                    setShowSuccess(false);
                    onClose();
                }}
                message="Designation Saved Successfully"
                subMessage="Designation is now saved"
            />
            
             <ErrorModal
                isOpen={showError}
                onClose={() => setShowError(false)}
            />
        </div>
    );
};

export default EditDesignationModal;
