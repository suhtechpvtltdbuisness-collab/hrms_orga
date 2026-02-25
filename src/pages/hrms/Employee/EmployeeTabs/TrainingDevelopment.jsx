import React from 'react';
import noRecordsImage from '../../../../assets/no-records.svg';

const TrainingDevelopment = ({ employeeId, employeeName }) => {
    const courseAssignments = [];

    return (
        <div className="h-full font-sans flex flex-col gap-2">
            {/* Employee Info Banner */}
            {employeeId && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-2">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {employeeName?.charAt(0)?.toUpperCase() || 'E'}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">{employeeName}</p>
                            <p className="text-xs text-gray-600">Employee ID: {employeeId}</p>
                        </div>
                    </div>
                </div>
            )}
            <h2 className="text-[16px] font-semibold text-[#1E1E1E]" style={{ fontFamily: '"Inter", sans-serif' }}>Training & Development</h2>

            <div className="bg-white py-[10px] px-0 rounded-xl flex flex-col mb-16">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[16px] font-base text-[#1E1E1E] leading-none tracking-normal" style={{ fontFamily: '"Inter", sans-serif' }}>Course Assignment</h3>
                </div>

                <div className="overflow-x-auto flex-1">
                    <table className="w-full border-separate border-spacing-0">
                        <thead className='h-[48px]'>
                            <tr className="bg-[#FFFFFF] text-[14px] p-[10px] gap-[10px]">
                                {['Sr no', 'Assigned Courses', 'Assigned Date', 'Assigned By', 'Required', 'Priority Level', 'Status'].map((header, index, arr) => (
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
                {courseAssignments.length === 0 && (
                    <div className="flex flex-col items-center justify-center pt-16 pb-8">
                        <img src={noRecordsImage} alt="No Records found" className="mb-6 w-full h-auto max-w-[426px]" />
                        <h3 className="text-[24px] font-medium text-black mb-2" style={{ fontFamily: '"Inter", sans-serif' }}>No Records found</h3>
                        <p className="text-[#B0B0B0] text-lg" style={{ fontFamily: '"Inter", sans-serif' }}>There are no records to show at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrainingDevelopment;
