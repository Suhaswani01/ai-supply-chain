import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, loading } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div style={{
      display: "flex", justifyContent: "center",
      alignItems: "center", height: "100vh",
      backgroundColor: "#f0f2f5"
    }}>
      <div style={{
        background: "white", padding: "40px",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        width: "360px"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "24px" }}>Login</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label>Email</label>
            <input type="email" value={email}
              onChange={(e) => setEmail(e.target.value)} required
              style={{ display: "block", width: "100%", padding: "8px",
                marginTop: "4px", border: "1px solid #ddd",
                borderRadius: "4px", boxSizing: "border-box" }}
            />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label>Password</label>
            <input type="password" value={password}
              onChange={(e) => setPassword(e.target.value)} required
              style={{ display: "block", width: "100%", padding: "8px",
                marginTop: "4px", border: "1px solid #ddd",
                borderRadius: "4px", boxSizing: "border-box" }}
            />
          </div>
          {error && <div style={{ color: "red", marginBottom: "12px",
            fontSize: "14px" }}>{error}</div>}
          <button type="submit" disabled={loading}
            style={{ width: "100%", padding: "10px",
              backgroundColor: "#1890ff", color: "white",
              border: "none", borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "16px" }}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}