import express from "express";
import DataPrincipalRequest from "../models/DataPrincipalRequest.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const requests = await DataPrincipalRequest.find()
      .sort({ createdAt: -1 })
      .limit(200);

    res.json(requests);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch data principal requests",
      details: err.message,
    });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const {
      requestType,
      requesterName,
      requesterEmail,
      description,
      priority,
    } = req.body;

    const request = await DataPrincipalRequest.create({
      requestType,
      requesterName,
      requesterEmail,
      description,
      priority,
      userId: req.user?.id || "",
      assignedTo: "DPO/Admin",
    });

    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({
      error: "Failed to create data principal request",
      details: err.message,
    });
  }
});

router.patch("/:id/status", requireAuth, async (req, res) => {
  try {
    const { status, resolutionNote } = req.body;

    const updated = await DataPrincipalRequest.findByIdAndUpdate(
      req.params.id,
      {
        status,
        ...(resolutionNote !== undefined ? { resolutionNote } : {}),
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({
      error: "Failed to update request status",
      details: err.message,
    });
  }
});

export default router;