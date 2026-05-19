import DpdpObservabilityEvent from "../models/DpdpObservabilityEvent.js";

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

export function calculateDpdpRiskScore({ detectedDataTypes = [], consentStatus }) {
  let score = 0;

  score += detectedDataTypes.length * 15;

  if (detectedDataTypes.includes("AADHAAR")) score += 25;
  if (detectedDataTypes.includes("PAN")) score += 20;
  if (detectedDataTypes.includes("BANK_ACCOUNT")) score += 25;

  if (consentStatus === "MISSING") score += 30;
  if (consentStatus === "WITHDRAWN") score += 40;
  if (consentStatus === "EXPIRED") score += 25;

  return Math.min(score, 100);
}

export function getSeverity(score) {
  if (score >= 80) return "CRITICAL";
  if (score >= 60) return "HIGH";
  if (score >= 35) return "MEDIUM";
  return "LOW";
}

export async function createDpdpObservabilityEvent({
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

  if (detectedDataTypes.length === 0 && consentStatus === "VALID") {
    return null;
  }

  const riskScore = calculateDpdpRiskScore({
    detectedDataTypes,
    consentStatus,
  });

  let eventType = "DATA_SECURITY_EVENT";

  if (detectedDataTypes.length > 0) eventType = "PII_DETECTED";
  if (["MISSING", "WITHDRAWN", "EXPIRED"].includes(consentStatus)) {
    eventType = "CONSENT_VIOLATION";
  }

  return await DpdpObservabilityEvent.create({
    eventType,
    severity: getSeverity(riskScore),
    source,
    modelName,
    userId,
    promptSnippet: prompt.slice(0, 250),
    responseSnippet: response.slice(0, 250),
    detectedDataTypes,
    consentStatus,
    riskScore,
    metadata,
  });
}