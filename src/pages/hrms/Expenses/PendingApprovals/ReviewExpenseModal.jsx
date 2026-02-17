import React, { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import FilterDropdown from "../../../../components/ui/FilterDropdown";

const ReviewExpenseModal = ({ isOpen, onClose, expense, onUpdate }) => {
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [expenseAccount, setExpenseAccount] = useState("");
  const [costCenter, setCostCenter] = useState("");

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setRejectMode(false);
      setRejectReason("");
      setExpenseAccount(expense?.expenseAccount || "");
      setCostCenter(expense?.costCenter || "");
    }
  }, [isOpen, expense]);

  if (!isOpen || !expense) return null;

  const handleApprove = () => {
    let nextStatus = "Approved"; // Default fallback
    if (expense.status === "Submitted") {
      nextStatus = "Manager Approved";
    } else if (expense.status === "Manager Approved") {
      nextStatus = "Approved"; // Final approval
    }

    const updatedExpense = {
      ...expense,
      status: nextStatus,
      expenseAccount: expenseAccount,
      costCenter: costCenter,
    };
    onUpdate(updatedExpense);
    onClose();
  };

  const handleRejectClick = () => {
    setRejectMode(true);
  };

  const handleConfirmReject = () => {
    const updatedExpense = {
      ...expense,
      status: "Rejected",
      rejectionReason: rejectReason,
    };
    onUpdate(updatedExpense);
    onClose();
  };

  const handleCancelReject = () => {
    setRejectMode(false);
    setRejectReason("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000042]">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <h2
            className="text-lg font-semibold text-[#393C46]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Review Expense
          </h2>
          <button
            onClick={onClose}
            className="text-[#CCD2E3] hover:text-gray-500 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Main Card */}
          <div className="border border-[#CECECE] rounded-lg p-5 mb-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3
                  className="text-[15px] font-semibold text-[#000000]"
                  style={{ fontFamily: "Nunito Sans, sans-serif" }}
                >
                  {expense.title}
                </h3>
                <p
                  className="text-[13px] text-[#9A9A9A]"
                  style={{ fontFamily: "Nunito Sans, sans-serif" }}
                >
                  {expense.employee || "Unknown Employee"}
                </p>
                <p
                  className="text-[13px] text-[#9A9A9A] mt-1"
                  style={{ fontFamily: "Nunito Sans, sans-serif" }}
                >
                  {expense.description}
                </p>
              </div>
              <div className="text-right">
                <div
                  className="text-[20px] font-bold text-[#000000]"
                  style={{ fontFamily: "Nunito Sans, sans-serif" }}
                >
                  ₹{expense.amount.toLocaleString()}
                </div>
                <div
                  className="text-sm text-[#9A9A9A]"
                  style={{ fontFamily: "Nunito Sans, sans-serif" }}
                >
                  {expense.category}
                </div>
              </div>
            </div>
          </div>

          {/* Level 2 (Finance) Fields: Expense Account & Cost Center */}
          {!rejectMode && expense.status === "Manager Approved" && (
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <label
                  className="block text-sm font-medium text-gray-600 mb-1"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Expense Account
                </label>
                <FilterDropdown
                  label=""
                  placeholder="Select Account"
                  options={[
                    "Travel",
                    "Meals",
                    "Office Supplies",
                    "Professional Development",
                  ]}
                  value={expenseAccount}
                  onChange={setExpenseAccount}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-700 h-10.5 flex items-center justify-between"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-600 mb-1"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Cost Center
                </label>
                <input
                  type="text"
                  placeholder="Enter text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:border-[#7D1EDB]"
                  value={costCenter}
                  onChange={(e) => setCostCenter(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Reject Mode: Feedback Textarea */}
          {rejectMode && (
            <div className="mb-4">
              <label
                className="block text-sm font-normal text-gray-700 mb-2"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Feedback / Reason for Rejection
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:border-red-500 min-h-25"
                placeholder="Enter reason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                autoFocus
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 w-full">
            {rejectMode ? (
              <>
                <button
                  onClick={handleCancelReject}
                  className="flex-1 w-full py-2.5 rounded-full border border-purple-600 text-purple-600 font-medium hover:bg-purple-50 transition-colors"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReject}
                  className="flex-1 w-full py-2.5 rounded-full bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Reject Expense
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleRejectClick}
                  className="flex-1 w-full py-2.5 rounded-full bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Reject/Request Changes
                </button>
                <button
                  onClick={handleApprove}
                  className="flex-1 w-full py-2.5 rounded-full bg-[#7D1EDB] text-white font-medium hover:bg-[#6a19b8] transition-colors"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Approve
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewExpenseModal;
