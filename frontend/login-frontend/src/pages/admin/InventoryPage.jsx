import { useState } from "react";
import AdminLayout from "../../components/admin/Layout";
import { useInventory } from "../../hooks/useInventory";
import AddPartModal from "../../components/admin/AddPartModal"; // ← import karo

const S = {
  title: { fontSize: 20, fontWeight: 500, color: "white", marginBottom: 4 },
  sub: { fontSize: 13, color: "#ffffff60", marginBottom: 20 },
  card: { background: "#1a1f2e", border: "0.5px solid #ffffff15", borderRadius: 12, padding: 18 },
  toolbar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  search: { background: "#0f1117", border: "0.5px solid #ffffff30", borderRadius: 6, padding: "6px 12px", color: "white", fontSize: 12, width: 220 },
  btn: (bg) => ({ background: bg, color: "white", border: "none", padding: "6px 14px", borderRadius: 6, fontSize: 12, cursor: "pointer" }),
  th: { textAlign: "left", padding: "8px 12px", color: "#ffffff60", fontSize: 11, fontWeight: 500, borderBottom: "0.5px solid #ffffff15" },
  td: { padding: "10px 12px", color: "white", fontSize: 12, borderBottom: "0.5px solid #ffffff10" },
  badge: (color, bg) => ({ fontSize: 10, padding: "2px 8px", borderRadius: 4, color, background: bg }),
};

const stockInfo = (status) => {
  if (status === "IN_STOCK") return { color: "#4ade80", bg: "#4ade8015", label: "In Stock" };
  if (status === "LOW_STOCK") return { color: "#fb923c", bg: "#fb923c15", label: "Low Stock" };
  return { color: "#f87171", bg: "#f8717115", label: "Out of Stock" };
};

export default function InventoryPage() {
  const { parts, loading, handleAdd, handleDelete } = useInventory();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false); // ← sirf yeh chahiye

  const filtered = parts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.partCode?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div style={S.title}>Inventory Management</div>
      <div style={S.sub}>Parts aur items manage karo</div>

      <div style={S.card}>
        <div style={S.toolbar}>
          <input
            style={S.search}
            placeholder="Search parts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            style={S.btn("#3b82f6")}
            onClick={() => setShowModal(true)} // ← modal kholo
          >
            + Add Part
          </button>
        </div>

        {loading ? (
          <div style={{ color: "#ffffff60", padding: 20, textAlign: "center" }}>
            Loading...
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Part Code", "Name", "Category", "Quantity", "Unit Price", "Status", "Actions"].map(h => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(part => {
                const { color, bg, label } = stockInfo(part.stockStatus);
                return (
                  <tr key={part.id}>
                    <td style={S.td}>{part.partCode}</td>
                    <td style={S.td}>{part.name}</td>
                    <td style={S.td}>{part.category}</td>
                    <td style={S.td}>{part.quantity}</td>
                    <td style={S.td}>₹{part.unitPrice?.toLocaleString()}</td>
                    <td style={S.td}><span style={S.badge(color, bg)}>{label}</span></td>
                    <td style={S.td}>
                      <button style={{ ...S.btn("#3b82f6"), marginRight: 6, padding: "4px 10px" }}>
                        Edit
                      </button>
                      <button
                        style={{ ...S.btn("#ef4444"), padding: "4px 10px" }}
                        onClick={() => handleDelete(part.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal — alag component ✅ */}
      <AddPartModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAdd}
      />

    </AdminLayout>
  );
}