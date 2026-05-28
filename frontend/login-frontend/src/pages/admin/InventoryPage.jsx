import { useState } from "react";
import AdminLayout from "../../components/admin/Layout";
import { useInventory } from "../../hooks/useInventory";
import AddPartModal from "../../components/admin/AddPartModal";

const S = {
  title: { fontSize: 20, fontWeight: 500, color: "black", marginBottom: 4 },
  sub: { fontSize: 13, color: "#00000060", marginBottom: 20 },
  card: { background: "#ffffff", border: "1.5px solid rgba(14, 3, 3, 0.08)", borderRadius: 12, padding: 18 },
  toolbar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  search: { background: "#e7eaf1", border: "0.5px solid #08010130", borderRadius: 6, padding: "6px 12px", color: "black", fontSize: 12, width: 220 },
  btn: (bg) => ({ background: bg, color: "white", border: "none", padding: "6px 14px", borderRadius: 6, fontSize: 12, cursor: "pointer" }),
  th: { textAlign: "left", padding: "8px 12px", color: "#00000060", fontSize: 11, fontWeight: 500, borderBottom: "0.5px solid #00000015" },
  td: { padding: "10px 12px", color: "black", fontSize: 12, borderBottom: "0.5px solid #00000010" },
  badge: (color, bg) => ({ fontSize: 10, padding: "2px 8px", borderRadius: 4, color, background: bg }),
};

const stockInfo = (status) => {
  if (status === "IN_STOCK") return { color: "#4ade80", bg: "#4ade8015", label: "In Stock" };
  if (status === "LOW_STOCK") return { color: "#fb923c", bg: "#fb923c15", label: "Low Stock" };
  return { color: "#f87171", bg: "#f8717115", label: "Out of Stock" };
};

export default function InventoryPage() {
  const { parts, loading, handleAdd, handleUpdate, handleDelete } = useInventory();
  const [search, setSearch] = useState("");

  // Add modal
  const [showAddModal, setShowAddModal] = useState(false);

  // Edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);

  const filtered = parts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.partCode?.toLowerCase().includes(search.toLowerCase())
  );

  // Edit button click → part data modal mein bhejo
  const handleEditClick = (part) => {
    setSelectedPart(part);
    setShowEditModal(true);
  };

  return (
    <AdminLayout>
      <div style={S.title}>Inventory Management</div>
      <div style={S.sub}>Parts aur suppliers manage karo</div>

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
            onClick={() => setShowAddModal(true)}
          >
            + Add Part
          </button>
        </div>

        {loading ? (
          <div style={{ color: "#00000060", padding: 20, textAlign: "center" }}>
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
                    <td style={S.td}>
                      <span style={S.badge(color, bg)}>{label}</span>
                    </td>
                    <td style={S.td}>
                      {/* Edit Button */}
                      <button
                        style={{ ...S.btn("#3b82f6"), marginRight: 6, padding: "4px 10px" }}
                        onClick={() => handleEditClick(part)}
                      >
                        Edit
                      </button>
                      {/* Delete Button */}
                      <button
                        style={{ ...S.btn("#ef4444"), padding: "4px 10px" }}
                        onClick={() => {
                          if (window.confirm(`"${part.name}" delete karna chahte ho?`))
                            handleDelete(part.id);
                        }}
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

      {/* Add Part Modal */}
      <AddPartModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAdd}
      />

      {/* Edit Part Modal — same modal reuse, data pass karo */}
      <AddPartModal
        show={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedPart(null);
        }}
        onAdd={(updatedData) => {
          handleUpdate(selectedPart.id, updatedData);
          setShowEditModal(false);
          setSelectedPart(null);
        }}
        editData={selectedPart}  // ← existing data pass karo
      />

    </AdminLayout>
  );
}