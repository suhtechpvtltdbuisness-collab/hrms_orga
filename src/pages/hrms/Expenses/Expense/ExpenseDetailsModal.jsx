import React from "react";
import { X, Check } from "lucide-react";

const ExpenseDetailsModal = ({ isOpen, onClose, expense }) => {
  if (!isOpen || !expense) return null;

  // status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Submitted":
        return "bg-[#270BFD]";
      case "Manager Approved":
        return "bg-[#270BFD]";
      case "Reimbursed":
        return "bg-[#25B662]";
      case "Draft":
        return "bg-[#7359DD]";
      case "Rejected":
        return "bg-[#FF0000]";
      default:
        return "bg-[#7359DD]";
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000042] p-4 font-sans"
      style={{ fontFamily: "Nunito Sans, sans-serif" }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-[#D9D9D9]">
          <div>
            <h2 className="text-[20px] font-semibold text-[#1E1E1E] mb-1">
              {expense.title}
            </h2>
            <p className="text-[13px] text-[#757575] font-semibold">
              {expense.description || "No description provided"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#757575] hover:text-[#1E1E1E] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {/* Top Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-30 mb-3 border-b border-[#D9D9D9] pb-3">
            <div>
              <p className="text-[13px] text-[#757575] mb-1 font-semibold">
                Amount
              </p>
              <p className="text-[16px] font-semibold text-[#1E1E1E]">
                ₹{expense.amount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[13px] text-[#757575] mb-1 font-semibold">
                Status
              </p>
              <span
                className={`inline-block px-3 py-1 rounded-md text-white text-[12px] font-medium ${getStatusColor(expense.status)}`}
              >
                {expense.status}
              </span>
            </div>
            <div>
              <p className="text-[13px] text-[#757575] mb-1 font-semibold">
                Category
              </p>
              <p className="text-[14px] font-semibold text-[#1E1E1E]">
                {expense.category}
              </p>
            </div>
            <div>
              <p className="text-[13px] text-[#757575] mb-1 font-semibold">
                Expense Date
              </p>
              <p className="text-[14px] font-semibold text-[#1E1E1E]">
                {expense.date}
              </p>
            </div>
            <div>
              <p className="text-[13px] text-[#757575] mb-1 font-semibold">
                Submitted By
              </p>
              <div className="flex flex-col">
                <span className="text-[14px] font-semibold text-[#1E1E1E]">
                  Alice Johnson
                </span>
              </div>
            </div>
            <div>
              <p className="text-[13px] text-[#757575] mb-1 font-semibold">
                Submitted At
              </p>
              <p className="text-[14px] font-semibold text-[#1E1E1E]">
                Feb 1, 2026, 02:53 PM
              </p>
            </div>
          </div>

          {/* Approval History */}
          <div>
            <h3 className="text-[15px] font-semibold text-[#1E1E1E] mb-2">
              Approval History
            </h3>

            <div className="border border-[#CECECE] rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-[15px] font-semibold text-[#1E1E1E]">
                    Bob Smith (L1)
                  </h4>
                  <p className="text-[13px] font-semibold text-[#9A9A9A] mt-0.5">
                    Feb 2, 2026, 02:53 PM
                  </p>
                  <p className="text-[13px] font-semibold text-[#9A9A9A] mt-2">
                    Looks good
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[#10B981]">
                  <div className="w-5 h-5 rounded-full border border-[#10B981] flex items-center justify-center">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span className="text-[15px] font-semibold text-[#000000]">
                    Approved
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseDetailsModal;
