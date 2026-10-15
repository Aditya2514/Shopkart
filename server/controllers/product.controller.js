const mongoose = require("mongoose");
const Product = require("../models/product.model");

const createProduct = async (req, res) => {
  const { name, description, price, category, image, stock } = req.body;

  if (!name || !description || price === undefined || !category || !image || stock === undefined) {
    return res.status(400).json({
      success: false,
      message: "All fields (name, description, price, category, image, stock) are required",
    });
  }

  const numericPrice = Number(price);
  if (isNaN(numericPrice) || numericPrice <= 0) {
    return res.status(400).json({
      success: false,
      message: "Price must be a number greater than 0",
    });
  }

  const numericStock = Number(stock);
  if (isNaN(numericStock) || numericStock < 0) {
    return res.status(400).json({
      success: false,
      message: "Stock must be a non-negative number",
    });
  }

  try {
    const product = await Product.create({
      name,
      description,
      price: numericPrice,
      category,
      image,
      stock: numericStock,
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const { search, category, sort } = req.query;
    const filter = {};

    if (search && search.trim()) {
      filter.name = { $regex: search.trim(), $options: "i" };
    }

    if (category && category.trim() && category.trim().toLowerCase() !== "all") {
      filter.category = category.trim();
    }

    let sortOptions = { createdAt: -1 };
    if (sort === "price_asc") {
      sortOptions = { price: 1 };
    } else if (sort === "price_desc") {
      sortOptions = { price: -1 };
    }

    const products = await Product.find(filter).sort(sortOptions);

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID",
    });
  }

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
};
