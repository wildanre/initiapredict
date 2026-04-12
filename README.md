# 🔮 InitiaPredict — AI-Powered Prediction Market on Initia

> Trade prediction markets with AI analysis, cross-platform intelligence, and instant execution on your own Initia appchain.

## Overview

InitiaPredict is a **Polymarket-style prediction market** built as its own **Initia EVM appchain**, enhanced with **AI-powered market analysis** via Google Gemini. Users can create, trade, and analyze binary prediction markets with:

- **🤖 AI Market Analyst** — Streaming chat per market with probability estimates and reasoning (Gemini 2.5 Flash)
- **📊 Cross-Platform Intelligence** — Real-time odds comparison with Polymarket via Gamma API
- **⚡ Instant Trading** — 100ms block times on dedicated EVM appchain
- **🌉 Cross-Chain Deposits** — Interwoven Bridge for deposits from any connected chain
- **👤 .init Usernames** — On-chain identity for leaderboard and trader profiles

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│  Browser (Next.js Frontend)                               │
│  ├── InterwovenKit → wallet connect, .init names, bridge  │
│  ├── wagmi + viem  → EVM txns to rollup contract         │
│  └── React UI      → markets, trading, AI chat            │
├──────────────────────────────────────────────────────────┤
│  Next.js API Routes (Server-side)                          │
│  ├── POST /api/chat          → Gemini streaming analysis  │
│  ├── POST /api/analyze       → Gemini JSON scoring        │
│  ├── POST /api/create-market → Gemini market generator    │
│  └── GET  /api/polymarket    → Gamma API proxy + cache    │
├──────────────────────────────────────────────────────────┤
│  Initia EVM Appchain (initiapredict-1)                     │
│  ├── MiniEVM v1.2.15 (go-ethereum based)                  │
│  ├── PredictionMarket.sol @ 0xcA0a9e...84F2Bc             │
│  ├── CPMM pricing (x * y = k)                             │
│  └── 2% fee on winning claims → treasury                  │
├──────────────────────────────────────────────────────────┤
│  External Data                                            │
│  ├── Polymarket Gamma API → real-time market odds          │
│  └── Google Gemini API   → AI analysis (offchain)          │
└──────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Action          Frontend              Backend              Blockchain
──────────────────────────────────────────────────────────────────────
Connect Wallet  →  InterwovenKit  →  Initia Wallet popup  →  L1 auth
Browse Markets  →  Landing page   →  Polymarket Gamma API →  (cached)
Buy YES shares  →  TradePanel     →  wagmi sendTx         →  EVM RPC → Contract
Ask AI          →  AIAnalystPanel →  /api/chat            →  Gemini stream
Create Market   →  Create page    →  /api/create-market   →  Gemini → wagmi tx
Bridge tokens   →  BridgeButton   →  InterwovenKit bridge →  L1 ↔ Rollup
```

---

## Track: AI

The AI layer is the primary differentiator. AI inference runs **offchain** via Google Gemini, while ownership, payments, and market logic live **onchain**.

### AI Features

1. **AI Market Analyst** (`/api/chat`) — Streaming chat per market using `generateContentStream`. Users ask questions like "Why is YES at 65%?" and get real-time analysis with reasoning.

2. **AI Market Scoring** (`/api/analyze`) — Returns structured JSON: `{ confidenceScore, recommendation, reasoning, keyFactors, riskLevel }` for each market.

3. **AI Market Creator** (`/api/create-market`) — Users describe a prediction in natural language, Gemini converts it to a structured market definition (question, description, category, resolution source, end date).

---

## Deployment Info

| Component | Value |
|-----------|-------|
| Chain ID | `initiapredict-1` |
| VM | MiniEVM v1.2.15 |
| Contract | `0xcA0a9e2E8c6CAb034a7183fCe1860b498E84F2Bc` |
| Gas Token | GAS |
| EVM RPC | `http://43.157.201.151:8545` |
| Tendermint RPC | `http://43.157.201.151:26657` |
| REST API | `http://43.157.201.151:1317` |
| L1 Network | Initia Testnet (`initiation-2`) |
| Gas Station | `init1keqprrqwad9594ztqy0qvvlktnphy0gr6kaqr9` |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Smart Contracts | Solidity ^0.8.24, Foundry (forge) |
| Frontend | Next.js 16, TypeScript, Tailwind CSS |
| Wallet | InterwovenKit (`@initia/interwovenkit-react`) |
| EVM Integration | wagmi, viem |
| AI | Google Gemini 2.5 Flash (`@google/genai`) |
| Market Data | Polymarket Gamma API (public, no auth) |
| Appchain | MiniEVM via `weave` CLI |

---

## Smart Contract: PredictionMarket.sol

### Overview
Binary prediction market using **Constant Product Market Maker (CPMM)** pricing (`x * y = k`), similar to Uniswap but for YES/NO outcomes.

### Key Functions

| Function | Description |
|----------|-------------|
| `createMarket(question, description, category, source, endTime)` | Create new binary market with initial liquidity |
| `buyShares(marketId, isYes, minShares)` | Buy YES/NO shares via CPMM pricing |
| `sellShares(marketId, isYes, amount, minPayout)` | Sell shares back to the pool |
| `resolveMarket(marketId, outcome)` | Owner resolves market (Yes/No/Invalid) |
| `claimWinnings(marketId)` | Winners claim proportional payout (minus 2% fee) |
| `getYesPrice(marketId)` | Current YES price in basis points (0-10000) |
| `getMarket(marketId)` | Full market data struct |
| `getUserPosition(marketId, user)` | User's YES/NO shares |

### Pricing Formula
```
YES price = noPool / (yesPool + noPool)
NO price  = yesPool / (yesPool + noPool)

Buy shares:  shares = pool_opposite - (k / (pool_same + payment))
Sell shares: payout = pool_opposite - (k / (pool_same + shares))
```

### Security Features
- Slippage protection via `minShares` / `minPayout` parameters
- Owner-only resolution with multi-outcome support (Yes/No/Invalid)
- Double-claim prevention per user per market
- Reentrancy-safe via checks-effects-interactions pattern
- 2% fee collected to treasury on winning claims

### Tests (8/8 passing)
- `testCreateMarket` — market creation with 50/50 initial price
- `testBuyYesShares` — buying YES increases YES price
- `testBuyNoShares` — buying NO decreases YES price  
- `testSellShares` — selling returns tokens to user
- `testResolveAndClaim` — full lifecycle: buy → resolve → claim + fee
- `testCannotBuyAfterEnd` — trading disabled after endTime
- `testSlippageProtection` — reverts if minShares not met
- `testDoubleClaimReverts` — prevents claiming twice

---

## Frontend Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, features, trending Polymarket markets |
| `/markets` | Browse all markets with volume/liquidity data from Polymarket |
| `/markets/[id]` | Market detail: odds display, TradePanel, AI Analyst chat |
| `/create` | AI-assisted market creation (natural language → structured market) |
| `/portfolio` | User's positions across all markets |
| `/leaderboard` | Top traders by .init username |

---

## Initia-Native Features

### 1. InterwovenKit Integration
- **Wallet Connection** — via `InterwovenKitProvider` with `TESTNET` preset
- **.init Usernames** — displayed in navbar via `useInterwovenKit().username`
- **Interwoven Bridge** — cross-chain deposit UI via `openBridge()`
- **Social Login** — via `initiaPrivyWalletConnector` (Privy embedded wallets)

### 2. EVM Transaction Flow
- wagmi configured with custom EVM chain pointing to rollup RPC
- `useSendTransaction` for buying/selling shares directly on rollup
- `encodeFunctionData` from viem for ABI encoding

### 3. Auto-signing (Session UX)
- Component ready at `components/AutoSignToggle.tsx`
- Uses `autoSign.enable(chainId)` from InterwovenKit
- Requires chain indexer URL (available when rollup is registered in Initia registry)

---

## Polymarket Integration

### Gamma API (No Auth Required)

| Endpoint | Usage |
|----------|-------|
| `GET /events?active=true&closed=false` | Fetch trending markets for landing page |
| `GET /events?slug={slug}` | Fetch specific event by URL slug |
| Market fields | `question`, `outcomePrices`, `volume24hr`, `liquidity`, `endDate` |

### Cross-Platform Intelligence
For each on-chain market, the app finds matching Polymarket markets and displays side-by-side odds comparison:
```
InitiaPredict: 65% YES | Polymarket: 72% YES | AI says: 78% YES
```

---

## Project Structure

```
initiapredict/
├── contracts/                     # Foundry project
│   ├── src/PredictionMarket.sol   # Core CPMM contract (334 lines)
│   ├── test/PredictionMarket.t.sol # 8 unit tests
│   └── foundry.toml               # via_ir + optimizer
├── frontend/                      # Next.js app
│   ├── src/app/
│   │   ├── layout.tsx             # Root layout + nav
│   │   ├── providers.tsx          # InterwovenKit + wagmi + React Query
│   │   ├── page.tsx              # Landing page
│   │   ├── markets/page.tsx       # Markets browse
│   │   ├── markets/[id]/page.tsx  # Market detail + AI + trade
│   │   ├── create/page.tsx        # AI market creator
│   │   ├── portfolio/page.tsx     # User positions
│   │   ├── leaderboard/page.tsx   # Top traders
│   │   └── api/                   # API routes
│   │       ├── chat/route.ts      # Gemini streaming chat
│   │       ├── analyze/route.ts   # Gemini JSON analysis
│   │       ├── create-market/     # Gemini market generator
│   │       └── polymarket/        # Gamma API proxy
│   ├── src/components/
│   │   ├── NavButtons.tsx         # Wallet + Bridge (InterwovenKit)
│   │   ├── TradePanel.tsx         # Buy/Sell shares (wagmi)
│   │   ├── AIAnalystPanel.tsx     # Streaming AI chat
│   │   └── AutoSignToggle.tsx     # Session UX (ready)
│   ├── src/lib/
│   │   ├── contracts.ts           # ABI + address constants
│   │   └── polymarket.ts          # Gamma API typed client
│   └── .env.local                 # GEMINI_API_KEY, RPC URLs
├── .initia/
│   └── submission.json            # Hackathon submission metadata
└── README.md
```

---

## Setup Guide

### Prerequisites
- Node.js 22+
- Foundry (`forge`, `cast`)
- Google AI Studio API key ([aistudio.google.com](https://aistudio.google.com))

### 1. Smart Contracts
```bash
cd contracts
forge test -vvv    # Run all 8 tests
forge build        # Compile
```

### 2. Frontend
```bash
cd frontend
npm install

# Set your Gemini API key
echo 'GEMINI_API_KEY=your-key-here' >> .env.local

npm run dev        # http://localhost:3000
```

### 3. Appchain (VPS)
```bash
# Install weave CLI
weave init         # Interactive setup (EVM track, chain-id: initiapredict-1)

# Start chain
minitiad start --home ~/.minitia

# Deploy contract (from local machine)
forge build
scp contracts/out/PredictionMarket.sol/PredictionMarket.json vps:/tmp/
ssh vps 'minitiad tx evm create /tmp/pm-deploy.hex --from gas-station ...'
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Google AI Studio API key (server-side) |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | Deployed contract address |
| `NEXT_PUBLIC_RPC_URL` | EVM JSON-RPC endpoint |
| `NEXT_PUBLIC_NODE_URL` | Tendermint RPC endpoint |
| `NEXT_PUBLIC_CHAIN_ID` | Rollup chain ID |

---

## Revenue Model

- **2% platform fee** on winning claims (collected in contract treasury)
- **All gas fees** from every transaction on the appchain (you own the chain)
- **Future**: premium AI analysis subscription tier

---

## Hackathon Scoring Alignment

| Criteria (Weight) | How We Address It |
|-------------------|-------------------|
| Originality & Track Fit (20%) | AI-powered prediction market with Polymarket cross-platform intelligence — unique in AI track |
| Technical Execution (30%) | EVM appchain deployed, CPMM contract with 8 tests, InterwovenKit + wagmi integration, Gemini streaming |
| Product Value & UX (20%) | Clean UI, AI chat per market, one-click bridge, social login |
| Working Demo (20%) | Full end-to-end: browse → trade → AI analysis → create market |
| Market Understanding (10%) | Prediction markets = $1B+ category, clear revenue model, Polymarket as proof of demand |

---

## Demo Video

[Link to demo video]

## License

MIT
