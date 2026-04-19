'use client'

import { useRef, useEffect, useState } from 'react'
import { useInView, animate } from 'motion/react'

interface CountUpProps {
  to: number
  from?: number
  duration?: number
  className?: string
  suffix?: string
  prefix?: string
  decimals?: number
}

export default function CountUp({
  to,
  from = 0,
  duration = 2,
  className = '',
  suffix = '',
  prefix = '',
  decimals = 0,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const [value, setValue] = useState(from)

  useEffect(() => {
    if (!isInView) return
    const controls = animate(from, to, {
      duration,
      ease: [0.25, 0.4, 0, 1],
      onUpdate: (latest) => setValue(latest),
    })
    return () => controls.stop()
  }, [isInView, from, to, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}{value.toFixed(decimals)}{suffix}
    </span>
  )
}
