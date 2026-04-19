'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface Props {
  marketData: {
    question: string
    yesPrice: number
    noPrice: number
    polymarketOdds?: number
    volume?: string
    endDate?: string
  }
}

export default function AIAnalystPanel({ marketData }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          marketData,
        }),
      })

      if (!res.ok || !res.body) throw new Error('API request failed')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ''
      const assistantId = (Date.now() + 1).toString()

      setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '' }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        assistantContent += chunk
        setMessages((prev) => {
          const next = [...prev]
          next[next.length - 1] = { id: assistantId, role: 'assistant', content: assistantContent }
          return next
        })
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 2).toString(), role: 'assistant', content: 'An error occurred. Please try again.' },
      ])
    } finally {
      setIsLoading(false)
    }
  }, [messages, marketData, isLoading])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-500/15 flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 className="font-bold text-[#f0eef6]">AI Market Analyst</h3>
        <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(139, 92, 246, 0.08)', color: '#8b5cf6', border: '1px solid rgba(139, 92, 246, 0.15)' }}>
          AI-Powered
        </span>
      </div>

      <div className="h-64 overflow-y-auto space-y-3 mb-4 pr-1">
        {messages.length === 0 && (
          <div className="text-center py-10">
            <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border border-violet-500/10 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-[#4e4868]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <p className="text-[#4e4868] text-sm mb-4">Ask me anything about this market...</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {['Why this price?', 'Key risk factors?', 'Should I buy Yes?'].map((q) => (
                <motion.button
                  key={q}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => sendMessage(q)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-300"
                  style={{
                    background: 'rgba(139, 92, 246, 0.06)',
                    border: '1px solid rgba(139, 92, 246, 0.12)',
                    color: '#8b85a0',
                  }}
                >
                  {q}
                </motion.button>
              ))}
            </div>
          </div>
        )}
        <AnimatePresence mode="popLayout">
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`p-3.5 rounded-xl ${
                m.role === 'user'
                  ? 'ml-8'
                  : 'mr-4'
              }`}
              style={{
                background: m.role === 'user'
                  ? 'rgba(139, 92, 246, 0.08)'
                  : 'rgba(14, 14, 24, 0.8)',
                border: m.role === 'user'
                  ? '1px solid rgba(139, 92, 246, 0.15)'
                  : '1px solid rgba(139, 92, 246, 0.06)',
              }}
            >
              <span className="text-[10px] font-semibold block mb-1.5" style={{ color: m.role === 'user' ? '#8b5cf6' : '#06b6d4' }}>
                {m.role === 'user' ? 'You' : 'AI Analyst'}
              </span>
              <div className="text-sm text-[#c4bfd6] whitespace-pre-wrap leading-relaxed space-y-1">
                {m.content.split('\n').map((line, idx) => {
                  const trimmed = line.trim()
                  if (!trimmed) return <br key={idx} />
                  if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                    return <p key={idx} className="pl-3 text-[#8b85a0]">{trimmed}</p>
                  }
                  if (trimmed.startsWith('Recommendation:') || trimmed.startsWith('Verdict:') || trimmed.startsWith('Buy') || trimmed.startsWith('Hold')) {
                    return <p key={idx} className="text-violet-400 font-medium mt-1">{trimmed}</p>
                  }
                  if (trimmed.match(/^\d+[.)]/) || trimmed.match(/^Key /) || trimmed.match(/^Probability:/i)) {
                    return <p key={idx} className="text-[#f0eef6] font-medium">{trimmed}</p>
                  }
                  return <p key={idx}>{trimmed}</p>
                })}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3.5 rounded-xl mr-4"
            style={{ background: 'rgba(14, 14, 24, 0.8)', border: '1px solid rgba(139, 92, 246, 0.06)' }}
          >
            <span className="text-[10px] font-semibold text-cyan-400 block mb-1.5">AI Analyst</span>
            <div className="flex items-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-violet-400"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (input.trim()) {
            sendMessage(input)
            setInput('')
          }
        }}
        className="flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          placeholder="Ask about this market..."
          className="flex-1 p-3 rounded-xl text-sm text-white placeholder-[#4e4868] input-glow transition-all duration-300 focus:outline-none"
          style={{
            background: 'rgba(14, 14, 24, 0.6)',
            border: '1px solid rgba(139, 92, 246, 0.1)',
          }}
        />
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={isLoading}
          className="px-5 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-30 transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
            boxShadow: '0 4px 16px rgba(139, 92, 246, 0.2)',
          }}
        >
          Ask
        </motion.button>
      </form>
    </motion.div>
  )
}
