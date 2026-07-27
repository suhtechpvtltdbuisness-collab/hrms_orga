import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react';
import FilterDropdown from '../../../components/ui/FilterDropdown';
import { energyPointService } from '../../../service';

const EnergyPointLogList = () => {
    const navigate = useNavigate();
    const [energyPointLogs, setEnergyPointLogs] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [filters, setFilters] = useState({
        name: '',
        user: '',
        rule: '',
        referenceDocument: '',
    });
    const [nameOptions, setNameOptions] = useState([]);
    const [userOptions, setUserOptions] = useState([]);
    const [ruleOptions, setRuleOptions] = useState([]);
    const [refDocOptions, setRefDocOptions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const itemsPerPage = 10;

    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

    const loadFilterOptions = useCallback(async () => {
        const [logsRes, rulesRes] = await Promise.all([
            energyPointService.getLogs({ page: 1, limit: 200 }),
            energyPointService.getRules({ page: 1, limit: 200 }),
        ]);
        if (logsRes.success) {
            const logs = logsRes.data?.logs || [];
            setNameOptions([...new Set(logs.map((l) => l.name).filter(Boolean))]);
            setUserOptions([...new Set(logs.map((l) => l.user).filter(Boolean))]);
            setRefDocOptions([
                ...new Set(
                    logs
                        .map((l) => l.referenceDocument || l.referenceDocumentType)
                        .filter(Boolean),
                ),
            ]);
        }
        if (rulesRes.success) {
            setRuleOptions(
                (rulesRes.data?.rules || []).map((r) => r.ruleName).filter(Boolean),
            );
        }
    }, []);

    const loadLogs = useCallback(async () => {
        setLoading(true);
        setError('');
        const res = await energyPointService.getLogs({
            page: currentPage,
            limit: itemsPerPage,
            name: filters.name || undefined,
            user: filters.user || undefined,
            rule: filters.rule || undefined,
            referenceDocument: filters.referenceDocument || undefined,
        });
        if (res.success) {
            setEnergyPointLogs(res.data?.logs || []);
            setTotal(res.data?.total || 0);
            setTotalPages(res.data?.totalPages || 1);
        } else {
            setError(res.message || 'Failed to load logs');
            setEnergyPointLogs([]);
        }
        setLoading(false);
    }, [currentPage, filters]);

    useEffect(() => {
        loadFilterOptions();
    }, [loadFilterOptions]);

    useEffect(() => {
        loadLogs();
    }, [loadLogs]);

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage((p) => p + 1);
    };

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage((p) => p - 1);
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedRows(energyPointLogs.map((item) => item.id));
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
                <span className="text-[#6B7280]">Energy Point Log List</span>
            </div>

            <div className="mb-4 shrink-0">
                <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Energy Point Log List</h1>
            </div>

            {error && <div className="mb-3 text-sm text-red-500 shrink-0">{error}</div>}

            <div className="flex flex-wrap gap-4 mb-4">
                 <FilterDropdown
                    label="Name"
                    options={nameOptions}
                    value={filters.name}
                    onChange={(val) => setFilters((prev) => ({ ...prev, name: val }))}
                    minWidth="140px"
                    buttonTextClassName="flex-1 text-center"
                />
                 <FilterDropdown
                    label="User"
                    options={userOptions}
                    value={filters.user}
                    onChange={(val) => setFilters((prev) => ({ ...prev, user: val }))}
                    minWidth="160px"
                    buttonTextClassName="flex-1 text-center"
                />
                 <FilterDropdown
                    label="Rule"
                    options={ruleOptions}
                    value={filters.rule}
                    onChange={(val) => setFilters((prev) => ({ ...prev, rule: val }))}
                    minWidth="245px"
                    buttonTextClassName="flex-1 text-center"
                />
                 <FilterDropdown
                    label="Reference Document"
                    options={refDocOptions}
                    value={filters.referenceDocument}
                    onChange={(val) =>
                        setFilters((prev) => ({ ...prev, referenceDocument: val }))
                    }
                    minWidth="200px"
                    buttonTextClassName="flex-1 text-center"
                />
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto border border-[#CECECE] rounded-lg">
                {loading ? (
                    <div className="flex items-center justify-center h-40 text-[#757575]">Loading...</div>
                ) : (
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
                            <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 w-[10%]">Sr No.</th>
                             <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 w-[20%]">User</th>
                            <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 w-[15%] text-center">Status</th>
                            <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 w-[10%] text-center">Points</th>
                            <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 w-[20%] text-center">Reference document</th>
                            <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 w-[20%] text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {energyPointLogs.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="py-10 text-center text-[#757575]">No energy point logs found</td>
                            </tr>
                        ) : energyPointLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-gray-50 transition-colors text-[14px] font-medium text-[#1E1E1E]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                                <td className="py-3 px-6">
                                    <input 
                                        type="checkbox" 
                                        className="w-4 h-4 rounded border-[#1F1F1F] text-[#7D1EDB] focus:ring-[#7D1EDB]" 
                                        checked={selectedRows.includes(log.id)}
                                        onChange={() => handleSelectRow(log.id)}
                                    />
                                </td>
                                <td className="py-3 px-6">{log.srNo}</td>
                                <td className="py-3 px-6">{log.user || log.name}</td>
                                <td className="py-3 px-6 text-center">
                                    <span className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${log.status === 'Auto' ? 'bg-[#E4F8D2] text-[#76DB1E]' : 'bg-[#CCEDFF] text-[#1EC2DB]'}`}>
                                        {log.status}
                                    </span>
                                </td>
                                <td className="py-3 px-6 text-center">{log.points}</td>
                                <td className="py-3 px-6 text-center">
                                    {log.referenceDocument || log.referenceDocumentType || '—'}
                                </td>
                                <td className="py-3 px-6 text-right">
                                    <button className="text-[#7D1EDB] border border-[#7D1EDB] px-3 py-1 rounded-lg text-sm hover:bg-[#7D1EDB] hover:text-white transition-colors">
                                        {log.action || 'View Reference'}
                                    </button>
                                </td>
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

export default EnergyPointLogList;
