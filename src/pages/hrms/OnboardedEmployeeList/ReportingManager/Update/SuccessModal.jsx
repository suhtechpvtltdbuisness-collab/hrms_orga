import React from 'react';
import { X } from 'lucide-react';

const SuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-[#3B3A3A82] z-60 flex justify-center items-start pt-10 font-sans"
      style={{ fontFamily: '"Nunito Sans", sans-serif' }}
    >
      <div className="bg-white rounded-2xl p-8 pb-6 w-[90%] max-w-[550px] shadow-2xl relative">
        <button
          onClick={onClose}
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
            <h2 className="text-[20px] font-semibold text-[#000000] mb-1 leading-tight" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Reporting Manager Updated Successfully
            </h2>
            <p className="text-[14px] text-[#000000] font-light">
              Changes saved!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
