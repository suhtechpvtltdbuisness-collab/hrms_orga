import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import FilterDropdown from '../../../../components/ui/FilterDropdown';
import CustomDatePicker from '../../../../components/ui/CustomDatePicker';

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

const EmpPersonalInfo = ({ data, isEditMode = false, formData = {}, onChange }) => {
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

    // View-mode (disabled) styles
    const readonlyClasses = "w-full px-4 py-3 bg-[#F5F5F5] border border-[#D9D9D9] rounded-lg text-[#757575] text-base focus:outline-none transition-all placeholder-gray-400 cursor-not-allowed";
    // Edit-mode (active) styles
    const editClasses = "w-full px-4 py-3 bg-white border border-[#D9D9D9] rounded-lg text-[#000000] text-base focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-all placeholder-gray-400";

    const labelClasses = `block text-base font-normal mb-1.5 leading-[140%] ${isEditMode ? 'text-[#1E1E1E]' : 'text-[#757575]'}`;

    const getEmployeeId = () => {
        if (data?.id) return `EMP-${String(data.id).padStart(3, '0')}`;
        return "-";
    };

    const renderField = (label, name, type = "text", displayValue) => {
        if (isEditMode && onChange) {
            return (
                <div>
                    <label className={labelClasses}>{label}</label>
                    <input
                        type={type}
                        name={name}
                        value={formData[name] || ''}
                        onChange={onChange}
                        placeholder={`Enter ${label.toLowerCase()}`}
                        className={editClasses}
                    />
                </div>
            );
        }
        return (
            <div>
                <label className={labelClasses}>{label}</label>
                <input
                    type="text"
                    value={displayValue !== undefined ? displayValue : (data?.[name] || "-")}
                    className={readonlyClasses}
                    disabled
                />
            </div>
        );
    };

    // Phone field: digits only, max 10
    const renderPhoneField = (label, name, displayValue) => {
        if (isEditMode && onChange) {
            return (
                <div>
                    <label className={labelClasses}>{label}</label>
                    <input
                        type="text"
                        name={name}
                        value={formData[name] || ''}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                            onChange({ target: { name, value: val } });
                        }}
                        placeholder="Enter 10-digit number"
                        maxLength={10}
                        inputMode="numeric"
                        className={editClasses}
                    />
                </div>
            );
        }
        return (
            <div>
                <label className={labelClasses}>{label}</label>
                <input
                    type="text"
                    value={displayValue !== undefined ? displayValue : (data?.[name] || "-")}
                    className={readonlyClasses}
                    disabled
                />
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col gap-4">
            {/* Basic Details Accordion */}
            <AccordionItem
                title="Basic Details"
                isOpen={sections.basicDetails}
                onToggle={() => toggleSection('basicDetails')}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-8 gap-y-6">

                    {/* Name */}
                    {renderField("Name", "name")}

                    {/* Email */}
                    {renderField("Email", "email", "email")}

                    {/* Phone */}
                    {renderPhoneField("Phone", "phone")}

                    {/* Employee ID — always read-only */}
                    <div>
                        <label className={labelClasses}>Employee ID</label>
                        <input type="text" value={getEmployeeId()} className={readonlyClasses} disabled />
                    </div>

                    {/* Gender */}
                    {isEditMode ? (
                        <div>
                            <label className={labelClasses}>Gender</label>
                            <FilterDropdown
                                placeholder="Select Gender"
                                options={[
                                    { label: 'Male', value: 'male' },
                                    { label: 'Female', value: 'female' },
                                    { label: 'Other', value: 'other' }
                                ]}
                                value={formData.gender}
                                onChange={(val) => onChange({ target: { name: 'gender', value: val } })}
                                className={`${editClasses} flex items-center justify-between cursor-pointer`}
                                buttonTextClassName="text-[#000000]"
                            />
                        </div>
                    ) : (
                        <div>
                            <label className={labelClasses}>Gender</label>
                            <input type="text" value={data?.gender || "-"} className={`${readonlyClasses} capitalize`} disabled />
                        </div>
                    )}

                    {/* Date of Birth */}
                    {isEditMode ? (
                        <div>
                            <label className={labelClasses}>Date of Birth</label>
                            <CustomDatePicker
                                value={formData.dob}
                                onChange={(val) => onChange({ target: { name: 'dob', value: val } })}
                                placeholder="Select Date"
                                className="bg-white border-gray-200"
                            />
                        </div>
                    ) : (
                        <div>
                            <label className={labelClasses}>Date of Birth</label>
                            <input type="text" value={data?.dob || "-"} className={readonlyClasses} disabled />
                        </div>
                    )}

                    {/* Blood Group */}
                    {isEditMode ? (
                        <div>
                            <label className={labelClasses}>Blood Group</label>
                            <FilterDropdown
                                placeholder="Select Blood Group"
                                options={[
                                    { label: 'A+', value: 'a+' },
                                    { label: 'B+', value: 'b+' },
                                    { label: 'O+', value: 'o+' },
                                    { label: 'AB+', value: 'ab+' },
                                    { label: 'A-', value: 'a-' },
                                    { label: 'B-', value: 'b-' },
                                    { label: 'O-', value: 'o-' },
                                    { label: 'AB-', value: 'ab-' },
                                ]}
                                value={formData.bloodGroup}
                                onChange={(val) => onChange({ target: { name: 'bloodGroup', value: val } })}
                                className={`${editClasses} flex items-center justify-between cursor-pointer`}
                                buttonTextClassName="text-[#000000]"
                            />
                        </div>
                    ) : (
                        <div>
                            <label className={labelClasses}>Blood Group</label>
                            <input type="text" value={data?.bloodGroup || "-"} className={`${readonlyClasses} uppercase`} disabled />
                        </div>
                    )}

                    {/* Marital Status */}
                    {isEditMode ? (
                        <div>
                            <label className={labelClasses}>Marital Status</label>
                            <FilterDropdown
                                placeholder="Select Marital Status"
                                options={[
                                    { label: 'Single', value: 'single' },
                                    { label: 'Married', value: 'married' }
                                ]}
                                value={formData.maritalStatus}
                                onChange={(val) => onChange({ target: { name: 'maritalStatus', value: val } })}
                                className={`${editClasses} flex items-center justify-between cursor-pointer`}
                                buttonTextClassName="text-[#000000]"
                            />
                        </div>
                    ) : (
                        <div>
                            <label className={labelClasses}>Marital Status</label>
                            <input type="text" value={data?.maritalStatus ? "Married" : "Single"} className={readonlyClasses} disabled />
                        </div>
                    )}

                    {/* Address */}
                    <div className="col-span-1 sm:col-span-2">
                        <label className={labelClasses}>Address</label>
                        {isEditMode ? (
                            <textarea
                                name="address"
                                value={formData.address || ''}
                                onChange={onChange}
                                placeholder="Enter address"
                                rows="2"
                                className={`${editClasses} resize-none`}
                            />
                        ) : (
                            <input type="text" value={data?.address || "-"} className={readonlyClasses} disabled />
                        )}
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
                    {renderField("Contact Name", "contactName", "text", data?.eContactName)}
                    {renderField("Relation", "relation", "text", data?.eRelation)}
                    {renderPhoneField("Contact Number", "contactNumber", data?.eContactNumber)}
                </div>
            </AccordionItem>

            {/* Identification Accordion */}
            <AccordionItem
                title="Identification"
                isOpen={sections.identification}
                onToggle={() => toggleSection('identification')}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-8 gap-y-6">
                    {renderField("Aadhar Number", "aadharNumber", "text", data?.aadharNo)}
                    {renderField("PAN Number", "panNumber", "text", data?.pancardNo)}
                </div>
            </AccordionItem>
        </div>
    );
};

export default EmpPersonalInfo;
