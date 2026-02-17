import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, MoreVertical, Eye, Edit, Download } from "lucide-react";
import FilterDropdown from "../../../../components/ui/FilterDropdown";
import noRecords from "../../../../assets/no-records.svg";

const InvoicePaymentAllocation = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [customerFilter, setCustomerFilter] = useState("");
  const [paymentDateFilter, setPaymentDateFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");

  // Mock Data
  const mockPayments = [
    {
      id: 1,
      invoiceNumber: "INV-001",
      customer: "Acme Corp",
      paymentDate: "26/02/2026",
      amount: 50000,
      method: "Bank Transfer",
      status: "Complete",
    },
    {
      id: 2,
      invoiceNumber: "INV-003",
      customer: "Tech Solution",
      paymentDate: "26/02/2026",
      amount: 50000,
      method: "Check",
      status: "Pending",
    },
    {
      id: 3,
      invoiceNumber: "INV-002",
      customer: "Digital Agency",
      paymentDate: "26/02/2026",
      amount: 70000,
      method: "Cash",
      status: "Active",
    },
  ];

  useEffect(() => {
    const storedPayments =
      JSON.parse(localStorage.getItem("invoicePayments")) || [];
    if (storedPayments.length === 0) {
      localStorage.setItem("invoicePayments", JSON.stringify(mockPayments));
      setPayments(mockPayments);
    } else {
      setPayments(storedPayments);
    }
    setLoading(false);
  }, []);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Complete":
        return "bg-[#76DB1E33] text-[#76DB1E]";
      case "Pending":
        return "bg-[#FFE0CC] text-[#DB471E]";
      case "Active":
        return "bg-[#76DB1E33] text-[#76DB1E]";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const toggleActionMenu = (id, e) => {
    e.stopPropagation();
    if (activeMenu === id) {
      setActiveMenu(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setMenuPosition({ top: rect.bottom + 4, left: rect.left - 100 });
      setActiveMenu(id);
    }
  };

  const handleView = (payment) => {
    setActiveMenu(null);
    navigate(`/hrms/invoice-payment-allocation/view/${payment.id}`, {
      state: { payment, mode: "view" },
    });
  };

  const handleEdit = (payment) => {
    setActiveMenu(null);
    navigate(`/hrms/invoice-payment-allocation/edit/${payment.id}`, {
      state: { payment, mode: "edit" },
    });
  };

  const handleDownload = (payment) => {
    setActiveMenu(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    if (dateString.includes("/")) return dateString;
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    if (statusFilter && payment.status !== statusFilter) return false;
    if (customerFilter && payment.customer !== customerFilter) return false;
    if (methodFilter && payment.method !== methodFilter) return false;
    return true;
  });

  const uniqueCustomers = [...new Set(payments.map((p) => p.customer))];
  const uniqueMethods = [...new Set(payments.map((p) => p.method))];

  return (
    <div
      className="bg-white px-4 sm:px-4 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col"
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
        <span className="text-[#6B7280]">Invoice Payment Allocation</span>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h1
          className="text-[20px] font-semibold text-[#494949]"
          style={{ fontFamily: "Nunito Sans, sans-serif" }}
        >
          Invoice Payment Allocation
        </h1>
        <button
          className="bg-[#7D1EDB] text-white px-4 py-2 rounded-full font-normal hover:bg-purple-700 transition-colors flex items-center gap-2"
          onClick={() => navigate("/hrms/invoice-payment-allocation/new")}
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Record Payment <span className="text-lg">+</span>
        </button>
      </div>

      {/* Filters - only show when data exists */}
      {payments.length > 0 && (
        <div
          className="flex gap-3 mb-4 shrink-0 flex-wrap"
          style={{ fontFamily: '"Poppins", sans-serif' }}
        >
          <FilterDropdown
            label="Status"
            options={["Complete", "Pending", "Active"]}
            value={statusFilter}
            onChange={setStatusFilter}
          />
          <FilterDropdown
            label="Customer"
            options={uniqueCustomers}
            value={customerFilter}
            onChange={setCustomerFilter}
          />
          <FilterDropdown
            label="Payment Date"
            options={[]}
            value={paymentDateFilter}
            onChange={setPaymentDateFilter}
          />
          <FilterDropdown
            label="Method"
            options={uniqueMethods}
            value={methodFilter}
            onChange={setMethodFilter}
          />
        </div>
      )}

      {/* Table Section - Border Container */}
      <div className="overflow-hidden border border-[#E4E4E7] rounded-lg">
        <div className="overflow-x-auto overflow-y-auto h-full">
          <table className="w-full table-auto">
            <thead
              className="sticky top-0 bg-[#FFFFFF] z-10 border-b border-[#E4E4E7]"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              <tr className="text-left">
                <th className="py-3 px-4 text-[14px] font-normal text-[#8B8B8B]">
                  Invoice Number
                </th>
                <th className="py-3 px-4 text-[14px] font-normal text-[#8B8B8B]">
                  Customer
                </th>
                <th className="py-3 px-4 text-[14px] font-normal text-[#8B8B8B]">
                  Payment Date
                </th>
                <th className="py-3 px-4 text-[14px] font-normal text-[#8B8B8B]">
                  Amount
                </th>
                <th className="py-3 px-4 text-[14px] font-normal text-[#8B8B8B]">
                  Method
                </th>
                <th className="py-3 px-4 text-[14px] font-normal text-[#8B8B8B]">
                  Status
                </th>
                <th className="py-3 px-4 text-[14px] font-normal text-[#8B8B8B] text-center">
                  Action
                </th>
              </tr>
            </thead>
            {filteredPayments.length > 0 && (
              <tbody
                className="bg-white"
                style={{ fontFamily: '"Nunito Sans", sans-serif' }}
              >
                {filteredPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-2 px-4 text-[14px] font-semibold text-[#000000]">
                      {payment.invoiceNumber}
                    </td>
                    <td className="py-2 px-4 text-[14px] font-semibold text-[#000000]">
                      {payment.customer}
                    </td>
                    <td className="py-2 px-4 text-[14px] font-semibold text-[#000000]">
                      {formatDate(payment.paymentDate)}
                    </td>
                    <td className="py-2 px-4 text-[14px] font-semibold text-[#000000]">
                      {String.fromCharCode(8377)}
                      {Number(payment.amount).toLocaleString("en-IN")}
                    </td>
                    <td className="py-2 px-4 text-[14px] font-semibold text-[#000000]">
                      {payment.method}
                    </td>
                    <td className="py-2 px-4">
                      <span
                        className={`inline-flex items-center px-1 rounded-full text-[12px] font-normal ${getStatusColor(payment.status)}`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-center relative action-menu-container">
                      <button
                        onClick={(e) => toggleActionMenu(payment.id, e)}
                        className="text-[#000000] hover:text-gray-600 focus:outline-none p-1 rounded-full hover:bg-gray-100 inline-flex items-center justify-center"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {activeMenu === payment.id && (
                        <div
                          ref={menuRef}
                          className="fixed w-36 bg-white font-normal rounded-lg shadow-lg border border-gray-100 py-1 z-50"
                          style={{
                            top: menuPosition.top,
                            left: menuPosition.left,
                          }}
                        >
                          <button
                            onClick={() => handleView(payment)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 flex items-center gap-2"
                          >
                            <Eye size={16} /> View
                          </button>
                          <button
                            onClick={() => handleEdit(payment)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 flex items-center gap-2"
                          >
                            <Edit size={16} /> Edit
                          </button>
                          <button
                            onClick={() => handleDownload(payment)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 flex items-center gap-2"
                          >
                            <Download size={16} /> Download
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
          {!loading && filteredPayments.length === 0 && (
            <div
              className="flex flex-col mt-6 mb-10 items-center justify-center"
              style={{ fontFamily: '"Nunito Sans", sans-serif' }}
            >
              <img
                src="/images/emptyAttendance.png"
                alt="No Records Found"
                className="w-87.5 h-auto mb-4"
              />
              <h3 className="text-[24px] font-bold text-[#000000]">
                No Records found
              </h3>
              <p className="text-[16px] font-medium text-[#B0B0B0] mt-1">
                There are no records to show at the moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoicePaymentAllocation;
