'use client'

import { useMutation } from '@tanstack/react-query'
import { useInterwovenKit } from '@initia/interwovenkit-react'
import { motion } from 'motion/react'

const AUTOSIGN_CHAIN_ID = 'initiapredict-1'

function AutoSignToggleInner() {
  const { autoSign, address } = useInterwovenKit()

  const enable = useMutation({
    mutationFn: () => autoSign.enable(AUTOSIGN_CHAIN_ID),
    onError: (error: unknown) => console.error('Failed to enable auto-sign:', error),
  })

  const disable = useMutation({
    mutationFn: () => autoSign.disable(AUTOSIGN_CHAIN_ID),
    onError: (error: unknown) => console.error('Failed to disable auto-sign:', error),
  })

  if (!address) return null

  const isEnabled = autoSign?.isEnabledByChain?.[AUTOSIGN_CHAIN_ID]
  const isLoading = autoSign?.isLoading || enable.isPending || disable.isPending

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => (isEnabled ? disable.mutate() : enable.mutate())}
      disabled={isLoading}
      className="px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all duration-300 disabled:opacity-40 flex items-center gap-1.5"
      style={{
        background: isEnabled ? 'rgba(16, 185, 129, 0.08)' : 'rgba(139, 92, 246, 0.06)',
        border: isEnabled ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(139, 92, 246, 0.12)',
        color: isEnabled ? '#10b981' : '#8b85a0',
      }}
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      {isLoading ? '...' : isEnabled ? 'Auto-Sign ON' : 'Enable Auto-Sign'}
    </motion.button>
  )
}

export default function AutoSignToggle() {
  try {
    return <AutoSignToggleInner />
  } catch {
    // Gracefully hide if chain not fully resolved yet
    return null
  }
}
