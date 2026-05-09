import axios from "axios";
import { getToken } from "./authService";

const BASE_URL = "http://localhost:8080/api/suppliers";

const getHeaders = () => ({
  headers: { Authorization: `Bearer ${getToken()}` }
});

export const getAllSuppliers = () =>
  axios.get(BASE_URL, getHeaders()).then(r => r.data);

export const addSupplier = (supplier) =>
  axios.post(BASE_URL, supplier, getHeaders()).then(r => r.data);

export const updateSupplier = (id, supplier) =>
  axios.put(`${BASE_URL}/${id}`, supplier, getHeaders()).then(r => r.data);

export const deleteSupplier = (id) =>
  axios.delete(`${BASE_URL}/${id}`, getHeaders());