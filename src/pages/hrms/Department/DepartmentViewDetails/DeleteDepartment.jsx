
import React, { useState } from 'react';
import { X } from 'lucide-react';

const DeleteDepartment = ({ onDelete, onCancel }) => {
    const [showConfirmModal, setShowConfirmModal] = useState(true);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);

    const handleConfirmDelete = () => {
        // Simulate API call or deletion logic here
        // For now, we'll just simulate success with a timeout or direct state change
        // In a real app, you'd await the API call result
        const isSuccess = true; // Replace with actual logic

        if (isSuccess) {
            setShowConfirmModal(false);
            setShowSuccessModal(true);
        } else {
            setShowConfirmModal(false);
            setShowErrorModal(true);
        }
    };

    const handleCloseSuccess = () => {
        setShowSuccessModal(false);
        if (onDelete) onDelete(); // Notify parent of completion
    };

    const handleCloseError = () => {
        setShowErrorModal(false);
        // Maybe reopen confirm or just close?
        if (onCancel) onCancel();
    };

    return (
        <div style={{ fontFamily: 'Poppins, Nunito-sans' }}>
            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-[20px] p-6 w-[520px] h-[252px] relative flex flex-col items-center">
                        <button onClick={onCancel} className="absolute right-6 top-6 text-black hover:text-gray-600">
                            <X size={20} />
                        </button>

                        <div className="w-full flex flex-col items-center mt-14 mb-8">
                            <h2 className="text-[24px] font-semibold text-[#000000] text-center leading-tight">Delete Department</h2>
                            <p className="text-[#15192080] text-[14px] font-base mt-3 text-center">Are you sure?</p>
                        </div>

                        <div className="flex gap-4 w-full h-[252px]">
                            <button
                                onClick={onCancel}
                                className="flex-1 py-3 border border-[#8A2BE2] text-[#8A2BE2] rounded-full font-normal hover:bg-[#EEECFF]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="flex-1 py-3 bg-[#7D1EDB] text-white text-[16px] rounded-full font-base hover:bg-[#7a26c9]"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-[20px] p-8 w-[500px] shadow-lg relative flex flex-col items-center">
                        <button onClick={handleCloseSuccess} className="absolute right-6 top-6">
                            <X size={24} className="text-gray-500 hover:text-gray-700" />
                        </button>
                        <div className="my-6">
                            <img src="/images/success.svg" alt="Success" className="h-24 w-24" />
                        </div>
                        <h2 className="text-[24px] font-semibold text-[#000000] font-Poppins text-center w-full leading-tight mb-2">
                            Department Deleted Successfully!
                        </h2>
                        <p className="text-[#15192080] text-[16px] font-light  font-Nunito-sans text-center">The selected department was deleted successfully.</p>
                    </div>
                </div>
            )}

            {/* Error Modal */}
            {showErrorModal && (
                <div className="fixed inset-0 bg-[#3B3A3A82] z-60 flex justify-center items-center font-sans" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <div className="bg-white rounded-2xl p-8 w-[90%] max-w-[550px] shadow-2xl relative">
                        <button
                            onClick={handleCloseError}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex items-center gap-5">
                            <div className="shrink-0">
                                <img src="/images/Failed_error.svg" alt="Error" className="w-[60px] h-[60px]" />
                            </div>
                            <div className="text-left">
                                <h2 className="text-[20px] font-semibold text-[#000000] mb-4 leading-tight">Failed To Delete Department</h2>
                                <p className="text-[14px] text-[#000000] font-light">Department deletion failed.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeleteDepartment;
