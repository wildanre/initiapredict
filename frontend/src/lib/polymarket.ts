const GAMMA_API = 'https://gamma-api.polymarket.com'

export interface PolymarketEvent {
  id: string
  title: string
  slug: string
  description: string
  image: string
  active: boolean
  volume: number
  volume24hr: number
  liquidity: number
  markets: PolymarketMarket[]
}

export interface PolymarketMarket {
  id: string
  question: string
  outcomePrices: string // JSON string: '["0.65","0.35"]'
  volume: number
  volume24hr: number
  liquidity: number
  endDate: string
  active: boolean
  image: string
}

export async function getActiveEvents(limit = 20): Promise<PolymarketEvent[]> {
  const res = await fetch(
    `${GAMMA_API}/events?active=true&closed=false&limit=${limit}&order=volume_24hr&ascending=false`,
    { next: { revalidate: 300 } } // cache 5 min (ISR)
  )
  if (!res.ok) return []
  return res.json()
}

export async function getEventBySlug(slug: string): Promise<PolymarketEvent | null> {
  const res = await fetch(`${GAMMA_API}/events/slug/${slug}`)
  if (!res.ok) return null
  return res.json()
}

export async function searchEvents(query: string): Promise<PolymarketEvent[]> {
  const res = await fetch(
    `${GAMMA_API}/events?active=true&closed=false&limit=5&order=volume_24hr&ascending=false`
  )
  if (!res.ok) return []
  const events: PolymarketEvent[] = await res.json()
  // Simple keyword filter since public-search may not work for all queries
  const keywords = query.toLowerCase().split(' ')
  return events.filter((e) =>
    keywords.some(
      (k) =>
        e.title?.toLowerCase().includes(k) ||
        e.markets?.some((m) => m.question?.toLowerCase().includes(k))
    )
  )
}

export function parseOutcomePrices(pricesStr: string): { yes: number; no: number } {
  try {
    const parsed = JSON.parse(pricesStr)
    const [yes, no] = parsed
    return { yes: parseFloat(yes) * 100, no: parseFloat(no) * 100 }
  } catch {
    return { yes: 50, no: 50 }
  }
}
