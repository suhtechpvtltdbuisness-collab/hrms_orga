import React, { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight, FileText, ArrowLeft, ArrowRight } from 'lucide-react';
import FilterDropdown from '../../../components/ui/FilterDropdown';
import { useNavigate } from 'react-router-dom';
import MarkAttendanceModal from './MarkAttendanceModal';
import AttendanceSuccessModal from './AttendanceSuccessModal';
import AttendanceErrorModal from './AttendanceErrorModal';

const AttendanceList = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  // Mock Data
  const [attendanceData] = useState([
    { srNo: "01", name: "Alice John", empId: "EMP-123", status: "Present", date: "01/02/2026", leaveType: "-" },
    { srNo: "02", name: "Mike Miller", empId: "EMP-124", status: "Absent", date: "01/02/2026", leaveType: "Sick Leave" },
    { srNo: "03", name: "John Smith", empId: "EMP-125", status: "Present", date: "01/02/2026", leaveType: "-" },
    { srNo: "04", name: "Carol Smith", empId: "EMP-126", status: "Absent", date: "01/02/2026", leaveType: "Sick Leave" },
    { srNo: "05", name: "Carol Smith", empId: "EMP-127", status: "Present", date: "01/02/2026", leaveType: "-" },
    { srNo: "06", name: "Carol Smith", empId: "EMP-128", status: "Present", date: "01/02/2026", leaveType: "-" },
    { srNo: "07", name: "Carol Smith", empId: "EMP-129", status: "Present", date: "01/02/2026", leaveType: "-" },
    { srNo: "08", name: "Carol Smith", empId: "EMP-120", status: "Present", date: "01/02/2026", leaveType: "-" },
    { srNo: "09", name: "Carol Smith", empId: "EMP-121", status: "Present", date: "01/02/2026", leaveType: "-" },
    { srNo: "10", name: "Carol Smith", empId: "EMP-122", status: "Present", date: "01/02/2026", leaveType: "-" },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [filters, setFilters] = useState({
    name: '',
    leaveType: '',
    status: ''
  });


  const NAME_OPTIONS = ["All", "Alice John", "Mike Miller", "John Smith", "Carol Smith", "Nisha Gupta", "Riya Singh", "Anita Johns"];
  const LEAVE_TYPE_OPTIONS = ["All", "Sick Leave", "Personal Leave"];
  const STATUS_OPTIONS = ["All", "Present", "Absent", "Leave", "Holiday", "Half Day"];

  // Colors
  const COLORS = {
    purple: "#7D1EDB",
    greenBg: "#E4F8D2",
    greenFont: "#76DB1E",
    redBg: "#FFDBCC",
    redFont: "#DB471E",
  };

  const getStatusStyle = (status) => {
    if (status === 'Present') {
      return { backgroundColor: COLORS.greenBg, color: COLORS.greenFont };
    } else if (status === 'Absent') {
      return { backgroundColor: COLORS.redBg, color: COLORS.redFont };
    }
    return { backgroundColor: '#F3F4F6', color: '#6B7280' };
  };

  /* Filter Logic */
  const filteredData = React.useMemo(() => {
    return attendanceData.filter(item => {
        const matchesName = !filters.name || filters.name === 'All' || item.name === filters.name;
        const matchesType = !filters.leaveType || filters.leaveType === 'All' || item.leaveType === filters.leaveType;
        const matchesStatus = !filters.status || filters.status === 'All' || item.status === filters.status;
        return matchesName && matchesType && matchesStatus;
    });
  }, [attendanceData, filters]);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSaveAttendance = (data) => {
      console.log("Marked Attendance Data:", data);
      setIsModalOpen(false); // Close the Mark Attendance modal
      setIsSuccessModalOpen(true); // Open the Success modal
      // To test Error Modal: uncomment below and comment above line
      // setIsErrorModalOpen(true);
  };

  return (
    <div className="bg-white px-4 sm:px-4 md:px-6 py-4 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-9rem)] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-10rem)] xl:h-[calc(100vh-11rem)] flex flex-col border border-[#D9D9D9] font-sans" style={{ fontFamily: 'Poppins, sans-serif' }}>
      
      <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
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

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
        <h1 className="text-xl font-semibold text-gray-800">Attendance</h1>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Mark Attendance Button */}
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

          {/* Add Attendance Button */}
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

      {/* Filters Section */}
      <div className="flex flex-wrap gap-4 mb-6">

        <div className="flex flex-col gap-1">
            <span className="text-[14px] font-normal text-[#1E1E1E]" style={{ fontFamily: 'Inter, sans-serif' }}>Employee Name</span>
            <FilterDropdown
                label="Employee Name"
                options={NAME_OPTIONS}
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

      {/* Table Section */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto border border-[#CECECE] rounded-lg">
        <table className="w-full table-fixed min-w-[800px]">
          <thead className="sticky top-0 bg-white z-10">
            <tr className="text-left border-b border-[#CECECE]" style={{ fontFamily: 'Poppins, sans-serif' }}>
               <th className="py-3 px-6 w-[80px] text-[12px] font-normal text-[#757575] bg-white">
                 Sr No.
               </th>
               <th className="py-3 px-6 w-[200px] text-[12px] font-normal text-[#757575] tracking-wider bg-white">
                 EMP Name
               </th>
               <th className="py-3 px-6 w-[150px] text-[12px] font-normal text-[#757575] tracking-wider bg-white">
                 EMP ID
               </th>
               <th className="py-3 px-6 w-[150px] text-[12px] font-normal text-[#757575] tracking-wider bg-white text-center">
                 Status
               </th>
               <th className="py-3 px-6 w-[180px] text-[12px] font-normal text-[#757575] tracking-wider bg-white text-center">
                 Attendance Date
               </th>
               <th className="py-3 px-6 w-[150px] text-[12px] font-normal text-[#757575] tracking-wider bg-white text-center">
                 Leave Type
               </th>
            </tr>
          </thead>
          <tbody style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
             {currentItems.length > 0 ? (
                 currentItems.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 last:border-0 transition-colors">
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
                    </tr>
                 ))
             ) : (
                <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500">
                        No attendance records found
                    </td>
                </tr>
             )}
          </tbody>
        </table>
      </div>


       {/* Pagination Footer */}
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
      />
    </div>
  );
};

export default AttendanceList;
