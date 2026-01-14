import React, { useState } from 'react';
import { ChevronDown } from "lucide-react";
import DeleteEmployee from '../DeleteEmployee/DeleteEmployee';
import FilterDropdown from '../../../../components/ui/FilterDropdown';

const InputField = ({ label, placeholder, value, onChange, type = "text" }) => (
    <div className="flex flex-col gap-1.5 w-full">
        <label className="text-base font-normal text-[#757575] leading-[140%]" style={{ fontFamily: '"Inter", sans-serif' }}>
            {label}
        </label>
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="
                w-full px-4 py-3 border border-[#D9D9D9] rounded-lg text-black bg-white
                focus:outline-none focus:border-purple-500 transition-all
            "
            style={{ fontFamily: '"Inter", sans-serif' }}
        />
    </div>
);


const DatePicker = ({ label, placeholder, value, onChange }) => (
    <div className="flex flex-col gap-1.5 w-full relative">
        <label className="text-base font-normal text-[#757575] leading-[140%]" style={{ fontFamily: '"Inter", sans-serif' }}>
            {label}
        </label>
        <div className="relative">
            <input
                type="date"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full px-4 py-3 bg-white border border-[#D9D9D9] rounded-lg text-black text-base focus:outline-none focus:border-purple-500 transition-all appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                style={{ fontFamily: '"Inter", sans-serif' }}
            />
            <img
                src="/images/calender.svg"
                alt="calendar"
                className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none w-5 h-5 bg-white"
            />
        </div>
    </div>
);

const SelectField = ({ label, placeholder, value, onChange, options = [] }) => (
    <div className="flex flex-col gap-1.5 w-full">
        <label className="text-base font-normal text-[#757575] leading-[140%]" style={{ fontFamily: '"Inter", sans-serif' }}>
            {label}
        </label>
        <FilterDropdown
            options={options}
            value={value}
            onChange={(val) => onChange({ target: { value: val } })}
            placeholder={placeholder}
            className="w-full px-4 py-3 bg-white border border-[#D9D9D9] rounded-lg text-black text-base outline-none transition-all cursor-pointer flex items-center justify-between"
            minWidth="100%"
        />
    </div>
);


const CheckboxField = ({ label, description, checked, onChange }) => (
    <div className="flex items-start gap-3">
        <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 mt-1 cursor-pointer"
        />
        <div className="flex flex-col">
            <span className="text-base font-normal text-[#1E1E1E]" style={{ fontFamily: '"Inter", sans-serif' }}>{label}</span>
            <span className="text-xs text-[#959595]" style={{ fontFamily: '"Inter", sans-serif' }}>{description}</span>
        </div>
    </div>
);



const EmpUpdateOffBoarding = () => {
    const [employeeId, setEmployeeId] = useState("EMP-1001");
    const [dateOfJoining, setDateOfJoining] = useState("");
    const [department, setDepartment] = useState("Product Design");
    const [manager, setManager] = useState("Priya Sharma");
    const [phone, setPhone] = useState("9845364758");
    const [location, setLocation] = useState("Mumbai");
    const [exitDate, setExitDate] = useState("");
    const [exitType, setExitType] = useState("");
    const [reason, setReason] = useState("");
    const [checklist, setChecklist] = useState({
        returnAssets: false,
        finalSettlement: false,
        experienceLetter: false,
        deactivateAccess: false
    });

    return (
        <div className="h-full font-sans flex flex-col p-2 bg-white rounded-xl relative">

            {/* Personal & Employment Details */}
            <h2 className="text-[16px] font-semibold text-[#1E1E1E] mb-3 leading-none" style={{ fontFamily: '"Inter", sans-serif' }}>
                Personal & Employment Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                <InputField label="Employee ID" placeholder="EMP-1001" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} />
                <DatePicker label="Date of Joining" placeholder="15/01/2023" value={dateOfJoining} onChange={(e) => setDateOfJoining(e.target.value)} />
                <InputField label="Department" placeholder="Product Design" value={department} onChange={(e) => setDepartment(e.target.value)} />
                <InputField label="Manager" placeholder="Priya Sharma" value={manager} onChange={(e) => setManager(e.target.value)} />
                <InputField
                    label="Phone"
                    placeholder="+91 9876543210"
                    value={phone ? `+91 ${phone}` : ''}
                    onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ''); 
                        if (value.length <= 10) {
                            setPhone(value);
                        }
                    }}
                    type="tel"
                />
                <InputField label="Location" placeholder="Mumbai" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>

            {/* Offboarding & Exit Formalities */}
            <h2 className="text-[16px] font-semibold text-[#1E1E1E] mb-3 leading-none" style={{ fontFamily: '"Inter", sans-serif' }}>
                Offboarding & Exit Formalities
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mb-4">
                <DatePicker label="Exit Date" placeholder="Select date" value={exitDate} onChange={(e) => setExitDate(e.target.value)} />
                <SelectField label="Type" placeholder="Select Type" value={exitType} onChange={(e) => setExitType(e.target.value)} options={['Resignation', 'Termination', 'Absconding']} />
            </div>

            {/* Reason for Resignation / Termination */}
            <h2 className="text-[16px] font-medium text-gray-500 mb-3 leading-none" style={{ fontFamily: '"Inter", sans-serif' }}>
                Reason for Resignation / Termination
            </h2>

            <div className="mb-2 w-full md:w-1/2">
                <textarea
                    placeholder="Enter detailed reason..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full h-22 px-4 py-3 bg-white border border-[#D9D9D9] rounded-lg text-black text-base focus:outline-none focus:border-purple-500 transition-all resize-none placeholder-gray-400"
                    style={{ fontFamily: '"Inter", sans-serif' }}
                />
            </div>

            {/* Checklist */}
            <div className="border border-[#EBEBEB] rounded-lg p-4 sm:p-6 mb-4 w-full md:w-3/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-6 md:gap-x-12">
                    <CheckboxField
                        label="Return Assets"
                        description="Laptop, Monitor, Keycard returned."
                        checked={checklist.returnAssets}
                        onChange={(e) => setChecklist({ ...checklist, returnAssets: e.target.checked })}
                    />
                    <CheckboxField
                        label="Final Settlement"
                        description="Full & Final settlement processed."
                        checked={checklist.finalSettlement}
                        onChange={(e) => setChecklist({ ...checklist, finalSettlement: e.target.checked })}
                    />
                    <CheckboxField
                        label="Experience Letter"
                        description="Generate and send experience letter."
                        checked={checklist.experienceLetter}
                        onChange={(e) => setChecklist({ ...checklist, experienceLetter: e.target.checked })}
                    />
                    <CheckboxField
                        label="Deactivate System Access"
                        description="Revoke access to Email, Slack, Jira."
                        checked={checklist.deactivateAccess}
                        onChange={(e) => setChecklist({ ...checklist, deactivateAccess: e.target.checked })}
                    />
                </div>
            </div>

            {/* Buttons */}
            <div>
                <DeleteEmployee />
            </div>

        </div>
    );
};

export default EmpUpdateOffBoarding;
