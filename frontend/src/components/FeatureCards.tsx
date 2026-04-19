'use client'

import { motion } from 'motion/react'
import FadeIn from '@/components/motion/FadeIn'

const features = [
  {
    title: 'AI Market Analyst',
    desc: 'Every market has an AI analyst. Ask questions, get probability estimates and key driving factors in real-time.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    gradient: 'from-violet-500/20 to-violet-500/5',
    iconColor: 'text-violet-400',
    borderColor: 'border-violet-500/10',
  },
  {
    title: 'Cross-Platform Intel',
    desc: 'Compare odds with Polymarket in real-time. Spot price discrepancies and arbitrage opportunities instantly.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    gradient: 'from-cyan-500/20 to-cyan-500/5',
    iconColor: 'text-cyan-400',
    borderColor: 'border-cyan-500/10',
  },
  {
    title: 'Instant Trading',
    desc: '100ms block times on your own appchain. All transaction fees become your revenue. Zero latency execution.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    gradient: 'from-emerald-500/20 to-emerald-500/5',
    iconColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/10',
  },
]

export default function FeatureCards() {
  return (
    <section className="grid md:grid-cols-3 gap-5 mb-20">
      {features.map((f, index) => (
        <FadeIn key={f.title} delay={index * 0.15} direction="up">
          <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`glass-card p-6 group cursor-default border-gradient`}
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.gradient} border ${f.borderColor} flex items-center justify-center mb-4 ${f.iconColor} group-hover:scale-110 transition-transform duration-300`}>
              {f.icon}
            </div>
            <h3 className="font-semibold text-[#f0eef6] mb-2 text-[15px]">{f.title}</h3>
            <p className="text-[#8b85a0] text-sm leading-relaxed">{f.desc}</p>
          </motion.div>
        </FadeIn>
      ))}
    </section>
  )
}
