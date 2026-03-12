router.get("/", async (req, res) => {

  try {

    const products = await Product.find();
    res.json(products);

  } catch (error) {

    console.log("ERROR PRODUCTOS:", error);

    res.status(500).json({
      message: "Error al obtener productos",
      error: error.message
    });

  }

});