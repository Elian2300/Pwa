import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://pwa-2-3ucw.onrender.com";
const OFFLINE_QUEUE = "offline_products";

/* ─── Dummy data for non-products dashboards ─── */
const VENTAS_DATA = [
  { id: 1, fecha: "2025-03-01", monto: 1200, cliente: "Tienda Norte" },
  { id: 2, fecha: "2025-03-05", monto: 850, cliente: "Súper Rápido" },
  { id: 3, fecha: "2025-03-10", monto: 3400, cliente: "MegaMart" },
  { id: 4, fecha: "2025-03-15", monto: 620, cliente: "Bodega Express" },
  { id: 5, fecha: "2025-03-20", monto: 4100, cliente: "Bodega Aurrera" },
  
];

const PEDIDOS_DATA = [
  { id: 1, producto: "Laptop", cantidad: 2, estado: "Enviado" },
  { id: 2, producto: "Mouse", cantidad: 10, estado: "Pendiente" },
  { id: 3, producto: "Monitor", cantidad: 1, estado: "Entregado" },
  { id: 4, producto: "Teclado", cantidad: 5, estado: "Cancelado" },
];

const CLIENTES_DATA = [
  { id: 1, nombre: "Tienda Norte", email: "norte@mail.com", pedidos: 12 },
  { id: 2, nombre: "Súper Rápido", email: "rapido@mail.com", pedidos: 7 },
  { id: 3, nombre: "MegaMart", email: "mega@mail.com", pedidos: 34 },
  { id: 4, nombre: "Bodega Express", email: "bodega@mail.com", pedidos: 5 },
];

/* ─── Status badge colors ─── */
const estadoColor = { Enviado: "#3b82f6", Pendiente: "#f59e0b", Entregado: "#10b981", Cancelado: "#ef4444" };

/* ════════════════════════════════════════════
   DASHBOARD: PRODUCTOS
════════════════════════════════════════════ */
function ProductosDashboard() {
  const [products, setProducts] = useState([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [editId, setEditId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const obtenerProductos = async () => {
    try {
      const res = await axios.get(`${API}/products`);
      setProducts(res.data);
      localStorage.setItem("products", JSON.stringify(res.data));
    } catch {
      const cached = localStorage.getItem("products");
      if (cached) setProducts(JSON.parse(cached));
    }
  };

 const sincronizarOffline = async () => {
  const queue = JSON.parse(localStorage.getItem(OFFLINE_QUEUE)) || [];

  if (queue.length === 0) return;

  showToast("📡 Sincronizando...");

  const pendientes = [];

  for (const product of queue) {
    try {
      await axios.post(`${API}/products`, product);
    } catch {
      pendientes.push(product);
    }
  }

  localStorage.setItem(OFFLINE_QUEUE, JSON.stringify(pendientes));

  if (pendientes.length === 0) {
    showToast("✅ Todo sincronizado");
  } else {
    showToast("⚠️ Algunos fallaron");
  }

  // 🔥 LIMPIAR COLA OFFLINE
localStorage.removeItem(OFFLINE_QUEUE);

// 🔥 BORRAR SOLO LOS OFFLINE VISUALES
const cached = JSON.parse(localStorage.getItem("products")) || [];
const filtrados = cached.filter(p => !p.offline);

localStorage.setItem("products", JSON.stringify(filtrados));

// 🔥 TRAER DATOS REALES DEL SERVIDOR
await obtenerProductos();
};

 const guardarProducto = async () => {
  const nuevo = { nombre, precio: Number(precio) };

  if (!nombre || !precio) {
    showToast("⚠️ Llena todos los campos");
    return;
  }

  try {
    await axios.post(`${API}/products`, nuevo);

    showToast("✅ Producto creado");
    resetForm();
    obtenerProductos();

  } catch (error) {
    console.error("❌ Error real:", error.message);

    // 🔴 OFFLINE
    const queue = JSON.parse(localStorage.getItem(OFFLINE_QUEUE)) || [];
    queue.push(nuevo);
    localStorage.setItem(OFFLINE_QUEUE, JSON.stringify(queue));

    const cached = JSON.parse(localStorage.getItem("products")) || [];

    cached.push({
      _id: Date.now(),
      ...nuevo,
      offline: true // 🔥 IMPORTANTE
    });

    localStorage.setItem("products", JSON.stringify(cached));
    setProducts(cached);

    showToast("📡 Guardado offline");
    resetForm();
  }
};

  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Eliminar este producto?")) return;
    try {
      await axios.delete(`${API}/products/${id}`);
      showToast("🗑️ Producto eliminado");
      obtenerProductos();
    } catch { showToast("❌ No se pudo eliminar"); }
  };

  const editarProducto = (p) => {
    setNombre(p.nombre);
    setPrecio(p.precio);
    setEditId(p._id);
    showToast("✏️ Editando: " + p.nombre);
  };

  const resetForm = () => { setNombre(""); setPrecio(""); setEditId(null); };

  // 🔥 CORREGIDO: ahora sí abajo
  useEffect(() => {
    obtenerProductos();

    window.addEventListener("online", sincronizarOffline);

    if (navigator.onLine) {
      sincronizarOffline();
    }

    return () => window.removeEventListener("online", sincronizarOffline);
  }, []);

  const totalValor = products.reduce((s, p) => s + Number(p.precio || 0), 0);

  return (
    <div>
      {toast && <div style={styles.toast}>{toast}</div>}

      <div style={styles.statsRow}>
        <StatCard label="Total productos" value={products.length} icon="📦" />
        <StatCard label="Valor total" value={`$${totalValor.toLocaleString()}`} icon="💰" />
        <StatCard label="Sin stock" value="0" icon="⚠️" />
      </div>

      <div style={styles.formCard}>
        <h3 style={styles.sectionTitle}>{editId ? "Editar producto" : "Agregar producto"}</h3>
        <div style={styles.formRow}>
          <input style={styles.input} placeholder="Nombre del producto" value={nombre} onChange={e => setNombre(e.target.value)} />
          <input style={styles.input} placeholder="Precio" type="number" value={precio} onChange={e => setPrecio(e.target.value)} />
          <button style={styles.btnPrimary} onClick={guardarProducto}>{editId ? "Actualizar" : "Agregar"}</button>
          {editId && <button style={styles.btnGhost} onClick={resetForm}>Cancelar</button>}
        </div>
      </div>

      <div style={styles.productGrid}>
        {products.map(p => (
          <div key={p._id} style={styles.productCard}>
            <div style={styles.productIcon}>📦</div>
            <h3 style={styles.productName}>{p.nombre}</h3>
            <p style={styles.productPrice}>${Number(p.precio).toLocaleString()}</p>
            <div style={styles.cardActions}>
              <button style={styles.btnSm} onClick={() => editarProducto(p)}>Editar</button>
              <button style={{ ...styles.btnSm, ...styles.btnDanger }} onClick={() => eliminarProducto(p._id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   DASHBOARD: VENTAS
════════════════════════════════════════════ */
function VentasDashboard() {
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

/* ════════════════════════════════════════════
   DASHBOARD: PEDIDOS
════════════════════════════════════════════ */
function PedidosDashboard() {
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

/* ════════════════════════════════════════════
   DASHBOARD: CLIENTES
════════════════════════════════════════════ */
function ClientesDashboard() {
  return (
    <div>
      <div style={styles.statsRow}>
        <StatCard label="Total clientes" value={CLIENTES_DATA.length} icon="👥" />
        <StatCard label="Pedidos totales" value={CLIENTES_DATA.reduce((s, c) => s + c.pedidos, 0)} icon="📋" />
        <StatCard label="Nuevos este mes" value="1" icon="🆕" />
      </div>

      <div style={styles.productGrid}>
        {CLIENTES_DATA.map(c => (
          <div key={c.id} style={{ ...styles.productCard, textAlign: "left" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 12 }}>
              {c.nombre[0]}
            </div>
            <h3 style={styles.productName}>{c.nombre}</h3>
            <p style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>{c.email}</p>
            <p style={{ fontSize: 13, color: "#94a3b8" }}>📋 {c.pedidos} pedidos</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   DASHBOARD: REPORTES
════════════════════════════════════════════ */
function ReportesDashboard() {
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

/* ─── Reusable StatCard ─── */
function StatCard({ label, value, icon, accent = "#6366f1" }) {
  return (
    <div style={{ ...styles.statCard, borderTop: `3px solid ${accent}` }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 26, fontWeight: 800, color: "#e2e8f0", letterSpacing: "-0.5px" }}>{value}</p>
    </div>
  );
}

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

/* ─── Styles ─── */
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

export default App;