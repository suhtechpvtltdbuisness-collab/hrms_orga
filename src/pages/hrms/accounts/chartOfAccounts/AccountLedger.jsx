import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronRight, Upload } from "lucide-react";

const AccountLedger = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Mock Data
  const ledgerData = [
    {
      id: 1,
      date: "26/10/2026",
      accountNo: "XXXXX4906",
      debit: "0.01",
      credit: "0.01",
      balance: "0.01",
    },
    {
      id: 2,
      date: "26/10/2026",
      accountNo: "XXXXX4906",
      debit: "0.01",
      credit: "0.01",
      balance: "0.01",
    },
    {
      id: 3,
      date: "26/10/2026",
      accountNo: "XXXXX4906",
      debit: "0.01",
      credit: "0.01",
      balance: "0.01",
    },
    {
      id: 4,
      date: "26/10/2026",
      accountNo: "XXXXX4906",
      debit: "0.01",
      credit: "0.01",
      balance: "0.01",
    },
    {
      id: 5,
      date: "26/10/2026",
      accountNo: "XXXXX4906",
      debit: "0.01",
      credit: "0.01",
      balance: "0.01",
    },
    {
      id: 6,
      date: "26/10/2026",
      accountNo: "XXXXX4906",
      debit: "0.01",
      credit: "0.01",
      balance: "0.01",
    },
    {
      id: 7,
      date: "26/10/2026",
      accountNo: "XXXXX4906",
      debit: "0.01",
      credit: "0.01",
      balance: "0.01",
    },
  ];

  return (
    <div
      className="bg-white px-4 sm:px-4 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col font-inter"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Breadcrumb */}
      <div
        className="flex items-center gap-2 mb-2 text-sm text-gray-500 shrink-0"
        style={{ fontFamily: "Mulish, sans-serif" }}
      >
        <img
          src="/images/arrow_left_alt.svg"
          alt="Back"
          className="w-3 h-3 cursor-pointer hover:scale-110 transition-transform"
          onClick={() => navigate("/hrms/chart-of-accounts")}
        />
        <span
          className="cursor-pointer text-[#7D1EDB]"
          onClick={() => navigate("/hrms/chart-of-accounts")}
        >
          Chart Of Accounts
        </span>
        <ChevronRight size={14} />
        <span className="text-[#6B7280]">Account Ledger</span>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h1
          className="text-[20px] font-semibold text-[#494949]"
          style={{ fontFamily: '"Nunito Sans", sans-serif' }}
        >
          {location.state?.account?.accountName || "Account Ledger"}
        </h1>

        <button className="flex items-center justify-center gap-2 rounded-full py-2 px-3 text-white font-normal hover:bg-purple-700 transition-colors bg-[#7D1EDB]">
          <span
            className="text-[16px] font-normal text-white flex items-center gap-2"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Export PDF <Upload size={16} />
          </span>
        </button>
      </div>

      {/* Content Table */}
      <div className="flex-1 overflow-hidden border border-[#E0E0E0] rounded-lg">
        <div className="overflow-x-auto h-full">
          <table className="w-full min-w-200 text-left border-collapse">
            <thead
              className="bg-white border-b border-[#E0E0E0] sticky top-0 z-10"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              <tr>
                <th className="py-3 px-6 text-[14px] font-normal text-[#757575] w-20">
                  Sr.No.
                </th>
                <th className="py-3 px-6 text-[14px] font-normal text-[#757575]">
                  Date
                </th>
                <th className="py-3 px-6 text-[14px] font-normal text-[#757575]">
                  Account No.
                </th>
                <th className="py-3 px-6 text-[14px] font-normal text-[#757575]">
                  Debit
                </th>
                <th className="py-3 px-6 text-[14px] font-normal text-[#757575]">
                  Credit
                </th>
                <th className="py-3 px-6 text-[14px] font-normal text-[#757575]">
                  Balance
                </th>
              </tr>
            </thead>
            <tbody className="">
              {ledgerData.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50 transition-colors font-semibold"
                  style={{ fontFamily: "Nunito Sans, sans-serif" }}
                >
                  <td className="py-3 px-6 text-[14px] text-[#1E1E1E]">
                    {String(row.id).padStart(2, "0")}
                  </td>
                  <td className="py-3 px-6 text-[14px] text-[#1E1E1E]">
                    {row.date}
                  </td>
                  <td className="py-3 px-6 text-[14px] text-[#1E1E1E]">
                    {row.accountNo}
                  </td>
                  <td className="py-3 px-6 text-[14px] text-[#1E1E1E]">
                    {row.debit}
                  </td>
                  <td className="py-3 px-6 text-[14px] text-[#1E1E1E]">
                    {row.credit}
                  </td>
                  <td className="py-3 px-6 text-[14px] text-[#1E1E1E]">
                    {row.balance}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccountLedger;
