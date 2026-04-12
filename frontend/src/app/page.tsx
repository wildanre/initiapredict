import Link from 'next/link'
import { getActiveEvents, parseOutcomePrices } from '@/lib/polymarket'
import OnChainMarkets from '@/components/OnChainMarkets'

function OddsBar({ yes, no }: { yes: number; no: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-400 w-7">Yes</span>
        <div className="flex-1 h-5 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500/80 rounded-full transition-all" style={{ width: `${yes}%` }} />
        </div>
        <span className="text-xs font-mono text-emerald-400 w-10 text-right">{yes.toFixed(0)}%</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-400 w-7">No</span>
        <div className="flex-1 h-5 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-red-500/80 rounded-full transition-all" style={{ width: `${no}%` }} />
        </div>
        <span className="text-xs font-mono text-red-400 w-10 text-right">{no.toFixed(0)}%</span>
      </div>
    </div>
  )
}

export default async function HomePage() {
  const events = await getActiveEvents(6)

  return (
    <div>
      <section className="text-center py-20 mb-12">
        <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
          Predict. Trade. <span className="text-indigo-400">Earn.</span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-xl mx-auto mb-8">
          AI-powered prediction market on your own Initia appchain.
          Trade with real-time AI analysis and cross-platform intelligence.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/markets" className="px-6 py-2.5 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-500 transition">
            Explore Markets
          </Link>
          <Link href="/create" className="px-6 py-2.5 text-zinc-300 border border-zinc-700 rounded-md font-medium hover:bg-zinc-800 transition">
            Create with AI
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4 mb-16">
        {[
          { title: 'AI Market Analyst', desc: 'Every market has an AI analyst. Ask questions, get probability estimates and key factors.' },
          { title: 'Cross-Platform Intel', desc: 'Compare odds with Polymarket in real-time. Spot price discrepancies and opportunities.' },
          { title: 'Instant Trading', desc: '100ms block times on your own appchain. All transaction fees are your revenue.' },
        ].map((f) => (
          <div key={f.title} className="bg-zinc-900 rounded-lg p-5 border border-zinc-800">
            <h3 className="font-semibold text-white mb-2">{f.title}</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      <section className="mb-12">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold text-white">Live Markets</h2>
          <Link href="/create" className="text-indigo-400 hover:text-indigo-300 text-sm">Create new</Link>
        </div>
        <OnChainMarkets />
      </section>

      <section>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold text-white">Trending on Polymarket</h2>
          <Link href="/markets" className="text-indigo-400 hover:text-indigo-300 text-sm">View all</Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {events.map((event) => {
            const market = event.markets?.[0]
            if (!market) return null
            const odds = parseOutcomePrices(market.outcomePrices || '["0.5","0.5"]')
            return (
              <div key={event.id} className="bg-zinc-900 rounded-lg p-4 border border-zinc-800 hover:border-zinc-700 transition">
                <h3 className="font-medium text-zinc-100 mb-3 line-clamp-2 text-sm leading-snug">
                  {market.question || event.title}
                </h3>
                <OddsBar yes={odds.yes} no={odds.no} />
                <div className="text-xs text-zinc-600 mt-2">
                  Vol: ${(event.volume24hr || 0).toLocaleString()}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
