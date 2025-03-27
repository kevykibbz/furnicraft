const express = require("express");
const Product = require("../models/Product");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.json([]);

    const products = await Product.find({
      name: { $regex: query, $options: "i" },
    })
      .select("name _id images")
      .limit(8);

    res.json(products);
  } catch (error) {
    console.error("Error fetching search results:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
