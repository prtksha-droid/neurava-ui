import mongoose from "mongoose";

const retentionPolicySchema = new mongoose.Schema(
  {
    policyName: {
      type: String,
      required: true,
      trim: true,
    },

    dataCategory: {
      type: String,
      required: true,
      trim: true,
    },

    retentionDays: {
      type: Number,
      required: true,
    },

    autoDelete: {
      type: Boolean,
      default: false,
    },

    appliesTo: {
      type: [String],
      default: [],
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

    createdBy: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "RetentionPolicy",
  retentionPolicySchema
);