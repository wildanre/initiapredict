import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

export async function POST(req: Request) {
  const { question, yesPrice, polymarketOdds } = await req.json()

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Market: "${question}"
Current price: YES ${yesPrice}%
${polymarketOdds ? `Polymarket odds: YES ${polymarketOdds}%` : ''}
Analyze this market and return JSON.`,
    config: {
      systemInstruction: `You are a prediction market analyst. Analyze the given market and return ONLY a valid JSON object with these fields:
- confidenceScore: number 0-100 (your estimated YES probability)
- recommendation: one of "STRONG_YES", "LEAN_YES", "NEUTRAL", "LEAN_NO", "STRONG_NO"
- reasoning: string (2-3 sentences explaining your analysis)
- keyFactors: array of strings (3-5 key factors)
- riskLevel: one of "LOW", "MEDIUM", "HIGH"
Return ONLY the JSON, no markdown or extra text.`,
      temperature: 0.3,
      maxOutputTokens: 1024,
    },
  })

  const text = response.text ?? ''

  try {
    // Strip potential markdown code fences
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const analysis = JSON.parse(cleaned)
    return Response.json(analysis)
  } catch {
    return Response.json({
      confidenceScore: 50,
      recommendation: 'NEUTRAL',
      reasoning: text,
      keyFactors: [],
      riskLevel: 'MEDIUM',
    })
  }
}
