 import mongoose, { connect } from "mongoose";
import { MONGODB_URI } from "./env.js";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to Database successfully");
  } catch (error) {
    console.log("❌ Failed to connect to the database", error);
    process.exit(1);
  }
};

export default connectDB;
