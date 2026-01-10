import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const ErrorModal = ({ isOpen, onClose, message = "Department could not be saved", subMessage = "Changes were not saved." }) => {

    // Optional: Auto close for error modal too? usually errors stay until dismissed. 
    // Allowing 3 seconds for now or manual close.
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-[#3B3A3A82] z-60 flex justify-center items-center font-sans" style={{ fontFamily: 'Inter, sans-serif' }}>
            <div className="bg-white rounded-2xl p-8 w-[90%] max-w-[550px] shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1"
                >
                    <X size={20} />
                </button>

                <div className="flex items-center gap-5">
                    <div className="shrink-0">
                        <img src="/images/Failed_error.svg" alt="Error" className="w-[60px] h-[60px]" />
                    </div>
                    <div className="text-left">
                        <h2 className="text-[20px] font-semibold text-[#000000] mb-4 leading-tight">{message}</h2>
                        <p className="text-[14px] text-[#000000] font-light">{subMessage}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorModal;
