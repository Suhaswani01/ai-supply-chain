import { useState, useEffect } from "react";
import { getAllPOs, approvePO, rejectPO, createPO } from "../services/poService";

export const usePurchaseOrders = () => {
  const [pos, setPOs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPOs = async () => {
    try {
      setLoading(true);
      const data = await getAllPOs();
      setPOs(data);
    } catch (err) {
      setError("POs load nahi hue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPOs(); }, []);

  const handleApprove = async (id) => {
    await approvePO(id);
    fetchPOs();
  };

  const handleReject = async (id) => {
    await rejectPO(id);
    fetchPOs();
  };

  const handleCreate = async (po) => {
    await createPO(po);
    fetchPOs();
  };

  return { pos, loading, error, handleApprove, handleReject, handleCreate, fetchPOs };
};