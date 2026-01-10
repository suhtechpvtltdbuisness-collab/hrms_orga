import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp } from "lucide-react";
import toast from 'react-hot-toast';
import { generatePayslipPDF } from '../../../utils/pdfGenerator';

const AccordionItem = ({ title, isOpen, onToggle, children }) => {
  return (
    <div className="flex flex-col">
      <div
        className={`border rounded-lg overflow-hidden ${isOpen
          ? 'bg-white border-gray-200'
          : 'bg-[#F5F5F5] border-[#CBCBCB]'
          }`}
      >
        <button
          onClick={onToggle}
          className="w-full px-[16px] h-[52px] flex justify-between items-center text-left"
        >
          <span
            className="text-[#1E1E1E] text-[16px]"
            style={{ fontFamily: '"Inter", sans-serif' }}
          >
            {title}
          </span>
          {isOpen ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
        </button>
      </div>

      {isOpen && <div className="pt-4">{children}</div>}
    </div>
  );
};

const InputField = ({ label, placeholder }) => (
  <div>
    <label
      className="block text-[#757575] mb-1.5"
      style={{ fontFamily: '"Nunito Sans", sans-serif' }}
    >
      {label}
    </label>
    <input
      defaultValue={placeholder}
      disabled
      className="
        w-full px-4 py-3
        bg-[#F5F5F5]
        border border-[#D9D9D9]
        rounded-lg
        text-[#757575]
        focus:outline-none
        transition-all cursor-not-allowed
      "
      style={{ fontFamily: '"Nunito Sans", sans-serif' }}
    />
  </div>
);

const SelectField = ({ label, placeholder }) => (
  <div>
    <label
      className="block text-[#757575] mb-1.5"
      style={{ fontFamily: '"Nunito Sans", sans-serif' }}
    >
      {label}
    </label>
    <input
      defaultValue={placeholder}
      disabled
      className="
        w-full px-4 py-3
        bg-[#F5F5F5]
        border border-[#D9D9D9]
        rounded-lg
        text-[#757575]
        focus:outline-none
        transition-all cursor-not-allowed
      "
      style={{ fontFamily: '"Nunito Sans", sans-serif' }}
    />
  </div>
);

const EmpPayroll = () => {
  const [isPayrollOpen, setIsPayrollOpen] = useState(true);
  const [isEarningsOpen, setIsEarningsOpen] = useState(true);

  const payrollHistory = [
    {
      id: "01",
      month: "Nov 2025",
      gross: "₹50,000",
      net: "₹46,200",
      deduction: "₹3,800",
      status: "Paid",
    },
    {
      id: "02",
      month: "Oct 2025",
      gross: "₹40,000",
      net: "₹36,200",
      deduction: "₹2,500",
      status: "Paid",
    },
    {
      id: "03",
      month: "Sept 2025",
      gross: "₹70,000",
      net: "₹46,200",
      deduction: "₹3,100",
      status: "Paid",
    },
  ];

  const handleViewPayslip = (month) => {
    toast.success(`Opening payslip for ${month}`, {
      duration: 2000,
      position: 'top-right',
    });
    
    // Find the payroll data for this month
    const payrollData = payrollHistory.find(p => p.month === month);
    
    // Employee data
    const employeeData = {
      name: 'Rohan Patil',
      id: 'EMP1023',
      department: 'Finance',
      designation: 'Senior Analyst',
      paymentMode: 'Bank Transfer',
      basicSalary: '₹25,000',
      hra: '₹10,000',
      conveyanceAllowance: '₹3,000',
      specialAllowance: '₹7,000',
      variablePay: '₹5,000',
      overtimeEarnings: '₹1,000',
    };
    
    // Generate PDF
    const pdf = generatePayslipPDF(payrollData, employeeData);
    
    // Open in new tab
    window.open(pdf.output('bloburl'), '_blank');
  };

  const handleDownloadPayslip = (month) => {
    toast.success(`Downloading payslip for ${month}`, {
      duration: 2000,
      position: 'top-right',
    });
    
    // Find the payroll data for this month
    const payrollData = payrollHistory.find(p => p.month === month);
    
    // Employee data
    const employeeData = {
      name: 'Rohan Patil',
      id: 'EMP1023',
      department: 'Finance',
      designation: 'Senior Analyst',
      paymentMode: 'Bank Transfer',
      basicSalary: '₹25,000',
      hra: '₹10,000',
      conveyanceAllowance: '₹3,000',
      specialAllowance: '₹7,000',
      variablePay: '₹5,000',
      overtimeEarnings: '₹1,000',
    };
    
    // Generate and download PDF
    const pdf = generatePayslipPDF(payrollData, employeeData);
    pdf.save(`Payslip_${month.replace(' ', '_')}.pdf`);
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Payroll */}
      <AccordionItem
        title="Payroll"
        isOpen={isPayrollOpen}
        onToggle={() => setIsPayrollOpen(!isPayrollOpen)}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SelectField label="Salary Structure" placeholder="Select salary structure" />
          <SelectField label="CTC" placeholder="Select CTC" />
          <SelectField label="Monthly Gross" placeholder="Select monthly gross" />
          <SelectField label="Pay Cycle" placeholder="Select pay cycle" />
          <SelectField label="Payment Mode" placeholder="Select payment mode" />
          <SelectField label="Monthly Net Pay" placeholder="Select net pay" />
        </div>
      </AccordionItem>

      {/* Earnings */}
      <AccordionItem
        title="Earnings"
        isOpen={isEarningsOpen}
        onToggle={() => setIsEarningsOpen(!isEarningsOpen)}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField label="Employee Name" placeholder="Rohan Patil" />
          <InputField label="Employee ID" placeholder="EMP1023" />
          <InputField label="Department" placeholder="Finance" />
          <InputField label="HRA" placeholder="₹10,000" />
          <InputField label="Conveyance allowance" placeholder="₹3,000" />
          <InputField label="Overtime Earnings" placeholder="₹1,000" />
          <InputField label="Variable Pay" placeholder="₹5,000" />
          <InputField label="Special Allowance" placeholder="₹7,000" />
          <InputField label="Basic Salary" placeholder="₹25,000" />
        </div>
      </AccordionItem>

      {/* Payroll History */}
      <h2 className="text-[16px] text-black">Payroll History</h2>

      <div className="border border-[#E0E0E0] rounded-xl bg-white overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E0E0E0] text-[#757575] text-[13px]">
              <th className="px-4 py-3 text-left font-normal">Sr no</th>
              <th className="px-4 py-3 text-left font-normal">Month</th>
              <th className="px-4 py-3 text-left font-normal">Gross Salary</th>
              <th className="px-4 py-3 text-left font-normal">Net Salary</th>
              <th className="px-4 py-3 text-left font-normal">Deduction</th>
              <th className="px-4 py-3 text-left font-normal">Status</th>
              <th className="px-4 py-3 text-left font-normal">Payslip</th>
            </tr>
          </thead>

          <tbody className="text-[14px] text-black">
            {payrollHistory.map((row) => (
              <tr key={row.id}>
                <td className="px-4 py-3">{row.id}</td>
                <td className="px-4 py-3 font-medium">{row.month}</td>
                <td className="px-4 py-3">{row.gross}</td>
                <td className="px-4 py-3">{row.net}</td>
                <td className="px-4 py-3">{row.deduction}</td>
                <td className="px-4 py-3">
                  <span className="px-3 py-1 text-[12px] rounded-full bg-[#E9F7DF] text-[#4CAF50]">
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button 
                    onClick={() => handleViewPayslip(row.month)}
                    className="text-[#4F46E5] hover:underline cursor-pointer"
                  >
                    View
                  </button>
                  <span className="text-[#B0B0B0]"> / </span>
                  <button 
                    onClick={() => handleDownloadPayslip(row.month)}
                    className="text-[#E57373] hover:underline cursor-pointer"
                  >
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default EmpPayroll;
