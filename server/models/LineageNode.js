import mongoose from "mongoose";

const lineageNodeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    nodeType: {
      type: String,
      enum: ["SOURCE", "DATASET", "TRANSFORMATION", "REPORT", "AI_MODEL", "API"],
      required: true,
    },
    assetId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    description: {
      type: String,
      default: "",
    },
    owner: {
      type: String,
      default: "Unassigned",
    },
  },
  { timestamps: true }
);

export default mongoose.model("LineageNode", lineageNodeSchema);