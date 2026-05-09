import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../services/authService";

const menuItems = {
  MAIN: [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Inventory", path: "/admin/inventory" },
    { label: "Suppliers", path: "/admin/suppliers" },
    { label: "Purchase Orders", path: "/admin/purchase-orders" },
  ],
  "AI TOOLS": [
    { label: "AI Insights", path: "/admin/ai-insights" },
    { label: "Risk Scorer", path: "/admin/risk-scorer" },
    { label: "Forecasting", path: "/admin/forecasting" },
  ],
  "ADMIN ONLY": [
    { label: "Users", path: "/admin/users" },
    { label: "AI Model Config", path: "/admin/ai-config" },
    { label: "Audit Log", path: "/admin/audit-log" },
    { label: "System Settings", path: "/admin/settings" },
  ],
};

const S = {
  sidebar: { width: 220, background: "#0d1b2a", minHeight: "100vh", flexShrink: 0, display: "flex", flexDirection: "column" },
  logo: { padding: "20px 20px 16px", borderBottom: "0.5px solid #ffffff15", fontSize: 15, fontWeight: 500, color: "white" },
  section: { padding: "16px 20px 4px", fontSize: 10, color: "#ffffff40", letterSpacing: 1, fontWeight: 500 },
  item: (active) => ({ padding: "8px 20px", fontSize: 13, cursor: "pointer", color: active ? "#60a5fa" : "#ffffffa0", background: active ? "#1e3a5f" : "transparent", borderLeft: active ? "2px solid #60a5fa" : "2px solid transparent", display: "flex", alignItems: "center", gap: 8 }),
  dot: (active) => ({ width: 6, height: 6, borderRadius: "50%", background: active ? "#60a5fa" : "#ffffff30", flexShrink: 0 }),
};

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={S.sidebar}>
      <div style={S.logo}>AI Supply Chain</div>
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 16 }}>
        {Object.entries(menuItems).map(([section, items]) => (
          <div key={section}>
            <div style={S.section}>{section}</div>
            {items.map(item => {
              const active = location.pathname === item.path;
              return (
                <div key={item.path} style={S.item(active)}
                  onClick={() => navigate(item.path)}>
                  <div style={S.dot(active)} />
                  {item.label}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}