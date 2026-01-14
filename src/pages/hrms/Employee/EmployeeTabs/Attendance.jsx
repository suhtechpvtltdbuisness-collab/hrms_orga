import React from 'react';
import { Link } from 'react-router-dom';
import noRecordsImage from '../../../../assets/no-records.svg';

const Attendance = () => {
    // Mock data 
    const attendanceRecords = [];

    return (
        <div className="bg-white py-[16px] px-0 rounded-xl font-sans h-full flex flex-col" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-[16px] font-medium text-[#1E1E1E]">Recent attendance records</h2>
                <Link to="#" className="text-[#7D1EDB] font-medium hover:underline text-[16px] px-[16px]">
                    View All
                </Link>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto flex-1">
                <table className="w-full border-separate border-spacing-0">
                    <thead className='h-[48px]'>
                        <tr className="bg-[#FFFFFF] text-[14px] p-[10px] gap-[10px]">
                            {/* Table Headers */}
                            {['Sr no', 'Date', 'Status', 'In Time', 'Out Time', 'Total Hours', 'Remarks'].map((header, index, arr) => (
                                <th
                                    key={index}
                                    className={`py-2 px-4 text-left text-[14px] font-normal text-[#757575] whitespace-nowrap border-t border-b border-[#CECECE]
                                        ${index === 0 ? 'border-l rounded-l-[8px]' : ''}
                                        ${index === arr.length - 1 ? 'border-r rounded-r-[8px]' : ''}
                                    `}
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                </table>
            </div>
            {attendanceRecords.length === 0 && (
                <div className="flex flex-col items-center justify-center pt-16 pb-8">
                    <img
                        src={noRecordsImage}
                        alt="No Records found"
                        className="mb-6 w-full h-auto max-w-[501px]"
                    />
                    <h3 className="text-[24px] font-medium text-black mb-2" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>No Records found</h3>
                    <p className="text-[#B0B0B0] text-lg" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>There are no records to show at the moment.</p>
                </div>
            )}
        </div>
    );
};

export default Attendance;
