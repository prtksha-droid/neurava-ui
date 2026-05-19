import express from "express";
import DpdpObservabilityEvent from "../models/DpdpObservabilityEvent.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const events = await DpdpObservabilityEvent.find()
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(events);
  } catch (err) {
    console.error("Failed to fetch DPDP observability events:", err);
    res.status(500).json({
      error: "Failed to fetch DPDP observability events",
      details: err.message,
    });
  }
});

router.patch("/:id/status", requireAuth, async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await DpdpObservabilityEvent.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({
      error: "Failed to update event status",
      details: err.message,
    });
  }
});

export default router;