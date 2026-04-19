'use client'

import { useState } from 'react'
import { parseEther, encodeFunctionData } from 'viem'
import { useAccount, useSendTransaction } from 'wagmi'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'motion/react'
import { PREDICTION_MARKET_ADDRESS, PREDICTION_MARKET_ABI } from '@/lib/contracts'
import { ensureCorrectNetwork } from '@/lib/network'
import FadeIn from '@/components/motion/FadeIn'

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
      <FadeIn direction="up">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#f0eef6] mb-1">Create Market</h1>
          <p className="text-[#8b85a0] text-sm">Describe your prediction and AI will structure it into a tradeable market</p>
        </div>
      </FadeIn>

      <FadeIn direction="up" delay={0.1}>
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-500/15 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="font-bold text-[#f0eef6]">Describe your prediction</h2>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., I think Bitcoin will hit $200k before the end of 2026 because of the ETF inflows and halving cycle..."
            className="w-full p-4 rounded-xl min-h-[120px] text-sm text-white placeholder-[#4e4868] input-glow transition-all duration-300 focus:outline-none resize-none"
            style={{
              background: 'rgba(14, 14, 24, 0.6)',
              border: '1px solid rgba(139, 92, 246, 0.1)',
            }}
          />
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAIGenerate}
            disabled={loading || !description.trim()}
            className="mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-30 transition-all duration-300 flex items-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
              boxShadow: '0 4px 20px rgba(139, 92, 246, 0.25)',
            }}
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                AI is thinking...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Generate Market with AI
              </>
            )}
          </motion.button>
        </div>
      </FadeIn>

      <AnimatePresence>
        {marketDef && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="glass-card p-6 mb-6 border-gradient"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/15 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="font-bold text-[#f0eef6]">Market Preview</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-[#4e4868] uppercase tracking-wider block mb-1 font-medium">Question</label>
                <p className="font-medium text-[#f0eef6]">{marketDef.question}</p>
              </div>
              <div>
                <label className="text-[10px] text-[#4e4868] uppercase tracking-wider block mb-1 font-medium">Description</label>
                <p className="text-sm text-[#8b85a0]">{marketDef.description}</p>
              </div>
              <div className="flex gap-6">
                <div>
                  <label className="text-[10px] text-[#4e4868] uppercase tracking-wider block mb-1 font-medium">Category</label>
                  <span className="text-sm text-violet-400 font-medium">{marketDef.category}</span>
                </div>
                <div>
                  <label className="text-[10px] text-[#4e4868] uppercase tracking-wider block mb-1 font-medium">End Date</label>
                  <p className="text-sm text-[#f0eef6]">{new Date(marketDef.endDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
              <div>
                <label className="text-[10px] text-[#4e4868] uppercase tracking-wider block mb-1 font-medium">Resolution Source</label>
                <p className="text-sm text-[#8b85a0]">{marketDef.resolutionSource}</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
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
              className="mt-6 w-full py-3 rounded-xl font-semibold text-white text-sm disabled:opacity-30 transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                boxShadow: '0 4px 24px rgba(139, 92, 246, 0.25)',
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating...
                </span>
              ) : 'Create Market on Chain'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
