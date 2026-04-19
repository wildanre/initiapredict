'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import FadeIn from '@/components/motion/FadeIn'
import OnChainMarkets from '@/components/OnChainMarkets'

interface PolymarketEvent {
  id: string
  title: string
  volume24hr?: number
  liquidity?: number
  markets?: Array<{
    question?: string
    outcomePrices?: string
  }>
}

function parseOutcomePrices(pricesStr: string) {
  try {
    const prices = JSON.parse(pricesStr)
    return {
      yes: parseFloat(prices[0]) * 100,
      no: parseFloat(prices[1]) * 100,
    }
  } catch {
    return { yes: 50, no: 50 }
  }
}

export default function MarketsClient({ events }: { events: PolymarketEvent[] }) {
  return (
    <div>
      <FadeIn direction="up">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#f0eef6] mb-1">Markets</h1>
          <p className="text-[#8b85a0] text-sm">Browse prediction markets and trade YES/NO shares</p>
        </div>
      </FadeIn>

      {/* Live On-Chain Markets Section */}
      <FadeIn direction="up" delay={0.1}>
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-[#f0eef6] flex items-center gap-2">
                Live Markets
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(16,185,129,0.08)] text-emerald-400 border border-emerald-500/20 flex items-center gap-1 font-normal">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-dot" />
                  On-chain
                </span>
              </h2>
              <p className="text-xs text-[#4e4868] mt-0.5">Trade directly on InitiaPredict appchain</p>
            </div>
            <Link
              href="/create"
              className="text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1.5"
            >
              Create new
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Link>
          </div>
          <OnChainMarkets />
        </section>
      </FadeIn>

      {/* Divider */}
      <div className="relative my-10">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[rgba(139,92,246,0.08)]" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-4 text-[10px] uppercase tracking-wider font-medium text-[#4e4868]" style={{ background: '#06060a' }}>
            Cross-Platform Intelligence
          </span>
        </div>
      </div>

      {/* Polymarket Events Section */}
      <FadeIn direction="up" delay={0.2}>
        <section>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-[#f0eef6]">Polymarket Events</h2>
              <p className="text-xs text-[#4e4868] mt-0.5">Compare odds and spot opportunities</p>
            </div>
          </div>

          <div className="grid gap-3">
            {events.map((event, index) => {
              const market = event.markets?.[0]
              if (!market) return null
              const odds = parseOutcomePrices(market.outcomePrices || '["0.5","0.5"]')
              return (
                <FadeIn key={event.id} delay={index * 0.04} direction="up">
                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <Link
                      href={`/markets/${event.id}`}
                      className="glass-card block p-5 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-[#f0eef6] text-sm truncate group-hover:text-white transition-colors">{market.question || event.title}</h3>
                          <p className="text-[10px] text-[#4e4868] mt-1 flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                              </svg>
                              Vol: ${(event.volume24hr || 0).toLocaleString()}
                            </span>
                            <span>Liq: ${(event.liquidity || 0).toLocaleString()}</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                          <div className="text-center">
                            <div className="text-emerald-400 font-bold text-sm font-mono">{odds.yes.toFixed(0)}%</div>
                            <div className="text-[#4e4868] text-[9px] uppercase tracking-wider">YES</div>
                          </div>
                          <div className="w-28 space-y-1.5">
                            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(16, 185, 129, 0.06)' }}>
                              <motion.div
                                className="h-full rounded-full"
                                style={{ background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.4), rgba(16, 185, 129, 0.8))' }}
                                initial={{ width: 0 }}
                                whileInView={{ width: `${odds.yes}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: index * 0.04 + 0.2, ease: [0.25, 0.4, 0, 1] }}
                              />
                            </div>
                            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(244, 63, 94, 0.06)' }}>
                              <motion.div
                                className="h-full rounded-full"
                                style={{ background: 'linear-gradient(90deg, rgba(244, 63, 94, 0.4), rgba(244, 63, 94, 0.8))' }}
                                initial={{ width: 0 }}
                                whileInView={{ width: `${odds.no}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: index * 0.04 + 0.2, ease: [0.25, 0.4, 0, 1] }}
                              />
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-rose-400 font-bold text-sm font-mono">{odds.no.toFixed(0)}%</div>
                            <div className="text-[#4e4868] text-[9px] uppercase tracking-wider">NO</div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                </FadeIn>
              )
            })}
          </div>
        </section>
      </FadeIn>
    </div>
  )
}
