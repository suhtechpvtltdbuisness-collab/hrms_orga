import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Eye, Trash2, Square } from 'lucide-react';
import toast from 'react-hot-toast';

const ScheduleInterviewList = () => {
    const navigate = useNavigate();

    const [interviews, setInterviews] = useState([
        { id: 1, srNo: '01', name: 'Olivia Rhye', dateTime: '8 Jan, 10:00 AM', round: 'HR', status: 'Completed' },
        { id: 2, srNo: '02', name: 'Olivia Rhye', dateTime: '15 Jan, 10:00 AM', round: 'Technical', status: 'Scheduled' },
        { id: 3, srNo: '03', name: 'Olivia Rhye', dateTime: '20 Jan, 10:00 AM', round: 'HR', status: 'Result Pending' },
        { id: 4, srNo: '04', name: 'Olivia Rhye', dateTime: '24 Jan, 10:00 AM', round: 'Managerial', status: 'Send Offer Letter' },
        { id: 5, srNo: '05', name: 'Olivia Rhye', dateTime: '8 Feb, 10:00 AM', round: 'HR', status: 'Completed' },
        { id: 6, srNo: '06', name: 'Olivia Rhye', dateTime: '8 Feb, 10:00 AM', round: 'HR', status: 'Completed' },
        { id: 7, srNo: '07', name: 'Olivia Rhye', dateTime: '8 Feb, 10:00 AM', round: 'HR', status: 'Completed' },
        { id: 8, srNo: '08', name: 'Olivia Rhye', dateTime: '8 Feb, 10:00 AM', round: 'HR', status: 'Completed' },
        { id: 9, srNo: '09', name: 'Olivia Rhye', dateTime: '8 Feb, 10:00 AM', round: 'HR', status: 'Completed' },
        { id: 10, srNo: '10', name: 'Olivia Rhye', dateTime: '8 Feb, 10:00 AM', round: 'HR', status: 'Completed' },
    ]);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const handleDelete = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        const interviewToDelete = interviews.find(item => item.id === deleteId);
        setInterviews(prev => prev.filter(item => item.id !== deleteId));
        toast.success(`Interview for ${interviewToDelete.name} deleted successfully!`);
        setShowDeleteModal(false);
        setDeleteId(null);
    };

    const getStatusStyle = (status) => {
        const commonStyles = {
            height: '32px',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: '400',
            fontFamily: 'Poppins, sans-serif',
            lineHeight: '140%',
            textTransform: 'capitalize',
        };

        switch (status) {
            case 'Completed':
                return { 
                    ...commonStyles,
                    width: '104px',
                    backgroundColor: '#76DB1E33', 
                    color: '#34C759' 
                };
            case 'Scheduled':
                return { 
                    ...commonStyles,
                    width: '99px',
                    backgroundColor: '#0A74FF33', 
                    color: '#00C0E8' 
                };
            case 'Result Pending':
                return { 
                    ...commonStyles,
                    width: '127px',
                    backgroundColor: '#FF000033', 
                    color: '#FF383C' 
                };
            case 'Send Offer Letter':
                return { 
                    ...commonStyles,
                    width: '140px',
                    backgroundColor: '#FFEA0652', 
                    color: '#FFCC00',
                    gap: '10px'
                };
            default:
                return { 
                    ...commonStyles,
                    width: 'auto',
                    padding: '0 12px',
                    backgroundColor: '#E5E7EB', 
                    color: '#374151' 
                };
        }
    };

    return (
        <div 
            className="bg-white px-4 sm:px-6 md:px-8 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-9rem)] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-10rem)] xl:h-[calc(100vh-11rem)] overflow-y-auto" 
            style={{ fontFamily: 'Poppins, sans-serif' }}
        >
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-[#7D1EDB] mb-3">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/hrms')}>
                    <ArrowLeft size={14} className="text-gray-900" />
                    <span className="hover:text-purple-500"> HRMS Dashboard</span>
                </div>
                <ChevronRight size={16} className="mx-1 text-[#9CA3AF]" />
                <span className="text-[#667085] text-[14px]">Schedule Interview List</span>
            </div>

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                    Schedule Interview List
                </h1>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-gray-100 rounded-xl shadow-sm">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead>
                        <tr className="text-gray-500 border-b border-gray-100">
                            <th className="px-4 py-4 w-12"><Square size={16} className="text-[#7D1EDB]" /></th>
                            <th className="px-4 py-4 font-medium text-[12px] uppercase tracking-wider">SR NO</th>
                            <th className="px-4 py-4 font-medium text-[12px] uppercase tracking-wider">CANDIDATE NAME</th>
                            <th className="px-4 py-4 font-medium text-[12px] uppercase tracking-wider">DATE & TIME</th>
                            <th className="px-4 py-4 font-medium text-[12px] uppercase tracking-wider">ROUND</th>
                            <th className="px-4 py-4 font-medium text-[12px] uppercase tracking-wider">STATUS</th>
                            <th className="px-4 py-4 font-medium text-[12px] uppercase tracking-wider text-center">ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {interviews.map((interview) => (
                            <tr key={interview.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-4"><Square size={16} className="text-[#7D1EDB]" /></td>
                                <td className="px-4 py-4 text-gray-700">{interview.srNo}</td>
                                <td className="px-4 py-4">
                                    <span 
                                        className="text-[#7268FF] font-medium text-[15px] cursor-pointer hover:underline"
                                        style={{ fontFamily: 'Poppins, sans-serif' }}
                                    >
                                        {interview.name}
                                    </span>
                                </td>
                                <td className="px-4 py-4 text-gray-700">{interview.dateTime}</td>
                                <td className="px-4 py-4 text-gray-700">{interview.round}</td>
                                <td className="px-4 py-4">
                                    <span 
                                        className="inline-flex items-center justify-center font-medium"
                                        style={getStatusStyle(interview.status)}
                                    >
                                        {interview.status}
                                    </span>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center justify-center gap-3">
                                        <Eye 
                                            size={18} 
                                            className="text-[#7D1EDB] cursor-pointer hover:text-purple-700 transition-colors" 
                                            onClick={() => navigate(`/hrms/scheduled-interview/${interview.id}`)}
                                        />
                                        <Trash2 
                                            size={18} 
                                            className="text-[#D32F2F] cursor-pointer hover:text-red-700 transition-colors" 
                                            onClick={() => handleDelete(interview.id)}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl transform transition-all animate-in fade-in zoom-in duration-200">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                                <Trash2 size={32} className="text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Delete</h3>
                            <p className="text-gray-500 mb-8 leading-relaxed">
                                Are you sure you want to delete this interview record? This action cannot be undone.
                            </p>
                            <div className="flex gap-4 w-full">
                                <button 
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleConfirmDelete}
                                    className="flex-1 px-6 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 shadow-lg shadow-red-200 transition-all"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScheduleInterviewList;
