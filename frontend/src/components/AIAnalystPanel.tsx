'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

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
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
      <h3 className="font-semibold text-white mb-3">AI Market Analyst</h3>

      <div className="h-64 overflow-y-auto space-y-2 mb-3">
        {messages.length === 0 && (
          <div className="text-center text-zinc-600 text-sm py-8">
            <p>Ask me anything about this market...</p>
            <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
              {['Why this price?', 'Key risk factors?', 'Should I buy Yes?'].map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="px-2.5 py-1 bg-zinc-800 border border-zinc-700 rounded-md text-xs text-zinc-400 hover:text-white hover:border-zinc-600 transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-3 rounded-md ${
              m.role === 'user' ? 'bg-indigo-500/10 border border-indigo-500/20 ml-6' : 'bg-zinc-800 mr-4'
            }`}
          >
            <span className="text-[10px] font-semibold text-zinc-500 block mb-1">
              {m.role === 'user' ? 'You' : 'AI'}
            </span>
            <div className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed space-y-1">
              {m.content.split('\n').map((line, idx) => {
                const trimmed = line.trim()
                if (!trimmed) return <br key={idx} />
                if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
                  return <p key={idx} className="pl-3 text-zinc-400">{trimmed}</p>
                }
                if (trimmed.startsWith('Recommendation:') || trimmed.startsWith('Verdict:') || trimmed.startsWith('Buy') || trimmed.startsWith('Hold')) {
                  return <p key={idx} className="text-indigo-400 font-medium mt-1">{trimmed}</p>
                }
                if (trimmed.match(/^\d+[.)]/) || trimmed.match(/^Key /) || trimmed.match(/^Probability:/i)) {
                  return <p key={idx} className="text-zinc-200 font-medium">{trimmed}</p>
                }
                return <p key={idx}>{trimmed}</p>
              })}
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
          <div className="p-3 bg-zinc-800 rounded-md mr-4">
            <span className="text-[10px] font-semibold text-zinc-500 block mb-1">AI</span>
            <p className="text-sm text-zinc-500 animate-pulse">Thinking...</p>
          </div>
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
          className="flex-1 p-2 bg-zinc-800 border border-zinc-700 rounded-md text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-500 disabled:opacity-40 transition"
        >
          Ask
        </button>
      </form>
    </div>
  )
}
