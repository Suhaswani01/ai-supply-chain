import { Navigate } from "react-router-dom";
import { getToken, getRole } from "../services/authService";

export default function ProtectedRoute({ children, allowedRole }) {
  const token = getToken();
  const role = getRole();

  // Token nahi hai — login page pe bhejo
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Role match nahi — login page pe bhejo
  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}