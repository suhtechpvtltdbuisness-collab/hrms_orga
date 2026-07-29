import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import FilterDropdown from "../../../../components/ui/FilterDropdown";
import CustomDatePicker from "../../../../components/ui/CustomDatePicker";
import { invoiceService } from "../../../../service";

const RecordPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  let mode = location.state?.mode;
  if (!mode) {
    if (location.pathname.includes("/view/")) mode = "view";
    else if (location.pathname.includes("/edit/")) mode = "edit";
    else mode = "create";
  }

  const paymentFromState = location.state?.payment;

  const [paymentData, setPaymentData] = useState({
    paymentMode: "",
    amount: "",
    paymentDate: "",
    customer: "",
    invoiceNumber: "",
  });
  const [status, setStatus] = useState("Pending");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadPaymentData = (payment) => {
      setPaymentData({
        paymentMode: payment.method || "",
        amount: payment.amount ?? "",
        paymentDate: payment.paymentDate || "",
        customer: payment.customer || "",
        invoiceNumber: payment.invoiceNumber || "",
      });
      setStatus(payment.status || "Pending");
    };

    const load = async () => {
      if (mode === "create") return;
      if (paymentFromState) {
        loadPaymentData(paymentFromState);
        return;
      }
      if (id) {
        const result = await invoiceService.getPayment(id);
        if (result.success) loadPaymentData(result.data);
        else alert(result.message || "Failed to load payment");
      }
    };
    load();
  }, [mode, paymentFromState, id]);

  const buildPayload = () => ({
    paymentMode: paymentData.paymentMode,
    method: paymentData.paymentMode,
    amount: paymentData.amount,
    paymentDate: paymentData.paymentDate,
    customer: paymentData.customer,
    invoiceNumber: paymentData.invoiceNumber || null,
    status,
  });

  const handleSave = async () => {
    if (
      !paymentData.paymentMode ||
      !paymentData.amount ||
      !paymentData.paymentDate ||
      !paymentData.customer
    ) {
      alert("Please fill in all required fields");
      return;
    }
    setSaving(true);
    const result = await invoiceService.createPayment(buildPayload());
    setSaving(false);
    if (!result.success) {
      alert(result.message || "Failed to record payment");
      return;
    }
    navigate("/hrms/invoice-payment-allocation");
  };

  const handleUpdate = async () => {
    if (
      !paymentData.paymentMode ||
      !paymentData.amount ||
      !paymentData.paymentDate ||
      !paymentData.customer
    ) {
      alert("Please fill in all required fields");
      return;
    }
    const paymentId = paymentFromState?.id || id;
    setSaving(true);
    const result = await invoiceService.updatePayment(paymentId, buildPayload());
    setSaving(false);
    if (!result.success) {
      alert(result.message || "Failed to update payment");
      return;
    }
    navigate("/hrms/invoice-payment-allocation");
  };

  return (
    <div
      className="bg-white px-4 sm:px-4 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col font-inter"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div
        className="flex items-center gap-2 mb-2 text-sm text-gray-500 shrink-0"
        style={{ fontFamily: "Mulish, sans-serif" }}
      >
        <img
          src="/images/arrow_left_alt.svg"
          alt="Back"
          className="w-3 h-3 cursor-pointer hover:scale-110 transition-transform"
          onClick={() => navigate("/hrms/invoice-payment-allocation")}
        />
        <span
          className="cursor-pointer text-[#7D1EDB]"
          onClick={() => navigate("/hrms/invoice-payment-allocation")}
        >
          Invoice Payment Allocation
        </span>
        <ChevronRight size={14} />
        <span className="text-[#6B7280]">
          {mode === "create"
            ? "Record Payment"
            : paymentFromState?.invoiceNumber ||
              paymentData.invoiceNumber ||
              "Payment Details"}
        </span>
      </div>

      <div className="flex justify-between items-center mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <h1
            className="text-[20px] font-semibold text-[#494949]"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {mode === "create"
              ? "Record Payment"
              : paymentFromState?.invoiceNumber ||
                paymentData.invoiceNumber ||
                "Payment Details"}
          </h1>
          {mode !== "create" && (
            <span className="px-3 py-1 rounded-full text-[12px] font-medium border border-[#D9D9D9] text-[#1E1E1E] bg-white">
              {status || "Paid"}
            </span>
          )}
        </div>

        <div className="flex gap-3">
          <button
            className="px-4 py-2 rounded-full border border-[#7D1EDB] text-[#7D1EDB] font-normal hover:bg-purple-50 transition-colors"
            onClick={() => navigate("/hrms/invoice-payment-allocation")}
          >
            {mode === "view" ? "Back" : "Cancel"}
          </button>
          {mode !== "view" && (
            <button
              className="px-4 py-2 rounded-full bg-[#7D1EDB] text-white font-normal hover:bg-purple-700 transition-colors disabled:opacity-60"
              disabled={saving}
              onClick={mode === "edit" ? handleUpdate : handleSave}
            >
              {saving ? "Saving..." : mode === "edit" ? "Update" : "Save"}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        <div className="border border-[#E0E0E0] rounded-lg p-4 mb-4">
          <h3
            className="text-[15px] font-semibold text-[#000000] mb-3"
            style={{ fontFamily: '"Nunito Sans", sans-serif' }}
          >
            Payment Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">
                Customer
              </label>
              <input
                type="text"
                className="w-full border border-[#D9D9D9] rounded-lg px-4 py-2 text-[16px] text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB] placeholder-[#B3B3B3]"
                placeholder="Enter customer"
                value={paymentData.customer}
                disabled={mode === "view"}
                onChange={(e) =>
                  setPaymentData({ ...paymentData, customer: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">
                Invoice Number
              </label>
              <input
                type="text"
                className="w-full border border-[#D9D9D9] rounded-lg px-4 py-2 text-[16px] text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB] placeholder-[#B3B3B3]"
                placeholder="Enter invoice number"
                value={paymentData.invoiceNumber}
                disabled={mode === "view"}
                onChange={(e) =>
                  setPaymentData({
                    ...paymentData,
                    invoiceNumber: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">
                Payment Mode
              </label>
              <FilterDropdown
                label="Payment Mode"
                placeholder="Select mode"
                options={[
                  { label: "Bank Transfer", value: "Bank Transfer" },
                  { label: "Cash", value: "Cash" },
                  { label: "Check", value: "Check" },
                  { label: "UPI", value: "UPI" },
                  { label: "Credit Card", value: "Credit Card" },
                ]}
                value={paymentData.paymentMode}
                onChange={(val) =>
                  setPaymentData({ ...paymentData, paymentMode: val })
                }
                disabled={mode === "view"}
                disableAllOption={true}
                className="w-full flex items-center justify-between border border-[#D9D9D9] rounded-lg px-4 py-2 text-[16px] text-[#1E1E1E] bg-white outline-none hover:border-[#7D1EDB] transition-colors"
                buttonTextClassName="text-[#1E1E1E]"
              />
            </div>

            <div>
              <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">
                Amount
              </label>
              <input
                type="text"
                className="w-full border border-[#D9D9D9] rounded-lg px-4 py-2 text-[16px] text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB] placeholder-[#B3B3B3]"
                placeholder="Enter amount"
                value={paymentData.amount}
                disabled={mode === "view"}
                onChange={(e) => {
                  if (/^\d*\.?\d*$/.test(e.target.value)) {
                    setPaymentData({ ...paymentData, amount: e.target.value });
                  }
                }}
              />
            </div>

            <div>
              <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">
                Payment Date
              </label>
              <CustomDatePicker
                value={paymentData.paymentDate}
                onChange={(date) =>
                  setPaymentData({ ...paymentData, paymentDate: date })
                }
                placeholder="Select date"
                disabled={mode === "view"}
              />
            </div>
          </div>
        </div>

        {mode === "create" && (
          <div className="flex gap-3">
            <button
              className="px-6 py-2 rounded-full bg-[#7D1EDB] text-white font-medium hover:bg-purple-700 transition-colors disabled:opacity-60"
              onClick={handleSave}
              disabled={saving}
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              {saving ? "Saving..." : "Record Invoice"}
            </button>
            <button
              className="px-6 py-2 rounded-full border border-[#7D1EDB] text-[#7D1EDB] font-medium hover:bg-purple-50 transition-colors"
              onClick={() => navigate("/hrms/invoice-payment-allocation")}
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

export default RecordPayment;
