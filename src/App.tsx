import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/Header'
import { HeroSection } from '@/components/HeroSection'
import { GamesCatalog } from '@/components/GamesCatalog'
import { BitcoinPaymentChecker } from '@/components/BitcoinPayment'
import { EarningsDashboard } from '@/components/EarningsDashboard'
import { Footer } from '@/components/Footer'
import { Gamepad2, Bitcoin, Wallet, TrendingUp } from 'lucide-react'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />

      <main className="flex-1">
        <HeroSection />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Tabs defaultValue="games" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-900/50 border border-gray-800 mb-8">
              <TabsTrigger
                value="games"
                className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400"
              >
                <Gamepad2 className="w-4 h-4 mr-2" />
                Games
              </TabsTrigger>
              <TabsTrigger
                value="earnings"
                className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                My Earnings
              </TabsTrigger>
              <TabsTrigger
                value="payments"
                className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400"
              >
                <Bitcoin className="w-4 h-4 mr-2" />
                Transactions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="games">
              <GamesCatalog />
            </TabsContent>

            <TabsContent value="earnings">
              <EarningsDashboard />
            </TabsContent>

            <TabsContent value="payments">
              <BitcoinPaymentChecker />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}