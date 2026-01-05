import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

const AccordionItem = ({ title, isOpen, onToggle, children }) => {
  return (
    <div>
      <div
        className={`border rounded-lg ${
          isOpen ? "bg-white border-[#E0E0E0]" : "bg-[#F5F5F5] border-[#CBCBCB]"
        }`}
      >
        <button
          onClick={onToggle}
          className="w-full h-[52px] px-6 flex items-center justify-between"
        >
          <span className="text-[16px] font-semibold text-black">
            {title}
          </span>
          {isOpen ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
        </button>
      </div>

      {isOpen && <div className="pt-4">{children}</div>}
    </div>
  );
};

const EmpLeave = () => {
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
              <label className="block text-[#656565] mb-1.5">
                {label}
              </label>
              <input className="w-full px-4 py-3 border border-[#E0E0E0] rounded-lg" />
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
          className="text-[#7D1EDB] text-[14px] font-medium"
        >
          View All
        </Link>
      </div>

      {/* Table ONLY (NO SCROLLBAR) */}
      <div className="border border-[#E0E0E0] rounded-xl bg-white">
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
                  className="px-4 py-3 font-normal text-left"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="text-[14px] text-black">
            {leaveHistory.map((row, i) => (
              <tr key={i} className="border-b border-[#F0F0F0]">
                <td className="px-4 py-3">01</td>
                <td className="px-4 py-3">10 Jan 2026</td>
                <td className="px-4 py-3">11 Jan 2026</td>
                <td className="px-4 py-3">1</td>
                <td className="px-4 py-3">Sick Leave</td>

                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-[12px] font-medium
                      ${
                        row.status === "Approved"
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

export default EmpLeave;
