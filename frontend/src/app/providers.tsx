'use client'

import { PropsWithChildren, useEffect } from 'react'
import { createConfig, http, WagmiProvider } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  initiaPrivyWalletConnector,
  injectStyles,
  InterwovenKitProvider,
  TESTNET,
} from '@initia/interwovenkit-react'
import type { Chain } from '@initia/initia-registry-types'
import interwovenKitStyles from '@initia/interwovenkit-react/styles.js'

// Custom rollup chain definition for InterwovenKit
const INITIAPREDICT_CHAIN: Chain = {
  chain_id: 'initiapredict-1',
  chain_name: 'initiapredict',
  pretty_name: 'InitiaPredict',
  network_type: 'testnet',
  bech32_prefix: 'init',
  fees: {
    fee_tokens: [
      {
        denom: 'GAS',
        fixed_min_gas_price: 0.15,
        low_gas_price: 0.15,
        average_gas_price: 0.15,
        high_gas_price: 0.4,
      },
    ],
  },
  apis: {
    rpc: [{ address: 'https://node.evently-organizer.site' }],
    rest: [{ address: 'http://43.157.201.151:1317' }],
    api: [{ address: 'http://43.157.201.151:1317' }],
  },
} as Chain

// EVM chain definition for wagmi
const initiapredictEvm = {
  id: 0xdc0974dac6c5b, // chain ID from eth_chainId
  name: 'InitiaPredict',
  nativeCurrency: { name: 'GAS', symbol: 'GAS', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc.evently-organizer.site'],
    },
  },
} as const

const wagmiConfig = createConfig({
  connectors: [initiaPrivyWalletConnector],
  chains: [initiapredictEvm, mainnet],
  transports: {
    [initiapredictEvm.id]: http(),
    [mainnet.id]: http(),
  },
})

const queryClient = new QueryClient()

export default function Providers({ children }: PropsWithChildren) {
  useEffect(() => {
    injectStyles(interwovenKitStyles)
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <InterwovenKitProvider {...TESTNET}>
          {children}
        </InterwovenKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  )
}
