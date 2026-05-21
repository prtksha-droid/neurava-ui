import mongoose from "mongoose";

const privacyNoticeSchema = new mongoose.Schema(
  {
    noticeTitle: {
      type: String,
      required: true,
    },

    version: {
      type: String,
      default: "v1.0",
    },

    purpose: {
      type: String,
      required: true,
    },

    dataCategories: {
      type: [String],
      default: [],
    },

    retentionPeriod: {
      type: String,
      default: "",
    },

    lawfulBasis: {
      type: String,
      default: "Consent",
    },

    appliesToSystems: {
      type: [String],
      default: [],
    },

    dataSharingDetails: {
      type: String,
      default: "",
    },

    grievanceContact: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },

    createdBy: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "PrivacyNotice",
  privacyNoticeSchema
);