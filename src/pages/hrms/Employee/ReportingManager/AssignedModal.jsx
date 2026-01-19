import React from 'react';
import { X } from 'lucide-react';

const AssignedModal = ({ isOpen, onClose, onOk, onViewTeam }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#100F0F59] font-sans" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
      <div className="bg-white rounded-[20px] w-[90%] max-w-[500px] p-8 relative shadow-2xl flex flex-col items-center text-center">
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
            <X size={20} className="text-[#667085]" />
        </button>

        <h2 className="text-[24px] font-semibold text-[#1E1E1E] mt-6 mb-8" style={{ fontFamily: '"Poppins", sans-serif' }}>
            Assigned reporting manager
        </h2>

        <div className="flex items-center gap-4 w-full px-4">
             <button 
                onClick={onOk}
                className="flex-1 h-[48px] rounded-full border border-[#7D1EDB] text-[#7D1EDB] font-medium text-[16px] hover:bg-purple-50 transition-colors"
                style={{ fontFamily: '"Nunito Sans", sans-serif' }}
            >
                Ok
            </button>
            <button 
                onClick={onViewTeam}
                className="flex-1 h-[48px] rounded-full bg-[#7D1EDB] text-white font-medium text-[16px] hover:bg-[#6c1ac0] transition-colors"
                 style={{ fontFamily: '"Nunito Sans", sans-serif' }}
            >
                View Team
            </button>
        </div>
      </div>
    </div>
  );
};

export default AssignedModal;
