import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { InputField } from "../../components/common/InputField";
import { Button } from "../../components/common/Button";
import { Toast } from "../../components/common/Toast";
import { authService } from "../../service";

export const LoginForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    if (!form.email || !form.password) return;

    setLoading(true);
    const result = await authService.login(form);

    if (result.success) {
      setToast({
        type: "success",
        title: "Login Successful",
        message: "Redirecting to dashboard...",
      });

      // Check role and redirect accordingly
      // If backend returns role field, use it; otherwise default to admin (/hrms)
      const userData = result.data?.user || result.data || {};
      const role = (userData?.role || "admin").toLowerCase();

      setTimeout(() => {
        if (role === "employee") {
          navigate("/employee", { replace: true });
        } else {
          navigate("/hrms", { replace: true });
        }
      }, 1000);
    } else {
      setToast({
        type: "error",
        title: "Login Failed",
        message: result.message || "Invalid credentials",
      });
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && form.email && form.password) {
      handleSubmit();
    }
  };

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />
      {!toast && (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
          <p className="text-sm text-gray-500 text-center mb-6">
            Local development sign-in
          </p>

          <InputField
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            icon={Mail}
            placeholder="Enter your email"
          />

          <InputField
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            icon={Lock}
            placeholder="Enter your password"
          />

          <div className="mt-6">
            <Button
              text="Login"
              onClick={handleSubmit}
              loading={loading}
              disabled={!form.email || !form.password}
            />
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400 mb-2">Are you an Employee?</p>
            <Link
              to="/employee/login"
              className="text-sm text-violet-600 font-semibold hover:underline"
            >
              → Go to Employee Portal Login
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
