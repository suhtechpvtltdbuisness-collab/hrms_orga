import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import noRecordsImage from '../../../../assets/no-records.svg';
import { attendanceService, attendanceUtils } from '../../../../service';

const Attendance = ({ employeeId, employeeName, empId }) => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [fetchError, setFetchError] = useState(null);

    const resolvedEmpId = employeeId || empId;

    useEffect(() => {
        const fetchAttendance = async () => {
            if (!resolvedEmpId) return;

            setIsFetching(true);
            setFetchError(null);

            try {
                const res = await attendanceService.getAttendancesByEmployee(
                    Number(resolvedEmpId),
                );

                if (res.success) {
                    const records = (res.data || []).map((record, index) => ({
                        srNo: String(index + 1).padStart(2, '0'),
                        date: attendanceUtils.toDisplayDate(record.attendanceDate),
                        status: attendanceUtils.statusToUi(record.status),
                        inTime: '-',
                        outTime: '-',
                        totalHours: '-',
                        remarks: record.shift || '-',
                    }));
                    setAttendanceRecords(records);
                } else {
                    setFetchError(res.message || 'Failed to load attendance records.');
                    setAttendanceRecords([]);
                }
            } catch {
                setFetchError('Something went wrong while loading attendance records.');
                setAttendanceRecords([]);
            } finally {
                setIsFetching(false);
            }
        };

        fetchAttendance();
    }, [resolvedEmpId]);

    return (
        <div className="bg-white py-[16px] px-0 rounded-xl font-sans h-full flex flex-col" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {resolvedEmpId && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {employeeName?.charAt(0)?.toUpperCase() || 'E'}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">{employeeName}</p>
                            <p className="text-xs text-gray-600">Employee ID: {resolvedEmpId}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-[16px] font-medium text-[#1E1E1E]">Recent attendance records</h2>
                <Link to="/hrms/attendance" className="text-[#7D1EDB] font-medium hover:underline text-[16px] px-[16px]">
                    View All
                </Link>
            </div>

            {fetchError && (
                <p className="text-sm text-red-500 mb-4">{fetchError}</p>
            )}

            <div className="overflow-x-auto flex-1">
                <table className="w-full border-separate border-spacing-0">
                    <thead className='h-[48px]'>
                        <tr className="bg-[#FFFFFF] text-[14px] p-[10px] gap-[10px]">
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
                    <tbody>
                        {!isFetching && attendanceRecords.map((record) => (
                            <tr key={`${record.date}-${record.srNo}`}>
                                <td className="py-2 px-4 text-[14px]">{record.srNo}</td>
                                <td className="py-2 px-4 text-[14px]">{record.date}</td>
                                <td className="py-2 px-4 text-[14px]">{record.status}</td>
                                <td className="py-2 px-4 text-[14px]">{record.inTime}</td>
                                <td className="py-2 px-4 text-[14px]">{record.outTime}</td>
                                <td className="py-2 px-4 text-[14px]">{record.totalHours}</td>
                                <td className="py-2 px-4 text-[14px]">{record.remarks}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isFetching && (
                <p className="text-center text-gray-500 py-8">Loading attendance records...</p>
            )}

            {!isFetching && attendanceRecords.length === 0 && (
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
