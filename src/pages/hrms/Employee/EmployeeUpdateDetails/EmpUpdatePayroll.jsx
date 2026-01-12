import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp } from "lucide-react";
import toast from 'react-hot-toast';
import { generatePayslipPDF } from '../../../../utils/pdfGenerator';
import FilterDropdown from '../../../../components/ui/FilterDropdown';

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

const InputField = ({ label, value, onChange }) => (
  <div>
    <label
      className="block text-[#757575] mb-1.5"
      style={{ fontFamily: '"Nunito Sans", sans-serif' }}
    >
      {label}
    </label>
    <input
      value={value}
      onChange={onChange}
      className="
        w-full px-4 py-3
        bg-white
        border border-[#D9D9D9]
        rounded-lg
        text-black
        focus:outline-none focus:border-purple-500
        transition-all
      "
      style={{ fontFamily: '"Nunito Sans", sans-serif' }}
    />
  </div>
);

const SelectField = ({ label, value, onChange, options }) => (
  <div>
    <label
      className="block text-[#757575] mb-1.5"
      style={{ fontFamily: '"Nunito Sans", sans-serif' }}
    >
      {label}
    </label>
    <FilterDropdown
      options={options}
      value={value}
      onChange={(val) => {
         // Create a synthetic event to match the expected onChange signature of the parent usage
         onChange({ target: { value: val } })
      }}
      placeholder={`Select ${label.toLowerCase()}`}
      className="
        w-full px-4 py-3
        bg-white
        border border-[#D9D9D9]
        rounded-lg
        text-black
        outline-none
        transition-all cursor-pointer flex items-center justify-between
      "
      minWidth="100%"
    />
  </div>
);

const EmpUpdatePayroll = () => {
  const [isPayrollOpen, setIsPayrollOpen] = useState(true);
  const [isEarningsOpen, setIsEarningsOpen] = useState(true);

  // Payroll State
  const [salaryStructure, setSalaryStructure] = useState("");
  const [ctc, setCtc] = useState("");
  const [monthlyGross, setMonthlyGross] = useState("");
  const [payCycle, setPayCycle] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [monthlyNetPay, setMonthlyNetPay] = useState("");

  // Earnings State
  const [employeeName, setEmployeeName] = useState("Rohan Patil");
  const [employeeId, setEmployeeId] = useState("EMP1023");
  const [department, setDepartment] = useState("Finance");
  const [hra, setHra] = useState("₹10,000");
  const [conveyanceAllowance, setConveyanceAllowance] = useState("₹3,000");
  const [overtimeEarnings, setOvertimeEarnings] = useState("₹1,000");
  const [variablePay, setVariablePay] = useState("₹5,000");
  const [specialAllowance, setSpecialAllowance] = useState("₹7,000");
  const [basicSalary, setBasicSalary] = useState("₹25,000");

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
      name: employeeName,
      id: employeeId,
      department: department,
      designation: 'Senior Analyst',
      paymentMode: paymentMode || 'Bank Transfer',
      basicSalary: basicSalary,
      hra: hra,
      conveyanceAllowance: conveyanceAllowance,
      specialAllowance: specialAllowance,
      variablePay: variablePay,
      overtimeEarnings: overtimeEarnings,
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
      name: employeeName,
      id: employeeId,
      department: department,
      designation: 'Senior Analyst',
      paymentMode: paymentMode || 'Bank Transfer',
      basicSalary: basicSalary,
      hra: hra,
      conveyanceAllowance: conveyanceAllowance,
      specialAllowance: specialAllowance,
      variablePay: variablePay,
      overtimeEarnings: overtimeEarnings,
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <SelectField
            label="Salary Structure"
            value={salaryStructure}
            onChange={(e) => setSalaryStructure(e.target.value)}
            options={["Structure A", "Structure B", "Structure C"]}
          />
          <SelectField
            label="CTC"
            value={ctc}
            onChange={(e) => setCtc(e.target.value)}
            options={["₹6,00,000", "₹8,00,000", "₹10,00,000"]}
          />
          <SelectField
            label="Monthly Gross"
            value={monthlyGross}
            onChange={(e) => setMonthlyGross(e.target.value)}
            options={["₹50,000", "₹60,000", "₹70,000"]}
          />
          <SelectField
            label="Pay Cycle"
            value={payCycle}
            onChange={(e) => setPayCycle(e.target.value)}
            options={["Monthly", "Bi-weekly", "Weekly"]}
          />
          <SelectField
            label="Payment Mode"
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
            options={["Bank Transfer", "Cash", "Cheque"]}
          />
          <SelectField
            label="Monthly Net Pay"
            value={monthlyNetPay}
            onChange={(e) => setMonthlyNetPay(e.target.value)}
            options={["₹45,000", "₹55,000", "₹65,000"]}
          />
        </div>
      </AccordionItem>

      {/* Earnings */}
      <AccordionItem
        title="Earnings"
        isOpen={isEarningsOpen}
        onToggle={() => setIsEarningsOpen(!isEarningsOpen)}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <InputField label="Employee Name" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} />
          <InputField label="Employee ID" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} />
          <InputField label="Department" value={department} onChange={(e) => setDepartment(e.target.value)} />
          <InputField label="HRA" value={hra} onChange={(e) => setHra(e.target.value)} />
          <InputField label="Conveyance allowance" value={conveyanceAllowance} onChange={(e) => setConveyanceAllowance(e.target.value)} />
          <InputField label="Overtime Earnings" value={overtimeEarnings} onChange={(e) => setOvertimeEarnings(e.target.value)} />
          <InputField label="Variable Pay" value={variablePay} onChange={(e) => setVariablePay(e.target.value)} />
          <InputField label="Special Allowance" value={specialAllowance} onChange={(e) => setSpecialAllowance(e.target.value)} />
          <InputField label="Basic Salary" value={basicSalary} onChange={(e) => setBasicSalary(e.target.value)} />
        </div>
      </AccordionItem>

      {/* Payroll History */}
      <h2 className="text-[16px] text-black">Payroll History</h2>

      <div className="border border-[#E0E0E0] rounded-xl bg-white overflow-x-auto">
        <table className="w-full min-w-[800px]">
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

export default EmpUpdatePayroll;
