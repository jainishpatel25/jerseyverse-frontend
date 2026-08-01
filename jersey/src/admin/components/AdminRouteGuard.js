import { Navigate } from "react-router-dom";

const AdminRouteGuard = ({ children }) => {
  const userData = localStorage.getItem("userInfo");
  const user = userData ? JSON.parse(userData) : null;

  if (!user || !user.accessToken) {
    return <Navigate to="/admin/login" replace />;
  }

  if (user.role !== "ROLE_ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRouteGuard;
