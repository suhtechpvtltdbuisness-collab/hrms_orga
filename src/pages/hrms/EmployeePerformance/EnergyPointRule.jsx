import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, ArrowRight, Plus } from 'lucide-react';

const EnergyPointRule = () => {
    const navigate = useNavigate();

    // Mock Data
    const energyPointRules = [
        { id: 1, srNo: "01", name: "On task completion", status: "Enabled", enabled: true, ruleName: "On task completion", referenceDocument: "Task" },
        { id: 2, srNo: "02", name: "On purchase order submission", status: "Enabled", enabled: true, ruleName: "On purchase order...", referenceDocument: "On purchase.." },
        { id: 3, srNo: "03", name: "On sales order submission", status: "Disabled", enabled: false, ruleName: "On sales order su...", referenceDocument: "On sales order.." },
        { id: 4, srNo: "04", name: "On converting opportunity", status: "Disabled", enabled: false, ruleName: "On converting oppo...", referenceDocument: "On converting o.." },
        { id: 5, srNo: "05", name: "On lead creation", status: "Enabled", enabled: true, ruleName: "On lead creation", referenceDocument: "On lead creation" },
        { id: 6, srNo: "06", name: "On supply creation", status: "Enabled", enabled: true, ruleName: "On supply creation", referenceDocument: "On supply creat.." },
        { id: 7, srNo: "07", name: "On customer creation", status: "Disabled", enabled: false, ruleName: "On customer creat..", referenceDocument: "On customer cre.." },
        { id: 8, srNo: "08", name: "On item creation", status: "Disabled", enabled: false, ruleName: "On item creat..", referenceDocument: "On item cre.." },
    ];

     // State for checkbox selection
     const [selectedRows, setSelectedRows] = useState([]);

     // Pagination State
     const [currentPage, setCurrentPage] = useState(1);
     const itemsPerPage = 10;

     // Calculate Pagination
     const indexOfLastItem = currentPage * itemsPerPage;
     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
     const currentItems = energyPointRules.slice(indexOfFirstItem, indexOfLastItem);
     const totalPages = Math.ceil(energyPointRules.length / itemsPerPage);

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
             const allIds = energyPointRules.map(item => item.id);
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
                <span className="text-[#6B7280]">Energy Point Rule</span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-4 shrink-0">
                <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Energy Point Rule</h1>
                
                <button
                    className="flex items-center justify-center gap-2 rounded-full py-2 px-4 text-white font-normal hover:bg-purple-700 transition-colors bg-[#7D1EDB]"
                    onClick={() => navigate('/hrms/energy-point-rule/new')}
                >
                    <span className='text-[16px] font-normal text-white font-popins'>Add New Energy Point Rule</span>
                    <Plus size={18} />
                </button>
            </div>

            {/* Table */}
            <div className="flex-1 min-h-0 overflow-y-auto border border-[#CECECE] rounded-lg">
                <table className="w-full relative border-collapse">
                    <thead className="sticky top-0 z-10 bg-white">
                        <tr className="text-center text-[14px] font-popins border-b border-[#CECECE]">
                            <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 w-[5%] text-left">
                                <input 
                                    type="checkbox" 
                                    className="w-4 h-4 rounded border-[#1F1F1F] text-[#7D1EDB] focus:ring-[#7D1EDB]"
                                    checked={energyPointRules.length > 0 && selectedRows.length === energyPointRules.length}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 w-[10%] text-center">
                                Sr No.
                            </th>
                             <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 w-[25%] text-center">
                                Name
                            </th>
                            <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 w-[10%] text-center">
                                Status
                            </th>
                            <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 w-[5%] text-center">
                                Enabled
                            </th>
                            <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 w-[25%] text-center">
                                Rule Name
                            </th>
                            <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 w-[25%] text-center">
                                Reference document
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((rule, index) => (
                            <tr key={rule.id} className="hover:bg-gray-50 transition-colors text-[14px] font-medium text-[#1E1E1E]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                                <td className="py-3 px-6 text-left">
                                    <input 
                                        type="checkbox" 
                                        className="w-4 h-4 rounded border-[#1F1F1F] text-[#7D1EDB] focus:ring-[#7D1EDB]" 
                                        checked={selectedRows.includes(rule.id)}
                                        onChange={() => handleSelectRow(rule.id)}
                                    />
                                </td>
                                <td className="py-3 px-6 text-center">
                                    {rule.srNo}
                                </td>
                                <td className="py-3 px-6 text-center">
                                    {rule.name}
                                </td>
                                <td className="py-3 px-6 text-center">
                                    <span className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${rule.status === 'Enabled' ? 'bg-[#E4F8D2] text-[#76DB1E]' : 'bg-[#FFDFD2] text-[#FF5E5E]'}`}>
                                        {rule.status}
                                    </span>
                                </td>
                                <td className="py-3 px-6 text-center">
                                     <div className="flex items-center justify-center">
                                        <input 
                                            type="checkbox" 
                                            readOnly
                                            className="w-4 h-4 rounded border-[#1F1F1F] text-[#1F1F1F] focus:ring-0 cursor-default"
                                            // checked={rule.enabled}
                                        />
                                    </div>
                                </td>
                                <td className="py-3 px-6 text-center">
                                    {rule.ruleName}
                                </td>
                                <td className="py-3 px-6 text-center">
                                    {rule.referenceDocument}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center mt-4 px-2 shrink-0 text-sm text-gray-500 gap-4">
                <div className="text-center md:text-left font-inter">
                    Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, energyPointRules.length)} Of {energyPointRules.length}
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

export default EnergyPointRule;
