import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { LoginForm } from "../../features/auth/LoginForm";
// import { RegisterForm } from "../../features/auth/RegisterForm";
// import { ForgotPasswordForm } from "../../features/auth/ForgotPasswordForm";
// import { ResetPasswordForm } from "../../features/auth/ResetPasswordForm";

export default function AuthPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "login";
  const [verifiedEmail, setVerifiedEmail] = useState("");

  const switchMode = (newMode) => {
    setSearchParams({ mode: newMode });
  };

  const handleSendResetLink = (email) => {
    console.log("Reset link sent to:", email);
    setVerifiedEmail(email);
    switchMode("reset");
  };

  const handleResetPassword = (newPassword) => {
    console.log("Password reset for:", verifiedEmail, "New password:", newPassword);
    switchMode("login");
  };

  const renderContent = () => {
    if (mode === "login") {
      return (
        <LoginForm
          onRegister={() => switchMode("register")}
          onForgotPassword={() => switchMode("forgot")}
        />
      );
    }
    if (mode === "register") {
      return (
        <RegisterForm
          onLogin={() => switchMode("login")}
        />
      );
    }
    if (mode === "forgot") {
      return (
        <ForgotPasswordForm
          onGetLink={handleSendResetLink}
          onBack={() => switchMode("login")}
        />
      );
    }
    if (mode === "reset") {
      return (
        <ResetPasswordForm
          email={verifiedEmail}
          onSubmit={handleResetPassword}
          onBack={() => switchMode("login")}
        />
      );
    }
    return null;
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