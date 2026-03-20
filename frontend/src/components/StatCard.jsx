import styles from "../styles";

export default function StatCard({ label, value, icon, accent = "#6366f1" }) {
  return (
    <div style={{ ...styles.statCard, borderTop: `3px solid ${accent}` }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 26, fontWeight: 800, color: "#e2e8f0", letterSpacing: "-0.5px" }}>{value}</p>
    </div>
  );
}