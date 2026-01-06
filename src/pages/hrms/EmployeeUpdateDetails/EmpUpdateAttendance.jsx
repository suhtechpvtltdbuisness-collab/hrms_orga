import React, { useState } from "react";

export default function EmpUpdateAttendance() {
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
    <div className="p-2">
      <div className="max-w-7xl mx-auto">

        {!showFullView && (
          <>
            {/* Overview Section */}
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Overview</h2>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8 pr-12">
              {overview.map((item, index) => (
                <div
                  key={index}
                  className="p-4 h-[106px] w-[145px] rounded-lg flex flex-col items-center"
                  style={{ backgroundColor: "#EFEEE7" }}
                >
                  <p className="text-[12px] pt-2 text-gray-600 text-center mb-1">{item.label}</p>
                  <p className="text-[20px] mt-2 text-black font-medium">{item.value}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Recent Attendance / Attendance Records */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-gray-800">
            {showFullView ? "Attendance records" : "Recent attendance records"}
          </h2>
          {!showFullView && (
            <button
              onClick={() => setShowFullView(true)}
              className="text-purple-600 text-sm font-medium cursor-pointer hover:text-purple-700"
            >
              View All
            </button>
          )}
        </div>

        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
          <table className="w-full text-sm">
            <thead className="bg-white">
              <tr className="border-b border-gray-200">
                <th className="p-3 text-left text-gray-400 font-semibold">Sr no</th>
                <th className="p-3 text-left text-gray-400 font-semibold">Date</th>
                <th className="p-3 text-left text-gray-400 font-semibold">Status</th>
                <th className="p-3 text-left text-gray-400 font-semibold">In Time</th>
                <th className="p-3 text-left text-gray-400 font-semibold">Out Time</th>
                <th className="p-3 text-left text-gray-400 font-semibold">Total Hours</th>
                <th className="p-3 text-left text-gray-400 font-semibold">Remarks</th>
              </tr>
            </thead>

            <tbody>
              {currentRecords.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="p-3 text-black font-semibold font-Nunito Sans">{row.sr}</td>
                  <td className="p-3 text-black font-semibold font-Nunito Sans">{row.date}</td>

                  {/* Status Badge */}
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-md text-xs font-medium inline-block ${row.status === "Present"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                        }`}
                    >
                      {row.status}
                    </span>
                  </td>

                  <td className="p-3 text-black font-semibold font-Nunito Sans">{row.in}</td>
                  <td className="p-3 text-black font-semibold font-Nunito Sans">{row.out}</td>
                  <td className="p-3 text-black font-semibold font-Nunito Sans">{row.hours}</td>
                  <td className="p-3 text-black font-semibold font-Nunito Sans">{row.remark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {showFullView && (
          <div className="relative flex items-center justify-center mt-6 pt-4  text-sm text-gray-500">

            {/* Left text */}
            <div className="absolute left-0">
              Showing {indexOfFirstRecord + 1}–
              {Math.min(indexOfLastRecord, allRecords.length)} Of {allRecords.length}
            </div>

            {/* Center pagination */}
            <div className="flex items-center gap-3">

              {/* Previous */}
              <button
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 hover:text-gray-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>

              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {getPageNumbers().map((page, index) =>
                  page === "..." ? (
                    <span
                      key={index}
                      className="w-8 h-8 flex items-center justify-center text-gray-400"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={index}
                      onClick={() => handlePageChange(page)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${currentPage === page
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
                className="flex items-center gap-1 hover:text-gray-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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