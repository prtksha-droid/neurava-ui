import express from "express";
import DpoProfile from "../models/DpoProfile.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const profiles = await DpoProfile.find().sort({ createdAt: -1 });
    res.json(profiles);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch DPO profiles",
      details: err.message,
    });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const profile = await DpoProfile.create({
      ...req.body,
      createdBy: req.user?.email || "Admin",
    });

    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({
      error: "Failed to create DPO profile",
      details: err.message,
    });
  }
});

router.patch("/:id/status", requireAuth, async (req, res) => {
  try {
    const updated = await DpoProfile.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({
      error: "Failed to update DPO status",
      details: err.message,
    });
  }
});

export default router;