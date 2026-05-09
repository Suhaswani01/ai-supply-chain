import { useState } from "react";
import AdminLayout from "../../components/admin/Layout";
import { useSuppliers } from "../../hooks/useSuppliers";
import AddSupplierModal from "../../components/admin/AddSupplierModal";

const S = {
  title: { fontSize: 20, fontWeight: 500, color: "white", marginBottom: 4 },
  sub: { fontSize: 13, color: "#ffffff60", marginBottom: 20 },
  card: { background: "#1a1f2e", border: "0.5px solid #ffffff15", borderRadius: 12, padding: 18 },
  toolbar: { display: "flex", justifyContent: "space-between", marginBottom: 16 },
  search: { background: "#0f1117", border: "0.5px solid #ffffff30", borderRadius: 6, padding: "6px 12px", color: "white", fontSize: 12, width: 220 },
  btn: (bg) => ({ background: bg, color: "white", border: "none", padding: "6px 14px", borderRadius: 6, fontSize: 12, cursor: "pointer" }),
  th: { textAlign: "left", padding: "8px 12px", color: "#ffffff60", fontSize: 11, fontWeight: 500, borderBottom: "0.5px solid #ffffff15" },
  td: { padding: "10px 12px", color: "white", fontSize: 12, borderBottom: "0.5px solid #ffffff10" },
};

export default function SuppliersPage() {
  const { suppliers, loading, handleAdd, handleDelete } = useSuppliers();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);  // ← modal state

  const filtered = suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div style={S.title}>Suppliers</div>
      <div style={S.sub}>Supplier list manage karo</div>

      <div style={S.card}>
        <div style={S.toolbar}>
          <input style={S.search} placeholder="Search suppliers..."
            value={search} onChange={e => setSearch(e.target.value)} />
          <button style={S.btn("#3b82f6")}
            onClick={() => setShowModal(true)}>
            + Add Supplier
          </button>
        </div>

        {loading ? (
          <div style={{ color: "#ffffff60", padding: 20, textAlign: "center" }}>Loading...</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Name", "Email", "Phone", "Address", "Rating", "Status", "Actions"].map(h => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td style={S.td}>{s.name}</td>
                  <td style={S.td}>{s.email}</td>
                  <td style={S.td}>{s.phone}</td>
                  <td style={S.td}>{s.address}</td>
                  <td style={S.td}>{s.rating}/5</td>
                  <td style={S.td}>
                    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, color: s.status === "ACTIVE" ? "#4ade80" : "#fb923c", background: s.status === "ACTIVE" ? "#4ade8015" : "#fb923c15" }}>
                      {s.status}
                    </span>
                  </td>
                  <td style={S.td}>
                    <button style={{ ...S.btn("#3b82f6"), marginRight: 6, padding: "4px 10px" }}>Edit</button>
                    <button style={{ ...S.btn("#ef4444"), padding: "4px 10px" }}
                      onClick={() => handleDelete(s.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      <AddSupplierModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAdd}
      />

    </AdminLayout>
  );
}