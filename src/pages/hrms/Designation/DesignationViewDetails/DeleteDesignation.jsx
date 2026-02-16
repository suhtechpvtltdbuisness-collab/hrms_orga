
import React, { useState } from 'react';
import { X } from 'lucide-react';

const DeleteDesignation = ({ onDelete, onCancel }) => {
    const [showConfirmModal, setShowConfirmModal] = useState(true);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);

    const handleConfirmDelete = () => {
        const isSuccess = true;

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
        if (onDelete) onDelete();
    };

    const handleCloseError = () => {
        setShowErrorModal(false);
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
                            <h2 className="text-[24px] font-semibold text-[#000000] text-center leading-tight">Deactivate Designation</h2>
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
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div
                    className="fixed inset-0 bg-[#3B3A3A82] z-60 flex justify-center items-start pt-20 font-sans"
                    style={{ fontFamily: "Inter, sans-serif" }}
                >
                    <div className="bg-white rounded-2xl p-8 w-[90%] max-w-[550px] shadow-2xl relative">
                        <button
                            onClick={handleCloseSuccess}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex items-center gap-5">
                            <div className="shrink-0">
                                <img
                                    src="/images/sucess_check.svg"
                                    alt="Success"
                                    className="w-[60px] h-[60px]"
                                />
                            </div>
                            <div className="text-left">
                                <h2 className="text-[20px] font-semibold text-[#000000] mb-4 leading-tight">
                                    Designation Deleted Successfully
                                </h2>
                                <p className="text-[14px] text-[#15192080] font-light">
                                    The selected designation was deleted successfully.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Modal */}
            {showErrorModal && (
                <div
                    className="fixed inset-0 bg-[#3B3A3A82] z-60 flex justify-center items-start pt-20 font-sans"
                    style={{ fontFamily: "Inter, sans-serif" }}
                >
                    <div className="bg-white rounded-2xl p-8 w-[90%] max-w-[550px] shadow-2xl relative">
                        <button
                            onClick={handleCloseError}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex items-center gap-5">
                            <div className="shrink-0">
                                <img
                                    src="/images/Failed_error.svg"
                                    alt="Error"
                                    className="w-[60px] h-[60px]"
                                />
                            </div>
                            <div className="text-left">
                                <h2 className="text-[20px] font-semibold text-[#000000] mb-4 leading-tight">
                                    Designation could not be Deleted
                                </h2>
                                <p className="text-[14px] text-[15192080] font-light">
                                    The selected designation was unable to delete.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeleteDesignation;
