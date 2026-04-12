'use client'

import Link from 'next/link'
import { useOnChainMarkets } from '@/hooks/useOnChainMarkets'

export default function OnChainMarkets() {
  const { markets, loading } = useOnChainMarkets()

  if (loading) {
    return (
      <div className="text-center py-8 text-zinc-600 text-sm">
        Loading on-chain markets...
      </div>
    )
  }

  if (markets.length === 0) {
    return (
      <div className="text-center py-8 text-zinc-600 text-sm">
        No markets yet. Be the first to create one.
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
      {markets.map((m) => (
        <Link
          key={m.id}
          href={`/markets/${m.id}`}
          className="bg-zinc-900 rounded-lg p-4 border border-zinc-800 hover:border-zinc-700 transition"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] text-indigo-400 font-medium uppercase">{m.category || 'general'}</span>
            {m.resolved ? (
              <span className="text-[10px] text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded">Resolved</span>
            ) : (
              <span className="text-[10px] text-emerald-500 bg-emerald-900/30 px-1.5 py-0.5 rounded">Live</span>
            )}
          </div>
          <h3 className="font-medium text-zinc-100 mb-3 text-sm leading-snug line-clamp-2">
            {m.question}
          </h3>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 w-6">Yes</span>
              <div className="flex-1 h-5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500/80 rounded-full transition-all"
                  style={{ width: `${m.yesPrice}%` }}
                />
              </div>
              <span className="text-xs font-mono text-emerald-400 w-10 text-right">{m.yesPrice.toFixed(0)}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 w-6">No</span>
              <div className="flex-1 h-5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500/80 rounded-full transition-all"
                  style={{ width: `${m.noPrice}%` }}
                />
              </div>
              <span className="text-xs font-mono text-red-400 w-10 text-right">{m.noPrice.toFixed(0)}%</span>
            </div>
          </div>
          <div className="text-[10px] text-zinc-600 mt-2">
            Ends: {new Date(m.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </Link>
      ))}
    </div>
  )
}
