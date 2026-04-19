'use client'

import { motion, useMotionValue, useSpring } from 'motion/react'
import { useRef, type ReactNode } from 'react'

interface MagnetProps {
  children: ReactNode
  className?: string
  strength?: number
}

export default function Magnet({
  children,
  className = '',
  strength = 0.3,
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 200, damping: 20 })
  const springY = useSpring(y, { stiffness: 200, damping: 20 })

  function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((event.clientX - centerX) * strength)
    y.set((event.clientY - centerY) * strength)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
