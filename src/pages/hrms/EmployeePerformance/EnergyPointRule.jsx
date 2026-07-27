import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, ArrowRight, Plus } from 'lucide-react';
import { energyPointService } from '../../../service';

const EnergyPointRule = () => {
    const navigate = useNavigate();
    const [energyPointRules, setEnergyPointRules] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const itemsPerPage = 10;

    const loadRules = useCallback(async () => {
        setLoading(true);
        setError('');
        const res = await energyPointService.getRules({
            page: currentPage,
            limit: itemsPerPage,
        });
        if (res.success) {
            setEnergyPointRules(res.data?.rules || []);
            setTotal(res.data?.total || 0);
            setTotalPages(res.data?.totalPages || 1);
        } else {
            setError(res.message || 'Failed to load rules');
            setEnergyPointRules([]);
        }
        setLoading(false);
    }, [currentPage]);

    useEffect(() => {
        loadRules();
    }, [loadRules]);

    const handleToggleEnabled = async (rule) => {
        const res = await energyPointService.updateRule(rule.id, {
            enabled: !rule.enabled,
        });
        if (res.success) {
            loadRules();
        } else {
            setError(res.message || 'Failed to update rule');
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage((p) => p + 1);
    };

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage((p) => p - 1);
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedRows(energyPointRules.map((item) => item.id));
        } else {
            setSelectedRows([]);
        }
    };

    const handleSelectRow = (id) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
        );
    };

    const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
    const indexOfLastItem = Math.min(currentPage * itemsPerPage, total);

    return (
        <div className="bg-white px-4 sm:px-4 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col font-popins" style={{ fontFamily: 'Poppins, sans-serif' }}>
            
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

            {error && <div className="mb-3 text-sm text-red-500 shrink-0">{error}</div>}

            <div className="flex-1 min-h-0 overflow-y-auto border border-[#CECECE] rounded-lg">
                {loading ? (
                    <div className="flex items-center justify-center h-40 text-[#757575]">Loading...</div>
                ) : (
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
                            <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 w-[10%] text-center">Sr No.</th>
                             <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 w-[25%] text-center">Name</th>
                            <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 w-[10%] text-center">Status</th>
                            <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 w-[5%] text-center">Enabled</th>
                            <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 w-[25%] text-center">Rule Name</th>
                            <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 w-[25%] text-center">Reference document</th>
                        </tr>
                    </thead>
                    <tbody>
                        {energyPointRules.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="py-10 text-center text-[#757575]">No energy point rules found</td>
                            </tr>
                        ) : energyPointRules.map((rule) => (
                            <tr key={rule.id} className="hover:bg-gray-50 transition-colors text-[14px] font-medium text-[#1E1E1E]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                                <td className="py-3 px-6 text-left">
                                    <input 
                                        type="checkbox" 
                                        className="w-4 h-4 rounded border-[#1F1F1F] text-[#7D1EDB] focus:ring-[#7D1EDB]" 
                                        checked={selectedRows.includes(rule.id)}
                                        onChange={() => handleSelectRow(rule.id)}
                                    />
                                </td>
                                <td className="py-3 px-6 text-center">{rule.srNo}</td>
                                <td className="py-3 px-6 text-center">{rule.name}</td>
                                <td className="py-3 px-6 text-center">
                                    <span className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${rule.status === 'Enabled' ? 'bg-[#E4F8D2] text-[#76DB1E]' : 'bg-[#FFDFD2] text-[#FF5E5E]'}`}>
                                        {rule.status}
                                    </span>
                                </td>
                                <td className="py-3 px-6 text-center">
                                     <div className="flex items-center justify-center">
                                        <input 
                                            type="checkbox" 
                                            className="w-4 h-4 rounded border-[#1F1F1F] text-[#1F1F1F] focus:ring-0 cursor-pointer"
                                            checked={Boolean(rule.enabled)}
                                            onChange={() => handleToggleEnabled(rule)}
                                        />
                                    </div>
                                </td>
                                <td className="py-3 px-6 text-center">{rule.ruleName}</td>
                                <td className="py-3 px-6 text-center">{rule.referenceDocument || '—'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center mt-4 px-2 shrink-0 text-sm text-gray-500 gap-4">
                <div className="text-center md:text-left font-inter">
                    Showing {total === 0 ? 0 : indexOfFirstItem + 1}-{indexOfLastItem} Of {total}
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
                        disabled={currentPage === totalPages || totalPages === 0}
                        className={`flex items-center gap-1 text-sm font-inter ${currentPage === totalPages || totalPages === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-gray-700'}`}
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
