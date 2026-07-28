import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✓ MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`✗ Database connection failed: ${error.message}`);
    console.error(`  Server will continue running but API routes requiring DB will fail.`);
  }
};
