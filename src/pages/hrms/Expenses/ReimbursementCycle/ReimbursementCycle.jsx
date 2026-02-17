import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Search, Check } from "lucide-react";
import FilterDropdown from "../../../../components/ui/FilterDropdown";

const ReimbursementCycle = () => {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cycleType, setCycleType] = useState("");

  // Mock Data
  const reimbursements = [
    {
      id: "REI-005",
      employee: "Jessica Williams",
      category: "Conference",
      amount: 30000,
      date: "2/4/2024",
      status: "Approved",
    },
    {
      id: "REI-006",
      employee: "Robert Kumar",
      category: "Office Supplies",
      amount: 10000,
      date: "4/4/2024",
      status: "Approved",
    },
    {
      id: "REI-007",
      employee: "John Smith",
      category: "Travel",
      amount: 80000,
      date: "10/4/2024",
      status: "Approved",
    },
    {
      id: "REI-002",
      employee: "Carol White",
      category: "Conference",
      amount: 30000,
      date: "4/4/2024",
      status: "Approved",
    },
    {
      id: "REI-009",
      employee: "Alice John",
      category: "Team Lunch",
      amount: 10000,
      date: "10/4/2024",
      status: "Approved",
    },
  ];

  const filteredReimbursements = reimbursements.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.employee.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.id.toLowerCase().includes(query)
    );
  });

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredReimbursements.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredReimbursements.map((item) => item.id));
    }
  };

  const toggleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const selectedTotal = reimbursements
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.amount, 0);

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString()}`;
  };

  const handleProcess = () => {
    // Handle processing (mock)
    console.log("Processing:", selectedItems);
    setIsModalOpen(false);
    setSelectedItems([]);
  };

  return (
    <div className="bg-white px-4 sm:px-6 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col font-sans border border-[#D9D9D9]">
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
        <span className="text-[#6B7280]">Reimbursement Cycle</span>
      </div>

      {/* Header */}
      <h1
        className="text-[20px] font-semibold text-[#494949] mb-6"
        style={{ fontFamily: "Nunito Sans, sans-serif" }}
      >
        Reimbursement Cycle
      </h1>

      {/* Filters */}
      <div
        className="flex gap-4 mb-6"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        <div className="relative w-80">
          <input
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F9FAFB] border border-[#EEECFF] text-[16px] font-normal rounded-full pl-4 pr-10 py-2.5 focus:outline-none focus:border-[#7D1EDB]"
          />
        </div>
        <FilterDropdown
          label="Cycle Type"
          options={["15-day batch", "30-day batch"]}
          value={cycleType}
          onChange={setCycleType}
          className="w-48 bg-[#EEECFF] text-[#7D1EDB] rounded-xl px-4 py-2.5 flex items-center justify-between"
        />
      </div>

      {/* Table */}
      <div className="p-4 border border-[#E4E4E7] rounded-lg rounded-b-lg">
        <h2
          className="text-[16px] font-medium text-[#000000] mb-2"
          style={{ fontFamily: "Nunito Sans, sans-serif" }}
        >
          Reimbursement Cycle
        </h2>
        <div className="border border-[#E4E4E7] rounded-lg rounded-b-lg">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white border-b border-[#E4E4E7]">
              <tr>
                <th className="p-4 w-12">
                  <div
                    className={`w-5 h-5 border-2 rounded-xs cursor-pointer flex items-center justify-center ${selectedItems.length === filteredReimbursements.length && filteredReimbursements.length > 0 ? "bg-[#7D1EDB] border-[#7D1EDB]" : "border-[#1F1F1F]"}`}
                    onClick={toggleSelectAll}
                  >
                    {selectedItems.length === filteredReimbursements.length &&
                      filteredReimbursements.length > 0 && (
                        <Check size={14} className="text-white" />
                      )}
                  </div>
                </th>
                <th
                  className="px-4 py-2 text-sm font-normal text-[#757575]"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  ID
                </th>
                <th
                  className="px-4 py-2 text-sm font-normal text-[#757575]"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Employee
                </th>
                <th
                  className="px-4 py-2 text-sm font-normal text-[#757575]"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Category
                </th>
                <th
                  className="px-4 py-2 text-sm font-normal text-[#757575]"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Amount
                </th>
                <th
                  className="px-4 py-2 text-sm font-normal text-[#757575]"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Submitted Date
                </th>
                <th
                  className="px-4 py-2 text-sm font-normal text-[#757575]"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody style={{ fontFamily: "Nunito Sans, sans-serif" }}>
              {filteredReimbursements.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">
                    No reimbursements found.
                  </td>
                </tr>
              ) : (
                filteredReimbursements.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div
                        className={`w-5 h-5 border-2 rounded-xs cursor-pointer flex items-center justify-center ${selectedItems.includes(item.id) ? "bg-[#7D1EDB] border-[#7D1EDB]" : "border-[#1F1F1F]"}`}
                        onClick={() => toggleSelectItem(item.id)}
                      >
                        {selectedItems.includes(item.id) && (
                          <Check size={14} className="text-white" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-sm font-semibold text-[#000000]">
                      {item.id}
                    </td>
                    <td className="px-4 py-2 text-sm font-semibold text-[#000000]">
                      {item.employee}
                    </td>
                    <td className="px-4 py-2 text-sm font-semibold text-[#000000]">
                      {item.category}
                    </td>
                    <td className="px-4 py-2 text-sm font-semibold text-[#000000]">
                      {item.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-sm font-semibold text-[#000000]">
                      {item.date}
                    </td>
                    <td className="px-4 py-2">
                      <span className="bg-[#76DB1E33] text-[#76DB1E] px-3 py-1 rounded-full text-sm font-semibold">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Floating Footer */}
      {selectedItems.length > 0 && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white shadow-lg border border-[#989898] rounded-xl px-6 py-4 flex items-center gap-6 z-50">
          <div
            className="flex flex-col"
            style={{ fontFamily: "Nunito Sans ,sans-serif" }}
          >
            <span className="text-sm text-[#757575] font-semibold">
              {selectedItems.length} Items Selected
            </span>
            <span className="text-lg font-semibold text-[#000000]">
              {formatCurrency(selectedTotal)}
            </span>
          </div>
          <div className="flex gap-3 text-[16px]">
            <button
              className="px-6 py-2 w-55 rounded-full border border-[#7D1EDB] text-[#7D1EDB] font-medium hover:bg-purple-50 transition-colors"
              onClick={() => setSelectedItems([])}
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Cancel
            </button>
            <button
              className="px-6 py-2 rounded-full bg-[#7D1EDB] text-white font-medium hover:bg-purple-700 transition-colors"
              onClick={() => setIsModalOpen(true)}
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Process Reimbursement
            </button>
          </div>
        </div>
      )}

      {/* Process Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-125 p-4 shadow-2xl">
            <h2
              className="text-[16px] font-semibold text-[#1E1E1E] mb-2"
              style={{ fontFamily: "Nunito Sans, sans-serif" }}
            >
              Process Reimbursement Batch
            </h2>
            <p
              className="text-[14px] mb-2 text-[#757575] font-semibold"
              style={{ fontFamily: "Nunito Sans, sans-serif" }}
            >
              You are about to process {selectedItems.length} reimbursement(s)
              for a {cycleType || "15-day batch"} cycle with a total amount of{" "}
              {formatCurrency(selectedTotal)}. This action will create a payment
              entry and update expense statuses.
            </p>

            <div
              className="bg-[#EFEFEF] rounded-sm p-4 mb-4"
              style={{ fontFamily: "Nunito Sans, sans-serif" }}
            >
              <div className="flex justify-between mb-1 text-[15px] font-semibold">
                <span className="text-[#757575]">Items:</span>
                <span className="text-[#1E1E1E]">{selectedItems.length}</span>
              </div>
              <div className="flex justify-between mb-1 text-[15px] font-semibold">
                <span className="text-[#757575]">Total Amount:</span>
                <span className="text-[#1E1E1E]">
                  {formatCurrency(selectedTotal)}
                </span>
              </div>
              <div className="flex justify-between text-[15px] font-semibold">
                <span className="text-[#757575]">Cycle:</span>
                <span className="text-[#1E1E1E]">
                  {cycleType || "15-day batch"}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2.5 rounded-full border border-[#7D1EDB] text-[#7D1EDB] font-medium hover:bg-purple-50"
                onClick={() => setIsModalOpen(false)}
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2.5 rounded-full bg-[#7D1EDB] text-white font-medium hover:bg-purple-700"
                onClick={handleProcess}
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Process
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReimbursementCycle;
