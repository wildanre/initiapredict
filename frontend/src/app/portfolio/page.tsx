'use client'

import { useAccount } from 'wagmi'
import { motion } from 'motion/react'
import FadeIn from '@/components/motion/FadeIn'
import Link from 'next/link'

export default function PortfolioPage() {
  const { address, isConnected } = useAccount()

  if (!isConnected) {
    return (
      <div className="py-20">
        <FadeIn direction="up">
          <div className="glass-card max-w-md mx-auto p-10 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-violet-500/15 to-cyan-500/10 border border-violet-500/15 flex items-center justify-center mb-5">
              <svg className="w-8 h-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#f0eef6] mb-2">Portfolio</h1>
            <p className="text-[#8b85a0] text-sm mb-6">Connect your wallet to view your positions and trading history</p>
          </div>
        </FadeIn>
      </div>
    )
  }

  return (
    <div>
      <FadeIn direction="up">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#f0eef6] mb-1">Portfolio</h1>
          <p className="text-[#8b85a0] text-sm">Your positions and P&L across all markets</p>
        </div>
      </FadeIn>

      <FadeIn direction="up" delay={0.1}>
        <div className="glass-card p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-[10px] text-[#4e4868] uppercase tracking-wider font-medium">Connected as</span>
          </div>
          <p className="font-mono text-sm px-4 py-2 rounded-xl inline-flex items-center gap-2" style={{ background: 'rgba(139, 92, 246, 0.06)', border: '1px solid rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {address}
          </p>
          <div className="mt-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-violet-500/10 to-cyan-500/5 border border-violet-500/10 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-[#4e4868]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-[#8b85a0] text-sm mb-5">
              Your positions will appear here once you start trading.
            </p>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/markets"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                  boxShadow: '0 4px 20px rgba(139, 92, 246, 0.25)',
                }}
              >
                Explore Markets
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </div>
      </FadeIn>
    </div>
  )
}
