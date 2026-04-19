'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
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
  const [copied, setCopied] = useState(false)

  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-[#8b85a0] text-xs">{label}</span>
      <button
        onClick={() => {
          navigator.clipboard.writeText(value)
          setCopied(true)
          setTimeout(() => setCopied(false), 1500)
        }}
        className="text-xs font-mono text-[#f0eef6] bg-[#0e0e18] px-3 py-1 rounded-lg border border-[rgba(139,92,246,0.1)] hover:border-[rgba(139,92,246,0.3)] hover:bg-[#12121e] transition-all duration-300"
      >
        {copied ? 'Copied' : value.length > 28 ? value.slice(0, 28) + '...' : value}
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
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowNetworkModal(true)}
          className="px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all duration-300"
          style={{
            color: '#10b981',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            background: 'rgba(16, 185, 129, 0.06)',
          }}
        >
          Add Network
        </motion.button>
      ) : (
        <>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={requestFaucet}
            disabled={faucetLoading}
            className="px-3 py-1.5 rounded-xl text-xs font-medium disabled:opacity-40 transition-all duration-300"
            style={{
              color: '#f59e0b',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              background: 'rgba(245, 158, 11, 0.06)',
            }}
            title="Get 100 testnet GAS tokens"
          >
            {faucetLoading ? '...' : faucetMsg || 'Faucet'}
          </motion.button>
          <span className="text-xs font-mono px-2.5 py-1 rounded-lg" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.08)' }}>
            {evmAddress?.slice(0, 6)}...{evmAddress?.slice(-4)}
          </span>
        </>
      )}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => openBridge()}
        className="px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all duration-300"
        style={{
          color: '#8b85a0',
          border: '1px solid rgba(139, 92, 246, 0.12)',
          background: 'rgba(139, 92, 246, 0.04)',
        }}
      >
        Bridge
      </motion.button>
      {!initiaConnected ? (
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={openConnect}
          className="px-4 py-1.5 rounded-xl text-sm font-semibold text-white transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
            boxShadow: '0 4px 20px rgba(139, 92, 246, 0.25)',
          }}
        >
          Connect Wallet
        </motion.button>
      ) : (
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={openWallet}
          className="px-4 py-1.5 rounded-xl text-sm font-medium text-white transition-all duration-300"
          style={{
            background: 'rgba(139, 92, 246, 0.12)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
          }}
        >
          {username || (initiaAddress ? `${initiaAddress.slice(0, 6)}...${initiaAddress.slice(-4)}` : '')}
        </motion.button>
      )}

      {/* Network Info Modal */}
      {mounted && (
        <AnimatePresence>
          {showNetworkModal && createPortal(
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
              onClick={() => setShowNetworkModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 10, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="glass-card p-6 w-[400px] shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm mb-4">
                  iP
                </div>
                <h3 className="font-bold text-[#f0eef6] text-lg mb-1">Add InitiaPredict Network</h3>
                <p className="text-[#8b85a0] text-xs mb-5">Add this EVM network manually in your wallet settings</p>
                <div className="space-y-0.5 divide-y divide-[rgba(139,92,246,0.08)]">
                  <CopyField label="Network Name" value={NETWORK_INFO.name} />
                  <CopyField label="RPC URL" value={NETWORK_INFO.rpc} />
                  <CopyField label="Chain ID" value={NETWORK_INFO.chainId} />
                  <CopyField label="Currency Symbol" value={NETWORK_INFO.symbol} />
                  <CopyField label="Decimals" value={NETWORK_INFO.decimals} />
                </div>
                <p className="text-[10px] text-[#4e4868] mt-4">Click any value to copy. After adding, switch to the InitiaPredict network in your wallet.</p>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setShowNetworkModal(false)}
                  className="mt-5 w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-300"
                  style={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    border: '1px solid rgba(139, 92, 246, 0.15)',
                    color: '#f0eef6',
                  }}
                >
                  Done
                </motion.button>
              </motion.div>
            </motion.div>,
            document.body
          )}
        </AnimatePresence>
      )}
    </>
  )
}
