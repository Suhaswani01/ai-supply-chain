import axios from "axios";
import { getToken } from "./authService";

const BASE_URL = "http://localhost:8080/api/inventory";

const getHeaders = () => ({
  headers: { Authorization: `Bearer ${getToken()}` }
});

export const getAllParts = () =>
  axios.get(BASE_URL, getHeaders()).then(r => r.data);

export const getPartById = (id) =>
  axios.get(`${BASE_URL}/${id}`, getHeaders()).then(r => r.data);

export const addPart = (part) =>
  axios.post(BASE_URL, part, getHeaders()).then(r => r.data);

export const updatePart = (id, part) =>
  axios.put(`${BASE_URL}/${id}`, part, getHeaders()).then(r => r.data);

export const deletePart = (id) =>
  axios.delete(`${BASE_URL}/${id}`, getHeaders());

export const getLowStockParts = () =>
  axios.get(`${BASE_URL}/low-stock`, getHeaders()).then(r => r.data);