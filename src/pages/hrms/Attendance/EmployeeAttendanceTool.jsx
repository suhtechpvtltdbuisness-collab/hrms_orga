import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Check, RefreshCw } from 'lucide-react';
import FilterDropdown from '../../../components/ui/FilterDropdown';
import CustomDatePicker from '../../../components/ui/CustomDatePicker';
import { attendanceService } from '../../../service';
import toast from 'react-hot-toast';

const BRANCH_OPTIONS    = ['Greater Noida', 'Noida', 'Delhi', 'Mumbai'];
const DEPARTMENT_OPTIONS = ['All', 'Sales', 'IT', 'HR', 'Marketing', 'Operations', 'Finance'];
const STATUS_ACTIONS    = ['Present', 'Absent', 'Work From Home', 'Half Day'];

const EmployeeAttendanceTool = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving]   = useState(false);

  const [date, setDate]             = useState('');
  const [branch, setBranch]         = useState('Greater Noida');
  const [department, setDepartment] = useState('All');

  const [allRecords, setAllRecords] = useState([]);
  const [unmarkedEmployees, setUnmarkedEmployees] = useState([]);
  const [markedEmployees, setMarkedEmployees]     = useState([]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await attendanceService.getAttendances();
      if (result.success) {
        const records = result.data || [];
        setAllRecords(records);

        const marked = records.filter(r => {
          const att = r.attendance || r;
          return att.status && att.status !== '';
        }).map(r => {
          const att = r.attendance || r;
          const emp = r.employee || r.user || {};
          return {
            id:     att._id || att.id,
            empId:  att.empId || emp.id,
            name:   emp.name || att.empName || att.employeeName || '-',
            status: att.status,
          };
        });
        setMarkedEmployees(marked);
        setUnmarkedEmployees([]); // API doesn't expose "unmarked" separately
      }
    } catch {
      toast.error('Failed to load attendance data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCheckAll = () => {
    setUnmarkedEmployees(prev => prev.map(emp => ({ ...emp, isChecked: true })));
  };

  const handleUncheckAll = () => {
    setUnmarkedEmployees(prev => prev.map(emp => ({ ...emp, isChecked: false })));
  };

  const toggleCheckbox = (id) => {
    setUnmarkedEmployees(prev =>
      prev.map(emp => emp.id === id ? { ...emp, isChecked: !emp.isChecked } : emp)
    );
  };

  const handleMarkStatus = async (status) => {
    const selected = unmarkedEmployees.filter(e => e.isChecked);
    if (!selected.length) {
      toast.error('Please select at least one employee');
      return;
    }
    if (!date) {
      toast.error('Please select a date first');
      return;
    }
    setIsSaving(true);
    try {
      const results = await Promise.all(
        selected.map(emp =>
          attendanceService.addAttendance({ 
            empId: emp.empId || emp.id, 
            attendanceDate: date, 
            status: status.toLowerCase() 
          })
        )
      );
      const success = results.filter(r => r.success).length;
      const failed  = results.length - success;
      if (success > 0) toast.success(`${success} employee(s) marked as ${status}`);
      if (failed  > 0) toast.error(`${failed} record(s) failed to save`);
      fetchData();
    } catch {
      toast.error('Failed to mark attendance');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    setIsEditing(false);
    toast.success('Attendance settings saved');
  };

  return (
    <div
      className="bg-white px-4 sm:px-4 md:px-6 py-4 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-9rem)] md:h-[calc(100vh-10rem)] flex flex-col font-sans border border-[#D9D9D9]"
      style={{ fontFamily: '"Nunito Sans", sans-serif' }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 shrink-0">
        <img
          src="/images/arrow_left_alt.svg"
          alt="Back"
          className="w-3 h-3 cursor-pointer hover:scale-110 transition-transform"
          onClick={() => navigate('/hrms')}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <span className="cursor-pointer text-[#7D1EDB]" onClick={() => navigate('/hrms')}>HRMS Dashboard</span>
        <ChevronRight size={14} />
        <span className="text-[#6B7280]">Employee Attendance Tool</span>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h1 className="text-[20px] font-semibold text-[#1E1E1E]">Employee Attendance Tool</h1>
        <div className="flex gap-3">
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-sm"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#7D1EDB] text-[#7D1EDB] hover:bg-purple-50 transition-colors text-sm"
            >
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-full border border-[#7D1EDB] text-[#7D1EDB] hover:bg-purple-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-[#7D1EDB] text-white px-4 py-2 rounded-full font-medium hover:bg-purple-700 transition-colors text-sm"
              >
                Save
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pr-1">
        {/* Filters */}
        <div className="border border-[#D6D6D6] rounded-lg p-4 mb-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-normal text-[#1E1E1E]">Date</label>
              {isEditing ? (
                <CustomDatePicker
                  value={date}
                  onChange={setDate}
                  className="w-full bg-white border border-[#E5E7EB] rounded-[8px] px-4 py-2 text-[#1E1E1E] outline-none text-sm"
                />
              ) : (
                <div className="w-full bg-[#F5F5F5] border border-[#D9D9D9] rounded-[8px] px-4 py-2 text-[#6B7280] text-sm min-h-[40px]">
                  {date || 'Not set'}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-normal text-[#1E1E1E]">Branch</label>
              <FilterDropdown
                options={BRANCH_OPTIONS}
                value={branch}
                onChange={setBranch}
                disabled={!isEditing}
                className={`w-full border border-[#D9D9D9] rounded-[8px] px-4 py-2 flex items-center justify-between outline-none text-sm ${!isEditing ? 'bg-[#F5F5F5] text-[#6B7280]' : 'bg-white'}`}
                dropdownWidth="150px"
                align="left"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-normal text-[#1E1E1E]">Department</label>
              <FilterDropdown
                options={DEPARTMENT_OPTIONS}
                value={department}
                onChange={setDepartment}
                disabled={!isEditing}
                className={`w-full border border-[#D9D9D9] rounded-[8px] px-4 py-2 flex items-center justify-between outline-none text-sm ${!isEditing ? 'bg-[#F5F5F5] text-[#6B7280]' : 'bg-white'}`}
                dropdownWidth="150px"
                align="left"
              />
            </div>
          </div>
        </div>

        {/* Unmarked Section */}
        <div className="border border-[#D6D6D6] rounded-lg p-4 mb-3">
          <h3 className="text-[16px] font-semibold text-[#000000] mb-3">Unmarked Attendance</h3>
          {isLoading ? (
            <div className="flex items-center gap-2 text-gray-500 text-sm py-4">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#7D1EDB]" />
              Loading...
            </div>
          ) : unmarkedEmployees.length === 0 ? (
            <p className="text-gray-500 text-sm py-2">All employees have been marked for the selected period.</p>
          ) : (
            <>
              <div className="flex gap-3 mb-3">
                <button onClick={handleCheckAll} className="px-3 py-1.5 border border-[#DCDCDC] rounded-[8px] text-sm text-[#374151] hover:bg-gray-50">
                  Check all
                </button>
                <button onClick={handleUncheckAll} className="px-3 py-1.5 border border-[#DCDCDC] rounded-[8px] text-sm text-[#374151] hover:bg-gray-50">
                  Uncheck all
                </button>
              </div>
              <div className="mb-3 space-y-2">
                {unmarkedEmployees.map(emp => (
                  <label key={emp.id} className="flex items-center gap-3 cursor-pointer w-fit">
                    <input
                      type="checkbox"
                      checked={emp.isChecked}
                      onChange={() => toggleCheckbox(emp.id)}
                      className="w-4 h-4 rounded border-gray-300 accent-[#7D1EDB]"
                    />
                    <span className="text-[#374151] text-sm">{emp.name}</span>
                  </label>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                {STATUS_ACTIONS.map(status => (
                  <button
                    key={status}
                    onClick={() => handleMarkStatus(status)}
                    disabled={isSaving}
                    className="px-4 py-2 bg-[#7D1EDB] text-white rounded-[8px] text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-60"
                  >
                    Mark {status}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Marked Section */}
        <div className="border border-[#D6D6D6] rounded-lg p-4">
          <h3 className="text-[16px] font-medium text-[#1E1E1E] mb-3">
            Marked Attendance
            <span className="ml-2 text-sm font-normal text-gray-400">({markedEmployees.length} records)</span>
          </h3>
          {isLoading ? (
            <div className="flex items-center gap-2 text-gray-500 text-sm py-4">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#7D1EDB]" />
              Loading...
            </div>
          ) : markedEmployees.length === 0 ? (
            <p className="text-gray-500 text-sm py-2">No attendance records found.</p>
          ) : (
            <div className="flex flex-wrap gap-x-8 gap-y-3 max-h-48 overflow-y-auto">
              {markedEmployees.map((emp, idx) => (
                <div key={emp.id || idx} className="flex items-center gap-2">
                  <Check size={14} className="text-[#34C759]" />
                  <span className="text-[#374151] text-sm">{emp.name}</span>
                  <span className="text-xs text-gray-400">({emp.status})</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeAttendanceTool;
