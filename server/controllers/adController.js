import Ad from "../models/Ad.js";

// @desc    Create a new ad
// @route   POST /api/ads
// @access  Private
export const createAd = async (req, res) => {
    try {
        const { title, description, imageUrl, keywords, city, discount, businessName, validUntil } = req.body;

        // Validation
        if (!title || !keywords || keywords.length === 0 || !city || !businessName) {
            return res.status(400).json({
                success: false,
                message: "Title, keywords, city, and business name are required",
            });
        }

        const ad = new Ad({
            title,
            description: description || title,
            imageUrl: imageUrl || "",
            keywords: keywords.map((k) => k.toLowerCase().trim()),
            city: city.trim(),
            discount: discount || "SPECIAL OFFER",
            businessName: businessName.trim(),
            validUntil: validUntil ? new Date(validUntil) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            userId: req.user.id,
        });

        const savedAd = await ad.save();

        res.status(201).json({
            success: true,
            message: "Ad created successfully",
            ad: savedAd.toJSON(),
        });
    } catch (error) {
        console.error("Create ad error:", error);
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ success: false, message: messages.join(", ") });
        }
        res.status(500).json({ success: false, message: "Failed to create ad" });
    }
};

// @desc    Get all active ads (public feed)
// @route   GET /api/ads
// @access  Public
export const getAds = async (req, res) => {
    try {
        const { city, keyword, page = 1, limit = 20 } = req.query;

        const filter = {
            isActive: true,
            validUntil: { $gte: new Date() },
        };

        if (city) {
            filter.city = { $regex: city, $options: "i" };
        }

        if (keyword) {
            filter.keywords = { $in: keyword.split(",").map((k) => k.trim().toLowerCase()) };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [ads, total] = await Promise.all([
            Ad.find(filter)
                .populate("userId", "name email")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Ad.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            count: ads.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            ads: ads.map((ad) => ad.toJSON()),
        });
    } catch (error) {
        console.error("Get ads error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch ads" });
    }
};

// @desc    Get ads by current user
// @route   GET /api/ads/mine
// @access  Private
export const getMyAds = async (req, res) => {
    try {
        const ads = await Ad.find({ userId: req.user.id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: ads.length,
            ads: ads.map((ad) => ad.toJSON()),
        });
    } catch (error) {
        console.error("Get my ads error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch your ads" });
    }
};

// @desc    Get a single ad by ID
// @route   GET /api/ads/:id
// @access  Public
export const getAdById = async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id).populate("userId", "name email");

        if (!ad) {
            return res.status(404).json({ success: false, message: "Ad not found" });
        }

        // Increment view count
        ad.views += 1;
        await ad.save();

        res.status(200).json({
            success: true,
            ad: ad.toJSON(),
        });
    } catch (error) {
        console.error("Get ad error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch ad" });
    }
};

// @desc    Update an ad
// @route   PUT /api/ads/:id
// @access  Private (owner only)
export const updateAd = async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id);

        if (!ad) {
            return res.status(404).json({ success: false, message: "Ad not found" });
        }

        if (ad.userId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Not authorized to update this ad" });
        }

        const allowedUpdates = ["title", "description", "imageUrl", "keywords", "city", "discount", "businessName", "validUntil"];
        const updates = {};

        for (const key of allowedUpdates) {
            if (req.body[key] !== undefined) {
                updates[key] = key === "keywords"
                    ? req.body[key].map((k) => k.toLowerCase().trim())
                    : key === "validUntil"
                        ? new Date(req.body[key])
                        : req.body[key];
            }
        }

        const updatedAd = await Ad.findByIdAndUpdate(
            req.params.id,
            { ...updates, updatedAt: new Date() },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Ad updated successfully",
            ad: updatedAd.toJSON(),
        });
    } catch (error) {
        console.error("Update ad error:", error);
        res.status(500).json({ success: false, message: "Failed to update ad" });
    }
};

// @desc    Delete an ad (soft delete)
// @route   DELETE /api/ads/:id
// @access  Private (owner only)
export const deleteAd = async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id);

        if (!ad) {
            return res.status(404).json({ success: false, message: "Ad not found" });
        }

        if (ad.userId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Not authorized to delete this ad" });
        }

        ad.isActive = false;
        await ad.save();

        res.status(200).json({
            success: true,
            message: "Ad deleted successfully",
        });
    } catch (error) {
        console.error("Delete ad error:", error);
        res.status(500).json({ success: false, message: "Failed to delete ad" });
    }
};

// @desc    Get ads grouped by city (for discovery)
// @route   GET /api/ads/cities
// @access  Public
export const getAdCities = async (req, res) => {
    try {
        const cities = await Ad.aggregate([
            {
                $match: {
                    isActive: true,
                    validUntil: { $gte: new Date() },
                },
            },
            {
                $group: {
                    _id: "$city",
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
        ]);

        res.status(200).json({
            success: true,
            cities: cities.map((c) => ({ city: c._id, count: c.count })),
        });
    } catch (error) {
        console.error("Get ad cities error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch cities" });
    }
};
