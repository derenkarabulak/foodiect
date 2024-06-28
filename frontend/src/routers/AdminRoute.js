import React from "react";
import useAuth from "../custom-hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import useGetData from "../custom-hooks/useGetData";

const ProtectedRoute = ({ allowedRoles }) => {
  const location = useLocation();
  const { data: users } = useGetData("users");
  const { currentUser } = useAuth();

  for (let i = 0; i < users.length; i++) {
    if (users[i].email === currentUser.email) {
      var user = users[i];
      if (user.role === allowedRoles) {
        return <Outlet />;
      } else {
        return <Navigate to="/login" state={{ from: location }} replace />;
      }
    }
  }
};

export default ProtectedRoute;
