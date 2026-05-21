import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../Navbar";

const LINKS = [
  { label: "Dashboard",       path: "/manager/dashboard"  },
  { label: "Inventory",       path: "/manager/inventory" },
  { label: "Purchase Orders", path: "/manager/orders"     },
  { label: "Suppliers",       path: "/manager/suppliers"},
];

export default function ManagerLayout({ children }) {
  const nav = useNavigate();
  const loc = useLocation();
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Sidebar */}
      <div style={{
        width: 220, minHeight: "100vh", background: "#0a1628",
        display: "flex", flexDirection: "column",
        flexShrink: 0, position: "sticky", top: 0, height: "100vh",
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
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 1, textTransform: "uppercase" }}>Manager Portal</div>
          </div>
        </div>

        {/* Section label */}
        <div style={{
          fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.25)",
          letterSpacing: 1.5, textTransform: "uppercase", padding: "16px 16px 6px",
        }}>Main</div>

        {/* Nav links */}
        {LINKS.map((item) => {
          const active = loc.pathname === item.path;
          return (
            <div
              key={item.path}
              onClick={() => nav(item.path)}
              onMouseEnter={() => setHovered(item.path)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                margin: "2px 10px", padding: "9px 12px", borderRadius: 8,
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
              <span style={{ fontSize: 15 }}>{item.icon}</span>
              {item.label}
            </div>
          );
        })}

        <div style={{ flex: 1 }} />

        {/* Role badge bottom */}
        <div style={{
          margin: "16px 12px", padding: "10px 12px",
          background: "rgba(255,255,255,0.05)",
          border: "0.5px solid rgba(255,255,255,0.08)",
          borderRadius: 8,
        }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>Logged in as</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#4ade80" }}>Inventory Manager</div>
        </div>
      </div>

      {/* Right side */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#ffffff" }}>
        <Navbar />
        <div style={{ flex: 1, overflowY: "auto"  }}>
          {children}
        </div>
      </div>
    </div>
  );
}