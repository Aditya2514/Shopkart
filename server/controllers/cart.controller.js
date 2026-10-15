const mongoose = require("mongoose");
const Customer = require("../models/customer.model");
const Product = require("../models/product.model");

const addToCart = async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ success: false, message: "Invalid product ID" });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const customer = await Customer.findById(req.user._id);
    const existingItem = customer.cart.find(
      (item) => item.product.toString() === productId
    );

    const targetQuantity = existingItem ? existingItem.quantity + 1 : 1;

    if (targetQuantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: "Cannot add more units than available in stock",
      });
    }

    if (existingItem) {
      existingItem.quantity = targetQuantity;
    } else {
      customer.cart.push({ product: productId, quantity: 1 });
    }

    await customer.save();
    await customer.populate({
      path: "cart.product",
      select: "name price image stock category description",
    });

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart: customer.cart,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getCart = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user._id).populate({
      path: "cart.product",
      select: "name price image stock category description",
    });

    customer.cart = customer.cart.filter((item) => item.product !== null);

    res.status(200).json({
      success: true,
      cart: customer.cart,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateCartQuantity = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ success: false, message: "Invalid product ID" });
  }

  if (
    typeof quantity !== "number" ||
    isNaN(quantity) ||
    quantity < 1 ||
    !Number.isInteger(quantity)
  ) {
    return res.status(400).json({
      success: false,
      message: "Quantity must be an integer of at least 1",
    });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const customer = await Customer.findById(req.user._id);
    const cartItem = customer.cart.find(
      (item) => item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({ success: false, message: "Product not in cart" });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: "Requested quantity exceeds available stock",
      });
    }

    cartItem.quantity = quantity;
    await customer.save();
    await customer.populate({
      path: "cart.product",
      select: "name price image stock category description",
    });

    res.status(200).json({
      success: true,
      message: "Cart updated",
      cart: customer.cart,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const removeFromCart = async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ success: false, message: "Invalid product ID" });
  }

  try {
    const customer = await Customer.findById(req.user._id);
    customer.cart = customer.cart.filter(
      (item) => item.product.toString() !== productId
    );

    await customer.save();
    await customer.populate({
      path: "cart.product",
      select: "name price image stock category description",
    });

    res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart: customer.cart,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart,
};
