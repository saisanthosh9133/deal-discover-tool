import express from "express";
import Feedback from "../models/Feedback.js";
import { sendFeedbackEmail } from "../config/email.js";

const router = express.Router();

// @route   POST api/feedback
// @desc    Submit user feedback + send email notification
// @access  Public
router.post("/", async (req, res) => {
    try {
        const { rating, comment, email, userId } = req.body;

        if (!rating || !comment) {
            return res.status(400).json({
                success: false,
                message: "Please provide both rating and comment",
            });
        }

        // 1. Try saving to database (may fail if DB is down)
        let savedFeedback = null;
        try {
            const feedback = new Feedback({
                rating,
                comment,
                email,
                user: userId || null,
            });
            savedFeedback = await feedback.save();
        } catch (dbError) {
            console.warn("⚠ Could not save feedback to DB:", dbError.message);
            // Continue — still send the email
        }

        // 2. Send email notification to the site owner
        const emailResult = await sendFeedbackEmail({
            fromEmail: email || "anonymous@dealdiscover.app",
            fromName: null,
            rating,
            comment,
        });

        res.status(201).json({
            success: true,
            message: "Feedback submitted successfully. Thank you!",
            feedback: savedFeedback,
            emailSent: emailResult.sent,
        });
    } catch (error) {
        console.error("Feedback submission error:", error);
        res.status(500).json({
            success: false,
            message: "Server error, failed to submit feedback",
        });
    }
});

// @route   GET api/feedback
// @desc    Get all feedback (Admin only maybe?)
// @access  Private/Admin
router.get("/", async (req, res) => {
    try {
        const feedbacks = await Feedback.find().populate("user", "name email").sort("-createdAt");
        res.json({ success: true, feedbacks });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

export default router;
