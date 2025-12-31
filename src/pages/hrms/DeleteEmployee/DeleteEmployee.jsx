import React, { useState } from 'react';

const DeleteEmployee = () => {
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleDeactivateClick = () => {
        setShowDeactivateModal(true);
    };

    const handleConfirmDeactivate = () => {
        setShowDeactivateModal(false);
        setShowSuccessModal(true);
    };

    const handleCloseModals = () => {
        setShowDeactivateModal(false);
        setShowSuccessModal(false);
    };

    return (
        <>
            <div>
                <button
                    onClick={handleDeactivateClick}
                    className="bg-[#E90606] text-white px-6 py-3 rounded-full font-medium hover:bg-red-700 transition-colors shadow-sm"
                    style={{ fontFamily: '"Inter", sans-serif' }}
                >
                    Deactivate Profile
                </button>
            </div>

            {/* Deactivate Confirmation Modal */}
            {showDeactivateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-[20px] p-6 w-[400px] shadow-lg relative">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-[#1E1E1E]" style={{ fontFamily: '"Inter", sans-serif' }}>Deactivate Profile</h2>
                            <button onClick={handleCloseModals}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 hover:text-gray-700">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        <p className="text-[#898989] text-base font-medium mb-12 pb-10" style={{ fontFamily: '"Inter", sans-serif' }}>Are You Sure ?</p>
                        <div className="flex gap-4">
                            <button
                                onClick={handleCloseModals}
                                className="flex-1 py-2.5 border border-[#8A2BE2] text-[#8A2BE2] rounded-full font-medium hover:bg-purple-50 transition-colors"
                                style={{ fontFamily: '"Inter", sans-serif' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDeactivate}
                                className="flex-1 py-2.5 bg-[#8A2BE2] text-white rounded-full font-medium hover:bg-[#7a26c9] transition-colors"
                                style={{ fontFamily: '"Inter", sans-serif' }}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-[20px] p-8 w-[500px] shadow-lg relative flex flex-col items-center">
                        <button onClick={handleCloseModals} className="absolute right-6 top-6">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 hover:text-gray-700">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                        <div className="my-8 p-8">
                            <img src="/images/deactivateProfile.svg" alt="Success" className="h-32" />
                        </div>
                        <h2 className="text-[22px] font-bold text-[#1E1E1E] text-center w-[70%] leading-tight" style={{ fontFamily: '"Inter", sans-serif' }}>
                            Employee Deactivated Successfully
                        </h2>
                    </div>
                </div>
            )}
        </>
    );
};

export default DeleteEmployee;
