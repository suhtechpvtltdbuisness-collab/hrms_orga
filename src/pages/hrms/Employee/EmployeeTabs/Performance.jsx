import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Star } from "lucide-react";
import noRecordsImage from '../../../../assets/no-records.svg';
import FilterDropdown from '../../../../components/ui/FilterDropdown';

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

const InputField = ({ label, type = "text", placeholder, defaultValue }) => {
    return (
        <div>
            <label className="block text-base font-normal text-[#656565] mb-1.5 leading-[140%]">{label}</label>
            <div className="relative">
                <input
                    type={type}
                    placeholder={placeholder}
                    defaultValue={defaultValue}
                    className={`
                        w-full px-4 py-3 bg-white border border-gray-200 rounded-lg
                        text-gray-700 text-base placeholder-gray-400
                        focus:outline-none focus:ring-2 focus:ring-purple-100
                        focus:border-purple-300 transition-all
                        ${type === 'date' ? 'appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer' : ''}
                    `}
                />
                {type === 'date' && (
                    <img
                        src="/images/calender.svg"
                        alt="calendar"
                        className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none w-5 h-5"
                    />
                )}
            </div>
        </div>
    );
};

const SelectField = ({ label, placeholder, options = [] }) => {
    const [selected, setSelected] = useState('');

    return (
        <div>
            <label className="block text-base font-normal text-[#656565] mb-1.5 leading-[140%]">{label}</label>
            <FilterDropdown
                placeholder={placeholder}
                options={options}
                value={selected}
                onChange={setSelected}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 text-base font-normal outline-none transition-colors flex items-center justify-between"
                minWidth="100%"
            />
        </div>
    );
};

const StarRating = ({ label, rating = 0 }) => {
    return (
        <div>
            <label className="block text-base font-normal text-[#656565] mb-1.5 leading-[140%]">{label}</label>
            <div className="flex gap-1 py-3">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={24}
                        fill={star <= rating ? "#A1A1A1" : "none"}
                        className={`${star <= rating ? "text-[#A1A1A1]" : "text-[#A1A1A1]"}`}
                    />
                ))}
            </div>
        </div>
    );
};

const Performance = () => {
    const [isSummaryOpen, setIsSummaryOpen] = useState(true);
    const goalsData = [];
    const competencyData = [];

    return (
        <div className="h-full font-sans flex flex-col gap-4">
            {/* Performance Summary Accordion */}
            <AccordionItem
                title="Performance Summary"
                isOpen={isSummaryOpen}
                onToggle={() => setIsSummaryOpen(!isSummaryOpen)}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-[#B3B3B3]">
                    <InputField label="Last review Date" type="date" placeholder="Select Date" />
                    <SelectField
                        label="Performance status"
                        placeholder="Select status"
                        options={['Excellent', 'Good', 'Average', 'Poor']}
                    />
                    <StarRating label="Overall Rating" rating={0} />
                </div>
            </AccordionItem>

            {/* Goals & Objectives Section */}
            <div className="bg-white py-[10px] px-0 rounded-xl flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-[16px] font-medium text-[#1E1E1E] leading-none tracking-normal" style={{ fontFamily: 'Poppins, sans-serif' }}>Goals & Objectives</h2>
                </div>

                <div className="overflow-x-auto flex-1">
                    <table className="w-full border-separate border-spacing-0">
                        <thead className='h-[48px]'>
                            <tr className="bg-[#FFFFFF] text-[14px] p-[10px] gap-[10px]">
                                {['Sr no', 'Goal', 'Progress', 'Status'].map((header, index, arr) => (
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
                            {goalsData.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-16 text-center text-[#B0B0B0]">
                                        <div className="flex flex-col items-center justify-center">
                                            <img src={noRecordsImage} alt="No Records found" className="mb-6 max-w-[426px] w-full" />
                                            <h3 className="text-[24px] font-medium text-black mb-2" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>No Records found</h3>
                                            <p className="text-[#B0B0B0] text-lg" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>There are no records to show at the moment.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                goalsData.map((record, index) => (
                                    <tr key={index}><td colSpan="4">Record</td></tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Competency Evaluation Section */}
            <div className="bg-white py-[10px] px-0 rounded-xl flex flex-col mb-16">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-[16px] font-medium text-[#1E1E1E] leading-none tracking-normal" style={{ fontFamily: 'Poppins, sans-serif' }}>Competency Evaluation</h2>
                </div>

                <div className="overflow-x-auto flex-1">
                    <table className="w-full border-separate border-spacing-0">
                        <thead className='h-[48px]'>
                            <tr className="bg-[#FFFFFF] text-[14px] p-[10px] gap-[10px]">
                                {['Sr no', 'Competency', 'Rating', 'Comments'].map((header, index, arr) => (
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
                            {competencyData.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-16 text-center text-[#B0B0B0]">
                                        <div className="flex flex-col items-center justify-center">
                                            <img src={noRecordsImage} alt="No Records found" className="mb-6 max-w-[426px] w-full" />
                                            <h3 className="text-[24px] font-medium text-black mb-2" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>No Records found</h3>
                                            <p className="text-[#B0B0B0] text-lg" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>There are no records to show at the moment.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                competencyData.map((record, index) => (
                                    <tr key={index}><td colSpan="4">Record</td></tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Performance;
