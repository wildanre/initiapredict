import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from './providers'
import NavBar from '@/components/NavBar'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'InitiaPredict - AI-Powered Prediction Markets',
  description: 'Trade prediction markets with AI analysis on your own Initia appchain. Real-time odds, cross-platform intelligence, and instant settlements.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#06060a] text-[#f0eef6] min-h-screen noise-overlay`} suppressHydrationWarning>
        <Providers>
          <div className="mesh-gradient" />
          <div className="grid-bg min-h-screen relative">
            <NavBar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
              {children}
            </main>
          </div>
          <Toaster
            theme="dark"
            position="bottom-right"
            richColors
            toastOptions={{
              style: {
                background: 'rgba(14, 14, 24, 0.9)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(139, 92, 246, 0.15)',
                color: '#f0eef6',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
