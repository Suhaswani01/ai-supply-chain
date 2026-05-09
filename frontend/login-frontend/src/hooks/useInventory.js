import { useState, useEffect } from "react";
import { getAllParts, addPart, updatePart, deletePart } from "../services/inventoryService";

export const useInventory = () => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchParts = async () => {
    try {
      setLoading(true);
      const data = await getAllParts();
      setParts(data);
    } catch (err) {
      setError("Parts load nahi hue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchParts(); }, []);

  const handleAdd = async (part) => {
    await addPart(part);
    fetchParts();
  };

  const handleUpdate = async (id, part) => {
    await updatePart(id, part);
    fetchParts();
  };

  const handleDelete = async (id) => {
    await deletePart(id);
    fetchParts();
  };

  return { parts, loading, error, handleAdd, handleUpdate, handleDelete, fetchParts };
};