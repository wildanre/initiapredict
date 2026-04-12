'use client'

import { useMutation } from '@tanstack/react-query'
import { useInterwovenKit } from '@initia/interwovenkit-react'

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
    <button
      onClick={() => (isEnabled ? disable.mutate() : enable.mutate())}
      disabled={isLoading}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
        isEnabled
          ? 'bg-green-100 text-green-800 border border-green-300'
          : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
      } disabled:opacity-50`}
    >
      {isLoading ? '...' : isEnabled ? '⚡ Auto-Sign ON' : '⚡ Enable Auto-Sign'}
    </button>
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
