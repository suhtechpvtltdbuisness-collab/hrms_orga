export const formatCurrency = (val) => {
  if (val === undefined || val === null || val === "") return "₹0";
  if (typeof val === "string" && val === "-") return "-";
  
  // If it's already a formatted string, return as is (optional safeguard)
  if (typeof val === "string" && val.includes("₹")) return val;

  const num = Number(val);
  if (isNaN(num)) return val;

  const isNegative = num < 0;
  const absVal = Math.abs(num);
  
  // Format to standard Indian grouping (e.g. 1,00,000)
  const formatted = absVal.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });

  return isNegative ? `-₹${formatted}` : `₹${formatted}`;
};

export const formatCurrencyPDF = (val) => {
  const formatted = formatCurrency(val);
  // jsPDF standard fonts don't handle the ₹ symbol well, so convert to Rs.
  if (typeof formatted === "string") {
    return formatted.replace(/₹/g, "Rs. ");
  }
  return formatted;
};
