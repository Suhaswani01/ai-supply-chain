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

const HEALTH_COLOR = {
  Excellent: { bg: "#0a2e1a", border: "#1a5c34", text: "#4ade80" },
  Good:      { bg: "#0a2214", border: "#14532d", text: "#86efac" },
  Fair:      { bg: "#2a1f00", border: "#78350f", text: "#fbbf24" },
  Critical:  { bg: "#2a0a0a", border: "#7f1d1d", text: "#f87171" },
};

function ScoreRing({ score, color }) {
  const r = 36, cx = 44, cy = 44;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div style={{ position: "relative", width: 88, height: 88, flexShrink: 0 }}>
      <svg width={88} height={88} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e2433" strokeWidth={7} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={7}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <div style={{
        position: "absolute", top: 0, left: 0, width: 88, height: 88,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ fontSize: 20, fontWeight: 700, color, lineHeight: 1 }}>{score}</div>
        <div style={{ fontSize: 10, color: "#6b7280" }}>/100</div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{
      background: "#0d1117", border: "1px solid #1e2433", borderRadius: 10,
      padding: "14px 16px", flex: 1, minWidth: 90,
    }}>
      <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: color || "#e2e8f0" }}>{value}</div>
    </div>
  );
}

function InsightsResult({ data }) {
  const colors = HEALTH_COLOR[data.healthLabel] || HEALTH_COLOR.Fair;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Score + Stats row */}
      <div style={{
        background: colors.bg, border: `1px solid ${colors.border}`,
        borderRadius: 12, padding: "20px 24px",
        display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <ScoreRing score={data.healthScore} color={colors.text} />
          <span style={{ fontSize: 12, fontWeight: 600, color: colors.text }}>{data.healthLabel}</span>
        </div>
        <div style={{ flex: 1, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <StatCard label="Total Parts" value={data.totalParts} />
          <StatCard label="Low Stock" value={data.lowStock} color="#fbbf24" />
          <StatCard label="Out of Stock" value={data.outOfStock} color="#f87171" />
        </div>
      </div>

      {/* Summary */}
      <div style={{
        background: "#13161f", border: "1px solid #1e2433",
        borderRadius: 10, padding: "14px 18px",
      }}>
        <div style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Summary</div>
        <div style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.8 }}>{data.summary}</div>
      </div>

      {/* Issues + Recommendations */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: "#13161f", border: "1px solid #1e2433", borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 11, color: "#f87171", fontWeight: 700, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            ⚠ Critical Issues
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {data.criticalIssues?.map((issue, i) => (
              <div key={i} style={{
                background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)",
                borderRadius: 8, padding: "10px 12px", display: "flex", gap: 10,
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: "50%", background: "rgba(239,68,68,0.15)",
                  color: "#f87171", fontSize: 10, fontWeight: 700, display: "flex",
                  alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>{i + 1}</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#f87171", marginBottom: 2 }}>{issue.title}</div>
                  <div style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.5 }}>{issue.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#13161f", border: "1px solid #1e2433", borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 11, color: "#4ade80", fontWeight: 700, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            ✦ Recommendations
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {data.recommendations?.map((rec, i) => (
              <div key={i} style={{
                background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.12)",
                borderRadius: 8, padding: "10px 12px", display: "flex", gap: 10,
              }}>
                <span style={{ color: "#4ade80", fontSize: 14, flexShrink: 0 }}>✓</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", marginBottom: 2 }}>{rec.title}</div>
                  <div style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.5 }}>{rec.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AiInsightsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchInsights = async () => {
    setLoading(true);
    setError("");
    setData(null);
    try {
      const res = await api.get("/api/ai/ai-insights");
      const raw = res.data.result;
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      if (parsed.error) throw new Error(parsed.error);
      setData(parsed);
    } catch (e) {
      setError("Analysis failed: " + (e.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: 920 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#e2e8f0", margin: 0 }}>🤖 AI Insights</h2>
            <p style={{ fontSize: 13, color: "#6b7280", marginTop: 6 }}>
              LLaMA 3 analyzes your inventory and provides structured insights
            </p>
          </div>
          <button onClick={fetchInsights} disabled={loading} style={{
            padding: "10px 24px", borderRadius: 8,
            background: loading ? "#1e3a5f" : "#2563eb",
            border: "none", color: "white", fontSize: 13,
            fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
          }}>
            {loading ? "⏳ Analyzing..." : "▶ Run AI Analysis"}
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

        {data && !loading && <InsightsResult data={data} />}

        {!data && !loading && !error && (
          <div style={{
            background: "#13161f", border: "1px dashed #1e2433",
            borderRadius: 10, padding: 48, textAlign: "center",
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🧠</div>
            <div style={{ fontSize: 14, color: "#4b5563" }}>Click "Run AI Analysis" to get structured insights</div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}