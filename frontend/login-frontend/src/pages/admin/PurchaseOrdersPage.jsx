import { useState } from "react";
import AdminLayout from "../../components/admin/Layout";
import { usePurchaseOrders } from "../../hooks/usePurchaseOrders";

const S = {
  title: { fontSize: 20, fontWeight: 500, color: "white", marginBottom: 4 },
  sub: { fontSize: 13, color: "#ffffff60", marginBottom: 20 },
  card: { background: "#1a1f2e", border: "0.5px solid #ffffff15", borderRadius: 12, padding: 18 },
  toolbar: { display: "flex", justifyContent: "space-between", marginBottom: 16, alignItems: "center" },
  btn: (bg) => ({ background: bg, color: "white", border: "none", padding: "6px 14px", borderRadius: 6, fontSize: 12, cursor: "pointer", marginLeft: 6 }),
  th: { textAlign: "left", padding: "8px 12px", color: "#ffffff60", fontSize: 11, fontWeight: 500, borderBottom: "0.5px solid #ffffff15" },
  td: { padding: "10px 12px", color: "white", fontSize: 12, borderBottom: "0.5px solid #ffffff10" },
};

const statusBadge = (status) => {
  const map = {
    PENDING: { color: "#fb923c", bg: "#fb923c15" },
    APPROVED: { color: "#4ade80", bg: "#4ade8015" },
    REJECTED: { color: "#f87171", bg: "#f8717115" },
  };
  const { color, bg } = map[status] || map.PENDING;
  return <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, color, background: bg }}>{status}</span>;
};

export default function PurchaseOrdersPage() {
  const { pos, loading, handleApprove, handleReject } = usePurchaseOrders();
  const [filter, setFilter] = useState("ALL");

  const filtered = filter === "ALL" ? pos : pos.filter(p => p.status === filter);

  return (
    <AdminLayout>
      <div style={S.title}>Purchase Orders</div>
      <div style={S.sub}>POs approve ya reject karo</div>
      <div style={S.card}>
        <div style={S.toolbar}>
          <div style={{ display: "flex", gap: 6 }}>
            {["ALL", "PENDING", "APPROVED", "REJECTED"].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ ...S.btn(filter === f ? "#3b82f6" : "#ffffff15"), marginLeft: 0 }}>
                {f}
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <div style={{ color: "#ffffff60", padding: 20, textAlign: "center" }}>Loading...</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["PO Number", "Part", "Supplier", "Qty", "Amount", "Status", "Actions"].map(h => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(po => (
                <tr key={po.id}>
                  <td style={{ ...S.td, color: "#60a5fa" }}>{po.poNumber}</td>
                  <td style={S.td}>{po.part?.name}</td>
                  <td style={S.td}>{po.supplier?.name}</td>
                  <td style={S.td}>{po.quantity}</td>
                  <td style={S.td}>₹{po.totalAmount?.toLocaleString()}</td>
                  <td style={S.td}>{statusBadge(po.status)}</td>
                  <td style={S.td}>
                    {po.status === "PENDING" && <>
                      <button style={{ ...S.btn("#3b82f6"), marginLeft: 0, marginRight: 6, padding: "4px 10px" }}
                        onClick={() => handleApprove(po.id)}>Approve</button>
                      <button style={{ ...S.btn("#ef4444"), padding: "4px 10px" }}
                        onClick={() => handleReject(po.id)}>Reject</button>
                    </>}
                    {po.status !== "PENDING" && (
                      <button style={{ ...S.btn("#ffffff15"), marginLeft: 0, padding: "4px 10px" }}>View</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}