'use client'

import { motion } from 'motion/react'
import FadeIn from '@/components/motion/FadeIn'

export default function LeaderboardPage() {
  const mockLeaders = [
    { rank: 1, name: 'satoshi.init', profit: '+2,450', trades: 47, winRate: '72%' },
    { rank: 2, name: 'vitalik.init', profit: '+1,890', trades: 35, winRate: '68%' },
    { rank: 3, name: 'trader3.init', profit: '+1,200', trades: 62, winRate: '55%' },
    { rank: 4, name: 'degen.init', profit: '+980', trades: 28, winRate: '64%' },
    { rank: 5, name: 'whale.init', profit: '+750', trades: 15, winRate: '80%' },
  ]

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1: return { gradient: 'from-amber-400 to-amber-600', glow: 'rgba(245, 158, 11, 0.15)', text: 'text-amber-400' }
      case 2: return { gradient: 'from-zinc-300 to-zinc-500', glow: 'rgba(161, 161, 170, 0.1)', text: 'text-zinc-300' }
      case 3: return { gradient: 'from-amber-600 to-amber-800', glow: 'rgba(180, 83, 9, 0.1)', text: 'text-amber-600' }
      default: return { gradient: 'from-violet-500/20 to-violet-500/5', glow: 'transparent', text: 'text-[#4e4868]' }
    }
  }

  return (
    <div>
      <FadeIn direction="up">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#f0eef6] mb-1">Leaderboard</h1>
          <p className="text-[#8b85a0] text-sm">Top traders by profit on InitiaPredict</p>
        </div>
      </FadeIn>

      <FadeIn direction="up" delay={0.1}>
        <div className="glass-card overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-5 gap-4 px-6 py-3 border-b border-[rgba(139,92,246,0.08)]">
            <div className="text-[10px] font-semibold text-[#4e4868] uppercase tracking-wider">Rank</div>
            <div className="text-[10px] font-semibold text-[#4e4868] uppercase tracking-wider">Trader</div>
            <div className="text-[10px] font-semibold text-[#4e4868] uppercase tracking-wider text-right">Profit</div>
            <div className="text-[10px] font-semibold text-[#4e4868] uppercase tracking-wider text-right">Trades</div>
            <div className="text-[10px] font-semibold text-[#4e4868] uppercase tracking-wider text-right">Win Rate</div>
          </div>

          {/* Rows */}
          {mockLeaders.map((l, index) => {
            const style = getRankStyle(l.rank)
            return (
              <motion.div
                key={l.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08, ease: [0.25, 0.4, 0, 1] }}
                className="grid grid-cols-5 gap-4 px-6 py-4 items-center transition-all duration-300 hover:bg-[rgba(139,92,246,0.03)] border-b border-[rgba(139,92,246,0.04)] last:border-0"
              >
                <div className="flex items-center gap-2">
                  {l.rank <= 3 ? (
                    <div
                      className={`w-7 h-7 rounded-lg bg-gradient-to-br ${style.gradient} flex items-center justify-center text-white text-xs font-bold`}
                      style={{ boxShadow: `0 4px 12px ${style.glow}` }}
                    >
                      {l.rank}
                    </div>
                  ) : (
                    <span className={`font-bold ${style.text} text-sm pl-1.5`}>#{l.rank}</span>
                  )}
                </div>
                <div className="font-medium text-[#f0eef6] text-sm">{l.name}</div>
                <div className="text-right text-emerald-400 font-mono text-sm font-semibold">{l.profit}</div>
                <div className="text-right text-[#8b85a0] text-sm">{l.trades}</div>
                <div className="text-right">
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      background: 'rgba(139, 92, 246, 0.08)',
                      color: '#8b5cf6',
                      border: '1px solid rgba(139, 92, 246, 0.12)',
                    }}
                  >
                    {l.winRate}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </FadeIn>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="text-xs text-[#4e4868] mt-6 text-center flex items-center justify-center gap-1.5"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Leaderboard uses .init usernames. Connect your wallet and register your .init name to appear here.
      </motion.p>
    </div>
  )
}
