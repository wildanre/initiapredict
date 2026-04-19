'use client'

import { motion } from 'motion/react'
import type { ReactNode } from 'react'

interface GradientTextProps {
  children: ReactNode
  className?: string
  colors?: string[]
  animationSpeed?: number
}

export default function GradientText({
  children,
  className = '',
  colors = ['#8b5cf6', '#06b6d4', '#8b5cf6', '#ec4899', '#8b5cf6'],
  animationSpeed = 4,
}: GradientTextProps) {
  const gradient = `linear-gradient(90deg, ${colors.join(', ')})`

  return (
    <motion.span
      className={className}
      style={{
        backgroundImage: gradient,
        backgroundSize: '300% 100%',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        color: 'transparent',
        display: 'inline-block',
      }}
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      }}
      transition={{
        duration: animationSpeed,
        ease: 'linear',
        repeat: Infinity,
      }}
    >
      {children}
    </motion.span>
  )
}
