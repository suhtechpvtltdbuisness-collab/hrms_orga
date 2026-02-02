import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Calendar, Edit2, Check } from 'lucide-react';
import FilterDropdown from '../../../components/ui/FilterDropdown';
import CustomDatePicker from '../../../components/ui/CustomDatePicker';

const EmployeeAttendanceTool = () => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    
    // Form States
    const [date, setDate] = useState('26/01/2026');
    const [branch, setBranch] = useState('Greater Noida');
    const [department, setDepartment] = useState('Sales');

    // Attendance Data
    const [unmarkedEmployees, setUnmarkedEmployees] = useState([
        { id: 1, name: "Alice John", isChecked: true }
    ]);

    const [markedEmployees] = useState([
        { id: 2, name: "Mike Miller", status: "Present" },
        { id: 3, name: "John Smith", status: "Present" },
        { id: 4, name: "Nisha Gupta", status: "Present" },
        { id: 5, name: "Riya Singh", status: "Present" },
        { id: 6, name: "Carol White", status: "Present" },
    ]);

    const BRANCH_OPTIONS = ["Greater Noida", "Noida", "Delhi"];
    const DEPARTMENT_OPTIONS = ["Sales", "IT", "HR", "Marketing"];

    const handleCheckAll = () => {
        setUnmarkedEmployees(prev => prev.map(emp => ({ ...emp, isChecked: true })));
    };

    const handleUncheckAll = () => {
        setUnmarkedEmployees(prev => prev.map(emp => ({ ...emp, isChecked: false })));
    };

    const toggleCheckbox = (id) => {
        setUnmarkedEmployees(prev => prev.map(emp => 
            emp.id === id ? { ...emp, isChecked: !emp.isChecked } : emp
        ));
    };

    return (
        <div className="bg-white px-4 sm:px-4 md:px-6 py-4 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-9rem)] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-10rem)] xl:h-[calc(100vh-11rem)] flex flex-col font-sans border border-[#D9D9D9]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
            
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-4 text-sm text-gray-500 shrink-0">
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
                 <span className="text-[#6B7280]">Employee Attendance Tool</span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-6 shrink-0">
                <h1 className="text-[20px] font-semibold text-[#1E1E1E]">Employee Attendance Tool</h1>
                <div className="flex gap-4">
                     {!isEditing ? (
                         /* Edit Button */
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#7D1EDB] text-[#7D1EDB] hover:bg-purple-50 transition-colors"
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                            <span>Edit</span>
                            <img src="/images/pencil_Icon.svg" alt="Edit" />
                        </button>
                     ) : (
                        <>
                            {/* Cancel Button */}
                            <button 
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 rounded-full border border-[#7D1EDB] text-[#7D1EDB] hover:bg-purple-50 transition-colors"
                                style={{ fontFamily: 'Poppins, sans-serif' }}
                            >
                                Cancel
                            </button>
                            
                            {/* Save Button */}
                            <button 
                                onClick={() => setIsEditing(false)}
                                className="bg-[#7D1EDB] text-white px-4 py-2 rounded-full font-medium hover:bg-purple-700 transition-colors"
                                style={{ fontFamily: 'Poppins, sans-serif' }}
                            >
                                Save
                            </button>
                        </>
                     )}
                </div>
            </div>

            {/* Content Container */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                
                {/* Filters Section */}
                <div className="border border-[#D6D6D6] rounded-lg p-4 mb-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-[14px] font-normal text-[#1E1E1E]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Date</label>
                            {isEditing ? (
                                <CustomDatePicker
                                    value={date}
                                    onChange={setDate}
                                    className="w-full bg-white border border-[#E5E7EB] rounded-[8px] px-4 py-2 text-[#1E1E1E] outline-none"
                                />
                            ) : (
                                <div className="w-full bg-[#F5F5F5] border border-[#D9D9D9] rounded-[8px] px-4 py-2 text-[#6B7280]">
                                    {date}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[14px] font-normal text-[#1E1E1E]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Branch</label>
                             <FilterDropdown
                                options={BRANCH_OPTIONS}
                                value={branch}
                                onChange={setBranch}
                                disabled={!isEditing}
                                className={`w-full border border-[#D9D9D9] rounded-[8px] px-4 py-2 flex items-center justify-between outline-none ${!isEditing ? 'bg-[#F5F5F5] text-[#6B7280]' : 'bg-white'}`}
                                dropdownWidth="150px"
                                align="left"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[14px] font-normal text-[#1E1E1E]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Department</label>
                            <FilterDropdown
                                options={DEPARTMENT_OPTIONS}
                                value={department}
                                onChange={setDepartment}
                                disabled={!isEditing}
                                 className={`w-full border border-[#D9D9D9] rounded-[8px] px-4 py-2 flex items-center justify-between outline-none ${!isEditing ? 'bg-[#F5F5F5] text-[#6B7280]' : 'bg-white'}`}
                                dropdownWidth="150px"
                                align="left"
                            />
                        </div>
                    </div>
                </div>

                {/* Unmarked Attendance Section */}
                <div className="border border-[#D6D6D6] rounded-lg p-4 mb-3">
                    <h3 className="text-[16px] font-semibold text-[#000000] mb-2">Unmarked Attendance</h3>
                    
                    <div className="flex gap-4 mb-2">
                        <button onClick={handleCheckAll} className="px-2 py-1.5 border border-[#DCDCDC] rounded-[8px] text-sm text-[#374151] hover:bg-gray-50">Check all</button>
                        <button onClick={handleUncheckAll} className="px-2 py-1.5 border border-[#DCDCDC] rounded-[8px] text-sm text-[#374151] hover:bg-gray-50">Uncheck all</button>
                    </div>

                    <div className="mb-2">
                        {unmarkedEmployees.map(emp => (
                            <label key={emp.id} className="flex items-center gap-3 cursor-pointer w-fit">
                                <input 
                                    type="checkbox" 
                                    checked={emp.isChecked}
                                    onChange={() => toggleCheckbox(emp.id)}
                                    className="w-4 h-4 rounded border-gray-300 text-[#7D1EDB] focus:ring-[#7D1EDB]"
                                />
                                <span className="text-[#374151]">{emp.name}</span>
                            </label>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <button className="px-3 py-2 bg-[#85C3C2] text-white rounded-[8px] font-medium hover:bg-[#7bc0b0] transition-colors">Mark Present</button>
                        <button className="px-3 py-2 bg-[#85C3C2] text-white rounded-[8px] font-medium hover:bg-[#7baeb1] transition-colors">Mark Work From Home</button>
                        <button className="px-3 py-2 bg-[#EDC0F3] text-white rounded-[8px] font-medium hover:bg-[#d6add3] transition-colors">Mark Half Day</button>
                        <button className="px-3 py-2 bg-[#FF2D55] text-white rounded-[8px] font-medium hover:bg-[#e64363] transition-colors">Mark Absent</button>
                    </div>
                </div>

                {/* Marked Attendance Section */}
                <div className="border border-[#D6D6D6] rounded-lg p-6">
                    <h3 className="text-[16px] font-medium text-[#1E1E1E] mb-4">Marked Attendance</h3>
                    <div className="flex flex-wrap gap-x-12 gap-y-6">
                        {markedEmployees.map(emp => (
                            <div key={emp.id} className="flex items-center gap-3">
                                <Check size={16} className="text-[#1E1E1E]" />
                                <span className="text-[#374151]">{emp.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default EmployeeAttendanceTool;
