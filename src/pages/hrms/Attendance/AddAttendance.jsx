
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import FilterDropdown from '../../../components/ui/FilterDropdown';
import CustomDatePicker from '../../../components/ui/CustomDatePicker';
import {
  attendanceService,
  attendanceUtils,
  employeeService,
} from '../../../service';

const AddAttendance = () => {
  const navigate = useNavigate();
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    series: '',
    date: '',
    employee: '',
    employeeId: '',
    employeeName: '',
    status: '',
    leaveType: '',
    department: '',
    shift: '',
    lateEntry: false,
    earlyExit: false,
  });

  const STATUS_OPTIONS = ["Present", "Absent", "Leave", "Half Day"];
  const LEAVE_TYPE_OPTIONS = ["Sick Leave", "Personal Leave"];
  const SHIFT_OPTIONS = ["Morning", "Night", "Evening"];

  useEffect(() => {
    const initForm = async () => {
      const seriesRes = await attendanceService.getNextSeries();
      if (seriesRes.success) {
        setFormData((prev) => ({
          ...prev,
          series: seriesRes.data?.series || '',
        }));
      }

      try {
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        const adminId = userData.id;
        if (!adminId) return;

        const response = await employeeService.getAllEmployeesByAdminId(adminId);
        if (response.success && Array.isArray(response.data)) {
          const options = response.data
            .filter((item) => item.user?.id)
            .map((item) => ({
              label: `${item.user.name} (EMP-${String(item.user.id).padStart(3, '0')})`,
              value: String(item.user.id),
            }));
          setEmployeeOptions(options);
        }
      } catch {
        setErrorMessage('Failed to load employees.');
      }
    };

    initForm();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleDropdownChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmployeeChange = async (empId) => {
    setFormData((prev) => ({
      ...prev,
      employee: empId,
      employeeId: empId,
      employeeName: '',
      department: '',
      shift: '',
    }));

    if (!empId) return;

    const response = await attendanceService.getEmployeeInfo(Number(empId));
    if (response.success) {
      setFormData((prev) => ({
        ...prev,
        employee: empId,
        employeeId: empId,
        employeeName: response.data?.empName || '',
        department: response.data?.departmentName || '',
        shift: response.data?.shift || prev.shift,
      }));
    }
  };

  const handleSave = async () => {
    setErrorMessage('');

    if (!formData.employeeId || !formData.date || !formData.status) {
      setErrorMessage('Employee, attendance date, and status are required.');
      return;
    }

    if (formData.status === 'Leave' && !formData.leaveType) {
      setErrorMessage('Leave type is required when status is Leave.');
      return;
    }

    const apiStatus = attendanceUtils.statusToApi(formData.status);
    const payload = {
      empId: Number(formData.employeeId),
      attendanceDate: attendanceUtils.toApiDate(formData.date),
      status: apiStatus,
      shift: formData.shift || null,
      lateEntry: formData.lateEntry,
      earlyExit: formData.earlyExit,
    };

    if (apiStatus === 'on_leave') {
      payload.leaveType = attendanceUtils.leaveTypeToApi(formData.leaveType);
    }

    setIsSaving(true);
    const response = await attendanceService.createAttendance(payload);
    setIsSaving(false);

    if (response.success) {
      navigate('/hrms/attendance');
    } else {
      setErrorMessage(response.message || 'Failed to save attendance.');
    }
  };

  return (
    <div className="bg-white px-4 sm:px-4 md:px-6 py-4 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-9rem)] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-10rem)] xl:h-[calc(100vh-11rem)] flex flex-col font-sans border border-[#D9D9D9]" style={{ fontFamily: 'Poppins, sans-serif' }}>

        <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 shrink-0" style={{ fontFamily: '"Mulish", sans-serif' }}>
             <img
                src="/images/arrow_left_alt.svg"
                alt="Back"
                className="w-3 h-3 cursor-pointer hover:scale-110 transition-transform"
                onClick={() => navigate('/hrms/attendance')}
             />
             <span
                className='cursor-pointer text-[#7D1EDB]'
                onClick={() => navigate('/hrms/attendance')}
             >
                Attendance
             </span>
             <ChevronRight size={14}/>
             <span className="text-[#6B7280]">Add Attendance</span>
        </div>

        <div className="flex justify-between items-center mb-2 shrink-0">
            <h1 className="text-[20px] font-semibold text-[#1E1E1E]">Add Attendance</h1>
            <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-[#7D1EDB] text-white px-4 py-2.5 rounded-full font-normal hover:bg-purple-700 transition-colors disabled:opacity-60"
                style={{ borderRadius: '26px' }}
            >
                {isSaving ? 'Saving...' : 'Save'}
            </button>
        </div>

        {errorMessage && (
          <p className="text-sm text-red-500 mb-2">{errorMessage}</p>
        )}

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            <div className="border border-[#D6D6D6] rounded-lg p-4 mb-4">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                     <div className="flex flex-col gap-2">
                        <label className="text-[14px] font-normal text-[#1E1E1E]" style={{ fontFamily: 'Inter, sans-serif' }}>Series</label>
                        <input
                            type="text"
                            value={formData.series}
                            disabled
                            className="w-full bg-[#F3F4F6] border border-[#E5E7EB] rounded-[8px] px-4 py-2 text-[#6B7280] outline-none"
                        />
                     </div>

                     <div className="flex flex-col gap-2 relative">
                        <label className="text-[14px] font-normal text-[#1E1E1E]" style={{ fontFamily: 'Inter, sans-serif' }}>Attendance Date</label>
                        <CustomDatePicker
                            value={formData.date}
                            onChange={(date) => handleDropdownChange('date', date)}
                            placeholder="Select date"
                            className="w-full bg-white border border-[#E5E7EB] rounded-[8px] px-4 py-2 text-[#1E1E1E] outline-none"
                        />
                     </div>

                     <div className="flex flex-col gap-2">
                        <label className="text-[14px] font-normal text-[#1E1E1E]" style={{ fontFamily: 'Inter, sans-serif' }}>Employee</label>
                        <FilterDropdown
                            options={employeeOptions}
                            value={formData.employeeId}
                            onChange={handleEmployeeChange}
                            placeholder="Select employee"
                            className="w-full bg-white border border-[#E5E7EB] rounded-[8px] px-4 py-2 flex items-center justify-between outline-none"
                            dropdownWidth="150px"
                            align="right"
                            optionFontFamily="'Nunito Sans', sans-serif"
                        />
                     </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="flex flex-col gap-2">
                        <label className="text-[14px] font-normal text-[#1E1E1E]" style={{ fontFamily: 'Inter, sans-serif' }}>Employee Name</label>
                        <input
                            type="text"
                            name="employeeName"
                            value={formData.employeeName}
                            onChange={handleInputChange}
                            className="w-full bg-[#F3F4F6] border border-[#E5E7EB] rounded-[8px] px-4 py-2 outline-none"
                            disabled
                        />
                     </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-[14px] font-normal text-[#1E1E1E]" style={{ fontFamily: 'Inter, sans-serif' }}>Status</label>
                        <FilterDropdown
                            options={STATUS_OPTIONS}
                            value={formData.status}
                            onChange={(val) => handleDropdownChange('status', val)}
                            placeholder="Select status"
                            className="w-full bg-white border border-[#E5E7EB] rounded-[8px] px-4 py-2 flex items-center justify-between outline-none"
                            dropdownWidth="150px"
                            align="right"
                            optionFontFamily="'Nunito Sans', sans-serif"
                        />
                     </div>

                     <div className="flex flex-col gap-2">
                        <label className="text-[14px] font-normal text-[#1E1E1E]" style={{ fontFamily: 'Inter, sans-serif' }}>Department</label>
                         <input
                            type="text"
                            name="department"
                            value={formData.department}
                            disabled
                            className="w-full bg-[#F3F4F6] border border-[#E5E7EB] rounded-[8px] px-4 py-2 outline-none"
                        />
                     </div>
                </div>

                {formData.status === 'Leave' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[14px] font-normal text-[#1E1E1E]" style={{ fontFamily: 'Inter, sans-serif' }}>Leave Type</label>
                      <FilterDropdown
                          options={LEAVE_TYPE_OPTIONS}
                          value={formData.leaveType}
                          onChange={(val) => handleDropdownChange('leaveType', val)}
                          placeholder="Select leave type"
                          className="w-full bg-white border border-[#E5E7EB] rounded-[8px] px-4 py-2 flex items-center justify-between outline-none"
                          dropdownWidth="150px"
                          align="right"
                          optionFontFamily="'Nunito Sans', sans-serif"
                      />
                    </div>
                  </div>
                )}
            </div>

            <div className="border border-[#D6D6D6] rounded-lg p-4">
                <h2 className="text-[16px] font-medium text-[#1E1E1E] mb-4">Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                     <div className="flex flex-col gap-2">
                        <label className="text-[14px] font-normal text-[#1E1E1E]" style={{ fontFamily: 'Inter, sans-serif' }}>Shift</label>
                         <FilterDropdown
                            options={SHIFT_OPTIONS}
                            value={formData.shift}
                            onChange={(val) => handleDropdownChange('shift', val)}
                            placeholder="Select shift"
                            className="w-full bg-white border border-[#E5E7EB] rounded-[8px] px-4 py-2 flex items-center justify-between outline-none"
                            dropdownWidth="150px"
                            align="right"
                            optionFontFamily="'Nunito Sans', sans-serif"
                        />
                     </div>

                     <div className="flex items-center gap-6 mt-6">
                         <label className="flex items-center gap-2 cursor-pointer">
                             <input
                                type="checkbox"
                                name="lateEntry"
                                checked={formData.lateEntry}
                                onChange={handleInputChange}
                                className="w-4 h-4 rounded border-gray-300 text-[#7D1EDB] focus:ring-[#7D1EDB]"
                             />
                             <span className="text-[14px] text-[#1E1E1E]">Late Entry</span>
                         </label>

                         <label className="flex items-center gap-2 cursor-pointer">
                             <input
                                type="checkbox"
                                name="earlyExit"
                                checked={formData.earlyExit}
                                onChange={handleInputChange}
                                 className="w-4 h-4 rounded border-gray-300 text-[#7D1EDB] focus:ring-[#7D1EDB]"
                             />
                             <span className="text-[14px] text-[#1E1E1E]">Early Exit</span>
                         </label>
                     </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default AddAttendance;
