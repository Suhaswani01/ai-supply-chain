import { useState } from "react";
import axios from "axios";
import { getToken } from "../../services/authService";
import AdminLayout from "../../components/admin/Layout";

const api = axios.create({ baseURL: "http://localhost:8080" });
api.interceptors.request.use((cfg) => {
  const t = getToken();
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

const URGENCY = {
  CRITICAL: { bg: "rgba(239,68,68,0.08)",  border: "rgba(239,68,68,0.2)",  text: "#f87171",  badge: "rgba(239,68,68,0.15)"  },
  HIGH:     { bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.2)", text: "#fbbf24",  badge: "rgba(251,191,36,0.15)" },
  MEDIUM:   { bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.2)", text: "#60a5fa",  badge: "rgba(96,165,250,0.15)" },
  LOW:      { bg: "rgba(34,197,94,0.06)",  border: "rgba(34,197,94,0.15)", text: "#4ade80",  badge: "rgba(34,197,94,0.12)"  },
};

const DAY_COLOR = { CRITICAL: "#f87171", HIGH: "#fbbf24", MEDIUM: "#60a5fa", LOW: "#4ade80" };

function CriticalPartCard({ part }) {
  const s = URGENCY[part.urgency] || URGENCY.MEDIUM;
  return (
    <div style={{
      background: s.bg, border: `1px solid ${s.border}`,
      borderRadius: 10, padding: "14px 16px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{part.name}</div>
        <span style={{
          fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10,
          background: s.badge, color: s.text,
        }}>{part.urgency}</span>
      </div>
      <div style={{ display: "flex", gap: 16 }}>
        <div>
          <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 2 }}>Current Stock</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: s.text }}>{part.currentStock}</div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 2 }}>Days Until Stockout</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: s.text }}>{part.daysUntilStockout}d</div>
        </div>
      </div>
    </div>
  );
}

function DayTimeline({ days }) {
  return (
    <div style={{ background: "#13161f", border: "1px solid #1e2433", borderRadius: 10, padding: "16px 18px" }}>
      <div style={{ fontSize: 11, color: "#60a5fa", fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>
        7-Day Risk Timeline
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 120, marginBottom: 12 }}>
        {days?.map((d, i) => {
          const heights = { CRITICAL: 100, HIGH: 75, MEDIUM: 50, LOW: 25 };
          const h = heights[d.riskLevel] || 50;
          const color = DAY_COLOR[d.riskLevel] || "#60a5fa";
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{
                width: "100%", height: h, borderRadius: "4px 4px 0 0",
                background: color, opacity: 0.8,
                transition: "height 0.4s ease",
              }} />
              <div style={{ fontSize: 10, color: "#6b7280" }}>D{d.day}</div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {days?.map((d, i) => (
          <div key={i} style={{
            display: "flex", gap: 10, alignItems: "center",
            padding: "6px 10px", borderRadius: 6,
            background: "rgba(255,255,255,0.02)",
          }}>
            <span style={{
              fontSize: 10, fontWeight: 700, minWidth: 40,
              color: DAY_COLOR[d.riskLevel] || "#60a5fa",
            }}>{d.label}</span>
            <span style={{
              fontSize: 10, padding: "1px 6px", borderRadius: 8, fontWeight: 600,
              background: `${DAY_COLOR[d.riskLevel]}22`,
              color: DAY_COLOR[d.riskLevel] || "#60a5fa",
            }}>{d.riskLevel}</span>
            <span style={{ fontSize: 11, color: "#6b7280" }}>{d.note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ForecastResult({ data }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Critical Parts */}
      {data.criticalParts?.length > 0 && (
        <div style={{ background: "#13161f", border: "1px solid #1e2433", borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 11, color: "#f87171", fontWeight: 700, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            ⚠ Parts Running Out
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
            {data.criticalParts.map((p, i) => <CriticalPartCard key={i} part={p} />)}
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Reorder Suggestions */}
        <div style={{ background: "#13161f", border: "1px solid #1e2433", borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 11, color: "#fbbf24", fontWeight: 700, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            📦 Reorder Suggestions
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {data.reorderSuggestions?.map((r, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                padding: "10px 12px", background: "rgba(251,191,36,0.05)",
                border: "1px solid rgba(251,191,36,0.12)", borderRadius: 8,
              }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", marginBottom: 3 }}>{r.partName}</div>
                  <div style={{ fontSize: 11, color: "#6b7280" }}>{r.reason}</div>
                </div>
                <div style={{
                  flexShrink: 0, fontSize: 14, fontWeight: 700, color: "#fbbf24",
                  background: "rgba(251,191,36,0.1)", padding: "4px 10px", borderRadius: 6,
                }}>+{r.suggestedQuantity}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 7-Day Timeline */}
        <DayTimeline days={data.dailyRisk} />
      </div>

      {/* Priority Actions */}
      <div style={{ background: "#13161f", border: "1px solid #1e2433", borderRadius: 10, padding: "16px 18px" }}>
        <div style={{ fontSize: 11, color: "#4ade80", fontWeight: 700, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          ✦ Priority Action List
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {data.priorityActions?.map((a, i) => (
            <div key={i} style={{
              display: "flex", gap: 12, alignItems: "center",
              padding: "10px 14px", background: "rgba(34,197,94,0.04)",
              border: "1px solid rgba(34,197,94,0.1)", borderRadius: 8,
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                background: "rgba(34,197,94,0.15)", color: "#4ade80",
                fontSize: 11, fontWeight: 700, display: "flex",
                alignItems: "center", justifyContent: "center",
              }}>{a.priority}</div>
              <div style={{ flex: 1, fontSize: 13, color: "#e2e8f0" }}>{a.action}</div>
              <span style={{
                fontSize: 10, padding: "3px 10px", borderRadius: 10, flexShrink: 0,
                background: "rgba(96,165,250,0.1)", color: "#60a5fa", fontWeight: 600,
              }}>{a.deadline}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ForecastingPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchForecast = async () => {
    setLoading(true);
    setError("");
    setData(null);
    try {
      const res = await api.get("/api/ai/forecasting");
      const clean = res.data.result.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      if (parsed.error) throw new Error(parsed.error);
      setData(parsed);
    } catch (e) {
      setError("Forecast failed: " + (e.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: 920 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#e2e8f0", margin: 0 }}>📈 Forecasting</h2>
            <p style={{ fontSize: 13, color: "#6b7280", marginTop: 6 }}>
              LLaMA 3 predicts stock levels and procurement needs for next 7 days
            </p>
          </div>
          <button onClick={fetchForecast} disabled={loading} style={{
            padding: "10px 24px", borderRadius: 8,
            background: loading ? "#1a2e1a" : "#16a34a",
            border: "none", color: "white", fontSize: 13,
            fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
          }}>
            {loading ? "⏳ Forecasting..." : "▶ Run Forecast"}
          </button>
        </div>

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)", border: "1px solid #f87171",
            borderRadius: 8, padding: "12px 16px", color: "#f87171",
            fontSize: 13, marginBottom: 16,
          }}>{error}</div>
        )}

        {loading && (
          <div style={{ background: "#13161f", border: "1px solid #1e2433", borderRadius: 10, padding: 32 }}>
            {[100, 100, 60, 100, 80].map((w, i) => (
              <div key={i} style={{
                height: 14, background: "#1e2433", borderRadius: 4,
                marginBottom: 12, width: `${w}%`,
                animation: "pulse 1.5s ease-in-out infinite",
                animationDelay: `${i * 0.1}s`,
              }} />
            ))}
            <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
          </div>
        )}

        {data && !loading && <ForecastResult data={data} />}

        {!data && !loading && !error && (
          <div style={{
            background: "#13161f", border: "1px dashed #1e2433",
            borderRadius: 10, padding: 48, textAlign: "center",
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
            <div style={{ fontSize: 14, color: "#4b5563" }}>Click "Run Forecast" to get 7-day inventory predictions</div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}