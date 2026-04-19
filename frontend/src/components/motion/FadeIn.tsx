'use client'

import { motion } from 'motion/react'
import type { ReactNode } from 'react'

interface FadeInProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  duration?: number
  distance?: number
}

export default function FadeIn({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 0.6,
  distance = 30,
}: FadeInProps) {
  const directionMap = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...directionMap[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.4, 0, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
