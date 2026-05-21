import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = {
  MAIN: [
    { label: "Dashboard",       path: "/admin/dashboard" },
    { label: "Inventory",       path: "/admin/inventory" },
    { label: "Suppliers",       path: "/admin/suppliers" },
    { label: "Purchase Orders", path: "/admin/purchase-orders" },
  ],
  "AI TOOLS": [
    { label: "AI Insights",  path: "/admin/ai-insights" },
    { label: "Risk Scorer",  path: "/admin/risk-scorer" },
    { label: "Forecasting",  path: "/admin/forecasting" },
  ],
  "ADMIN ONLY": [
    { label: "Users",           path: "/admin/users" },
    { label: "AI Model Config", path: "/admin/ai-config" },
    { label: "Audit Log",       path: "/admin/audit-log" },
    { label: "System Settings", path: "/admin/settings" },
  ],
};

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{
      width: 220, background: "#0a1628", minHeight: "100vh",
      flexShrink: 0, display: "flex", flexDirection: "column",
      position: "sticky", top: 0, height: "100vh",
    }}>
      {/* Logo */}
      <div style={{
        padding: "20px 16px 16px",
        borderBottom: "0.5px solid rgba(255,255,255,0.07)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: "rgba(96,165,250,0.18)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16,
        }}>⬡</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>IMS</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 1, textTransform: "uppercase" }}>Admin Portal</div>
        </div>
      </div>

      {/* Links */}
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 16 }}>
        {Object.entries(menuItems).map(([section, items]) => (
          <div key={section}>
            <div style={{
              fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.25)",
              letterSpacing: 1.5, textTransform: "uppercase", padding: "16px 16px 6px",
            }}>{section}</div>
            {items.map(item => {
              const active = location.pathname === item.path;
              return (
                <div key={item.path}
                  onClick={() => navigate(item.path)}
                  onMouseEnter={() => setHovered(item.path)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    margin: "2px 10px", padding: "9px 12px",
                    cursor: "pointer",
                    borderLeft: active ? "3px solid #60a5fa" : "3px solid transparent",
                    borderRadius: active ? "0 8px 8px 0" : 8,
                    background: active
                      ? "rgba(255,255,255,0.10)"
                      : hovered === item.path
                      ? "rgba(255,255,255,0.05)"
                      : "transparent",
                    color: active ? "#fff" : "rgba(255,255,255,0.55)",
                    fontSize: 13.5, fontWeight: active ? 600 : 400,
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{
                    width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                    background: active ? "#60a5fa" : "rgba(255,255,255,0.25)",
                  }} />
                  {item.label}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Role badge */}
      <div style={{
        margin: "16px 12px", padding: "10px 12px",
        background: "rgba(255,255,255,0.05)",
        border: "0.5px solid rgba(255,255,255,0.08)",
        borderRadius: 8,
      }}>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>Logged in as</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#f87171" }}>Administrator</div>
      </div>
    </div>
  );
}