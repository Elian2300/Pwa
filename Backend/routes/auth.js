const express = require("express");
const router = express.Router();
const User = require("../models/User");

// REGISTRO
router.post("/register", async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    const existe = await User.findOne({ email });

    if (existe) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const user = new User({ nombre, email, password });

    await user.save();

    res.json({ message: "Usuario registrado" });

  } catch (error) {
    res.status(500).json({ message: "Error en registro" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(400).json({ message: "Credenciales incorrectas" });
    }

    res.json({ user });

  } catch (error) {
    res.status(500).json({ message: "Error en login" });
  }
});

module.exports = router;