import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { LoginForm } from "../../features/auth/LoginForm";
import { authService } from "../../service";

export default function AuthPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get("mode") || "login";

  useEffect(() => {
    const checkExistingSession = async () => {
      const profile = await authService.getProfile();
      if (
        profile.success &&
        authService.isSubscribed(profile.data?.subscription)
      ) {
        navigate("/hrms", { replace: true });
      } else if (profile.success) {
        window.location.href = authService.getPricingUrl();
      }
    };

    checkExistingSession();
  }, [navigate]);

  const switchMode = (newMode) => {
    setSearchParams({ mode: newMode });
  };

  const renderContent = () => {
    // Only login is implemented — all other modes redirect back to login
    if (mode === "login") {
      return (
        <LoginForm
          onRegister={() => switchMode("login")}
          onForgotPassword={() => switchMode("login")}
        />
      );
    }
    // Fallback: redirect to login for unimplemented modes
    return (
      <LoginForm
        onRegister={() => switchMode("login")}
        onForgotPassword={() => switchMode("login")}
      />
    );
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-gradient-to-br from-[#a8c0ff] via-[#e0c3fc] to-[#f9f9ff]">
      {/* Background Artwork */}
      <img src="/bg.svg" className="absolute inset-0 w-full h-full object-cover opacity-60" alt="background" />
      <img src="/Arrow_Graphic elements.svg" className="absolute bottom-1 left-8 w-60 opacity-80" alt="arrow graphic" />
      <img src="/Graphic elements.svg" className="absolute top-[10px] right-[450px] w-[240px] opacity-80" alt="graphic element" />
      <img src="/Graphic elements (1).svg" className="absolute bottom-[-100px] right-[-100px] w-[400px] opacity-80" alt="graphic element" />

      {/* Main UI */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl">
        {renderContent()}
      </div>
    </div>
  );
}