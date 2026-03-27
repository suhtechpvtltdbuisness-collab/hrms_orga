import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ArrowLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import noRecordsIllustration from "../../../assets/no-records.svg";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency, formatCurrencyPDF } from "../../../utils/financialFormatters";

const ProfitAndLoss = () => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    dateRange: "Date Range",
    department: "Department",
    costCenter: "Cost Center",
  });

  const filterOptions = {
    dateRange: ["Jan-March 2026", "April-June 2026", "July-Sept 2026"],
    department: [
      "All Departments",
      "IT Department",
      "Sales & Marketing",
      "Operations",
    ],
    costCenter: [
      "Global HQ",
      "Administration",
      "Finance & Accounts",
      "Operations",
    ],
  };

  const [openFilter, setOpenFilter] = useState(null);

  const toggleFilter = (filter) => {
    setOpenFilter(openFilter === filter ? null : filter);
  };

  const handleFilterSelect = (filter, value) => {
    setFilters((prev) => ({ ...prev, [filter]: value }));
    setOpenFilter(null);
  };

  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API Call
    setTimeout(() => {
      setReportData({
        summaryData: [
          { title: "Total Revenue", amount: 550000, percentage: "12.5%", isPositive: true },
          { title: "Direct Expense", amount: 550000, percentage: "12.5%", isPositive: true },
          { title: "Indirect Expense", amount: 550000, percentage: "12.5%", isPositive: false },
          { title: "Net Profit", amount: 550000, percentage: "12.5%", isPositive: true },
        ],
        tableData: [
          { department: "Sales", revenue: 80000, direct: 70000, indirect: 60000, net: 90000 },
          { department: "IT", revenue: 80000, direct: 70000, indirect: 60000, net: 90000 },
          { department: "Operations", revenue: 80000, direct: 70000, indirect: 60000, net: 90000 },
        ],
        grandTotal: {
          department: "GRAND TOTAL", revenue: 80000, direct: 70000, indirect: 60000, net: 90000
        },
        revenueBreakdown: [
          ["Product Sales", 320000, "58.2%"],
          ["Service Revenue", 150000, "27.3%"],
          ["Subscription", 50000, "9.1%"],
          ["Other Income", 30000, "5.4%"],
        ],
        expenseBreakdown: [
          ["Salaries & Wages", 280000, "50.9%"],
          ["Infrastructure", 80000, "14.5%"],
          ["Marketing", 60000, "10.9%"],
          ["Administrative", 50000, "9.1%"],
          ["Miscellaneous", 30000, "5.5%"],
        ],
        observations: [
          {
            title: "Gross Profit Margin",
            desc: "The company maintains a healthy gross margin. Direct expenses account\nfor 70% of revenue, leaving a 30% margin before indirect costs.",
          },
          {
            title: "Department\nPerformance",
            desc: "The company maintains a healthy gross margin. Direct expenses account\nfor 70% of revenue, leaving a 30% margin before indirect costs.",
          },
          {
            title: "Expense Control",
            desc: "Indirect expense represent a significant portion of costs. A 10% reduction could\nadd approximately Rs. 6,000 to the net profit per department.",
          },
          {
            title: "Growth Trend",
            desc: "A 12.5% increase across all key metrics indicates strong business growth.\nSustaining this trajectory requires continued investment in high-margin activities.",
          },
        ]
      });
      setIsLoading(false);
    }, 800);
  }, []);

  const handleExportPDF = () => {
    if (!reportData) return;

    const doc = new jsPDF("p", "pt", "a4");
    const pageWidth = doc.internal.pageSize.width;

    // --- 1. Top Header ---
    doc.setFillColor(125, 30, 219); // #7D1EDB
    doc.rect(40, 40, pageWidth - 80, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "normal");
    doc.text("SUH TECH", 50, 65);

    doc.setFontSize(18);
    doc.text("PROFIT & LOSS", pageWidth - 50, 65, { align: "right" });

    // --- 2. Sub-header ---
    doc.setFillColor(237, 232, 252); // #EDE8FC
    doc.rect(40, 80, pageWidth - 80, 40, "F");

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("Company:", 50, 95);
    doc.setFont("helvetica", "normal");
    doc.text("SUH Technologies Pvt. Ltd.", 95, 95);

    doc.setFont("helvetica", "bold");
    doc.text("Period:", 50, 110);
    doc.setFont("helvetica", "normal");
    doc.text("April 2024 - March 2025", 85, 110);

    const now = new Date();
    const formattedDate = `${now.getDate()} ${now.toLocaleString("default", { month: "long" })} ${now.getFullYear()}, ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

    doc.setFont("helvetica", "bold");
    doc.text("Generated:", pageWidth - 190, 95);
    doc.setFont("helvetica", "normal");
    doc.text(formattedDate, pageWidth - 140, 95);

    doc.setFont("helvetica", "bold");
    doc.text("Generated By:", pageWidth - 190, 110);
    doc.setFont("helvetica", "normal");
    doc.text("Ankit Kumar(Admin)", pageWidth - 125, 110);

    let currentY = 135;

    // --- 3. Financial Summary ---
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Financial Summary", 40, currentY);
    currentY += 20;

    const boxWidth = (pageWidth - 80 - 45) / 4;
    reportData.summaryData.forEach((item, index) => {
      const x = 40 + index * (boxWidth + 15);
      doc.setDrawColor(240, 240, 240);
      doc.setFillColor(255, 255, 255);
      doc.setLineWidth(1);
      doc.roundedRect(x, currentY, boxWidth, 60, 8, 8, "FD");

      doc.setTextColor(100, 100, 100);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(item.title, x + 8, currentY + 20);

      doc.setFontSize(8);
      const badgeText = `${item.isPositive ? "+" : "-"}${item.percentage}`;
      const badgeW = 34;
      const badgeX = x + boxWidth - badgeW - 8;
      if (item.isPositive) {
        doc.setFillColor(228, 248, 216);
        doc.setTextColor(76, 175, 80);
      } else {
        doc.setFillColor(255, 235, 238);
        doc.setTextColor(234, 67, 53);
      }
      doc.roundedRect(badgeX, currentY + 11, badgeW, 14, 4, 4, "F");
      doc.setFont("helvetica", "bold");
      doc.text(badgeText, badgeX + badgeW / 2, currentY + 21, {
        align: "center",
      });

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(formatCurrencyPDF(item.amount), x + 8, currentY + 45);
      doc.setFont("helvetica", "normal");
    });

    currentY += 80;

    // --- 4. Department-wise Profitability Overview ---
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Department-wise Profitability Overview", 40, currentY);
    currentY += 15;

    const tableColumn = [
      "Department",
      "Revenue",
      "Direct Expenses",
      "Indirect Expenses",
      "Net Profit",
    ];
    const processRow = (row) => [
      row.department,
      formatCurrencyPDF(row.revenue),
      formatCurrencyPDF(row.direct),
      formatCurrencyPDF(row.indirect),
      formatCurrencyPDF(row.net),
    ];
    const tableRowsArr = reportData.tableData.map(processRow);
    tableRowsArr.push(processRow(reportData.grandTotal));

    const tableStartY = currentY;

    autoTable(doc, {
      startY: tableStartY,
      head: [tableColumn],
      body: tableRowsArr,
      theme: "plain",
      headStyles: {
        fillColor: [125, 30, 219],
        textColor: 255,
        fontSize: 10,
        halign: "center",
        cellPadding: 10,
      },
      bodyStyles: {
        fontSize: 10,
        halign: "center",
        textColor: 40,
        cellPadding: 8,
      },
      columnStyles: { 0: { halign: "left" } },
      didParseCell: function (data) {
        if (
          data.row.index === tableRowsArr.length - 1 &&
          data.section === "body"
        ) {
          data.cell.styles.fillColor = [238, 236, 255];
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.textColor = 0;
        }
      },
      margin: { left: 40, right: 40 },
    });

    let finalY = doc.lastAutoTable.finalY;
    doc.setDrawColor(240, 240, 240);
    doc.setLineWidth(1);
    doc.roundedRect(
      40,
      tableStartY,
      pageWidth - 80,
      finalY - tableStartY,
      8,
      8,
      "S",
    );

    currentY = finalY + 25;

    // --- 5. Two Tables Layout ---
    const halfWidth = (pageWidth - 80 - 15) / 2;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Revenue Breakdown", 40, currentY);
    doc.text("Expense Breakdown", 40 + halfWidth + 15, currentY);
    currentY += 15;

    const revRows = reportData.revenueBreakdown.map(row => [row[0], formatCurrencyPDF(row[1]), row[2]]);
    const expRows = reportData.expenseBreakdown.map(row => [row[0], formatCurrencyPDF(row[1]), row[2]]);

    const revStartY = currentY;
    autoTable(doc, {
      startY: revStartY,
      head: [["Category", "Amount(Rs)", "Share"]],
      body: revRows,
      theme: "plain",
      headStyles: {
        fillColor: [125, 30, 219],
        textColor: 255,
        fontSize: 10,
        halign: "center",
        cellPadding: 10,
      },
      bodyStyles: {
        fontSize: 10,
        halign: "center",
        textColor: 40,
        cellPadding: 8,
      },
      columnStyles: { 0: { halign: "left" } },
      margin: { left: 40, right: 40 + halfWidth + 15 },
    });
    const leftTableY = doc.lastAutoTable.finalY;
    doc.setDrawColor(240, 240, 240);
    doc.setLineWidth(1);
    doc.roundedRect(
      40,
      revStartY,
      halfWidth,
      leftTableY - revStartY,
      8,
      8,
      "S",
    );

    const expStartY = currentY;
    autoTable(doc, {
      startY: expStartY,
      head: [["Category", "Amount(Rs)", "Share"]],
      body: expRows,
      theme: "plain",
      headStyles: {
        fillColor: [125, 30, 219],
        textColor: 255,
        fontSize: 10,
        halign: "center",
        cellPadding: 10,
      },
      bodyStyles: {
        fontSize: 10,
        halign: "center",
        textColor: 40,
        cellPadding: 8,
      },
      columnStyles: { 0: { halign: "left" } },
      margin: { left: 40 + halfWidth + 15, right: 40 },
    });
    const rightTableY = doc.lastAutoTable.finalY;
    doc.setDrawColor(240, 240, 240);
    doc.setLineWidth(1);
    doc.roundedRect(
      40 + halfWidth + 15,
      expStartY,
      halfWidth,
      rightTableY - expStartY,
      8,
      8,
      "S",
    );

    currentY = Math.max(leftTableY, rightTableY) + 25;

    // --- 6. Profit Analysis & Observations ---
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Profit Analysis & Observations", 40, currentY);
    currentY += 15;

    reportData.observations.forEach((obs) => {
      doc.setFillColor(248, 248, 250);
      doc.setDrawColor(240, 240, 240);
      doc.setLineWidth(0.5);
      doc.roundedRect(40, currentY, pageWidth - 80, 44, 8, 8, "FD");

      doc.setFillColor(125, 30, 219);
      doc.roundedRect(132, currentY + 10, 4, 24, 2, 2, "F"); 

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10); 
      doc.setFont("helvetica", "bold");
      const titleLines = obs.title.split("\n");
      if (titleLines.length > 1) {
        doc.text(titleLines[0], 126, currentY + 20, { align: "right" }); 
        doc.text(titleLines[1], 126, currentY + 32, { align: "right" });
      } else {
        doc.text(obs.title, 126, currentY + 26, { align: "right" });
      }

      doc.setTextColor(60, 60, 60);
      doc.setFontSize(8); 
      doc.setFont("helvetica", "normal");
      const descLines = obs.desc.split("\n");
      doc.text(descLines[0], 145, currentY + 19); 
      if (descLines[1]) doc.text(descLines[1], 145, currentY + 31);

      currentY += 50;
    });
    doc.save("Profit_And_Loss_Report.pdf");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] text-gray-500 font-medium">
        Loading Profit & Loss Data...
      </div>
    );
  }

  const hasData = reportData?.tableData && reportData.tableData.length > 0;

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
        <span className="text-[#667085]">Profit & Loss</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-4">
        <h1
          className="text-gray-900"
          style={{
            fontFamily: "'Nunito Sans', sans-serif",
            fontWeight: 600,
            fontSize: "20px",
            color: "#494949",
            lineHeight: "100%",
            letterSpacing: "0%",
            width: "auto",
            height: "auto",
          }}
        >
          Profit & Loss
        </h1>
        <button
          onClick={handleExportPDF}
          className="text-white font-medium transition-colors flex items-center cursor-pointer justify-center hover:bg-purple-700"
          style={{
            width: "165px",
            height: "48px",
            padding: "10px 16px",
            gap: "8px",
            borderRadius: "26px",
            borderWidth: "1px",
            borderColor: "#F5F5F5",
            background: "#7D1EDB",
            fontSize: "14px",
            opacity: 1,
          }}
        >
          Generate Report
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 sm:gap-4 mb-2 sm:mb-4">
        {Object.keys(filters).map((filterKey) => (
          <div key={filterKey} className="relative">
            <button
              onClick={() => toggleFilter(filterKey)}
              className="flex items-center justify-between gap-2 px-3 sm:px-4 py-2 bg-[#EEECFF] rounded-lg min-w-[120px] sm:min-w-[140px]"
              style={{
                color: "#7D1EDB",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 400,
                fontSize: "14px",
                lineHeight: "140%",
                letterSpacing: "0%",
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
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      whiteSpace: "nowrap",
                    }}
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

      {hasData && (
        <>
          {/* Success Message Banner */}
          <div className="border border-[#C9C9C9] rounded-[8px] px-4 py-3 mb-4 text-center text-[#000000] text-[14px] sm:text-[15px] font-medium w-full max-w-[600px]">
            Dept-wise profitability overview generated successfully!!
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {reportData.summaryData.map((card, idx) => (
              <div
                key={idx}
                className="border border-[#C9C9C9] rounded-[8px] p-4 py-8 flex flex-col gap-3 bg-white"
              >
                <div className="flex justify-between items-center w-full">
                  <span className="text-[#666666] text-[13px] font-medium">
                    {card.title}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[12px] font-normal flex items-center gap-1 ${card.isPositive ? "bg-[#C7FF94] text-[#76DB1E]" : "bg-[#FFDBCC] text-[#DB471E]"}`}
                  >
                    {card.isPositive ? (
                      <ArrowUpRight size={14} strokeWidth={3} />
                    ) : (
                      <ArrowDownRight size={14} strokeWidth={3} />
                    )}
                    {card.percentage}
                  </span>
                </div>
                <span
                  className="text-[#1E1E1E] text-[20px] sm:text-[22px] font-medium"
                  style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                >
                  {formatCurrency(card.amount)}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Main Content Area (Full Responsive Layout) */}
      <div
        className="border border-[#C9C9C9] rounded-[8px] bg-white flex flex-col overflow-hidden w-full"
        style={{
          padding: "16px",
          gap: "10px",
          margin: "0",
          minHeight: hasData ? "auto" : "482px",
        }}
      >
        {/* Inner Title Section */}
        <h2
          className="text-[14px] sm:text-[16px] font-medium text-[#1E1E1E] mb-2"
          style={{ fontFamily: "'Nunito Sans', sans-serif" }}
        >
          Department wise profitability overview
        </h2>

        {/* Table Header Section */}
        <div className="border border-[#E4E0E0] rounded-lg overflow-hidden flex flex-col flex-1">
          <div className="grid grid-cols-5 text-[12px] sm:text-[13px] text-[#808080] bg-white border-b border-[#E4E0E0]">
            <div className="px-4 py-3 font-normal">Department</div>
            <div className="px-4 py-3 font-normal text-center">Revenue</div>
            <div className="px-4 py-3 font-normal text-center">
              Direct Expenses
            </div>
            <div className="px-4 py-3 font-normal text-center">
              Indirect Expenses
            </div>
            <div className="px-4 py-3 font-normal text-center">Net Profit</div>
          </div>

          {hasData ? (
            <div className="flex flex-col bg-white">
              {reportData.tableData.map((row, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-5 items-center text-[13px] sm:text-[14px] text-[#1E1E1E] last:border-b-0 hover:bg-gray-50 transition-colors"
                >
                  <div className="px-4 py-3 font-medium text-[#494949]">
                    {row.department}
                  </div>
                  <div className="px-4 py-3 font-medium text-center">
                    {formatCurrency(row.revenue)}
                  </div>
                  <div className="px-4 py-3 font-medium text-center">
                    {formatCurrency(row.direct)}
                  </div>
                  <div className="px-4 py-3 font-medium text-center">
                    {formatCurrency(row.indirect)}
                  </div>
                  <div className="px-4 py-3 font-medium text-center">
                    {formatCurrency(row.net)}
                  </div>
                </div>
              ))}
              {/* Grand Total Row */}
              <div className="grid grid-cols-5 items-center text-[13px] sm:text-[14px] text-[#1E1E1E] bg-[#EEECFF]">
                <div className="px-4 py-3 font-medium text-[#494949]">
                  {reportData.grandTotal.department}
                </div>
                <div className="px-4 py-3 font-medium text-center">
                  {formatCurrency(reportData.grandTotal.revenue)}
                </div>
                <div className="px-4 py-3 font-medium text-center">
                  {formatCurrency(reportData.grandTotal.direct)}
                </div>
                <div className="px-4 py-3 font-medium text-center">
                  {formatCurrency(reportData.grandTotal.indirect)}
                </div>
                <div className="px-4 py-3 text-[18px] sm:text-[20px] font-medium text-center">
                  {formatCurrency(reportData.grandTotal.net)}
                </div>
              </div>
            </div>
          ) : (
            /* Empty State Body Area */
            <div className="flex flex-col items-center justify-center flex-1 bg-white min-h-[300px] py-10">
              <img
                src={noRecordsIllustration}
                alt="No Data found"
                className="mb-4"
                style={{
                  width: "100%",
                  maxWidth: "352.8px",
                  height: "auto",
                }}
              />
              <h3
                className="text-center mb-1"
                style={{
                  fontFamily: "'Nunito Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: "24px",
                  color: "#000000",
                  lineHeight: "100%",
                }}
              >
                No Data found
              </h3>
              <p
                className="text-center font-normal"
                style={{
                  fontFamily: "'Nunito Sans', sans-serif",
                  fontWeight: 500,
                  fontSize: "16px",
                  color: "#B0B0B0",
                  lineHeight: "100%",
                }}
              >
                There is no data to show at the moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfitAndLoss;
