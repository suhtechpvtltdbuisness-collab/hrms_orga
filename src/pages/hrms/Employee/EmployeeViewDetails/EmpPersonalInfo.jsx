import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const AccordionItem = ({ title, isOpen, onToggle, children }) => {
    return (
        <div className="flex flex-col">
            <div
                className={`border rounded-lg overflow-hidden ${isOpen ? 'bg-white border-gray-200' : 'bg-[#F5F5F5] border-[#CBCBCB]'}`}
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

const EmpPersonalInfo = ({ data }) => {
    const [sections, setSections] = useState({
        basicDetails: true,
        emergencyContact: false,
        identification: false
    });

    const toggleSection = (section) => {
        setSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const inputClasses = "w-full px-4 py-3 bg-[#F5F5F5] border border-[#D9D9D9] rounded-lg text-[#757575] text-base focus:outline-none transition-all placeholder-gray-400 cursor-not-allowed";
    const labelClasses = "block text-base font-normal text-[#757575] mb-1.5 leading-[140%]";

    const getEmployeeId = () => {
        if (data?.id) {
            return `EMP-${String(data.id).padStart(3, '0')}`;
        }
        return "-";
    };

    return (
        <div className="h-full flex flex-col gap-4">
            {/* Basic Details Accordion */}
            <AccordionItem
                title="Basic Details"
                isOpen={sections.basicDetails}
                onToggle={() => toggleSection('basicDetails')}
                className="bg-[#F5F5F5]"
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-8 gap-y-6 ">
                    {/* Name */}
                    <div>
                        <label className={labelClasses}>Name</label>
                        <input type="text" value={data?.name || "-"} className={inputClasses} disabled />
                    </div>

                    {/* Email */}
                    <div>
                        <label className={labelClasses}>Email</label>
                        <input type="text" value={data?.email || "-"} className={inputClasses} disabled />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className={labelClasses}>Phone</label>
                        <input type="text" value={data?.phone || "-"} className={inputClasses} disabled />
                    </div>

                    {/* Employee ID */}
                    <div>
                        <label className={labelClasses}>Employee ID</label>
                        <input type="text" value={getEmployeeId()} className={inputClasses} disabled />
                    </div>

                    {/* Gender */}
                    <div>
                        <label className={labelClasses}>Gender</label>
                        <input type="text" value={data?.gender || "-"} className={`${inputClasses} capitalize`} disabled />
                    </div>

                    {/* Date of Birth */}
                    <div>
                        <label className={labelClasses}>Date of Birth</label>
                        <input type="text" value={data?.dob || "-"} className={inputClasses} disabled />
                    </div>

                    {/* Blood Group */}
                    <div>
                        <label className={labelClasses}>Blood Group</label>
                        <input type="text" value={data?.bloodGroup || "-"} className={`${inputClasses} uppercase`} disabled />
                    </div>

                    {/* Marital Status */}
                    <div>
                        <label className={labelClasses}>Marital Status</label>
                        <input type="text" value={data?.maritalStatus ? "Married" : "Single"} className={inputClasses} disabled />
                    </div>

                    {/* Address */}
                    <div className="col-span-1 sm:col-span-2">
                        <label className={labelClasses}>Address</label>
                        <input type="text" value={data?.address || "-"} className={inputClasses} disabled />
                    </div>
                </div>
            </AccordionItem>

            {/* Emergency Contact Accordion */}
            <AccordionItem
                title="Emergency Contact"
                isOpen={sections.emergencyContact}
                onToggle={() => toggleSection('emergencyContact')}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-8 gap-y-6">
                    <div>
                        <label className={labelClasses}>Contact Name</label>
                        <input type="text" value={data?.eContactName || "-"} className={inputClasses} disabled />
                    </div>
                    <div>
                        <label className={labelClasses}>Relation</label>
                        <input type="text" value={data?.eRelation || "-"} className={`${inputClasses} capitalize`} disabled />
                    </div>
                    <div>
                        <label className={labelClasses}>Contact Number</label>
                        <input type="text" value={data?.eContactNumber || "-"} className={inputClasses} disabled />
                    </div>
                </div>
            </AccordionItem>

            {/* Identification Accordion */}
            <AccordionItem
                title="Identification"
                isOpen={sections.identification}
                onToggle={() => toggleSection('identification')}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-8 gap-y-6">
                    <div>
                        <label className={labelClasses}>Aadhar Number</label>
                        <input type="text" value={data?.aadharNo || "-"} className={inputClasses} disabled />
                    </div>
                    <div>
                        <label className={labelClasses}>PAN Number</label>
                        <input type="text" value={data?.pancardNo || "-"} className={inputClasses} disabled />
                    </div>
                </div>
            </AccordionItem>
        </div>
    );
};

export default EmpPersonalInfo;
