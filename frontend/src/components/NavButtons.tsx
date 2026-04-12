'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useInterwovenKit } from '@initia/interwovenkit-react'
import { useAccount } from 'wagmi'

const NETWORK_INFO = {
  name: 'InitiaPredict',
  rpc: 'https://rpc.evently-organizer.site',
  chainId: '3870930772978779',
  symbol: 'GAS',
  decimals: '18',
}

function CopyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-zinc-500 text-xs">{label}</span>
      <button
        onClick={() => navigator.clipboard.writeText(value)}
        className="text-xs font-mono text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded hover:bg-zinc-700 transition"
      >
        {value.length > 30 ? value.slice(0, 30) + '...' : value}
      </button>
    </div>
  )
}

export default function NavButtons() {
  const [showNetworkModal, setShowNetworkModal] = useState(false)
  const [faucetLoading, setFaucetLoading] = useState(false)
  const [faucetMsg, setFaucetMsg] = useState('')
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const { address: initiaAddress, username, isConnected: initiaConnected, openConnect, openWallet, openBridge } =
    useInterwovenKit()
  const { address: evmAddress, isConnected: evmConnected } = useAccount()

  const requestFaucet = async () => {
    if (!evmAddress || faucetLoading) return
    setFaucetLoading(true)
    setFaucetMsg('')
    try {
      const res = await fetch('/api/faucet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: evmAddress }),
      })
      const data = await res.json()
      if (data.success) {
        setFaucetMsg('100 GAS sent!')
      } else {
        setFaucetMsg(data.error || 'Failed')
      }
      setTimeout(() => setFaucetMsg(''), 4000)
    } catch {
      setFaucetMsg('Error')
    } finally {
      setFaucetLoading(false)
    }
  }

  return (
    <>
      {!evmConnected ? (
        <button
          onClick={() => setShowNetworkModal(true)}
          className="px-3 py-1.5 text-emerald-400 border border-emerald-800 rounded-md text-sm font-medium hover:bg-emerald-900/30 transition"
        >
          Add Network
        </button>
      ) : (
        <>
          <button
            onClick={requestFaucet}
            disabled={faucetLoading}
            className="px-3 py-1.5 text-amber-400 border border-amber-800 rounded-md text-xs font-medium hover:bg-amber-900/30 disabled:opacity-40 transition"
            title="Get 100 testnet GAS tokens"
          >
            {faucetLoading ? '...' : faucetMsg || 'Faucet'}
          </button>
          <span className="text-xs text-emerald-400 font-mono">
            {evmAddress?.slice(0, 6)}...{evmAddress?.slice(-4)}
          </span>
        </>
      )}
      <button
        onClick={() => openBridge()}
        className="px-3 py-1.5 text-zinc-400 border border-zinc-700 rounded-md text-sm font-medium hover:text-white hover:border-zinc-500 transition"
      >
        Bridge
      </button>
      {!initiaConnected ? (
        <button
          onClick={openConnect}
          className="px-4 py-1.5 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-500 transition"
        >
          Connect Wallet
        </button>
      ) : (
        <button
          onClick={openWallet}
          className="px-4 py-1.5 bg-zinc-800 text-white rounded-md text-sm font-medium hover:bg-zinc-700 border border-zinc-700 transition"
        >
          {username || (initiaAddress ? `${initiaAddress.slice(0, 6)}...${initiaAddress.slice(-4)}` : '')}
        </button>
      )}

      {/* Network Info Modal */}
      {mounted && showNetworkModal && createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)' }} onClick={() => setShowNetworkModal(false)}>
          <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-5 w-[380px] shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-white mb-1">Add InitiaPredict Network</h3>
            <p className="text-zinc-500 text-xs mb-4">Add this network manually in MetaMask: Settings → Networks → Add Network</p>
            <div className="space-y-0.5 divide-y divide-zinc-800">
              <CopyField label="Network Name" value={NETWORK_INFO.name} />
              <CopyField label="RPC URL" value={NETWORK_INFO.rpc} />
              <CopyField label="Chain ID" value={NETWORK_INFO.chainId} />
              <CopyField label="Currency Symbol" value={NETWORK_INFO.symbol} />
              <CopyField label="Decimals" value={NETWORK_INFO.decimals} />
            </div>
            <p className="text-[10px] text-zinc-600 mt-3">Click any value to copy. After adding, switch to the InitiaPredict network in your wallet.</p>
            <button
              onClick={() => setShowNetworkModal(false)}
              className="mt-4 w-full py-2 bg-zinc-800 text-zinc-300 rounded-md text-sm hover:bg-zinc-700 transition"
            >
              Done
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
