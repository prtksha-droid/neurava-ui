import DpdpObservabilityEvent from "../models/DpdpObservabilityEvent.js";
import { maskSensitiveData } from "./dataMasking.service.js";

export function detectPII(text = "") {
  const detected = [];

  const patterns = {
    EMAIL: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
    PHONE: /\b(?:\+91[-\s]?)?[6-9]\d{9}\b/,
    PAN: /\b[A-Z]{5}[0-9]{4}[A-Z]\b/,
    AADHAAR: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/,
    BANK_ACCOUNT: /\b\d{9,18}\b/,
  };

  for (const [type, regex] of Object.entries(patterns)) {
    if (regex.test(text)) detected.push(type);
  }

  return detected;
}

export function calculateDpdpRiskScore({
  detectedDataTypes = [],
  consentStatus,
  source = "AI_CHAT",
  metadata = {},
}) {
  let score = 0;

  score += detectedDataTypes.length * 15;

  if (detectedDataTypes.includes("AADHAAR")) score += 25;
  if (detectedDataTypes.includes("PAN")) score += 20;
  if (detectedDataTypes.includes("BANK_ACCOUNT")) score += 25;

  if (consentStatus === "MISSING") score += 30;
  if (consentStatus === "WITHDRAWN") score += 40;
  if (consentStatus === "EXPIRED") score += 25;

  if (source === "DATA_MINIMIZATION") {
    score = Math.max(score, metadata?.riskScore || 40);
  }

  if (source === "CROSS_BORDER_TRANSFER") {
    score = metadata?.restricted ? 75 : 20;
  }

  return Math.min(score, 100);
}

export function getSeverity(score) {
  if (score >= 80) return "CRITICAL";
  if (score >= 60) return "HIGH";
  if (score >= 35) return "MEDIUM";
  return "LOW";
}

export async function createDpdpObservabilityEvent({
  eventType = "",
  prompt = "",
  response = "",
  modelName = "Unknown",
  userId = "anonymous",
  consentStatus = "UNKNOWN",
  source = "AI_CHAT",
  metadata = {},
}) {
  const promptPII = detectPII(prompt);
  const responsePII = detectPII(response);
  const detectedDataTypes = [...new Set([...promptPII, ...responsePII])];

  const shouldAlwaysLog =
    source === "DATA_MINIMIZATION" ||
    source === "CROSS_BORDER_TRANSFER" ||
    source === "AI_CHAT_ERROR" ||
    source === "CHILD_DATA_PROCESSING" ||
    eventType;

  if (
    !shouldAlwaysLog &&
    detectedDataTypes.length === 0 &&
    consentStatus === "VALID"
  ) {
    return null;
  }

  const riskScore = calculateDpdpRiskScore({
    detectedDataTypes,
    consentStatus,
    source,
    metadata,
  });

  let finalEventType = eventType || "DATA_SECURITY_EVENT";

  if (!eventType) {
    if (source === "DATA_MINIMIZATION") {
      finalEventType = "DATA_SECURITY_EVENT";
    } else if (source === "CROSS_BORDER_TRANSFER") {
      finalEventType = "DATA_SECURITY_EVENT";
    } else if (detectedDataTypes.length > 0) {
      finalEventType = "PII_DETECTED";
    } else if (
      ["MISSING", "WITHDRAWN", "EXPIRED"].includes(consentStatus)
    ) {
      finalEventType = "CONSENT_VIOLATION";
    }
  }

  return await DpdpObservabilityEvent.create({
    eventType: finalEventType,
    severity: getSeverity(riskScore),
    source,
    modelName,
    userId,
    promptSnippet: maskSensitiveData(prompt?.slice(0, 300) || ""),
    responseSnippet: maskSensitiveData(response?.slice(0, 300) || ""),
    detectedDataTypes,
    consentStatus,
    riskScore,
    metadata,
  });
}