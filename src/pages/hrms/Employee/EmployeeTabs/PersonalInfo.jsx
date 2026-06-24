import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Camera, Loader2 } from 'lucide-react';
import FilterDropdown from '../../../../components/ui/FilterDropdown';
import CustomDatePicker from '../../../../components/ui/CustomDatePicker';
import { employeeService, getProfilePicUrl } from '../../../../service';

const AccordionItem = ({ title, isOpen, onToggle, children }) => {
    return (
        <div className="flex flex-col">
            <div
                className={`border rounded-lg overflow-hidden ${isOpen ? 'bg-white border-gray-200' : 'bg-[#F5F5F5] border-[#CBCBCB]'
                    }`}
            >
                <button
                    onClick={onToggle}
                    className="w-full px-4 h-[52px] flex justify-between items-center transition-colors text-left"
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

const PersonalInfo = ({ formData = {}, onChange }) => {
    const [sections, setSections] = useState({
        basicDetails: true,
        emergencyContact: false,
        identification: false
    });
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const localUrl = URL.createObjectURL(file);
        onChange({ target: { name: 'profilePic', value: localUrl } });
        onChange({ target: { name: 'profilePicFile', value: file } });
    };


    const toggleSection = (section) => {
        setSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const inputClasses = "w-full px-4 py-3 bg-white border border-[#D9D9D9] rounded-lg text-[#000000] text-base focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-all placeholder-gray-400";
    const labelClasses = "block text-base font-normal text-[#1E1E1E] mb-1.5 leading-[140%]";

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

                    {/* Profile Picture Upload */}
                    <div className="col-span-1 sm:col-span-2 xl:col-span-4 flex flex-col sm:flex-row items-center gap-6 pb-4 border-b border-gray-100 mb-2">
                        <div className="relative group w-24 h-24 rounded-full overflow-hidden border-2 border-purple-200 bg-purple-50 flex items-center justify-center cursor-pointer shadow-inner">
                            {formData.profilePic ? (
                                <img
                                    src={getProfilePicUrl(formData.profilePic)}
                                    alt="Profile Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Camera className="w-8 h-8 text-purple-400 group-hover:scale-110 transition-transform" />
                            )}
                            {uploading && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                disabled={uploading}
                            />
                        </div>
                        <div className="flex flex-col text-center sm:text-left gap-1">
                            <h3 className="text-sm font-semibold text-gray-800">Profile Picture</h3>
                            <p className="text-xs text-gray-500">Supports JPG, PNG, GIF. Max size 5MB.</p>
                            <label className="text-xs text-purple-600 font-semibold cursor-pointer hover:text-purple-700 underline mt-1">
                                {formData.profilePic ? "Change Photo" : "Upload Photo"}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    disabled={uploading}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Full Name */}
                    <div>
                        <label className={labelClasses}>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name || ''}
                            onChange={onChange}
                            placeholder="Enter full name"
                            className={inputClasses}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className={labelClasses}>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email || ''}
                            onChange={onChange}
                            placeholder="Enter email address"
                            className={inputClasses}
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className={labelClasses}>Phone Number</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone || ''}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                onChange({ target: { name: 'phone', value: val } });
                            }}
                            placeholder="Enter 10-digit phone number"
                            maxLength={10}
                            inputMode="numeric"
                            className={inputClasses}
                        />
                    </div>

                    {/* Gender */}
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
                            className={`${inputClasses} flex items-center justify-between cursor-pointer`}
                            buttonTextClassName="text-[#000000]"
                        />
                    </div>

                    {/* Date of Birth */}
                    <div>
                        <label className={labelClasses}>Date of Birth</label>
                        <div className="relative">
                            <CustomDatePicker
                                value={formData.dob}
                                onChange={(val) => onChange({ target: { name: 'dob', value: val } })}
                                placeholder="Select Date"
                                className="bg-white border-gray-200"
                            />
                        </div>
                    </div>

                    {/* Blood Group */}
                    <div>
                        <label className={labelClasses}>Blood Group</label>
                        <FilterDropdown
                            placeholder="Select Blood group"
                            options={[
                                { label: 'A+', value: 'a+' },
                                { label: 'B+', value: 'b+' },
                                { label: 'O+', value: 'o+' },
                                { label: 'AB+', value: 'ab+' }
                            ]}
                            value={formData.bloodGroup}
                            onChange={(val) => onChange({ target: { name: 'bloodGroup', value: val } })}
                            className={`${inputClasses} flex items-center justify-between cursor-pointer`}
                            buttonTextClassName="text-[#000000]"
                        />
                    </div>

                    {/* Marital Status */}
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
                            className={`${inputClasses} flex items-center justify-between cursor-pointer`}
                            buttonTextClassName="text-[#000000]"
                        />
                    </div>

                    {/* Address - Full Width */}
                    <div className="col-span-1 sm:col-span-2">
                        <label className={labelClasses}>Address</label>
                        <textarea
                            name="address"
                            value={formData.address || ''}
                            onChange={onChange}
                            placeholder="Enter your Address"
                            rows="1"
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                        <div>
                            <label className={labelClasses}>Contact Name</label>
                            <input
                                type="text"
                                name="contactName"
                                value={formData.contactName || ''}
                                onChange={onChange}
                                placeholder="Enter contact name"
                                className={inputClasses}
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>Relation</label>
                            <input
                                type="text"
                                name="relation"
                                value={formData.relation || ''}
                                onChange={onChange}
                                placeholder="Enter relation"
                                className={inputClasses}
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>Contact Number</label>
                            <input
                                type="text"
                                name="contactNumber"
                                value={formData.contactNumber || ''}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                    onChange({ target: { name: 'contactNumber', value: val } });
                                }}
                                placeholder="Enter 10-digit contact number"
                                maxLength={10}
                                inputMode="numeric"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                    <div>
                        <label className={labelClasses}>Aadhar Number</label>
                        <input
                            type="text"
                            name="aadharNumber"
                            value={formData.aadharNumber || ''}
                            onChange={onChange}
                            placeholder="Enter aadhar number"
                            className={inputClasses}
                        />
                    </div>
                    <div>
                        <label className={labelClasses}>PAN Number</label>
                        <input
                            type="text"
                            name="panNumber"
                            value={formData.panNumber || ''}
                            onChange={onChange}
                            placeholder="Enter PAN number"
                            className={inputClasses}
                        />
                    </div>
                </div>
            </AccordionItem>
        </div>
    );
};

export default PersonalInfo;
