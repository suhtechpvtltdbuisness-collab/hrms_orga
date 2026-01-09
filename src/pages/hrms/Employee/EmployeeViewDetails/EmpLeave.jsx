import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

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

export default function EmpLeave() {
    const [isSummaryOpen, setIsSummaryOpen] = useState(true);

    const inputClasses = "w-full px-4 py-3 bg-[#F5F5F5] border border-[#D9D9D9] rounded-lg text-[#757575] text-base focus:outline-none transition-all placeholder-gray-400 cursor-not-allowed";
    const labelClasses = "block text-base font-normal text-[#757575] mb-1.5 leading-[140%]";

    const leaveHistory = [
        { status: "Approved", approver: "Priya Sharma" },
        { status: "Rejected", approver: "-" },
        { status: "Rejected", approver: "-" },
        { status: "Approved", approver: "Priya Sharma" },
        { status: "Approved", approver: "Priya Sharma" },
        { status: "Approved", approver: "Priya Sharma" },
    ];

    return (
        <div className="flex flex-col gap-6">

            {/* Leaves Summary */}
            <AccordionItem
                title="Leaves Summary"
                isOpen={isSummaryOpen}
                onToggle={() => setIsSummaryOpen(!isSummaryOpen)}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { label: "Total leaves Allocated/Year", value: "24" },
                        { label: "Sick Leaves Balance", value: "14", isSelect: true },
                        { label: "Casual Leaves Balance", value: "6", isSelect: true },
                        { label: "Paid Leaves Balance", value: "4", isSelect: true },
                        { label: "Loss Of Pay Days", value: "0" },
                        { label: "Carry forward Leaves", value: "4" },
                        { label: "Comp Of Earned", value: "2" },
                        { label: "Comp Of Availed", value: "1" },
                    ].map((item, i) => (
                        <div key={i}>
                            <label className={labelClasses}>
                                {item.label}
                            </label>
                            {item.isSelect ? (
                                <div className="relative">
                                    <select disabled value={item.value} className={`${inputClasses} appearance-none cursor-pointer`}>
                                        <option value={item.value}>{item.value}</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                </div>
                            ) : (
                                <input
                                    disabled
                                    value={item.value}
                                    className={inputClasses}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </AccordionItem>

            {/* Leave History Header (OUTSIDE table) */}
            <div className="flex justify-between items-center">
                <h2 className="text-[16px] font-medium text-black">
                    Leave History
                </h2>
                <Link
                    to="#"
                    className="text-[#7D1EDB] text-[14px] font-medium hover:underline"
                >
                    View All
                </Link>
            </div>

            <div className="border border-[#E0E0E0] rounded-xl bg-white overflow-x-auto">
                <table className="w-full border-collapse">

                    <thead>
                        <tr className="border-b border-[#E0E0E0] text-[13px] text-[#757575]">
                            {[
                                "Sr no",
                                "Date From",
                                "Date To",
                                "Days",
                                "Leave Type",
                                "Status",
                                "Reason",
                                "Approved By",
                            ].map((h, i) => (
                                <th
                                    key={i}
                                    className="px-4 py-3 font-normal text-left whitespace-nowrap"
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="text-[14px] text-black">
                        {leaveHistory.map((row, i) => (
                            <tr key={i} className="border-b border-[#F0F0F0] hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 whitespace-nowrap">01</td>
                                <td className="px-4 py-3">10 Jan 2026</td>
                                <td className="px-4 py-3">11 Jan 2026</td>
                                <td className="px-4 py-3">1</td>
                                <td className="px-4 py-3">Sick Leave</td>

                                <td className="px-4 py-3">
                                    <span
                                        className={`px-3 py-1 rounded-full text-[12px] font-medium
                      ${row.status === "Approved"
                                                ? "bg-[#E9F7DF] text-[#7AC943]"
                                                : "bg-[#FFE5E5] text-[#FF6B6B]"
                                            }`}
                                    >
                                        {row.status}
                                    </span>
                                </td>

                                <td className="px-4 py-3">Fever</td>
                                <td className="px-4 py-3">{row.approver}</td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

        </div>
    );
}
