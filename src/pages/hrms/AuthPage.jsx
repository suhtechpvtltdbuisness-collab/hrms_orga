import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "../../features/auth/LoginForm";
import { authService } from "../../service";
import { isLocalAuthEnabled } from "../../utils/authMode";

export default function AuthPage() {
  const navigate = useNavigate();
  const localAuth = isLocalAuthEnabled();

  useEffect(() => {
    if (!localAuth) {
      window.location.replace(
        `${authService.getMainSiteUrl()}/auth?mode=login`,
      );
      return;
    }

    const checkExistingSession = async () => {
      const profile = await authService.getProfile();
      if (profile.success) {
        const userData = profile.data?.user || profile.data;
        const role = (userData?.role || "").toLowerCase();
        const type = (userData?.type || "").toLowerCase();
        const isAdmin =
          role === "admin" ||
          role === "superadmin" ||
          type === "admin" ||
          type === "superadmin" ||
          userData?.isAdmin === true;
        if (isAdmin) {
          navigate("/hrms", { replace: true });
        } else {
          navigate("/employee", { replace: true });
        }
      }
    };

    checkExistingSession();
  }, [localAuth, navigate]);

  if (!localAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Redirecting to main sign in...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-gradient-to-br from-[#a8c0ff] via-[#e0c3fc] to-[#f9f9ff]">
      <img src="/bg.svg" className="absolute inset-0 w-full h-full object-cover opacity-60" alt="" />
      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl">
        <LoginForm />
      </div>
    </div>
  );
}
