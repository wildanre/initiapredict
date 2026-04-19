'use client'

import { useInterwovenKit } from '@initia/interwovenkit-react'
import { ErrorBoundary } from 'react-error-boundary'
import { motion } from 'motion/react'

function BridgeButtonInner() {
  const { openBridge } = useInterwovenKit()

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => openBridge()}
      className="px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-1.5"
      style={{
        color: '#8b85a0',
        border: '1px solid rgba(139, 92, 246, 0.12)',
        background: 'rgba(139, 92, 246, 0.04)',
      }}
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
      Bridge Assets
    </motion.button>
  )
}

export default function BridgeButton() {
  return (
    <ErrorBoundary fallback={
      <button
        className="px-3.5 py-1.5 rounded-xl text-sm font-medium opacity-40"
        style={{ color: '#8b85a0', border: '1px solid rgba(139, 92, 246, 0.12)', background: 'rgba(139, 92, 246, 0.04)' }}
        disabled
      >
        Bridge
      </button>
    }>
      <BridgeButtonInner />
    </ErrorBoundary>
  )
}
