const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const productRoutes = require("./routes/products");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use("/uploads", express.static("uploads"));

mongoose
  .connect("mongodb://localhost:27017/mydashboard", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"));

app.use("/api/products", productRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
