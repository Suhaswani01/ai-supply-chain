import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken } from "../../services/authService";
import ManagerLayout from "../../components/manager/ManagerLayout";
import AddPOModal from "../../components/admin/AddPOModal";

const api = axios.create({ baseURL: "http://localhost:8080" });
api.interceptors.request.use((cfg) => {
  const t = getToken();
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

const statusColor = (s) => ({
  IN_STOCK:    { bg: "rgba(34,197,94,0.12)",  color: "#4ade80", label: "In Stock"  },
  LOW_STOCK:   { bg: "rgba(251,191,36,0.12)", color: "#fbbf24", label: "Low Stock" },
  OUT_OF_STOCK:{ bg: "rgba(239,68,68,0.12)",  color: "#f87171", label: "Out"       },
}[s] || { bg: "#1e2433", color: "#94a3b8", label: s });

const poStatusColor = (s) => ({
  PENDING:  { bg: "rgba(251,191,36,0.12)", color: "#fbbf24" },
  APPROVED: { bg: "rgba(34,197,94,0.12)",  color: "#4ade80" },
  REJECTED: { bg: "rgba(239,68,68,0.12)",  color: "#f87171" },
}[s] || { bg: "#1e2433", color: "#94a3b8" });

// ✅ New light stat card design
function StatCard({ label, value, sub, accent, icon }) {
  return (
    <div style={{
      marginTop:"10px",
      marginLeft:"5px",
      background: "#ffffff",
      border: "0.5px solid #000000",
      borderTop: `3px solid ${accent}`,
      borderRadius: 10, padding: "12px 16px", flex: 1,
      
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ fontSize: 11, color: "#000000", textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</div>
        <div style={{
          width: 28, height: 28, borderRadius: 7,
          background: `${accent}18`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14,
        }}>{icon}</div>
      </div>
      <div style={{ fontSize: 24, fontWeight: 600, color: "#111827" }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

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

export default function ManagerDashboard() {
  const nav = useNavigate();
  const [parts,     setParts]     = useState([]);
  const [pos,       setPos]       = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [toast,     setToast]     = useState({ msg: "", type: "success" });
  const [showAddPO, setShowAddPO] = useState(false);
  const [preFill,   setPreFill]   = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 3000);
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [p, o, s] = await Promise.all([
        api.get("/api/inventory"),
        api.get("/api/purchase-orders"),
        api.get("/api/suppliers"),
      ]);
      setParts(p.data);
      setPos(o.data);
      setSuppliers(s.data);
    } catch {
      showToast("Data load failed", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const lowStock     = parts.filter((p) => p.stockStatus === "LOW_STOCK" || p.stockStatus === "OUT_OF_STOCK");
  const myPOs        = pos.slice(0, 5);
  const pendingCount = pos.filter((p) => p.status === "PENDING").length;

  const handleRaisePO = (part) => {
    setPreFill({ partId: part.id, partName: part.name });
    setShowAddPO(true);
  };

  const handlePOCreated = async (poData) => {
    try {
      await api.post("/api/purchase-orders", poData);
      setShowAddPO(false);
      setPreFill(null);
      fetchAll();
      showToast("Purchase Order raised successfully!");
    } catch {
      showToast("PO create failed", "error");
    }
  };

  return (
    <ManagerLayout>
      <Toast {...toast} />

      {/* ✅ Light stat cards */}
      <div style={{ display: "flex", gap: 14, marginBottom: 22 }}>
        <StatCard label="Total Parts" value={loading ? "—" : parts.length}    sub="All SKUs"                  accent="#3b82f6" icon="📦" />
        <StatCard label="Low Stock"   value={loading ? "—" : lowStock.length}  sub="Need attention"            accent="#f59e0b" icon="⚠️" />
        <StatCard label="My POs"      value={loading ? "—" : pos.length}       sub={`${pendingCount} pending`} accent="#8b5cf6" icon="📋" />
        <StatCard label="Suppliers"   value={loading ? "—" : suppliers.length} sub="Active partners"           accent="#10b981" icon="🏭" />
      </div>

      {/* 2-column grid — dark tables same as before */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>

        {/* Low Stock Alerts */}
        <div style={{ background: "#fdfeff",color:"black", border: "1px solid #1e2433", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid #1e2433", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>⚠ Low Stock Alerts</span>
              {lowStock.length > 0 && (
                <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 700, background: "rgba(239,68,68,0.15)", color: "#f87171", padding: "1px 7px", borderRadius: 10 }}>
                  {lowStock.length}
                </span>
              )}
            </div>
            <span style={{ fontSize: 12, color: "#60a5fa", cursor: "pointer" }} onClick={() => nav("/manager/inventory")}>View All →</span>
          </div>
          <div style={{ maxHeight: 340, overflowY: "auto" }}>
            {loading ? <div style={{ padding: 20, color: "#4b5563", fontSize: 13 }}>Loading...</div>
              : lowStock.length === 0 ? <div style={{ padding: 24, textAlign: "center", color: "#4b5563", fontSize: 13 }}>✓ All parts are well stocked</div>
              : lowStock.map((part) => {
                const st  = statusColor(part.stockStatus);
                const pct = Math.min(100, (part.quantity / 50) * 100);
                return (
                  <div key={part.id} style={{ padding: "12px 18px", borderBottom: "1px solid #1a1f2e", display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", marginBottom: 2 }}>{part.name}</div>
                      <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 6 }}>{part.partCode} · {part.category}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1, height: 4, background: "#1e2433", borderRadius: 2, overflow: "hidden" }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: st.color, borderRadius: 2 }} />
                        </div>
                        <span style={{ fontSize: 11, color: st.color, fontWeight: 600 }}>{part.quantity} units</span>
                      </div>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10, background: st.bg, color: st.color }}>{st.label}</span>
                    <button onClick={() => handleRaisePO(part)} style={{ padding: "5px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: "rgba(96,165,250,0.12)", border: "1px solid rgba(96,165,250,0.3)", color: "#60a5fa", cursor: "pointer" }}>Raise PO</button>
                  </div>
                );
              })}
          </div>
        </div>

        {/* My Purchase Orders */}
        <div style={{ background: "#fdfdff", border: "1px solid #1e2433", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid #1e2433", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#000000" }}>◈ My Purchase Orders</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { setPreFill(null); setShowAddPO(true); }} style={{ padding: "5px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, background: "rgba(96,165,250,0.15)", border: "1px solid rgba(96,165,250,0.3)", color: "#60a5fa", cursor: "pointer" }}>+ Create PO</button>
              <span style={{ fontSize: 12, color: "#60a5fa", cursor: "pointer", lineHeight: "28px" }} onClick={() => nav("/manager/orders")}>All →</span>
            </div>
          </div>
          <div style={{ maxHeight: 340, overflowY: "auto" }}>
            {loading ? <div style={{ padding: 20, color: "#4b5563", fontSize: 13 }}>Loading...</div>
              : myPOs.length === 0 ? <div style={{ padding: 24, textAlign: "center", color: "#4b5563", fontSize: 13 }}>No purchase orders yet</div>
              : myPOs.map((po) => {
                const st = poStatusColor(po.status);
                return (
                  <div key={po.id} style={{ padding: "12px 18px", borderBottom: "1px solid #1a1f2e", display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{po.poNumber}</div>
                      <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{po.part?.name} · {po.quantity} units · ₹{po.totalAmount?.toLocaleString()}</div>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 10, background: st.bg, color: st.color }}>{po.status}</span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Inventory Overview */}
        <div style={{ background: "#ffffff", border: "1px solid #1e2433", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid #1e2433", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#000000" }}>▦ Inventory Overview</span>
            <span style={{ fontSize: 12, color: "#60a5fa", cursor: "pointer" }} onClick={() => nav("/manager/inventory")}>Manage →</span>
          </div>
          <div style={{ maxHeight: 260, overflowY: "auto" }}>
            {loading ? <div style={{ padding: 20, color: "#4b5563", fontSize: 13 }}>Loading...</div>
              : parts.slice(0, 8).map((part) => {
                const st = statusColor(part.stockStatus);
                return (
                  <div key={part.id} style={{ padding: "10px 18px", borderBottom: "1px solid #1a1f2e", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: "#e2e8f0" }}>{part.name}</div>
                      <div style={{ fontSize: 11, color: "#4b5563" }}>{part.partCode}</div>
                    </div>
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>{part.quantity} units</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 8, background: st.bg, color: st.color }}>{st.label}</span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Suppliers */}
        <div style={{ background: "#ffffff", border: "1px solid #1e2433", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid #1e2433", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#000000" }}>◎ Suppliers</span>
            <span style={{ fontSize: 12, color: "#60a5fa", cursor: "pointer" }} onClick={() => nav("/manager/suppliers")}>View All →</span>
          </div>
          <div style={{ maxHeight: 260, overflowY: "auto" }}>
            {loading ? <div style={{ padding: 20, color: "#000000", fontSize: 13 }}>Loading...</div>
              : suppliers.length === 0 ? <div style={{ padding: 24, textAlign: "center", color: "#000000", fontSize: 13 }}>No suppliers</div>
              : suppliers.map((sup) => (
                <div key={sup.id} style={{ padding: "11px 18px", borderBottom: "1px solid #1a1f2e", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(96,165,250,0.15)", border: "1px solid rgba(96,165,250,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#60a5fa" }}>
                    {sup.name?.[0]?.toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: "#000000" }}>{sup.name}</div>
                    <div style={{ fontSize: 11, color: "#000000" }}>{sup.email}</div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 8, background: sup.status === "ACTIVE" ? "rgba(34,197,94,0.12)" : "rgba(107,114,128,0.15)", color: sup.status === "ACTIVE" ? "#4ade80" : "#6b7280" }}>{sup.status}</span>
                </div>
              ))}
          </div>
        </div>

      </div>

      {showAddPO && (
        <AddPOModal
          show={showAddPO}
          onClose={() => { setShowAddPO(false); setPreFill(null); }}
          onAdd={handlePOCreated}
        />
      )}
    </ManagerLayout>
  );
}