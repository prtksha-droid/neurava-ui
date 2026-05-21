import express from "express";
import VendorProcessor from "../models/VendorProcessor.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const vendors = await VendorProcessor.find().sort({ createdAt: -1 });
    res.json(vendors);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch vendor processors",
      details: err.message,
    });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const vendor = await VendorProcessor.create({
      ...req.body,
      createdBy: req.user?.email || "Admin",
    });

    res.status(201).json(vendor);
  } catch (err) {
    res.status(500).json({
      error: "Failed to create vendor processor",
      details: err.message,
    });
  }
});

router.patch("/:id/status", requireAuth, async (req, res) => {
  try {
    const updated = await VendorProcessor.findByIdAndUpdate(
      req.params.id,
      {
        approvalStatus: req.body.approvalStatus,
        contractStatus: req.body.contractStatus,
        dpaStatus: req.body.dpaStatus,
        riskLevel: req.body.riskLevel,
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({
      error: "Failed to update vendor processor",
      details: err.message,
    });
  }
});

export default router;