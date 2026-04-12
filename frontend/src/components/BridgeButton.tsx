'use client'

import { useInterwovenKit } from '@initia/interwovenkit-react'
import { ErrorBoundary } from 'react-error-boundary'

function BridgeButtonInner() {
  const { openBridge } = useInterwovenKit()

  return (
    <button
      onClick={() => openBridge()}
      className="px-3 py-1.5 bg-purple-100 text-purple-800 border border-purple-300 rounded-lg text-sm font-medium hover:bg-purple-200 transition"
    >
      🌉 Bridge Assets
    </button>
  )
}

export default function BridgeButton() {
  return (
    <ErrorBoundary fallback={<button className="px-3 py-1.5 bg-purple-100 text-purple-800 border border-purple-300 rounded-lg text-sm font-medium opacity-50" disabled>🌉 Bridge</button>}>
      <BridgeButtonInner />
    </ErrorBoundary>
  )
}
