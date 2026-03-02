import Location from "../models/Location.js";

// Get all active locations (with optional filters)
export const getAllLocations = async (req, res) => {
  try {
    const { tier, region, search, limit = 100 } = req.query;

    const filter = { isActive: true };

    if (tier) filter.tier = tier;
    if (region) filter.region = region;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { displayName: { $regex: search, $options: "i" } },
        { state: { $regex: search, $options: "i" } },
      ];
    }

    const locations = await Location.find(filter)
      .sort({ tier: 1, popularity: -1, displayName: 1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: locations.length,
      locations,
    });
  } catch (error) {
    console.error("Get all locations error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch locations",
    });
  }
};

// Search locations with autocomplete
export const searchLocations = async (req, res) => {
  try {
    const { q = "", limit = 10 } = req.query;

    if (!q || q.trim().length < 1) {
      const popular = await Location.find({ isActive: true })
        .sort({ tier: 1, popularity: -1 })
        .limit(parseInt(limit));

      return res.status(200).json({
        success: true,
        locations: popular,
      });
    }

    const locations = await Location.find({
      isActive: true,
      $or: [
        { name: { $regex: q, $options: "i" } },
        { displayName: { $regex: q, $options: "i" } },
        { state: { $regex: q, $options: "i" } },
      ],
    })
      .sort({ tier: 1, popularity: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      locations,
    });
  } catch (error) {
    console.error("Search locations error:", error);
    res.status(500).json({
      success: false,
      message: "Search failed",
    });
  }
};

// Get location by ID
export const getLocationById = async (req, res) => {
  try {
    const { id } = req.params;

    const location = await Location.findById(id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    res.status(200).json({
      success: true,
      location,
    });
  } catch (error) {
    console.error("Get location error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch location",
    });
  }
};

// Create new location (Admin only)
export const createLocation = async (req, res) => {
  try {
    const { name, displayName, state, latitude, longitude, region, tier } =
      req.body;

    // Validation
    if (!name || !displayName || !state) {
      return res.status(400).json({
        success: false,
        message: "Name, displayName, and state are required",
      });
    }

    // Check if location already exists
    const existing = await Location.findOne({
      name: name.toLowerCase().trim(),
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Location already exists",
      });
    }

    const location = new Location({
      name: name.toLowerCase().trim(),
      displayName,
      state,
      latitude: latitude || null,
      longitude: longitude || null,
      region: region || "Central",
      tier: tier || "Tier1",
    });

    await location.save();

    res.status(201).json({
      success: true,
      message: "Location created successfully",
      location,
    });
  } catch (error) {
    console.error("Create location error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create location",
    });
  }
};

// Update location (Admin only)
export const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Don't allow changing the name
    delete updates.name;

    const location = await Location.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Location updated successfully",
      location,
    });
  } catch (error) {
    console.error("Update location error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update location",
    });
  }
};

// Toggle location active status (Admin only)
export const toggleLocation = async (req, res) => {
  try {
    const { id } = req.params;

    const location = await Location.findById(id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    location.isActive = !location.isActive;
    await location.save();

    res.status(200).json({
      success: true,
      message: `Location ${location.isActive ? "activated" : "deactivated"}`,
      location,
    });
  } catch (error) {
    console.error("Toggle location error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle location",
    });
  }
};

// Delete location (Admin only)
export const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;

    const location = await Location.findByIdAndDelete(id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Location deleted successfully",
    });
  } catch (error) {
    console.error("Delete location error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete location",
    });
  }
};

// Get locations by state
export const getLocationsByState = async (req, res) => {
  try {
    const { state } = req.params;

    const locations = await Location.find({
      state: { $regex: state, $options: "i" },
      isActive: true,
    }).sort({ popularity: -1, displayName: 1 });

    res.status(200).json({
      success: true,
      count: locations.length,
      locations,
    });
  } catch (error) {
    console.error("Get locations by state error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch locations",
    });
  }
};

// Get all unique states
export const getAllStates = async (req, res) => {
  try {
    const states = await Location.distinct("state", { isActive: true });

    res.status(200).json({
      success: true,
      states: states.sort(),
    });
  } catch (error) {
    console.error("Get all states error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch states",
    });
  }
};

// Increment location popularity (when an ad is viewed/posted)
export const incrementPopularity = async (req, res) => {
  try {
    const { id } = req.params;

    const location = await Location.findByIdAndUpdate(
      id,
      { $inc: { popularity: 1 } },
      { new: true }
    );

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    res.status(200).json({
      success: true,
      location,
    });
  } catch (error) {
    console.error("Increment popularity error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update popularity",
    });
  }
};
// Get locations near user coordinates (proximity search)
export const getNearbyLocations = async (req, res) => {
  try {
    const { latitude, longitude, maxDistance = 200, limit = 5 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    // Find all active locations with coordinates
    const locations = await Location.find({
      isActive: true,
      latitude: { $exists: true, $ne: null },
      longitude: { $exists: true, $ne: null },
    });

    // Calculate distance using Haversine formula
    const locationsWithDistance = locations
      .map((loc) => {
        const lat1 = parseFloat(latitude);
        const lon1 = parseFloat(longitude);
        const lat2 = loc.latitude;
        const lon2 = loc.longitude;

        const R = 6371; // Earth's radius in kilometers
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;

        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return {
          ...loc.toObject(),
          distance: parseFloat(distance.toFixed(2)),
        };
      })
      .filter((loc) => loc.distance <= parseInt(maxDistance))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, parseInt(limit));

    res.status(200).json({
      success: true,
      count: locationsWithDistance.length,
      locations: locationsWithDistance,
    });
  } catch (error) {
    console.error("Get nearby locations error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch nearby locations",
    });
  }
};