'use client'

import { useInterwovenKit } from '@initia/interwovenkit-react'
import { ErrorBoundary } from 'react-error-boundary'

function WalletButtonInner() {
  const { address, username, isConnected, openConnect, openWallet } =
    useInterwovenKit()

  if (!isConnected) {
    return (
      <button
        onClick={openConnect}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
      >
        Connect Wallet
      </button>
    )
  }

  const displayName = username || (address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '')

  return (
    <button
      onClick={openWallet}
      className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition font-medium"
    >
      {displayName}
    </button>
  )
}

export default function WalletButton() {
  return (
    <ErrorBoundary fallback={<button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium opacity-50" disabled>Wallet</button>}>
      <WalletButtonInner />
    </ErrorBoundary>
  )
}
