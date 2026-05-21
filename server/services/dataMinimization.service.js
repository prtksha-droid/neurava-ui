const SENSITIVE_PATTERNS = {
  PAN: /[A-Z]{5}[0-9]{4}[A-Z]{1}/gi,
  PHONE: /\b[6-9]\d{9}\b/g,
  EMAIL: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
  AADHAAR: /\b\d{4}\s?\d{4}\s?\d{4}\b/g,
  BANK: /\b\d{9,18}\b/g,
  PASSPORT: /\b[A-Z][0-9]{7}\b/g,
};

const PURPOSE_KEYWORDS = {
  SUPPORT: [
    "issue",
    "support",
    "ticket",
    "problem",
    "help",
  ],

  ANALYTICS: [
    "analytics",
    "dashboard",
    "metrics",
    "report",
  ],

  HR: [
    "employee",
    "salary",
    "attendance",
    "hr",
  ],
};

export function analyzeDataMinimization({
  prompt = "",
  purpose = "SUPPORT",
}) {
  const detected = [];

  Object.entries(SENSITIVE_PATTERNS).forEach(
    ([type, regex]) => {
      const matches = prompt.match(regex);

      if (matches?.length) {
        detected.push({
          type,
          count: matches.length,
        });
      }
    }
  );

  const allowedKeywords =
    PURPOSE_KEYWORDS[purpose] || [];

  const excessive =
    detected.length >= 3 &&
    !allowedKeywords.some((keyword) =>
      prompt.toLowerCase().includes(keyword)
    );

  const riskScore = Math.min(
    100,
    detected.length * 25 +
      (excessive ? 25 : 0)
  );

  return {
    excessive,
    detected,
    riskScore,
    recommendation: excessive
      ? "Reduce personal data collection to only necessary fields."
      : "Data collection appears proportionate.",
  };
}