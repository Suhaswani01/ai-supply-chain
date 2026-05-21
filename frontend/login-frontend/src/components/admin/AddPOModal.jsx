import { useState, useEffect } from "react";
import { getAllParts } from "../../services/inventoryService";
import { getAllSuppliers } from "../../services/supplierService";
import { createPO } from "../../services/poService";

const emptyForm = {
  poNumber: "",
  partId: "",
  supplierId: "",
  quantity: "",
  totalAmount: "",
};

const S = {
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "#000000aa", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modal: { background: "#1a1f2e", border: "0.5px solid #ffffff20", borderRadius: 12, padding: 24, width: 420 },
  title: { fontSize: 16, fontWeight: 500, color: "white", marginBottom: 20 },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  label: { fontSize: 11, color: "#ffffff60", marginBottom: 4, display: "block" },
  input: { width: "100%", background: "#0f1117", border: "0.5px solid #ffffff30", borderRadius: 6, padding: "8px 10px", color: "white", fontSize: 12, boxSizing: "border-box", marginBottom: 14 },
  btns: { display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 },
  btn: (bg) => ({ background: bg, color: "white", border: "none", padding: "7px 16px", borderRadius: 6, fontSize: 12, cursor: "pointer" }),
  error: { background: "#f8717115", border: "0.5px solid #f87171", color: "#f87171", fontSize: 12, padding: "8px 12px", borderRadius: 6, marginBottom: 14 },
};

export default function AddPOModal({ show, onClose, onAdd }) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [parts, setParts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    if (show) {
      getAllParts().then(setParts).catch(() => setParts([]));
      getAllSuppliers().then(setSuppliers).catch(() => setSuppliers([]));
    }
  }, [show]);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => {
      const updated = { ...prev, [name]: value };

      // Auto calculate total amount
      if (name === "partId" || name === "quantity") {
        const selectedPart = parts.find(p => p.id === parseInt(updated.partId));
        const qty = parseInt(updated.quantity) || 0;
        if (selectedPart && qty) {
          updated.totalAmount = (selectedPart.unitPrice * qty).toFixed(2);
        }
      }

      return updated;
    });
  };

  const handleSubmit = async () => {
    if (!form.poNumber || !form.partId || !form.supplierId || !form.quantity) {
      setError("all field is important");
      return;
    }

    try {
      setSaving(true);
      setError("");
      await onAdd({
        poNumber: form.poNumber,
        part: { id: parseInt(form.partId) },
        supplier: { id: parseInt(form.supplierId) },
        quantity: parseInt(form.quantity),
        totalAmount: parseFloat(form.totalAmount) || 0,
        status: "PENDING",
      });
      setForm(emptyForm);
      onClose();
    } catch (err) {
      setError("PO add nahi hua! Backend check karo.");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setForm(emptyForm);
    setError("");
    onClose();
  };

  return (
    <div style={S.overlay}>
      <div style={S.modal}>
        <div style={S.title}>➕ Create Purchase Order</div>

        {error && <div style={S.error}>{error}</div>}

        {/* PO Number */}
        <div>
          <label style={S.label}>PO Number *</label>
          <input style={S.input} name="poNumber"
            value={form.poNumber} onChange={handleChange}
            placeholder="PO-5515" />
        </div>

        {/* Part + Supplier */}
        <div style={S.row2}>
          <div>
            <label style={S.label}>Part *</label>
            <select style={S.input} name="partId"
              value={form.partId} onChange={handleChange}>
              <option value="">-- Part Select Karo --</option>
              {parts.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} — ₹{p.unitPrice}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={S.label}>Supplier *</label>
            <select style={S.input} name="supplierId"
              value={form.supplierId} onChange={handleChange}>
              <option value="">-- Supplier Select Karo --</option>
              {suppliers.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quantity + Total Amount */}
        <div style={S.row2}>
          <div>
            <label style={S.label}>Quantity *</label>
            <input style={S.input} name="quantity" type="number"
              value={form.quantity} onChange={handleChange}
              placeholder="10" />
          </div>
          <div>
            <label style={S.label}>Total Amount (₹) — Auto</label>
            <input style={S.input} name="totalAmount" type="number"
              value={form.totalAmount} onChange={handleChange}
              placeholder="Auto calculated" />
          </div>
        </div>

        {/* Buttons */}
        <div style={S.btns}>
          <button style={S.btn("#ffffff15")} onClick={handleClose}>
            Cancel      
          </button>
          <button style={S.btn(saving ? "#1d4ed8" : "#3b82f6")}
            onClick={handleSubmit} disabled={saving}>
            {saving ? "Creating..." : "Create PO ✓"}
          </button>
        </div>
      </div>
    </div>
  );
}