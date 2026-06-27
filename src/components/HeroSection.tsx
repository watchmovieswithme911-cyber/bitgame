import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Bitcoin, 
  Gamepad2, 
  Shield, 
  Zap, 
  Users,
  ArrowRight,
  ChevronRight
} from 'lucide-react'

export function HeroSection() {
  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-purple-500/10 to-blue-500/10" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative px-6 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 px-4 py-2">
            <Bitcoin className="w-4 h-4 mr-2" />
            Bitcoin-Powered Gaming
          </Badge>

          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            Play Games,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
              Earn Bitcoin
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            The future of gaming is here. Purchase games with Bitcoin, compete in tournaments, 
            and earn crypto rewards for your victories.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 py-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">500K+</div>
              <div className="text-gray-400 text-sm">Active Players</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400">₿2.5M</div>
              <div className="text-gray-400 text-sm">BTC Earned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">50+</div>
              <div className="text-gray-400 text-sm">Games</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8">
              <Gamepad2 className="w-5 h-5 mr-2" />
              Browse Games
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
              <Bitcoin className="w-5 h-5 mr-2" />
              Connect Wallet
            </Button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 pt-8">
            <div className="flex items-center gap-2 text-gray-400">
              <Shield className="w-5 h-5 text-emerald-400" />
              <span className="text-sm">Secure Bitcoin Payments</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-sm">Instant Transactions</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-sm">Global Community</span>
            </div>
          </div>
        </div>

        {/* Floating cards (decorative) */}
        <div className="hidden lg:block absolute top-1/2 -translate-y-1/2 left-8 w-64">
          <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-lg p-4 transform -rotate-6 animate-float">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Crypto Legends</p>
                <p className="text-gray-400 text-xs">Just purchased</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-emerald-400 text-sm">
              <ChevronRight className="w-4 h-4" />
              <span>Download started</span>
            </div>
          </div>
        </div>

        <div className="hidden lg:block absolute top-1/2 -translate-y-1/2 right-8 w-64">
          <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-lg p-4 transform rotate-6 animate-float" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center">
                <Bitcoin className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">+0.002 BTC</p>
                <p className="text-gray-400 text-xs">Tournament reward</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-orange-400 text-sm">
              <ChevronRight className="w-4 h-4" />
              <span>Claimed to wallet</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(-6deg); }
          50% { transform: translateY(-10px) rotate(-6deg); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}