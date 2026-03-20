import { useState } from "react";
import StatCard from "./StatCard";
import styles from "../styles";

const CLIENTES_INICIALES = [
  { id: 1, nombre: "Tienda Norte", email: "norte@mail.com", pedidos: 12 },
  { id: 2, nombre: "Súper Rápido", email: "rapido@mail.com", pedidos: 7 },
];

export default function ClientesDashboard() {

  const [clientes, setClientes] = useState(CLIENTES_INICIALES);

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    pedidos: ""
  });

  // manejar inputs
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // agregar cliente
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.nombre || !form.email || !form.pedidos) {
      alert("Completa todos los campos wey");
      return;
    }

    const nuevoCliente = {
      id: Date.now(),
      nombre: form.nombre,
      email: form.email,
      pedidos: Number(form.pedidos)
    };

    setClientes([...clientes, nuevoCliente]);

    // limpiar formulario
    setForm({
      nombre: "",
      email: "",
      pedidos: ""
    });
  };

  return (
    <div>

      {/* 📌 STATS */}
      <div style={styles.statsRow}>
        <StatCard label="Total clientes" value={clientes.length} icon="👥" />
        <StatCard
          label="Pedidos totales"
          value={clientes.reduce((s, c) => s + c.pedidos, 0)}
          icon="📋"
        />
        <StatCard label="Nuevos este mes" value="1" icon="🆕" />
      </div>

      {/* 📌 FORMULARIO */}
      <div style={styles.formCard}>
        <h3 style={styles.sectionTitle}>Agregar cliente</h3>

        <form onSubmit={handleSubmit} style={styles.formRow}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="email"
            name="email"
            placeholder="Correo"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="number"
            name="pedidos"
            placeholder="Pedidos"
            value={form.pedidos}
            onChange={handleChange}
            style={styles.input}
          />

          <button type="submit" style={styles.btnPrimary}>
            Agregar
          </button>
        </form>
      </div>

      {/* 📌 LISTA */}
      <div style={styles.productGrid}>
        {clientes.map(c => (
          <div key={c.id} style={{ ...styles.productCard, textAlign: "left" }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              marginBottom: 12
            }}>
              {c.nombre[0]}
            </div>

            <h3 style={styles.productName}>{c.nombre}</h3>
            <p style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>
              {c.email}
            </p>
            <p style={{ fontSize: 13, color: "#94a3b8" }}>
              📋 {c.pedidos} pedidos
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}