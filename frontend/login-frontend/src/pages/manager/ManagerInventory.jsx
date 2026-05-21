import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { getToken } from "../../services/authService";
import AddPartModal from "../../components/admin/AddPartModal";
import ManagerLayout from "../../components/manager/ManagerLayout";

const api = axios.create({ baseURL: "http://localhost:8080" });
api.interceptors.request.use((cfg) => {
  const t = getToken();
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

const statusColor = (s) => ({
  IN_STOCK:    { bg: "rgba(34,197,94,0.12)",  color: "#4ade80",  label: "In Stock"  },
  LOW_STOCK:   { bg: "rgba(251,191,36,0.12)", color: "#fbbf24",  label: "Low Stock" },
  OUT_OF_STOCK:{ bg: "rgba(239,68,68,0.12)",  color: "#f87171",  label: "Out of Stock" },
}[s] || { bg: "#1e2433", color: "#94a3b8", label: s });

function Toast({ msg, type }) {
  if (!msg) return null;
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 9999,
      background: type === "success" ? "#166534" : "#7f1d1d",
      border: `1px solid ${type === "success" ? "#4ade80" : "#f87171"}`,
      color: type === "success" ? "#4ade80" : "#f87171",
      padding: "12px 20px", borderRadius: 8, fontSize: 13,
      boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
    }}>{msg}</div>
  );
}

export default function ManagerInventory() {
  const [parts,    setParts]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [filter,   setFilter]   = useState("ALL");
  const [toast,    setToast]    = useState({ msg: "", type: "success" });
  const [showAdd,  setShowAdd]  = useState(false);
  const [editPart, setEditPart] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 3000);
  };

  const fetchParts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/inventory");
      setParts(res.data);
    } catch {
      showToast("Failed to load inventory", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchParts(); }, [fetchParts]);

  const filtered = parts.filter((p) => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase()) ||
                        p.partCode?.toLowerCase().includes(search.toLowerCase()) ||
                        p.category?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "ALL" || p.stockStatus === filter;
    return matchSearch && matchFilter;
  });

  const handleSaved = () => {
    setShowAdd(false);
    setEditPart(null);
    fetchParts();
    showToast("Part saved successfully!");
  };

  const S = {
    header: {
      display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20,
    },
    title: { fontSize: 18, fontWeight: 700, color: "#e2e8f0" },
    controls: { display: "flex", gap: 10, alignItems: "center" },
    input: {
      background: "#13161f", border: "1px solid #1e2433", borderRadius: 6,
      padding: "7px 12px", color: "#e2e8f0", fontSize: 13, outline: "none",
      width: 220,
    },
    select: {
      background: "#13161f", border: "1px solid #1e2433", borderRadius: 6,
      padding: "7px 10px", color: "#e2e8f0", fontSize: 13, outline: "none",
    },
    addBtn: {
      padding: "7px 18px", borderRadius: 6, fontSize: 13, fontWeight: 600,
      background: "rgba(96,165,250,0.15)", border: "1px solid rgba(96,165,250,0.3)",
      color: "#60a5fa", cursor: "pointer",
    },
    table: {
      background: "#101a36", border: "1px solid #1e2433", borderRadius: 10, overflow: "hidden",
    },
    th: {
      padding: "11px 16px", fontSize: 11, fontWeight: 600, color: "#4b5563",
      textTransform: "uppercase", letterSpacing: 1, textAlign: "left",
      background: "#bfc3ce", borderBottom: "1px solid #1e2433",
    },
    td: {
      padding: "12px 16px", fontSize: 13, color: "#e2e8f0",
      borderBottom: "1px solid #c1c6d7",
    },
    editBtn: {
      padding: "4px 12px", borderRadius: 5, fontSize: 11, fontWeight: 600,
      background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.25)",
      color: "#60a5fa", cursor: "pointer",
    },
    noDelete: {
      fontSize: 11, color: "#374151", fontStyle: "italic",
    },
  };

  return (
    <ManagerLayout>
      <Toast {...toast} />
    <div style={{ padding: 24, background: "#ffffff", minHeight: "100vh" }}>
      <Toast {...toast} />

      <div style={S.header}>
        <div>
          <div style={S.title}>Inventory</div>
          <div style={{ fontSize: 12, color: "#4e76ae", marginTop: 3 }}>
            {filtered.length} parts shown · Manager: add & edit only
          </div>
        </div>
        <div style={S.controls}>
          <input
            style={S.input}
            placeholder="Search parts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select style={S.select} value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="ALL">All Status</option>
            <option value="IN_STOCK">In Stock</option>
            <option value="LOW_STOCK">Low Stock</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>
          <button style={S.addBtn} onClick={() => { setEditPart(null); setShowAdd(true); }}>
            + Add Part
          </button>
        </div>
      </div>

      {/* Summary chips */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        {["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"].map((s) => {
          const cnt = parts.filter((p) => p.stockStatus === s).length;
          const st  = statusColor(s);
          return (
            <div key={s} style={{
              padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
              background: st.bg, color: st.color, cursor: "pointer",
              border: filter === s ? `1px solid ${st.color}` : "1px solid transparent",
            }} onClick={() => setFilter(filter === s ? "ALL" : s)}>
              {st.label} · {cnt}
            </div>
          );
        })}
      </div>

      <div style={S.table}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={S.th}>Part Name</th>
              <th style={S.th}>Part Code</th>
              <th style={S.th}>Category</th>
              <th style={S.th}>Qty</th>
              <th style={S.th}>Unit Price</th>
              <th style={S.th}>Status</th>
              <th style={S.th}>Supplier</th>
              <th style={S.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ ...S.td, textAlign: "center", color: "#4b5563", padding: 32 }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} style={{ ...S.td, textAlign: "center", color: "#4b5563", padding: 32 }}>No parts found</td></tr>
            ) : (
              filtered.map((part) => {
                const st = statusColor(part.stockStatus);
                return (
                  <tr key={part.id}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={S.td}><div style={{ fontWeight: 600 }}>{part.name}</div></td>
                    <td style={{ ...S.td, color: "#6b7280", fontFamily: "monospace" }}>{part.partCode}</td>
                    <td style={{ ...S.td, color: "#94a3b8" }}>{part.category}</td>
                    <td style={S.td}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 48, height: 4, background: "#1e2433", borderRadius: 2, overflow: "hidden" }}>
                          <div style={{ width: `${Math.min(100, (part.quantity / 100) * 100)}%`, height: "100%", background: st.color, borderRadius: 2 }} />
                        </div>
                        <span style={{ color: st.color, fontWeight: 600 }}>{part.quantity}</span>
                      </div>
                    </td>
                    <td style={{ ...S.td, color: "#a3e635" }}>₹{part.unitPrice?.toLocaleString()}</td>
                    <td style={S.td}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 8, background: st.bg, color: st.color }}>
                        {st.label}
                      </span>
                    </td>
                    <td style={{ ...S.td, color: "#94a3b8" }}>{part.supplier?.name || "—"}</td>
                    <td style={S.td}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <button style={S.editBtn} onClick={() => { setEditPart(part); setShowAdd(true); }}>Edit</button>
                        <span style={S.noDelete}>No delete</span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <AddPartModal
          part={editPart}
          onClose={() => { setShowAdd(false); setEditPart(null); }}
          onSaved={handleSaved}
        />
      )}
    </div>
    </ManagerLayout>
  );
}