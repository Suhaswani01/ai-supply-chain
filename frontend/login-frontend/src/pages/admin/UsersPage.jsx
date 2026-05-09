import AdminLayout from "../../components/admin/Layout";

const S = {
  title: { fontSize: 20, fontWeight: 500, color: "white", marginBottom: 4 },
  sub: { fontSize: 13, color: "#ffffff60", marginBottom: 20 },
  card: { background: "#1a1f2e", border: "0.5px solid #ffffff15", borderRadius: 12, padding: 18 },
  toolbar: { display: "flex", justifyContent: "space-between", marginBottom: 16 },
  btn: (bg) => ({ background: bg, color: "white", border: "none", padding: "6px 14px", borderRadius: 6, fontSize: 12, cursor: "pointer" }),
  th: { textAlign: "left", padding: "8px 12px", color: "#ffffff60", fontSize: 11, fontWeight: 500, borderBottom: "0.5px solid #ffffff15" },
  td: { padding: "10px 12px", color: "white", fontSize: 12, borderBottom: "0.5px solid #ffffff10" },
};

const roleInfo = (role) => {
  if (role === "ROLE_ADMIN") return { color: "#f87171", bg: "#f8717115", label: "Admin" };
  if (role === "ROLE_INVENTORY_MANAGER") return { color: "#4ade80", bg: "#4ade8015", label: "Inv. Manager" };
  return { color: "#60a5fa", bg: "#60a5fa15", label: "Viewer" };
};

const users = [
  { id: 1, initials: "SW", name: "Suhas Wani", email: "admin@test.com", role: "ROLE_ADMIN" },
  { id: 2, initials: "RK", name: "Rahul Kulkarni", email: "manager@test.com", role: "ROLE_INVENTORY_MANAGER" },
  { id: 3, initials: "PM", name: "Priya More", email: "viewer@test.com", role: "ROLE_VIEWER" },
];

export default function UsersPage() {
  return (
    <AdminLayout>
      <div style={S.title}>User Management</div>
      <div style={S.sub}>Users aur roles manage karo</div>
      <div style={S.card}>
        <div style={S.toolbar}>
          <span style={{ color: "#ffffff60", fontSize: 13 }}>Total: {users.length} users</span>
          <button style={S.btn("#3b82f6")}>+ Add User</button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["User", "Email", "Role", "Actions"].map(h => (
                <th key={h} style={S.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(user => {
              const { color, bg, label } = roleInfo(user.role);
              return (
                <tr key={user.id}>
                  <td style={S.td}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 30, height: 30, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color, fontWeight: 500 }}>
                        {user.initials}
                      </div>
                      {user.name}
                    </div>
                  </td>
                  <td style={{ ...S.td, color: "#ffffff80" }}>{user.email}</td>
                  <td style={S.td}><span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, color, background: bg }}>{label}</span></td>
                  <td style={S.td}>
                    <button style={{ ...S.btn("#3b82f6"), marginRight: 6, padding: "4px 10px" }}>Edit</button>
                    <button style={{ ...S.btn("#ef4444"), padding: "4px 10px" }}>Remove</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}