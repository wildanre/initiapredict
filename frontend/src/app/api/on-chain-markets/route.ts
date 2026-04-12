import { createPublicClient, http, decodeFunctionResult, encodeFunctionData } from 'viem'
import { PREDICTION_MARKET_ABI } from '@/lib/contracts'

const RPC_URL = process.env.NEXT_PUBLIC_RPC_HTTPS || process.env.NEXT_PUBLIC_RPC_URL || 'https://rpc.evently-organizer.site'
const CONTRACT = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0xcA0a9e2E8c6CAb034a7183fCe1860b498E84F2Bc') as `0x${string}`

const client = createPublicClient({
  transport: http(RPC_URL),
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function callContract(functionName: any, args: any[] = []) {
  const data = encodeFunctionData({
    abi: PREDICTION_MARKET_ABI,
    functionName,
    args: args as never,
  })
  const result = await client.call({ to: CONTRACT, data })
  return decodeFunctionResult({
    abi: PREDICTION_MARKET_ABI,
    functionName,
    data: result.data!,
  })
}

export async function GET() {
  try {
    const count = await callContract('nextMarketId') as unknown as bigint
    const markets = []

    for (let i = 0; i < Math.min(Number(count), 50); i++) {
      try {
        const market = await callContract('getMarket', [BigInt(i)]) as unknown as {
          id: bigint
          creator: string
          question: string
          description: string
          resolutionSource: string
          category: string
          endTime: bigint
          createdAt: bigint
          resolved: boolean
          outcome: number
          yesPool: bigint
          noPool: bigint
          totalYesShares: bigint
          totalNoShares: bigint
          totalLiquidity: bigint
        }

        const yesPrice = await callContract('getYesPrice', [BigInt(i)]) as unknown as bigint

        markets.push({
          id: i,
          question: market.question,
          description: market.description,
          category: market.category,
          resolutionSource: market.resolutionSource,
          creator: market.creator,
          yesPrice: Number(yesPrice) / 100,
          noPrice: (10000 - Number(yesPrice)) / 100,
          endDate: new Date(Number(market.endTime) * 1000).toISOString(),
          createdAt: new Date(Number(market.createdAt) * 1000).toISOString(),
          resolved: market.resolved,
          outcome: market.outcome,
          totalLiquidity: market.totalLiquidity.toString(),
        })
      } catch (err) {
        console.error(`Failed to fetch market ${i}:`, err)
      }
    }

    return Response.json(markets)
  } catch (err) {
    console.error('Failed to fetch markets:', err)
    return Response.json([])
  }
}
