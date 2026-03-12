const express = require("express");
const router = express.Router();
const Product = require("../models/product");

// Crear producto
router.post("/", async (req, res) => {
  try {

    const product = new Product({
      nombre: req.body.nombre,
      precio: Number(req.body.precio)
    });

    await product.save();
    res.json(product);

  } catch (error) {

    console.log("ERROR AL GUARDAR:", error);

    res.status(500).json({
      message: "Error interno del servidor"
    });

  }
});

// Leer productos
router.get("/", async (req, res) => {
  try {

    const products = await Product.find();
    res.json(products);

  } catch (error) {

    console.log("ERROR PRODUCTOS:", error);

    res.status(500).json({
      message: "Error al obtener productos"
    });

  }
});

// Actualizar
router.put("/:id", async (req, res) => {
  try {

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        nombre: req.body.nombre,
        precio: Number(req.body.precio)
      },
      { new: true }
    );

    res.json(product);

  } catch (error) {

    res.status(500).json({
      message: "Error al actualizar producto"
    });

  }
});

// Eliminar
router.delete("/:id", async (req, res) => {
  try {

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      message: "Producto eliminado"
    });

  } catch (error) {

    res.status(500).json({
      message: "Error al eliminar producto"
    });

  }
});

module.exports = router;