// src/components/auth/AdminProtectedRoute.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute: React.FC = () => {
  const isAdminAuthenticated = !!localStorage.getItem("token");

  return isAdminAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/admin/signin" replace />
  );
};

export default AdminProtectedRoute;
