import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import FilterDropdown from '../../../components/ui/FilterDropdown';
import CustomDatePicker from '../../../components/ui/CustomDatePicker';

const ShiftTypeDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const isNew = !id;

    // Initial state
    const [formData, setFormData] = useState({
        startTime: '9:00',
        endTime: '2:00',
        holidayList: '29/01/2026',
        enableAutoAttendance: false,
        
        // Auto Attendance Settings
        determineCheckinCheckout: 'Alternating entries IN and OUT during the same shifts',
        workingHoursCalculation: 'First Check-in and last check-out',
        beginCheckinBefore: '60',
        allowCheckoutAfter: '60',
        workingHoursThresholdHalfDay: '0.0',
        workingHoursThresholdAbsent: '0.0',
        processAttendanceAfter: '',
        lastSyncOfCheckin: '',

        // Grace Period Settings
        enableEntryGracePeriod: true,
        lateEntryGracePeriod: '15',
        enableExitGracePeriod: false
    });

    const CHECKIN_CHECKOUT_OPTIONS = [
        "Alternating entries IN and OUT during the same shifts",
        "Strictly Based On Log Type Employee Check-In"
    ];

    const WORKING_HOURS_CALC_OPTIONS = [
        "First Check-in and last check-out",
        "Every Valid Check-in and Check-out"
    ];

    useEffect(() => {
        if (isNew) {
            // Reset form for new entry
            setFormData({
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
                enableExitGracePeriod: false
            });
        } else {
        }
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

    return (
        <div className="bg-white px-4 sm:px-4 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col">
             {/* Breadcrumb */}
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
                <span className="text-[#6B7280]">Auto Attendance</span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-4 shrink-0">
                <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Auto Attendance</h1>
                
                <button
                    className="flex items-center justify-center gap-2 rounded-full py-2 px-3 text-white font-normal hover:bg-purple-700 transition-colors bg-[#7D1EDB]"
                    onClick={() => navigate('/hrms/shift-type')}
                >
                    <span className='text-[16px] font-normal text-white' style={{ fontFamily: 'Poppins, sans-serif' }}>Save</span>
                </button>
            </div>

            {/* Form Content */}
            <div className="flex-1 w-full max-w-full overflow-y-auto pr-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                <div className="border border-[#D6D6D6] rounded-lg p-4 mb-3">
                    <div className="w-full grid grid-cols-1 md:grid-cols-[320px_1fr] gap-4">
                         {/* Start Time */}
                         <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">Start Time</label>
                            <div className="relative w-[320px]">
                                <input 
                                    type="text"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB]"
                                />
                            </div>
                        </div>

                         {/* Holiday List */}
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

                         {/* End Time */}
                         <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">End Time</label>
                            <div className="relative w-[320px]">
                                <input 
                                    type="text"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleChange}
                                    className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB]"
                                />
                            </div>
                        </div>

                        {/* Enable Auto Attendance */}
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
                            <p className="text-sm text-[#757575] ml-6">Mark attendance based on employee checkin for employee for employees assigned to this shift</p>
                        </div>
                    </div>
                </div>

                {/* Auto Attendance Settings Section */}
                <div className="border border-[#D6D6D6] rounded-lg p-4 mb-3">
                    <h2 className="text-[16px] font-semibold text-[#1E1E1E] mb-2" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Auto Attendance Settings</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                         {/* Determine Checkin and Checkout */}
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

                         {/* Working Hours Threshold For Half Day */}
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

                        {/* Working Hours Calculation Based On */}
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

                         {/* Working Hours Threshold For Absent */}
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

                        {/* Begin Check-in Before Shift Starts Time */}
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

                         {/* Process Attendance After */}
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

                         {/* Allow Check-out After Shift End Time */}
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

                        {/* Last Sync Of Check-in */}
                        <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">Last Sync Of Check-in</label>
                            <input 
                                type="text"
                                name="lastSyncOfCheckin"
                                value={formData.lastSyncOfCheckin}
                                onChange={handleChange}
                                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB]"
                            />
                             <p className="text-sm text-[#757575] mt-1">Last unknown successful sync of employee checkin. Reset this only if you are sure that all logs are sync from all the locations. Please don't modify this if you are unsure.</p>
                        </div>

                    </div>
                </div>

                {/* Grace Period Settings For Attendance */}
                <div className="border border-[#D6D6D6] rounded-lg p-4 mb-3">
                     <h2 className="text-[16px] font-medium text-[#1E1E1E] mb-2" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Grace Period Settings For Attendance</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                        
                         {/* Enable Entry Grace Period */}
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

                         {/* Late Entry Grace Period */}
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

                 {/* Extra Grace Period Settings*/}
                 <div className="border border-[#E0E0E0] rounded-lg p-4">
                     <h2 className="text-[16px] font-medium text-[#1E1E1E] mb-4" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Grace Period Settings For Attendance</h2>
                     <div className="flex gap-8">
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
