import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Plus, MoreVertical } from "lucide-react";
import FilterDropdown from "../../../../components/ui/FilterDropdown";
import { invoiceService } from "../../../../service";

const RecurringInvoice = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [invoices, setInvoices] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    client: "",
    invoiceDate: "",
    invoiceType: "",
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

  const loadInvoices = async () => {
    setLoading(true);
    const result = await invoiceService.getRecurringInvoices();
    setInvoices(result.success ? result.data || [] : []);
    if (!result.success) {
      alert(result.message || "Failed to load recurring invoices");
    }
    setLoading(false);
  };

  useEffect(() => {
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

  const handleEdit = (invoice) => {
    setActionMenuOpen(null);
    navigate(`/hrms/recurring-invoice/edit/${invoice.id}`, {
      state: { invoice, mode: "edit" },
    });
  };

  const handleDelete = async (invoice) => {
    setActionMenuOpen(null);
    const result = await invoiceService.updateRecurringInvoice(invoice.id, {
      status: "Inactive",
    });
    if (!result.success) {
      alert(result.message || "Failed to deactivate invoice");
      return;
    }
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoice.id ? { ...inv, status: "Inactive" } : inv,
      ),
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-[#76DB1E33] text-[#76DB1E]";
      case "Inactive":
        return "bg-[#FFDBCC] text-[#DB471E]";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    return (
      (!filters.status || inv.status === filters.status) &&
      (!filters.client ||
        inv.client?.toLowerCase().includes(filters.client.toLowerCase())) &&
      (!filters.invoiceDate || inv.billDate === filters.invoiceDate) &&
      (!filters.invoiceType || inv.invoiceType === filters.invoiceType)
    );
  });

  const uniqueClients = [
    ...new Set(invoices.map((i) => i.client).filter(Boolean)),
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
        <span className="text-[#6B7280]">Recurring Invoice</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1
          className="text-[20px] font-semibold text-[#494949]"
          style={{ fontFamily: "Nunito Sans,sans-serif" }}
        >
          Recurring Invoice
        </h1>

        <button
          onClick={() => navigate("/hrms/recurring-invoice/new")}
          className="flex items-center justify-center gap-2 text-white font-medium hover:bg-purple-700 transition-colors bg-[#7D1EDB] w-full sm:w-auto min-w-50"
          style={{
            height: "48px",
            padding: "8px 12px",
            borderRadius: "26px",
          }}
        >
          <span>Create New Recurring Invoice</span>
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
            options={["Active", "Inactive"]}
            value={filters.status}
            onChange={(val) => setFilters((prev) => ({ ...prev, status: val }))}
            minWidth="120px"
          />
          <FilterDropdown
            label="Client"
            options={uniqueClients}
            value={filters.client}
            onChange={(val) => setFilters((prev) => ({ ...prev, client: val }))}
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
          <FilterDropdown
            label="Invoice Type"
            options={["Monthly", "Quarterly", "Yearly"]}
            value={filters.invoiceType}
            onChange={(val) =>
              setFilters((prev) => ({ ...prev, invoiceType: val }))
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
                  Invoice Title
                </th>
                <th className="py-3 px-4 text-[14px] font-normal text-[#8B8B8B]">
                  Client
                </th>
                <th className="py-3 px-4 text-[14px] font-normal text-[#8B8B8B]">
                  Invoice Type
                </th>
                <th className="py-3 px-4 text-[14px] font-normal text-[#8B8B8B]">
                  Bill Date
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
                      {invoice.invoiceTitle}
                    </td>
                    <td className="py-2 px-4 text-[14px] font-semibold text-[#000000]">
                      {invoice.client}
                    </td>
                    <td className="py-2 px-4 text-[14px] font-semibold text-[#000000]">
                      {invoice.invoiceType}
                    </td>
                    <td className="py-2 px-4 text-[14px] font-semibold text-[#000000]">
                      {formatDate(invoice.billDate)}
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
                          className="fixed w-40 bg-white font-normal rounded-lg shadow-lg border border-gray-100 py-1 z-50"
                          style={{
                            top: menuPosition.top,
                            left: menuPosition.left,
                          }}
                        >
                          <button
                            onClick={() => handleEdit(invoice)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 flex items-center gap-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(invoice)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 flex items-center gap-2"
                          >
                            Deactivate
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 flex items-center gap-2">
                            Generate Invoice
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

export default RecurringInvoice;
