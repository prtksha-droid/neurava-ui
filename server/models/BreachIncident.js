import mongoose from "mongoose";

const breachIncidentSchema = new mongoose.Schema(
  {
    incidentTitle: {
      type: String,
      required: true,
    },

    incidentType: {
      type: String,
      enum: [
        "DATA_LEAK",
        "UNAUTHORIZED_ACCESS",
        "PII_EXPOSURE",
        "MODEL_LEAKAGE",
        "CONSENT_VIOLATION",
        "OTHER",
      ],
      required: true,
    },

    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
    },

    status: {
      type: String,
      enum: [
        "OPEN",
        "UNDER_INVESTIGATION",
        "CONTAINED",
        "RESOLVED",
      ],
      default: "OPEN",
    },

    impactedSystems: {
      type: [String],
      default: [],
    },

    impactedData: {
      type: [String],
      default: [],
    },

    estimatedAffectedUsers: {
      type: Number,
      default: 0,
    },

    regulatorNotified: {
      type: Boolean,
      default: false,
    },

    customerNotified: {
      type: Boolean,
      default: false,
    },

    rootCause: {
      type: String,
      default: "",
    },

    remediationActions: {
      type: String,
      default: "",
    },

    createdBy: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "BreachIncident",
  breachIncidentSchema
);