import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  region: {
    type: String,
    enum: ["North", "South", "East", "West", "Northeast", "Central", "Other"],
  },
  tier: {
    type: String,
    enum: ["Metro", "Tier1", "Tier2", "Tier3"],
    default: "Tier3",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  popularity: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster searches
locationSchema.index({ state: 1 });
locationSchema.index({ tier: 1 });
locationSchema.index({ isActive: 1 });

export default mongoose.model("Location", locationSchema);
