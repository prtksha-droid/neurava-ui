import mongoose from "mongoose";

const lineageEdgeSchema = new mongoose.Schema(
  {
    fromNode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LineageNode",
      required: true,
    },
    toNode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LineageNode",
      required: true,
    },
    relationshipType: {
      type: String,
      enum: ["FEEDS", "TRANSFORMS", "CONSUMES", "GENERATES"],
      default: "FEEDS",
    },
    transformationLogic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("LineageEdge", lineageEdgeSchema);