'use client'

import { useInterwovenKit } from '@initia/interwovenkit-react'
import { ErrorBoundary } from 'react-error-boundary'
import { motion } from 'motion/react'

function WalletButtonInner() {
  const { address, username, isConnected, openConnect, openWallet } =
    useInterwovenKit()

  if (!isConnected) {
    return (
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={openConnect}
        className="px-4 py-2 rounded-xl font-semibold text-white text-sm transition-all duration-300"
        style={{
          background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
          boxShadow: '0 4px 20px rgba(139, 92, 246, 0.25)',
        }}
      >
        Connect Wallet
      </motion.button>
    )
  }

  const displayName = username || (address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '')

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={openWallet}
      className="px-4 py-2 rounded-xl font-medium text-white text-sm transition-all duration-300"
      style={{
        background: 'rgba(139, 92, 246, 0.12)',
        border: '1px solid rgba(139, 92, 246, 0.2)',
      }}
    >
      {displayName}
    </motion.button>
  )
}

export default function WalletButton() {
  return (
    <ErrorBoundary fallback={
      <button
        className="px-4 py-2 rounded-xl font-medium text-white text-sm opacity-40"
        style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}
        disabled
      >
        Wallet
      </button>
    }>
      <WalletButtonInner />
    </ErrorBoundary>
  )
}
