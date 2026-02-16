import React from 'react';
import { X } from 'lucide-react';

const RemoveProject = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#100F0F59] font-sans" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
      <div className="bg-white rounded-[20px] w-[90%] max-w-[450px] p-8 relative shadow-2xl text-center">
        {/* Close Button */}
        <button 
           onClick={onClose} 
           className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} className="text-[#000000]" />
        </button>

        {/* Content */}
        <div className="mt-8 mb-4">
            <h2 className="text-[20px] font-semibold text-[#000000]" style={{ fontFamily: '"Poppins", sans-serif' }}>
                Remove employee from project
            </h2>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-4">
            <button 
                onClick={onClose}
                className="px-8 h-[48px] min-w-[180px] rounded-full border border-[#7D1EDB] text-[#7D1EDB] font-medium text-[16px] hover:bg-purple-50 transition-colors"
                style={{ fontFamily: '"Poppins", sans-serif' }}
            >
                Cancel
            </button>
            <button 
                onClick={onConfirm}
                className="px-8 h-[48px] min-w-[180px] rounded-full bg-[#7D1EDB] text-white font-medium text-[16px] hover:bg-[#6c1ac0] transition-colors"
                style={{ fontFamily: '"Poppins", sans-serif' }}
            >
                Remove
            </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveProject;
