import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react';

const ShiftAssignment = () => {
    const navigate = useNavigate();

    // Mock Data
    const shiftAssignments = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        name: i % 3 === 0 ? "Alice John" : i % 3 === 1 ? "Carol White" : "Mike Miller",
        status: "Submitted",
        shiftType: "Day",
        date: "26/01/2026"
    }));

     // State for checkbox selection
     const [selectedRows, setSelectedRows] = useState([]);

     // Pagination State
     const [currentPage, setCurrentPage] = useState(1);
     const itemsPerPage = 10;

     // Calculate Pagination
     const indexOfLastItem = currentPage * itemsPerPage;
     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
     const currentItems = shiftAssignments.slice(indexOfFirstItem, indexOfLastItem);
     const totalPages = Math.ceil(shiftAssignments.length / itemsPerPage);

     // Pagination Handlers
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


     // Handle Select All
     const handleSelectAll = (e) => {
         if (e.target.checked) {
             const allIds = shiftAssignments.map(item => item.id);
             setSelectedRows(allIds);
         } else {
             setSelectedRows([]);
         }
     };
 
     // Handle Individual Selection
     const handleSelectRow = (id) => {
        setSelectedRows(prev => {
             if (prev.includes(id)) {
                 return prev.filter(rowId => rowId !== id);
             } else {
                 return [...prev, id];
             }
         });
     };

    return (
        <div className="bg-white px-4 sm:px-4 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col font-popins" style={{ fontFamily: 'Poppins, sans-serif' }}>
            
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 shrink-0">
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
                <span className="text-[#6B7280]">Shift Assignment</span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-4 shrink-0">
                <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Shift Assignment</h1>

                <button
                    className="flex items-center justify-center gap-2 py-2 px-4 rounded-full text-white font-medium hover:bg-purple-700 transition-colors bg-[#7D1EDB]"
                >
                    <span className='text-[16px] font-medium text-white font-popins'>Save</span>
                </button>
            </div>

            {/* Table */}
            <div className="flex-1 min-h-0 overflow-y-auto border border-[#CECECE] rounded-lg">
                <table className="w-full relative border-collapse">
                    <thead className="sticky top-0 z-10 bg-white">
                        <tr className="text-left text-[14px] font-popins border-b border-[#CECECE]">
                            <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 w-[10%]">
                                <input 
                                    type="checkbox" 
                                    className="w-4 h-4 rounded border-[#1F1F1F] text-[#7D1EDB] focus:ring-[#7D1EDB]"
                                    checked={shiftAssignments.length > 0 && selectedRows.length === shiftAssignments.length}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 w-[25%]">
                                Employee Name
                            </th>
                            <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 w-[20%] text-center">
                                Status
                            </th>
                            <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 w-[20%] text-center">
                                Shift Type
                            </th>
                            <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 w-[20%] text-right">
                                Date
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((shift, index) => (
                            <tr key={shift.id} className="hover:bg-gray-50 transition-colors text-[14px] font-medium text-[#1E1E1E]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                                <td className="py-3 px-6">
                                    <input 
                                        type="checkbox" 
                                        className="w-4 h-4 rounded border-[#1F1F1F] text-[#7D1EDB] focus:ring-[#7D1EDB]" 
                                        checked={selectedRows.includes(shift.id)}
                                        onChange={() => handleSelectRow(shift.id)}
                                    />
                                </td>
                                <td className="py-3 px-6">
                                    {shift.name}
                                </td>
                                <td className="py-3 px-6 text-center">
                                    <span className="inline-block px-2 py-1 bg-[#E4F8D2] text-[#76DB1E] rounded-full text-sm font-medium">
                                        {shift.status}
                                    </span>
                                </td>
                                <td className="py-3 px-6 text-center">
                                    {shift.shiftType}
                                </td>
                                <td className="py-3 px-6 text-right">
                                    {shift.date}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center mt-4 px-2 shrink-0 text-sm text-gray-500 gap-4">
                <div className="text-center md:text-left font-inter">
                    Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, shiftAssignments.length)} Of {shiftAssignments.length}
                </div>

                <div className="flex items-center justify-center md:justify-end lg:justify-center gap-2">
                    <button 
                        onClick={handlePrev}
                        disabled={currentPage === 1}
                        className={`flex items-center gap-1 text-sm font-inter ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <ArrowLeft size={16} /> Previous
                    </button>
                    
                    <div className="flex gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                            <button
                                key={number}
                                onClick={() => paginate(number)}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium ${
                                    currentPage === number
                                        ? 'bg-[#7D1EDB] text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                {number}
                            </button>
                        ))}
                    </div>

                    <button 
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className={`flex items-center gap-1 text-sm font-inter ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Next <ArrowRight size={16} />
                    </button>
                </div>
                
                <div className="hidden lg:block"></div>
            </div>
        </div>
    );
};

export default ShiftAssignment;
