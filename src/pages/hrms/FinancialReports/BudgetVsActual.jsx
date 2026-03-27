import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Upload
} from "lucide-react";
import noRecordsIllustration from "../../../assets/no-records.svg";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency, formatCurrencyPDF } from "../../../utils/financialFormatters";

const BudgetVsActual = () => {
  const navigate = useNavigate();

  // Filters State
  const [filters, setFilters] = useState({
    dateRange: "Date Range",
    department: "Department",
    expenseCategory: "Expense Category",
  });

  const filterOptions = {
    dateRange: ["Jan-March 2026", "April-June 2026", "July-Sept 2026"],
    department: ["All Departments", "IT Department", "Sales & Marketing", "Operations"],
    expenseCategory: ["Cloud Infrastructure", "Employee Salaries", "Marketing Campaigns", "Office Rent & Utilities", "Travel & Expense", "Software License"],
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

  // Mock Data API Simulation
  useEffect(() => {
    setTimeout(() => {
      setReportData({
        summaryCards: [
          { title: "Total Budget", amount: 550000, percentage: "12.5%", isPositive: true },
          { title: "Total Actual Spent", amount: 550000, percentage: "12.5%", isPositive: true },
          { title: "Net Variance", amount: 550000, percentage: "12.5%", isPositive: false },
        ],
        varianceByDeptRows: [
          { department: "Cloud Infrastructure", budget: 80000, actual: 80000, variance: 10000, variancePerc: "+12.5%", status: "Within" },
          { department: "Employee Salaries", budget: 80000, actual: 90000, variance: -10000, variancePerc: "-12.5%", status: "Over" },
          { department: "Marketing Campaigns", budget: 80000, actual: 75000, variance: 10000, variancePerc: "+12.5%", status: "Within" },
          { department: "Office Rent & Utilities", budget: 80000, actual: 90000, variance: -10000, variancePerc: "-12.5%", status: "Over" },
          { department: "Travel & Expense", budget: 80000, actual: 75000, variance: 10000, variancePerc: "+12.5%", status: "Within" },
          { department: "Software License", budget: 80000, actual: 75000, variance: 10000, variancePerc: "+12.5%", status: "Within" }
        ],
        grandTotal: { department: "TOTAL", budget: 480000, actual: 450000, variance: 30000, variancePerc: "+6.3%", status: "Within" },
        expenseCategoryRows: [
          ["Infrastructure", 160000, 140000, 20000, "Within"],
          ["Personnel", 160000, 180000, -20000, "Over"],
          ["Marketing", 80000, 75000, 10000, "Within"],
          ["Operations", 80000, 90000, -10000, "Over"],
          ["Miscellaneous", 100000, 90000, -10000, "Over"]
        ],
        utilizationSummaryRows: [
          ["Total Budget Allocated", 4080000],
          ["Total Actual Spend", 4050000],
          ["Total Savings (Under Budget)", 30000],
          ["Departments Over Budget", "2 of 6"],
          ["Budget Utilization Rate", "93.75%"],
          ["OVERALL STATUS", "WITHIN BUDGET"]
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

    doc.text("BUDGET vs ACTUAL REPORT", pageWidth - 50, currentY + 25, { align: "right" });
    currentY += 40;

    // --- 2. Sub-header ---
    doc.setFillColor(248, 248, 248);
    doc.rect(40, currentY, pageWidth - 80, 40, "F");

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("Period:", 50, currentY + 25);
    doc.setFont("helvetica", "normal");
    doc.text("April 2024 - March 2025", 85, currentY + 25);

    const now = new Date();
    doc.setFont("helvetica", "bold");
    doc.text("Generated:", pageWidth - 190, currentY + 15);
    doc.setFont("helvetica", "normal");
    // Generate actual format: 30 March 2026, 07:44 AM
    const formattedDate = `${now.getDate()} ${now.toLocaleString("default", { month: "long" })} ${now.getFullYear()}, ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    doc.text(formattedDate, pageWidth - 140, currentY + 15);

    doc.setFont("helvetica", "bold");
    doc.text("Generated By:", pageWidth - 190, currentY + 30);
    doc.setFont("helvetica", "normal");
    doc.text("Ankit Kumar(Admin)", pageWidth - 125, currentY + 30);
    currentY += 50;

    // Statement Filters Row
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.rect(40, currentY, pageWidth - 80, 25);
    
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("Date Range:", 50, currentY + 16);
    doc.setFont("helvetica", "normal");
    doc.text("01 April 2024 - 31 March 2025", 105, currentY + 16);
    
    doc.setFont("helvetica", "bold");
    doc.text("Departments:", (pageWidth / 2) - 60, currentY + 16);
    doc.setFont("helvetica", "normal");
    doc.text("All Departments", (pageWidth / 2) + 5, currentY + 16);

    doc.setFont("helvetica", "bold");
    doc.text("Expense Category:", pageWidth - 170, currentY + 16);
    doc.setFont("helvetica", "normal");
    doc.text("All categories", pageWidth - 90, currentY + 16);

    currentY += 40;

    // --- 3. Summary Overview ---
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("Summary Overview", 40, currentY);
    currentY += 15;

    const boxWidth = (pageWidth - 80 - 30) / 3;
    reportData.summaryCards.forEach((item, index) => {
      const x = 40 + index * (boxWidth + 15);
      doc.setDrawColor(220, 220, 220);
      doc.setFillColor(255, 255, 255);
      doc.setLineWidth(0.5);
      doc.roundedRect(x, currentY, boxWidth, 65, 4, 4, "FD");

      doc.setTextColor(120, 120, 120);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(item.title, x + 8, currentY + 20);

      doc.setFillColor(item.isPositive ? 199 : 255, item.isPositive ? 255 : 219, item.isPositive ? 148 : 204); 
      const badgeW = 34;
      const badgeX = x + boxWidth - badgeW - 8;
      doc.roundedRect(badgeX, currentY + 9, badgeW, 14, 7, 7, "F");
      doc.setTextColor(item.isPositive ? 50 : 219, item.isPositive ? 187 : 71, item.isPositive ? 99 : 30); 
      doc.setFontSize(8);
      const textVal = (item.isPositive ? "+" : "-") + item.percentage;
      doc.text(textVal, badgeX + badgeW / 2, currentY + 19, { align: "center" });

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(formatCurrencyPDF(item.amount), x + 8, currentY + 48);
    });

    currentY += 90;

    // COMMON PILL DRAW LOGIC
    const drawPill = (doc, data, textStr) => {
      const isOver = textStr === "Over";
      const bgColor = isOver ? [255, 219, 204] : [199, 255, 148]; 
      const txColor = isOver ? [219, 71, 30] : [50, 187, 99]; 
      
      const textWidth = doc.getTextWidth(textStr);
      const pillW = textWidth + 14;
      const pillH = 14;
      const px = data.cell.x + (data.cell.width - pillW) / 2;
      const py = data.cell.y + (data.cell.height - pillH) / 2;
      
      doc.setFillColor(...bgColor);
      doc.roundedRect(px, py, pillW, pillH, 7, 7, "F");
      
      doc.setTextColor(...txColor);
      doc.text(textStr, px + 7, py + 10);
    };

    // --- 4. Variance Analysis By Department ---
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("Variance Analysis By Department", 40, currentY);
    currentY += 15;

    const vDptRows = reportData.varianceByDeptRows.map(r => [
      r.department, 
      formatCurrencyPDF(r.budget), 
      formatCurrencyPDF(r.actual), 
      formatCurrencyPDF(r.variance), 
      r.variancePerc, 
      r.status
    ]);
    const gt = reportData.grandTotal;
    vDptRows.push([
      gt.department, 
      formatCurrencyPDF(gt.budget), 
      formatCurrencyPDF(gt.actual), 
      formatCurrencyPDF(gt.variance), 
      gt.variancePerc, 
      gt.status
    ]);

    const vbdLen = vDptRows.length;
    autoTable(doc, {
      startY: currentY,
      head: [["Department", "Budget Amount", "Actual Spend", "Variance(Rs)", "Variance(%)", "Status"]],
      body: vDptRows,
      theme: "plain",
      headStyles: { fillColor: [125, 30, 219], textColor: 255, fontSize: 9, halign: "center", cellPadding: 8 },
      bodyStyles: { fontSize: 9, halign: "center", textColor: 40, cellPadding: 6 },
      columnStyles: { 0: { halign: "left" } },
      margin: { left: 40, right: 40 },
      didParseCell: function (data) {
        if (data.section === "body") {
          // Color variances
          if (data.column.index === 3 || data.column.index === 4) {
             const val = String(data.cell.raw);
             if (val.startsWith("-")) data.cell.styles.textColor = [255, 56, 60];
             else data.cell.styles.textColor = [50, 187, 99];
          }
          // TOTAL row styling
          if (data.row.index === vbdLen - 1) {
             data.cell.styles.fillColor = [242, 238, 255];
             if (data.column.index < 3) data.cell.styles.textColor = 0;
          }
          // Reset text for pills
          if (data.column.index === 5) {
             data.cell.text = ""; 
          }
        }
      },
      didDrawCell: function (data) {
         if (data.section === "body" && data.column.index === 5) {
             drawPill(doc, data, vDptRows[data.row.index][5]);
         }
      }
    });

    let vbdFinalY = doc.lastAutoTable.finalY;
    doc.setDrawColor(220, 220, 220);
    doc.rect(40, currentY, pageWidth - 80, vbdFinalY - currentY, "S");
    currentY = vbdFinalY + 30;

    if (currentY > doc.internal.pageSize.height - 200) {
      doc.addPage();
      currentY = 40;
    }

    // --- 5. Expense Category Breakdown ---
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("Expense Category Breakdown", 40, currentY);
    currentY += 15;

    const ecpRows = reportData.expenseCategoryRows.map(r => [
      r[0], formatCurrencyPDF(r[1]), formatCurrencyPDF(r[2]), formatCurrencyPDF(r[3]), r[4]
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [["Category", "Budgeted", "Actual", "Variance(Rs)", "Status"]],
      body: ecpRows,
      theme: "plain",
      headStyles: { fillColor: [125, 30, 219], textColor: 255, fontSize: 9, halign: "center", cellPadding: 8 },
      bodyStyles: { fontSize: 9, halign: "center", textColor: 40, cellPadding: 8 },
      columnStyles: { 0: { halign: "left" } },
      margin: { left: 40, right: 40 },
      didParseCell: function (data) {
        if (data.section === "body") {
          if (data.column.index === 3) {
             const val = String(data.cell.raw);
             if (val.startsWith("-")) data.cell.styles.textColor = [255, 56, 60];
             else data.cell.styles.textColor = [50, 187, 99];
          }
          if (data.column.index === 4) {
             data.cell.text = ""; 
          }
        }
      },
      didDrawCell: function (data) {
         if (data.section === "body" && data.column.index === 4) {
             drawPill(doc, data, ecpRows[data.row.index][4]);
         }
      }
    });

    let ecFinalY = doc.lastAutoTable.finalY;
    doc.setDrawColor(220, 220, 220);
    doc.rect(40, currentY, pageWidth - 80, ecFinalY - currentY, "S");
    currentY = ecFinalY + 30;

    if (currentY > doc.internal.pageSize.height - 200) {
      doc.addPage();
      currentY = 40;
    }

    // --- 6. Budget Utilization Summary ---
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("Budget Utilization Summary", 40, currentY);
    currentY += 15;

    const utlRows = reportData.utilizationSummaryRows.map(r => [r[0], formatCurrencyPDF(r[1])]);
    const busLen = utlRows.length;
    autoTable(doc, {
      startY: currentY,
      head: [["Metric", "Value"]],
      body: utlRows,
      theme: "plain",
      headStyles: { fillColor: [125, 30, 219], textColor: 255, fontSize: 9, halign: "left", cellPadding: 8 },
      bodyStyles: { fontSize: 9, halign: "left", textColor: 40, cellPadding: 8 },
      columnStyles: { 1: { halign: "right" } },
      margin: { left: 40, right: 40 },
      didParseCell: function (data) {
        if (data.section === "body") {
          if (data.row.index === 2 && data.column.index === 1) data.cell.styles.textColor = [50, 187, 99];
          if (data.row.index === 3 && data.column.index === 1) data.cell.styles.textColor = [255, 56, 60];
          
          if (data.row.index === busLen - 1) {
            data.cell.styles.fillColor = [219, 251, 230]; 
            data.cell.styles.textColor = [50, 187, 99];
            if (data.column.index === 0) data.cell.styles.halign = "center";
            if (data.column.index === 1) data.cell.styles.halign = "center";
          }
        }
      }
    });

    let busFinalY = doc.lastAutoTable.finalY;
    doc.setDrawColor(220, 220, 220);
    doc.rect(40, currentY, pageWidth - 80, busFinalY - currentY, "S");

    doc.save("Budget_Vs_Actual_Report.pdf");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] text-gray-500 font-medium">
        Loading Budget vs Actual Data...
      </div>
    );
  }

  const hasData = reportData?.varianceByDeptRows && reportData.varianceByDeptRows.length > 0;

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
        <span className="text-[#667085]">Budget vs Actual</span>
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
          Budget Vs Actual
        </h1>
        <div className="flex gap-4">
          <button
            onClick={handleExportPDF}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white rounded-3xl border border-[#7D1EDB] transition-colors hover:bg-purple-50 cursor-pointer"
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
            className="text-white font-medium transition-colors flex items-center justify-center hover:bg-purple-700 cursor-pointer"
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
              className="flex items-center justify-between gap-2 px-3 sm:px-4 py-2 bg-[#F3F0FF] rounded-lg min-w-[140px]"
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
      {hasData ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-4 max-w-3/4">
            {reportData.summaryCards.map((card, idx) => (
              <div
                key={idx}
                className="border border-[#D2D2D2] rounded-[8px] p-6 flex flex-col gap-4 bg-white"
              >
                <div className="flex justify-between items-center w-full mb-2">
                  <span className="text-[#666666] text-[14px] font-medium" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                    {card.title}
                  </span>
                  <span
                    className={`px-1 py-0.5 rounded-full text-[12px] font-medium flex items-center gap-1 ${card.isPositive ? "bg-[#C7FF94] text-[#76DB1E]" : "bg-[#FFDBCC] text-[#DB471E]"}`}
                  >
                    {card.isPositive ? (
                      <ArrowUpRight size={14} strokeWidth={2.5} />
                    ) : (
                      <ArrowDownRight size={14} strokeWidth={2.5} />
                    )}
                    {card.percentage}
                  </span>
                </div>
                <span
                  className="text-[#1E1E1E] text-[22px] font-medium"
                  style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                >
                  {formatCurrency(card.amount)}
                </span>
              </div>
            ))}
          </div>

          {/* Variance Analysis Table */}
          <div className="border border-[#D2D2D2] rounded-[8px] bg-white flex flex-col overflow-hidden w-full p-4">
            <h2
              className="text-[16px] font-medium text-[#1E1E1E] mb-4"
              style={{ fontFamily: "'Nunito Sans', sans-serif" }}
            >
              Variance Analysis
            </h2>
            <div className="border border-[#E4E0E0] rounded-lg overflow-hidden flex flex-col">
              <div className="grid grid-cols-5 text-[13px] text-[#808080] bg-white border-b border-[#E4E0E0]">
                <div className="px-4 py-3 font-normal">Department</div>
                <div className="px-4 py-3 font-normal text-center">Budget Amount</div>
                <div className="px-4 py-3 font-normal text-center">Actual Spend</div>
                <div className="px-4 py-3 font-normal text-center">Variance(₹)</div>
                <div className="px-4 py-3 font-normal text-center">Status</div>
              </div>

              <div className="flex flex-col bg-white">
                {reportData.varianceByDeptRows.map((row, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-5 items-center text-[13px] sm:text-[14px] text-[#1E1E1E]  last:border-b-0 hover:bg-gray-50 transition-colors"
                  >
                    <div className="px-4 py-3 font-normal text-[#1E1E1E]">{row.department}</div>
                    <div className="px-4 py-3 font-normal text-center text-[#1E1E1E]">{formatCurrency(row.budget)}</div>
                    <div className="px-4 py-3 font-normal text-center text-[#1E1E1E]">{formatCurrency(row.actual)}</div>
                    <div className="px-4 py-3 font-normal text-center text-[#1E1E1E]">{formatCurrency(row.variance)}</div>
                    <div className="px-4 py-3 flex justify-center">
                      <span
                        className={`px-2 py-1 rounded-full text-[12px] font-medium ${
                          row.status === "Within" 
                            ? "bg-[#76DB1E33] text-[#76DB1E]"
                            : "bg-[#FFDBCC] text-[#DB471E]"
                        }`}
                      >
                        {row.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Empty State */
        <div className="border border-[#C9C9C9] rounded-[8px] bg-white flex flex-col overflow-hidden w-full p-4 min-h-[400px]">
          <h2
            className="text-[16px] font-medium text-[#1E1E1E] mb-4"
            style={{ fontFamily: "'Nunito Sans', sans-serif" }}
          >
            Variance Analysis
          </h2>
          <div className="border border-[#E4E0E0] rounded-lg flex flex-col h-full">
            <div className="grid grid-cols-5 text-[13px] text-[#808080] bg-white border-b border-[#E4E0E0]">
              <div className="px-4 py-3 font-normal text-left sm:ml-4">Department</div>
              <div className="px-4 py-3 font-normal text-center">Budget Amount</div>
              <div className="px-4 py-3 font-normal text-center">Actual Spend</div>
              <div className="px-4 py-3 font-normal text-center">Variance(₹)</div>
              <div className="px-4 py-3 font-normal text-center">Status</div>
            </div>
            
            <div className="flex flex-col items-center justify-center flex-1 py-4">
              <img
                src={noRecordsIllustration}
                alt="No Data found"
                className="mb-4"
                style={{
                  width: "100%",
                  maxWidth: "300px",
                  height: "auto",
                }}
              />
              <h3
                className="text-center mb-1 text-[#000000] text-[20px] sm:text-[24px]"
                style={{ fontFamily: "'Nunito Sans', sans-serif", fontWeight: 700 }}
              >
                No Data found
              </h3>
              <p
                className="text-center text-[#B0B0B0] text-[15px] sm:text-[16px]"
                style={{ fontFamily: "'Nunito Sans', sans-serif", fontWeight: 500 }}
              >
                There is no data to show at the moment.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetVsActual;
