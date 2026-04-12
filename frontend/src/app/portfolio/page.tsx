'use client'

import { useAccount } from 'wagmi'

export default function PortfolioPage() {
  const { address, isConnected } = useAccount()

  if (!isConnected) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-white mb-3">Portfolio</h1>
        <p className="text-zinc-500">Connect your wallet to view your positions</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Portfolio</h1>
      <p className="text-zinc-500 text-sm mb-6">Your positions and P&L across all markets</p>

      <div className="bg-zinc-900 rounded-lg p-8 border border-zinc-800 text-center">
        <p className="text-zinc-400 font-mono text-sm">Connected as: {address}</p>
        <p className="text-zinc-600 text-sm mt-2">
          Your positions will appear here once you start trading.
        </p>
      </div>
    </div>
  )
}
