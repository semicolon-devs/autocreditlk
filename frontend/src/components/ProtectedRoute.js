import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const ProtectedRoute = ({ children }) => {
  const token = cookies.get("autoCreditCookie");
  const userRole = JSON.parse(localStorage.getItem("userRole"));

  if (!token) {
    return <Navigate to="/sign-in" />;
  } else if (userRole == "pending") {
    return <Navigate to="/reset-password" />;
  }
  return children;
};

export default ProtectedRoute;
