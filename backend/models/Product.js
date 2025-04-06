const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    image: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
