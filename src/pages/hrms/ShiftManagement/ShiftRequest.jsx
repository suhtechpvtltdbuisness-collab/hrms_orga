import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Plus } from 'lucide-react';
import { shiftService } from '../../../service';

const formatStatus = (status) => {
    if (!status) return 'Submitted';
    return status.charAt(0).toUpperCase() + status.slice(1);
};

const ShiftRequest = () => {
    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const isAdmin = Boolean(userData.isAdmin);
    const canCreateRequest =
        userData.type === 'employee' || userData.type === 'manager';

    const [requests, setRequests] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [actionLoadingId, setActionLoadingId] = useState(null);

    const fetchRequests = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const filters = {};
            if (!isAdmin && userData.id) {
                filters.empId = userData.id;
            }

            const response = await shiftService.getShiftRequests(filters);
            if (response.success) {
                let data = response.data || [];
                if (!isAdmin && userData.id) {
                    data = data.filter(
                        (request) => String(request.empId) === String(userData.id),
                    );
                }
                setRequests(data);
            } else {
                setRequests([]);
                setErrorMessage(response.message || 'Failed to load shift requests.');
            }
        } catch {
            setRequests([]);
            setErrorMessage('Something went wrong while loading shift requests.');
        } finally {
            setIsLoading(false);
        }
    }, [isAdmin, userData.id]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const handleSelectRow = (id) => {
        setSelectedRows(prev =>
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id],
        );
    };

    const handleApprove = async (id) => {
        setActionLoadingId(id);
        const response = await shiftService.approveShiftRequest(id);
        setActionLoadingId(null);

        if (response.success) {
            fetchRequests();
        } else {
            setErrorMessage(response.message || 'Failed to approve request.');
        }
    };

    const handleReject = async (id) => {
        setActionLoadingId(id);
        const response = await shiftService.rejectShiftRequest(id);
        setActionLoadingId(null);

        if (response.success) {
            fetchRequests();
        } else {
            setErrorMessage(response.message || 'Failed to reject request.');
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved':
                return 'inline-block px-3 py-1 bg-[#E4F8D2] text-[#76DB1E] border border-[#D0F2B4] rounded-full text-xs font-medium';
            case 'rejected':
                return 'inline-block px-3 py-1 bg-[#FEE2E2] text-[#EF4444] border border-[#FCA5A5] rounded-full text-xs font-medium';
            case 'submitted':
            default:
                return 'inline-block px-3 py-1 bg-[#F3E8FF] text-[#7D1EDB] border border-[#E9D5FF] rounded-full text-xs font-medium';
        }
    };

    return (
        <div className="bg-white px-4 sm:px-4 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col">

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
                <span className="text-[#6B7280]">Shift Request</span>
            </div>

            <div className="flex justify-between items-center mb-4 shrink-0">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Shift Request</h1>
                    {!isAdmin && (
                        <p className="text-sm text-gray-500 mt-1">Showing your shift requests only</p>
                    )}
                </div>

                {canCreateRequest && (
                    <button
                        onClick={() => navigate('/hrms/shift-request/new')}
                        className="flex items-center justify-center gap-2 rounded-full py-2 px-4 text-white font-medium hover:bg-purple-700 transition-colors bg-[#7D1EDB]"
                    >
                        <span className='text-[16px] font-medium text-white' style={{ fontFamily: 'Poppins, sans-serif' }}>New Shift Request</span>
                        <Plus size={18} />
                    </button>
                )}
            </div>

            {errorMessage && (
                <p className="text-sm text-red-500 mb-2">{errorMessage}</p>
            )}

            <div className="h-fit min-h-0 overflow-y-auto border border-[#CECECE] rounded-lg">
                <table className="w-full relative border-collapse">
                    <thead className="sticky top-0 z-10 bg-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        <tr className="text-left text-[14px] border-b border-[#CECECE]">
                            <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 w-[5%]"></th>
                            <th className={`py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 ${isAdmin ? 'w-[30%]' : 'w-[35%]'}`}>
                                Employee Name
                            </th>
                            <th className={`py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 text-center ${isAdmin ? 'w-[20%]' : 'w-[30%]'}`}>
                                Status
                            </th>
                            <th className={`py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 ${isAdmin ? 'text-center w-[20%]' : 'text-right w-[30%]'}`}>
                                Shift Type
                            </th>
                            {isAdmin && (
                                <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 text-right w-[25%]">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={isAdmin ? 5 : 4} className="py-8 text-center text-gray-500">
                                    Loading shift requests...
                                </td>
                            </tr>
                        ) : requests.length > 0 ? (
                            requests.map((request) => (
                                <tr key={request.id} className="hover:bg-gray-50 transition-colors text-[14px] font-medium text-[#1E1E1E]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                                    <td className="py-3 px-6">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 cursor-pointer rounded border border-black"
                                            checked={selectedRows.includes(request.id)}
                                            onChange={() => handleSelectRow(request.id)}
                                        />
                                    </td>
                                    <td className="py-3 px-6">{request.empName || '-'}</td>
                                    <td className="py-3 px-6 text-center">
                                        <span className={getStatusBadgeClass(request.status)}>
                                            {formatStatus(request.status)}
                                        </span>
                                    </td>
                                    <td className={`py-3 px-6 ${isAdmin ? 'text-center' : 'text-right'}`}>
                                        {request.shiftTypeName || '-'}
                                    </td>
                                    {isAdmin && (
                                        <td className="py-3 px-6 text-right">
                                            {request.status === 'submitted' ? (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleApprove(request.id)}
                                                        disabled={actionLoadingId === request.id}
                                                        className="px-3 py-1 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(request.id)}
                                                        disabled={actionLoadingId === request.id}
                                                        className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
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
                                <td colSpan={isAdmin ? 5 : 4} className="py-8 text-center text-gray-500">
                                    No shift requests found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ShiftRequest;
