'use client'

import Link from 'next/link'
import { useOnChainMarkets } from '@/hooks/useOnChainMarkets'
import { motion } from 'motion/react'

export default function OnChainMarkets() {
  const { markets, loading } = useOnChainMarkets()

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card p-5 animate-pulse">
            <div className="h-3 w-16 bg-[rgba(139,92,246,0.1)] rounded mb-3" />
            <div className="h-4 w-full bg-[rgba(139,92,246,0.08)] rounded mb-4" />
            <div className="h-3 w-2/3 bg-[rgba(139,92,246,0.06)] rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (markets.length === 0) {
    return (
      <div className="glass-card text-center py-12 px-6">
        <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-500/20 flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <p className="text-[#8b85a0] text-sm">No markets yet. Be the first to create one.</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {markets.map((m, index) => (
        <motion.div
          key={m.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.08, ease: [0.25, 0.4, 0, 1] }}
        >
          <Link
            href={`/markets/${m.id}`}
            className="glass-card block p-5 group"
          >
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-400">{m.category || 'general'}</span>
              {m.resolved ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(139,92,246,0.08)] text-[#8b85a0] border border-[rgba(139,92,246,0.1)]">Resolved</span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(16,185,129,0.08)] text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-dot" />
                  Live
                </span>
              )}
            </div>
            <h3 className="font-medium text-[#f0eef6] mb-4 text-sm leading-snug line-clamp-2 group-hover:text-white transition-colors">
              {m.question}
            </h3>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-medium text-[#8b85a0] w-6 uppercase">Yes</span>
                <div className="flex-1 h-2 bg-[rgba(16,185,129,0.06)] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.4), rgba(16, 185, 129, 0.8))' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${m.yesPrice}%` }}
                    transition={{ duration: 1.2, delay: index * 0.08 + 0.3, ease: [0.25, 0.4, 0, 1] }}
                  />
                </div>
                <span className="text-xs font-mono text-emerald-400 w-10 text-right">{m.yesPrice.toFixed(0)}%</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-medium text-[#8b85a0] w-6 uppercase">No</span>
                <div className="flex-1 h-2 bg-[rgba(244,63,94,0.06)] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, rgba(244, 63, 94, 0.4), rgba(244, 63, 94, 0.8))' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${m.noPrice}%` }}
                    transition={{ duration: 1.2, delay: index * 0.08 + 0.3, ease: [0.25, 0.4, 0, 1] }}
                  />
                </div>
                <span className="text-xs font-mono text-rose-400 w-10 text-right">{m.noPrice.toFixed(0)}%</span>
              </div>
            </div>
            <div className="text-[10px] text-[#4e4868] mt-3 flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Ends: {new Date(m.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
