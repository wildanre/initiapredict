'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useInView } from 'motion/react'

interface DecryptedTextProps {
  text: string
  className?: string
  speed?: number
  characters?: string
  revealDirection?: 'start' | 'end' | 'center'
  parentClassName?: string
  sequential?: boolean
  animateOn?: 'view' | 'hover'
}

export default function DecryptedText({
  text,
  className = '',
  speed = 60,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*',
  parentClassName = '',
  sequential = true,
  animateOn = 'view',
}: DecryptedTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const [displayText, setDisplayText] = useState(text.split('').map(() => ' '))
  const [isHovering, setIsHovering] = useState(false)
  const hasAnimated = useRef(false)

  const scramble = useCallback(() => {
    const originalChars = text.split('')
    let revealed = 0
    const interval = setInterval(() => {
      setDisplayText((prev) => {
        const next = [...prev]
        for (let i = 0; i < originalChars.length; i++) {
          if (i < revealed) {
            next[i] = originalChars[i]
          } else if (originalChars[i] === ' ') {
            next[i] = ' '
          } else {
            next[i] = characters[Math.floor(Math.random() * characters.length)]
          }
        }
        return next
      })
      revealed++
      if (revealed > originalChars.length) {
        clearInterval(interval)
        setDisplayText(originalChars)
      }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed, characters])

  useEffect(() => {
    if (animateOn === 'view' && isInView && !hasAnimated.current) {
      hasAnimated.current = true
      scramble()
    }
  }, [isInView, animateOn, scramble])

  useEffect(() => {
    if (animateOn === 'hover' && isHovering) {
      return scramble()
    }
  }, [isHovering, animateOn, scramble])

  return (
    <span
      ref={ref}
      className={parentClassName}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <span className={className} style={{ fontFamily: 'monospace' }}>
        {displayText.map((char, i) => (
          <span
            key={i}
            style={{
              opacity: char === ' ' && !hasAnimated.current ? 0 : 1,
              transition: 'opacity 0.1s',
            }}
          >
            {char}
          </span>
        ))}
      </span>
    </span>
  )
}
