import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext.jsx";

const ProtectedAdminRoute = ({ children }) => {
  const { isAdminLoggedIn, loading } = useContext(AdminContext);

  if (loading) return null; // or show loader

  return isAdminLoggedIn ? children : <Navigate to="/admin-login" />;
};

export default ProtectedAdminRoute;
