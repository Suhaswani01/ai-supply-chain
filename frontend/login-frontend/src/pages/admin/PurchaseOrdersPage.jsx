import { useState } from "react";
import AdminLayout from "../../components/admin/Layout";
import { usePurchaseOrders } from "../../hooks/usePurchaseOrders";

const S = {
  title: { fontSize: 20, fontWeight: 500, color: "black", marginBottom: 4 },
  sub: { fontSize: 13, color: "#00000060", marginBottom: 20 },
  card: { background: "#ffffff", border: "0.5px solid #00000015", borderRadius: 12, padding: 18 },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 16,
    alignItems: "center",
  },
  btn: (bg) => ({
    background: bg,
    color: "Black",
    border: "1px solid black",
    padding: "6px 14px",
    borderRadius: 6,
    fontSize: 12,
    cursor: "pointer",
    marginLeft: 6,
  }),
  th: {
    textAlign: "left",
    padding: "8px 12px",
    color: "#00000060",
    fontSize: 19,
    fontWeight: 500,
    borderBottom: "0.5px solid #1b050515",
  },
  td: {
    padding: "10px 12px",
    color: "black",
    fontSize: 20,
    borderBottom: "0.5px solid #ffffff10",
  },
  emptyBox: {
    padding: "40px 20px",
    textAlign: "center",
    color: "#68545440",
    fontSize: 13,
  },
  countBadge: {
    fontSize: 11,
    padding: "3px 10px",
    borderRadius: 20,
    background: "#fb923c15",
    color: "#fb923c",
    border: "0.5px solid #fb923c40",
    marginLeft: 8,
  },
};

// Status badge — color coded
const statusBadge = (status) => {
  const map = {
    PENDING:  { color: "#fb923c", bg: "#fb923c15" },
    APPROVED: { color: "#4ade80", bg: "#4ade8015" },
    REJECTED: { color: "#f87171", bg: "#f8717115" },
  };
  const { color, bg } = map[status] || map.PENDING;
  return (
    <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 4, color, background: bg, fontWeight: 600 }}>
      {status}
    </span>
  );
};

// Format amount
const fmtAmount = (amt) => {
  if (!amt) return "—";
  return "₹" + Number(amt).toLocaleString("en-IN");
};

// Format date
const fmtDate = (dt) => {
  if (!dt) return "—";
  return new Date(dt).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

export default function PurchaseOrdersPage() {
  const { pos, loading, handleApprove, handleReject } = usePurchaseOrders();
  const [filter, setFilter] = useState("ALL");
  const [actionLoading, setActionLoading] = useState(null); // track which PO is loading

  const filtered = filter === "ALL" ? pos : pos.filter((p) => p.status === filter);

  const pendingCount = pos.filter((p) => p.status === "PENDING").length;

  // Approve with loading state
  const onApprove = async (id) => {
    if (!window.confirm("Is PO ko APPROVE karna chahte ho?")) return;
    setActionLoading(id + "_approve");
    try {
      await handleApprove(id);
    } finally {
      setActionLoading(null);
    }
  };

  // Reject with loading state
  const onReject = async (id) => {
    if (!window.confirm("Is PO ko REJECT karna chahte ho?")) return;
    setActionLoading(id + "_reject");
    try {
      await handleReject(id);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div style={S.title}>
        Purchase Orders
        {pendingCount > 0 && (
          <span style={S.countBadge}>{pendingCount} pending</span>
        )}
      </div>
      <div style={S.sub}>
        Pending POs review karo — Approve ya Reject karo
      </div>

      {/* Filter tabs */}
      <div style={S.card}>
        <div style={S.toolbar}>
          <div style={{ display: "flex", gap: 6 }}>
            {["ALL", "PENDING", "APPROVED", "REJECTED"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  ...S.btn(filter === f ? "#3b82f6" : "#ffffff10"),
                  marginLeft: 0,
                  border: filter === f ? "none" : "0.5px solid #ffffff20",
                }}
              >
                {f}
                {/* Count badges on tabs */}
                {f !== "ALL" && (
                  <span style={{
                    marginLeft: 6,
                    fontSize: 10,
                    background: "#ffffff15",
                    padding: "1px 6px",
                    borderRadius: 10,
                  }}>
                    {pos.filter((p) => p.status === f).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Info — Admin do only approve/reject karta hai */}
          <div style={{ fontSize: 11, color: "#ffffff40", fontStyle: "italic" }}>
            ℹ️ PO create karna Manager ka kaam hai
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div style={S.emptyBox}>Loading purchase orders...</div>
        ) : filtered.length === 0 ? (
          <div style={S.emptyBox}>
            {filter === "PENDING"
              ? "✅ not any pending"
              : `any ${filter} PO not available`}
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {[
                  "PO Number",
                  "Part",
                  "Supplier",
                  "Qty",
                  "Amount",
                  "Date",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((po) => (
                <tr
                  key={po.id}
                  style={{ transition: "background 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#ffffff08")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {/* PO Number */}
                  <td style={{ ...S.td, color: "#60a5fa", fontWeight: 600, fontFamily: "monospace" }}>
                    {po.poNumber}
                  </td>

                  {/* Part */}
                  <td style={S.td}>
                    <div style={{ fontWeight: 500 }}>{po.part?.name || "—"}</div>
                    <div style={{ fontSize: 10, color: "#ffffff50", marginTop: 2 }}>
                      {po.part?.partCode}
                    </div>
                  </td>

                  {/* Supplier */}
                  <td style={S.td}>{po.supplier?.name || "—"}</td>

                  {/* Quantity */}
                  <td style={{ ...S.td, textAlign: "center" }}>{po.quantity}</td>

                  {/* Amount */}
                  <td style={{ ...S.td, color: "#4ade80", fontWeight: 600 }}>
                    {fmtAmount(po.totalAmount)}
                  </td>

                  {/* Date */}
                  <td style={{ ...S.td, color: "#ffffff60", fontSize: 11 }}>
                    {fmtDate(po.createdAt)}
                  </td>

                  {/* Status */}
                  <td style={S.td}>{statusBadge(po.status)}</td>

                  {/* Actions — sirf PENDING pe Approve/Reject */}
                  <td style={S.td}>
                    {po.status === "PENDING" ? (
                      <div style={{ display: "flex", gap: 6 }}>
                        {/* Approve */}
                        <button
                          onClick={() => onApprove(po.id)}
                          disabled={actionLoading !== null}
                          style={{
                            background: actionLoading === po.id + "_approve"
                              ? "#15803d" : "#16a34a",
                            color: "white",
                            border: "none",
                            padding: "5px 12px",
                            borderRadius: 5,
                            fontSize: 11,
                            cursor: actionLoading !== null ? "not-allowed" : "pointer",
                            fontWeight: 600,
                            opacity: actionLoading !== null ? 0.7 : 1,
                          }}
                        >
                          {actionLoading === po.id + "_approve"
                            ? "..." : "✓ Approve"}
                        </button>

                        {/* Reject */}
                        <button
                          onClick={() => onReject(po.id)}
                          disabled={actionLoading !== null}
                          style={{
                            background: actionLoading === po.id + "_reject"
                              ? "#991b1b" : "#dc2626",
                            color: "white",
                            border: "none",
                            padding: "5px 12px",
                            borderRadius: 5,
                            fontSize: 11,
                            cursor: actionLoading !== null ? "not-allowed" : "pointer",
                            fontWeight: 600,
                            opacity: actionLoading !== null ? 0.7 : 1,
                          }}
                        >
                          {actionLoading === po.id + "_reject"
                            ? "..." : "✗ Reject"}
                        </button>
                      </div>
                    ) : (
                      // Already approved/rejected — sirf status dikhao
                      <span style={{ fontSize: 11, color: "#ffffff30" }}>
                        {po.status === "APPROVED" ? "✓ Done" : "✗ Done"}
                      </span>
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