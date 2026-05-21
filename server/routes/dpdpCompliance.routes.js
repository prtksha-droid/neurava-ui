import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { dpdpControls } from "../data/dpdpControls.js";

const router = express.Router();

router.get("/summary", requireAuth, async (req, res) => {
  try {
    const implementedStatus = {
  applicabilityImplemented: false,

  noticeImplemented: true,
  consentImplemented: true,
  purposeImplemented: true,
  dataMinimizationImplemented: true,

  rightsImplemented: true,
  grievanceImplemented: true,
  retentionImplemented: true,

  securityImplemented: true,
  encryptionImplemented: true,
  accessControlImplemented: true,
  auditLogsImplemented: true,

  breachImplemented: true,
  breachNotificationImplemented: true,

  processorGovernanceImplemented: true,

  childrenImplemented: true,
  childrenProfilingImplemented: true,
  nominationImplemented: false,
  consentManagerImplemented: false,

  sdfImplemented: false,
  dpoImplemented: true,
  dpiaImplemented: false,
  independentAuditImplemented: false,

  crossBorderImplemented: true,
  dataPrincipalDutiesImplemented: false,
};

    const controls = dpdpControls.map((control) => {
      const implemented = implementedStatus[control.statusKey] === true;

      return {
        ...control,
        status: implemented ? "IMPLEMENTED" : "MISSING",
        confidence: implemented ? 0.9 : 0.75,
      };
    });

    const implementedCount = controls.filter(
      (item) => item.status === "IMPLEMENTED"
    ).length;

    const score = Math.round(
      (implementedCount / controls.length) * 100
    );

    res.json({
      score,
      implementedCount,
      totalControls: controls.length,
      controls,
      summary:
        "DPDP coverage is calculated by comparing Neurava implemented modules against DPDP Act control obligations.",
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to generate DPDP compliance summary",
      details: err.message,
    });
  }
});

export default router;