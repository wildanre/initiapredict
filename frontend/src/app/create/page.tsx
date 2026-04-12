'use client'

import { useState } from 'react'
import { parseEther, encodeFunctionData } from 'viem'
import { useAccount, useSendTransaction } from 'wagmi'
import { toast } from 'sonner'
import { PREDICTION_MARKET_ADDRESS, PREDICTION_MARKET_ABI } from '@/lib/contracts'
import { ensureCorrectNetwork } from '@/lib/network'

export default function CreateMarketPage() {
  const { address } = useAccount()
  const { sendTransactionAsync } = useSendTransaction()
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [marketDef, setMarketDef] = useState<{
    question: string
    description: string
    category: string
    resolutionSource: string
    endDate: string
  } | null>(null)

  const handleAIGenerate = async () => {
    if (!description.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/create-market', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      })
      const data = await res.json()
      if (data.error) {
        toast.error('AI generation failed', { description: data.error.slice(0, 120) })
      } else {
        setMarketDef(data)
        toast.success('Market definition generated')
      }
    } catch (err) {
      toast.error('Failed to generate market')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-1">Create Market</h1>
      <p className="text-zinc-500 text-sm mb-6">Describe your prediction and AI will structure it into a market</p>

      <div className="bg-zinc-900 rounded-lg p-5 border border-zinc-800 mb-5">
        <h2 className="font-semibold text-white mb-3">Describe your prediction</h2>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., I think Bitcoin will hit $200k before the end of 2026 because of the ETF inflows and halving cycle..."
          className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-md min-h-[100px] text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <button
          onClick={handleAIGenerate}
          disabled={loading || !description.trim()}
          className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-500 disabled:opacity-40 transition"
        >
          {loading ? 'AI is thinking...' : 'Generate Market with AI'}
        </button>
      </div>

      {marketDef && (
        <div className="bg-zinc-900 rounded-lg p-5 border border-zinc-800 mb-5">
          <h2 className="font-semibold text-white mb-4">Market Preview</h2>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-zinc-500 uppercase tracking-wider block">Question</label>
              <p className="font-medium text-white">{marketDef.question}</p>
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 uppercase tracking-wider block">Description</label>
              <p className="text-sm text-zinc-400">{marketDef.description}</p>
            </div>
            <div className="flex gap-4">
              <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider block">Category</label>
                <span className="text-sm text-indigo-400">{marketDef.category}</span>
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider block">End Date</label>
                <p className="text-sm text-zinc-300">{new Date(marketDef.endDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 uppercase tracking-wider block">Resolution Source</label>
              <p className="text-sm text-zinc-400">{marketDef.resolutionSource}</p>
            </div>
          </div>

          <button
            onClick={async () => {
              if (!marketDef) return
              setLoading(true)
              try {
                await ensureCorrectNetwork()

                const endTimestamp = Math.floor(new Date(marketDef.endDate).getTime() / 1000)
                const data = encodeFunctionData({
                  abi: PREDICTION_MARKET_ABI,
                  functionName: 'createMarket',
                  args: [
                    marketDef.question,
                    marketDef.description,
                    marketDef.category,
                    marketDef.resolutionSource,
                    BigInt(endTimestamp),
                  ],
                })
                const txHash = await sendTransactionAsync({
                  to: PREDICTION_MARKET_ADDRESS,
                  data,
                  value: parseEther('0.1'),
                })
                toast.success('Market created on-chain', {
                  description: `Tx: ${txHash.slice(0, 10)}...${txHash.slice(-8)}`,
                })
                setMarketDef(null)
                setDescription('')
              } catch (err) {
                const msg = err instanceof Error ? err.message : 'Transaction failed'
                if (msg.includes('User rejected') || msg.includes('denied')) {
                  toast.error('Transaction cancelled')
                } else {
                  toast.error('Failed to create market', { description: msg.slice(0, 100) })
                }
              } finally {
                setLoading(false)
              }
            }}
            disabled={loading}
            className="mt-4 w-full py-2.5 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-500 disabled:opacity-40 transition"
          >
            {loading ? 'Creating...' : 'Create Market on Chain'}
          </button>
        </div>
      )}
    </div>
  )
}
