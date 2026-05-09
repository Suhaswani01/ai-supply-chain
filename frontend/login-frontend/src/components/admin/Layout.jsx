import Sidebar from "../Sidebar";
import Navbar from "../Navbar";

const S = {
  container: { display: "flex", minHeight: "100vh", background: "#0f1117" },
  main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  content: { flex: 1, overflowY: "auto", padding: 24 },
};

export default function AdminLayout({ children }) {
  return (
    <div style={S.container}>
      <Sidebar />
      <div style={S.main}>
        <Navbar />
        <div style={S.content}>
          {children}
        </div>
      </div>
    </div>
  );
}