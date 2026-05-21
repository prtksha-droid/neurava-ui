import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import mongoose from "mongoose";
import crypto from "crypto";


import dataLifecycleRoutes from "./routes/dataLifecycle.routes.js";
import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import logsRoutes from "./routes/logs.routes.js";
import createLLMRoutes from "./routes/llm.routes.js";
import createChatRoutes from "./routes/chat.routes.js";
import workflowRoutes from "./routes/workflowRoutes.js";
import dpdpObservabilityRoutes from "./routes/dpdpObservability.routes.js";
import dataPrincipalRightsRoutes from "./routes/dataPrincipalRights.routes.js";
import retentionPolicyRoutes from "./routes/retentionPolicy.routes.js";
import breachIncidentRoutes from "./routes/breachIncident.routes.js";
import dpdpComplianceRoutes from "./routes/dpdpCompliance.routes.js";
import privacyNoticeRoutes from "./routes/privacyNotice.routes.js";
import vendorProcessorRoutes from "./routes/vendorProcessor.routes.js";
import dpoRoutes from "./routes/dpo.routes.js";

dotenv.config({ path: ".env", override: true });

const app = express();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ENCRYPTION_SECRET =
  process.env.LLM_KEY_SECRET || "12345678901234567890123456789012";

const encryptApiKey = (text) => {
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_SECRET.slice(0, 32)),
    iv
  );

  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
};

const decryptApiKey = (encryptedText) => {
  const [ivHex, encryptedHex] = encryptedText.split(":");

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_SECRET.slice(0, 32)),
    Buffer.from(ivHex, "hex")
  );

  let decrypted = decipher.update(Buffer.from(encryptedHex, "hex"));

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
};

const llmRoutes = createLLMRoutes({
  encryptApiKey,
});

const chatRoutes = createChatRoutes({
  openai,
  decryptApiKey,
});

app.use("/api", dataLifecycleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/llms", llmRoutes);
app.use("/api/logs", logsRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/workflows", workflowRoutes);
app.use("/api/dpdp-observability", dpdpObservabilityRoutes);
app.use("/api/data-principal-rights", dataPrincipalRightsRoutes);
app.use("/api/retention-policies", retentionPolicyRoutes);
app.use("/api/breach-incidents", breachIncidentRoutes);
app.use("/api/dpdp-compliance", dpdpComplianceRoutes);
app.use("/api/privacy-notices", privacyNoticeRoutes);
app.use("/api/vendor-processors", vendorProcessorRoutes);
app.use("/api/dpo", dpoRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});