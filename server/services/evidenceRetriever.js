export async function retrieveEvidence(claim) {
  if (!claim?.claim) {
    return [];
  }

  // Temporary basic evidence layer.
  // Later we will replace this with Vector DB + Web Search + Enterprise KB.
  return [
    {
      source: "Internal Neurava Knowledge Base",
      snippet: `Evidence lookup placeholder for claim: ${claim.claim}`,
      confidence: 0.5,
    },
  ];
}