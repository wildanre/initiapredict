import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

export async function POST(req: Request) {
  const { messages, marketData }: {
    messages: { role: string; content: string }[]
    marketData: Record<string, unknown>
  } = await req.json()

  const systemPrompt = `You are a senior prediction market analyst at InitiaPredict.

Rules:
- Be direct and structured. Use short paragraphs.
- Start with your probability estimate and conviction level.
- Use bullet points for key factors.
- When comparing with Polymarket, explain the discrepancy.
- End with a clear recommendation (Buy Yes / Buy No / Hold).
- Keep responses under 200 words unless asked for detail.
- Do NOT use markdown headers (#). Use plain text with line breaks.
- Format numbers clearly: percentages, dollar amounts, dates.

Market context:
Question: ${marketData?.question || 'Unknown'}
Yes price: ${marketData?.yesPrice || 50}%
No price: ${marketData?.noPrice || 50}%
Polymarket odds: ${marketData?.polymarketOdds || 'Not available'}
Volume: ${marketData?.volume || 'Unknown'}
End date: ${marketData?.endDate || 'Unknown'}`

  // Convert messages to Gemini format
  const contents = messages.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' as const : 'user' as const,
    parts: [{ text: msg.content }],
  }))

  const response = await ai.models.generateContentStream({
    model: 'gemini-2.5-flash',
    contents,
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.7,
      maxOutputTokens: 2048,
    },
  })

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of response) {
          const text = chunk.text ?? ''
          if (text) {
            controller.enqueue(encoder.encode(text))
          }
        }
      } catch (error) {
        console.error('Streaming error:', error)
        controller.error(error)
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  })
}
