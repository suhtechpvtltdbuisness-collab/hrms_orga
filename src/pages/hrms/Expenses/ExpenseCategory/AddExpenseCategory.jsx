import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import FilterDropdown from "../../../../components/ui/FilterDropdown";

const AddExpenseCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Initial State
  const [formData, setFormData] = useState({
    name: "",
    linkedAccount: "",
    monthlyBudget: "",
    dailyLimit: "",
    approval: "Not Required", // Default
  });

  // Load data if editing
  useEffect(() => {
    if (id) {
      const categories =
        JSON.parse(localStorage.getItem("expenseCategories")) || [];
      const category = categories.find((c) => c.id.toString() === id);
      if (category) {
        setFormData(category);
      }
    }
  }, [id]);

  const handleSave = () => {
    // Validation
    if (!formData.name || !formData.linkedAccount) {
      alert("Please fill in Category Name and Linked Account");
      return;
    }

    const categories =
      JSON.parse(localStorage.getItem("expenseCategories")) || [];

    // Determine Approval status logic (mock logic based on budget for now, or user selection if we add field)
    // User screenshot shows approval status in table but no field in form.
    // Let's assume logic: if daily limit exists, maybe required? Or just default Not Required for now.
    // Actually, let's auto-set it based on limits to show some logic.
    let approvalStatus = "Not Required";
    if (formData.dailyLimit && Number(formData.dailyLimit) > 0) {
      approvalStatus = "Required";
    }

    const dataToSave = {
      ...formData,
      monthlyBudget: formData.monthlyBudget
        ? Number(formData.monthlyBudget)
        : null,
      dailyLimit: formData.dailyLimit ? Number(formData.dailyLimit) : null,
      approval: approvalStatus,
    };

    if (id) {
      const updatedCategories = categories.map((c) =>
        c.id.toString() === id ? { ...dataToSave, id: c.id } : c
      );
      localStorage.setItem(
        "expenseCategories",
        JSON.stringify(updatedCategories)
      );
    } else {
      const newCategory = {
        id: Date.now(),
        ...dataToSave,
      };
      localStorage.setItem(
        "expenseCategories",
        JSON.stringify([...categories, newCategory])
      );
    }

    navigate("/hrms/expenses/category");
  };

  return (
    <div
      className="bg-white px-4 sm:px-6 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col font-inter"
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
          onClick={() => navigate("/hrms/expenses/category")}
        />
        <span
          className="cursor-pointer text-[#7D1EDB]"
          onClick={() => navigate("/hrms/expenses/category")}
        >
          Expense Category
        </span>
        <ChevronRight size={14} />
        <span className="text-[#6B7280]">
          {id && formData.name ? formData.name : "Add Category"}
        </span>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h1
          className="text-[20px] font-semibold text-[#494949]"
          style={{ fontFamily: "Nunito Sans, sans-serif" }}
        >
          {id && formData.name ? formData.name : "Add Expense Category"}
        </h1>

        <button
          className="px-4 py-2 rounded-full bg-[#7D1EDB] text-white font-medium hover:bg-purple-700 transition-colors"
          onClick={handleSave}
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Save
        </button>
      </div>

      {/* Form */}
      <div className="border border-[#E0E0E0] rounded-xl p-4">
        <h2
          className="text-[16px] font-semibold text-[#1E1E1E] mb-2"
          style={{ fontFamily: "Nunito Sans, sans-serif" }}
        >
          Category Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Category Name */}
          <div>
            <label
              className="block text-[14px] font-medium text-[#344054] mb-2"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Category Name
            </label>
            <input
              type="text"
              className="w-full border border-[#D0D5DD] rounded-lg px-4 py-2.5 text-[16px] text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB] placeholder-[#757575]"
              placeholder="Enter name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          {/* Linked Account */}
          <div>
            <label
              className="block text-[14px] font-medium text-[#344054] mb-2"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Linked Expense Account
            </label>
            <FilterDropdown
              label=""
              placeholder="Select account"
              options={[
                "Equipment 6300",
                "Travel 6200",
                "Meals 6000",
                "Other 6700",
                "Rent 6400",
                "Utilities 6500",
              ]}
              value={formData.linkedAccount}
              onChange={(val) =>
                setFormData({ ...formData, linkedAccount: val })
              }
              className="w-full bg-white border border-[#D9D9D9] text-[#1E1E1E] rounded-lg h-11.5 flex items-center justify-between px-4"
            />
          </div>

          {/* Monthly Budget */}
          <div>
            <label
              className="block text-[14px] font-medium text-[#344054] mb-2"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Monthly Budget
            </label>
            <input
              type="text"
              className="w-full border border-[#D0D5DD] rounded-lg px-4 py-2.5 text-[16px] text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB] placeholder-[#757575]"
              placeholder="Enter amount"
              value={formData.monthlyBudget}
              onChange={(e) => {
                if (/^\d*\.?\d*$/.test(e.target.value)) {
                  setFormData({ ...formData, monthlyBudget: e.target.value });
                }
              }}
            />
          </div>

          {/* Daily Limit */}
          <div>
            <label
              className="block text-[14px] font-medium text-[#344054] mb-2"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Daily Limit
            </label>
            <input
              type="text"
              className="w-full border border-[#D0D5DD] rounded-lg px-4 py-2.5 text-[16px] text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB] placeholder-[#757575]"
              placeholder="Enter amount"
              value={formData.dailyLimit}
              onChange={(e) => {
                if (/^\d*\.?\d*$/.test(e.target.value)) {
                  setFormData({ ...formData, dailyLimit: e.target.value });
                }
              }}
            />
          </div>
        </div>

        {/* Footer Buttons (Cancel/Create) - Matching Screenshot Style */}
        <div className="flex items-center gap-4 mt-4">
          <button
            className="px-6 py-2.5 rounded-full bg-[#7D1EDB] text-white font-medium hover:bg-purple-700 transition-colors"
            onClick={handleSave}
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {id ? "Update Category" : "Create Category"}
          </button>
          <button
            className="px-6 py-2.5 rounded-full border border-[#7D1EDB] text-[#7D1EDB] font-medium hover:bg-purple-50 transition-colors"
            onClick={() => navigate("/hrms/expenses/category")}
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddExpenseCategory;
