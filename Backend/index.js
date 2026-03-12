const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");

const app = express();

app.use("/auth", authRoutes);
app.use(cors());
app.use(express.json());
app.use("/products", productRoutes);

mongoose.connect(
"mongodb+srv://Elian123:ND6U7GIczKO9w2EL@cluster0.ts2ilbe.mongodb.net/americaton"
)
.then(()=>console.log("Mongo conectado"))
.catch(err=>console.log(err));

app.get("/", (req, res) => {
  res.send("API funcionando al puro vergazo");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto", PORT);
});