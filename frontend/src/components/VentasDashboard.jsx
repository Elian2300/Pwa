import StatCard from "../components/StatCard";
import styles from "../styles";


const VENTAS_DATA = [
  { id: 1, fecha: "2025-03-01", monto: 1200, cliente: "Tienda Norte" },
  { id: 2, fecha: "2025-03-05", monto: 850, cliente: "Súper Rápido" },
  { id: 3, fecha: "2025-03-10", monto: 3400, cliente: "MegaMart" },
  { id: 4, fecha: "2025-03-15", monto: 620, cliente: "Bodega Express" },
  { id: 5, fecha: "2025-03-20", monto: 4100, cliente: "Bodega Aurrera" },
  { id: 6, fecha: "2025-03-22", monto: 2300, cliente: "Walmart" },
  { id: 7, fecha: "2025-03-25", monto: 1500, cliente: "Costco" },
  { id: 8, fecha: "2025-03-28", monto: 2900, cliente: "Sam's Club" },

];

export default function VentasDashboard() {
  const total = VENTAS_DATA.reduce((s, v) => s + v.monto, 0);
  const max = Math.max(...VENTAS_DATA.map(v => v.monto));

  return (
    <div>
      <div style={styles.statsRow}>
        <StatCard label="Total ventas" value={VENTAS_DATA.length} icon="💳" />
        <StatCard label="Ingresos totales" value={`$${total.toLocaleString()}`} icon="📈" />
        <StatCard label="Venta máx." value={`$${max.toLocaleString()}`} icon="🏆" />
      </div>

      <div style={styles.tableCard}>
        <h3 style={styles.sectionTitle}>Historial de ventas</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              {["#", "Fecha", "Cliente", "Monto"].map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {VENTAS_DATA.map(v => (
              <tr key={v.id} style={styles.tr}>
                <td style={styles.td}>{v.id}</td>
                <td style={styles.td}>{v.fecha}</td>
                <td style={styles.td}>{v.cliente}</td>
                <td style={{ ...styles.td, color: "#10b981", fontWeight: 700 }}>${v.monto.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Simple bar chart */}
      <div style={styles.tableCard}>
        <h3 style={styles.sectionTitle}>Ventas por cliente</h3>
        {VENTAS_DATA.map(v => (
          <div key={v.id} style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 13, color: "#94a3b8" }}>
              <span>{v.cliente}</span><span style={{ color: "#e2e8f0" }}>${v.monto.toLocaleString()}</span>
            </div>
            <div style={{ background: "#1e293b", borderRadius: 6, height: 10, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(v.monto / max) * 100}%`, background: "linear-gradient(90deg,#6366f1,#8b5cf6)", borderRadius: 6, transition: "width .6s ease" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}