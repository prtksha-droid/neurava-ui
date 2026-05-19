import mongoose from "mongoose";

const dpdpObservabilityEventSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      enum: [
        "PII_DETECTED",
        "CONSENT_VIOLATION",
        "UNAUTHORIZED_PROCESSING",
        "DATA_SECURITY_EVENT",
        "BREACH_RISK",
        "RETENTION_VIOLATION",
        "PROMPT_LEAKAGE",
      ],
      required: true,
    },

    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "LOW",
    },

    source: {
      type: String,
      default: "AI_CHAT",
    },

    modelName: {
      type: String,
      default: "Unknown",
    },

    userId: {
      type: String,
      default: "anonymous",
    },

    promptSnippet: {
      type: String,
      default: "",
    },

    responseSnippet: {
      type: String,
      default: "",
    },

    detectedDataTypes: {
      type: [String],
      default: [],
    },

    consentStatus: {
      type: String,
      enum: ["VALID", "MISSING", "WITHDRAWN", "EXPIRED", "UNKNOWN"],
      default: "UNKNOWN",
    },

    riskScore: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["OPEN", "UNDER_REVIEW", "RESOLVED", "FALSE_POSITIVE"],
      default: "OPEN",
    },

    metadata: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "DpdpObservabilityEvent",
  dpdpObservabilityEventSchema
);