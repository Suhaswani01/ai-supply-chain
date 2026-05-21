import axios from "axios";
import { getToken } from "./authService";

const api = axios.create({ baseURL: "http://localhost:8080" });
api.interceptors.request.use((cfg) => {
  const t = getToken();
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

export const getAllPOs = async () => {
  const res = await api.get("/api/purchase-orders");
  return res.data;
};

export const createPO = async (data) => {
  const res = await api.post("/api/purchase-orders", data);
  return res.data;
};

export const approvePO = async (id) => {
  const res = await api.put(`/api/purchase-orders/${id}/approve`);
  return res.data;
};

export const rejectPO = async (id) => {
  const res = await api.put(`/api/purchase-orders/${id}/reject`);
  return res.data;
};