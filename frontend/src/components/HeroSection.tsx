'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import SplitText from '@/components/motion/SplitText'
import GradientText from '@/components/motion/GradientText'
import DecryptedText from '@/components/motion/DecryptedText'
import Magnet from '@/components/motion/Magnet'

export default function HeroSection() {
  return (
    <section className="relative text-center py-24 mb-16 overflow-hidden">
      {/* Hero background glow */}
      <div className="hero-glow top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Floating orbs */}
      <motion.div
        className="absolute top-20 left-[15%] w-2 h-2 rounded-full bg-violet-500/30"
        animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-40 right-[20%] w-1.5 h-1.5 rounded-full bg-cyan-500/30"
        animate={{ y: [0, -15, 0], opacity: [0.2, 0.6, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <motion.div
        className="absolute bottom-20 left-[30%] w-1 h-1 rounded-full bg-rose-500/30"
        animate={{ y: [0, -12, 0], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />

      {/* Version badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.4, 0, 1] }}
        className="mb-8"
      >
        <span
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium"
          style={{
            background: 'rgba(139, 92, 246, 0.08)',
            border: '1px solid rgba(139, 92, 246, 0.15)',
            color: '#8b5cf6',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500 live-dot" />
          Powered by Initia Appchain
        </span>
      </motion.div>

      {/* Main headline */}
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 relative z-10">
        <SplitText
          text="Predict. Trade."
          className="text-[#f0eef6] block mb-2"
          delay={40}
        />
        <GradientText
          className="text-5xl md:text-6xl lg:text-7xl font-bold"
          colors={['#8b5cf6', '#06b6d4', '#ec4899', '#8b5cf6']}
          animationSpeed={5}
        >
          Earn.
        </GradientText>
      </h1>

      {/* Subtitle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="mb-10"
      >
        <p className="text-lg text-[#8b85a0] max-w-xl mx-auto leading-relaxed">
          <DecryptedText
            text="AI-powered prediction markets on your own Initia appchain. Real-time analysis meets on-chain trading."
            speed={20}
            className="text-lg"
          />
        </p>
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="flex gap-4 justify-center"
      >
        <Magnet strength={0.15}>
          <Link
            href="/markets"
            className="group relative px-7 py-3 rounded-2xl font-semibold text-white text-sm overflow-hidden transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
              boxShadow: '0 4px 24px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Explore Markets
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </Link>
        </Magnet>
        <Magnet strength={0.15}>
          <Link
            href="/create"
            className="group px-7 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 flex items-center gap-2"
            style={{
              color: '#f0eef6',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              background: 'rgba(139, 92, 246, 0.06)',
            }}
          >
            Create with AI
            <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </Link>
        </Magnet>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.6 }}
        className="mt-16 flex justify-center gap-12"
      >
        {[
          { label: 'Block Time', value: '100ms' },
          { label: 'Markets', value: 'Live' },
          { label: 'AI Analysis', value: 'Real-time' },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-sm font-mono font-semibold text-violet-400">{stat.value}</div>
            <div className="text-[10px] text-[#4e4868] uppercase tracking-wider mt-0.5">{stat.label}</div>
          </div>
        ))}
      </motion.div>
    </section>
  )
}
