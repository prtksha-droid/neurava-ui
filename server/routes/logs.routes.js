import express from "express";
import RequestLog from "../models/RequestLog.js";
import {
  requireAuth,
  requireRole,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const query =
      req.user.role === "ADMIN" ? {} : { userId: req.user.id };

    const logs = await RequestLog.find(query)
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(
      logs.map((log) => ({
        id: log._id,
        prompt: log.prompt,
        rawOutput: log.rawOutput,
        finalOutput: log.finalOutput,
        decision: log.decision,
        riskScore: log.riskScore,
        mode: log.mode,
        userEmail: log.userEmail,
        userRole: log.userRole,
        primaryModel: log.primaryModel,
        validatorModel: log.validatorModel,
        policies: log.policies || [],
        triggeredPolicies: log.triggeredPolicies || [],
        consentAccepted: log.consentAccepted,
        consentVersion: log.consentVersion,
        consentPurpose: log.consentPurpose,
        timeline: log.timeline || [],
        createdAt: log.createdAt,
        claims: log.claims || [],
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to fetch logs",
      details: err.message,
    });
  }
});

router.delete(
  "/",
  requireAuth,
  requireRole("ADMIN"),
  async (req, res) => {
    try {
      await RequestLog.deleteMany({});

      res.json({
        success: true,
        message: "Logs cleared",
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        error: "Failed to clear logs",
        details: err.message,
      });
    }
  }
);

export default router;