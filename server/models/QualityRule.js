import mongoose from "mongoose";

const qualityRuleSchema = new mongoose.Schema(
  {
    datasetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dataset",
      required: true,
    },

    datasetName: {
      type: String,
      required: true,
    },

    ruleName: {
      type: String,
      required: true,
    },

    ruleType: {
      type: String,
      enum: [
        "NULL_CHECK",
        "DUPLICATE_CHECK",
        "FRESHNESS_CHECK",
        "SCHEMA_CHECK",
        "PII_CHECK",
        "CUSTOM",
      ],
      required: true,
    },

    columnName: {
      type: String,
      default: "",
    },

    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
    },

    threshold: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },

    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "QualityRule",
  qualityRuleSchema
);