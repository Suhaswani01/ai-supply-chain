import { useNavigate } from "react-router-dom";
import { getRole, logout } from "../services/authService";

const ROLE_LABEL = {
  ROLE_ADMIN:             "Admin",
  ROLE_INVENTORY_MANAGER: "Manager",
  ROLE_VIEWER:            "Viewer",
};

export default function Navbar() {
  const navigate = useNavigate();
  const role = getRole();

  let email = "";
  try {
    const token = localStorage.getItem("token");
    if (token) email = JSON.parse(atob(token.split(".")[1])).sub || "";
  } catch (_) {}

  return (
    <div style={{
      height: 52,
      background: "#0d1f3c",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: "0 10px",
      gap: 12,
      borderBottom: "0.5px solid rgba(255,255,255,0.06)",
      flexShrink: 0,
    }}>
      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
        {email}
      </span>
      <span style={{
        fontSize: 11, padding: "3px 10px", borderRadius: 20,
        background: "rgba(74,222,128,0.15)", color: "#4ade80",
        border: "0.5px solid rgba(74,222,128,0.25)", fontWeight: 500,
      }}>
        {ROLE_LABEL[role]}
      </span>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80" }} />
      <button
        onClick={() => { logout(); navigate("/"); }}
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "0.5px solid rgba(255,255,255,0.18)",
          color: "rgba(255,255,255,0.75)",
          padding: "5px 14px", borderRadius: 6,
          fontSize: 12, cursor: "pointer",
        }}
      >Logout</button>
    </div>
  );
}