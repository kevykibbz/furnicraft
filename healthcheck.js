require("dotenv").config();
const mongoose = require("mongoose");

async function checkDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    // Verify connection is established
    await mongoose.connection.db.admin().ping();
    console.log("Database connection successful");
    await mongoose.disconnect();
    return true;
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    return false;
  }
}

// Run check with proper error handling
checkDatabase()
  .then((success) => process.exit(success ? 0 : 1))
  .catch((err) => {
    console.error("Healthcheck error:", err);
    process.exit(1);
});
