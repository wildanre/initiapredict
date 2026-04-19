'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import FadeIn from '@/components/motion/FadeIn'

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

export default function PolymarketGrid({ events }: { events: PolymarketEvent[] }) {
  return (
    <section className="mb-12">
      <FadeIn direction="up">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#f0eef6]">Trending on Polymarket</h2>
            <p className="text-xs text-[#4e4868] mt-0.5">Cross-platform market intelligence</p>
          </div>
          <Link
            href="/markets"
            className="text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1.5"
          >
            View all
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </FadeIn>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event, index) => {
          const market = event.markets?.[0]
          if (!market) return null
          const odds = parseOutcomePrices(market.outcomePrices || '["0.5","0.5"]')
          return (
            <FadeIn key={event.id} delay={index * 0.08} direction="up">
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="glass-card p-5 group cursor-default h-full"
              >
                <h3 className="font-medium text-[#f0eef6] mb-4 line-clamp-2 text-sm leading-snug group-hover:text-white transition-colors">
                  {market.question || event.title}
                </h3>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-medium text-[#8b85a0] w-6 uppercase">Yes</span>
                    <div className="flex-1 h-2 bg-[rgba(16,185,129,0.06)] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.4), rgba(16, 185, 129, 0.8))' }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${odds.yes}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.08 + 0.2, ease: [0.25, 0.4, 0, 1] }}
                      />
                    </div>
                    <span className="text-xs font-mono text-emerald-400 w-10 text-right">{odds.yes.toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-medium text-[#8b85a0] w-6 uppercase">No</span>
                    <div className="flex-1 h-2 bg-[rgba(244,63,94,0.06)] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg, rgba(244, 63, 94, 0.4), rgba(244, 63, 94, 0.8))' }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${odds.no}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.08 + 0.2, ease: [0.25, 0.4, 0, 1] }}
                      />
                    </div>
                    <span className="text-xs font-mono text-rose-400 w-10 text-right">{odds.no.toFixed(0)}%</span>
                  </div>
                </div>
                <div className="text-[10px] text-[#4e4868] mt-3 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                    Vol: ${(event.volume24hr || 0).toLocaleString()}
                  </span>
                </div>
              </motion.div>
            </FadeIn>
          )
        })}
      </div>
    </section>
  )
}
