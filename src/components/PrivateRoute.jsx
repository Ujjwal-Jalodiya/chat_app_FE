import React from "react";
import { Navigate } from "react-router-dom";
import { getCookie } from "./GetCookie";
// Utility function to check if user is authenticated
const isAuthenticated = () => {
  const token = getCookie("authToken");
  return token != null;
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
