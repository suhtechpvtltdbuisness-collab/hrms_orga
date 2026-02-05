import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react';
import FilterDropdown from '../../../components/ui/FilterDropdown';

const EnergyPointLogList = () => {
    const navigate = useNavigate();

    // Mock Data
    const energyPointLogs = [
        { id: 1, srNo: "01", name: "Alice John", user: "alicejohn@123", rule: "On Sales Order Submission", status: "Auto", points: 10, referenceDocument: "Sales Order", action: "View Reference" },
        { id: 2, srNo: "02", name: "Alice John", user: "alicejohn@123", rule: "On Sales Order Submission", status: "Auto", points: 10, referenceDocument: "Sales Order", action: "View Reference" },
        { id: 3, srNo: "03", name: "Mike Miller", user: "Mikemiller@12", rule: "On item creation", status: "Auto", points: 5, referenceDocument: "Item", action: "View Reference" },
        { id: 4, srNo: "04", name: "Carol White", user: "Carolwhite@21", rule: "On task completion", status: "Review", points: 10, referenceDocument: "", action: "View Reference" },
        { id: 5, srNo: "05", name: "Alice John", user: "alicejohn@123", rule: "On task completion", status: "Auto", points: 5, referenceDocument: "Task", action: "View Reference" },
        { id: 6, srNo: "06", name: "Alice John", user: "alicejohn@123", rule: "On task completion", status: "Auto", points: 2, referenceDocument: "Task", action: "View Reference" },
        { id: 7, srNo: "07", name: "Alice John", user: "alicejohn@123", rule: "On customer creation", status: "Auto", points: 10, referenceDocument: "Customer", action: "View Reference" },
        { id: 8, srNo: "08", name: "Alice John", user: "alicejohn@123", rule: "On customer creation", status: "Auto", points: 5, referenceDocument: "Customer", action: "View Reference" },
        { id: 9, srNo: "09", name: "Alice John", user: "alicejohn@123", rule: "On lead creation", status: "Auto", points: 2, referenceDocument: "Lead", action: "View Reference" },
        { id: 10, srNo: "10", name: "Alice John", user: "alicejohn@123", rule: "On lead creation", status: "Auto", points: 2, referenceDocument: "Lead", action: "View Reference" },
    ];

     // State for checkbox selection
     const [selectedRows, setSelectedRows] = useState([]);
     const [filters, setFilters] = useState({
        name: '',
        user: '',
        rule: '',
        referenceDocument: ''
     });

     // Options for filters
     const NAME_OPTIONS = ["Alice John", "Carol White", "Mike Miller", "Nisha Gupta"];
     const USER_OPTIONS = ["alicejohn@123", "Carolwhite@21", "Mikemiller@12"];
     const RULE_OPTIONS = ["On task completion", "On Purchase Order Submission", "On Sales Order Submission", "On converting opportunity", "On lead creation", "On supply creation", "On customer creation", "On item creation"];
     const REF_DOC_OPTIONS = ["Sales Order", "Item", "Task", "Customer", "Lead"];


     // Pagination State
     const [currentPage, setCurrentPage] = useState(1);
     const itemsPerPage = 10;

     // Reset pagination when filters change
     React.useEffect(() => {
         setCurrentPage(1);
     }, [filters]);

     // Filter Data
     const filteredLogs = energyPointLogs.filter(log => {
        return (
            (filters.name === '' || log.name === filters.name) &&
            (filters.user === '' || log.user === filters.user) &&
            (filters.rule === '' || log.rule === filters.rule) &&
            (filters.referenceDocument === '' || log.referenceDocument === filters.referenceDocument)
        );
     });

     // Calculate Pagination
     const indexOfLastItem = currentPage * itemsPerPage;
     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
     const currentItems = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);
     const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

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
             const allIds = energyPointLogs.map(item => item.id);
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
                <span className="text-[#6B7280]">Energy Point Log List</span>
            </div>

            {/* Header */}
            <div className="mb-4 shrink-0">
                <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Energy Point Log List</h1>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-4">
                 <FilterDropdown
                    label="Name"
                    options={NAME_OPTIONS}
                    value={filters.name}
                    onChange={(val) => setFilters(prev => ({ ...prev, name: val }))}
                    minWidth="140px"
                    buttonTextClassName="flex-1 text-center"
                />
                 <FilterDropdown
                    label="User"
                    options={USER_OPTIONS}
                    value={filters.user}
                    onChange={(val) => setFilters(prev => ({ ...prev, user: val }))}
                    minWidth="160px"
                    buttonTextClassName="flex-1 text-center"
                />
                 <FilterDropdown
                    label="Rule"
                    options={RULE_OPTIONS}
                    value={filters.rule}
                    onChange={(val) => setFilters(prev => ({ ...prev, rule: val }))}
                    minWidth="245px"
                    buttonTextClassName="flex-1 text-center"
                />
                 <FilterDropdown
                    label="Reference Document"
                    options={REF_DOC_OPTIONS}
                    value={filters.referenceDocument}
                    onChange={(val) => setFilters(prev => ({ ...prev, referenceDocument: val }))}
                    minWidth="200px"
                    buttonTextClassName="flex-1 text-center"
                />
            </div>

            {/* Table */}
            <div className="flex-1 min-h-0 overflow-y-auto border border-[#CECECE] rounded-lg">
                <table className="w-full relative border-collapse">
                    <thead className="sticky top-0 z-10 bg-white">
                        <tr className="text-left text-[14px] font-popins border-b border-[#CECECE]">
                            <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 w-[5%]">
                                <input 
                                    type="checkbox" 
                                    className="w-4 h-4 rounded border-[#1F1F1F] text-[#7D1EDB] focus:ring-[#7D1EDB]"
                                    checked={energyPointLogs.length > 0 && selectedRows.length === energyPointLogs.length}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 w-[10%]">
                                Sr No.
                            </th>
                             <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 w-[20%]">
                                User
                            </th>
                            <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 w-[15%] text-center">
                                Status
                            </th>
                            <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 w-[10%] text-center">
                                Points
                            </th>
                            <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 w-[20%] text-center">
                                Reference document
                            </th>
                            <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 w-[20%] text-right">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((log, index) => (
                            <tr key={log.id} className="hover:bg-gray-50 transition-colors text-[14px] font-medium text-[#1E1E1E]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                                <td className="py-3 px-6">
                                    <input 
                                        type="checkbox" 
                                        className="w-4 h-4 rounded border-[#1F1F1F] text-[#7D1EDB] focus:ring-[#7D1EDB]" 
                                        checked={selectedRows.includes(log.id)}
                                        onChange={() => handleSelectRow(log.id)}
                                    />
                                </td>
                                <td className="py-3 px-6">
                                    {log.srNo}
                                </td>
                                <td className="py-3 px-6">
                                    {log.user}
                                </td>
                                <td className="py-3 px-6 text-center">
                                    <span className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${log.status === 'Auto' ? 'bg-[#E4F8D2] text-[#76DB1E]' : 'bg-[#CCEDFF] text-[#1EC2DB]'}`}>
                                        {log.status}
                                    </span>
                                </td>
                                <td className="py-3 px-6 text-center">
                                    {log.points}
                                </td>
                                <td className="py-3 px-6 text-center">
                                    {log.referenceDocument}
                                </td>
                                <td className="py-3 px-6 text-right">
                                    <button className="text-[#7D1EDB] border border-[#7D1EDB] px-3 py-1 rounded-lg text-sm hover:bg-[#7D1EDB] hover:text-white transition-colors">
                                        {log.action}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center mt-4 px-2 shrink-0 text-sm text-gray-500 gap-4">
                <div className="text-center md:text-left font-inter">
                    Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredLogs.length)} Of {filteredLogs.length}
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

export default EnergyPointLogList;
