import ProductosDashboard from "./components/ProductosDashboard";
import VentasDashboard from "./components/VentasDashboard";
import PedidosDashboard from "./components/PedidosDashboard";
import ClientesDashboard from "./components/ClientesDashboard";
import ReportesDashboard from "./components/ReportesDashboard";
import { useState } from "react";
import styles from "./styles";






/* ════════════════════════════════════════════
   MAIN APP
════════════════════════════════════════════ */
const NAV = [
  { id: "productos", label: "Productos", icon: "📦" },
  { id: "ventas", label: "Ventas", icon: "💳" },
  { id: "pedidos", label: "Pedidos", icon: "🚚" },
  { id: "clientes", label: "Clientes", icon: "👥" },
  { id: "reportes", label: "Reportes", icon: "📊" },
];

function App() {
  const [active, setActive] = useState("productos");

  const renderDashboard = () => {
    switch (active) {
      case "ventas": return <VentasDashboard />;
      case "pedidos": return <PedidosDashboard />;
      case "clientes": return <ClientesDashboard />;
      case "reportes": return <ReportesDashboard />;
      default: return <ProductosDashboard />;
    }
  };

  const current = NAV.find(n => n.id === active);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0f1e; font-family: 'DM Sans', sans-serif; color: #e2e8f0; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #0a0f1e; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 3px; }
        input:focus { outline: none; border-color: #6366f1 !important; box-shadow: 0 0 0 3px #6366f130 !important; }
      `}</style>

      <div style={styles.layout}>
        {/* SIDEBAR */}
        <aside style={styles.sidebar}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>🛒</span>
            <span style={styles.logoText}>Americaton</span>
          </div>

          <nav style={{ flex: 1 }}>
            <p style={styles.navLabel}>MENÚ</p>
            {NAV.map(item => (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                style={{ ...styles.navItem, ...(active === item.id ? styles.navItemActive : {}) }}
              >
                <span style={styles.navIcon}>{item.icon}</span>
                <span>{item.label}</span>
                {active === item.id && <span style={styles.navDot} />}
              </button>
            ))}
          </nav>

          <div style={styles.sidebarFooter}>
            <div style={styles.avatar}>A</div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600 }}>Admin</p>
              <p style={{ fontSize: 11, color: "#475569" }}>admin@americaton.mx</p>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main style={styles.main}>
          <header style={styles.topbar}>
            <div>
              <p style={{ fontSize: 12, color: "#475569", letterSpacing: 1, textTransform: "uppercase", fontFamily: "Syne, sans-serif" }}>Panel de administración</p>
              <h1 style={styles.pageTitle}>{current?.icon} {current?.label}</h1>
            </div>
            <div style={styles.onlineIndicator}>
              <div style={{ ...styles.dot, background: navigator.onLine ? "#10b981" : "#ef4444" }} />
              <span style={{ fontSize: 12, color: "#64748b" }}>{navigator.onLine ? "En línea" : "Sin conexión"}</span>
            </div>
          </header>

          <div style={styles.content}>
            {renderDashboard()}
          </div>
        </main>
      </div>
    </>
  );
}



export default App;