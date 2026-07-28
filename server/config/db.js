import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || "mongodb+srv://dealdiscover:VNB8nnS5o236E8bz@dealdiscover.cyfkevt.mongodb.net/dealdiscover?retryWrites=true&w=majority";
    const conn = await mongoose.connect(uri);
    console.log(`✓ MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`✗ Database connection failed: ${error.message}`);
    console.error(`  Server will continue running but API routes requiring DB will fail.`);
  }
};
