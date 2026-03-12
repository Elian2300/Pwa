const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

// rutas API
app.use("/auth", authRoutes);
app.use("/products", productRoutes);

// ruta de prueba
app.get("/", (req, res) => {
  res.send("API Americaton funcionando 🚀");
});

// conexión Mongo
const mongoURL =
  process.env.MONGO_URL ||
  "mongodb+srv://Elian123:ND6U7GIczKO9w2EL@cluster0.ts2ilbe.mongodb.net/americaton";

mongoose
  .connect(mongoURL)
  .then(() => console.log("Mongo conectado"))
  .catch((err) => console.log("Error conexión Mongo:", err));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto", PORT);
});