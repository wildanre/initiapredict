'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import TradePanel from '@/components/TradePanel'
import AIAnalystPanel from '@/components/AIAnalystPanel'
import type { OnChainMarket } from '@/hooks/useOnChainMarkets'

export default function MarketDetailPage() {
  const params = useParams()
  const marketId = Number(params.id) || 0
  const [market, setMarket] = useState<OnChainMarket | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMarket() {
      try {
        const res = await fetch('/api/on-chain-markets')
        const markets = await res.json()
        const found = markets.find((m: OnChainMarket) => m.id === marketId)
        setMarket(found || null)
      } catch (err) {
        console.error('Failed to fetch market:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchMarket()
    const interval = setInterval(fetchMarket, 10000)
    return () => clearInterval(interval)
  }, [marketId])

  if (loading) {
    return <div className="text-center py-20 text-zinc-500">Loading market data...</div>
  }

  if (!market) {
    return <div className="text-center py-20 text-zinc-500">Market #{marketId} not found</div>
  }

  const yesBps = Math.round(market.yesPrice * 100)
  const noBps = Math.round(market.noPrice * 100)

  return (
    <div>
      {/* Market Header */}
      <div className="bg-zinc-900 rounded-lg p-5 border border-zinc-800 mb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-indigo-400 font-medium uppercase">{market.category}</span>
          {market.resolved ? (
            <span className="text-[10px] text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded">Resolved</span>
          ) : (
            <span className="text-[10px] text-emerald-500 bg-emerald-900/30 px-1.5 py-0.5 rounded">Live</span>
          )}
        </div>
        <h1 className="text-xl font-bold text-white mb-1">{market.question}</h1>
        <p className="text-zinc-500 text-sm">{market.description}</p>
        <div className="flex gap-4 mt-3 text-xs text-zinc-600">
          <span>Market #{marketId}</span>
          <span>Ends: {new Date(market.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* Current Odds with bars */}
          <div className="bg-zinc-900 rounded-lg p-5 border border-zinc-800">
            <h2 className="font-semibold text-white mb-4">Current Odds</h2>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-zinc-400">Yes</span>
                  <span className="text-sm font-mono text-emerald-400">{market.yesPrice.toFixed(1)}%</span>
                </div>
                <div className="h-8 bg-zinc-800 rounded-md overflow-hidden">
                  <div className="h-full bg-emerald-500/30 border border-emerald-500/50 rounded-md transition-all" style={{ width: `${market.yesPrice}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-zinc-400">No</span>
                  <span className="text-sm font-mono text-red-400">{market.noPrice.toFixed(1)}%</span>
                </div>
                <div className="h-8 bg-zinc-800 rounded-md overflow-hidden">
                  <div className="h-full bg-red-500/30 border border-red-500/50 rounded-md transition-all" style={{ width: `${market.noPrice}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* AI Analyst */}
          <AIAnalystPanel
            marketData={{
              question: market.question,
              yesPrice: market.yesPrice,
              noPrice: market.noPrice,
              endDate: market.endDate,
            }}
          />
        </div>

        {/* Right: Trade Panel */}
        <div>
          <TradePanel
            marketId={marketId}
            yesPrice={yesBps}
            noPrice={noBps}
          />
        </div>
      </div>
    </div>
  )
}
