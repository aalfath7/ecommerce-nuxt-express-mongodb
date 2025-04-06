const express = require("express");
const Product = require("../models/Product");
const fs = require("fs");

const router = express.Router();

// Create product
router.post("/", async (req, res) => {
  const { name, price } = req.body;
  let image = "";

  if (req.files?.image) {
    const img = req.files.image;
    const filename = Date.now() + "_" + img.name;
    img.mv(`uploads/${filename}`);
    image = filename;
  }

  const product = await Product.create({ name, price, image });
  res.json(product);
});

router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limitParam = req.query.limit || "5";
  const search = req.query.search || "";

  const query = { name: { $regex: search, $options: "i" } };

  let products;
  let total = await Product.countDocuments(query);

  if (limitParam === "all") {
    // Ambil semua data tanpa limit
    products = await Product.find(query);
  } else {
    const limit = parseInt(limitParam);
    products = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(limit);
  }

  res.json({ data: products, total });
});

// Get product by ID
router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
});

// Update product
router.put("/:id", async (req, res) => {
  const { name, price } = req.body;
  let updateData = { name, price };

  if (req.files?.image) {
    const img = req.files.image;
    const filename = Date.now() + "_" + img.name;
    img.mv(`uploads/${filename}`);
    updateData.image = filename;
  }

  const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
  });
  res.json(product);
});

// Delete product
router.delete("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product.image) {
    fs.unlink(`uploads/${product.image}`, () => {});
  }
  await product.deleteOne();
  res.json({ success: true });
});

// Delete all product
router.delete("/", async (req, res) => {
  try {
    const products = await Product.find({});
    for (const p of products) {
      if (p.image) fs.unlink(`uploads/${p.image}`, () => {});
    }
    await Product.deleteMany({});
    res.json({ message: "All products deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete products" });
  }
});

module.exports = router;
