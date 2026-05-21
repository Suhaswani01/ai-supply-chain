import { useState, useEffect } from "react";
import { getAllSuppliers } from "../../services/supplierService";

const emptyForm = {
  name: "", partCode: "", category: "",
  quantity: "", unitPrice: "", stockStatus: "IN_STOCK", supplierId: ""
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

export default function AddPartModal({ show, onClose, onAdd }) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    if (show) {
      getAllSuppliers()
        .then(data => setSuppliers(data))
        .catch(() => setSuppliers([]));
    }
  }, [show]);

  if (!show) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.partCode || !form.quantity) {
      setError("Name, Part Code aur Quantity zaroori hai!");
      return;
    }
    if (!form.supplierId) {
      setError("Supplier select karo!");
      return;
    }

    try {
      setSaving(true);
      setError("");
      await onAdd({
        name: form.name,
        partCode: form.partCode,
        category: form.category,
        quantity: parseInt(form.quantity),
        unitPrice: parseFloat(form.unitPrice) || 0,
        stockStatus: form.stockStatus,
        supplier: { id: parseInt(form.supplierId) }
      });
      setForm(emptyForm);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || "";
      if (msg.toString().includes("already exists")) {
        setError("Yeh Part Code pehle se exist karta hai!");
      } else {
        setError("Part add nahi hua! Backend check karo.");
      }
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
        <div style={S.title}>➕ Add New Part</div>

        {error && <div style={S.error}>{error}</div>}

        <div style={S.row2}>
          <div>
            <label style={S.label}>Part Name *</label>
            <input style={S.input} name="name"
              value={form.name} onChange={handleChange}
              placeholder="Engine Filter" />
          </div>
          <div>
            <label style={S.label}>Part Code *</label>
            <input style={S.input} name="partCode"
              value={form.partCode} onChange={handleChange}
              placeholder="EF-001" />
          </div>
        </div>

        <div style={S.row2}>
          <div>
            <label style={S.label}>Category</label>
            <input style={S.input} name="category"
              value={form.category} onChange={handleChange}
              placeholder="Filters" />
          </div>
          <div>
            <label style={S.label}>Quantity *</label>
            <input style={S.input} name="quantity" type="number"
              value={form.quantity} onChange={handleChange}
              placeholder="100" />
          </div>
        </div>

        <div style={S.row2}>
          <div>
            <label style={S.label}>Unit Price (₹)</label>
            <input style={S.input} name="unitPrice" type="number"
              value={form.unitPrice} onChange={handleChange}
              placeholder="500" />
          </div>
          <div>
            <label style={S.label}>Stock Status</label>
            <select style={S.input} name="stockStatus"
              value={form.stockStatus} onChange={handleChange}>
              <option value="IN_STOCK">In Stock</option>
              <option value="LOW_STOCK">Low Stock</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
            </select>
          </div>
        </div>

        <div>
          <label style={S.label}>Supplier *</label>
          <select style={S.input} name="supplierId"
            value={form.supplierId} onChange={handleChange}>
            <option value="">-- Supplier Select Karo --</option>
            {suppliers.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} — {s.status}
              </option>
            ))}
          </select>
        </div>

        <div style={S.btns}>
          <button style={S.btn("#ffffff15")} onClick={handleClose}>
            Cancel
          </button>
          <button style={S.btn(saving ? "#1d4ed8" : "#3b82f6")}
            onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : "Add Part ✓"}
          </button>
        </div>
      </div>
    </div>
  );
}