import mongoose from "mongoose";

const llmProviderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    provider: {
      type: String,
      enum: ["OPENAI", "CLAUDE", "GEMINI", "PERPLEXITY"],
      required: true,
    },

    model: {
      type: String,
      required: true,
    },

    apiKeyEncrypted: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("LLMProvider", llmProviderSchema);