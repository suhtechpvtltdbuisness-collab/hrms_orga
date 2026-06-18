import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { authService } from "../service";
import { isLocalAuthEnabled } from "../utils/authMode";

const EmployeeProtectedRoute = ({ children }) => {
  const [authState, setAuthState] = useState("loading");

  useEffect(() => {
    const verifySession = async () => {
      const profile = await authService.getProfile();

      if (!profile.success) {
        setAuthState("unauthenticated");
        return;
      }

      // If user is admin, redirect them to admin panel
      const userData = profile.data?.user || profile.data;
      const role = userData?.role?.toLowerCase?.() || "employee";

      if (role === "admin" || role === "superadmin") {
        setAuthState("admin");
        return;
      }

      setAuthState("authenticated");
    };

    verifySession();
  }, []);

  if (authState === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-violet-50 to-indigo-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (authState === "unauthenticated") {
    return <Navigate to="/auth" replace />;
  }

  if (authState === "admin") {
    return <Navigate to="/hrms" replace />;
  }

  return children;
};

export default EmployeeProtectedRoute;
