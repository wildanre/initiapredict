'use client'

import { useState } from 'react'
import { parseEther, encodeFunctionData } from 'viem'
import { useAccount, useSendTransaction } from 'wagmi'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'motion/react'
import { PREDICTION_MARKET_ADDRESS, PREDICTION_MARKET_ABI } from '@/lib/contracts'
import { ensureCorrectNetwork } from '@/lib/network'

interface TradePanelProps {
  marketId: number
  yesPrice: number
  noPrice: number
}

export default function TradePanel({ marketId, yesPrice, noPrice }: TradePanelProps) {
  const { address } = useAccount()
  const { sendTransactionAsync } = useSendTransaction()
  const [amount, setAmount] = useState('')
  const [isYes, setIsYes] = useState(true)
  const [loading, setLoading] = useState(false)

  const handleBuy = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Enter a valid amount')
      return
    }
    if (!address) {
      toast.error('Connect your wallet first')
      return
    }

    setLoading(true)
    try {
      await ensureCorrectNetwork()

      const data = encodeFunctionData({
        abi: PREDICTION_MARKET_ABI,
        functionName: 'buyShares',
        args: [BigInt(marketId), isYes, BigInt(0)],
      })
      const txHash = await sendTransactionAsync({
        to: PREDICTION_MARKET_ADDRESS,
        data,
        value: parseEther(amount),
      })
      toast.success(`${isYes ? 'Yes' : 'No'} shares purchased`, {
        description: `Tx: ${txHash.slice(0, 10)}...${txHash.slice(-8)}`,
      })
      setAmount('')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Transaction failed'
      if (msg.includes('User rejected') || msg.includes('denied')) {
        toast.error('Transaction cancelled')
      } else {
        toast.error('Trade failed', { description: msg.slice(0, 100) })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-500/15 flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        </div>
        <h3 className="font-bold text-[#f0eef6]">Trade</h3>
      </div>

      <div className="flex gap-2 mb-5">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsYes(true)}
          className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-300"
          style={{
            background: isYes ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1))' : 'rgba(14, 14, 24, 0.6)',
            border: isYes ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(139, 92, 246, 0.08)',
            color: isYes ? '#10b981' : '#4e4868',
            boxShadow: isYes ? '0 4px 20px rgba(16, 185, 129, 0.15)' : 'none',
          }}
        >
          Yes {(yesPrice / 100).toFixed(1)}%
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsYes(false)}
          className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-300"
          style={{
            background: !isYes ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.2), rgba(244, 63, 94, 0.1))' : 'rgba(14, 14, 24, 0.6)',
            border: !isYes ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid rgba(139, 92, 246, 0.08)',
            color: !isYes ? '#f43f5e' : '#4e4868',
            boxShadow: !isYes ? '0 4px 20px rgba(244, 63, 94, 0.15)' : 'none',
          }}
        >
          No {(noPrice / 100).toFixed(1)}%
        </motion.button>
      </div>

      <div className="mb-5">
        <label className="text-[10px] text-[#4e4868] mb-1.5 block uppercase tracking-wider font-medium">Amount (tokens)</label>
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 rounded-xl text-lg font-mono text-white placeholder-[#4e4868] input-glow transition-all duration-300 focus:outline-none"
          style={{
            background: 'rgba(14, 14, 24, 0.6)',
            border: '1px solid rgba(139, 92, 246, 0.1)',
          }}
        />
      </div>

      <AnimatePresence>
        {amount && parseFloat(amount) > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-5 overflow-hidden"
          >
            <div className="p-3.5 rounded-xl text-sm" style={{ background: 'rgba(139, 92, 246, 0.06)', border: '1px solid rgba(139, 92, 246, 0.08)' }}>
              <div className="flex justify-between">
                <span className="text-[#8b85a0]">Potential return</span>
                <span className="text-[#f0eef6] font-mono font-medium">
                  {((parseFloat(amount) / (isYes ? yesPrice : noPrice)) * 10000).toFixed(2)} tokens
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleBuy}
        disabled={loading || !amount || !address}
        className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
        style={{
          background: isYes
            ? 'linear-gradient(135deg, #10b981, #059669)'
            : 'linear-gradient(135deg, #f43f5e, #e11d48)',
          boxShadow: isYes
            ? '0 4px 24px rgba(16, 185, 129, 0.25)'
            : '0 4px 24px rgba(244, 63, 94, 0.25)',
        }}
      >
        {!address ? 'Connect Wallet' : loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Processing...
          </span>
        ) : `Buy ${isYes ? 'Yes' : 'No'}`}
      </motion.button>
    </motion.div>
  )
}
