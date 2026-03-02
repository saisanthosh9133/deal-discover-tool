import mongoose from "mongoose";

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
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Indexes for common queries
adSchema.index({ city: 1, isActive: 1 });
adSchema.index({ keywords: 1 });
adSchema.index({ userId: 1 });
adSchema.index({ validUntil: 1 });
adSchema.index({ createdAt: -1 });

// Auto-update the updatedAt field
adSchema.pre("save", function (next) {
    this.updatedAt = new Date();
    next();
});

// Clean toJSON output
adSchema.methods.toJSON = function () {
    const ad = this.toObject();
    ad.id = ad._id.toString();
    return ad;
};

export default mongoose.model("Ad", adSchema);
