import mongoose from "mongoose";

const dataPrincipalRequestSchema = new mongoose.Schema(
  {
    requestType: {
      type: String,
      enum: [
        "ACCESS",
        "CORRECTION",
        "ERASURE",
        "CONSENT_WITHDRAWAL",
        "GRIEVANCE",
      ],
      required: true,
    },

    requesterName: {
      type: String,
      required: true,
      trim: true,
    },

    requesterEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    userId: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["NEW", "IN_REVIEW", "APPROVED", "REJECTED", "COMPLETED"],
      default: "NEW",
    },

    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "MEDIUM",
    },

    assignedTo: {
      type: String,
      default: "",
    },

    resolutionNote: {
      type: String,
      default: "",
    },

    evidence: {
      type: [String],
      default: [],
    },

    dueDate: {
      type: Date,
      default: () => {
        const date = new Date();
        date.setDate(date.getDate() + 30);
        return date;
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "DataPrincipalRequest",
  dataPrincipalRequestSchema
);