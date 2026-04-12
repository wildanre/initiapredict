import { useEffect, useState } from 'react'

export interface OnChainMarket {
  id: number
  question: string
  description: string
  category: string
  yesPrice: number
  noPrice: number
  endDate: string
  resolved: boolean
}

export function useOnChainMarkets() {
  const [markets, setMarkets] = useState<OnChainMarket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMarkets() {
      try {
        const res = await fetch('/api/on-chain-markets')
        const data = await res.json()
        setMarkets(data)
      } catch (err) {
        console.error('Failed to fetch on-chain markets:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMarkets()
    const interval = setInterval(fetchMarkets, 10000)
    return () => clearInterval(interval)
  }, [])

  return { markets, loading }
}
