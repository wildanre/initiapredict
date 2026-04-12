import { parseAbi } from 'viem'

export const PREDICTION_MARKET_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`

// parseAbi does not support named tuple components — getMarket is defined as a JSON ABI entry instead
const GET_MARKET_ABI = [
  {
    name: 'getMarket',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'marketId', type: 'uint256' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'creator', type: 'address' },
          { name: 'question', type: 'string' },
          { name: 'description', type: 'string' },
          { name: 'resolutionSource', type: 'string' },
          { name: 'category', type: 'string' },
          { name: 'endTime', type: 'uint256' },
          { name: 'createdAt', type: 'uint256' },
          { name: 'resolved', type: 'bool' },
          { name: 'outcome', type: 'uint8' },
          { name: 'yesPool', type: 'uint256' },
          { name: 'noPool', type: 'uint256' },
          { name: 'totalYesShares', type: 'uint256' },
          { name: 'totalNoShares', type: 'uint256' },
          { name: 'totalLiquidity', type: 'uint256' },
        ],
      },
    ],
  },
] as const

export const PREDICTION_MARKET_ABI = [
  ...parseAbi([
    'function createMarket(string,string,string,string,uint256) payable returns (uint256)',
    'function buyShares(uint256,bool,uint256) payable',
    'function sellShares(uint256,bool,uint256,uint256)',
    'function resolveMarket(uint256,uint8)',
    'function claimWinnings(uint256)',
    'function getYesPrice(uint256) view returns (uint256)',
    'function getNoPrice(uint256) view returns (uint256)',
    'function getUserPosition(uint256,address) view returns (uint256,uint256)',
    'function nextMarketId() view returns (uint256)',
    'event MarketCreated(uint256 indexed marketId, address indexed creator, string question, uint256 endTime, uint256 initialLiquidity)',
    'event SharesBought(uint256 indexed marketId, address indexed buyer, bool isYes, uint256 amount, uint256 sharesMinted, uint256 newPrice)',
    'event MarketResolved(uint256 indexed marketId, uint8 outcome)',
  ]),
  ...GET_MARKET_ABI,
] as const

export const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID || 'initiapredict-1'
