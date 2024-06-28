import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import ProductDetails from "../pages/ProductDetails";
import Shop from "../pages/Shop";
import Signup from "../pages/Signup";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import Dashboard from "../admin/Dashboard";
import Favorites from "../pages/Favorites";
import Users from "../admin/Users";
import Nutrition from "../pages/Nutrition";
import CalorieCalculator from "../pages/CalCalc";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="home" element={<Home />} />
      <Route path="/*" element={<ProtectedRoute />}>
        <Route path="favorites" element={<Favorites />} />
        <Route path="/*" element={<AdminRoute allowedRoles={"admin"} />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="dashboard/users" element={<Users />} />
        </Route>
      </Route>
      <Route path="login" element={<Login />} />
      <Route path="recipe/:label" element={<ProductDetails />} />
      <Route path="recipes" element={<Shop />} />
      <Route path="nutrition" element={<Nutrition />} />
      <Route path="calorie-calculator" element={<CalorieCalculator />} />
      <Route path="signup" element={<Signup />} />
    </Routes>
  );
};

export default Routers;
