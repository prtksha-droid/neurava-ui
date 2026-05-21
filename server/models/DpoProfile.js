import mongoose from "mongoose";

const dpoProfileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    designation: { type: String, default: "Data Protection Officer" },
    department: { type: String, default: "Compliance" },
    escalationEmail: { type: String, default: "" },
    jurisdiction: { type: String, default: "India" },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
    notes: { type: String, default: "" },
    createdBy: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("DpoProfile", dpoProfileSchema);