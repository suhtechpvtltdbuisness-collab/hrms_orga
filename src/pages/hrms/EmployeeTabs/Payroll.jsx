import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp } from "lucide-react";
import noRecordsImage from '../../../assets/no-records.svg';

const AccordionItem = ({ title, isOpen, onToggle, children }) => {
    return (
        <div className="flex flex-col">
            <div
                className={`border rounded-lg overflow-hidden ${isOpen ? 'bg-white border-gray-200' : 'bg-[#F5F5F5] border-[#CBCBCB]'
                    }`}
            >
                <button
                    onClick={onToggle}
                    className="w-full px-[16px] h-[52px] flex justify-between items-center transition-colors text-left"
                >
                    <span className="text-[#1E1E1E] font-normal text-[16px] leading-[100%] tracking-[0%] text-center" style={{ fontFamily: '"Inter", sans-serif' }}>
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
            <label className="block text-base font-normal text-[#656565] mb-1.5 leading-[140%]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                defaultValue={defaultValue}
                className="
                    w-full px-4 py-3 bg-white border border-gray-200 rounded-lg
                    text-gray-700 text-base font-normal placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-purple-100
                    focus:border-purple-300 transition-all
                "
                style={{ fontFamily: '"Nunito Sans", sans-serif' }}
            />
        </div>
    );
};

const SelectField = ({ label, placeholder, options = [] }) => {
    return (
        <div>
            <label className="block text-base font-normal text-[#000000] mb-1.5 leading-[140%]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>{label}</label>
            <div className="relative">
                <select
                    className="
                        w-full px-4 py-3 bg-white border border-gray-200 rounded-lg
                        text-gray-700 text-base font-normal placeholder-gray-400 appearance-none
                        focus:outline-none focus:ring-2 focus:ring-purple-100
                        focus:border-purple-300 transition-all
                    "
                    style={{ fontFamily: '"Nunito Sans", sans-serif' }}
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

const Payroll = () => {
    const [isPayrollOpen, setIsPayrollOpen] = useState(true);
    const [isEarningsOpen, setIsEarningsOpen] = useState(true);
    const payrollHistory = [];

    return (
        <div className="h-full font-sans flex flex-col gap-4">
            {/* Payroll Accordion */}
            <AccordionItem
                title="Payroll"
                isOpen={isPayrollOpen}
                onToggle={() => setIsPayrollOpen(!isPayrollOpen)}
            >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <SelectField label="Salary Structure" placeholder="Select salary structure" options={['Option 1', 'Option 2']} />
                    <SelectField label="CTC" placeholder="Select CTC" options={['Option 1', 'Option 2']} />
                    <SelectField label="Monthly Gross" placeholder="Select monthly gross" options={['Option 1', 'Option 2']} />
                    <SelectField label="Monthly Net Pay" placeholder="Select net pay" options={['Option 1', 'Option 2']} />

                    <SelectField label="Pay Cycle" placeholder="Select pay cycle" options={['Monthly', 'Weekly']} />
                    <SelectField label="Payment Mode" placeholder="Select payment mode" options={['Bank Transfer', 'Cheque']} />
                </div>
            </AccordionItem>

            {/* Earnings Accordion */}
            <AccordionItem
                title="Earnings"
                isOpen={isEarningsOpen}
                onToggle={() => setIsEarningsOpen(!isEarningsOpen)}
            >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <InputField label="Employee Name" placeholder="Rohan Patil" />
                    <InputField label="Employee ID" placeholder="EMP1023" />
                    <InputField label="Department" placeholder="Finance" />
                    <InputField label="Basic Salary" placeholder="₹25,000" />

                    <InputField label="HRA" placeholder="₹10,000" />
                    <InputField label="Conveyance allowance" placeholder="₹3,000" />
                    <InputField label="Overtime Earnings" placeholder="₹1,000" />
                    <InputField label="Special Allowance" placeholder="₹7,000" />

                    <InputField label="Variable Pay" placeholder="₹5,000" />
                </div>
            </AccordionItem>

            {/* Payroll History Section */}
            <div className="bg-white py-[10px] px-0 rounded-xl flex flex-col mb-16">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-[16px] font-medium text-[#1E1E1E] leading-[100%] tracking-[0%] text-center" style={{ fontFamily: '"Inter", sans-serif' }}>Payroll History</h2>
                </div>

                {payrollHistory.length > 0 ? (
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full border-separate border-spacing-0">
                            <thead className='h-[48px]'>
                                <tr className="bg-[#FFFFFF] text-[14px] p-[10px] gap-[10px]">
                                    {['Sr no', 'Month', 'Gross Salary', 'Net Salary', 'Deduction', 'Status', 'Payslip'].map((header, index, arr) => (
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
                            <tbody>
                                {payrollHistory.map((record, index) => (
                                    <tr key={index}><td colSpan="7">Record</td></tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <img src={noRecordsImage} alt="No Records found" className="mb-6 max-w-[501px] w-full" />
                        <h3 className="text-[24px] font-medium text-black mb-2" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>No Records found</h3>
                        <p className="text-[#B0B0B0] text-lg" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>There are no records to show at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Payroll;
