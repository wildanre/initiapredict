import Link from 'next/link'
import { getActiveEvents, parseOutcomePrices } from '@/lib/polymarket'
import OnChainMarkets from '@/components/OnChainMarkets'
import HeroSection from '@/components/HeroSection'
import FeatureCards from '@/components/FeatureCards'
import PolymarketGrid from '@/components/PolymarketGrid'

export default async function HomePage() {
  const events = await getActiveEvents(6)

  return (
    <div>
      <HeroSection />
      <FeatureCards />

      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#f0eef6]">Live Markets</h2>
            <p className="text-xs text-[#4e4868] mt-0.5">On-chain prediction markets</p>
          </div>
          <Link
            href="/create"
            className="text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1.5"
          >
            Create new
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </Link>
        </div>
        <OnChainMarkets />
      </section>

      <PolymarketGrid events={events} />
    </div>
  )
}
