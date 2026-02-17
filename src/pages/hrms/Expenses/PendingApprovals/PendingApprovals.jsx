import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import FilterDropdown from "../../../../components/ui/FilterDropdown";
import ReviewExpenseModal from "./ReviewExpenseModal";

const PendingApprovals = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [titleFilter, setTitleFilter] = useState("");
  const [amountFilter, setAmountFilter] = useState("");

  const [expenses, setExpenses] = useState([]);

  // Mock Data for initial load if localStorage is empty
  const mockExpenses = [
    {
      id: 1,
      title: "Client Lunch Meeting",
      description: "Lunch with potential client - Project discussion",
      category: "Meal & Entertainment",
      amount: 10000,
      date: "29/02/2026",
      status: "Submitted", // Level 1 Pending
      employee: "Alice John",
      costCenter: "Sales - 101",
    },
    {
      id: 2,
      title: "Conference Registration",
      description: "Marketing Summit 2024 registration fee",
      category: "Professional Development",
      amount: 50000,
      date: "29/02/2026",
      status: "Manager Approved", // Level 2 Pending
      employee: "Bob Smith",
      costCenter: "Marketing - 102",
    },
    {
      id: 3,
      title: "Team Lunch",
      description: "Team building lunch",
      category: "Meal & Entertainment",
      amount: 10000,
      date: "29/02/2026",
      status: "Submitted",
      employee: "Charlie Brown",
      costCenter: "Marketing - 102",
    },
  ];

  useEffect(() => {
    // In a real app, this would fetch from API.
    // Here we might want to share state with Expense.jsx via localStorage or context.
    // For now, let's use a separate 'pendingExpenses' key or filter the main 'expenses' key if we want integration.
    // To keep it simple and consistent with the plan, I'll use 'expenses' key but filter for pending ones,
    // or just use mock data if 'expenses' doesn't have enough pending items for demo.

    // Let's try to read 'expenses' first, if not populate with mock.
    const storedExpenses = JSON.parse(localStorage.getItem("expenses")) || [];

    // If we have stored expenses but none are pending/manager approved, let's add some mock ones for demo purposes
    // or just use the mockExpenses if stored is empty.

    let displayExpenses = storedExpenses;
    if (storedExpenses.length === 0) {
      displayExpenses = mockExpenses;
      localStorage.setItem("expenses", JSON.stringify(mockExpenses));
    }

    // We only want to show expenses that need approval
    // statuses: "Submitted" (needs Manager) or "Manager Approved" (needs Finance)
    const pending = displayExpenses.filter(
      (e) => e.status === "Submitted" || e.status === "Manager Approved"
    );

    // If existing data doesn't have any pending items (e.g. all drafts), let's merge mock data for demo
    if (pending.length === 0 && storedExpenses.length > 0) {
      // Checking if we should inject mock data...
      // For the sake of the user request, let's ensure we have data to show.
      // But modifying user's existing data might be intrusive.
      // Let's just use the filtered list. If empty, it's empty.
      // But wait, the user wants to see the flow.
      // Let's rely on the user having added some or just use mockExpenses purely for this view if we want to force demo data?
      // Better: Use `displayExpenses` and filter.
    }

    setExpenses(pending.length > 0 ? pending : mockExpenses); // Fallback to mock if nothing pending found, just to show UI
    setLoading(false);
  }, []);

  const handleOpenModal = (expense) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  const handleUpdateExpense = (updatedExpense) => {
    // Update local state
    const updatedList = expenses.map((e) =>
      e.id === updatedExpense.id ? updatedExpense : e
    );
    // Remove from view if it's fully approved (Approved) or Rejected?
    // Typically "Pending Approvals" only shows pending.
    // If status becomes "Approved" or "Rejected", it should disappear from this list.

    const newPendingList = updatedList.filter(
      (e) => e.status === "Submitted" || e.status === "Manager Approved"
    );

    setExpenses(newPendingList);

    // Update localStorage to sync with Expense.jsx
    const allExpenses = JSON.parse(localStorage.getItem("expenses")) || [];
    const newAllExpenses = allExpenses.map((e) =>
      e.id === updatedExpense.id ? updatedExpense : e
    );

    // If it was a mock expense not in allExpenses, push it?
    const exists = allExpenses.find((e) => e.id === updatedExpense.id);
    if (!exists) {
      newAllExpenses.push(updatedExpense);
    }

    localStorage.setItem("expenses", JSON.stringify(newAllExpenses));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Submitted":
        return "bg-blue-600 text-white";
      case "Manager Approved":
        return "bg-blue-700 text-white";
      case "Reimbursed":
        return "bg-emerald-500 text-white";
      case "Draft":
        return "bg-purple-500 text-white";
      case "Rejected":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const filteredExpenses = expenses.filter((expense) => {
    return (
      (!statusFilter || expense.status === statusFilter) &&
      (!titleFilter ||
        expense.title.toLowerCase().includes(titleFilter.toLowerCase())) &&
      (!amountFilter || expense.amount.toString().includes(amountFilter))
    );
  });

  return (
    <div
      className="bg-white px-4 sm:px-4 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col font-inter"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Breadcrumb */}
      <div
        className="flex items-center gap-2 mb-2 text-sm text-gray-500 shrink-0"
        style={{ fontFamily: "Mulish, sans-serif" }}
      >
        <img
          src="/images/arrow_left_alt.svg"
          alt="Back"
          className="w-3 h-3 cursor-pointer hover:scale-110 transition-transform"
          onClick={() => navigate("/hrms")}
        />
        <span
          className="cursor-pointer text-[#7D1EDB]"
          onClick={() => navigate("/hrms")}
        >
          HRMS Dashboard
        </span>
        <ChevronRight size={14} />
        <span className="text-[#6B7280]">Pending Approvals</span>
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 shrink-0">
        <h1
          className="text-[20px] font-semibold text-[#494949]"
          style={{ fontFamily: "Nunito Sans, sans-serif" }}
        >
          Pending Approvals
        </h1>
      </div>

      {/* Filters */}
      {!loading && expenses.length > 0 && (
        <div
          className="flex flex-wrap gap-3 mb-6 shrink-0"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          <FilterDropdown
            label="Status"
            options={["Submitted", "Manager Approved"]}
            value={statusFilter}
            onChange={setStatusFilter}
          />
          <FilterDropdown
            label="Expense Title"
            options={[]} // Could populate dynamically
            value={titleFilter}
            onChange={setTitleFilter}
          />
          <FilterDropdown
            label="Amount"
            options={[]}
            value={amountFilter}
            onChange={setAmountFilter}
          />
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto border p-4 mb-2 border-[#CECECE] rounded-lg">
        <h2
          className="text-[16px] font-medium text-[#1E1E1E] mb-2"
          style={{ fontFamily: "Nunito Sans, sans-serif" }}
        >
          My Expenses
        </h2>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7D1EDB]"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && expenses.length === 0 && (
          <div className="flex flex-col mt-10 mb-10 items-center justify-center text-center">
            <img
              src="/images/emptyAttendance.png"
              alt="No Pending Approvals"
              className="w-87.5 h-auto mb-6"
            />
            <h3
              className="text-[20px] font-bold text-[#1E1E1E] mb-2"
              style={{ fontFamily: "Nunito Sans, sans-serif" }}
            >
              No Pending Approvals
            </h3>
            <p
              className="text-[14px] text-[#757575]"
              style={{ fontFamily: "Nunito Sans, sans-serif" }}
            >
              You're all caught up!
            </p>
          </div>
        )}

        {/* List View */}
        {!loading && expenses.length > 0 && (
          <div className="space-y-4 pb-4">
            {filteredExpenses.map((expense) => (
              <div
                key={expense.id}
                className="border border-[#E0E0E0] rounded-lg p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3
                      className="text-[16px] font-semibold text-[#1E1E1E]"
                      style={{ fontFamily: "Nunito Sans, sans-serif" }}
                    >
                      {expense.title}
                    </h3>
                    <span
                      className={`text-[12px] px-2 py-0.5 rounded-md font-medium ${getStatusColor(expense.status)}`}
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {expense.status}
                    </span>
                  </div>
                  <p
                    className="text-[14px] text-[#757575] mb-1"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {expense.employee || "Employee Name"} -{" "}
                    {expense.description}
                  </p>
                  <div
                    className="flex items-center gap-4 text-[13px] text-[#4A4A4A] font-medium"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    <span>
                      Category:{" "}
                      <span className="text-[#1E1E1E]">{expense.category}</span>
                    </span>
                    <span>
                      Date:{" "}
                      <span className="text-[#1E1E1E]">{expense.date}</span>
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center px-4 gap-2 min-w-30">
                  <span
                    className="text-[20px] font-semibold text-[#000000]"
                    style={{ fontFamily: "Nunito Sans, sans-serif" }}
                  >
                    ₹{expense.amount.toLocaleString()}
                  </span>
                  <button
                    onClick={() => handleOpenModal(expense)}
                    className="text-[#7D1EDB] border border-[#7D1EDB] rounded-full px-3 py-2 text-[16px] font-medium hover:bg-purple-50 transition-colors w-full"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ReviewExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        expense={selectedExpense}
        onUpdate={handleUpdateExpense}
      />
    </div>
  );
};

export default PendingApprovals;
