const Razorpay = require("razorpay");
const dotenv = require("dotenv");
dotenv.config();

const key_id = process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder";
const key_secret = process.env.RAZORPAY_KEY_SECRET || "dummy_secret_placeholder";

const razorpay = new Razorpay({
  key_id,
  key_secret,
});

module.exports = razorpay;
