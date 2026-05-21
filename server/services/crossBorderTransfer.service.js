const PROVIDER_REGIONS = {
  OPENAI: {
    country: "United States",
    restricted: false,
  },

  CLAUDE: {
    country: "United States",
    restricted: false,
  },

  GEMINI: {
    country: "United States",
    restricted: false,
  },
};

export function analyzeCrossBorderTransfer(
  provider = "OPENAI"
) {
  const normalized =
    provider?.toUpperCase?.() || "OPENAI";

  const info =
    PROVIDER_REGIONS[normalized] ||
    PROVIDER_REGIONS.OPENAI;

  return {
    provider: normalized,
    destinationCountry: info.country,
    restricted: info.restricted,
    transferDetected: true,
    recommendation: info.restricted
      ? "Cross-border transfer restricted."
      : "Cross-border transfer permitted with safeguards.",
  };
}