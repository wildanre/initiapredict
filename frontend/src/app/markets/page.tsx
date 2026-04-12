import Link from 'next/link'
import { getActiveEvents, parseOutcomePrices } from '@/lib/polymarket'

export default async function MarketsPage() {
  const events = await getActiveEvents(20)

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Markets</h1>
      <p className="text-zinc-500 mb-6 text-sm">Browse prediction markets and trade YES/NO shares</p>

      <div className="grid gap-3">
        {events.map((event) => {
          const market = event.markets?.[0]
          if (!market) return null
          const odds = parseOutcomePrices(market.outcomePrices || '["0.5","0.5"]')
          return (
            <Link
              key={event.id}
              href={`/markets/${event.id}`}
              className="bg-zinc-900 rounded-lg p-4 border border-zinc-800 hover:border-zinc-700 transition"
            >
              <div className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-zinc-100 text-sm truncate">{market.question || event.title}</h3>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    Vol: ${(event.volume24hr || 0).toLocaleString()} · Liq: ${(event.liquidity || 0).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-center">
                    <div className="text-emerald-400 font-bold text-sm font-mono">{odds.yes.toFixed(0)}%</div>
                    <div className="text-zinc-600 text-[10px]">YES</div>
                  </div>
                  <div className="w-24 space-y-1">
                    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500/70 rounded-full" style={{ width: `${odds.yes}%` }} />
                    </div>
                    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500/70 rounded-full" style={{ width: `${odds.no}%` }} />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-red-400 font-bold text-sm font-mono">{odds.no.toFixed(0)}%</div>
                    <div className="text-zinc-600 text-[10px]">NO</div>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
