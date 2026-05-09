import { useInventory } from "../../hooks/useInventory";
import { usePurchaseOrders } from "../../hooks/usePurchaseOrders";
import AdminLayout from "../../components/admin/Layout";

const S = {
  title: { fontSize: 22, fontWeight: 500, color: "white", marginBottom: 4 },
  sub: { fontSize: 13, color: "#ffffff60", marginBottom: 24 },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 },
  statCard: { background: "#1a1f2e", border: "0.5px solid #ffffff15", borderRadius: 10, padding: 16 },
  statLabel: { fontSize: 11, color: "#ffffff60", marginBottom: 6 },
  statValue: { fontSize: 24, fontWeight: 500, color: "white" },
  statSub: { fontSize: 11, marginTop: 4 },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  card: { background: "#1a1f2e", border: "0.5px solid #ffffff15", borderRadius: 12, padding: 18, marginBottom: 16 },
  cardTitle: { fontSize: 14, fontWeight: 500, color: "white", marginBottom: 14 },
  row: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "0.5px solid #ffffff10", fontSize: 12 },
  badge: (color, bg) => ({ fontSize: 10, padding: "2px 8px", borderRadius: 4, color, background: bg }),
  btn: (bg) => ({ background: bg, color: "white", border: "none", padding: "4px 10px", borderRadius: 4, fontSize: 11, cursor: "pointer", marginLeft: 4 }),
  barWrap: { flex: 1, background: "#ffffff15", borderRadius: 4, height: 4, margin: "0 10px" },
};

const stockColor = (status) => {
  if (status === "IN_STOCK") return { color: "#4ade80", bg: "#4ade8015" };
  if (status === "LOW_STOCK") return { color: "#fb923c", bg: "#fb923c15" };
  return { color: "#f87171", bg: "#f8717115" };
};

const stockLabel = (status) => {
  if (status === "IN_STOCK") return "OK";
  if (status === "LOW_STOCK") return "Low";
  return "Out";
};

const barWidth = (qty) => Math.min((qty / 100) * 100, 100);
const barColor = (status) => status === "IN_STOCK" ? "#4ade80" : status === "LOW_STOCK" ? "#fb923c" : "#f87171";

export default function AdminDashboard() {
  const { parts, loading: partsLoading } = useInventory();
  const { pos, loading: posLoading, handleApprove, handleReject } = usePurchaseOrders();

  const pendingPOs = pos.filter(p => p.status === "PENDING");
  const totalValue = parts.reduce((sum, p) => sum + (p.quantity * p.unitPrice), 0);

  return (
    <AdminLayout>
      <div style={S.title}>Admin dashboard</div>
      <div style={S.sub}>Welcome back, Suhas — full system access</div>

      {/* Stats */}
      <div style={S.statsGrid}>
        <div style={S.statCard}>
          <div style={S.statLabel}>Total SKUs</div>
          <div style={S.statValue}>{parts.length.toLocaleString()}</div>
          <div style={{ ...S.statSub, color: "#4ade80" }}>+12 new today</div>
        </div>
        <div style={S.statCard}>
          <div style={S.statLabel}>Inventory value</div>
          <div style={S.statValue}>₹{(totalValue / 100000).toFixed(1)}Cr</div>
          <div style={{ ...S.statSub, color: "#f87171" }}>-3.2% this week</div>
        </div>
        <div style={S.statCard}>
          <div style={S.statLabel}>Active users</div>
          <div style={S.statValue}>12</div>
          <div style={{ ...S.statSub, color: "#4ade80" }}>+2 added</div>
        </div>
        <div style={S.statCard}>
          <div style={S.statLabel}>AI accuracy</div>
          <div style={S.statValue}>91.4%</div>
          <div style={{ ...S.statSub, color: "#60a5fa" }}>Model v2</div>
        </div>
      </div>

      {/* Main Grid */}
      <div style={S.grid2}>
        {/* Left Column */}
        <div>
          {/* Inventory Quick View */}
          <div style={S.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={S.cardTitle}>Inventory quick view</div>
              <button style={{ ...S.btn("#3b82f6"), marginLeft: 0 }}>+ Add part</button>
            </div>
            {partsLoading ? (
              <div style={{ color: "#ffffff60", fontSize: 13 }}>Loading...</div>
            ) : (
              parts.slice(0, 4).map(part => {
                const { color, bg } = stockColor(part.stockStatus);
                return (
                  <div key={part.id} style={S.row}>
                    <span style={{ color: "white", width: 90, fontSize: 12 }}>{part.name.substring(0, 8)}...</span>
                    <span style={{ color: "#ffffff60", fontSize: 11 }}>Qty:{part.quantity}</span>
                    <div style={S.barWrap}>
                      <div style={{ width: `${barWidth(part.quantity)}%`, background: barColor(part.stockStatus), height: "100%", borderRadius: 4 }} />
                    </div>
                    <span style={S.badge(color, bg)}>{stockLabel(part.stockStatus)}</span>
                    <div>
                      <button style={S.btn("#3b82f6")}>Edit</button>
                      <button style={S.btn("#ef4444")}>Del</button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* AI Model Config */}
          <div style={S.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={S.cardTitle}>AI model config</div>
              <button style={{ ...S.btn("#3b82f6"), marginLeft: 0 }}>Save config</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { label: "OpenAI model", value: "gpt-4o", type: "select", options: ["gpt-4o", "gpt-3.5-turbo", "claude-3"] },
                { label: "Risk threshold", value: "6.5" },
                { label: "Forecast horizon", value: "30 days" },
                { label: "Kafka topic", value: "inventory.alerts" },
              ].map((field, i) => (
                <div key={i}>
                  <div style={{ fontSize: 11, color: "#ffffff60", marginBottom: 4 }}>{field.label}</div>
                  {field.type === "select" ? (
                    <select style={{ width: "100%", background: "#0f1117", border: "0.5px solid #ffffff30", borderRadius: 6, padding: "6px 8px", color: "white", fontSize: 12 }}>
                      {field.options.map(o => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input defaultValue={field.value} style={{ width: "100%", background: "#0f1117", border: "0.5px solid #ffffff30", borderRadius: 6, padding: "6px 8px", color: "white", fontSize: 12, boxSizing: "border-box" }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* PO Approvals */}
          <div style={S.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={S.cardTitle}>PO approvals</div>
              {pendingPOs.length > 0 && (
                <span style={S.badge("#fb923c", "#fb923c15")}>{pendingPOs.length} pending</span>
              )}
            </div>
            {posLoading ? (
              <div style={{ color: "#ffffff60", fontSize: 13 }}>Loading...</div>
            ) : pendingPOs.length === 0 ? (
              <div style={{ color: "#ffffff60", fontSize: 13 }}>Koi pending PO nahi hai</div>
            ) : (
              pendingPOs.map(po => (
                <div key={po.id} style={S.row}>
                  <span style={{ color: "#60a5fa", fontSize: 12 }}>{po.poNumber}</span>
                  <span style={{ color: "#ffffff60", fontSize: 11 }}>{po.part?.name?.substring(0, 8)}...</span>
                  <span style={{ color: "white", fontSize: 12 }}>₹{po.totalAmount?.toLocaleString()}</span>
                  <div>
                    <button style={S.btn("#3b82f6")} onClick={() => handleApprove(po.id)}>Approve</button>
                    <button style={S.btn("#ef4444")} onClick={() => handleReject(po.id)}>Reject</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* User Management */}
          <div style={S.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={S.cardTitle}>User management</div>
              <button style={{ ...S.btn("#3b82f6"), marginLeft: 0 }}>+ Add user</button>
            </div>
            {[
              { initials: "SW", name: "Suhas Wani", role: "Admin", color: "#f87171", bg: "#f8717115" },
              { initials: "RK", name: "Rahul Kulkarni", role: "Inv. Manager", color: "#4ade80", bg: "#4ade8015" },
              { initials: "PM", name: "Priya More", role: "Viewer", color: "#60a5fa", bg: "#60a5fa15" },
            ].map((user, i) => (
              <div key={i} style={S.row}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: user.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: user.color, fontWeight: 500, flexShrink: 0 }}>
                  {user.initials}
                </div>
                <span style={{ color: "white", fontSize: 12, flex: 1, marginLeft: 8 }}>{user.name}</span>
                <span style={S.badge(user.color, user.bg)}>{user.role}</span>
                <div>
                  <button style={S.btn("#3b82f6")}>Edit</button>
                  <button style={S.btn("#ef4444")}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}