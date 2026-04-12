export default function LeaderboardPage() {
  const mockLeaders = [
    { rank: 1, name: 'satoshi.init', profit: '+2,450', trades: 47, winRate: '72%' },
    { rank: 2, name: 'vitalik.init', profit: '+1,890', trades: 35, winRate: '68%' },
    { rank: 3, name: 'trader3.init', profit: '+1,200', trades: 62, winRate: '55%' },
    { rank: 4, name: 'degen.init', profit: '+980', trades: 28, winRate: '64%' },
    { rank: 5, name: 'whale.init', profit: '+750', trades: 15, winRate: '80%' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Leaderboard</h1>
      <p className="text-zinc-500 text-sm mb-6">Top traders by profit on InitiaPredict</p>

      <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
        <div className="grid grid-cols-5 gap-4 px-5 py-2.5 border-b border-zinc-800 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
          <div>Rank</div>
          <div>Trader</div>
          <div className="text-right">Profit</div>
          <div className="text-right">Trades</div>
          <div className="text-right">Win Rate</div>
        </div>
        {mockLeaders.map((l) => (
          <div key={l.rank} className="grid grid-cols-5 gap-4 px-5 py-3 border-t border-zinc-800/50 items-center hover:bg-zinc-800/30 transition">
            <div className="font-bold text-zinc-400">#{l.rank}</div>
            <div className="font-medium text-white">{l.name}</div>
            <div className="text-right text-emerald-400 font-mono text-sm">{l.profit}</div>
            <div className="text-right text-zinc-500 text-sm">{l.trades}</div>
            <div className="text-right text-zinc-500 text-sm">{l.winRate}</div>
          </div>
        ))}
      </div>

      <p className="text-xs text-zinc-600 mt-4 text-center">
        Leaderboard uses .init usernames. Connect your wallet and register your .init name to appear here.
      </p>
    </div>
  )
}
