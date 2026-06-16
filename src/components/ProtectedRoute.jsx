import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const authToken = localStorage.getItem("authToken");

  if (!isLoggedIn || !authToken) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;