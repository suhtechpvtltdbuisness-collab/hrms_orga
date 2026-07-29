import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Download,
} from "lucide-react";
import FilterDropdown from "../../../../components/ui/FilterDropdown";
import { invoiceService } from "../../../../service";

const PurchaseInvoice = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [invoices, setInvoices] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    supplier: "",
    invoiceDate: "",
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionMenuOpen && !event.target.closest(".action-menu-container")) {
        setActionMenuOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [actionMenuOpen]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    if (dateString.includes("/")) return dateString;
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const loadInvoices = async () => {
      setLoading(true);
      const result = await invoiceService.getPurchaseInvoices();
      setInvoices(result.success ? result.data || [] : []);
      if (!result.success) {
        alert(result.message || "Failed to load purchase invoices");
      }
      setLoading(false);
    };
    loadInvoices();
  }, []);

  const toggleActionMenu = (id, e) => {
    e.stopPropagation();
    if (actionMenuOpen === id) {
      setActionMenuOpen(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setMenuPosition({ top: rect.bottom + 4, left: rect.left - 100 });
      setActionMenuOpen(id);
    }
  };

  const handleView = (invoice) => {
    setActionMenuOpen(null);
    navigate(`/hrms/purchase-invoice/view/${invoice.id}`, {
      state: { invoice, mode: "view" },
    });
  };

  const handleEdit = (invoice) => {
    setActionMenuOpen(null);
    navigate(`/hrms/purchase-invoice/edit/${invoice.id}`, {
      state: { invoice, mode: "edit" },
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-[#76DB1E33] text-[#76DB1E]";
      case "Pending":
        return "bg-[#A245FF] text-[#B5DFFF]";
      case "Overdue":
        return "bg-[#FFDBCC] text-[#DB471E]";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    return (
      (!filters.status || inv.status === filters.status) &&
      (!filters.supplier ||
        inv.supplierName
          ?.toLowerCase()
          .includes(filters.supplier.toLowerCase())) &&
      (!filters.invoiceDate ||
        inv.invoiceDate === filters.invoiceDate ||
        inv.billDate === filters.invoiceDate)
    );
  });

  const uniqueSuppliers = [
    ...new Set(invoices.map((i) => i.supplierName).filter(Boolean)),
  ];

  return (
    <div
      className="bg-white px-4 sm:px-4 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col border border-[#D9D9D9] font-sans"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 shrink-0">
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
        <span className="text-[#6B7280]">Purchase Invoice</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1
          className="text-[20px] font-semibold text-[#494949]"
          style={{ fontFamily: "Nunito Sans,sans-serif" }}
        >
          Purchase Invoice
        </h1>

        <button
          onClick={() => navigate("/hrms/purchase-invoice/new")}
          className="flex items-center justify-center gap-2 text-white font-medium hover:bg-purple-700 transition-colors bg-[#7D1EDB] w-full sm:w-auto min-w-50"
          style={{
            height: "48px",
            padding: "8px 12px",
            borderRadius: "26px",
          }}
        >
          <span>New Purchase Invoice</span>
          <Plus size={18} />
        </button>
      </div>

      {invoices.length > 0 && (
        <div
          className="flex flex-wrap gap-3 mb-4"
          style={{ fontFamily: '"Poppins", sans-serif' }}
        >
          <FilterDropdown
            label="Status"
            options={["Paid", "Pending", "Overdue"]}
            value={filters.status}
            onChange={(val) => setFilters((prev) => ({ ...prev, status: val }))}
            minWidth="120px"
          />
          <FilterDropdown
            label="Supplier"
            options={uniqueSuppliers}
            value={filters.supplier}
            onChange={(val) =>
              setFilters((prev) => ({ ...prev, supplier: val }))
            }
            minWidth="140px"
          />
          <FilterDropdown
            label="Invoice Date"
            options={[]}
            value={filters.invoiceDate}
            onChange={(val) =>
              setFilters((prev) => ({ ...prev, invoiceDate: val }))
            }
            minWidth="148px"
          />
        </div>
      )}

      <div className="overflow-hidden border border-[#E4E4E7] rounded-lg">
        <div className="overflow-x-auto overflow-y-auto h-full">
          <table className="w-full table-auto">
            <thead
              className="sticky top-0 bg-[#FFFFFF] z-10 border-b border-[#E4E4E7]"
              style={{ fontFamily: "Poppins,sans-serif" }}
            >
              <tr className="text-left">
                <th className="py-3 px-4 text-[14px] font-normal text-[#8B8B8B]">
                  Invoice No.
                </th>
                <th className="py-3 px-4 text-[14px] font-normal text-[#8B8B8B]">
                  Supplier
                </th>
                <th className="py-3 px-4 text-[14px] font-normal text-[#8B8B8B]">
                  Invoice Date
                </th>
                <th className="py-3 px-4 text-[14px] font-normal text-[#8B8B8B]">
                  Due Date
                </th>
                <th className="py-3 px-4 text-[14px] font-normal text-[#8B8B8B]">
                  Amount
                </th>
                <th className="py-3 px-4 text-[14px] font-normal text-[#8B8B8B]">
                  Status
                </th>
                <th className="py-3 px-4 text-[14px] font-normal text-[#8B8B8B] text-center">
                  Action
                </th>
              </tr>
            </thead>
            {!loading && filteredInvoices.length > 0 && (
              <tbody
                className="bg-white"
                style={{ fontFamily: "Nunito Sans,sans-serif" }}
              >
                {filteredInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className=" hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-2 px-4 text-[14px] font-semibold text-[#000000]">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="py-2 px-4 text-[14px] font-semibold text-[#000000]">
                      {invoice.supplierName}
                    </td>
                    <td className="py-2 px-4 text-[14px] font-semibold text-[#000000]">
                      {formatDate(invoice.invoiceDate || invoice.billDate)}
                    </td>
                    <td className="py-2 px-4 text-[14px] font-semibold text-[#000000]">
                      {formatDate(invoice.dueDate)}
                    </td>
                    <td className="py-2 px-4 text-[14px] font-semibold text-[#000000]">
                      ₹{parseFloat(invoice.amount).toLocaleString()}
                    </td>
                    <td className="py-2 px-4">
                      <span
                        className={`inline-flex items-center px-1 rounded-full text[12px] font-normal ${getStatusColor(invoice.status)}`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-center relative action-menu-container">
                      <button
                        onClick={(e) => toggleActionMenu(invoice.id, e)}
                        className="text-[#000000] hover:text-gray-600 focus:outline-none p-1 rounded-full hover:bg-gray-100 inline-flex items-center justify-center"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {actionMenuOpen === invoice.id && (
                        <div
                          className="fixed w-36 bg-white font-semibold rounded-lg shadow-lg border border-gray-100 py-1 z-50"
                          style={{
                            top: menuPosition.top,
                            left: menuPosition.left,
                          }}
                        >
                          <button
                            onClick={() => handleView(invoice)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 flex items-center gap-2"
                          >
                            <Eye size={16} /> View
                          </button>
                          <button
                            onClick={() => handleEdit(invoice)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 flex items-center gap-2"
                          >
                            <Edit size={16} /> Edit
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 flex items-center gap-2">
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
          {!loading && filteredInvoices.length === 0 && (
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

export default PurchaseInvoice;
