import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "https://pwa-2-3ucw.onrender.com";
const OFFLINE_QUEUE = "offline_products";

function App() {

  const [products, setProducts] = useState([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {

    obtenerProductos();

    window.addEventListener("online", sincronizarOffline);

    return () => {
      window.removeEventListener("online", sincronizarOffline);
    };

  }, []);

  const obtenerProductos = async () => {

    try {

      const res = await axios.get(`${API}/products`);

      setProducts(res.data);
      localStorage.setItem("products", JSON.stringify(res.data));

    } catch (error) {

      console.log("Error API, usando cache");

      const cachedProducts = localStorage.getItem("products");

      if (cachedProducts) {
        setProducts(JSON.parse(cachedProducts));
      }

    }

  };

  const sincronizarOffline = async () => {

    const queue = JSON.parse(localStorage.getItem(OFFLINE_QUEUE));

    if (!queue || queue.length === 0) return;

    for (const product of queue) {

      try {

        await axios.post(`${API}/products`, product);

      } catch (error) {

        console.log("Error sincronizando:", error);
        return;

      }

    }

    localStorage.removeItem(OFFLINE_QUEUE);

    obtenerProductos();

  };

  const guardarProducto = async () => {

    const nuevo = {
      nombre,
      precio
    };

    // si no hay internet
    if (!navigator.onLine) {

      const queue = JSON.parse(localStorage.getItem(OFFLINE_QUEUE)) || [];

      queue.push(nuevo);

      localStorage.setItem(OFFLINE_QUEUE, JSON.stringify(queue));

      const cached = JSON.parse(localStorage.getItem("products")) || [];

      cached.push({
        _id: Date.now(),
        ...nuevo
      });

      localStorage.setItem("products", JSON.stringify(cached));

      setProducts(cached);

      resetForm();

      return;
    }

    try {

      if (editId) {

        await axios.put(`${API}/products/${editId}`, nuevo);

      } else {

        await axios.post(`${API}/products`, nuevo);

      }

      resetForm();
      obtenerProductos();

    } catch (error) {

      console.log("Error guardando producto:", error);

    }

  };

  const eliminarProducto = async (id) => {

    try {

      await axios.delete(`${API}/products/${id}`);
      obtenerProductos();

    } catch (error) {

      console.log("Error eliminando producto:", error);

    }

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