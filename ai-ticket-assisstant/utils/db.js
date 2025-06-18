import mongoose from "mongoose";
import "dotenv/config";

const db = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully...");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
  }
};

export default db;
