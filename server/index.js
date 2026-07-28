import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import locationRoutes from "./routes/locations.js";
import adRoutes from "./routes/ads.js";
import feedbackRoutes from "./routes/feedback.js";

// Load .env from server/ directory (works regardless of CWD)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });
// Also try project root .env as fallback
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Security middleware
app.use(helmet());

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many auth attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/", generalLimiter);
app.use("/api/auth", authLimiter);

// Middleware
app.use(cors({
  origin: true, // Allow all origins for Vercel compatibility
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Connect Database
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/ads", adRoutes);
app.use("/api/feedback", feedbackRoutes);

import mongoose from "mongoose";

// Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    success: true, 
    message: "Server is running",
    dbState: mongoose.connection.readyState,
    hasUri: !!(process.env.MONGODB_URI || "fallback"),
    error: global.dbConnectionError
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// Only listen locally (Vercel uses the exported app instead)
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  const server = app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`✗ Port ${PORT} is already in use. Kill the old process:`);
      console.error(`  Run: kill $(lsof -t -i:${PORT})  (Mac/Linux)`);
      console.error(`  Run: taskkill /F /IM node.exe    (Windows)`);
      process.exit(1);
    }
    throw err;
  });
}

// Export the Express API for Vercel Serverless Functions
export default app;
