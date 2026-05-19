import express from "express";
import BreachIncident from "../models/BreachIncident.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const incidents = await BreachIncident.find().sort({
      createdAt: -1,
    });

    res.json(incidents);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch breach incidents",
      details: err.message,
    });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const incident = await BreachIncident.create({
      ...req.body,
      createdBy: req.user?.email || "Admin",
    });

    res.status(201).json(incident);
  } catch (err) {
    res.status(500).json({
      error: "Failed to create breach incident",
      details: err.message,
    });
  }
});

router.patch("/:id/status", requireAuth, async (req, res) => {
  try {
    const updated = await BreachIncident.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({
      error: "Failed to update breach status",
      details: err.message,
    });
  }
});

export default router;