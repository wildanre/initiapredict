'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
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
    return (
      <div className="py-20">
        <div className="glass-card max-w-2xl mx-auto p-8 text-center">
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 animate-spin text-violet-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-[#8b85a0] text-sm">Loading market data...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!market) {
    return (
      <div className="py-20">
        <div className="glass-card max-w-md mx-auto p-8 text-center">
          <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-rose-500/20 to-rose-500/5 border border-rose-500/15 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-[#8b85a0]">Market #{marketId} not found</p>
        </div>
      </div>
    )
  }

  const yesBps = Math.round(market.yesPrice * 100)
  const noBps = Math.round(market.noPrice * 100)

  return (
    <div>
      {/* Market Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-6 mb-6"
      >
        <div className="flex items-center gap-2.5 mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-400">{market.category}</span>
          {market.resolved ? (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(139,92,246,0.08)] text-[#8b85a0] border border-[rgba(139,92,246,0.1)]">Resolved</span>
          ) : (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(16,185,129,0.08)] text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-dot" />
              Live
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold text-[#f0eef6] mb-2">{market.question}</h1>
        <p className="text-[#8b85a0] text-sm mb-4">{market.description}</p>
        <div className="flex gap-4 text-xs text-[#4e4868]">
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
            Market #{marketId}
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Ends: {new Date(market.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Current Odds */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/15 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="font-bold text-[#f0eef6]">Current Odds</h2>
            </div>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-[#8b85a0]">Yes</span>
                  <span className="text-sm font-mono font-semibold text-emerald-400">{market.yesPrice.toFixed(1)}%</span>
                </div>
                <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(16, 185, 129, 0.06)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.3), rgba(16, 185, 129, 0.7))', boxShadow: '0 0 12px rgba(16, 185, 129, 0.3)' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${market.yesPrice}%` }}
                    transition={{ duration: 1.5, ease: [0.25, 0.4, 0, 1] }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-[#8b85a0]">No</span>
                  <span className="text-sm font-mono font-semibold text-rose-400">{market.noPrice.toFixed(1)}%</span>
                </div>
                <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(244, 63, 94, 0.06)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, rgba(244, 63, 94, 0.3), rgba(244, 63, 94, 0.7))', boxShadow: '0 0 12px rgba(244, 63, 94, 0.3)' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${market.noPrice}%` }}
                    transition={{ duration: 1.5, ease: [0.25, 0.4, 0, 1] }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

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
