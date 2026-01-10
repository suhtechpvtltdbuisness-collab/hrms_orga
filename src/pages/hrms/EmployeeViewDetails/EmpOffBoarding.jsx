import React from 'react';
import { Calendar, ChevronDown } from "lucide-react";
import EmpDeleteEmployee from './EmpDeleteEmployee';

const InputField = ({ label, placeholder, defaultValue, type = "text" }) => (
    <div className="flex flex-col gap-1.5 w-full">
        <label className="text-base font-normal text-[#757575] leading-[140%]" style={{ fontFamily: '"Inter", sans-serif' }}>
            {label}
        </label>
        <input
            type={type}
            placeholder={placeholder}
            defaultValue={defaultValue}
            disabled
            className="
                w-full px-4 py-3 border border-[#D9D9D9] rounded-lg text-[#757575] bg-[#F5F5F5]
                focus:outline-none transition-all cursor-not-allowed
            "
            style={{ fontFamily: '"Inter", sans-serif' }}
        />
    </div>
);


const DatePicker = ({ label, placeholder }) => (
    <div className="flex flex-col gap-1.5 w-full relative">
        <label className="text-base font-normal text-[#757575] leading-[140%]" style={{ fontFamily: '"Inter", sans-serif' }}>
            {label}
        </label>
        <div className="relative">
            <input
                type="date"
                placeholder={placeholder}
                disabled
                className="w-full px-4 py-3 bg-[#F5F5F5] border border-[#D9D9D9] rounded-lg text-[#757575] text-base focus:outline-none transition-all cursor-not-allowed"
                style={{ fontFamily: '"Inter", sans-serif' }}
            />
        </div>
    </div>
);

const SelectField = ({ label, placeholder, options = [] }) => (
    <div className="flex flex-col gap-1.5 w-full">
        <label className="text-base font-normal text-[#757575] leading-[140%]" style={{ fontFamily: '"Inter", sans-serif' }}>
            {label}
        </label>
        <div className="relative">
            <select
                disabled
                className="w-full px-4 py-3 bg-[#F5F5F5] border border-[#D9D9D9] rounded-lg text-[#757575] text-base appearance-none focus:outline-none transition-all cursor-not-allowed"
                style={{ fontFamily: '"Inter", sans-serif' }}
            >
                <option value="">{placeholder}</option>
                {options.map((opt, idx) => (
                    <option key={idx} value={opt}>{opt}</option>
                ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDown className="text-gray-400" size={20} />
            </div>
        </div>
    </div>
);


const CheckboxField = ({ label, description }) => (
    <div className="flex items-start gap-3">
        <input
            type="checkbox"
            className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 mt-1"
        />
        <div className="flex flex-col">
            <span className="text-base font-normal text-[#757575]" style={{ fontFamily: '"Inter", sans-serif' }}>{label}</span>
            <span className="text-xs text-[#959595]" style={{ fontFamily: '"Inter", sans-serif' }}>{description}</span>
        </div>
    </div>
);



const EmpOffBoarding = () => {

    return (
        <div className="h-full font-sans flex flex-col p-2 bg-white rounded-xl relative">

            {/* Personal & Employment Details */}
            <h2 className="text-[16px] font-semibold text-[#1E1E1E] mb-3 leading-none" style={{ fontFamily: '"Inter", sans-serif' }}>
                Personal & Employment Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <InputField label="Employee ID" placeholder="EMP-1001" />
                <DatePicker label="Date of Joining" placeholder="15/01/2023" />
                <InputField label="Department" placeholder="Product Design" />
                <InputField label="Manager" placeholder="Priya Sharma" />
                <InputField label="Phone" placeholder="+91 9845364758" />
                <InputField label="Location" placeholder="Mumbai" />
            </div>

            {/* Offboarding & Exit Formalities */}
            <h2 className="text-[16px] font-semibold text-[#1E1E1E] mb-3 leading-none" style={{ fontFamily: '"Inter", sans-serif' }}>
                Offboarding & Exit Formalities
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                <DatePicker label="Exit Date" placeholder="Select date" />
                <SelectField label="Type" placeholder="Select Type" options={['Resignation', 'Termination', 'Absconding']} />
            </div>

            {/* Reason for Resignation / Termination */}
            <h2 className="text-[16px] font-medium text-gray-500 mb-3 leading-none" style={{ fontFamily: '"Inter", sans-serif' }}>
                Reason for Resignation / Termination
            </h2>

            <div className="mb-2 w-full md:w-1/2">
                <textarea
                    placeholder="Enter detailed reason..."
                    disabled
                    className="w-full h-22 px-4 py-3 bg-[#F5F5F5] border border-[#D9D9D9] rounded-lg text-[#757575] text-base focus:outline-none transition-all resize-none placeholder-gray-400 cursor-not-allowed"
                    style={{ fontFamily: '"Inter", sans-serif' }}
                />
            </div>

            {/* Checklist */}
            <div className="border border-[#EBEBEB] rounded-lg p-6 mb-4 w-full md:w-3/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                    <CheckboxField label="Return Assets" description="Laptop, Monitor, Keycard returned." />
                    <CheckboxField label="Final Settlement" description="Full & Final settlement processed." />
                    <CheckboxField label="Experience Letter" description="Generate and send experience letter." />
                    <CheckboxField label="Deactivate System Access" description="Revoke access to Email, Slack, Jira." />
                </div>
            </div>

            {/* Buttons */}
            <div>
                <EmpDeleteEmployee />
            </div>

        </div>
    );
};

export default EmpOffBoarding;