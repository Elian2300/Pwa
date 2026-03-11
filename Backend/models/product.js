const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  nombre: String,
  precio: Number
});

module.exports = mongoose.model("Product", productSchema);