import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { ChevronRight, Plus, Trash2 } from "lucide-react";
import CustomDatePicker from "../../../../components/ui/CustomDatePicker";
import FilterDropdown from "../../../../components/ui/FilterDropdown";

const AddRecurringInvoice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  // Detect mode: 'view', 'edit', or 'create'
  let mode = location.state?.mode;
  if (!mode) {
    if (location.pathname.includes("/view/")) mode = "view";
    else if (location.pathname.includes("/edit/")) mode = "edit";
    else mode = "create";
  }

  const invoiceFromState = location.state?.invoice;

  // Form State
  const [invoiceData, setInvoiceData] = useState({
    invoiceTitle: "",
    client: "",
    invoiceType: "",
    billDate: "",
    revenueAccount: "",
    taxRules: "",
  });

  const [items, setItems] = useState([
    { id: 1, phase: "", amount: "", scheduleDate: "" },
  ]);

  // Derived State for Totals
  const [subTotal, setSubTotal] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  // Load invoice data for view/edit modes
  useEffect(() => {
    const loadInvoiceData = (invoice) => {
      setInvoiceData({
        invoiceTitle: invoice.invoiceTitle || "",
        client: invoice.client || "",
        invoiceType: invoice.invoiceType || "",
        billDate: invoice.billDate || "",
        revenueAccount: invoice.revenueAccount || "",
        taxRules: invoice.taxRules || "",
      });

      if (invoice.items && invoice.items.length > 0) {
        setItems(invoice.items);
      }
    };

    if (mode !== "create") {
      if (invoiceFromState) {
        loadInvoiceData(invoiceFromState);
      } else if (id) {
        // Fallback to localStorage if state is lost (e.g. reload)
        const storedInvoices =
          JSON.parse(localStorage.getItem("recurringInvoices")) || [];
        const foundInvoice = storedInvoices.find(
          (inv) => String(inv.id) === String(id)
        );
        if (foundInvoice) {
          loadInvoiceData(foundInvoice);
        }
      }
    }
  }, [mode, invoiceFromState, id]);

  useEffect(() => {
    const newSubTotal = items.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );
    const newTotalTax = invoiceData.taxRules
      ? newSubTotal * (Number(invoiceData.taxRules) / 100)
      : 0;

    setSubTotal(newSubTotal);
    setTotalTax(newTotalTax);
    setGrandTotal(newSubTotal + newTotalTax);
  }, [items, invoiceData.taxRules]);

  const handleAddItem = () => {
    const newId =
      items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
    setItems([
      ...items,
      { id: newId, phase: "", amount: "", scheduleDate: "" },
    ]);
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleItemChange = (id, field, value) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          if (field === "phase") {
            if (/^[a-zA-Z0-9\s]*$/.test(value)) {
              return { ...item, [field]: value };
            }
            return item;
          } else if (field === "amount") {
            if (/^\d*\.?\d*$/.test(value)) {
              return { ...item, [field]: value };
            }
            return item;
          }
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const handleSave = () => {
    if (
      !invoiceData.invoiceTitle ||
      !invoiceData.client ||
      !invoiceData.billDate
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const newInvoice = {
      id: Date.now(),
      invoiceTitle: invoiceData.invoiceTitle,
      client: invoiceData.client,
      invoiceType: invoiceData.invoiceType,
      billDate: invoiceData.billDate,
      revenueAccount: invoiceData.revenueAccount,
      taxRules: invoiceData.taxRules,
      amount: grandTotal,
      status: "Active",
      items: items,
    };

    // Save to localStorage
    const existingInvoices =
      JSON.parse(localStorage.getItem("recurringInvoices")) || [];
    localStorage.setItem(
      "recurringInvoices",
      JSON.stringify([newInvoice, ...existingInvoices])
    );

    console.log("Saving recurring invoice:", newInvoice);
    navigate("/hrms/recurring-invoice");
  };

  const handleUpdate = () => {
    if (
      !invoiceData.invoiceTitle ||
      !invoiceData.client ||
      !invoiceData.billDate
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const invoicePayload = {
      id: invoiceFromState.id,
      invoiceTitle: invoiceData.invoiceTitle,
      client: invoiceData.client,
      invoiceType: invoiceData.invoiceType,
      billDate: invoiceData.billDate,
      revenueAccount: invoiceData.revenueAccount,
      taxRules: invoiceData.taxRules,
      amount: grandTotal,
      status: invoiceFromState.status,
      items: items,
    };

    // Update in localStorage
    const existingInvoices =
      JSON.parse(localStorage.getItem("recurringInvoices")) || [];
    const updatedInvoices = existingInvoices.map((inv) =>
      inv.id === invoicePayload.id ? invoicePayload : inv
    );
    localStorage.setItem("recurringInvoices", JSON.stringify(updatedInvoices));

    console.log("Updating recurring invoice:", invoicePayload);
    navigate("/hrms/recurring-invoice");
  };

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
          onClick={() => navigate("/hrms/recurring-invoice")}
        />
        <span
          className="cursor-pointer text-[#7D1EDB]"
          onClick={() => navigate("/hrms/recurring-invoice")}
        >
          Recurring Invoice
        </span>
        <ChevronRight size={14} />
        <span className="text-[#6B7280]">
          {mode === "create"
            ? "New Recurring Invoice"
            : invoiceData.invoiceTitle || "Invoice Details"}
        </span>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h1
          className="text-[20px] font-semibold text-[#494949]"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          {mode === "create"
            ? "New Recurring Invoice"
            : invoiceData.invoiceTitle || "Invoice Details"}
        </h1>

        <div className="flex gap-3">
          <button
            className="px-4 py-2 rounded-full border border-[#7D1EDB] text-[#7D1EDB] font-normal hover:bg-purple-50 transition-colors"
            onClick={() => navigate("/hrms/recurring-invoice")}
          >
            {mode === "view" ? "Back" : "Cancel"}
          </button>
          {mode !== "view" && (
            <button
              className="px-4 py-2 rounded-full bg-[#7D1EDB] text-white font-normal hover:bg-purple-700 transition-colors"
              onClick={mode === "edit" ? handleUpdate : handleSave}
            >
              {mode === "edit" ? "Update" : "Save"}
            </button>
          )}
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto pr-2">
        {/* Recurring Invoice Details Card */}
        <div className="border border-[#E0E0E0] rounded-lg p-4 mb-4">
          <h3
            className="text-[15px] font-semibold text-[#000000] mb-3"
            style={{ fontFamily: '"Nunito Sans", sans-serif' }}
          >
            Recurring Invoice Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Invoice Title */}
            <div>
              <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">
                Invoice Title
              </label>
              <input
                type="text"
                className="w-full border border-[#D9D9D9] rounded-lg px-4 py-2 text-[16px] text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB] placeholder-[#B3B3B3]"
                placeholder="Enter title"
                value={invoiceData.invoiceTitle}
                disabled={mode === "view"}
                onChange={(e) =>
                  setInvoiceData({
                    ...invoiceData,
                    invoiceTitle: e.target.value,
                  })
                }
              />
            </div>

            {/* Client */}
            <div>
              <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">
                Client
              </label>
              <input
                type="text"
                className="w-full border border-[#D9D9D9] rounded-lg px-4 py-2 text-[16px] text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB] placeholder-[#B3B3B3]"
                placeholder="Enter client name"
                value={invoiceData.client}
                disabled={mode === "view"}
                onChange={(e) =>
                  setInvoiceData({ ...invoiceData, client: e.target.value })
                }
              />
            </div>

            {/* Invoice Type */}
            <div>
              <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">
                Invoice Type
              </label>
              <FilterDropdown
                label="Invoice Type"
                placeholder="Select type"
                options={[
                  { label: "Monthly", value: "Monthly" },
                  { label: "Quarterly", value: "Quarterly" },
                  { label: "Yearly", value: "Yearly" },
                ]}
                value={invoiceData.invoiceType}
                onChange={(val) =>
                  setInvoiceData({ ...invoiceData, invoiceType: val })
                }
                disabled={mode === "view"}
                disableAllOption={true}
                className="w-full flex items-center justify-between border border-[#D9D9D9] rounded-lg px-4 py-2 text-[16px] text-[#1E1E1E] bg-white outline-none hover:border-[#7D1EDB] transition-colors"
                buttonTextClassName="text-[#1E1E1E]"
              />
            </div>

            {/* Bill Date */}
            <div>
              <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">
                Bill Date
              </label>
              <CustomDatePicker
                value={invoiceData.billDate}
                onChange={(date) =>
                  setInvoiceData({ ...invoiceData, billDate: date })
                }
                placeholder="Select date"
                disabled={mode === "view"}
              />
            </div>
          </div>
        </div>

        {/* Line Items Card */}
        <div className="border border-[#D6D6D6] rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h2
              className="text-[16px] font-medium text-[#1E1E1E]"
              style={{ fontFamily: '"Nunito Sans", sans-serif' }}
            >
              Line Items
            </h2>
          </div>

          <div className="overflow-x-auto border border-[#CECECE] rounded-lg">
            <table className="w-full">
              <thead className="bg-white border-b border-[#CECECE]">
                <tr>
                  <th
                    className="px-4 py-3 text-center text-[14px] font-normal text-[#757575]"
                    style={{ fontFamily: '"Poppins", sans-serif' }}
                  >
                    No Of Phases
                  </th>
                  <th
                    className="px-4 py-3 text-center text-[14px] font-normal text-[#757575]"
                    style={{ fontFamily: '"Poppins", sans-serif' }}
                  >
                    Amount
                  </th>
                  <th
                    className="px-4 py-3 text-center text-[14px] font-normal text-[#757575]"
                    style={{ fontFamily: '"Poppins", sans-serif' }}
                  >
                    Schedule Date
                  </th>
                  <th
                    className="px-4 py-3 text-right text-[14px] font-normal text-[#757575] w-24"
                    style={{ fontFamily: '"Poppins", sans-serif' }}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr
                    key={item.id}
                    className="last:border-b-0"
                    style={{ fontFamily: '"Inter", sans-serif' }}
                  >
                    <td className="px-4 py-3 text-center">
                      <input
                        type="text"
                        value={item.phase}
                        onChange={(e) =>
                          handleItemChange(item.id, "phase", e.target.value)
                        }
                        disabled={mode === "view"}
                        className="w-full text-center text-[14px] font-normal text-[#1E1E1E] focus:outline-none bg-transparent"
                        placeholder="Phase name"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="text"
                        value={item.amount}
                        onChange={(e) =>
                          handleItemChange(item.id, "amount", e.target.value)
                        }
                        disabled={mode === "view"}
                        className="w-full text-center text-[14px] font-normal text-[#1E1E1E] focus:outline-none bg-transparent"
                        placeholder="Amount"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="text"
                        value={item.scheduleDate}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "scheduleDate",
                            e.target.value
                          )
                        }
                        disabled={mode === "view"}
                        className="w-full text-center text-[14px] font-normal text-[#1E1E1E] focus:outline-none bg-transparent"
                        placeholder="DD/MM/YYYY"
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      {mode !== "view" && (
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-[#1E1E1E] hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {mode !== "view" && (
          <button
            onClick={handleAddItem}
            className="bg-white text-[#7D1EDB] py-2 px-3 rounded-full text-[14px] font-normal border border-[#7D1EDB] cursor-pointer hover:bg-purple-100 transition-colors"
          >
            Add Item
          </button>
        )}

        {/* Revenue Account & Tax Rules */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 mb-4">
          <div>
            <label
              className="block text-[16px] font-semibold text-[#1E1E1E] mb-1"
              style={{ fontFamily: '"Nunito Sans", sans-serif' }}
            >
              Revenue Account
            </label>
            <input
              type="text"
              className="w-full border border-[#D9D9D9] rounded-lg px-4 py-2 text-[16px] text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB] placeholder-[#B3B3B3]"
              placeholder="Enter account name"
              value={invoiceData.revenueAccount}
              disabled={mode === "view"}
              onChange={(e) =>
                setInvoiceData({
                  ...invoiceData,
                  revenueAccount: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label
              className="block text-[16px] font-semibold text-[#1E1E1E] mb-1"
              style={{ fontFamily: '"Nunito Sans", sans-serif' }}
            >
              Tax rules
            </label>
            <input
              type="text"
              className="w-full border border-[#D9D9D9] rounded-lg px-4 py-2 text-[16px] text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB] placeholder-[#B3B3B3]"
              placeholder="Enter text"
              value={invoiceData.taxRules}
              disabled={mode === "view"}
              onChange={(e) =>
                setInvoiceData({ ...invoiceData, taxRules: e.target.value })
              }
            />
          </div>
        </div>

        {/* Footer Actions */}
        {mode === "create" && (
          <div className="flex gap-3">
            <button
              className="px-6 py-2 rounded-full bg-[#7D1EDB] text-white font-medium hover:bg-purple-700 transition-colors"
              onClick={handleSave}
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Create Invoice
            </button>
            <button
              className="px-6 py-2 rounded-full border border-[#7D1EDB] text-[#7D1EDB] font-medium hover:bg-purple-50 transition-colors"
              onClick={() => navigate("/hrms/recurring-invoice")}
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddRecurringInvoice;
