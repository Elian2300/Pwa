import StatCard from "./StatCard";
import styles from "../styles";





export default function ReportesDashboard() {
  const ventasMes = [3200, 4100, 2800, 5600, 4900, 6200];
  const meses = ["Oct", "Nov", "Dic", "Ene", "Feb", "Mar"];
  const maxV = Math.max(...ventasMes);

  return (
    <div>
      <div style={styles.statsRow}>
        <StatCard label="Ingresos (Mar)" value="$6,200" icon="📊" />
        <StatCard label="Crecimiento" value="+26%" icon="📈" accent="#10b981" />
        <StatCard label="Meta mensual" value="80%" icon="🎯" />
      </div>

      <div style={styles.tableCard}>
        <h3 style={styles.sectionTitle}>Ventas últimos 6 meses</h3>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 160, padding: "0 8px" }}>
          {ventasMes.map((v, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 11, color: "#64748b" }}>${(v / 1000).toFixed(1)}k</span>
              <div style={{ width: "100%", height: `${(v / maxV) * 120}px`, background: i === ventasMes.length - 1 ? "linear-gradient(180deg,#6366f1,#8b5cf6)" : "linear-gradient(180deg,#1e293b,#334155)", borderRadius: "6px 6px 0 0", transition: "height .6s ease" }} />
              <span style={{ fontSize: 11, color: "#94a3b8" }}>{meses[i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.tableCard}>
        <h3 style={styles.sectionTitle}>Resumen mensual</h3>
        <table style={styles.table}>
          <thead><tr>{["Mes", "Ventas", "Pedidos", "Clientes"].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
          <tbody>
            {meses.map((m, i) => (
              <tr key={m} style={styles.tr}>
                <td style={styles.td}>{m}</td>
                <td style={{ ...styles.td, color: "#10b981", fontWeight: 700 }}>${ventasMes[i].toLocaleString()}</td>
                <td style={styles.td}>{Math.round(ventasMes[i] / 400)}</td>
                <td style={styles.td}>{Math.round(ventasMes[i] / 1000) + 2}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}