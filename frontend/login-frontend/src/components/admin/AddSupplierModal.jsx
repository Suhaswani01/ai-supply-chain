import { useState } from "react";

const emptyForm = {
  name: "", email: "", phone: "", address: "", rating: "", status: "ACTIVE"
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

export default function AddSupplierModal({ show, onClose, onAdd }) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!show) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // Validation
    if (!form.name || !form.email || !form.phone) {
      setError("Name, Email aur Phone zaroori hai!");
      return;
    }

    try {
      setSaving(true);
      setError("");
      await onAdd({
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        rating: parseFloat(form.rating) || 0,
        status: form.status,
      });
      setForm(emptyForm);
      onClose();
    } catch (err) {
      setError("Supplier add nahi hua! Backend check karo.");
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
        <div style={S.title}>➕ Add New Supplier</div>

        {error && <div style={S.error}>{error}</div>}

        {/* Row 1 — Name + Email */}
        <div style={S.row2}>
          <div>
            <label style={S.label}>Supplier Name *</label>
            <input style={S.input} name="name"
              value={form.name} onChange={handleChange}
              placeholder="ABC Traders" />
          </div>
          <div>
            <label style={S.label}>Email *</label>
            <input style={S.input} name="email" type="email"
              value={form.email} onChange={handleChange}
              placeholder="abc@traders.com" />
          </div>
        </div>

        {/* Row 2 — Phone + Rating */}
        <div style={S.row2}>
          <div>
            <label style={S.label}>Phone *</label>
            <input style={S.input} name="phone"
              value={form.phone} onChange={handleChange}
              placeholder="9876543210" />
          </div>
          <div>
            <label style={S.label}>Rating (0-5)</label>
            <input style={S.input} name="rating" type="number"
              min="0" max="5" step="0.1"
              value={form.rating} onChange={handleChange}
              placeholder="4.5" />
          </div>
        </div>

        {/* Address */}
        <div>
          <label style={S.label}>Address</label>
          <input style={S.input} name="address"
            value={form.address} onChange={handleChange}
            placeholder="Mumbai, Maharashtra" />
        </div>

        {/* Status */}
        <div>
          <label style={S.label}>Status</label>
          <select style={S.input} name="status"
            value={form.status} onChange={handleChange}>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        {/* Buttons */}
        <div style={S.btns}>
          <button style={S.btn("#ffffff15")} onClick={handleClose}>
            Cancel
          </button>
          <button style={S.btn(saving ? "#1d4ed8" : "#3b82f6")}
            onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : "Add Supplier ✓"}
          </button>
        </div>
      </div>
    </div>
  );
}