import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";


interface User {
  role: string;
}

const ProtectedRoute: React.FC = () => {

  const isAuth = !!sessionStorage.getItem("user")
  const isAdmin = JSON.parse(sessionStorage.getItem("user")!)

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
