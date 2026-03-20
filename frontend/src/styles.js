

const styles = {
  layout: { display: "flex", minHeight: "100vh", background: "#0a0f1e" },

  sidebar: {
    width: 240, background: "#0d1424", borderRight: "1px solid #1e293b",
    display: "flex", flexDirection: "column", padding: "24px 0", position: "sticky", top: 0, height: "100vh",
  },
  logo: { display: "flex", alignItems: "center", gap: 10, padding: "0 20px 28px", borderBottom: "1px solid #1e293b" },
  logoIcon: { fontSize: 24 },
  logoText: { fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 18, color: "#e2e8f0", letterSpacing: "-0.3px" },

  navLabel: { fontSize: 10, letterSpacing: 2, color: "#334155", padding: "20px 20px 8px", fontFamily: "Syne, sans-serif" },
  navItem: {
    display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "11px 20px",
    background: "none", border: "none", cursor: "pointer", color: "#64748b",
    fontSize: 14, fontFamily: "DM Sans, sans-serif", borderRadius: 0, position: "relative",
    transition: "all .15s ease",
  },
  navItemActive: { color: "#e2e8f0", background: "linear-gradient(90deg,#6366f115,transparent)" },
  navIcon: { fontSize: 16, width: 20, textAlign: "center" },
  navDot: { marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#6366f1" },

  sidebarFooter: { display: "flex", alignItems: "center", gap: 10, padding: "20px", borderTop: "1px solid #1e293b", marginTop: "auto" },
  avatar: {
    width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14,
  },

  main: { flex: 1, display: "flex", flexDirection: "column", overflow: "auto" },
  topbar: {
    padding: "24px 32px", borderBottom: "1px solid #1e293b", background: "#0d1424",
    display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 10,
  },
  pageTitle: { fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 24, color: "#e2e8f0", marginTop: 4, letterSpacing: "-0.5px" },
  onlineIndicator: { display: "flex", alignItems: "center", gap: 6 },
  dot: { width: 8, height: 8, borderRadius: "50%" },

  content: { padding: "32px", flex: 1 },

  statsRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 24 },
  statCard: {
    background: "#0d1424", border: "1px solid #1e293b", borderRadius: 12, padding: "20px",
    transition: "border-color .2s",
  },

  formCard: { background: "#0d1424", border: "1px solid #1e293b", borderRadius: 12, padding: 20, marginBottom: 24 },
  formRow: { display: "flex", gap: 12, flexWrap: "wrap" },
  sectionTitle: { fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 16, color: "#94a3b8" },

  input: {
    flex: 1, minWidth: 180, padding: "10px 14px", background: "#1e293b", border: "1px solid #334155",
    borderRadius: 8, color: "#e2e8f0", fontSize: 14, transition: "all .2s",
  },
  btnPrimary: {
    padding: "10px 20px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none",
    borderRadius: 8, color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 14,
    fontFamily: "DM Sans, sans-serif",
  },
  btnGhost: {
    padding: "10px 20px", background: "transparent", border: "1px solid #334155",
    borderRadius: 8, color: "#94a3b8", fontWeight: 500, cursor: "pointer", fontSize: 14,
    fontFamily: "DM Sans, sans-serif",
  },

  productGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16 },
  productCard: {
    background: "#0d1424", border: "1px solid #1e293b", borderRadius: 12, padding: 20,
    display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
    transition: "border-color .2s, transform .2s",
  },
  productIcon: { fontSize: 32, marginBottom: 12 },
  productName: { fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 6, color: "#e2e8f0" },
  productPrice: { color: "#10b981", fontWeight: 700, fontSize: 18, marginBottom: 14 },
  cardActions: { display: "flex", gap: 8, marginTop: "auto" },
  btnSm: {
    padding: "7px 14px", background: "#1e293b", border: "1px solid #334155",
    borderRadius: 6, color: "#94a3b8", cursor: "pointer", fontSize: 12, fontFamily: "DM Sans, sans-serif",
  },
  btnDanger: { color: "#ef4444", borderColor: "#ef444433" },

  tableCard: { background: "#0d1424", border: "1px solid #1e293b", borderRadius: 12, padding: 24, marginBottom: 20 },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", fontSize: 11, letterSpacing: 1, color: "#475569", padding: "0 12px 14px", textTransform: "uppercase", fontFamily: "Syne, sans-serif" },
  tr: { borderTop: "1px solid #1e293b" },
  td: { padding: "14px 12px", fontSize: 14, color: "#94a3b8" },

  badge: { padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 },

  toast: {
    position: "fixed", bottom: 24, right: 24, background: "#1e293b", border: "1px solid #334155",
    color: "#e2e8f0", padding: "12px 20px", borderRadius: 10, fontSize: 14, zIndex: 1000,
    boxShadow: "0 8px 32px #00000060", animation: "none",
  },
};
export default styles;