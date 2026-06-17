import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { authService } from "../service";

const ProtectedRoute = ({ children }) => {
  const [authState, setAuthState] = useState("loading");

  useEffect(() => {
    const verifySession = async () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      const authToken = localStorage.getItem("authToken");

      if (isLoggedIn && authToken) {
        setAuthState("authenticated");
        return;
      }

      const profile = await authService.getProfile();
      if (profile.success) {
        setAuthState("authenticated");
        return;
      }

      setAuthState("unauthenticated");
    };

    verifySession();
  }, []);

  if (authState === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Checking session...
      </div>
    );
  }

  if (authState === "unauthenticated") {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
