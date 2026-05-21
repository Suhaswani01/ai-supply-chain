import { useState, useEffect, useCallback } from "react";
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

const statusMeta = (s) => ({
  PENDING:  { bg: "rgba(251,191,36,0.12)", color: "#fbbf24", label: "Pending"  },
  APPROVED: { bg: "rgba(34,197,94,0.12)",  color: "#4ade80", label: "Approved" },
  REJECTED: { bg: "rgba(239,68,68,0.12)",  color: "#f87171", label: "Rejected" },
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

const TABS = ["ALL", "PENDING", "APPROVED", "REJECTED"];

export default function ManagerPOPage() {
  const [pos,     setPos]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast,   setToast]   = useState({ msg: "", type: "success" });
  const [showAdd, setShowAdd] = useState(false);
  const [tab,     setTab]     = useState("ALL");
  const [search,  setSearch]  = useState("");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 3000);
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/purchase-orders");
      setPos(res.data);
    } catch {
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const filtered = pos.filter((po) => {
    const matchTab    = tab === "ALL" || po.status === tab;
    const matchSearch = po.poNumber?.toLowerCase().includes(search.toLowerCase()) ||
                        po.part?.name?.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const handleCreated = async (poData) => {
    try {
      await api.post("/api/purchase-orders", poData);
      setShowAdd(false);
      fetchAll();
      showToast("Purchase Order raised — waiting for Admin approval");
    } catch (err) {
      showToast("PO create failed — " + (err.response?.data?.message || "error"), "error");
    }
  };

  const counts = {
    ALL:      pos.length,
    PENDING:  pos.filter((p) => p.status === "PENDING").length,
    APPROVED: pos.filter((p) => p.status === "APPROVED").length,
    REJECTED: pos.filter((p) => p.status === "REJECTED").length,
  };

  const S = {
    th: {
      padding: "11px 16px", fontSize: 11, fontWeight: 600, color: "#4b5563",
      textTransform: "uppercase", letterSpacing: 1, textAlign: "left",
      background: "#0f1117", borderBottom: "1px solid #1e2433",
    },
    td: {
      padding: "12px 16px", fontSize: 13, color: "#e2e8f0",
      borderBottom: "1px solid #1a1f2e",
    },
  };

  return (
    <ManagerLayout>
      <Toast {...toast} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>Purchase Orders</div>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 3 }}>
            Raise orders · Admin will approve or reject
          </div>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            padding: "8px 20px", borderRadius: 6, fontSize: 13, fontWeight: 600,
            background: "rgba(96,165,250,0.15)", border: "1px solid rgba(96,165,250,0.3)",
            color: "#60a5fa", cursor: "pointer",
          }}
        >+ Raise PO</button>
      </div>

      {/* Info box */}
      <div style={{
        padding: "10px 16px", background: "rgba(96,165,250,0.08)",
        border: "1px solid rgba(96,165,250,0.2)", borderRadius: 8,
        fontSize: 12, color: "#60a5fa", marginBottom: 16,
      }}>
        ℹ Your role: Create purchase orders · Admin approves or rejects them
      </div>

      {/* Tabs + Search */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 4 }}>
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "6px 16px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                cursor: "pointer", border: "none", outline: "none",
                background: tab === t ? "rgba(96,165,250,0.15)" : "transparent",
                color: tab === t ? "#60a5fa" : "#6b7280",
                borderBottom: tab === t ? "2px solid #60a5fa" : "2px solid transparent",
              }}
            >
              {t} <span style={{ opacity: 0.7, fontSize: 11 }}>({counts[t]})</span>
            </button>
          ))}
        </div>
        <input
          placeholder="Search by PO# or part..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            background: "#13161f", border: "1px solid #1e2433", borderRadius: 6,
            padding: "7px 12px", color: "#e2e8f0", fontSize: 13, outline: "none", width: 220,
          }}
        />
      </div>

      {/* Table */}
      <div style={{ background: "#13161f", border: "1px solid #1e2433", borderRadius: 10, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={S.th}>PO Number</th>
              <th style={S.th}>Part</th>
              <th style={S.th}>Supplier</th>
              <th style={S.th}>Qty</th>
              <th style={S.th}>Amount</th>
              <th style={S.th}>Status</th>
              <th style={S.th}>Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ ...S.td, textAlign: "center", color: "#4b5563", padding: 32 }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ ...S.td, textAlign: "center", color: "#4b5563", padding: 40 }}>
                {tab === "PENDING" ? "No pending POs — raise a new one!" : "No orders found"}
              </td></tr>
            ) : (
              filtered.map((po) => {
                const st   = statusMeta(po.status);
                const date = po.createdAt
                  ? new Date(po.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                  : "—";
                return (
                  <tr key={po.id}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ ...S.td, fontFamily: "monospace", color: "#60a5fa" }}>{po.poNumber}</td>
                    <td style={S.td}>
                      <div style={{ fontWeight: 600 }}>{po.part?.name || "—"}</div>
                      <div style={{ fontSize: 11, color: "#4b5563" }}>{po.part?.partCode}</div>
                    </td>
                    <td style={{ ...S.td, color: "#94a3b8" }}>{po.supplier?.name || "—"}</td>
                    <td style={S.td}>{po.quantity}</td>
                    <td style={{ ...S.td, color: "#a3e635", fontWeight: 600 }}>₹{po.totalAmount?.toLocaleString()}</td>
                    <td style={S.td}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 10, background: st.bg, color: st.color }}>
                        {st.label}
                      </span>
                    </td>
                    <td style={{ ...S.td, color: "#6b7280", fontSize: 12 }}>{date}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <AddPOModal
          show={showAdd}
          onClose={() => setShowAdd(false)}
          onAdd={handleCreated}
        />
      )}
    </ManagerLayout>
  );
}