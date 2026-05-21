export function analyzeChildData(prompt = "") {
  const text = prompt.toLowerCase();

  const childIndicators = [
    "child",
    "kid",
    "minor",
    "student",
    "school student",
    "under 18",
    "12 year old",
    "13 year old",
    "14 year old",
    "15 year old",
    "16 year old",
    "17 year old",
  ];

  const detected = childIndicators.some((term) =>
    text.includes(term)
  );

  return {
    childDataDetected: detected,
    parentalConsentRequired: detected,
    recommendation: detected
      ? "Parental consent required for child data processing."
      : "No child data detected.",
  };
}