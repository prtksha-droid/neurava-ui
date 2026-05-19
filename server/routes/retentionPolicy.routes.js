import express from "express";
import RetentionPolicy from "../models/RetentionPolicy.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const policies = await RetentionPolicy.find().sort({
      createdAt: -1,
    });

    res.json(policies);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch retention policies",
      details: err.message,
    });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const policy = await RetentionPolicy.create({
      ...req.body,
      createdBy: req.user?.email || "Admin",
    });

    res.status(201).json(policy);
  } catch (err) {
    res.status(500).json({
      error: "Failed to create retention policy",
      details: err.message,
    });
  }
});

router.patch("/:id/status", requireAuth, async (req, res) => {
  try {
    const updated = await RetentionPolicy.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({
      error: "Failed to update retention policy",
      details: err.message,
    });
  }
});

export default router;