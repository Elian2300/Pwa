const express = require("express");
const router = express.Router();
const Product = require("../models/product");

// Crear
router.post("/", async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.json(product);
});

// Leer
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Actualizar
router.put("/:id", async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(product);
});

// Eliminar
router.delete("/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Producto eliminado" });
});

module.exports = router;