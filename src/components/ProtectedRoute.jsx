import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { authService } from "../service";
import { isLocalAuthEnabled } from "../utils/authMode";
import SubscriptionRequiredModal from "./SubscriptionRequiredModal";

const ProtectedRoute = ({ children }) => {
  const [authState, setAuthState] = useState("loading");
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const verifySession = async () => {
      const profile = await authService.getProfile();

      if (!profile.success) {
        setAuthState("unauthenticated");
        return;
      }

      setProfileData(profile);

      // Admin detection: check role, type, AND isAdmin — backend may use any of these
      const userData = profile.data?.user || profile.data;
      const role = (userData?.role || "").toLowerCase();
      const type = (userData?.type || "").toLowerCase();
      const roleId = userData?.roleId;
      const isSuperAdmin = roleId == 0 || role === "superadmin" || type === "superadmin";
      const isAdmin = roleId == 1 || role === "admin" || type === "admin" || userData?.isAdmin === true;

      console.log("🔍 [ProtectedRoute] userData:", userData);
      console.log("🔍 [ProtectedRoute] roleId:", roleId, "| role:", role, "| type:", type, "| isAdmin field:", userData?.isAdmin, "→ isSuperAdmin:", isSuperAdmin, "isAdmin:", isAdmin);
      
      if (isSuperAdmin) {
        setAuthState("superadmin");
        return;
      } else if (!isAdmin) {
        setAuthState("employee");
        return;
      }

      if (
        !isLocalAuthEnabled() &&
        !authService.isSubscribed(profile.data?.subscription)
      ) {
        setAuthState("subscription_required");
        return;
      }

      setAuthState("authenticated");
    };

    verifySession();
  }, []);

  if (authState === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-violet-50 to-indigo-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Checking session...</p>
        </div>
      </div>
    );
  }

  if (authState === "unauthenticated") {
    return <Navigate to="/auth" replace />;
  }

  if (authState === "employee") {
    return <Navigate to="/employee" replace />;
  }

  if (authState === "superadmin") {
    return <Navigate to="/super-admin" replace />;
  }

  if (authState === "subscription_required") {
    return (
      <SubscriptionRequiredModal
        profile={profileData}
        allowPurchase
        onActivated={(nextProfile) => {
          setProfileData(nextProfile);
          setAuthState("authenticated");
        }}
      />
    );
  }

  return children;
};

export default ProtectedRoute;
