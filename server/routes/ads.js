import express from "express";
import {
    createAd,
    getAds,
    getMyAds,
    getAdById,
    updateAd,
    deleteAd,
    getAdCities,
} from "../controllers/adController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public endpoints (static paths MUST come before /:id)
router.get("/", getAds);               // Feed — filter by city/keyword, paginated
router.get("/cities", getAdCities);     // Get cities with ad counts

// Protected endpoints (static paths MUST come before /:id)
router.post("/", authMiddleware, createAd);        // Create ad
router.get("/user/mine", authMiddleware, getMyAds); // My ads
router.put("/:id", authMiddleware, updateAd);       // Update ad
router.delete("/:id", authMiddleware, deleteAd);    // Soft delete ad

// Dynamic :id route LAST — catches everything not matched above
router.get("/:id", getAdById);          // Single ad with view tracking

export default router;
