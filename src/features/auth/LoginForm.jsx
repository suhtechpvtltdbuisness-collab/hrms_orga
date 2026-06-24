import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, ShieldCheck, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../service";

export const LoginForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setError("");

    const result = await authService.login(form);

    if (result.success) {
      const userData = result.data?.user || result.data || {};
      const role = (userData?.role || "").toLowerCase();
      const type = (userData?.type || "").toLowerCase();
      // Admin: check role, type, AND isAdmin fields
      const isAdmin =
        role === "admin" ||
        role === "superadmin" ||
        type === "admin" ||
        type === "superadmin" ||
        userData?.isAdmin === true;

      if (isAdmin) {
        navigate("/hrms/dashboard", { replace: true });
      } else {
        navigate("/employee", { replace: true });
      }
    } else {
      setError(result.message || "Invalid credentials. Please try again.");
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && form.email && form.password) {
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <img src="/images/Orga Logo.svg" alt="ORGA HRMS" className="h-9" />
      </div>

      {/* Card */}
      <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Role Banner */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-tight">Welcome Back</p>
            <p className="text-white/75 text-xs">Sign in to continue to ORGA HRMS</p>
          </div>
        </div>

        <div className="px-8 py-7">
          {/* Role info notice */}
          <div className="flex items-center gap-2 bg-violet-50 border border-violet-100 rounded-xl px-3 py-2.5 mb-6">
            <UserRound className="w-4 h-4 text-violet-500 shrink-0" />
            <p className="text-xs text-violet-700 font-medium">
              Access is granted automatically based on your account role (Admin or Employee).
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="flex items-center gap-3 border border-gray-300 rounded-xl px-3 h-11 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-100 transition-all bg-white">
                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your email"
                  className="flex-1 outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="flex items-center gap-3 border border-gray-300 rounded-xl px-3 h-11 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-100 transition-all bg-white">
                <Lock className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your password"
                  className="flex-1 outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="text-right -mt-2">
              <button type="button" className="text-xs text-violet-600 font-medium hover:underline">
                Forgot Password? Contact HR
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !form.email || !form.password}
              className="w-full h-11 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md text-sm"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-5">
        © 2025 ORGA HRMS. All rights reserved.
      </p>
    </div>
  );
};
