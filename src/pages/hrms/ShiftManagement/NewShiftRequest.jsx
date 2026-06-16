import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import CustomDatePicker from '../../../components/ui/CustomDatePicker';
import FilterDropdown from '../../../components/ui/FilterDropdown';
import {
  shiftService,
  attendanceUtils,
  employeeService,
} from '../../../service';

const NewShiftRequest = () => {
    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const isManagerOrAdmin =
        userData.isAdmin || userData.type === 'manager' || userData.type === 'admin';

    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [shiftTypeId, setShiftTypeId] = useState('');
    const [shiftTypeOptions, setShiftTypeOptions] = useState([]);
    const [employeeOptions, setEmployeeOptions] = useState([]);
    const [empId, setEmpId] = useState(String(userData.id || ''));
    const [employeeName, setEmployeeName] = useState(userData.name || '');
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const loadData = async () => {
            const shiftsRes = await shiftService.getShiftTypes();
            if (shiftsRes.success) {
                const options = (shiftsRes.data || []).map((shift) => ({
                    label: shift.name,
                    value: String(shift.id),
                }));
                setShiftTypeOptions(options);
                if (options[0]) {
                    setShiftTypeId(options[0].value);
                }
            }

            if (isManagerOrAdmin && userData.id) {
                const empRes = await employeeService.getAllEmployeesByAdminId(userData.id);
                if (empRes.success && Array.isArray(empRes.data)) {
                    const options = empRes.data
                        .filter((item) => item.user?.id)
                        .map((item) => ({
                            label: item.user.name,
                            value: String(item.user.id),
                        }));
                    setEmployeeOptions(options);
                }
            }
        };

        loadData();
    }, [isManagerOrAdmin, userData.id]);

    const handleEmployeeChange = (selectedEmpId) => {
        setEmpId(selectedEmpId);
        const selected = employeeOptions.find((opt) => opt.value === selectedEmpId);
        setEmployeeName(selected?.label || '');
    };

    const parseDisplayDate = (dateStr) => {
        if (!dateStr || !dateStr.includes('/')) return null;
        const [day, month, year] = dateStr.split('/');
        const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
        return isNaN(date.getTime()) ? null : date;
    };

    const handleFromDateChange = (date) => {
        setFromDate(date);
        if (toDate && date) {
            const from = parseDisplayDate(date);
            const to = parseDisplayDate(toDate);
            if (from && to && to < from) {
                setToDate('');
            }
        }
    };

    const handleSubmit = async () => {
        setErrorMessage('');

        if (!fromDate || !toDate) {
            setErrorMessage('Please select both From Date and To Date.');
            return;
        }

        if (!shiftTypeId) {
            setErrorMessage('Please select a shift type.');
            return;
        }

        if (!empId) {
            setErrorMessage('Employee is required.');
            return;
        }

        const payload = {
            empId: Number(empId),
            shiftTypeId: Number(shiftTypeId),
            fromDate: attendanceUtils.toApiDate(fromDate),
            toDate: attendanceUtils.toApiDate(toDate),
            comment: comment || undefined,
        };

        setIsSubmitting(true);
        const response = await shiftService.createShiftRequest(payload);
        setIsSubmitting(false);

        if (response.success) {
            navigate('/hrms/shift-request');
        } else {
            setErrorMessage(response.message || 'Failed to submit shift request.');
        }
    };

    return (
        <div className="bg-white px-4 sm:px-4 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col">

            <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 shrink-0" style={{ fontFamily: '"Mulish", sans-serif' }}>
                <img
                    src="/images/arrow_left_alt.svg"
                    alt="Back"
                    className="w-3 h-3 cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => navigate('/hrms/shift-request')}
                />
                <span
                    className='cursor-pointer text-[#7D1EDB]'
                    onClick={() => navigate('/hrms/shift-request')}
                >
                    Shift Request
                </span>
                <ChevronRight size={14}/>
                <span className="text-[#494949]">New Shift Request</span>
            </div>

            <h1 className="text-[20px] font-semibold text-[#494949] mb-4 shrink-0" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>New Shift Request</h1>

            {errorMessage && (
                <p className="text-sm text-red-500 mb-2">{errorMessage}</p>
            )}

            <div className="flex-1 overflow-y-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
                <div className="border border-[#D6D6D6] rounded-lg p-4 mb-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                        <div className="flex flex-col gap-2">
                            <label className="text-[14px] font-normal text-[#1E1E1E]">Shift Type</label>
                            <FilterDropdown
                                options={shiftTypeOptions}
                                value={shiftTypeId}
                                onChange={setShiftTypeId}
                                className="w-full h-11 px-4 bg-white border border-[#D6D6D6] rounded-lg text-[#1E1E1E] focus:ring-1 focus:ring-[#7D1EDB] flex items-center justify-between"
                                showArrow={true}
                                placeholder="Select Shift"
                                dropdownWidth="150px"
                                align='right'
                            />
                        </div>

                        {isManagerOrAdmin && employeeOptions.length > 0 ? (
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] font-normal text-[#1E1E1E]">Employee</label>
                                <FilterDropdown
                                    options={employeeOptions}
                                    value={empId}
                                    onChange={handleEmployeeChange}
                                    className="w-full h-11 px-4 bg-white border border-[#D6D6D6] rounded-lg text-[#1E1E1E] focus:ring-1 focus:ring-[#7D1EDB] flex items-center justify-between"
                                    showArrow={true}
                                    placeholder="Select Employee"
                                    dropdownWidth="150px"
                                    align='right'
                                />
                            </div>
                        ) : (
                            <>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[14px] font-normal text-[#1E1E1E]">Employee ID</label>
                                    <input
                                        type="text"
                                        value={empId}
                                        disabled
                                        className="w-full h-11 px-4 border border-[#D6D6D6] rounded-lg bg-gray-50"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-[14px] font-normal text-[#1E1E1E]">Employee Name</label>
                                    <input
                                        type="text"
                                        value={employeeName}
                                        disabled
                                        className="w-full h-11 px-4 border border-[#D6D6D6] rounded-lg bg-gray-50"
                                    />
                                </div>
                            </>
                        )}

                        <div className="flex flex-col gap-2">
                            <label className="text-[14px] font-normal text-[#1E1E1E]">From Date</label>
                            <CustomDatePicker
                                value={fromDate}
                                onChange={handleFromDateChange}
                                placeholder="26/01/2026"
                                className="w-full h-11 bg-white"
                                allowFuture={true}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[14px] font-normal text-[#1E1E1E]">To Date</label>
                            <CustomDatePicker
                                value={toDate}
                                onChange={setToDate}
                                placeholder="29/01/2026"
                                className="w-full h-11 bg-white"
                                allowFuture={true}
                                minDate={parseDisplayDate(fromDate)}
                            />
                        </div>
                    </div>
                </div>

                <div className="border border-[#CECECE] rounded-lg p-4 mb-4">
                    <h3 className="text-[16px] font-medium text-[#1E1E1E] mb-2">Add a comment</h3>
                    <textarea
                        placeholder="Enter comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full h-24 p-3 border border-[#D6D6D6] rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-[#7D1EDB]"
                    ></textarea>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => navigate('/hrms/shift-request')}
                        className="px-6 py-2 border border-[#CECECE] rounded-full text-sm font-semibold text-[#494949] hover:bg-gray-50 transition-colors"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-[#7D1EDB] hover:bg-purple-700 text-white rounded-full text-sm font-semibold transition-colors disabled:opacity-60"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewShiftRequest;
