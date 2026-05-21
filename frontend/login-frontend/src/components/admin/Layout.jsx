import Sidebar from "../Sidebar";
import Navbar from "../Navbar";

const S = {
  container: { display: "flex", minHeight: "100vh", background: "#ffffff" },
  main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  content: { flex: 1, overflowY: "auto", padding:18 },
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