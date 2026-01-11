import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp } from "lucide-react";
import noRecordsImage from '../../../../assets/no-records.svg';

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

const InputField = ({ label, type = "text", placeholder, defaultValue }) => {
    return (
        <div>
            <label className="block text-base font-normal text-[#000000] mb-1.5 leading-[140%]">{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                defaultValue={defaultValue}
                className="
                    w-full px-4 py-3 bg-white border border-gray-200 rounded-lg
                    text-[#B8B8B8] text-base placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-purple-100
                    focus:border-purple-300 transition-all
                "
            />
        </div>
    );
};

const SelectField = ({ label, placeholder, options = [] }) => {
    return (
        <div>
            <label className="block text-base font-normal text-[#000000] mb-1.5 leading-[140%]">{label}</label>
            <div className="relative">
                <select
                    className="
                        w-full px-4 py-3 bg-white border border-gray-200 rounded-lg
                        text-gray-700 text-base placeholder-gray-400 appearance-none
                        focus:outline-none focus:ring-2 focus:ring-purple-100
                        focus:border-purple-300 transition-all
                    "
                >
                    <option value="">{placeholder}</option>
                    {options.map((opt, idx) => (
                        <option key={idx} value={opt}>{opt}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
        </div>
    );
};

const Leave = () => {
    const [isSummaryOpen, setIsSummaryOpen] = useState(true);
    const leaveHistory = []; // Mock data

    return (
        <div className="h-full font-sans flex flex-col gap-4">
            {/* Leaves Summary Accordion */}
            <AccordionItem
                title="Leaves Summary"
                isOpen={isSummaryOpen}
                onToggle={() => setIsSummaryOpen(!isSummaryOpen)}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <SelectField label="Total leaves Allocated/Year" placeholder="Select no of Leaves" options={['10', '20', '30']} />
                    <SelectField label="Sick Leaves Balance" placeholder="Select no of Leaves" options={['5', '10', '15']} />
                    <SelectField label="Casual Leaves Balance" placeholder="Select no of Leaves" options={['5', '10', '15']} />
                    <SelectField label="Paid Leaves Balance" placeholder="Select no of Leaves" options={['5', '10', '15']} />

                    <InputField label="Loss Of Pay Days" placeholder="0" />
                    <InputField label="Carry forward Leaves" placeholder="0" />
                    <InputField label="Comp Of Earned" placeholder="0" />
                    <InputField label="Comp Of Availed" placeholder="0" />
                </div>
            </AccordionItem>

            {/* Leave History Section */}
            <div className="bg-white py-[10px] px-0 rounded-xl flex flex-col mb-16">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-[16px] font-medium text-[#1E1E1E]">Leave History</h2>
                    <Link to="#" className="text-[#7D1EDB] font-medium hover:underline text-[16px] px-[16px]">
                        View All
                    </Link>
                </div>

                <div className="overflow-x-auto flex-1">
                    <table className="w-full border-separate border-spacing-0">
                        <thead className='h-[48px]'>
                            <tr className="bg-[#FFFFFF] text-[14px] p-[10px] gap-[10px]">
                                {['From', 'To', 'Days', 'Type', 'Status', 'Reason', 'Approved by'].map((header, index, arr) => (
                                    <th
                                        key={index}
                                        className={`py-2 px-4 text-left text-[14px] font-normal text-[#757575] whitespace-nowrap border-t border-b border-[#CECECE]
                                            ${index === 0 ? 'border-l rounded-l-[8px]' : ''}
                                            ${index === arr.length - 1 ? 'border-r rounded-r-[8px]' : ''}
                                        `}
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                    </table>
                </div>
                {leaveHistory.length === 0 && (
                    <div className="flex flex-col items-center justify-center pt-16 pb-8">
                        <img
                            src={noRecordsImage}
                            alt="No Records found"
                            className="mb-6 w-full h-auto max-w-[501px]"
                        />
                        <h3 className="text-[24px] font-medium text-black mb-2" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>No Records found</h3>
                        <p className="text-[#B0B0B0] text-lg" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>There are no records to show at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leave;
