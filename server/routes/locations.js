import express from "express";
import {
  getAllLocations,
  searchLocations,
  getLocationById,
  createLocation,
  updateLocation,
  toggleLocation,
  deleteLocation,
  getLocationsByState,
  getAllStates,
  incrementPopularity,
  getNearbyLocations,
} from "../controllers/locationController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public endpoints (no auth required)
router.get("/search", searchLocations); // Search with autocomplete
router.get("/nearby", getNearbyLocations); // Get locations near coordinates
router.get("/all", getAllLocations); // Get all locations with filters
router.get("/states", getAllStates); // Get all states
router.get("/state/:state", getLocationsByState); // Get locations by state
router.get("/:id", getLocationById); // Get single location

// Admin endpoints (requires authentication - can add admin check later)
router.post("/", authMiddleware, createLocation); // Create location
router.put("/:id", authMiddleware, updateLocation); // Update location
router.patch("/:id/toggle", authMiddleware, toggleLocation); // Toggle active status
router.delete("/:id", authMiddleware, deleteLocation); // Delete location

// Utility endpoint
router.post("/:id/popularity", incrementPopularity); // Track popularity

export default router;
