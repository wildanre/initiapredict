'use client'

import { useState } from 'react'
import { parseEther, encodeFunctionData } from 'viem'
import { useAccount, useSendTransaction } from 'wagmi'
import { toast } from 'sonner'
import { PREDICTION_MARKET_ADDRESS, PREDICTION_MARKET_ABI } from '@/lib/contracts'
import { ensureCorrectNetwork } from '@/lib/network'

interface TradePanelProps {
  marketId: number
  yesPrice: number // basis points 0-10000
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
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
      <h3 className="font-semibold text-white mb-4">Trade</h3>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setIsYes(true)}
          className={`flex-1 py-2.5 rounded-md font-semibold transition ${
            isYes ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Yes {(yesPrice / 100).toFixed(1)}%
        </button>
        <button
          onClick={() => setIsYes(false)}
          className={`flex-1 py-2.5 rounded-md font-semibold transition ${
            !isYes ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-500 hover:text-zinc-300'
          }`}
        >
          No {(noPrice / 100).toFixed(1)}%
        </button>
      </div>

      <div className="mb-4">
        <label className="text-xs text-zinc-500 mb-1 block">Amount (tokens)</label>
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2.5 bg-zinc-800 border border-zinc-700 rounded-md text-white text-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      {amount && parseFloat(amount) > 0 && (
        <div className="mb-4 p-3 bg-zinc-800 rounded-md text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-500">Potential return</span>
            <span className="text-zinc-200 font-mono">
              {((parseFloat(amount) / (isYes ? yesPrice : noPrice)) * 10000).toFixed(2)} tokens
            </span>
          </div>
        </div>
      )}

      <button
        onClick={handleBuy}
        disabled={loading || !amount || !address}
        className={`w-full py-2.5 rounded-md font-semibold text-white transition ${
          isYes ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-red-600 hover:bg-red-500'
        } disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        {!address ? 'Connect Wallet' : loading ? 'Processing...' : `Buy ${isYes ? 'Yes' : 'No'}`}
      </button>

    </div>
  )
}
