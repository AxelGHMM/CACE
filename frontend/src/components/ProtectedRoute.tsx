import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const isAdminRoute = location.pathname.startsWith("/dashE");

  // 🔹 Si es una ruta de admin pero el usuario no es admin, redirigirlo a Dashboard
  if (isAdminRoute && user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // 🔹 Si es una ruta de profesores y el usuario es admin, redirigirlo a DashE
  if (!isAdminRoute && user.role === "admin") {
    return <Navigate to="/dashE" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
