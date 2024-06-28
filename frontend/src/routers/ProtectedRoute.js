import React from "react";
import useAuth from "../custom-hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const location = useLocation();
  const { currentUser } = useAuth();

  return currentUser ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
