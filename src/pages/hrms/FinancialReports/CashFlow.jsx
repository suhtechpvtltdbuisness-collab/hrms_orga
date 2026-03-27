import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  ArrowDownRight,
  Upload
} from "lucide-react";
import noRecordsIllustration from "../../../assets/no-records.svg";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency, formatCurrencyPDF } from "../../../utils/financialFormatters";

const CashFlow = () => {
  const navigate = useNavigate();

  // Filters State
  const [filters, setFilters] = useState({
    dateRange: "Date Range",
    bankAccount: "Bank/Cash Account",
  });

  const filterOptions = {
    dateRange: ["Jan 2026", "Feb 2026", "March 2026", "April 2026", "May 2026", "June 2026"],
    bankAccount: ["All Accounts", "HDFC Bank", "SBI", "Cash in Hand"],
  };

  const [openFilter, setOpenFilter] = useState(null);

  const toggleFilter = (filter) => {
    setOpenFilter(openFilter === filter ? null : filter);
  };

  const handleFilterSelect = (filter, value) => {
    setFilters((prev) => ({ ...prev, [filter]: value }));
    setOpenFilter(null);
  };

  // Accordion State
  const [openSections, setOpenSections] = useState({
    operating: true,
    investing: true,
    financing: true,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setReportData({
        summaryCards: [
          { title: "Opening Balance", amount: 45050000, hasPercentage: false },
          { title: "Net Inflow/Outflow", amount: 4750000, percentage: "12.5%", isPositive: true, hasPercentage: true },
          { title: "Liquidity Strength", amount: 550000, hasPercentage: false },
          { title: "Forecasted Runway", amount: 550000, hasPercentage: false },
        ],
        sectionsData: [
          {
            id: "operating",
            title: "Operating Activities",
            netTotal: 407000,
            rows: [
              { particulars: "Receipts from Customers", inflow: 1250000, outflow: null, net: 1250000 },
              { particulars: "Payments to Suppliers", inflow: null, outflow: 450000, net: -450000 },
              { particulars: "Employee Salaries & Benefits", inflow: null, outflow: 320000, net: -320000 },
              { particulars: "Income Tax Paid", inflow: null, outflow: 85000, net: -85000 },
              { particulars: "Interest Received", inflow: 80000, outflow: null, net: 80000 },
            ]
          },
          {
            id: "investing",
            title: "Investing Activities",
            netTotal: -70000,
            rows: [
              { particulars: "Purchase of Property & Equipment", inflow: null, outflow: 150000, net: -150000 },
              { particulars: "Sale of Long-term Investments", inflow: 80000, outflow: null, net: 80000 },
            ]
          },
          {
            id: "financing",
            title: "Financing Activities",
            netTotal: 105000,
            rows: [
              { particulars: "Proceeds from Bank Loans", inflow: 200000, outflow: null, net: 200000 },
              { particulars: "Repayment of Lease Liabilities", inflow: null, outflow: 45000, net: -45000 },
              { particulars: "Dividends Paid", inflow: null, outflow: 50000, net: -50000 },
            ]
          }
        ],
        cashPositionRows: [
          ["Opening Cash Balance", 450000],
          ["(-) Net Cash from Investing Activities", -150000],
          ["(+) Net Cash from Operating Activities", 2450000],
          ["(+) Net Cash from Financing Activities", 2450000],
          ["Net Change In Cash", 2450000],
          ["CLOSING CASH BALANCE", 407000]
        ],
        inflowOutflowRows: [
          ["Operating Activities", 1330000, 855000, 475000, "Inflow"],
          ["Investing Activities", 90000, 210000, -120000, "Outflow"],
          ["Financial Activities", 330000, 95000, 205000, "Inflow"],
          ["TOTAL", 1720000, 1160000, 560000, "Inflow"]
        ]
      });
      setIsLoading(false);
    }, 800);
  }, []);

  const handleExportPDF = () => {
    if (!reportData) return;
    const doc = new jsPDF("p", "pt", "a4");
    const pageWidth = doc.internal.pageSize.width;
    let currentY = 40;

    // --- 1. Top Header ---
    doc.setFillColor(125, 30, 219); // #7D1EDB
    doc.rect(40, currentY, pageWidth - 80, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "normal");
    doc.text("SUH TECH", 50, currentY + 25);

    doc.text("CASH FLOW STATEMENT", pageWidth - 50, currentY + 25, { align: "right" });
    currentY += 40;

    // --- 2. Sub-header ---
    doc.setFillColor(242, 238, 255);
    doc.rect(40, currentY, pageWidth - 80, 40, "F");

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("Company:", 50, currentY + 15);
    doc.setFont("helvetica", "normal");
    doc.text("SUH Technologies Pvt. Ltd.", 95, currentY + 15);

    doc.setFont("helvetica", "bold");
    doc.text("Period:", 50, currentY + 30);
    doc.setFont("helvetica", "normal");
    doc.text("April 2024 - March 2025", 85, currentY + 30);

    const now = new Date();
    doc.setFont("helvetica", "bold");
    doc.text("Generated:", pageWidth - 190, currentY + 15);
    doc.setFont("helvetica", "normal");
    const formattedDate = `${now.getDate()} ${now.toLocaleString("default", { month: "long" })} ${now.getFullYear()}, ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    doc.text(formattedDate, pageWidth - 140, currentY + 15);

    doc.setFont("helvetica", "bold");
    doc.text("Generated By:", pageWidth - 190, currentY + 30);
    doc.setFont("helvetica", "normal");
    doc.text("Ankit Kumar(Admin)", pageWidth - 125, currentY + 30);
    currentY += 50;

    // Statement Date Row
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.rect(40, currentY, pageWidth - 80, 25);
    
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("Date Range:", 50, currentY + 16);
    doc.setFont("helvetica", "normal");
    doc.text("01 April 2024-31 March 2025", 100, currentY + 16);
    
    doc.setFont("helvetica", "bold");
    doc.text("Bank/Cash Account:", (pageWidth / 2) - 40, currentY + 16);
    doc.setFont("helvetica", "normal");
    doc.text("All Accounts", (pageWidth / 2) + 50, currentY + 16);

    doc.setFont("helvetica", "bold");
    doc.text("Currency:", pageWidth - 130, currentY + 16);
    doc.setFont("helvetica", "normal");
    doc.text("INR (Rs)", pageWidth - 85, currentY + 16);

    currentY += 40;

    // --- 3. Summary Overview ---
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("Summary Overview", 40, currentY);
    currentY += 15;

    const boxWidth = (pageWidth - 80 - 45) / 4;
    reportData.summaryCards.forEach((item, index) => {
      const x = 40 + index * (boxWidth + 15);
      doc.setDrawColor(220, 220, 220);
      doc.setFillColor(255, 255, 255);
      doc.setLineWidth(0.5);
      doc.roundedRect(x, currentY, boxWidth, 55, 4, 4, "FD");

      doc.setTextColor(120, 120, 120);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(item.title, x + 8, currentY + 15);

      if (item.hasPercentage) {
        doc.setFillColor(item.isPositive ? 199 : 255, item.isPositive ? 255 : 219, item.isPositive ? 148 : 204); 
        const badgeW = 34;
        const badgeX = x + boxWidth - badgeW - 8;
        doc.roundedRect(badgeX, currentY + 7, badgeW, 14, 7, 7, "F");
        doc.setTextColor(item.isPositive ? 50 : 219, item.isPositive ? 187 : 71, item.isPositive ? 99 : 30); 
        doc.setFontSize(8);
        const textVal = (item.isPositive ? "+" : "-") + item.percentage;
        doc.text(textVal, badgeX + badgeW / 2, currentY + 17, { align: "center" });
      }

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(formatCurrencyPDF(item.amount), x + 8, currentY + 38);
    });

    currentY += 75;

    // --- 4. Activity Breakdown ---
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("Activity Breakdown", 40, currentY);
    currentY += 20;

    const renderActivityTable = (title, netTotal, rows, isNegativeTotal) => {
      doc.setFillColor(248, 248, 248);
      doc.rect(40, currentY, pageWidth - 80, 25, "F");
      
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(title, 45, currentY + 17);

      doc.setTextColor(isNegativeTotal ? 255 : 50, isNegativeTotal ? 56 : 187, isNegativeTotal ? 60 : 99); 
      doc.text(netTotal > 0 ? `+${formatCurrencyPDF(netTotal)}` : formatCurrencyPDF(netTotal), pageWidth - 45, currentY + 17, { align: "right" });
      
      currentY += 25;

      const bodyLen = rows.length;
      
      autoTable(doc, {
        startY: currentY,
        head: [["Particulars", "Inflow", "Outflow", "Net Amount"]],
        body: rows,
        theme: "plain",
        headStyles: {
          fillColor: [125, 30, 219],
          textColor: 255,
          fontSize: 9,
          halign: "center",
          cellPadding: 8,
        },
        bodyStyles: {
          fontSize: 9,
          halign: "center",
          textColor: 40,
          cellPadding: 6,
        },
        columnStyles: { 0: { halign: "left" }, 1: { halign: "center" }, 2: { halign: "center" }, 3: { halign: "right" } },
        margin: { left: 40, right: 40 },
        didParseCell: function (data) {
          if (data.section === "body" && data.column.index === 2 && data.cell.raw && String(data.cell.raw).startsWith("(")) {
            data.cell.styles.textColor = [255, 56, 60];
          }
          if (data.section === "body" && data.column.index === 3 && data.cell.raw && String(data.cell.raw).startsWith("-")) {
            data.cell.styles.textColor = [255, 56, 60];
          }
          
          if (data.section === "body" && data.row.index === bodyLen - 1) {
            data.cell.styles.fillColor = [242, 238, 255]; 
            data.cell.styles.textColor = 0;
            if (data.column.index === 3) {
              data.cell.styles.textColor = isNegativeTotal ? [255, 56, 60] : [50, 187, 99];
            }
          }
        },
      });
      
      const finalY = doc.lastAutoTable.finalY;
      doc.setDrawColor(220, 220, 220);
      doc.rect(40, currentY - 25, pageWidth - 80, (finalY - currentY) + 25, "S");
      
      currentY = finalY + 15;
    };

    reportData.sectionsData.forEach((section) => {
      // Map data row by row
      const mappedRows = section.rows.map(r => [
        r.particulars,
        r.inflow ? formatCurrencyPDF(r.inflow) : "-",
        r.outflow ? `(${formatCurrencyPDF(r.outflow)})` : "-",
        formatCurrencyPDF(r.net)
      ]);
      // Push subtotal summary row
      mappedRows.push([
        `NET CASH FROM ${section.title.toUpperCase()}`,
        "",
        "",
        formatCurrencyPDF(section.netTotal)
      ]);

      renderActivityTable(section.title, section.netTotal, mappedRows, section.netTotal < 0);

      // Add page block if exceeded
      if (currentY > doc.internal.pageSize.height - 200) {
        doc.addPage();
        currentY = 40;
      }
    });

    currentY += 10;
     // --- Cash Position Summary ---
    if (currentY > doc.internal.pageSize.height - 250) {
       doc.addPage();
       currentY = 40;
    }
    
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("Cash Position Summary", 40, currentY);
    currentY += 15;

    const cpRowsFormatted = reportData.cashPositionRows.map(r => [
      r[0],
      r[0].includes("CLOSING CASH BALANCE") ? formatCurrencyPDF(r[1]) :
      (r[1] > 0 ? `+${formatCurrencyPDF(r[1])}` : formatCurrencyPDF(r[1]))
    ]);

    const cpBodyLen = cpRowsFormatted.length;
    autoTable(doc, {
      startY: currentY,
      head: [["Description", "Amount(Rs)"]],
      body: cpRowsFormatted,
      theme: "plain",
      headStyles: { fillColor: [125, 30, 219], textColor: 255, fontSize: 9, cellPadding: 8 },
      bodyStyles: { fontSize: 9, textColor: 40, cellPadding: 6 },
      columnStyles: { 0: { halign: "left" }, 1: { halign: "right" } },
      margin: { left: 40, right: 40 },
      didParseCell: function (data) {
        if (data.section === "body") {
          const val = String(data.cell.raw);
          if (val.startsWith("-Rs.")) data.cell.styles.textColor = [255, 56, 60];
          if (val.startsWith("+Rs.")) data.cell.styles.textColor = [50, 187, 99];
          
          if (data.row.index === cpBodyLen - 1) {
            data.cell.styles.fillColor = [242, 238, 255];
            data.cell.styles.textColor = 0;
            data.cell.styles.fontStyle = "bold";
          }
        }
      },
    });
    let cpFinalY = doc.lastAutoTable.finalY;
    doc.setDrawColor(220, 220, 220);
    doc.rect(40, currentY, pageWidth - 80, cpFinalY - currentY, "S");
    currentY = cpFinalY + 25;

    // --- Inflow vs Outflow by Activity ---
    if (currentY > doc.internal.pageSize.height - 250) {
       doc.addPage();
       currentY = 40;
    }
    
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("Inflow vs Outflow by Activity", 40, currentY);
    currentY += 15;

    const ioRowsFormatted = reportData.inflowOutflowRows.map(r => [
      r[0],
      formatCurrencyPDF(r[1]),
      formatCurrencyPDF(r[2]),
      r[3] > 0 ? `+${formatCurrencyPDF(r[3])}` : formatCurrencyPDF(r[3]),
      r[4]
    ]);

    const ioBodyLen = ioRowsFormatted.length;
    autoTable(doc, {
      startY: currentY,
      head: [["Activity", "Total Inflow", "Total Outflow", "Net Flow", "Position"]],
      body: ioRowsFormatted,
      theme: "plain",
      headStyles: { fillColor: [125, 30, 219], textColor: 255, fontSize: 9, halign: "center", cellPadding: 8 },
      bodyStyles: { fontSize: 9, halign: "center", textColor: 40, cellPadding: 6 },
      columnStyles: { 0: { halign: "left" }, 1: { halign: "center" }, 2: { halign: "center" }, 3: { halign: "center" } },
      margin: { left: 40, right: 40 },
      didParseCell: function (data) {
        if (data.section === "body") {
          const val = String(data.row.raw[3]);
          if (data.column.index === 3) {
            if (val.startsWith("-Rs.")) data.cell.styles.textColor = [255, 56, 60];
            if (val.startsWith("+Rs.")) data.cell.styles.textColor = [50, 187, 99];
          }
          if (data.row.index === ioBodyLen - 1) {
            data.cell.styles.fillColor = [242, 238, 255];
            data.cell.styles.textColor = 0;
            if (data.column.index === 3) data.cell.styles.textColor = [50, 187, 99];
          }
          if (data.column.index === 4) {
             data.cell.text = ""; 
          }
        }
      },
      didDrawCell: function (data) {
         if (data.section === "body" && data.column.index === 4) {
             const rowIdx = data.row.index;
             const isOutflow = ioRowsFormatted[rowIdx][4] === "Outflow";
             const bgColor = isOutflow ? [255, 219, 204] : [199, 255, 148]; 
             const txColor = isOutflow ? [219, 71, 30] : [50, 187, 99]; 
             
             const textStr = ioRowsFormatted[rowIdx][4];
             const textWidth = doc.getTextWidth(textStr);
             const pillW = textWidth + 12;
             const pillH = 14;
             const px = data.cell.x + (data.cell.width - pillW) / 2;
             const py = data.cell.y + (data.cell.height - pillH) / 2;
             
             doc.setFillColor(...bgColor);
             doc.roundedRect(px, py, pillW, pillH, 7, 7, "F");
             
             doc.setTextColor(...txColor);
             doc.text(textStr, px + 6, py + 10);
         }
      }
    });

    let ioFinalY = doc.lastAutoTable.finalY;
    doc.setDrawColor(220, 220, 220);
    doc.rect(40, currentY, pageWidth - 80, ioFinalY - currentY, "S");

    doc.save("Cash_Flow_Statement.pdf");
  };

  if (isLoading) {
     return (
        <div className="flex items-center justify-center h-full min-h-[400px] text-gray-500 font-medium">
          Loading Cash Flow Data...
        </div>
      );
  }

  const hasData = reportData?.sectionsData && reportData.sectionsData.length > 0;

  const renderTableSection = (section) => {
    const isOpen = openSections[section.id];
    const totalDisplay = hasData 
     ? (section.netTotal > 0 ? `+${formatCurrency(section.netTotal)}` : formatCurrency(section.netTotal))
     : "₹0.00";

    return (
      <div key={section.id} className="border border-[#D2D2D2] rounded-[8px] bg-white flex flex-col overflow-hidden w-full mb-4">
        {/* Accordion Header */}
        <div 
          className="flex justify-between items-center p-4 cursor-pointer bg-white"
          onClick={() => toggleSection(section.id)}
        >
          <span className="text-[15px] sm:text-[16px] font-medium text-[#1E1E1E]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            {section.title}
          </span>
          <div className="flex items-center gap-2">
            <span className={`text-[15px] font-medium ${(section.netTotal < 0) && hasData ? "text-[#FF383C]" : "text-[#1E1E1E]"}`} style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              {totalDisplay}
            </span>
            {isOpen ? <ChevronUp size={20} className="text-[#1E1E1E]" /> : <ChevronDown size={20} className="text-[#1E1E1E]" />}
          </div>
        </div>

        {/* Accordion Body */}
        {isOpen && (
          <div className="border-t border-[#E4E0E0] mx-4 mb-4 rounded-lg border-x border-b overflow-hidden flex flex-col">
            <div className="grid grid-cols-4 text-[13px] text-[#808080] bg-white border-b border-[#E4E0E0]">
              <div className="px-4 py-3 font-normal text-left sm:ml-2">Particulars</div>
              <div className="px-4 py-3 font-normal text-center">Inflow</div>
              <div className="px-4 py-3 font-normal text-center">Outflow</div>
              <div className="px-4 py-3 font-normal text-right sm:mr-2">Net Amount</div>
            </div>

            {hasData ? (
              <div className="flex flex-col bg-white">
                {section.rows.map((row, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-4 items-center text-[13px] sm:text-[14px] text-[#1E1E1E] last:border-b-0 hover:bg-gray-50 transition-colors"
                  >
                    <div className="px-4 py-4 font-normal text-[#1E1E1E] sm:ml-2">{row.particulars}</div>
                    <div className="px-4 py-4 font-medium text-center text-[#1E1E1E]">{row.inflow ? formatCurrency(row.inflow) : "-"}</div>
                    <div className={`px-4 py-4 font-medium text-center ${row.outflow ? "text-[#FF383C]" : "text-[#1E1E1E]"}`}>{row.outflow ? `(${formatCurrency(row.outflow)})` : "-"}</div>
                    <div className="px-4 py-4 font-medium text-right text-[#1E1E1E] sm:mr-2">{formatCurrency(row.net)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10">
                <img
                  src={noRecordsIllustration}
                  alt="No Data found"
                  className="mb-4"
                  style={{
                    width: "100%",
                    maxWidth: "250px",
                    height: "auto",
                  }}
                />
                <h3
                  className="text-center mb-1 text-[#000000] text-[20px] sm:text-[22px]"
                  style={{ fontFamily: "'Nunito Sans', sans-serif", fontWeight: 700 }}
                >
                  No Data found
                </h3>
                <p
                  className="text-center text-[#B0B0B0] text-[14px] sm:text-[15px]"
                  style={{ fontFamily: "'Nunito Sans', sans-serif", fontWeight: 500 }}
                >
                  There is no data to show at the moment.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="bg-white px-2 sm:px-4 md:px-6 py-2 sm:py-4 mx-0 sm:mx-4 mt-2 sm:mt-4 mb-4 rounded-xl h-[calc(100vh-8rem)] md:h-[calc(100vh-10rem)] overflow-y-auto"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center text-xs sm:text-sm mb-2">
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => navigate("/hrms")}
        >
          <ArrowLeft size={12} className="text-[#8B8D97]" />
          <span className="text-[#7D1EDB] font-normal">HRMS Dashboard</span>
        </div>
        <ChevronRight size={14} className="mx-1 text-[#8B8D97]" />
        <span className="text-[#667085]">Cash Flow</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h1
          className="text-gray-900"
          style={{
            fontFamily: "'Nunito Sans', sans-serif",
            fontWeight: 400,
            fontSize: "20px",
            color: "#494949",
            lineHeight: "100%",
          }}
        >
          Cash Flow
        </h1>
        <div className="flex gap-4">
          <button
            onClick={handleExportPDF}
            className="flex items-center justify-between gap-2 px-4 py-2 bg-white rounded-3xl border border-[#7D1EDB] cursor-pointer transition-colors hover:bg-purple-50"
            style={{
              color: "#7D1EDB",
              fontSize: "14px",
            }}
          >
            Export
            <Upload size={16} className="text-[#7D1EDB]" />
          </button>
          <button
            onClick={handleExportPDF}
            className="text-white font-medium transition-colors flex items-center justify-center cursor-pointer hover:bg-purple-700"
            style={{
              width: "165px",
              height: "40px",
              padding: "10px 16px",
              borderRadius: "26px",
              background: "#7D1EDB",
              fontSize: "14px",
            }}
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 sm:gap-4 mb-6">
        {Object.keys(filters).map((filterKey) => (
          <div key={filterKey} className="relative">
            <button
              onClick={() => toggleFilter(filterKey)}
              className="flex items-center justify-between gap-2 px-3 sm:px-4 py-2 bg-[#F3F0FF] rounded-lg min-w-[140px] cursor-pointer"
              style={{
                color: "#7D1EDB",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 400,
                fontSize: "14px",
              }}
            >
              {filters[filterKey]}
              <ChevronDown
                size={14}
                className={`transition-transform text-[#7D1EDB] ${openFilter === filterKey ? "rotate-180" : ""}`}
              />
            </button>

            {openFilter === filterKey && (
              <div
                className="absolute top-full left-0 mt-1 bg-white border border-gray-100 rounded-[8px] z-50 py-1"
                style={{
                  width: "max-content",
                  minWidth: "155px",
                  boxShadow: "0px 4px 14px 0px rgba(0, 0, 0, 0.1)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1px",
                }}
              >
                {filterOptions[filterKey].map((option) => (
                  <div
                    key={option}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 cursor-pointer"
                    style={{ whiteSpace: "nowrap" }}
                    onClick={() => handleFilterSelect(filterKey, option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      {hasData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {reportData.summaryCards.map((card, idx) => (
            <div
              key={idx}
              className="border border-[#D2D2D2] rounded-[8px] p-5 flex flex-col gap-4 bg-white"
            >
              <div className="flex justify-between items-start w-full mb-1">
                <span className="text-[#666666] text-[13px] font-medium" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                  {card.title}
                </span>
                {card.hasPercentage && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[11px] font-medium flex items-center gap-1 ${card.isPositive ? "bg-[#C7FF94] text-[#76DB1E]" : "bg-[#FFDBCC] text-[#DB471E]"}`}
                  >
                    {card.isPositive ? (
                      <ArrowUpRight size={12} strokeWidth={2.5} />
                    ) : (
                      <ArrowDownRight size={12} strokeWidth={2.5} />
                    )}
                    {card.percentage}
                  </span>
                )}
              </div>
              <span
                className="text-[#1E1E1E] text-[20px] font-medium"
                style={{ fontFamily: "'Nunito Sans', sans-serif" }}
              >
                {formatCurrency(card.amount)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Dynamic Sections (Empty state triggers inside renderTableSection) */}
      <div className="w-full relative">
        {hasData && (
          <div className="text-[#1E1E1E] text-[13px] font-medium mb-3 mt-2" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            Activity Breakdown
          </div>
        )}
        
        {hasData && reportData.sectionsData.map(section => renderTableSection(section))}
      </div>
      
    </div>
  );
};

export default CashFlow;
