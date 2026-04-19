'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'

interface SplitTextProps {
  text: string
  className?: string
  delay?: number
  animationFrom?: { opacity: number; transform: string }
  animationTo?: { opacity: number; transform: string }
  threshold?: number
  textAlign?: 'left' | 'center' | 'right'
}

export default function SplitText({
  text,
  className = '',
  delay = 50,
  animationFrom = { opacity: 0, transform: 'translateY(40px)' },
  animationTo = { opacity: 1, transform: 'translateY(0)' },
  threshold = 0.1,
  textAlign = 'center',
}: SplitTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: threshold })
  const [words, setWords] = useState<string[]>([])

  useEffect(() => {
    setWords(text.split(' '))
  }, [text])

  return (
    <span
      ref={ref}
      className={className}
      style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '0.3em', justifyContent: textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start' }}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} style={{ display: 'inline-flex', overflow: 'hidden' }}>
          {word.split('').map((char, charIndex) => {
            const globalIndex = words.slice(0, wordIndex).join(' ').length + charIndex + (wordIndex > 0 ? 1 : 0)
            return (
              <motion.span
                key={`${wordIndex}-${charIndex}`}
                initial={animationFrom}
                animate={isInView ? animationTo : animationFrom}
                transition={{
                  duration: 0.4,
                  delay: globalIndex * (delay / 1000),
                  ease: [0.25, 0.4, 0, 1],
                }}
                style={{ display: 'inline-block' }}
              >
                {char}
              </motion.span>
            )
          })}
        </span>
      ))}
    </span>
  )
}
