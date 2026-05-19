import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config({ path: ".env", override: true });
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function extractClaims(aiResponse) {
  if (!aiResponse || typeof aiResponse !== "string") {
    return [];
  }

  const prompt = `
Extract factual claims from the AI response below.

Return ONLY valid JSON in this format:
{
  "claims": [
    {
      "claim": "specific factual claim",
      "type": "fact | number | date | entity | medical | legal | financial | technical | general",
      "riskLevel": "LOW | MEDIUM | HIGH"
    }
  ]
}

AI Response:
${aiResponse}
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content:
          "You extract factual claims for hallucination detection. Return only valid JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0,
  });

  const raw = completion.choices[0].message.content;

  try {
    const parsed = JSON.parse(raw);
    return parsed.claims || [];
  } catch (error) {
    console.error("Claim extraction JSON parse failed:", raw);
    return [];
  }
}