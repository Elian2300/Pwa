import StatCard from "./StatCard";
import styles from "../styles";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRef } from "react";

const API = "https://pwa-2-3ucw.onrender.com";
const OFFLINE_QUEUE = "offline_products";

export default function ProductosDashboard() {
  const [products, setProducts] = useState([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [editId, setEditId] = useState(null);
  const [toast, setToast] = useState(null);

  // 🔥 BLOQUEO GLOBAL
  const sincronizandoRef = useRef(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

 const obtenerProductos = async () => {
  try {
    const res = await axios.get(`${API}/products`);

    const serverData = res.data;
    const cached = JSON.parse(localStorage.getItem("products")) || [];

    // 🔥 conservar offline
    const offline = cached.filter(p => p.offline);

    const finalData = [...serverData, ...offline];

    setProducts(finalData);
    localStorage.setItem("products", JSON.stringify(finalData));

  } catch {
    const cached = localStorage.getItem("products");
    if (cached) setProducts(JSON.parse(cached));
  }
};

  // 🔥 SIN DUPLICADOS
  const sincronizarOffline = async () => {
   if (sincronizandoRef.current) return;
sincronizandoRef.current = true;

    let queue = JSON.parse(localStorage.getItem(OFFLINE_QUEUE)) || [];

    if (queue.length === 0) {
     if (sincronizandoRef.current) return;
sincronizandoRef.current = true;
      return;
    }

    showToast("📡 Sincronizando...");

    const pendientes = [];

    for (const product of queue) {
      try {
        await axios.post(`${API}/products`, product);
      } catch (error) {
        console.error("Error:", error.message);
        pendientes.push(product);
      }
    }

    if (pendientes.length > 0) {
  // ❌ NO borrar nada si falló algo
  localStorage.setItem(OFFLINE_QUEUE, JSON.stringify(pendientes));
  showToast("⚠️ Algunos productos no se sincronizaron");
} else {
  // ✅ SOLO aquí limpiar
  localStorage.removeItem(OFFLINE_QUEUE);

  const cached = JSON.parse(localStorage.getItem("products")) || [];
  const filtrados = cached.filter(p => !p.offline);

  localStorage.setItem("products", JSON.stringify(filtrados));

  showToast("✅ Todo sincronizado");
}
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

      const queue = JSON.parse(localStorage.getItem(OFFLINE_QUEUE)) || [];
      queue.push(nuevo);
      localStorage.setItem(OFFLINE_QUEUE, JSON.stringify(queue));

      const cached = JSON.parse(localStorage.getItem("products")) || [];

      cached.push({
        _id: Date.now(),
        ...nuevo,
        offline: true
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
    } catch {
      showToast("❌ No se pudo eliminar");
    }
  };

  const editarProducto = (p) => {
    setNombre(p.nombre);
    setPrecio(p.precio);
    setEditId(p._id);
    showToast("✏️ Editando: " + p.nombre);
  };

  const resetForm = () => {
    setNombre("");
    setPrecio("");
    setEditId(null);
  };

  useEffect(() => {
    obtenerProductos();

    // 🔥 SOLO cuando vuelve internet
    window.addEventListener("online", sincronizarOffline);

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
        <h3 style={styles.sectionTitle}>
          {editId ? "Editar producto" : "Agregar producto"}
        </h3>

        <div style={styles.formRow}>
          <input
            style={styles.input}
            placeholder="Nombre del producto"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="Precio"
            type="number"
            value={precio}
            onChange={e => setPrecio(e.target.value)}
          />

          <button style={styles.btnPrimary} onClick={guardarProducto}>
            {editId ? "Actualizar" : "Agregar"}
          </button>

          {editId && (
            <button style={styles.btnGhost} onClick={resetForm}>
              Cancelar
            </button>
          )}
        </div>
      </div>

      <div style={styles.productGrid}>
        {products.map(p => (
          <div key={p._id} style={styles.productCard}>
            <div style={styles.productIcon}>📦</div>
            <h3 style={styles.productName}>{p.nombre}</h3>
            <p style={styles.productPrice}>
              ${Number(p.precio).toLocaleString()}
            </p>

            <div style={styles.cardActions}>
              <button style={styles.btnSm} onClick={() => editarProducto(p)}>
                Editar
              </button>

              <button
                style={{ ...styles.btnSm, ...styles.btnDanger }}
                onClick={() => eliminarProducto(p._id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}