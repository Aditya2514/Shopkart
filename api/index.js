const connectDB = require("../server/config/db");
const app = require("../server/index");

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    console.error("Database connection failed:", err);
    return res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: err.message,
    });
  }

  return app(req, res);
};
