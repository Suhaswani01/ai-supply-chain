import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, saveTokens } from "../services/authService";

export const useAuth = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setError("");
    setLoading(true);
    try {
      const { token, role } = await loginUser(email, password);
      saveTokens(token, role);

      if (role === "ROLE_ADMIN") navigate("/admin/dashboard");
      else if (role === "ROLE_INVENTORY_MANAGER") navigate("/manager/dashboard");
      else navigate("/viewer/dashboard");

    } catch (err) {
      setError("Email ya password galat hai");
    } finally {
      setLoading(false);
    }
  };

  return { login, error, loading };
};