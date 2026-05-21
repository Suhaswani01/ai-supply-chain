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

const LEVEL_STYLE = {
  LOW:    { bg: "rgba(34,197,94,0.06)",  border: "rgba(34,197,94,0.2)",  text: "#4ade80",  badge: "rgba(34,197,94,0.15)"  },
  MEDIUM: { bg: "rgba(251,191,36,0.06)", border: "rgba(251,191,36,0.2)", text: "#fbbf24",  badge: "rgba(251,191,36,0.15)" },
  HIGH:   { bg: "rgba(239,68,68,0.06)",  border: "rgba(239,68,68,0.2)",  text: "#f87171",  badge: "rgba(239,68,68,0.15)"  },
};

function OverallScoreCard({ score, level }) {
  const s = LEVEL_STYLE[level] || LEVEL_STYLE.MEDIUM;
  const pct = (score / 10) * 100;
  return (
    <div style={{
      background: s.bg, border: `1px solid ${s.border}`,
      borderRadius: 12, padding: "20px 24px",
      display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap",
    }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <div style={{ fontSize: 48, fontWeight: 700, color: s.text, lineHeight: 1 }}>{score}</div>
        <div style={{ fontSize: 12, color: "#6b7280" }}>out of 10</div>
        <div style={{
          fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 20,
          background: s.badge, color: s.text, textTransform: "uppercase", letterSpacing: "0.08em",
        }}>{level} RISK</div>
      </div>
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 10 }}>Overall Supply Chain Risk</div>
        <div style={{ background: "#1e2433", borderRadius: 6, height: 10, overflow: "hidden" }}>
          <div style={{
            width: `${pct}%`, height: "100%", borderRadius: 6,
            background: s.text, transition: "width 0.6s ease",
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          <span style={{ fontSize: 10, color: "#4ade80" }}>Low Risk (0)</span>
          <span style={{ fontSize: 10, color: "#f87171" }}>High Risk (10)</span>
        </div>
      </div>
    </div>
  );
}

function SupplierCard({ supplier }) {
  const s = LEVEL_STYLE[supplier.level] || LEVEL_STYLE.MEDIUM;
  const pct = (supplier.score / 10) * 100;
  return (
    <div style={{
      background: "#13161f", border: "1px solid #1e2433",
      borderRadius: 10, padding: "14px 16px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{supplier.name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: s.text }}>{supplier.score}</span>
          <span style={{
            fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 12,
            background: s.badge, color: s.text,
          }}>{supplier.level}</span>
        </div>
      </div>
      <div style={{ background: "#1e2433", borderRadius: 4, height: 6, marginBottom: 8 }}>
        <div style={{ width: `${pct}%`, height: "100%", borderRadius: 4, background: s.text }} />
      </div>
      <div style={{ fontSize: 11, color: "#6b7280" }}>
        Rating: {supplier.rating} &nbsp;·&nbsp; {supplier.reason}
      </div>
    </div>
  );
}

function RiskFactorRow({ factor }) {
  const s = LEVEL_STYLE[factor.severity] || LEVEL_STYLE.MEDIUM;
  return (
    <div style={{
      display: "flex", gap: 12, alignItems: "flex-start",
      padding: "12px 0", borderBottom: "1px solid #1e2433",
    }}>
      <div style={{
        width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
        background: s.badge, color: s.text, fontSize: 11, fontWeight: 700,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>{factor.rank}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{factor.title}</div>
          <span style={{
            fontSize: 10, padding: "2px 8px", borderRadius: 10,
            background: s.badge, color: s.text, fontWeight: 600,
          }}>{factor.severity}</span>
        </div>
        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 3, lineHeight: 1.5 }}>{factor.description}</div>
      </div>
    </div>
  );
}

function RiskResult({ data }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <OverallScoreCard score={data.overallScore} level={data.overallLevel} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Suppliers */}
        <div style={{ background: "#13161f", border: "1px solid #1e2433", borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 11, color: "#60a5fa", fontWeight: 700, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Supplier Risk Scores
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {data.suppliers?.map((s, i) => <SupplierCard key={i} supplier={s} />)}
          </div>
        </div>

        {/* Risk Factors */}
        <div style={{ background: "#13161f", border: "1px solid #1e2433", borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 11, color: "#f87171", fontWeight: 700, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Top Risk Factors
          </div>
          <div>
            {data.riskFactors?.map((f, i) => <RiskFactorRow key={i} factor={f} />)}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div style={{ background: "#13161f", border: "1px solid #1e2433", borderRadius: 10, padding: "16px 18px" }}>
        <div style={{ fontSize: 11, color: "#4ade80", fontWeight: 700, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          ✦ Mitigation Recommendations
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {data.recommendations?.map((rec, i) => (
            <div key={i} style={{
              background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.12)",
              borderRadius: 8, padding: "12px 14px",
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", marginBottom: 4 }}>{rec.title}</div>
              <div style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.5 }}>{rec.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function RiskScorerPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRisk = async () => {
    setLoading(true);
    setError("");
    setData(null);
    try {
      const res = await api.get("/api/ai/risk-scorer");
      const clean = res.data.result.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      if (parsed.error) throw new Error(parsed.error);
      setData(parsed);
    } catch (e) {
      setError("Risk analysis failed: " + (e.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: 920 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#e2e8f0", margin: 0 }}>⚠ Risk Scorer</h2>
            <p style={{ fontSize: 13, color: "#6b7280", marginTop: 6 }}>
              LLaMA 3 evaluates supplier and supply chain risk levels
            </p>
          </div>
          <button onClick={fetchRisk} disabled={loading} style={{
            padding: "10px 24px", borderRadius: 8,
            background: loading ? "#3b1c1c" : "#dc2626",
            border: "none", color: "white", fontSize: 13,
            fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
          }}>
            {loading ? "⏳ Scoring..." : "▶ Run Risk Analysis"}
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

        {data && !loading && <RiskResult data={data} />}

        {!data && !loading && !error && (
          <div style={{
            background: "#13161f", border: "1px dashed #1e2433",
            borderRadius: 10, padding: 48, textAlign: "center",
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🎯</div>
            <div style={{ fontSize: 14, color: "#4b5563" }}>Click "Run Risk Analysis" to evaluate supply chain risks</div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}