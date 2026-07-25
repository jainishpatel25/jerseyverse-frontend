// src/components/AdminRouteGuard.js
import React from "react";
import { Navigate } from "react-router-dom";

const AdminRouteGuard = ({ children }) => {
  const adminData = localStorage.getItem("adminInfo");
  const admin = adminData ? JSON.parse(adminData) : null;

  
  if (!admin || !admin.token || admin.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return children; 
};

export default AdminRouteGuard;
