import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generatePayslipPDF = (payrollData, employeeData) => {
  const doc = new jsPDF();
  
  // Company Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYSLIP', 105, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Company Name: Suhtech Pvt Ltd', 105, 30, { align: 'center' });
  doc.text('Address: Business Park, Mumbai, India', 105, 36, { align: 'center' });
  
  // Line separator
  doc.setLineWidth(0.5);
  doc.line(20, 42, 190, 42);
  
  // Employee Information
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Employee Information', 20, 52);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Employee Name: ${employeeData.name}`, 20, 60);
  doc.text(`Employee ID: ${employeeData.id}`, 20, 66);
  doc.text(`Department: ${employeeData.department}`, 20, 72);
  doc.text(`Designation: ${employeeData.designation || 'N/A'}`, 20, 78);
  
  doc.text(`Pay Period: ${payrollData.month}`, 120, 60);
  doc.text(`Payment Date: ${payrollData.paymentDate || 'N/A'}`, 120, 66);
  doc.text(`Payment Mode: ${employeeData.paymentMode || 'Bank Transfer'}`, 120, 72);
  
  // Earnings Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Earnings', 20, 90);
  
  const earningsData = [
    ['Basic Salary', employeeData.basicSalary || '₹25,000'],
    ['HRA', employeeData.hra || '₹10,000'],
    ['Conveyance Allowance', employeeData.conveyanceAllowance || '₹3,000'],
    ['Special Allowance', employeeData.specialAllowance || '₹7,000'],
    ['Variable Pay', employeeData.variablePay || '₹5,000'],
    ['Overtime Earnings', employeeData.overtimeEarnings || '₹0'],
  ];
  
  doc.autoTable({
    startY: 95,
    head: [['Component', 'Amount']],
    body: earningsData,
    theme: 'grid',
    headStyles: { fillColor: [125, 30, 219], textColor: 255, fontStyle: 'bold' },
    margin: { left: 20, right: 20 },
    columnStyles: {
      0: { cellWidth: 120 },
      1: { cellWidth: 50, halign: 'right' }
    }
  });
  
  // Deductions Table
  const deductionsStartY = doc.lastAutoTable.finalY + 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Deductions', 20, deductionsStartY);
  
  const deductionsData = [
    ['Provident Fund', '₹1,800'],
    ['Professional Tax', '₹200'],
    ['Income Tax (TDS)', '₹1,800'],
  ];
  
  doc.autoTable({
    startY: deductionsStartY + 5,
    head: [['Component', 'Amount']],
    body: deductionsData,
    theme: 'grid',
    headStyles: { fillColor: [229, 115, 115], textColor: 255, fontStyle: 'bold' },
    margin: { left: 20, right: 20 },
    columnStyles: {
      0: { cellWidth: 120 },
      1: { cellWidth: 50, halign: 'right' }
    }
  });
  
  // Summary
  const summaryStartY = doc.lastAutoTable.finalY + 10;
  doc.setLineWidth(0.5);
  doc.line(20, summaryStartY, 190, summaryStartY);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Gross Salary:', 20, summaryStartY + 10);
  doc.text(payrollData.gross, 170, summaryStartY + 10, { align: 'right' });
  
  doc.text('Total Deductions:', 20, summaryStartY + 18);
  doc.text(payrollData.deduction, 170, summaryStartY + 18, { align: 'right' });
  
  doc.setFontSize(14);
  doc.setTextColor(76, 175, 80);
  doc.text('Net Salary:', 20, summaryStartY + 28);
  doc.text(payrollData.net, 170, summaryStartY + 28, { align: 'right' });
  
  doc.setTextColor(0, 0, 0);
  
  // Footer
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.text('This is a computer-generated payslip and does not require a signature.', 105, 280, { align: 'center' });
  
  return doc;
};
