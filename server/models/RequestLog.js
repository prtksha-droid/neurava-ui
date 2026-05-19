import mongoose from "mongoose";

const evidenceSchema = new mongoose.Schema(
  {
    source: String,
    content: String,
    confidence: Number,
    url: String,
  },
  { _id: false }
);

const evidenceResultSchema = new mongoose.Schema(
  {
    claim: String,
    type: String,
    riskLevel: String,
    evidence: [evidenceSchema],
  },
  { _id: false }
);

const claimSchema = new mongoose.Schema(
  {
    claim: String,
    type: String,
    riskLevel: String,
  },
  { _id: false }
);

const timelineSchema = new mongoose.Schema(
  {
    step: String,
    status: String,
    output: String,
  },
  { _id: false }
);

const requestLogSchema = new mongoose.Schema(
  {
    prompt: String,
    rawOutput: String,
    finalOutput: String,
    decision: String,
    riskScore: Number,

    mode: String,
    primaryModel: String,
    validatorModel: String,

    policies: {
      type: [String],
      default: [],
    },

    triggeredPolicies: {
      type: [String],
      default: [],
    },

    consentAccepted: Boolean,
    consentVersion: String,
    consentPurpose: String,

    userId: String,
    userEmail: String,
    userRole: String,

    timeline: {
      type: [timelineSchema],
      default: [],
    },

    evidenceResults: {
      type: [evidenceResultSchema],
      default: [],
    },

    claims: {
      type: [claimSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.models.RequestLog ||
  mongoose.model("RequestLog", requestLogSchema);