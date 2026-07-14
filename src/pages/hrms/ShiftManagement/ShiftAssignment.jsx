import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, ChevronRight, Loader2, Save, Search, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { attendanceUtils, employeeService, shiftAssignmentService, shiftService } from '../../../service';
import CustomDatePicker from '../../../components/ui/CustomDatePicker';

const pad2 = (value) => String(value).padStart(2, '0');

const getTodayDisplayDate = () => {
    const now = new Date();
    return `${pad2(now.getDate())}/${pad2(now.getMonth() + 1)}/${now.getFullYear()}`;
};

const compareApiDates = (left, right) => {
    if (!left || !right) return 0;
    return attendanceUtils.toApiDate(left).localeCompare(attendanceUtils.toApiDate(right));
};

const formatTimeLabel = (value) => {
    if (!value) return '';
    const raw = String(value).trim();
    if (!raw) return '';
    if (/\b(AM|PM)\b/i.test(raw)) return raw.toUpperCase();

    const parts = raw.split(':').map((part) => Number(part));
    if (parts.length >= 2 && parts.every((n) => !Number.isNaN(n))) {
        const [hours, minutes] = parts;
        const meridian = hours >= 12 ? 'PM' : 'AM';
        const normalizedHours = ((hours + 11) % 12) + 1;
        return `${pad2(normalizedHours)}:${pad2(minutes)} ${meridian}`;
    }

    return raw;
};

const buildShiftLabel = (shift) => {
    if (!shift) return 'Unassigned';
    const name = shift.name || shift.shiftName || shift.title || `Shift ${shift.id || ''}`.trim();
    const start = formatTimeLabel(shift.startTime);
    const end = formatTimeLabel(shift.endTime);
    if (start && end) return `${name} • ${start} - ${end}`;
    return name || 'Unassigned';
};

const normalizeRosterItem = (item) => {
    const source = item?.shiftAssignment || item?.assignment || item?.record || item?.data || item || {};
    const employee = source.employee || item?.employee || item?.user || {};
    const shiftType = source.shiftType || item?.shiftType || source.shift || item?.shift || null;

    const employeeId = source.employeeId || item?.employeeId || employee.id || employee.userId || '';
    const shiftTypeId = source.shiftTypeId || item?.shiftTypeId || shiftType?.id || shiftType?._id || '';

    return {
        id: source.id || item?.id || source._id || '',
        employeeId: String(employeeId || ''),
        employeeName: employee.name || employee.fullName || source.employeeName || item?.employeeName || '-',
        empId: employee.employeeId || source.empId || item?.empId || (employeeId ? `EMP${String(employeeId).padStart(3, '0')}` : '-'),
        department: employee.departmentName || employee.department || source.departmentName || source.department || item?.department || '-',
        designation: employee.designationName || employee.designation || source.designationName || source.designation || item?.designation || '-',
        shiftTypeId: shiftTypeId ? String(shiftTypeId) : '',
        shiftTypeName: shiftType?.name || source.shiftTypeName || source.shiftName || '',
        date: source.date || source.rosterDate || source.assignmentDate || item?.date || '',
        isDirty: false,
        raw: source,
    };
};

const normalizeEmployeeRosterItem = (item, index, page, pageSize) => {
    const source = item?.employee || item?.user || item || {};
    const employment = item?.employment || item?.employee?.employment || source?.employment || {};
    const employeeId = source.id || item?.employeeId || item?.id || '';

    const department =
        employment?.department?.name ||
        employment?.departmentName ||
        item?.department?.name ||
        item?.department ||
        source.department?.name ||
        source.department ||
        '-';

    const designation =
        employment?.designation?.name ||
        employment?.jobTitle ||
        employment?.designation ||
        item?.designation?.name ||
        item?.designation ||
        item?.jobTitle ||
        source.designation?.name ||
        source.designation ||
        source.jobTitle ||
        '-';

    return {
        id: source.id || item?.id || '',
        employeeId: String(employeeId || ''),
        employeeName: source.name || item?.name || '-',
        empId: source.employeeId || `EMP${1000 + (source.id || index + 1)}`,
        department,
        designation,
        date: '',
        shiftTypeId: '',
        shiftTypeName: '',
        isDirty: false,
        raw: item,
        srNo: String((page - 1) * pageSize + index + 1).padStart(2, '0'),
    };
};

const ShiftAssignment = () => {
    const navigate = useNavigate();
    const requestIdRef = useRef(0);

    const [selectedFromDate, setSelectedFromDate] = useState(getTodayDisplayDate);
    const [selectedToDate, setSelectedToDate] = useState(getTodayDisplayDate);
    const [searchQuery, setSearchQuery] = useState('');
    const [appliedSearch, setAppliedSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRows, setSelectedRows] = useState([]);
    const [bulkShiftId, setBulkShiftId] = useState('');

    const [shiftTypes, setShiftTypes] = useState([]);
    const [rows, setRows] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loadingRoster, setLoadingRoster] = useState(false);
    const [loadingShifts, setLoadingShifts] = useState(true);
    const [savingRoster, setSavingRoster] = useState(false);

    const pageSize = 10;
    const apiFromDate = useMemo(() => attendanceUtils.toApiDate(selectedFromDate), [selectedFromDate]);
    const apiToDate = useMemo(() => attendanceUtils.toApiDate(selectedToDate), [selectedToDate]);

    const shiftTypeMap = useMemo(
        () => new Map(shiftTypes.map((shift) => [String(shift.id ?? shift._id), shift])),
        [shiftTypes],
    );

    const totalPages = Math.max(1, Math.ceil((totalCount || rows.length || 1) / pageSize));
    const startItem = totalCount ? ((currentPage - 1) * pageSize) + 1 : rows.length ? 1 : 0;
    const endItem = totalCount
        ? Math.min((currentPage - 1) * pageSize + rows.length, totalCount)
        : rows.length;

    useEffect(() => {
        const timer = setTimeout(() => {
            setAppliedSearch(searchQuery.trim());
            setCurrentPage(1);
        }, 350);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const loadShiftTypes = useCallback(async () => {
        setLoadingShifts(true);
        try {
            const response = await shiftService.getShiftTypes();
            if (response.success) {
                setShiftTypes(Array.isArray(response.data) ? response.data : []);
            } else {
                setShiftTypes([]);
                toast.error(response.message || 'Failed to load shift types.');
            }
        } catch (error) {
            console.error('Failed to load shift types:', error);
            setShiftTypes([]);
            toast.error('Something went wrong while loading shift types.');
        } finally {
            setLoadingShifts(false);
        }
    }, []);

    const loadRoster = useCallback(async () => {
        const requestId = ++requestIdRef.current;
        setLoadingRoster(true);

        try {
            const response = await shiftAssignmentService.getShiftAssignments({
                date: apiFromDate,
                dateFrom: apiFromDate,
                dateTo: apiToDate,
                search: appliedSearch,
                page: currentPage,
                limit: pageSize,
            });

            if (requestId !== requestIdRef.current) return;

            if (response.success) {
                const list = Array.isArray(response.data) ? response.data.map(normalizeRosterItem) : [];
                setRows(list);
                setTotalCount(response.meta?.total ?? list.length);
                setSelectedRows([]);
                return;
            } else {
                console.warn('Shift roster endpoint failed; falling back to employee list.', response.message);
            }

            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            const adminId = userData?.id || userData?._id;
            if (!adminId) {
                throw new Error('Admin ID not found');
            }

            const employeeRes = await employeeService.getAllEmployeesByAdminId(adminId, currentPage, pageSize, appliedSearch);
            if (!employeeRes.success) {
                throw new Error(employeeRes.message || 'Failed to load employees');
            }

            const employeeData = employeeRes.data?.employees || employeeRes.data || [];
            const totalFromEmployees = employeeRes.data?.total ?? employeeData.length;
            const employeeRows = employeeData.map((item, index) => normalizeEmployeeRosterItem(item, index, currentPage, pageSize));

            const assignmentResults = await Promise.all(
                employeeRows.map(async (row) => {
                    if (!row.employeeId) return row;
                    const assignmentRes = await shiftAssignmentService.getEmployeeAssignments(Number(row.employeeId), apiFromDate, apiToDate);
                    if (!assignmentRes.success) return row;

                    const assignments = Array.isArray(assignmentRes.data) ? assignmentRes.data : [];
                    const todayAssignment = assignments.find((entry) => {
                        const entryDate = entry?.date || entry?.rosterDate || entry?.assignmentDate || '';
                        const apiEntryDate = attendanceUtils.toApiDate(entryDate);
                        return entryDate ? apiEntryDate >= apiFromDate && apiEntryDate <= apiToDate : true;
                    }) || assignments[0];

                    if (!todayAssignment) return row;

                    const shiftTypeId = todayAssignment.shiftTypeId || todayAssignment.shift_type_id || todayAssignment.shiftType?.id || '';
                    const shiftType = shiftTypeId ? shiftTypeMap.get(String(shiftTypeId)) : todayAssignment.shiftType;

                    return {
                        ...row,
                        id: todayAssignment.id || row.id,
                        date: todayAssignment.date || todayAssignment.rosterDate || apiFromDate,
                        shiftTypeId: shiftTypeId ? String(shiftTypeId) : '',
                        shiftTypeName: shiftType?.name || todayAssignment.shiftTypeName || todayAssignment.shiftName || '',
                        isDirty: false,
                    };
                }),
            );

            if (requestId !== requestIdRef.current) return;

            setRows(assignmentResults);
            setTotalCount(totalFromEmployees);
            setSelectedRows([]);
        } catch (error) {
            console.error('Error loading roster:', error);
            if (requestId === requestIdRef.current) {
                setRows([]);
                setTotalCount(0);
                toast.error('Could not load shift roster. Please try again.');
            }
        } finally {
            if (requestId === requestIdRef.current) {
                setLoadingRoster(false);
            }
        }
    }, [apiFromDate, apiToDate, appliedSearch, currentPage, pageSize, shiftTypeMap]);

    useEffect(() => {
        loadShiftTypes();
    }, [loadShiftTypes]);

    useEffect(() => {
        loadRoster();
    }, [loadRoster]);

    const updateRowShift = (employeeId, shiftTypeId) => {
        const shiftType = shiftTypeId ? shiftTypeMap.get(String(shiftTypeId)) : null;
        setRows((prev) =>
            prev.map((row) =>
                String(row.employeeId) === String(employeeId)
                    ? {
                        ...row,
                        shiftTypeId: shiftTypeId ? String(shiftTypeId) : '',
                        shiftTypeName: shiftType?.name || '',
                        isDirty: true,
                    }
                    : row,
            ),
        );
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedRows(rows.map((row) => String(row.employeeId)));
            return;
        }
        setSelectedRows([]);
    };

    const handleSelectRow = (employeeId) => {
        const key = String(employeeId);
        setSelectedRows((prev) =>
            prev.includes(key) ? prev.filter((id) => id !== key) : [...prev, key],
        );
    };

    const applyBulkShift = async () => {
        if (!selectedRows.length) {
            toast.error('Please select employees first.');
            return;
        }

        const targetRows = rows.filter((row) => selectedRows.includes(String(row.employeeId)));
        if (!targetRows.length) {
            toast.error('No matching employees found on this page.');
            return;
        }

        setSavingRoster(true);
        try {
            const shiftTypeId = bulkShiftId ? Number(bulkShiftId) : null;
            const payload = {
                date: apiFromDate,
                dateFrom: apiFromDate,
                dateTo: apiToDate,
                shiftTypeId,
                employeeIds: targetRows.map((row) => Number(row.employeeId)).filter((id) => !Number.isNaN(id)),
                assignments: targetRows
                    .map((row) => {
                        const employeeIdNumber = Number(row.employeeId);
                        if (Number.isNaN(employeeIdNumber)) return null;
                        return { employeeId: employeeIdNumber, shiftTypeId };
                    })
                    .filter(Boolean),
            };

            const response = await shiftAssignmentService.bulkCreate(payload);
            if (response.success) {
                toast.success(response.message || 'Shift assignments updated.');
                await loadRoster();
            } else {
                toast.error(response.message || 'Failed to apply bulk shift.');
            }
        } catch (error) {
            console.error('Bulk assignment failed:', error);
            toast.error('Something went wrong while applying the bulk shift.');
        } finally {
            setSavingRoster(false);
            setSelectedRows([]);
        }
    };

    const saveRoster = async () => {
        setSavingRoster(true);
        try {
            const assignments = rows
                .map((row) => {
                    const employeeIdNumber = Number(row.employeeId);
                    if (Number.isNaN(employeeIdNumber)) return null;
                    return {
                        employeeId: employeeIdNumber,
                        shiftTypeId: row.shiftTypeId ? Number(row.shiftTypeId) : null,
                    };
                })
                .filter(Boolean);

            if (!assignments.length) {
                toast.error('No roster entries available to save.');
                return;
            }

            const response = await shiftAssignmentService.updateRoster({
                date: apiFromDate,
                dateFrom: apiFromDate,
                dateTo: apiToDate,
                assignments,
            });

            if (response.success) {
                toast.success(response.message || 'Roster saved successfully.');
                await loadRoster();
            } else {
                toast.error(response.message || 'Failed to save roster.');
            }
        } catch (error) {
            console.error('Roster save failed:', error);
            toast.error('Something went wrong while saving the roster.');
        } finally {
            setSavingRoster(false);
        }
    };

    const deleteAssignment = async (row) => {
        if (!row.id) {
            toast.error('This assignment cannot be deleted because it is not saved yet.');
            return;
        }

        const confirmed = window.confirm(`Delete the shift assignment for ${row.employeeName}?`);
        if (!confirmed) return;

        setSavingRoster(true);
        try {
            const response = await shiftAssignmentService.deleteShiftAssignment(row.id);
            if (response.success) {
                toast.success(response.message || 'Shift assignment deleted.');
                await loadRoster();
            } else {
                toast.error(response.message || 'Failed to delete the shift assignment.');
            }
        } catch (error) {
            console.error('Delete assignment failed:', error);
            toast.error('Something went wrong while deleting the assignment.');
        } finally {
            setSavingRoster(false);
        }
    };

    const goPrevPage = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    const goNextPage = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    const visibleRows = rows;
    const allVisibleSelected = visibleRows.length > 0 && selectedRows.length === visibleRows.length;

    const handleFromDateChange = (date) => {
        if (!date) return;
        setSelectedFromDate(date);
        if (compareApiDates(date, selectedToDate) > 0) {
            setSelectedToDate(date);
        }
        setCurrentPage(1);
    };

    const handleToDateChange = (date) => {
        if (!date) return;
        setSelectedToDate(date);
        if (compareApiDates(selectedFromDate, date) > 0) {
            setSelectedFromDate(date);
        }
        setCurrentPage(1);
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
                <span className="cursor-pointer text-[#7D1EDB]" onClick={() => navigate('/hrms')}>
                    HRMS Dashboard
                </span>
                <ChevronRight size={14} />
                <span className="text-[#6B7280]">Shift Assignment</span>
            </div>

            <div className="flex justify-between items-center mb-2 shrink-0 gap-4">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                        Shift Assignment
                    </h1>
                    <p className="text-sm text-[#7A7A7A] mt-1">
                        Manage roster assignments by date and keep the backend as the single source of truth.
                    </p>
                </div>

                <button
                    onClick={saveRoster}
                    disabled={savingRoster || loadingRoster || loadingShifts}
                    className="flex items-center justify-center gap-2 py-2 px-5 rounded-full text-white font-medium hover:bg-purple-700 transition-colors bg-[#7D1EDB] shadow-md cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {savingRoster ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    <span className="text-[16px] font-medium text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Save Roster
                    </span>
                </button>
            </div>

            <div className="flex items-center justify-between gap-4 mb-4 shrink-0 flex-wrap" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                <div className="flex-1 min-w-[240px] relative">
                    <input
                        type="text"
                        placeholder="Search by employee name, ID, department or designation..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 border border-[#CECECE] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#7D1EDB] text-sm"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>

                <div className="min-w-[210px] flex items-center gap-2">
                    <label className="text-xs text-gray-500 font-semibold shrink-0">From:</label>
                    <CustomDatePicker
                        value={selectedFromDate}
                        onChange={handleFromDateChange}
                        placeholder="From Date"
                        className="w-full h-10 bg-white"
                    />
                </div>

                <div className="min-w-[210px] flex items-center gap-2">
                    <label className="text-xs text-gray-500 font-semibold shrink-0">To:</label>
                    <CustomDatePicker
                        value={selectedToDate}
                        onChange={handleToDateChange}
                        placeholder="To Date"
                        className="w-full h-10 bg-white"
                    />
                </div>
            </div>

            {selectedRows.length > 0 && (
                <div className="flex gap-4 mb-4 p-3 bg-purple-50 border border-purple-100 rounded-lg shrink-0 items-center justify-between flex-wrap">
                    <span className="text-xs text-[#7D1EDB] font-semibold">
                        {selectedRows.length} employee{selectedRows.length > 1 ? 's' : ''} selected
                    </span>

                    <div className="flex items-center gap-2 flex-wrap">
                        <select
                            value={bulkShiftId}
                            onChange={(e) => setBulkShiftId(e.target.value)}
                            className="h-9 px-3 border border-[#CECECE] rounded-lg bg-white text-xs text-[#494949] min-w-[220px]"
                        >
                            <option value="">Unassigned</option>
                            {shiftTypes.map((shift) => (
                                <option key={String(shift.id ?? shift._id)} value={String(shift.id ?? shift._id)}>
                                    {buildShiftLabel(shift)}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={applyBulkShift}
                            disabled={savingRoster || loadingRoster}
                            className="px-4 py-2 bg-[#7D1EDB] hover:bg-purple-700 text-white rounded-full text-xs font-semibold cursor-pointer transition-colors shadow-sm flex items-center gap-1 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <Check size={12} />
                            Apply to Selected
                        </button>
                    </div>
                </div>
            )}

            <div className="flex-1 min-h-0 overflow-hidden border border-[#CECECE] rounded-lg">
                <div className="h-full overflow-y-auto">
                    <table className="w-full relative border-collapse">
                        <thead className="sticky top-0 z-10 bg-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            <tr className="text-left text-[13px] border-b border-[#CECECE]">
                                <th className="py-3 px-6 text-[#757575] font-normal w-[64px] text-center">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-[#1F1F1F] text-[#7D1EDB] focus:ring-[#7D1EDB]"
                                        checked={allVisibleSelected}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th className="py-3 px-6 text-[#757575] font-normal w-[14%]">Employee ID</th>
                                <th className="py-3 px-6 text-[#757575] font-normal w-[20%]">Employee Name</th>
                                <th className="py-3 px-6 text-[#757575] font-normal w-[16%]">Department</th>
                                <th className="py-3 px-6 text-[#757575] font-normal w-[16%]">Designation</th>
                                <th className="py-3 px-6 text-[#757575] font-normal w-[22%]">Shift Assignment</th>
                                <th className="py-3 px-6 text-[#757575] font-normal w-[10%] text-center">Status</th>
                                <th className="py-3 px-6 text-[#757575] font-normal w-[90px] text-right">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {(loadingRoster || loadingShifts) && (
                                <tr>
                                    <td colSpan={8} className="py-14 text-center text-gray-500">
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 size={18} className="animate-spin text-[#7D1EDB]" />
                                            Loading shift roster...
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {!loadingRoster && !loadingShifts && visibleRows.length > 0 && visibleRows.map((row) => {
                                const isAssigned = Boolean(row.shiftTypeId);
                                const isSelected = selectedRows.includes(String(row.employeeId));

                                return (
                                    <tr
                                        key={`${row.id || row.employeeId}-${row.date || apiFromDate}`}
                                        className={`hover:bg-gray-50 transition-colors text-[13px] font-medium text-[#1E1E1E] border-b border-[#E5E7EB] ${row.isDirty ? 'bg-amber-50/40' : ''}`}
                                        style={{ fontFamily: '"Nunito Sans", sans-serif' }}
                                    >
                                        <td className="py-3.5 px-6 text-center">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-[#1F1F1F] text-[#7D1EDB] focus:ring-[#7D1EDB]"
                                                checked={isSelected}
                                                onChange={() => handleSelectRow(row.employeeId)}
                                            />
                                        </td>
                                        <td className="py-3.5 px-6 text-gray-500 font-semibold whitespace-nowrap">
                                            {row.empId}
                                        </td>
                                        <td className="py-3.5 px-6 text-gray-800">
                                            {row.employeeName}
                                        </td>
                                        <td className="py-3.5 px-6 text-gray-700">{row.department}</td>
                                        <td className="py-3.5 px-6 text-gray-700">{row.designation}</td>
                                        <td className="py-3.5 px-6">
                                            <select
                                                value={row.shiftTypeId}
                                                onChange={(e) => updateRowShift(row.employeeId, e.target.value)}
                                                className="h-9 px-3 border border-[#CECECE] rounded-lg bg-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#7D1EDB] w-full max-w-[320px]"
                                            >
                                                <option value="">Unassigned</option>
                                                {shiftTypes.map((shift) => (
                                                    <option key={String(shift.id ?? shift._id)} value={String(shift.id ?? shift._id)}>
                                                        {buildShiftLabel(shift)}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="py-3.5 px-6 text-center">
                                            <span
                                                className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold border ${
                                                    row.isDirty
                                                        ? 'bg-amber-100 text-amber-700 border-amber-200'
                                                        : isAssigned
                                                            ? 'bg-[#E4F8D2] text-[#76DB1E] border-[#D0F2B4]'
                                                            : 'bg-gray-100 text-gray-500 border-gray-200'
                                                }`}
                                            >
                                                {row.isDirty ? 'Draft' : isAssigned ? 'Assigned' : 'Unassigned'}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => deleteAssignment(row)}
                                                    disabled={savingRoster}
                                                    className="text-red-500 hover:text-red-600 disabled:opacity-50"
                                                    title="Delete assignment"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}

                            {!loadingRoster && !loadingShifts && !visibleRows.length && (
                                <tr>
                                    <td colSpan={8} className="py-12 text-center text-gray-400">
                                        No shift assignments found for this date range.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center mt-4 px-2 shrink-0 text-sm text-gray-500 gap-4">
                <div className="text-center md:text-left font-inter">
                    {totalCount > 0 ? `Showing ${startItem}-${endItem} of ${totalCount}` : 'No shift assignments to display'}
                </div>

                <div className="flex items-center justify-center md:justify-end lg:justify-center gap-2">
                    <button
                        onClick={goPrevPage}
                        disabled={currentPage === 1}
                        className={`flex items-center gap-1 text-sm font-inter ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <ArrowLeft size={16} /> Previous
                    </button>

                    <div className="flex gap-1">
                        {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
                            <button
                                key={number}
                                onClick={() => setCurrentPage(number)}
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
                        onClick={goNextPage}
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
