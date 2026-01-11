import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

const AccordionItem = ({ title, isOpen, onToggle, children }) => {
    return (
        <div>
            <div
                className={`border rounded-lg mb-4 my-2 overflow-hidden bg-white border-gray-200`}
            >
                <button
                    onClick={onToggle}
                    className="w-full h-[52px] px-6 flex items-center justify-between bg-[#F5F5F5] hover:bg-gray-50 transition-colors"
                >
                    <span className="text-[16px] font-normal text-black font-nunito-sans">
                        {title}
                    </span>
                    {isOpen ? <ChevronUp size={22} className="text-gray-500" /> : <ChevronDown size={22} className="text-gray-500" />}
                </button>
            </div>

            {isOpen && <div className="px-6 pb-6 pt-2 border-t border-gray-100 animate-fadeIn">{children}</div>}
        </div>
    );
};

const EmpUpdateLeave = () => {
    const [isSummaryOpen, setIsSummaryOpen] = useState(true);

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
                        "Total leaves Allocated/Year",
                        "Sick Leaves Balance",
                        "Casual Leaves Balance",
                        "Paid Leaves Balance",
                        "Loss Of Pay Days",
                        "Carry forward Leaves",
                        "Comp Of Earned",
                        "Comp Of Availed",
                    ].map((label, i) => (
                        <div key={i}>
                            <label className="block text-[#656565] mb-1.5 font-normal">
                                {label}
                            </label>
                            <input
                                placeholder={`Enter ${label}`}
                                className="w-full px-4 py-3 bg-white border border-[#D9D9D9] rounded-lg text-[#000000] text-base focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-all placeholder-gray-400"
                            />
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

            {/* Table */}
            <div className="border border-[#E0E0E0] rounded-xl bg-white overflow-x-auto">
                <table className="w-full border-collapse">

                    {/* Table Header */}
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

                    {/* Table Body */}
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
};

export default EmpUpdateLeave;
