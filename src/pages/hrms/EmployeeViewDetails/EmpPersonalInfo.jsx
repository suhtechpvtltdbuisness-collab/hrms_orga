import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { getEmployeeData } from '../../../utils/employeeData';

const AccordionItem = ({ title, isOpen, onToggle, children }) => {
    return (
        <div className="flex flex-col">
            <div
                className={`border rounded-lg overflow-hidden ${isOpen ? 'bg-white border-gray-200' : 'bg-[#F5F5F5] border-[#CBCBCB]'
                    }`}
            >
                <button
                    onClick={onToggle}
                    className="w-full px-6 h-[52px] flex justify-between items-center transition-colors text-left"
                >
                    <span className="text-[#000000] font-normal text-[16px] leading-none" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                        {title}
                    </span>
                    {isOpen ? <ChevronUp className="text-gray-500" size={24} /> : <ChevronDown className="text-gray-500" size={24} />}
                </button>
            </div>
            {isOpen && (
                <div className="pt-4 animate-fadeIn">
                    {children}
                </div>
            )}
        </div>
    );
};

const EmpPersonalInfo = () => {
    const [sections, setSections] = useState({
        basicDetails: true,
        emergencyContact: false,
        identification: false
    });

    // Load data from localStorage via utils
    const [data] = useState(getEmployeeData());

    const toggleSection = (section) => {
        setSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const inputClasses = "w-full px-4 py-3 bg-[#F5F5F5] border border-[#D9D9D9] rounded-lg text-[#757575] text-base focus:outline-none transition-all placeholder-gray-400 cursor-not-allowed";
    const labelClasses = "block text-base font-normal text-[#757575] mb-1.5 leading-[140%]";

    return (
        <div className="h-full flex flex-col gap-4">
            {/* Basic Details Accordion */}
            <AccordionItem
                title="Basic Details"
                isOpen={sections.basicDetails}
                onToggle={() => toggleSection('basicDetails')}
                className="bg-[#F5F5F5]"
            >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 ">
                    {/* Gender */}
                    <div>
                        <label className={labelClasses}>Gender</label>
                        <div className="relative">
                            <select
                                disabled
                                value={data.gender || ''}
                                className={`${inputClasses} appearance-none cursor-not-allowed`}
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        </div>
                    </div>

                    {/* Date of Birth */}
                    <div>
                        <label className={labelClasses}>Date of Birth</label>
                        <input
                            type="text"
                            disabled
                            value={data.dob ? data.dob.split('-').reverse().join('/') : ''}
                            className={inputClasses}
                        />
                    </div>

                    {/* Blood Group */}
                    <div>
                        <label className={labelClasses}>Blood Group</label>
                        <div className="relative">
                            <select
                                disabled
                                value={data.bloodGroup || ''}
                                className={`${inputClasses} appearance-none cursor-not-allowed`}
                            >
                                <option value="">Select Blood group</option>
                                <option value="a+">A+</option>
                                <option value="b+">B+</option>
                                <option value="o+">O+</option>
                                <option value="ab+">AB+</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        </div>
                    </div>

                    {/* Marital Status */}
                    <div>
                        <label className={labelClasses}>Marital Status</label>
                        <input
                            type="text"
                            disabled
                            value={data.maritalStatus ? (data.maritalStatus.charAt(0).toUpperCase() + data.maritalStatus.slice(1)) : ''}
                            className={inputClasses}
                        />
                    </div>

                    {/* Address - Full Width */}
                    <div className="col-span-2 md:col-span-2">
                        <label className={labelClasses}>Address</label>
                        <textarea
                            value={data.address || ''}
                            rows="1"
                            disabled
                            className={`${inputClasses} resize-none`}
                        ></textarea>
                    </div>
                </div>
            </AccordionItem>

            {/* Emergency Contact Accordion */}
            <AccordionItem
                title="Emergency Contact"
                isOpen={sections.emergencyContact}
                onToggle={() => toggleSection('emergencyContact')}
            >
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div>
                            <label className={labelClasses}>Contact Name</label>
                            <input
                                type="text"
                                disabled
                                value={data.contactName || ''}
                                className={inputClasses}
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>Relation</label>
                            <input
                                type="text"
                                disabled
                                value={data.relation || ''}
                                className={inputClasses}
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>Contact Number</label>
                            <input
                                type="text"
                                disabled
                                value={data.contactNumber || ''}
                                className={inputClasses}
                            />
                        </div>
                    </div>
                </div>
            </AccordionItem>

            {/* Identification Accordion */}
            <AccordionItem
                title="Identification"
                isOpen={sections.identification}
                onToggle={() => toggleSection('identification')}
            >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                    <div>
                        <label className={labelClasses}>Aadhar Number</label>
                        <input
                            type="text"
                            disabled
                            value={data.aadharNumber || ''}
                            className={inputClasses}
                        />
                    </div>
                    <div>
                        <label className={labelClasses}>PAN Number</label>
                        <input
                            type="text"
                            disabled
                            value={data.panNumber || ''}
                            className={inputClasses}
                        />
                    </div>
                </div>
            </AccordionItem>
        </div>
    );
};

export default EmpPersonalInfo;
