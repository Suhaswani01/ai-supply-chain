import { useState, useEffect } from "react";
import { getAllSuppliers, addSupplier, updateSupplier, deleteSupplier } from "../services/supplierService";

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const data = await getAllSuppliers();
      setSuppliers(data);
    } catch (err) {
      setError("Suppliers load nahi hue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSuppliers(); }, []);

  const handleAdd = async (supplier) => {
    await addSupplier(supplier);
    fetchSuppliers();
  };

  const handleUpdate = async (id, supplier) => {
    await updateSupplier(id, supplier);
    fetchSuppliers();
  };

  const handleDelete = async (id) => {
    await deleteSupplier(id);
    fetchSuppliers();
  };

  return { suppliers, loading, error, handleAdd, handleUpdate, handleDelete };
};