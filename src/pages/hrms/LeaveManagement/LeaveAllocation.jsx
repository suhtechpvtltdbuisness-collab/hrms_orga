import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { employeeService, leaveService } from "../../../service";

const LeaveAllocation = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    empId: "",
    sickLeave: "",
    casualLeave: "",
    paidLeave: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [currentBalance, setCurrentBalance] = useState(null);

  useEffect(() => {
    const loadEmployees = async () => {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const adminId = userData?.id;
      if (!adminId) return;
      const res = await employeeService.getAllEmployeesByAdminId(adminId);
      if (res.success && res.data) {
        setEmployees(
          res.data.map((item) => ({
            id: item.user?.id || item.userId,
            name: item.user?.name || "Employee",
            email: item.user?.email,
          })),
        );
      }
    };
    loadEmployees();
  }, []);

  useEffect(() => {
    const loadBalance = async () => {
      if (!form.empId) {
        setCurrentBalance(null);
        return;
      }
      const res = await leaveService.getBalance(form.empId);
      if (res.success && res.data) {
        setCurrentBalance(res.data);
        setForm((prev) => ({
          ...prev,
          sickLeave: res.data.sickLeave ?? "",
          casualLeave: res.data.casualLeave ?? "",
          paidLeave: res.data.paidLeave ?? "",
        }));
      } else {
        setCurrentBalance(null);
        setForm((prev) => ({ ...prev, sickLeave: "", casualLeave: "", paidLeave: "" }));
      }
    };
    loadBalance();
  }, [form.empId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.empId) {
      setMessage({ type: "error", text: "Select an employee" });
      return;
    }
    setLoading(true);
    setMessage(null);
    const res = await leaveService.allocateLeave({
      empId: Number(form.empId),
      sickLeave: Number(form.sickLeave) || 0,
      casualLeave: Number(form.casualLeave) || 0,
      paidLeave: Number(form.paidLeave) || 0,
    });
    setLoading(false);
    if (res.success) {
      setMessage({ type: "success", text: res.message || "Leave allocated successfully" });
      const balanceRes = await leaveService.getBalance(form.empId);
      if (balanceRes.success) setCurrentBalance(balanceRes.data);
    } else {
      setMessage({ type: "error", text: res.message });
    }
  };

  return (
    <div className="bg-white px-4 sm:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl min-h-[calc(100vh-10rem)] font-popins max-w-3xl">
      <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
        <span className="cursor-pointer text-[#7D1EDB]" onClick={() => navigate("/hrms")}>
          HRMS Dashboard
        </span>
        <ChevronRight size={14} />
        <span>Leave Allocation</span>
      </div>

      <h1 className="text-[20px] font-semibold text-[#494949] mb-6">Allocate Leave to Employee</h1>

      {message && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${
          message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Employee *</label>
          <select
            value={form.empId}
            onChange={(e) => setForm({ ...form, empId: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm"
            required
          >
            <option value="">Select employee</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.email})
              </option>
            ))}
          </select>
        </div>

        {currentBalance && (
          <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 text-sm text-gray-600">
            <p className="font-medium text-gray-800 mb-1">Current balance</p>
            <p>Sick: {currentBalance.sickRemaining}/{currentBalance.sickLeave} · Casual: {currentBalance.casualRemaining}/{currentBalance.casualLeave} · Paid: {currentBalance.paidRemaining}/{currentBalance.paidLeave}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sick Leave</label>
            <input type="number" min="0" value={form.sickLeave} onChange={(e) => setForm({ ...form, sickLeave: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Casual Leave</label>
            <input type="number" min="0" value={form.casualLeave} onChange={(e) => setForm({ ...form, casualLeave: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Paid / Earned Leave</label>
            <input type="number" min="0" value={form.paidLeave} onChange={(e) => setForm({ ...form, paidLeave: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-[#7D1EDB] text-white rounded-full font-medium hover:bg-purple-700 disabled:opacity-60"
        >
          {loading ? "Saving..." : currentBalance ? "Update Allocation" : "Allocate Leave"}
        </button>
      </form>
    </div>
  );
};

export default LeaveAllocation;
