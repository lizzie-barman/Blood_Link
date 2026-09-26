const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bloodlink";
  try {
    const conn = await mongoose.connect(uri);
    console.log(`[MongoDB] Connected successfully to ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB] Connection notice: ${error.message}. (Server running in offline DB mode)`);
    // Graceful fallback without hard process exit so routes and server remain testable
    return null;
  }
};

module.exports = connectDB;