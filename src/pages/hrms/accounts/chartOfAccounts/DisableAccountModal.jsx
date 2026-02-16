import React from 'react';
import { X, AlertCircle } from 'lucide-react';

const DisableAccountModal = ({ isOpen, onClose, onConfirm, accountName }) => {
    if (!isOpen) return null;

    const handleOk = () => {
        if (onConfirm) {
            onConfirm();
        } else {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000040]">
            <div className="bg-white rounded-2xl w-[520px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 relative">
                
                <button 
                    onClick={onClose}
                    className="absolute top-3 right-3 text-[#000000] hover:text-[#000000] transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="p-4">
                    <div className="flex gap-3">
                         {/* Warning Icon */}
                        <div className="w-15 h-15 rounded-lg bg-[#FFF4EA] flex items-center justify-center shrink-0">
                            <AlertCircle className="text-[#FF8D28] w-10 h-10" />
                        </div>

                        <div className="flex-1"style={{ fontFamily: 'Inter, sans-serif' }}>
                            <h2 className="block text-[20px] font-semibold text-[#1E1E1E] mb-1" >
                                Account cannot be disabled
                            </h2>
                            <p className="text-[14px] text-[#15192080] mb-4 font-normal leading-relaxed">
                                This account has existing transactions that must be resolved before it can be disabled.
                            </p>
                        </div>
                    </div>

                    {/* Details Box */}
                    <div className="bg-[#F1F1F1] rounded-lg p-3 mb-4 w-[95%] mx-auto" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                        <h3 className="text-[16px] font-semibold text-[#1E1E1E] mb-1">
                            {accountName || 'Account'} has existing transactions
                        </h3>
                        <p className="text-[16px] text-[#15192080]">
                            Please clear all transactions linked to this account before disabling it.
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={onClose}
                            className="px-10 py-2 border border-[#7D1EDB] rounded-full text-[#7D1EDB] font-medium text-[16px] hover:bg-purple-50 transition-colors"
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleOk}
                            className="px-16 py-2 bg-[#7D1EDB] rounded-full text-white font-medium text-[16px] hover:bg-purple-700 transition-colors"
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                            Ok
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DisableAccountModal;
