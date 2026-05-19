import mongoose from "mongoose";

const workflowSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    nodes: {
      type: Array,
      default: [],
    },
    edges: {
      type: Array,
      default: [],
    },
    status: {
      type: String,
      default: "DRAFT",
      enum: ["DRAFT", "ACTIVE", "ARCHIVED"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Workflow", workflowSchema);