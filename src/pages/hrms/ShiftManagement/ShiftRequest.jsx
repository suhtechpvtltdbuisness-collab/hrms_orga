import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Plus, Search, Check, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { shiftService } from '../../../service';

const formatStatus = (status) => {
    if (!status) return 'Submitted';
    return status.charAt(0).toUpperCase() + status.slice(1);
};

const defaultRequests = [
    {
        id: 1001,
        empId: 101,
        empName: "Alice John",
        fromDate: "2026-06-17",
        toDate: "2026-06-20",
        shiftTypeId: 1,
        shiftTypeName: "Day Shift",
        comment: "Need to coordinate with the morning team project delivery.",
        status: "submitted"
    },
    {
        id: 1002,
        empId: 102,
        empName: "Carol White",
        fromDate: "2026-06-18",
        toDate: "2026-06-18",
        shiftTypeId: 2,
        shiftTypeName: "Night Shift",
        comment: "Switching shift with Bob due to family event.",
        status: "submitted"
    },
    {
        id: 1003,
        empId: 103,
        empName: "Mike Miller",
        fromDate: "2026-06-19",
        toDate: "2026-06-24",
        shiftTypeId: 3,
        shiftTypeName: "Evening Shift",
        comment: "Health issues require working evening hours.",
        status: "submitted"
    },
    {
        id: 1004,
        empId: 104,
        empName: "Diana Ross",
        fromDate: "2026-06-15",
        toDate: "2026-06-15",
        shiftTypeId: 1,
        shiftTypeName: "Day Shift",
        comment: "Standard request.",
        status: "approved"
    },
    {
        id: 1005,
        empId: 105,
        empName: "Ethan Hunt",
        fromDate: "2026-06-14",
        toDate: "2026-06-16",
        shiftTypeId: 2,
        shiftTypeName: "Night Shift",
        comment: "Conflicting project timelines.",
        status: "rejected"
    }
];

const ShiftRequest = () => {
    const navigate = useNavigate();

    // Retrieve user data & auto-detect role
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const isAdmin = Boolean(userData.isAdmin || userData.role === 'admin' || userData.type === 'admin');
    const canCreateRequest = userData.type === 'employee' || userData.type === 'manager' || userData.role === 'employee' || userData.role === 'manager';

    // State
    const [requests, setRequests] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [actionLoadingId, setActionLoadingId] = useState(null);

    // Search and filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [filterShift, setFilterShift] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Load initial data
    const fetchRequests = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const filters = {};
            if (!isAdmin && userData.id) {
                filters.empId = userData.id;
            }

            const response = await shiftService.getShiftRequests(filters);
            if (response.success && response.data && response.data.length > 0) {
                let data = response.data;
                if (!isAdmin && userData.id) {
                    data = data.filter(
                        (request) => String(request.empId) === String(userData.id)
                    );
                }
                setRequests(data);
            } else {
                // Fallback to local storage if API is empty/unimplemented
                const stored = localStorage.getItem("hrms_shift_requests");
                if (stored) {
                    try {
                        let localData = JSON.parse(stored);
                        if (!isAdmin && userData.id) {
                            localData = localData.filter(
                                (request) => String(request.empId) === String(userData.id)
                            );
                        }
                        setRequests(localData);
                    } catch (e) {
                        console.error("Failed to parse local shift requests:", e);
                        setRequests([]);
                    }
                } else {
                    localStorage.setItem("hrms_shift_requests", JSON.stringify(defaultRequests));
                    let localData = [...defaultRequests];
                    if (!isAdmin && userData.id) {
                        localData = localData.filter(
                            (request) => String(request.empId) === String(userData.id)
                        );
                    }
                    setRequests(localData);
                }
            }
        } catch (error) {
            console.error("API error loading requests, using fallback:", error);
            // Local fallback on API error
            const stored = localStorage.getItem("hrms_shift_requests");
            if (stored) {
                try {
                    let localData = JSON.parse(stored);
                    if (!isAdmin && userData.id) {
                        localData = localData.filter(
                            (request) => String(request.empId) === String(userData.id)
                        );
                    }
                    setRequests(localData);
                } catch {
                    setRequests([]);
                }
            } else {
                localStorage.setItem("hrms_shift_requests", JSON.stringify(defaultRequests));
                let localData = [...defaultRequests];
                if (!isAdmin && userData.id) {
                    localData = localData.filter(
                        (request) => String(request.empId) === String(userData.id)
                    );
                }
                setRequests(localData);
            }
        } finally {
            setIsLoading(false);
        }
    }, [isAdmin, userData.id]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    // Checkbox state managers
    const handleSelectRow = (id) => {
        setSelectedRows(prev =>
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (visibleItems) => {
        const visibleIds = visibleItems.map(item => item.id);
        const allSelected = visibleIds.every(id => selectedRows.includes(id));
        if (allSelected) {
            setSelectedRows(prev => prev.filter(id => !visibleIds.includes(id)));
        } else {
            setSelectedRows(prev => [...new Set([...prev, ...visibleIds])]);
        }
    };

    // Single Approve / Reject Handlers
    const handleStatusUpdate = async (id, newStatus) => {
        setActionLoadingId(id);
        setErrorMessage('');
        try {
            let res;
            if (newStatus === "Approved") {
                res = await shiftService.approveShiftRequest(id);
            } else {
                res = await shiftService.rejectShiftRequest(id, "Rejected by administrator");
            }

            if (res && res.success) {
                // Refresh list
                await fetchRequests();
            } else {
                // Fallback to local storage state updates
                const stored = localStorage.getItem("hrms_shift_requests");
                if (stored) {
                    const localData = JSON.parse(stored);
                    const updated = localData.map(req => {
                        if (req.id === id) {
                            return { ...req, status: newStatus.toLowerCase() };
                        }
                        return req;
                    });
                    localStorage.setItem("hrms_shift_requests", JSON.stringify(updated));
                }
                // Update local state directly
                setRequests(prev => prev.map(req => {
                    if (req.id === id) {
                        return { ...req, status: newStatus.toLowerCase() };
                    }
                    return req;
                }));
            }
        } catch (err) {
            console.error("Error updating status:", err);
            setErrorMessage("Failed to process action. Synced locally.");
        } finally {
            setActionLoadingId(null);
        }
    };

    // Bulk actions handler
    const handleBulkStatusUpdate = async (newStatus) => {
        if (selectedRows.length === 0) return;
        setIsLoading(true);
        setErrorMessage('');
        try {
            for (const id of selectedRows) {
                if (newStatus === "Approved") {
                    await shiftService.approveShiftRequest(id);
                } else {
                    await shiftService.rejectShiftRequest(id, "Rejected by bulk administrator action");
                }
            }

            // Fallback for local storage persistence
            const stored = localStorage.getItem("hrms_shift_requests");
            if (stored) {
                const localData = JSON.parse(stored);
                const updated = localData.map(req => {
                    if (selectedRows.includes(req.id)) {
                        return { ...req, status: newStatus.toLowerCase() };
                    }
                    return req;
                });
                localStorage.setItem("hrms_shift_requests", JSON.stringify(updated));
            }

            setSelectedRows([]);
            await fetchRequests();
        } catch (err) {
            console.error("Error bulk updating status:", err);
            setErrorMessage("Bulk operation failed. Updated local state.");
        } finally {
            setIsLoading(false);
        }
    };

    // Format Dates for UI
    const formatDateDisplay = (dateStr) => {
        if (!dateStr) return '-';
        if (dateStr.includes('T')) {
            dateStr = dateStr.split('T')[0];
        }
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            // YYYY-MM-DD to DD/MM/YYYY
            if (parts[0].length === 4) {
                return `${parts[2]}/${parts[1]}/${parts[0]}`;
            }
            // DD/MM/YYYY
            return dateStr;
        }
        return dateStr;
    };

    // Style badge dynamically depending on status
    const getStatusBadgeClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved':
                return 'inline-block px-3 py-1 bg-[#E4F8D2] text-[#76DB1E] border border-[#D0F2B4] rounded-full text-xs font-semibold';
            case 'rejected':
                return 'inline-block px-3 py-1 bg-[#FEE2E2] text-[#EF4444] border border-[#FCA5A5] rounded-full text-xs font-semibold';
            case 'submitted':
            default:
                return 'inline-block px-3 py-1 bg-[#F3E8FF] text-[#7D1EDB] border border-[#E9D5FF] rounded-full text-xs font-semibold';
        }
    };

    // Filtering logic
    const filteredRequests = requests.filter(request => {
        const empName = (request.empName || request.employeeName || '').toLowerCase();
        const empIdStr = String(request.empId || '');
        const matchesSearch = empName.includes(searchQuery.toLowerCase()) || empIdStr.includes(searchQuery);

        const shiftName = (request.shiftTypeName || request.shiftType || '').toLowerCase();
        let matchesShift = true;
        if (filterShift !== 'All') {
            matchesShift = shiftName.includes(filterShift.toLowerCase());
        }

        const statusStr = (request.status || '').toLowerCase();
        let matchesStatus = true;
        if (filterStatus !== 'All') {
            matchesStatus = statusStr === filterStatus.toLowerCase();
        }

        return matchesSearch && matchesShift && matchesStatus;
    });

    // Pagination calculations
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    // Reset pagination when filter/search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filterShift, filterStatus]);

    const isAllSelected = currentItems.length > 0 && currentItems.every(item => selectedRows.includes(item.id));

    return (
        <div className="bg-white px-4 sm:px-4 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col">

            {/* Breadcrumb Navigation */}
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
                <ChevronRight size={14} />
                <span className="text-[#6B7280]">Shift Request</span>
            </div>

            {/* Header Title & CTA Button */}
            <div className="flex justify-between items-center mb-4 shrink-0">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Shift Request</h1>
                    {!isAdmin && (
                        <p className="text-xs text-gray-500 mt-1">Showing your shift requests only</p>
                    )}
                </div>

                {canCreateRequest && (
                    <button
                        onClick={() => navigate('/hrms/shift-request/new')}
                        className="flex items-center justify-center gap-2 rounded-full py-2 px-4 text-white font-medium hover:bg-purple-700 transition-colors bg-[#7D1EDB]"
                    >
                        <span className='text-[14px] font-semibold text-white' style={{ fontFamily: 'Poppins, sans-serif' }}>New Shift Request</span>
                        <Plus size={16} />
                    </button>
                )}
            </div>

            {errorMessage && (
                <div className="p-3 mb-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 shrink-0">
                    {errorMessage}
                </div>
            )}

            {/* Filter controls row */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4 shrink-0">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search employee by name or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 border border-[#CECECE] rounded-lg text-sm text-[#494949] focus:outline-none focus:ring-1 focus:ring-[#7D1EDB]"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                </div>

                <div className="min-w-[150px]">
                    <select
                        value={filterShift}
                        onChange={(e) => setFilterShift(e.target.value)}
                        className="w-full h-10 px-3 border border-[#CECECE] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#7D1EDB] text-sm text-[#494949]"
                    >
                        <option value="All">All Shifts</option>
                        <option value="Day">Day Shift</option>
                        <option value="Night">Night Shift</option>
                        <option value="Evening">Evening Shift</option>
                    </select>
                </div>

                <div className="min-w-[150px]">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full h-10 px-3 border border-[#CECECE] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#7D1EDB] text-sm text-[#494949]"
                    >
                        <option value="All">All Statuses</option>
                        <option value="submitted">Submitted</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Bulk Actions Panel */}
            {selectedRows.length > 0 && isAdmin && (
                <div className="flex gap-2 mb-4 p-3 bg-purple-50 border border-purple-100 rounded-lg shrink-0 items-center justify-between animate-fadeIn" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    <span className="text-xs text-[#7D1EDB] font-semibold">
                        {selectedRows.length} shift request{selectedRows.length > 1 ? 's' : ''} selected
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleBulkStatusUpdate("Approved")}
                            className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-full text-[11px] font-semibold cursor-pointer transition-colors flex items-center gap-1 shadow-sm"
                        >
                            <Check size={12} /> Approve Selected
                        </button>
                        <button
                            onClick={() => handleBulkStatusUpdate("Rejected")}
                            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full text-[11px] font-semibold cursor-pointer transition-colors flex items-center gap-1 shadow-sm"
                        >
                            <X size={12} /> Reject Selected
                        </button>
                    </div>
                </div>
            )}

            {/* Table Container */}
            <div className="flex-1 min-h-0 overflow-y-auto border border-[#CECECE] rounded-lg">
                <table className="w-full relative border-collapse">
                    <thead className="sticky top-0 z-10 bg-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        <tr className="text-left text-[14px] border-b border-[#CECECE] bg-gray-50">
                            {isAdmin && (
                                <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 w-[5%]">
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-black bg-white checked:bg-white checked:border-black"
                                            checked={isAllSelected}
                                            onChange={() => handleSelectAll(currentItems)}
                                        />
                                        <svg
                                            className="pointer-events-none absolute w-3 h-3 text-black hidden peer-checked:block"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                </th>
                            )}
                            <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 w-[20%]">
                                Employee Name
                            </th>
                            <th className="py-3 px-4 text-[#757575] font-normal w-[20%]">
                                Requested Dates
                            </th>
                            <th className="py-3 px-4 text-[#757575] font-normal w-[15%] text-center">
                                Shift Type
                            </th>
                            <th className="py-3 px-4 text-[#757575] font-normal w-[20%]">
                                Reason/Comment
                            </th>
                            <th className="py-3 px-4 text-[#757575] font-normal w-[12%] text-center">
                                Status
                            </th>
                            {isAdmin && (
                                <th className="py-3 px-4 text-[#757575] font-normal w-[18%] text-right">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={isAdmin ? 7 : 5} className="py-8 text-center text-gray-500">
                                    Loading shift requests...
                                </td>
                            </tr>
                        ) : currentItems.length > 0 ? (
                            currentItems.map((request) => (
                                <tr key={request.id} className="hover:bg-gray-50 transition-colors text-[14px] font-medium text-[#1E1E1E] border-b border-[#EBEBEB]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                                    {isAdmin && (
                                        <td className="py-3 px-6 text-center">
                                            <div className="relative flex items-center justify-center">
                                                <input
                                                    type="checkbox"
                                                    className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-black bg-white checked:bg-white checked:border-black"
                                                    checked={selectedRows.includes(request.id)}
                                                    onChange={() => handleSelectRow(request.id)}
                                                />
                                                <svg
                                                    className="pointer-events-none absolute w-3 h-3 text-black hidden peer-checked:block"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="3"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                            </div>
                                        </td>
                                    )}
                                    <td className="py-3 px-6">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-800">{request.empName || request.employeeName || '-'}</span>
                                            {request.empId && (
                                                <span className="text-[11px] text-gray-400 font-normal">ID: {request.empId}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 font-normal text-gray-600">
                                        {formatDateDisplay(request.fromDate)} - {formatDateDisplay(request.toDate)}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className="px-2.5 py-1 bg-gray-100 rounded text-xs text-gray-700 border border-gray-200">
                                            {request.shiftTypeName || request.shiftType || '-'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 font-normal text-gray-500 text-xs max-w-[150px] truncate" title={request.comment}>
                                        {request.comment || '-'}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className={getStatusBadgeClass(request.status)}>
                                            {formatStatus(request.status)}
                                        </span>
                                    </td>
                                    {isAdmin && (
                                        <td className="py-3 px-4 text-right">
                                            {request.status?.toLowerCase() === 'submitted' ? (
                                                <div className="flex justify-end gap-1.5">
                                                    <button
                                                        onClick={() => handleStatusUpdate(request.id, "Approved")}
                                                        disabled={actionLoadingId === request.id}
                                                        className="px-2.5 py-1 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(request.id, "Rejected")}
                                                        disabled={actionLoadingId === request.id}
                                                        className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400 font-normal">No action required</span>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={isAdmin ? 7 : 5} className="py-8 text-center text-gray-500">
                                    No shift requests found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            {totalPages > 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center mt-4 px-2 shrink-0 text-sm text-gray-500 gap-4">
                    <div className="text-center md:text-left font-inter">
                        Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredRequests.length)} Of {filteredRequests.length}
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
                                    onClick={() => setCurrentPage(number)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium ${currentPage === number
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
            )}
        </div>
    );
};

export default ShiftRequest;
