import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};

export const saveTokens = (token, role) => {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
};

export const getToken = () => localStorage.getItem("token");
export const getRole = () => localStorage.getItem("role");
export const logout = () => localStorage.clear();
