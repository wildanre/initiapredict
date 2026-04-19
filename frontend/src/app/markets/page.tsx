import { getActiveEvents } from '@/lib/polymarket'
import MarketsClient from '@/components/MarketsClient'

export default async function MarketsPage() {
  const events = await getActiveEvents(20)

  return <MarketsClient events={events} />
}
