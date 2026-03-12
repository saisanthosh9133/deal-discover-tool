import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    value: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    createdAt: { type: Date, default: Date.now },
});

const adSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
        type: String,
        default: "",
        trim: true,
        maxlength: [500, "Description cannot exceed 500 characters"],
    },
    imageUrl: {
        type: String,
        default: "",
    },
    keywords: {
        type: [String],
        required: [true, "At least one keyword is required"],
        validate: {
            validator: (v) => v.length > 0 && v.length <= 10,
            message: "Must have 1–10 keywords",
        },
    },
    city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
    },
    discount: {
        type: String,
        default: "SPECIAL OFFER",
        trim: true,
    },
    businessName: {
        type: String,
        required: [true, "Business name is required"],
        trim: true,
    },
    validUntil: {
        type: Date,
        required: [true, "Valid until date is required"],
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    views: {
        type: Number,
        default: 0,
    },
    ratings: {
        type: [ratingSchema],
        default: [],
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

// Virtual: average rating
adSchema.virtual("avgRating").get(function () {
    if (!this.ratings || this.ratings.length === 0) return 0;
    const sum = this.ratings.reduce((acc, r) => acc + r.value, 0);
    return Math.round((sum / this.ratings.length) * 10) / 10;
});

// Virtual: total ratings count
adSchema.virtual("totalRatings").get(function () {
    return this.ratings ? this.ratings.length : 0;
});

// Indexes for common queries
adSchema.index({ city: 1, isActive: 1 });
adSchema.index({ keywords: 1 });
adSchema.index({ userId: 1 });
adSchema.index({ validUntil: 1 });
adSchema.index({ createdAt: -1 });
adSchema.index({ "ratings.userId": 1 });

// Auto-update the updatedAt field
adSchema.pre("save", function (next) {
    this.updatedAt = new Date();
    next();
});

// Clean toJSON output — include virtuals
adSchema.methods.toJSON = function () {
    const ad = this.toObject({ virtuals: true });
    ad.id = ad._id.toString();
    ad.avgRating = this.avgRating;
    ad.totalRatings = this.totalRatings;
    return ad;
};

export default mongoose.model("Ad", adSchema);

