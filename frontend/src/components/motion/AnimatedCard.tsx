'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { useRef, type ReactNode } from 'react'

interface AnimatedCardProps {
  children: ReactNode
  className?: string
  delay?: number
  glowColor?: string
}

export default function AnimatedCard({
  children,
  className = '',
  delay = 0,
  glowColor = 'rgba(139, 92, 246, 0.15)',
}: AnimatedCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-100, 100], [6, -6]), {
    stiffness: 300,
    damping: 30,
  })
  const rotateY = useSpring(useTransform(x, [-100, 100], [-6, 6]), {
    stiffness: 300,
    damping: 30,
  })

  function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set(event.clientX - rect.left - rect.width / 2)
    y.set(event.clientY - rect.top - rect.height / 2)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.4, 0, 1],
      }}
      whileHover={{ scale: 1.02 }}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      className={className}
    >
      <div
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glowColor}, transparent 40%)`,
        }}
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      />
      {children}
    </motion.div>
  )
}
