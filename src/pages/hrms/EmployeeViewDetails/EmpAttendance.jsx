import React, { useState } from "react";

export default function EmpAttendance() {
  const [showFullView, setShowFullView] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const overview = [
    { label: "Total working days", value: 22 },
    { label: "Present days", value: 20 },
    { label: "Days absent", value: 2 },
    { label: "Late arrival", value: 1 },
    { label: "Early departures", value: 0 },
    { label: "Half days", value: 1 },
    { label: "Overtime hours", value: 6 },
    { label: "Attendance percent", value: "91%" },
  ];

  // Extended records array for pagination
  const allRecords = [
    { sr: "01", date: "1 Nov 2025", status: "Present", in: "09:05AM", out: "06:10PM", hours: "9 hrs", remark: "-" },
    { sr: "02", date: "1 Nov 2025", status: "Present", in: "09:05AM", out: "06:10PM", hours: "9 hrs", remark: "-" },
    { sr: "03", date: "1 Nov 2025", status: "Present", in: "09:05AM", out: "06:10PM", hours: "9 hrs", remark: "-" },
    { sr: "04", date: "1 Nov 2025", status: "Present", in: "09:05AM", out: "06:10PM", hours: "9 hrs", remark: "-" },
    { sr: "05", date: "1 Nov 2025", status: "Absent", in: "09:05AM", out: "06:10PM", hours: "9 hrs", remark: "Personal Work" },
    { sr: "06", date: "1 Nov 2025", status: "Present", in: "09:05AM", out: "06:10PM", hours: "9 hrs", remark: "-" },
    { sr: "07", date: "1 Nov 2025", status: "Absent", in: "09:05AM", out: "06:10PM", hours: "9 hrs", remark: "Personal Work" },
    { sr: "08", date: "1 Nov 2025", status: "Present", in: "09:05AM", out: "06:10PM", hours: "9 hrs", remark: "-" },
    { sr: "08", date: "1 Nov 2025", status: "Present", in: "09:05AM", out: "06:10PM", hours: "9 hrs", remark: "-" },
    { sr: "09", date: "1 Nov 2025", status: "Present", in: "09:05AM", out: "06:10PM", hours: "9 hrs", remark: "-" },
    { sr: "10", date: "1 Nov 2025", status: "Present", in: "09:05AM", out: "06:10PM", hours: "9 hrs", remark: "-" },
    ...Array.from({ length: 90 }, (_, i) => ({
      sr: String(i + 11).padStart(2, "0"),
      date: "1 Nov 2025",
      status: i % 7 === 0 ? "Absent" : "Present",
      in: "09:05AM",
      out: "06:10PM",
      hours: "9 hrs",
      remark: i % 7 === 0 ? "Personal Work" : "-"
    }))
  ];

  const records = showFullView ? allRecords : allRecords.slice(0, 8);

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = showFullView ? allRecords.slice(indexOfFirstRecord, indexOfLastRecord) : records;
  const totalPages = Math.ceil(allRecords.length / recordsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">

        {!showFullView && (
          <>
            {/* Overview Section */}
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">Overview</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {overview.map((item, index) => (
                <div
                  key={index}
                  className="p-3 sm:p-4 min-h-[90px] sm:min-h-[106px] rounded-lg flex flex-col items-center justify-center"
                  style={{ backgroundColor: "#EFEEE7" }}
                >
                  <p className="text-[11px] sm:text-xs text-[#757575] text-center mb-1">{item.label}</p>
                  <p className="text-xl sm:text-2xl text-black font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Recent Attendance / Attendance Records */}
        <div className="flex justify-between items-center mb-2 sm:mb-3">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">
            {showFullView ? "Attendance records" : "Recent attendance records"}
          </h2>
          {!showFullView && (
            <button
              onClick={() => setShowFullView(true)}
              className="text-purple-600 text-xs sm:text-sm font-medium cursor-pointer hover:text-purple-700"
            >
              View All
            </button>
          )}
        </div>

        {/* Table Container with Horizontal Scroll */}
        <div className="border border-gray-200 rounded-xl overflow-x-auto bg-white">
          <table className="w-full text-xs sm:text-sm min-w-[700px]">
            <thead className="bg-white">
              <tr className="border-b border-gray-200">
                <th className="p-2 sm:p-3 text-left text-[#757575] font-semibold whitespace-nowrap">Sr no</th>
                <th className="p-2 sm:p-3 text-left text-[#757575] font-semibold whitespace-nowrap">Date</th>
                <th className="p-2 sm:p-3 text-left text-[#757575] font-semibold whitespace-nowrap">Status</th>
                <th className="p-2 sm:p-3 text-left text-[#757575] font-semibold whitespace-nowrap">In Time</th>
                <th className="p-2 sm:p-3 text-left text-[#757575] font-semibold whitespace-nowrap">Out Time</th>
                <th className="p-2 sm:p-3 text-left text-[#757575] font-semibold whitespace-nowrap">Total Hours</th>
                <th className="p-2 sm:p-3 text-left text-[#757575] font-semibold whitespace-nowrap">Remarks</th>
              </tr>
            </thead>

            <tbody>
              {currentRecords.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="p-2 sm:p-3 text-black whitespace-nowrap">{row.sr}</td>
                  <td className="p-2 sm:p-3 text-black whitespace-nowrap">{row.date}</td>

                  {/* Status Badge */}
                  <td className="p-2 sm:p-3">
                    <span
                      className={`px-3 sm:px-4 py-1 rounded-full text-xs inline-block whitespace-nowrap ${row.status === "Present"
                        ? "bg-[#76DB1E33] text-[#76DB1E]"
                        : "bg-[#FFF1EC] text-[#DB471E]"
                        }`}
                    >
                      {row.status}
                    </span>
                  </td>

                  <td className="p-2 sm:p-3 text-black whitespace-nowrap">{row.in}</td>
                  <td className="p-2 sm:p-3 text-black whitespace-nowrap">{row.out}</td>
                  <td className="p-2 sm:p-3 text-black whitespace-nowrap">{row.hours}</td>
                  <td className="p-2 sm:p-3 text-black whitespace-nowrap">{row.remark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {showFullView && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-4 sm:mt-6 pt-3 sm:pt-4 gap-3 text-xs sm:text-sm text-gray-500">

            {/* Left text */}
            <div className="order-2 sm:order-1">
              Showing {indexOfFirstRecord + 1}–
              {Math.min(indexOfLastRecord, allRecords.length)} Of {allRecords.length}
            </div>

            {/* Center pagination */}
            <div className="flex items-center gap-2 sm:gap-3 order-1 sm:order-2">

              {/* Previous */}
              <button
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 hover:text-gray-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm"
              >
                ← Previous
              </button>

              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {getPageNumbers().map((page, index) =>
                  page === "..." ? (
                    <span
                      key={index}
                      className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-gray-400"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={index}
                      onClick={() => handlePageChange(page)}
                      className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-xs sm:text-sm font-medium transition-colors ${currentPage === page
                        ? "bg-purple-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              {/* Next */}
              <button
                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 hover:text-gray-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* </div> */}

      </div>
    </div>
  );
}