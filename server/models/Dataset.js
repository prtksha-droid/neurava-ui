import mongoose from "mongoose";

const datasetSchema = new mongoose.Schema(
  {
    sourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DataSource",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["TABLE", "FILE", "COLLECTION", "STREAM", "API_ENDPOINT", "OTHER"],
      default: "TABLE",
    },

    description: {
      type: String,
      default: "",
    },

    schema: [
      {
        columnName: String,
        dataType: String,
        nullable: Boolean,
        isPrimaryKey: Boolean,
        sensitivity: {
          type: String,
          enum: ["NONE", "PII", "FINANCIAL", "HEALTH", "CONFIDENTIAL"],
          default: "NONE",
        },
      },
    ],

    rowCount: {
      type: Number,
      default: 0,
    },

    qualityScore: {
      type: Number,
      default: 0,
    },

    freshnessStatus: {
      type: String,
      enum: ["FRESH", "STALE", "UNKNOWN"],
      default: "UNKNOWN",
    },

    owner: {
      type: String,
      default: "Unassigned",
    },

    tags: {
      type: [String],
      default: [],
    },

    lastProfiledAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Dataset", datasetSchema);