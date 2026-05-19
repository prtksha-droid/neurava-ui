import mongoose from "mongoose";

const dataSourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "POSTGRES",
        "MYSQL",
        "MONGODB",
        "CSV",
        "API",
        "S3",
        "SNOWFLAKE",
        "BIGQUERY",
        "OTHER",
      ],
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    owner: {
      type: String,
      default: "Unassigned",
    },

    businessDomain: {
      type: String,
      default: "General",
    },

    sensitivity: {
      type: String,
      enum: ["PUBLIC", "INTERNAL", "CONFIDENTIAL", "RESTRICTED"],
      default: "INTERNAL",
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "FAILED", "PENDING"],
      default: "ACTIVE",
    },

    connectionType: {
      type: String,
      default: "MANUAL",
    },

    tags: {
      type: [String],
      default: [],
    },

    lastScannedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("DataSource", dataSourceSchema);