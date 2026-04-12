import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from './providers'
import NavButtons from '@/components/NavButtons'
import Link from 'next/link'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'InitiaPredict - AI-Powered Prediction Market',
  description: 'Trade prediction markets with AI analysis on your own Initia appchain',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#09090b] text-zinc-100 min-h-screen`} suppressHydrationWarning>
        <Providers>
          <nav className="bg-[#09090b]/80 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-14">
                <div className="flex items-center gap-8">
                  <Link href="/" className="text-lg font-bold text-white tracking-tight">
                    InitiaPredict
                  </Link>
                  <div className="hidden md:flex gap-1">
                    {['Markets', 'Create', 'Portfolio', 'Leaderboard'].map((item) => (
                      <Link key={item} href={`/${item.toLowerCase()}`} className="text-zinc-400 hover:text-white text-sm font-medium px-3 py-1.5 rounded-md hover:bg-zinc-800/50 transition">
                        {item}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <NavButtons />
                </div>
              </div>
            </div>
          </nav>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <Toaster theme="dark" position="bottom-right" richColors />
        </Providers>
      </body>
    </html>
  )
}
