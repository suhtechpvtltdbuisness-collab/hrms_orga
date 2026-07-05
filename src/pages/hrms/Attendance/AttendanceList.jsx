import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, ChevronRight, ArrowLeft, ArrowRight, X } from 'lucide-react';
import FilterDropdown from '../../../components/ui/FilterDropdown';
import { useNavigate } from 'react-router-dom';
import MarkAttendanceModal from './MarkAttendanceModal';
import AttendanceSuccessModal from './AttendanceSuccessModal';
import AttendanceErrorModal from './AttendanceErrorModal';
import { attendanceService, attendanceUtils, employeeService } from '../../../service';

const AttendanceList = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [employeeNames, setEmployeeNames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedFaceRecord, setSelectedFaceRecord] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const [filters, setFilters] = useState({
    name: 'All',
    leaveType: 'All',
    status: 'All',
    date: getTodayDateString()
  });

  const LEAVE_TYPE_OPTIONS = ["All", "Sick Leave", "Personal Leave"];
  const STATUS_OPTIONS = ["All", "Present", "Absent", "Leave", "Half Day"];

  const COLORS = {
    purple: "#7D1EDB",
    greenBg: "#E4F8D2",
    greenFont: "#76DB1E",
    redBg: "#FFDBCC",
    redFont: "#DB471E",
  };

  const fetchEmployees = useCallback(async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const adminId = userData.id || userData._id;
      if (!adminId) return;

      const response = await employeeService.getAllEmployeesByAdminId(adminId);
      if (response.success && Array.isArray(response.data)) {
        const names = response.data
          .map((item) => {
            const u = item.user || item;
            return u?.name;
          })
          .filter(Boolean);
        setEmployeeNames(["All", ...new Set(names)]);
      }
    } catch {
      // keep default filter options
    }
  }, []);

  const fetchAttendances = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await attendanceService.getAttendances(filters);

      if (response.success) {
        const rows = (response.data || []).map((record, index) =>
          attendanceUtils.mapRecordToRow(record, index),
        );
        setAttendanceData(rows);
      } else {
        setAttendanceData([]);
        setErrorMessage(response.message || 'Failed to load attendance records.');
      }
    } catch {
      setAttendanceData([]);
      setErrorMessage('Something went wrong while loading attendance records.');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    fetchAttendances();
  }, [fetchAttendances]);

  const getStatusStyle = (status) => {
    if (status === 'Present') {
      return { backgroundColor: COLORS.greenBg, color: COLORS.greenFont };
    } else if (status === 'Absent' || status === 'Leave') {
      return { backgroundColor: COLORS.redBg, color: COLORS.redFont };
    }
    return { backgroundColor: '#F3F4F6', color: '#6B7280' };
  };

  const hasFaceAttendance = useMemo(
    () => attendanceData.some(
      (item) => item.checkInFaceImage
        || item.checkOutFaceImage
        || item.checkInVerificationMethod === 'face'
        || item.checkOutVerificationMethod === 'face',
    ),
    [attendanceData],
  );

  const renderFaceCapture = (item, captureType) => {
    const isCheckIn = captureType === 'check-in';
    const image = isCheckIn ? item.checkInFaceImage : item.checkOutFaceImage;
    const method = isCheckIn
      ? item.checkInVerificationMethod
      : item.checkOutVerificationMethod;
    const label = isCheckIn ? 'Face Check-In' : 'Face Check-Out';

    if (image) {
      return (
        <button
          type="button"
          onClick={() => setSelectedFaceRecord({
            ...item,
            previewImage: image,
            previewLabel: label,
          })}
          className="mx-auto flex items-center justify-center rounded-xl border border-[#E9D5FF] bg-[#FAF5FF] p-1.5 transition hover:scale-105 hover:border-[#7D1EDB]"
        >
          <img
            src={image}
            alt={`${item.name} ${captureType} face`}
            className="h-12 w-12 rounded-lg object-cover"
          />
        </button>
      );
    }

    if (method === 'face') {
      return (
        <span className="inline-flex items-center rounded-full bg-[#F3E8FF] px-3 py-1 text-[12px] font-medium text-[#7D1EDB]">
          Face verified
        </span>
      );
    }

    return <span className="text-[13px] text-[#9CA3AF]">-</span>;
  };

  const filteredData = useMemo(() => {
    return attendanceData.filter((item) => {
      const matchesStatus =
        !filters.status || filters.status === 'All' || item.status === filters.status;
      const matchesName =
        !filters.name || filters.name === 'All' || item.name === filters.name;
      const matchesLeave =
        !filters.leaveType || filters.leaveType === 'All' || item.leaveType === filters.leaveType;
      
      let matchesDate = true;
      if (filters.date) {
        const [y, m, d] = filters.date.split('-');
        if (y && m && d) {
          const displayDate = `${d}/${m}/${y}`;
          matchesDate = item.date === displayDate;
        }
      }

      return matchesStatus && matchesName && matchesLeave && matchesDate;
    });
  }, [attendanceData, filters.status, filters.name, filters.leaveType, filters.date]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSaveAttendance = async (data) => {
    const apiStatus = attendanceUtils.statusToApi(data.status);
    const payload = {
      empId: Number(data.employeeId),
      dates: data.selectedDays.map(attendanceUtils.toApiDate),
      status: apiStatus,
    };

    if (apiStatus === 'on_leave' && data.leaveType) {
      payload.leaveType = attendanceUtils.leaveTypeToApi(data.leaveType);
    }

    const response = await attendanceService.markAttendanceBulk(payload);

    if (response.success) {
      setIsModalOpen(false);
      setIsSuccessModalOpen(true);
      fetchAttendances();
    } else {
      setErrorMessage(response.message || 'Failed to mark attendance.');
      setIsErrorModalOpen(true);
    }
  };

  const nameOptions = employeeNames.length > 0 ? employeeNames : ["All"];

  return (
    <div className="bg-white px-4 sm:px-4 md:px-6 py-4 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-9rem)] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-10rem)] xl:h-[calc(100vh-11rem)] flex flex-col border border-[#D9D9D9] font-sans" style={{ fontFamily: 'Poppins, sans-serif' }}>

      <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 shrink-0" style={{ fontFamily: '"Mulish", sans-serif' }}>
         <img
            src="/images/arrow_left_alt.svg"
            alt="Back"
            className="w-3 h-3 cursor-pointer hover:scale-110 transition-transform"
            onClick={() => navigate('/hrms')}
         />
         <span
            className='cursor-pointer text-[#7D1EDB]'
            onClick={() => navigate('/hrms')}
         >
            HRMS Dashboard
         </span>
         <ChevronRight size={14}/>
         <span className="text-[#6B7280]">Attendance</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
        <h1 className="text-xl font-semibold text-gray-800">Attendance</h1>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center cursor-pointer justify-center gap-2 text-[#7D1EDB] font-medium hover:bg-purple-50 transition-colors bg-white w-full sm:w-auto min-w-[170px]"
            style={{
              height: '48px',
              padding: '10px 24px',
              borderRadius: '26px',
              border: '1px solid #7D1EDB'
            }}
          >
            <span>Mark Attendance</span>
          </button>

          <button
            onClick={() => navigate('/hrms/attendance/add')}
            className="flex items-center justify-center gap-2 text-white font-medium hover:bg-purple-700 transition-colors bg-[#7D1EDB] w-full sm:w-auto min-w-[177px]"
            style={{
              height: '48px',
              padding: '10px 16px',
              borderRadius: '26px'
            }}
          >
            <span>Add Attendance</span>
            <Plus size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex flex-col gap-1">
            <span className="text-[14px] font-normal text-[#1E1E1E]" style={{ fontFamily: 'Inter, sans-serif' }}>Date</span>
            <input
                type="date"
                value={filters.date}
                onChange={(e) => { setFilters(prev => ({ ...prev, date: e.target.value })); setCurrentPage(1); }}
                className="w-[210px] h-[38px] font-normal text-[13px] px-4 py-2 bg-white border border-[#D9D9D9] text-[#1E1E1E] rounded-[12px] outline-none hover:border-[#7D1EDB] transition-colors cursor-pointer"
                style={{ fontFamily: 'Inter, sans-serif' }}
            />
        </div>

        <div className="flex flex-col gap-1">
            <span className="text-[14px] font-normal text-[#1E1E1E]" style={{ fontFamily: 'Inter, sans-serif' }}>Employee Name</span>
            <FilterDropdown
                label="Employee Name"
                options={nameOptions}
                value={filters.name}
                onChange={(val) => { setFilters(prev => ({ ...prev, name: val })); setCurrentPage(1); }}
                minWidth="150px"
                placeholder="Select Name"
                dropdownWidth="150px"
                optionFontFamily="'Nunito Sans', sans-serif"
                className="w-[210px] font-normal text-[13px] flex items-center justify-between px-4 py-2 bg-white border border-[#D9D9D9] text-[#1E1E1E] rounded-[12px] outline-none hover:border-[#7D1EDB] transition-colors"
            />
        </div>

        <div className="flex flex-col gap-1">
            <span className="text-[14px] font-normal text-[#1E1E1E]" style={{ fontFamily: 'Inter, sans-serif' }}>Leave Type</span>
            <FilterDropdown
                label="Leave Type"
                options={LEAVE_TYPE_OPTIONS}
                value={filters.leaveType}
                onChange={(val) => { setFilters(prev => ({ ...prev, leaveType: val })); setCurrentPage(1); }}
                minWidth="150px"
                placeholder="Select Types"
                dropdownWidth="150px"
                optionFontFamily="'Nunito Sans', sans-serif"
                className="w-[210px] font-normal text-[13px] flex items-center justify-between px-4 py-2 bg-white border border-[#D9D9D9] text-[#1E1E1E] rounded-[12px] outline-none hover:border-[#7D1EDB] transition-colors"
            />
        </div>

        <div className="flex flex-col gap-1">
            <span className="text-[14px] font-normal text-[#1E1E1E]" style={{ fontFamily: 'Inter, sans-serif' }}>Status</span>
             <FilterDropdown
                label="Status"
                options={STATUS_OPTIONS}
                value={filters.status}
                onChange={(val) => { setFilters(prev => ({ ...prev, status: val })); setCurrentPage(1); }}
                minWidth="150px"
                placeholder="Select Status"
                dropdownWidth="150px"
                optionFontFamily="'Nunito Sans', sans-serif"
                className="w-[210px] font-normal text-[13px] flex items-center justify-between px-4 py-2 bg-white border border-[#D9D9D9] text-[#1E1E1E] rounded-[12px] outline-none hover:border-[#7D1EDB] transition-colors"
            />
        </div>
      </div>

      {errorMessage && !isLoading && (
        <p className="text-sm text-red-500 mb-2">{errorMessage}</p>
      )}

      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto border border-[#CECECE] rounded-lg">
        <table className={`w-full table-fixed ${hasFaceAttendance ? 'min-w-[1150px]' : 'min-w-[800px]'}`}>
          <thead className="sticky top-0 bg-white z-10">
            <tr className="text-left border-b border-[#CECECE]" style={{ fontFamily: 'Poppins, sans-serif' }}>
               <th className="py-3 px-6 w-[80px] text-[12px] font-normal text-[#757575] bg-white">Sr No.</th>
               <th className="py-3 px-6 w-[200px] text-[12px] font-normal text-[#757575] tracking-wider bg-white">EMP Name</th>
               <th className="py-3 px-6 w-[150px] text-[12px] font-normal text-[#757575] tracking-wider bg-white">EMP ID</th>
               <th className="py-3 px-6 w-[150px] text-[12px] font-normal text-[#757575] tracking-wider bg-white text-center">Status</th>
               <th className="py-3 px-6 w-[180px] text-[12px] font-normal text-[#757575] tracking-wider bg-white text-center">Attendance Date</th>
               <th className="py-3 px-6 w-[150px] text-[12px] font-normal text-[#757575] tracking-wider bg-white text-center">Leave Type</th>
               {hasFaceAttendance && (
                 <>
                   <th className="py-3 px-6 w-[170px] text-[12px] font-normal text-[#757575] tracking-wider bg-white text-center">Face Check-In</th>
                   <th className="py-3 px-6 w-[170px] text-[12px] font-normal text-[#757575] tracking-wider bg-white text-center">Face Check-Out</th>
                 </>
               )}
            </tr>
          </thead>
          <tbody style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
             {isLoading ? (
                <tr>
                  <td colSpan={hasFaceAttendance ? 8 : 6} className="text-center py-8 text-gray-500">Loading attendance...</td>
                </tr>
             ) : currentItems.length > 0 ? (
                 currentItems.map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-gray-50 last:border-0 transition-colors">
                       <td className="py-2 px-6 text-[14px] text-[#000000] font-medium text-center md:text-left">{item.srNo}</td>
                       <td className="py-2 px-6 text-[14px] text-[#000000] font-medium">{item.name}</td>
                       <td className="py-2 px-6 text-[14px] text-[#000000] font-medium">{item.empId}</td>
                       <td className="py-2 px-6 text-center">
                         <span
                            className="inline-flex items-center justify-center px-1 py-1 rounded-[18px] text-[12px] font-medium min-w-[80px]"
                            style={getStatusStyle(item.status)}
                         >
                            {item.status}
                         </span>
                       </td>
                       <td className="py-2 px-6 text-[14px] text-[#000000] font-medium text-center">{item.date}</td>
                       <td className="py-2 px-6 text-[14px] text-[#000000] font-medium text-center">{item.leaveType}</td>
                       {hasFaceAttendance && (
                         <>
                           <td className="py-2 px-6 text-center">
                             {renderFaceCapture(item, 'check-in')}
                           </td>
                           <td className="py-2 px-6 text-center">
                             {renderFaceCapture(item, 'check-out')}
                           </td>
                         </>
                       )}
                    </tr>
                 ))
             ) : (
                <tr>
                    <td colSpan={hasFaceAttendance ? 8 : 6} className="text-center py-4">
                        <div className="flex flex-col items-center justify-center">
                            <img
                                src="/images/emptyAttendance.png"
                                alt="No Records Found"
                                className="w-[320px] h-auto mb-2"
                            />
                            <h3 className="text-[22px] font-bold text-[#000000] mb-2" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                                No Records found
                            </h3>
                            <p className="text-[14px] text-[#B0B0B0] mb-2 font-medium" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                                There are no records to show at the moment.
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              Debug info - Total API records: {attendanceData.length}
                            </p>
                        </div>
                    </td>
                </tr>
             )}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center mt-6 pt-4 text-sm text-gray-500 gap-4">
         <div className="text-center md:text-left">
             Showing {totalItems === 0 ? 0 : indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)} Of {totalItems}
         </div>

         <div className="flex items-center justify-center gap-2">
             <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className={`flex items-center gap-1 px-2 py-1 transition-colors ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-[#707070] hover:text-gray-900'}`}
             >
                 <ArrowLeft size={14} />
                 <span className="hidden sm:inline">Previous</span>
             </button>

             <div className="flex gap-1">
                 {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg ${currentPage === number
                            ? 'bg-[#7D1EDB] text-white font-medium'
                            : 'text-[#1E1E1E] hover:bg-gray-100'
                        }`}
                    >
                        {number}
                    </button>
                 ))}
             </div>

             <button
                onClick={handleNext}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`flex items-center gap-1 px-2 py-1 transition-colors ${currentPage === totalPages || totalPages === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-[#1E1E1E] hover:text-gray-900'}`}
             >
                 <span className="hidden sm:inline">Next</span>
                 <ArrowRight size={14} />
             </button>
         </div>
          <div className="hidden lg:block"></div>
      </div>

      <MarkAttendanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAttendance}
      />
      <AttendanceSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />
      <AttendanceErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        message={errorMessage}
      />

      {selectedFaceRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedFaceRecord(null)}
              className="absolute right-4 top-4 rounded-full p-1 text-[#6B7280] transition hover:bg-gray-100 hover:text-black"
            >
              <X size={18} />
            </button>

            <div className="mb-4">
              <p className="text-lg font-semibold text-[#111827]">
                {selectedFaceRecord.previewLabel} Preview
              </p>
              <p className="mt-1 text-sm text-[#6B7280]">
                {selectedFaceRecord.name} • {selectedFaceRecord.empId}
              </p>
              <p className="text-sm text-[#6B7280]">{selectedFaceRecord.date}</p>
            </div>

            <div className="overflow-hidden rounded-2xl bg-[#F3F4F6]">
              <img
                src={selectedFaceRecord.previewImage}
                alt={`${selectedFaceRecord.name} ${selectedFaceRecord.previewLabel}`}
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceList;
