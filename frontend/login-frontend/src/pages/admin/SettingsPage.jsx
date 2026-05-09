import AdminLayout from "../../components/admin/Layout";

const S = {
  title: { fontSize: 20, fontWeight: 500, color: "white", marginBottom: 4 },
  sub: { fontSize: 13, color: "#ffffff60", marginBottom: 20 },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  card: { background: "#1a1f2e", border: "0.5px solid #ffffff15", borderRadius: 12, padding: 18 },
  cardTitle: { fontSize: 14, fontWeight: 500, color: "white", marginBottom: 16 },
  label: { fontSize: 11, color: "#ffffff60", marginBottom: 4, display: "block" },
  input: { width: "100%", background: "#0f1117", border: "0.5px solid #ffffff30", borderRadius: 6, padding: "7px 10px", color: "white", fontSize: 12, boxSizing: "border-box", marginBottom: 12 },
  btn: { background: "#3b82f6", color: "white", border: "none", padding: "8px 0", borderRadius: 6, fontSize: 12, cursor: "pointer", width: "100%", marginTop: 4 },
};

export default function SettingsPage() {
  return (
    <AdminLayout>
      <div style={S.title}>Settings</div>
      <div style={S.sub}>System configuration</div>
      <div style={S.grid}>
        <div style={S.card}>
          <div style={S.cardTitle}>Kafka Configuration</div>
          <label style={S.label}>Bootstrap Servers</label>
          <input style={S.input} defaultValue="localhost:9092" />
          <label style={S.label}>Topic Name</label>
          <input style={S.input} defaultValue="supply-chain-events" />
          <label style={S.label}>Group ID</label>
          <input style={S.input} defaultValue="supply-chain-group" />
          <button style={S.btn}>Save Kafka Config</button>
        </div>
        <div style={S.card}>
          <div style={S.cardTitle}>AI Model Configuration</div>
          <label style={S.label}>Model Type</label>
          <select style={S.input}>
            <option>gpt-4o</option>
            <option>gpt-3.5-turbo</option>
            <option>Linear Regression</option>
            <option>ARIMA</option>
          </select>
          <label style={S.label}>Training Period (days)</label>
          <input style={S.input} defaultValue="90" />
          <label style={S.label}>Forecast Horizon (days)</label>
          <input style={S.input} defaultValue="30" />
          <button style={S.btn}>Save AI Config</button>
        </div>
      </div>
    </AdminLayout>
  );
}