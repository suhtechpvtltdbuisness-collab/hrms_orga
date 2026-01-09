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
                    <div className="bg-white rounded-[20px] p-6 w-[500px] shadow-lg relative flex flex-col items-center">
                        <button onClick={handleCloseModals} className="absolute right-8 top-8">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black hover:text-gray-700">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                        <h2 className="text-[24px] font-bold text-black mb-3 mt-10" style={{ fontFamily: '"Inter", sans-serif' }}>Deactivate Profile</h2>
                        <p className="text-[#898989] text-[16px] font-normal mb-6" style={{ fontFamily: '"Inter", sans-serif' }}>Are you sure?</p>
                        <div className="flex gap-5 w-full">
                            <button
                                onClick={handleCloseModals}
                                className="flex-1 py-4 border border-[#7D1EDB] text-[#7D1EDB] rounded-full text-[16px] font-medium hover:bg-purple-50 transition-colors"
                                style={{ fontFamily: '"Inter", sans-serif' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDeactivate}
                                className="flex-1 py-4 bg-[#7D1EDB] text-white rounded-full text-[16px] font-medium hover:bg-[#6c1ac0] transition-colors"
                                style={{ fontFamily: '"Inter", sans-serif' }}
                            >
                                Confirm
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
