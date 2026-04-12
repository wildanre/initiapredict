import { GoogleGenAI } from '@google/genai'

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return Response.json({ error: 'GEMINI_API_KEY not configured. Add it to .env.local' }, { status: 500 })
  }

  const ai = new GoogleGenAI({ apiKey })
  const { description } = await req.json()

  const today = new Date().toISOString().split('T')[0]

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are creating a prediction market for the InitiaPredict platform.

User's idea: "${description}"

Today's date: ${today}

Rules for creating the market:
1. question: Must be a clear binary yes/no question. Start with "Will". Be specific about the condition and deadline.
2. description: 2-3 sentences explaining context. Include why this matters and how it will be resolved.
3. category: Choose the most fitting from: crypto, politics, sports, tech, entertainment, other
4. resolutionSource: Provide a specific, credible source (e.g., "CoinGecko BTC/USD price page", "Official FIFA website", "Reuters"). Not just a generic URL.
5. endDate: ISO 8601 format. Must be in the future. Choose a realistic deadline based on the event. If unclear, default to 3 months from today.

Examples of good markets:
- {"question": "Will Bitcoin exceed $150,000 before January 1, 2027?", "description": "Resolves YES if BTC/USD price exceeds $150,000 on any major exchange (Binance, Coinbase, Kraken) at any point before the deadline.", "category": "crypto", "resolutionSource": "CoinGecko BTC/USD price history", "endDate": "2027-01-01T00:00:00Z"}
- {"question": "Will SpaceX successfully land Starship on Mars before 2030?", "description": "Resolves YES if SpaceX completes a successful landing of a Starship vehicle on the surface of Mars, as confirmed by SpaceX and NASA.", "category": "tech", "resolutionSource": "SpaceX official announcements and NASA confirmation", "endDate": "2030-01-01T00:00:00Z"}

Respond with ONLY the JSON object. No markdown, no explanation, no code fences.`,
      config: {
        temperature: 0.4,
        maxOutputTokens: 1024,
      },
    })

    const text = response.text ?? ''
    // Strip markdown fences and whitespace
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    // Try to extract JSON from the response
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      // If no complete JSON but looks like truncated JSON, try to fix it
      const partial = cleaned.match(/\{[\s\S]*/)
      if (partial) {
        // Count unclosed quotes and braces, try to close them
        let fixed = partial[0]
        const openBraces = (fixed.match(/\{/g) || []).length
        const closeBraces = (fixed.match(/\}/g) || []).length
        // Close unclosed string if needed
        const quoteCount = (fixed.match(/"/g) || []).length
        if (quoteCount % 2 !== 0) fixed += '"'
        // Close braces
        for (let i = 0; i < openBraces - closeBraces; i++) fixed += '}'
        try {
          const market = JSON.parse(fixed)
          return Response.json(market)
        } catch {
          // fall through
        }
      }
      return Response.json({ error: 'Could not parse AI response. Please try again.' }, { status: 400 })
    }
    const market = JSON.parse(jsonMatch[0])
    return Response.json(market)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Create market error:', message)
    return Response.json({ error: message }, { status: 500 })
  }
}
