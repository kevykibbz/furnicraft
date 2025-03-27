require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/furnicraft",{
        serverSelectionTimeoutMS: 5000, 
        socketTimeoutMS: 45000, 
        family: 4,
      }
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1); // Exit process on failure
  }
};

module.exports = connectDB;
