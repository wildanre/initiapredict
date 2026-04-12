import { getActiveEvents, searchEvents } from '@/lib/polymarket'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q')
  const limit = parseInt(searchParams.get('limit') || '20')

  if (query) {
    const results = await searchEvents(query)
    return Response.json(results)
  }

  const events = await getActiveEvents(limit)
  return Response.json(events)
}
