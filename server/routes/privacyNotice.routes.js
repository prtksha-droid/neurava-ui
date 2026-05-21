import express from "express";
import PrivacyNotice from "../models/PrivacyNotice.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const notices = await PrivacyNotice.find().sort({
      createdAt: -1,
    });

    res.json(notices);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch privacy notices",
      details: err.message,
    });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const notice = await PrivacyNotice.create({
      ...req.body,
      createdBy: req.user?.email || "Admin",
    });

    res.status(201).json(notice);
  } catch (err) {
    res.status(500).json({
      error: "Failed to create privacy notice",
      details: err.message,
    });
  }
});

router.patch("/:id/status", requireAuth, async (req, res) => {
  try {
    const updated = await PrivacyNotice.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({
      error: "Failed to update notice",
      details: err.message,
    });
  }
});

export default router;