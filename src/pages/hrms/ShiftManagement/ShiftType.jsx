import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Plus, Search, Trash2, Edit } from 'lucide-react';
import { shiftService } from '../../../service';
import toast from 'react-hot-toast';

const ShiftType = () => {
    const navigate = useNavigate();
    const [shiftTypes, setShiftTypes] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchShiftTypes = async () => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const response = await shiftService.getShiftTypes();
            if (response.success) {
                setShiftTypes(response.data || []);
            } else {
                setShiftTypes([]);
                setErrorMessage(response.message || 'Failed to load shift types.');
            }
        } catch {
            setShiftTypes([]);
            setErrorMessage('Something went wrong while loading shift types.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchShiftTypes();
    }, []);

    const handleSelectRow = (id) => {
        setSelectedRows(prev => {
            if (prev.includes(id)) {
                return prev.filter(rowId => rowId !== id);
            }
            return [...prev, id];
        });
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete the shift type "${name}"?`)) {
            return;
        }
        try {
            const response = await shiftService.deleteShiftType(id);
            if (response.success) {
                toast.success(`Shift type "${name}" deleted successfully.`);
                fetchShiftTypes();
            } else {
                toast.error(response.message || 'Failed to delete shift type.');
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong while deleting.');
        }
    };

    const filteredShiftTypes = shiftTypes.filter(shift => 
        shift.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-white px-4 sm:px-4 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 shrink-0" style={{ fontFamily: '"Mulish", sans-serif' }}>
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
                <span className="text-[#6B7280]">Shift Type</span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-4 shrink-0">
                <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Shift Type</h1>

                <button
                    className="flex items-center justify-center gap-2 rounded-full py-2 px-4 text-white font-medium hover:bg-purple-700 transition-colors bg-[#7D1EDB] cursor-pointer"
                    onClick={() => navigate('/hrms/shift-type/new')}
                >
                    <span className='text-[16px] font-medium text-white' style={{ fontFamily: 'Poppins, sans-serif' }}>Add Shift Type</span>
                    <Plus size={18} />
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-4 items-center flex-wrap shrink-0" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                <div className="flex-1 min-w-[200px] relative">
                    <input 
                        type="text"
                        placeholder="Search shift name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 border border-[#CECECE] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#7D1EDB] text-sm"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
            </div>

            {errorMessage && (
                <p className="text-sm text-red-500 mb-2">{errorMessage}</p>
            )}

            {/* Table */}
            <div className="flex-1 min-h-0 overflow-y-auto border border-[#CECECE] rounded-lg">
                <table className="w-full relative border-collapse">
                    <thead className="sticky top-0 z-10 bg-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        <tr className="text-left text-[13px] border-b border-[#CECECE]">
                            <th className="py-3 px-6 text-[#757575] font-normal w-[5%]"></th>
                            <th className="py-3 px-6 text-[#757575] font-normal w-[30%]">Name</th>
                            <th className="py-3 px-6 text-[#757575] font-normal w-[20%] text-center">Start Time</th>
                            <th className="py-3 px-6 text-[#757575] font-normal w-[20%] text-center">End Time</th>
                            <th className="py-3 px-6 text-[#757575] font-normal w-[15%] text-center">Total Hours</th>
                            <th className="py-3 px-6 text-[#757575] font-normal w-[10%] text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="6" className="py-8 text-center text-gray-500">Loading shift types...</td>
                            </tr>
                        ) : filteredShiftTypes.length > 0 ? (
                            filteredShiftTypes.map((shift) => (
                                <tr key={shift.id} className="hover:bg-gray-50 transition-colors text-[13px] font-medium text-[#1E1E1E] border-b border-[#E5E7EB]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                                    <td className="py-3.5 px-6">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-[#1F1F1F] text-[#7D1EDB] focus:ring-[#7D1EDB]"
                                            checked={selectedRows.includes(shift.id)}
                                            onChange={() => handleSelectRow(shift.id)}
                                        />
                                    </td>
                                    <td className="py-3.5 px-6 text-gray-800">
                                        {shift.name}
                                    </td>
                                    <td className="py-3.5 px-6 text-center text-gray-600">{shift.startTime}</td>
                                    <td className="py-3.5 px-6 text-center text-gray-600">{shift.endTime}</td>
                                    <td className="py-3.5 px-6 text-center text-gray-600">{shift.totalHours}</td>
                                    <td className="py-3.5 px-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => navigate(`/hrms/shift-type/${shift.id}`)}
                                                className="p-1 text-[#7D1EDB] hover:bg-purple-50 rounded-md transition-colors cursor-pointer"
                                                title="Edit Shift Type"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(shift.id, shift.name)}
                                                className="p-1 text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                                                title="Delete Shift Type"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="py-8 text-center text-gray-400">No shift types found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ShiftType;
