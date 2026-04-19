'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'motion/react'
import NavButtons from './NavButtons'

const navItems = [
  { label: 'Markets', href: '/markets' },
  { label: 'Create', href: '/create' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Leaderboard', href: '/leaderboard' },
]

export default function NavBar() {
  const pathname = usePathname()

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.4, 0, 1] }}
      className="sticky top-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="mt-3 rounded-2xl px-5 py-3 flex justify-between items-center"
          style={{
            background: 'rgba(14, 14, 24, 0.7)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(139, 92, 246, 0.08)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.03)',
          }}
        >
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-shadow">
                iP
              </div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                InitiaPredict
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-0.5">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="nav-link relative text-sm font-medium"
                    style={{ color: isActive ? '#f0eef6' : '#8b85a0' }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 rounded-lg"
                        style={{
                          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(6, 182, 212, 0.08))',
                          border: '1px solid rgba(139, 92, 246, 0.15)',
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <NavButtons />
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
