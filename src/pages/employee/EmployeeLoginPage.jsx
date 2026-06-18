import React, { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../../service";

export default function EmployeeLoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  // If already logged in, go straight to employee panel
  useEffect(() => {
    const checkSession = async () => {
      const profile = await authService.getProfile();
      if (profile.success) {
        navigate("/employee", { replace: true });
      }
    };
    checkSession();
  }, [navigate]);

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
      // Always redirect to employee panel from this page
      navigate("/employee", { replace: true });
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
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-gradient-to-br from-[#a8c0ff] via-[#e0c3fc] to-[#f9f9ff]">
      <img src="/bg.svg" className="absolute inset-0 w-full h-full object-cover opacity-60" alt="" />

      <div className="relative z-10 flex flex-col items-center w-full max-w-md">
        {/* Logo — same as admin panel */}
        <div className="flex items-center gap-3 mb-6">
          <img src="/images/Orga Logo.svg" alt="ORGA" className="h-8" />
        </div>

        {/* Card */}
        <div className="w-full bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-center mb-2 text-gray-900">Employee Login</h1>
          <p className="text-sm text-gray-500 text-center mb-6">
            Sign in with your employee credentials
          </p>

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
                Email Address / Employee ID
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
                "Sign In to Employee Portal"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400 mb-2">Are you an Admin?</p>
            <Link
              to="/auth"
              className="inline-flex items-center gap-1.5 text-xs text-violet-600 font-semibold hover:underline"
            >
              <ArrowLeft className="w-3 h-3" />
              Go to Admin Login
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          © 2025 ORGA HRMS. All rights reserved.
        </p>
      </div>
    </div>
  );
}
