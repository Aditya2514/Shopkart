const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../models/product.model");

dotenv.config();

const sampleProducts = [
  {
    name: "Noise Cancelling Headphones",
    description: "Wireless over-ear headphones with active noise cancellation, 40-hour battery life, and spatial audio support.",
    price: 4999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    stock: 25,
  },
  {
    name: "Mechanical Keyboard",
    description: "RGB mechanical gaming keyboard with hot-swappable tactile blue switches and aluminum frame.",
    price: 2999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
    stock: 10,
  },
  {
    name: "Ultra-Clear 4K Action Camera",
    description: "Waterproof 4K action camera with dual color screens, EIS stabilization, and 170-degree ultra-wide lens.",
    price: 8499,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80",
    stock: 14,
  },
  {
    name: "Classic Chronograph Wristwatch",
    description: "Minimalist stainless steel chronograph watch with genuine leather strap and sapphire crystal glass.",
    price: 3499,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
    stock: 18,
  },
  {
    name: "Urban Breathable Running Sneakers",
    description: "Lightweight running sneakers with responsive foam cushioning and breathable engineered mesh upper.",
    price: 2499,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    stock: 30,
  },
  {
    name: "Full-Grain Leather Everyday Wallet",
    description: "Slim bi-fold leather wallet with RFID blocking technology and 8 quick-access card slots.",
    price: 1199,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80",
    stock: 45,
  },
  {
    name: "Atomic Habits by James Clear",
    description: "An easy and proven way to build good habits and break bad ones. Transform your daily routines.",
    price: 499,
    category: "Books",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80",
    stock: 60,
  },
  {
    name: "Designing Data-Intensive Applications",
    description: "The big ideas behind reliable, scalable, and maintainable systems by Martin Kleppmann.",
    price: 1899,
    category: "Books",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&auto=format&fit=crop&q=80",
    stock: 22,
  },
  {
    name: "Ceramic Minimalist Pour-Over Coffee Maker",
    description: "Handcrafted matte ceramic dripper set with borosilicate glass server for artisanal coffee brewing.",
    price: 1699,
    category: "Home",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80",
    stock: 15,
  },
  {
    name: "Aromatherapy Ultrasonic Diffuser",
    description: "Quiet 500ml ultrasonic essential oil diffuser with ambient warm LED lighting and auto shut-off.",
    price: 1299,
    category: "Home",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80",
    stock: 20,
  },
  {
    name: "Organic Raw Mountain Honey (500g)",
    description: "100% pure, unprocessed multi-floral forest honey harvested from Himalayan foothill apiaries.",
    price: 450,
    category: "Groceries",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80",
    stock: 50,
  },
  {
    name: "Artisan Roasted Arabica Coffee Beans (250g)",
    description: "Single-origin medium roast Arabica coffee beans with notes of dark chocolate and roasted hazelnut.",
    price: 599,
    category: "Groceries",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80",
    stock: 40,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.dbUrl);
    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);
    console.log("Seeded products successfully");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
