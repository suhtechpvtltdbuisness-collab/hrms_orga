import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../service";

export default function SsoCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const completeSso = async () => {
      const imported = authService.importSessionFromHash();
      if (!imported) {
        setError("Invalid or expired sign-in link. Please log in again.");
        return;
      }

      const profile = await authService.getProfile();
      if (!profile.success) {
        setError("Could not verify your session. Please log in again.");
        return;
      }

      if (!authService.isSubscribed(profile.data?.subscription)) {
        window.location.href = authService.getPricingUrl();
        return;
      }

      navigate("/hrms", { replace: true });
    };

    completeSso();
  }, [navigate]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-gray-600">
        <p>{error}</p>
        <button
          type="button"
          onClick={() => navigate("/auth", { replace: true })}
          className="px-6 py-2 rounded-full bg-[#7D1EDB] text-white"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen text-gray-500">
      Signing you in...
    </div>
  );
}
