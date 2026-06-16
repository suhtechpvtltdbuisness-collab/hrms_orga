import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import FilterDropdown from '../../../components/ui/FilterDropdown';
import CustomDatePicker from '../../../components/ui/CustomDatePicker';
import { shiftService } from '../../../service';

const emptyForm = {
    name: '',
    startTime: '',
    endTime: '',
    holidayList: '',
    enableAutoAttendance: false,
    determineCheckinCheckout: 'Alternating entries IN and OUT during the same shifts',
    workingHoursCalculation: 'First Check-in and last check-out',
    beginCheckinBefore: '',
    allowCheckoutAfter: '',
    workingHoursThresholdHalfDay: '',
    workingHoursThresholdAbsent: '',
    processAttendanceAfter: '',
    lastSyncOfCheckin: '',
    enableEntryGracePeriod: false,
    lateEntryGracePeriod: '',
    enableExitGracePeriod: false,
};

const ShiftTypeDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isNew = !id;

    const [formData, setFormData] = useState(emptyForm);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(!isNew);
    const [errorMessage, setErrorMessage] = useState('');

    const CHECKIN_CHECKOUT_OPTIONS = [
        "Alternating entries IN and OUT during the same shifts",
        "Strictly Based On Log Type Employee Check-In"
    ];

    const WORKING_HOURS_CALC_OPTIONS = [
        "First Check-in and last check-out",
        "Every Valid Check-in and Check-out"
    ];

    useEffect(() => {
        const loadShiftType = async () => {
            if (isNew) {
                setFormData(emptyForm);
                return;
            }

            setIsLoading(true);
            setErrorMessage('');

            const response = await shiftService.getShiftTypeById(id);
            if (response.success && response.data) {
                const shift = response.data;
                setFormData({
                    name: shift.name || '',
                    startTime: shift.startTime || '',
                    endTime: shift.endTime || '',
                    holidayList: shift.holidayList || '',
                    enableAutoAttendance: shift.enableAutoAttendance || false,
                    determineCheckinCheckout: shift.determineCheckinCheckout || CHECKIN_CHECKOUT_OPTIONS[0],
                    workingHoursCalculation: shift.workingHoursCalculation || WORKING_HOURS_CALC_OPTIONS[0],
                    beginCheckinBefore: shift.beginCheckinBefore?.toString() || '',
                    allowCheckoutAfter: shift.allowCheckoutAfter?.toString() || '',
                    workingHoursThresholdHalfDay: shift.workingHoursThresholdHalfDay || '',
                    workingHoursThresholdAbsent: shift.workingHoursThresholdAbsent || '',
                    processAttendanceAfter: shift.processAttendanceAfter || '',
                    lastSyncOfCheckin: shift.lastSyncOfCheckin || '',
                    enableEntryGracePeriod: shift.enableEntryGracePeriod || false,
                    lateEntryGracePeriod: shift.lateEntryGracePeriod?.toString() || '',
                    enableExitGracePeriod: shift.enableExitGracePeriod || false,
                });
            } else {
                setErrorMessage(response.message || 'Failed to load shift type.');
            }

            setIsLoading(false);
        };

        loadShiftType();
    }, [isNew, id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleDropdownChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const buildPayload = () => ({
        name: formData.name,
        startTime: formData.startTime,
        endTime: formData.endTime,
        holidayList: formData.holidayList || null,
        enableAutoAttendance: formData.enableAutoAttendance,
        determineCheckinCheckout: formData.determineCheckinCheckout,
        workingHoursCalculation: formData.workingHoursCalculation,
        beginCheckinBefore: formData.beginCheckinBefore
            ? Number(formData.beginCheckinBefore)
            : null,
        allowCheckoutAfter: formData.allowCheckoutAfter
            ? Number(formData.allowCheckoutAfter)
            : null,
        workingHoursThresholdHalfDay: formData.workingHoursThresholdHalfDay || null,
        workingHoursThresholdAbsent: formData.workingHoursThresholdAbsent || null,
        processAttendanceAfter: formData.processAttendanceAfter || null,
        lastSyncOfCheckin: formData.lastSyncOfCheckin || null,
        enableEntryGracePeriod: formData.enableEntryGracePeriod,
        lateEntryGracePeriod: formData.lateEntryGracePeriod
            ? Number(formData.lateEntryGracePeriod)
            : null,
        enableExitGracePeriod: formData.enableExitGracePeriod,
    });

    const handleSave = async () => {
        setErrorMessage('');

        if (!formData.name || !formData.startTime || !formData.endTime) {
            setErrorMessage('Name, start time, and end time are required.');
            return;
        }

        setIsSaving(true);
        const payload = buildPayload();

        const response = isNew
            ? await shiftService.createShiftType(payload)
            : await shiftService.updateShiftType(id, payload);

        setIsSaving(false);

        if (response.success) {
            navigate('/hrms/shift-type');
        } else {
            setErrorMessage(response.message || 'Failed to save shift type.');
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white px-6 py-6 mx-4 mt-4 rounded-xl">
                <p className="text-gray-500">Loading shift type...</p>
            </div>
        );
    }

    return (
        <div className="bg-white px-4 sm:px-4 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col">
             <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 shrink-0" style={{ fontFamily: '"Mulish", sans-serif' }}>
                <img
                    src="/images/arrow_left_alt.svg"
                    alt="Back"
                    className="w-3 h-3 cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => navigate('/hrms/shift-type')}
                />
                <span
                    className='cursor-pointer text-[#7D1EDB]'
                    onClick={() => navigate('/hrms/shift-type')}
                >
                    Shift Type
                </span>
                <ChevronRight size={14}/>
                <span className="text-[#6B7280]">{isNew ? 'Add Shift Type' : 'Edit Shift Type'}</span>
            </div>

            <div className="flex justify-between items-center mb-4 shrink-0">
                <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                    {isNew ? 'Add Shift Type' : 'Edit Shift Type'}
                </h1>

                <button
                    className="flex items-center justify-center gap-2 rounded-full py-2 px-3 text-white font-normal hover:bg-purple-700 transition-colors bg-[#7D1EDB] disabled:opacity-60"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    <span className='text-[16px] font-normal text-white' style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {isSaving ? 'Saving...' : 'Save'}
                    </span>
                </button>
            </div>

            {errorMessage && (
                <p className="text-sm text-red-500 mb-2">{errorMessage}</p>
            )}

            <div className="flex-1 w-full max-w-full overflow-y-auto pr-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                <div className="border border-[#D6D6D6] rounded-lg p-4 mb-3">
                    <div className="w-full grid grid-cols-1 md:grid-cols-[320px_1fr] gap-4">
                        <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">Shift Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Morning Shift"
                                className="w-[320px] border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB]"
                            />
                        </div>

                         <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">Start Time</label>
                            <div className="relative w-[320px]">
                                <input
                                    type="text"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    placeholder="9:00"
                                    className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB]"
                                />
                            </div>
                        </div>

                         <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">Holiday List</label>
                            <div className="w-[320px]">
                                <CustomDatePicker
                                    value={formData.holidayList}
                                    onChange={(date) => setFormData(prev => ({ ...prev, holidayList: date }))}
                                    placeholder="Select Date"
                                    className="w-full border border-[#E0E0E0] bg-white rounded-lg px-3 py-2 text-sm text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB]"
                                />
                            </div>
                        </div>

                         <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">End Time</label>
                            <div className="relative w-[320px]">
                                <input
                                    type="text"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleChange}
                                    placeholder="18:00"
                                    className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB]"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col pt-6">
                            <label className="flex items-center gap-2 cursor-pointer mb-1">
                                <input
                                    type="checkbox"
                                    name="enableAutoAttendance"
                                    checked={formData.enableAutoAttendance}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded border-[#1F1F1F] text-[#1E1E1E] focus:ring-0"
                                />
                                <span className="text-[16px] font-medium text-[#1E1E1E]">Enable Auto Attendance</span>
                            </label>
                            <p className="text-sm text-[#757575] ml-6">Mark attendance based on employee check-in for employees assigned to this shift</p>
                        </div>
                    </div>
                </div>

                <div className="border border-[#D6D6D6] rounded-lg p-4 mb-3">
                    <h2 className="text-[16px] font-semibold text-[#1E1E1E] mb-2" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Auto Attendance Settings</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                         <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">Determine Checkin and Checkout</label>
                            <FilterDropdown
                                options={CHECKIN_CHECKOUT_OPTIONS}
                                value={formData.determineCheckinCheckout}
                                onChange={(val) => handleDropdownChange('determineCheckinCheckout', val)}
                                className="w-full h-[38px] px-3 bg-white border border-[#E0E0E0] rounded-lg text-sm text-[#1F1F1F] focus:ring-1 focus:ring-[#7D1EDB] flex items-center justify-between"
                                showArrow={true}
                                dropdownWidth="100%"
                                align='left'
                                disableAllOption={true}
                            />
                        </div>

                         <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">Working Hours Threshold For Half Day</label>
                            <input
                                type="text"
                                name="workingHoursThresholdHalfDay"
                                value={formData.workingHoursThresholdHalfDay}
                                onChange={handleChange}
                                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB]"
                            />
                             <p className="text-sm text-[#757575] mt-1">Working hours below which half day is marked.(Zero to disable)</p>
                        </div>

                         <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">Working Hours Calculation Based On</label>
                            <FilterDropdown
                                options={WORKING_HOURS_CALC_OPTIONS}
                                value={formData.workingHoursCalculation}
                                onChange={(val) => handleDropdownChange('workingHoursCalculation', val)}
                                className="w-full h-[38px] px-3 bg-white border border-[#E0E0E0] rounded-lg text-sm text-[#1E1E1E] focus:ring-1 focus:ring-[#7D1EDB] flex items-center justify-between"
                                showArrow={true}
                                dropdownWidth="100%"
                                align='left'
                                disableAllOption={true}
                            />
                        </div>

                         <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">Working Hours Threshold For Absent</label>
                            <input
                                type="text"
                                name="workingHoursThresholdAbsent"
                                value={formData.workingHoursThresholdAbsent}
                                onChange={handleChange}
                                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB]"
                            />
                             <p className="text-sm text-[#757575] mt-1">Working hours below which absent is marked.(Zero to disable)</p>
                        </div>

                        <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">Begin Check-in Before Shift Starts Time(in minutes)</label>
                            <input
                                type="text"
                                name="beginCheckinBefore"
                                value={formData.beginCheckinBefore}
                                onChange={handleChange}
                                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB]"
                            />
                            <p className="text-sm text-[#757575] mt-1">The time before the shift start time during which employee check-in is considered for attendance</p>
                        </div>

                         <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">Process Attendance After</label>
                            <input
                                type="text"
                                name="processAttendanceAfter"
                                value={formData.processAttendanceAfter}
                                onChange={handleChange}
                                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB]"
                            />
                            <p className="text-sm text-[#757575] mt-1">Attendance will be marked automatically only after this date.</p>
                        </div>

                         <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">Allow Check-out After Shift End Time(in minutes)</label>
                            <input
                                type="text"
                                name="allowCheckoutAfter"
                                value={formData.allowCheckoutAfter}
                                onChange={handleChange}
                                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB]"
                            />
                            <p className="text-sm text-[#757575] mt-1">The time after the end of shift during which check-out is considered for attendance.</p>
                        </div>

                        <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">Last Sync Of Check-in</label>
                            <input
                                type="text"
                                name="lastSyncOfCheckin"
                                value={formData.lastSyncOfCheckin}
                                onChange={handleChange}
                                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB]"
                            />
                             <p className="text-sm text-[#757575] mt-1">Last unknown successful sync of employee checkin.</p>
                        </div>
                    </div>
                </div>

                <div className="border border-[#D6D6D6] rounded-lg p-4 mb-3">
                     <h2 className="text-[16px] font-medium text-[#1E1E1E] mb-2" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Grace Period Settings For Attendance</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                        <div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="enableEntryGracePeriod"
                                    checked={formData.enableEntryGracePeriod}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded border-[#1F1F1F] text-[#1E1E1E] focus:ring-0"
                                />
                                <span className="text-[16px] font-normal text-[#1E1E1E]">Enable Entry Grace Period</span>
                            </label>
                        </div>
                        <div className='hidden md:block'></div>

                         <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">Late Entry Grace Period</label>
                            <input
                                type="text"
                                name="lateEntryGracePeriod"
                                value={formData.lateEntryGracePeriod}
                                onChange={handleChange}
                                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB]"
                            />
                              <p className="text-[16px] text-[#1E1E1E] mt-1">The time after the shift start time when check-in is considered as late(in minutes)</p>
                        </div>
                     </div>
                </div>

                 <div className="border border-[#E0E0E0] rounded-lg p-4">
                     <h2 className="text-[16px] font-medium text-[#1E1E1E] mb-4" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Exit Grace Period</h2>
                     <div className="flex gap-8">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="enableExitGracePeriod"
                                checked={formData.enableExitGracePeriod}
                                onChange={handleChange}
                                className="w-4 h-4 rounded border-[#1F1F1F] text-[#1E1E1E] focus:ring-0"
                            />
                            <span className="text-[16px] font-normal text-[#1E1E1E]">Enable Exit Grace Period</span>
                        </label>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default ShiftTypeDetail;
