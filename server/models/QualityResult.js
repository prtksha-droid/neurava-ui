import mongoose from "mongoose";

const qualityResultSchema = new mongoose.Schema(
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

    ruleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QualityRule",
      required: true,
    },

    ruleName: {
      type: String,
      required: true,
    },

    result: {
      type: String,
      enum: ["PASSED", "FAILED", "WARNING"],
      required: true,
    },

    score: {
      type: Number,
      default: 100,
    },

    issueCount: {
      type: Number,
      default: 0,
    },

    details: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "QualityResult",
  qualityResultSchema
);