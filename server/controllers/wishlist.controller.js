const mongoose = require("mongoose");
const Customer = require("../models/customer.model");
const Product = require("../models/product.model");

const addToWishlist = async (req, res) => {
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

    const alreadySaved = customer.wishlist.some(
      (id) => id.toString() === productId
    );

    if (alreadySaved) {
      return res.status(409).json({ success: false, message: "Product already in wishlist" });
    }

    customer.wishlist.push(productId);
    await customer.save();

    res.status(200).json({
      success: true,
      count: customer.wishlist.length,
      message: "Product added to wishlist",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getWishlist = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user._id).populate({
      path: "wishlist",
      select: "name description price category image stock",
    });

    res.status(200).json({
      success: true,
      count: customer.wishlist.length,
      wishlist: customer.wishlist,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const removeFromWishlist = async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ success: false, message: "Invalid product ID" });
  }

  try {
    const customer = await Customer.findById(req.user._id);

    const exists = customer.wishlist.some(
      (id) => id.toString() === productId
    );

    if (!exists) {
      return res.status(404).json({ success: false, message: "Product not in wishlist" });
    }

    customer.wishlist = customer.wishlist.filter(
      (id) => id.toString() !== productId
    );

    await customer.save();

    res.status(200).json({
      success: true,
      count: customer.wishlist.length,
      message: "Product removed from wishlist",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const toggleWishlist = async (req, res) => {
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

    const alreadySaved = customer.wishlist.some(
      (id) => id.toString() === productId
    );

    if (alreadySaved) {
      customer.wishlist = customer.wishlist.filter(
        (id) => id.toString() !== productId
      );
      await customer.save();
      return res.status(200).json({
        success: true,
        saved: false,
        count: customer.wishlist.length,
        message: "Removed from wishlist",
      });
    }

    customer.wishlist.push(productId);
    await customer.save();
    return res.status(200).json({
      success: true,
      saved: true,
      count: customer.wishlist.length,
      message: "Added to wishlist",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { addToWishlist, getWishlist, removeFromWishlist, toggleWishlist };
