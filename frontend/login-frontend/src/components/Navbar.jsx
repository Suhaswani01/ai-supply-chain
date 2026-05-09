import { useNavigate } from "react-router-dom";
import { logout, getRole } from "../services/authService";

const S = {
  navbar: { background: "#0d1b2a", borderBottom: "0.5px solid #ffffff15", padding: "0 24px", height: 52, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12, flexShrink: 0 },
  badge: { background: "#1e3a5f", color: "#60a5fa", fontSize: 11, padding: "3px 10px", borderRadius: 20, border: "0.5px solid #3b82f640" },
  email: { fontSize: 13, color: "#ffffffa0" },
  dot: { width: 8, height: 8, borderRadius: "50%", background: "#4ade80" },
  logout: { background: "transparent", border: "0.5px solid #ffffff30", color: "#ffffffa0", padding: "5px 14px", borderRadius: 6, fontSize: 12, cursor: "pointer" },
};

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div style={S.navbar}>
      <span style={S.badge}>{getRole()}</span>
      <span style={S.email}>suhas@admin.com</span>
      <div style={S.dot} />
      <button style={S.logout} onClick={handleLogout}>Logout</button>
    </div>
  );
}