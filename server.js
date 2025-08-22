// backend/server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
require("colors");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// User Routes
app.use("/api/users", require("./routes/userRoutes"));

// Admin Routes (for protected admin endpoints)
app.use("/api/admin", require("./routes/adminRoutes"));

// Product Routes
app.use("/api/products", require("./routes/productRoutes"));

// Attribute Routes
app.use("/api/attributes", require("./routes/attributeRoutes"));

// Category Routes
app.use("/api/categories", require("./routes/categoryRoutes"));

// Wishlist Routes
app.use("/api/wishlist", require("./routes/wishlistRoutes"));

// Cart Routes (new)
app.use("/api/cart", require("./routes/cartRoutes"));

// Order Routes (new)
app.use("/api/orders", require("./routes/orderRoutes"));

// Payment Routes (new)
app.use("/api/payment", require("./routes/paymentRoutes"));

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`.yellow.bold)
);
