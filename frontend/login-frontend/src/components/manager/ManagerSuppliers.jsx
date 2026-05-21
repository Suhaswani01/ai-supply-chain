import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { getToken } from "../../services/authService";
import ManagerLayout from "./ManagerLayout";

const api = axios.create({ baseURL: "http://localhost:8080" });
api.interceptors.request.use((cfg) => {
  const t = getToken();
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

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

const ratingColor = (r) => {
  if (r >= 4)   return "#4ade80";
  if (r >= 2.5) return "#fbbf24";
  return "#f87171";
};

const stars = (r) => {
  const full = Math.min(5, Math.max(0, Math.floor(r || 0)));
  return "★".repeat(full) + "☆".repeat(5 - full);
};

export default function ManagerSuppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [toast,     setToast]     = useState({ msg: "", type: "success" });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 3000);
  };

  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/suppliers");
      setSuppliers(res.data);
    } catch {
      showToast("Failed to load suppliers", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSuppliers(); }, [fetchSuppliers]);

  const filtered = suppliers.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase()) ||
    s.address?.toLowerCase().includes(search.toLowerCase())
  );

  const S = {
    header: {
      display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20,
    },
    title: { fontSize: 18, fontWeight: 700, color: "#e2e8f0" },
    input: {
      background: "#dfe7f9", border: "1px solid #1e2433", borderRadius: 6,
      padding: "7px 12px", color: "#090a0b", fontSize: 13, outline: "none",
      width: 240,
    },
    infoBox: {
      padding: "10px 16px", background: "rgba(251,191,36,0.06)",
      border: "1px solid rgba(251,191,36,0.2)", borderRadius: 8,
      fontSize: 12, color: "#171716", marginBottom: 18,
    },
    grid: {
      display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14,
    },
    card: {
      background: "#e1e4ef", border: "1px solid #1e2433", borderRadius: 10,
      padding: 18, transition: "border-color 0.15s",
    },
    avatar: {
      width: 44, height: 44, borderRadius: "50%",
      background: "rgba(96,165,250,0.12)", border: "1px solid rgba(0, 6, 12, 0.2)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 18, fontWeight: 700, color: "#010101", flexShrink: 0,
    },
    name: { fontSize: 15, fontWeight: 700, color: "#000000" },
    meta: { fontSize: 12, color: "#000000", marginTop: 2 },
    divider: { height: 1, background: "#1e2433", margin: "12px 0" },
    row: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
    label: { fontSize: 11, color: "#4b5563", textTransform: "uppercase", letterSpacing: 0.5 },
    value: { fontSize: 12, color: "#050d1a" },
  };

  return (
    <ManagerLayout>
    <Toast {...toast} />
    <div style={{ padding: 24, background: "#fcfdff", minHeight: "100vh" }}>
      <Toast {...toast} />

      <div style={S.header}>
        <div>
          <div style={S.title}>Suppliers</div>
          <div style={{ fontSize: 12, color: "#000000", marginTop: 3 }}>
            {filtered.length} suppliers · View only · Contact Admin to make changes
          </div>
        </div>
        <input
          style={S.input}
          placeholder="Search suppliers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div style={S.infoBox}>
        👁 View only — only Admin can add, edit, or remove suppliers
      </div>

      {loading ? (
        <div style={{ padding: 32, textAlign: "center", color: "#202832" }}>Loading suppliers...</div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: 48, textAlign: "center", color: "#4b5563" }}>No suppliers found</div>
      ) : (
        <div style={S.grid}>
          {filtered.map((sup) => (
            <div
              key={sup.id}
              style={S.card}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = "#2d3748"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "#1e2433"}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={S.avatar}>{sup.name?.[0]?.toUpperCase()}</div>
                <div style={{ flex: 1 }}>
                  <div style={S.name}>{sup.name}</div>
                  <div style={S.meta}>{sup.email}</div>
                  <span style={{
                    display: "inline-block", marginTop: 6,
                    fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 8,
                    background: sup.status === "ACTIVE" ? "rgba(34,197,94,0.12)" : "rgba(107,114,128,0.15)",
                    color: sup.status === "ACTIVE" ? "#4ade80" : "#6b7280",
                  }}>{sup.status}</span>
                </div>
              </div>

              <div style={S.divider} />

              <div style={S.row}>
                <span style={S.label}>Phone</span>
                <span style={S.value}>{sup.phone || "—"}</span>
              </div>
              <div style={S.row}>
                <span style={S.label}>Address</span>
                <span style={{ ...S.value, textAlign: "right", maxWidth: 180 }}>{sup.address || "—"}</span>
              </div>
              <div style={S.row}>
                <span style={S.label}>Rating</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: ratingColor(sup.rating), fontSize: 13, letterSpacing: 1 }}>
                    {stars(sup.rating)}
                  </span>
                  <span style={{ fontSize: 12, color: ratingColor(sup.rating), fontWeight: 700 }}>
                    {sup.rating?.toFixed(1) || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </ManagerLayout>
  );
}