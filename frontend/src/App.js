import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "https://TU-BACKEND.onrender.com";

function App() {

  const [products, setProducts] = useState([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = () => {

    if (navigator.onLine) {

      axios.get(`${API}/products`)
        .then(res => {

          setProducts(res.data);
          localStorage.setItem("products", JSON.stringify(res.data));

        })
        .catch(() => {

          const cachedProducts = localStorage.getItem("products");

          if (cachedProducts) {
            setProducts(JSON.parse(cachedProducts));
          }

        });

    } else {

      const cachedProducts = localStorage.getItem("products");

      if (cachedProducts) {
        setProducts(JSON.parse(cachedProducts));
      }

    }

  };

  const guardarProducto = () => {

    if (!navigator.onLine) {

      const cached = JSON.parse(localStorage.getItem("products")) || [];

      const nuevo = {
        _id: Date.now(),
        nombre,
        precio
      };

      cached.push(nuevo);

      localStorage.setItem("products", JSON.stringify(cached));

      setProducts(cached);

      resetForm();

      return;
    }

    if (editId) {

      axios.put(`${API}/products/${editId}`, {
        nombre,
        precio
      }).then(() => {

        resetForm();
        obtenerProductos();

      });

    } else {

      axios.post(`${API}/products`, {
        nombre,
        precio
      }).then(() => {

        resetForm();
        obtenerProductos();

      });

    }

  };

  const eliminarProducto = (id) => {

    axios.delete(`${API}/products/${id}`)
      .then(() => obtenerProductos());

  };

  const editarProducto = (product) => {

    setNombre(product.nombre);
    setPrecio(product.precio);
    setEditId(product._id);

  };

  const resetForm = () => {

    setNombre("");
    setPrecio("");
    setEditId(null);

  };

  return (

    <div className="dashboard">

      <aside className="sidebar">
        <h2>🛒 Americaton</h2>

        <ul>
          <li>📊 Dashboard</li>
          <li>📦 Productos</li>
          <li>🧾 Pedidos</li>
          <li>👤 Usuarios</li>
        </ul>
      </aside>

      <main className="main">

        <header className="topbar">
          <h1>Panel de administración</h1>
        </header>

        <div className="stats">

          <div className="card-stat">
            <h3>Total productos</h3>
            <p>{products.length}</p>
          </div>

          <div className="card-stat">
            <h3>Ventas</h3>
            <p>$0</p>
          </div>

          <div className="card-stat">
            <h3>Pedidos</h3>
            <p>0</p>
          </div>

        </div>

        <div className="form-container">

          <input
            placeholder="Nombre del producto"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />

          <input
            placeholder="Precio"
            type="number"
            value={precio}
            onChange={e => setPrecio(e.target.value)}
          />

          <button onClick={guardarProducto}>
            {editId ? "Actualizar" : "Agregar"}
          </button>

        </div>

        <div className="products">

          {products.map(product => (

            <div className="card" key={product._id}>

              <h3>{product.nombre}</h3>
              <p>${product.precio}</p>

              <div className="buttons">

                <button onClick={() => editarProducto(product)}>
                  Editar
                </button>

                <button onClick={() => eliminarProducto(product._id)}>
                  Eliminar
                </button>

              </div>

            </div>

          ))}

        </div>

      </main>

    </div>

  );

}

export default App;