import mongoose from "mongoose";

const vendorProcessorSchema = new mongoose.Schema(
  {
    vendorName: {
      type: String,
      required: true,
      trim: true,
    },

    processorType: {
      type: String,
      enum: ["AI_PROVIDER", "CLOUD", "ANALYTICS", "SECURITY", "OTHER"],
      default: "AI_PROVIDER",
    },

    dataProcessed: {
      type: [String],
      default: [],
    },

    country: {
      type: String,
      default: "",
    },

    contractStatus: {
      type: String,
      enum: ["NOT_STARTED", "IN_REVIEW", "SIGNED", "EXPIRED"],
      default: "NOT_STARTED",
    },

    dpaStatus: {
      type: String,
      enum: ["NOT_STARTED", "IN_REVIEW", "SIGNED", "NOT_REQUIRED"],
      default: "NOT_STARTED",
    },

    riskLevel: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
    },

    approvalStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    notes: {
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

export default mongoose.model("VendorProcessor", vendorProcessorSchema);