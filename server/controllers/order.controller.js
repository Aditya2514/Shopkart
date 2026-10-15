const mongoose = require("mongoose");
const crypto = require("crypto");
const Order = require("../models/order.model");
const Customer = require("../models/customer.model");
const Product = require("../models/product.model");
const razorpay = require("../config/razorpay");

const createPaymentOrder = async (req, res) => {
  const { shippingAddress } = req.body;

  if (
    !shippingAddress ||
    !shippingAddress.fullName ||
    !shippingAddress.phone ||
    !shippingAddress.addressLine1 ||
    !shippingAddress.city ||
    !shippingAddress.state ||
    !shippingAddress.pincode
  ) {
    return res.status(400).json({
      success: false,
      message: "All shipping address fields are required",
    });
  }

  const phoneStr = String(shippingAddress.phone).trim();
  const pincodeStr = String(shippingAddress.pincode).trim();

  if (!/^\d{10}$/.test(phoneStr)) {
    return res.status(400).json({
      success: false,
      message: "Phone number must be exactly 10 digits",
    });
  }

  if (!/^\d{6}$/.test(pincodeStr)) {
    return res.status(400).json({
      success: false,
      message: "Pincode must be exactly 6 digits",
    });
  }

  try {
    const customer = await Customer.findById(req.user._id);
    if (!customer.cart || customer.cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    let calculatedTotal = 0;
    const orderItems = [];

    for (const cartItem of customer.cart) {
      const product = await Product.findById(cartItem.product);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: "One or more products in your cart are no longer available",
        });
      }

      if (cartItem.quantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, requested: ${cartItem.quantity}`,
        });
      }

      calculatedTotal += product.price * cartItem.quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: cartItem.quantity,
        image: product.image,
      });
    }

    const order = new Order({
      user: customer._id,
      items: orderItems,
      shippingAddress: {
        fullName: shippingAddress.fullName.trim(),
        phone: phoneStr,
        addressLine1: shippingAddress.addressLine1.trim(),
        city: shippingAddress.city.trim(),
        state: shippingAddress.state.trim(),
        pincode: pincodeStr,
      },
      totalAmount: calculatedTotal,
      paymentStatus: "PENDING",
      status: "PENDING_PAYMENT",
    });

    await order.save();

    const amountInPaise = Math.round(calculatedTotal * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: order._id.toString(),
    });

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.status(200).json({
      success: true,
      shopKartOrderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID,
      order,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const verifyPayment = async (req, res) => {
  const {
    shopKartOrderId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  if (!shopKartOrderId || !razorpay_payment_id) {
    return res.status(400).json({
      success: false,
      message: "Missing payment verification parameters",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(shopKartOrderId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid ShopKart order ID",
    });
  }

  try {
    const order = await Order.findById(shopKartOrderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not own this order",
      });
    }

    const orderIdToVerify = order.razorpayOrderId || razorpay_order_id;
    const body = orderIdToVerify + "|" + razorpay_payment_id;
    const secret = process.env.RAZORPAY_KEY_SECRET || "shopkart_test_secret_key_12345";

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      order.paymentStatus = "FAILED";
      await order.save();
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    order.paymentStatus = "PAID";
    order.status = "PLACED";
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    await order.save();

    const customer = await Customer.findById(req.user._id);
    customer.cart = [];
    await customer.save();

    res.status(200).json({
      success: true,
      message: "Payment verified and order placed",
      order,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
      status: { $ne: "PENDING_PAYMENT" },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getOrderById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid order ID",
    });
  }

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not own this order",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid order ID" });
  }

  const allowedStatuses = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status value",
    });
  }

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
};
