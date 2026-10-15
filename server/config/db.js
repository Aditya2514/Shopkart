const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const dbUrl = process.env.dbUrl;
  if (!dbUrl) {
    throw new Error("process.env.dbUrl is not defined in environment variables");
  }

  try {
    const db = await mongoose.connect(dbUrl);
    isConnected = db.connections[0].readyState === 1;
    console.log("DB Connection OK");
    return db;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
};

module.exports = connectDB;
