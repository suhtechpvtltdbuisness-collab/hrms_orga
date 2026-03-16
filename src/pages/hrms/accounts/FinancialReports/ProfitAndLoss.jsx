import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ArrowLeft, ChevronRight } from 'lucide-react';
import noRecordsIllustration from '../../../../assets/no-records.svg';

const ProfitAndLoss = () => {
    const navigate = useNavigate();

    const [filters, setFilters] = useState({
        dateRange: 'Date Range',
        department: 'Department',
        costCenter: 'Cost Center'
    });

    const filterOptions = {
        dateRange: ['Jan-March 2026', 'April-June 2026', 'July-Sept 2026'],
        department: ['All Departments', 'IT Department', 'Sales & Marketing', 'Operations'],
        costCenter: ['Global HQ', 'Administration', 'Finance & Accounts', 'Operations']
    };

    const [openFilter, setOpenFilter] = useState(null);

    const toggleFilter = (filter) => {
        setOpenFilter(openFilter === filter ? null : filter);
    };

    const handleFilterSelect = (filter, value) => {
        setFilters(prev => ({ ...prev, [filter]: value }));
        setOpenFilter(null);
    };

    return (
        <div className="bg-white px-2 sm:px-6 md:px-8 py-2 sm:py-6 mx-0 sm:mx-4 mt-2 sm:mt-4 mb-4 rounded-xl h-[calc(100vh-8rem)] md:h-[calc(100vh-10rem)] overflow-y-auto" style={{ fontFamily: 'Poppins, sans-serif' }}>
            
            {/* Breadcrumb */}
            <div className="flex items-center text-xs sm:text-sm mb-4">
                <div className="flex items-center gap-1 cursor-pointer" onClick={() => navigate('/hrms')}>
                    <ArrowLeft size={12} className="text-[#8B8D97]" />
                    <span className="text-[#7D1EDB] font-medium">HRMS Dashboard</span>
                </div>
                <ChevronRight size={14} className="mx-1 text-[#8B8D97]" />
                <span className="text-[#667085]">Profit & Loss</span>
            </div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 
                    className="text-gray-900" 
                    style={{ 
                        fontFamily: "'Nunito Sans', sans-serif", 
                        fontWeight: 600, 
                        fontSize: '20px', 
                        color: '#494949',
                        lineHeight: '100%',
                        letterSpacing: '0%',
                        width: 'auto',
                        height: 'auto'
                    }}
                >
                    Profit & Loss
                </h1>
                <button 
                    className="text-white font-medium transition-colors flex items-center justify-center"
                    style={{
                        width: '165px',
                        height: '48px',
                        padding: '10px 16px',
                        gap: '8px',
                        borderRadius: '26px',
                        borderWidth: '1px',
                        borderColor: '#F5F5F5',
                        background: '#7D1EDB',
                        fontSize: '14px', // Standard size for 48px height button
                        opacity: 1
                    }}
                >
                    Generate Report
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 sm:gap-4 mb-8">
                {Object.keys(filters).map((filterKey) => (
                    <div key={filterKey} className="relative">
                        <button
                            onClick={() => toggleFilter(filterKey)}
                            className="flex items-center justify-between gap-2 px-3 sm:px-4 py-2 bg-[#EEECFF] rounded-lg min-w-[120px] sm:min-w-[140px]"
                            style={{
                                color: '#7D1EDB',
                                fontFamily: "'Poppins', sans-serif",
                                fontWeight: 400,
                                fontSize: '14px',
                                lineHeight: '140%',
                                letterSpacing: '0%'
                            }}
                        >
                            {filters[filterKey]}
                            <ChevronDown size={14} className={`transition-transform text-[#7D1EDB] ${openFilter === filterKey ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {openFilter === filterKey && (
                            <div 
                                className="absolute top-full left-0 mt-1 bg-white border border-gray-100 rounded-[8px] z-50 py-1"
                                style={{
                                    width: 'max-content',
                                    minWidth: '155px',
                                    boxShadow: '0px 4px 14px 0px rgba(0, 0, 0, 0.1)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1px'
                                }}
                            >
                                {filterOptions[filterKey].map((option) => (
                                    <div
                                        key={option}
                                        className="px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 cursor-pointer"
                                        style={{
                                            fontFamily: "'Poppins', sans-serif",
                                            whiteSpace: 'nowrap'
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

            {/* Main Content Area (Full Responsive Layout) */}
            <div 
                className="border border-[#CECECE] rounded-[8px] bg-white flex flex-col overflow-hidden w-full"
                style={{ 
                    padding: '16px',
                    gap: '10px',
                    margin: '0',
                    minHeight: '482px'
                }}
            >
                {/* Inner Title Section */}
                <h2 className="text-[14px] sm:text-[16px] font-semibold text-[#1E1E1E]">Profit & Loss</h2>

                {/* Table Header Section */}
                <div className="border border-[#E4E0E0] rounded-lg overflow-hidden flex flex-col flex-1">
                    <div className="grid grid-cols-5 text-[12px] sm:text-[14px] text-[#666666] bg-white">
                        <div className="px-4 py-3 font-normal">Department</div>
                        <div className="px-4 py-3 font-normal text-center">Revenue</div>
                        <div className="px-4 py-3 font-normal text-center">Direct Expenses</div>
                        <div className="px-4 py-3 font-normal text-center">Indirect Expenses</div>
                        <div className="px-4 py-3 font-normal text-center">Net Profit</div>
                    </div>
                    
                    {/* Empty State Body Area */}
                    <div className="flex flex-col items-center justify-center flex-1 bg-white border-t border-[#E4E0E0] min-h-[300px]">
                        <img 
                            src={noRecordsIllustration} 
                            alt="No Data found" 
                            className="mb-4"
                            style={{ 
                                width: '100%',
                                maxWidth: '352.8px',
                                height: 'auto' 
                            }}
                        />
                        <h3 
                            className="text-center mb-1"
                            style={{
                                fontFamily: "'Nunito Sans', sans-serif",
                                fontWeight: 700,
                                fontSize: '24px',
                                color: '#000000',
                                lineHeight: '100%'
                            }}
                        >
                            No Data found
                        </h3>
                        <p 
                            className="text-center font-normal"
                            style={{
                                fontFamily: "'Nunito Sans', sans-serif",
                                fontWeight: 500,
                                fontSize: '16px',
                                color: '#B0B0B0',
                                lineHeight: '100%'
                            }}
                        >
                            There is no data to show at the moment.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfitAndLoss;
