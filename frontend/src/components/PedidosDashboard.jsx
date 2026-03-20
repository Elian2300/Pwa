import StatCard from "./StatCard";
import styles from "../styles";
const estadoColor = {
  Enviado: "#3b82f6",
  Pendiente: "#f59e0b",
  Entregado: "#10b981",
  Cancelado: "#ef4444"
};

const PEDIDOS_DATA = [
  { id: 1, producto: "Laptop", cantidad: 2, estado: "Enviado" },
  { id: 2, producto: "Mouse", cantidad: 10, estado: "Pendiente" },
  { id: 3, producto: "Monitor", cantidad: 1, estado: "Entregado" },
  { id: 4, producto: "Teclado", cantidad: 5, estado: "Cancelado" },
  { id: 5, producto: "Impresora", cantidad: 3, estado: "Enviado" },
  { id: 6, producto: "Webcam", cantidad: 4, estado: "Pendiente" },
  { id: 7, producto: "Auriculares", cantidad: 6, estado: "Entregado" },
];



export default function PedidosDashboard() {
  const counts = PEDIDOS_DATA.reduce((acc, p) => { acc[p.estado] = (acc[p.estado] || 0) + 1; return acc; }, {});

  return (
    <div>
      <div style={styles.statsRow}>
        {Object.entries(counts).map(([estado, n]) => (
          <StatCard key={estado} label={estado} value={n} icon={estado === "Enviado" ? "🚚" : estado === "Pendiente" ? "⏳" : estado === "Entregado" ? "✅" : "❌"} accent={estadoColor[estado]} />
        ))}
      </div>

      <div style={styles.tableCard}>
        <h3 style={styles.sectionTitle}>Lista de pedidos</h3>
        <table style={styles.table}>
          <thead>
            <tr>{["#", "Producto", "Cantidad", "Estado"].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {PEDIDOS_DATA.map(p => (
              <tr key={p.id} style={styles.tr}>
                <td style={styles.td}>{p.id}</td>
                <td style={styles.td}>{p.producto}</td>
                <td style={styles.td}>{p.cantidad}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, background: estadoColor[p.estado] + "22", color: estadoColor[p.estado], border: `1px solid ${estadoColor[p.estado]}44` }}>
                    {p.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}