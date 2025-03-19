import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";


interface User {
  role: string;
}

const ProtectedRoute: React.FC = () => {

  const isAuth = !!localStorage.getItem("user")
  const isAdmin = JSON.parse(localStorage.getItem("user")!)

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
