if (process.env.NODE_ENV !== "production") {
  const dns = require("node:dns");
  dns.setServers(["1.1.1.1"]);
}

const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");

const customerRoutes = require("./routes/customer.routes");
const productRoutes = require("./routes/product.routes");
const wishlistRoutes = require("./routes/wishlist.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");

const app = express();
const Port = process.env.PORT || 8085;

app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Root health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Direct route mounting (local development)
app.use("/customers", customerRoutes);
app.use("/products", productRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

// Prefixed /api route mounting (Vercel serverless routing)
app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

async function startServer() {
  try {
    await connectDB();

    app.listen(Port, () => {
      console.log(`Server Started on port: ${Port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;
