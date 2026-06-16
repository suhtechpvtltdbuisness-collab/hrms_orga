import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import CustomDatePicker from '../../../components/ui/CustomDatePicker';
import FilterDropdown from '../../../components/ui/FilterDropdown';

const NewShiftRequest = () => {
    const navigate = useNavigate();

    // Retrieve user data & default values
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const defaultEmpId = userData.empId || userData.id || userData._id || "EMP-0123";
    const defaultEmpName = userData.name || "Mike Miller";

    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [shiftType, setShiftType] = useState('Day');
    const [empId, setEmpId] = useState(defaultEmpId);
    const [employeeName, setEmployeeName] = useState(defaultEmpName);
    const [comment, setComment] = useState("");

    const handleSubmit = () => {
        if (!fromDate || !toDate) {
            alert("Please select both From Date and To Date.");
            return;
        }
        if (!employeeName.trim() || !empId.trim()) {
            alert("Please provide Employee Name and Employee ID.");
            return;
        }

        const formatDateStr = (date) => {
            if (!date) return "";
            const d = new Date(date);
            return d.toLocaleDateString('en-GB'); // dd/mm/yyyy
        };

        const newRequest = {
            id: Date.now(),
            employeeName: employeeName,
            employeeId: empId,
            fromDate: formatDateStr(fromDate),
            toDate: formatDateStr(toDate),
            status: "Submitted",
            shiftType: shiftType,
            comment: comment
        };

        // Load existing
        let currentRequests = [];
        const stored = localStorage.getItem("hrms_shift_requests");
        if (stored) {
            try {
                currentRequests = JSON.parse(stored);
            } catch (e) {
                console.error("Failed to parse existing shift requests:", e);
            }
        } else {
            // Seed defaults
            currentRequests = [
                { id: 1, employeeName: "Alice John", status: "Submitted", shiftType: "Day" },
                { id: 2, employeeName: "Carol White", status: "Submitted", shiftType: "Day" },
                { id: 3, employeeName: "Mike Miller", status: "Submitted", shiftType: "Day" },
            ];
        }

        const updatedRequests = [newRequest, ...currentRequests];
        localStorage.setItem("hrms_shift_requests", JSON.stringify(updatedRequests));

        navigate('/hrms/shift-request');
    };

    return (
        <div className="bg-white px-4 sm:px-4 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col">
            
            {/* Breadcrumb */}
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

            {/* Header */}
            <h1 className="text-[20px] font-semibold text-[#494949] mb-4 shrink-0" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>New Shift Request</h1>

            <div className="flex-1 overflow-y-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
                <div className="border border-[#D6D6D6] rounded-lg p-4 mb-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        
                        {/* Shift Type */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[14px] font-normal text-[#1E1E1E]">Shift Type</label>
                            <FilterDropdown
                                options={["Day", "Night", "Evening"]}
                                value={shiftType}
                                onChange={setShiftType}
                                className="w-full h-11 px-4 bg-white border border-[#D6D6D6] rounded-lg text-[#1E1E1E] focus:ring-1 focus:ring-[#7D1EDB] flex items-center justify-between"
                                showArrow={true}
                                placeholder="Select Shift"
                                dropdownWidth="150px"
                                align='right'
                            />
                        </div>

                        {/* Employee ID */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[14px] font-normal text-[#1E1E1E]">Employee ID</label>
                            <input 
                                type="text"
                                value={empId}
                                onChange={(e) => setEmpId(e.target.value)}
                                className="w-full h-11 px-4 border border-[#D6D6D6] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#7D1EDB]"
                            />
                        </div>

                        {/* Employee Name */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[14px] font-normal text-[#1E1E1E]">Employee Name</label>
                            <input 
                                type="text"
                                value={employeeName}
                                onChange={(e) => setEmployeeName(e.target.value)}
                                className="w-full h-11 px-4 border border-[#D6D6D6] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#7D1EDB]"
                            />
                        </div>

                        {/* From Date */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[14px] font-normal text-[#1E1E1E]">From Date</label>
                            <CustomDatePicker 
                                value={fromDate} 
                                onChange={setFromDate} 
                                placeholder="26/01/2026"
                                className="w-full h-11 bg-white"
                            />
                        </div>

                        {/* To Date */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[14px] font-normal text-[#1E1E1E]">To Date</label>
                            <CustomDatePicker 
                                value={toDate} 
                                onChange={setToDate} 
                                placeholder="29/01/2026"
                                className="w-full h-11 bg-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Comment Section */}
                <div className="border border-[#CECECE] rounded-lg p-4 mb-4">
                    <h3 className="text-[16px] font-medium text-[#1E1E1E] mb-2">Add a comment</h3>
                    <textarea 
                        placeholder="Enter comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full h-24 p-3 border border-[#D6D6D6] rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-[#7D1EDB]"
                    ></textarea>
                </div>

                {/* Submit & Cancel Buttons */}
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
                        className="px-6 py-2 bg-[#7D1EDB] hover:bg-purple-700 text-white rounded-full text-sm font-semibold transition-colors"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        Submit Request
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewShiftRequest;
