import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Bitcoin,
  Gamepad2,
  Menu,
  X,
  Wallet,
  User,
  ShoppingCart,
  Trophy,
  CheckCircle2,
  Copy
} from 'lucide-react'

const WALLET_ADDRESS = '1QLTRW2YLBcwWJbCb1imGgwp98cSrUhNGJ'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isConnected, setIsConnected] = useState(true)
  const [copied, setCopied] = useState(false)

  const handleConnect = () => {
    if (isConnected) {
      navigator.clipboard.writeText(WALLET_ADDRESS)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } else {
      setIsConnected(true)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center">
              <Bitcoin className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">BitGame</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#games" className="text-gray-300 hover:text-orange-400 transition-colors flex items-center gap-1">
              <Gamepad2 className="w-4 h-4" />
              Games
            </a>
            <a href="#tournaments" className="text-gray-300 hover:text-orange-400 transition-colors flex items-center gap-1">
              <Trophy className="w-4 h-4" />
              Tournaments
            </a>
            <a href="#payments" className="text-gray-300 hover:text-orange-400 transition-colors flex items-center gap-1">
              <Wallet className="w-4 h-4" />
              Payments
            </a>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" className="text-gray-300 hover:text-white">
              <User className="w-4 h-4 mr-2" />
              Sign In
            </Button>
            {isConnected ? (
              <Button
                onClick={handleConnect}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4 mr-2" />
                    {WALLET_ADDRESS.slice(0, 6)}...{WALLET_ADDRESS.slice(-4)}
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleConnect}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <nav className="flex flex-col gap-4">
              <a href="#games" className="text-gray-300 hover:text-orange-400 transition-colors flex items-center gap-2">
                <Gamepad2 className="w-4 h-4" />
                Games
              </a>
              <a href="#tournaments" className="text-gray-300 hover:text-orange-400 transition-colors flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Tournaments
              </a>
              <a href="#payments" className="text-gray-300 hover:text-orange-400 transition-colors flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                Payments
              </a>
              <div className="pt-4 border-t border-gray-800 flex flex-col gap-3">
                <Button variant="ghost" className="text-gray-300 hover:text-white justify-start">
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
                {isConnected ? (
                  <Button
                    onClick={handleConnect}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white justify-start"
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    {WALLET_ADDRESS.slice(0, 6)}...{WALLET_ADDRESS.slice(-4)}
                  </Button>
                ) : (
                  <Button
                    onClick={handleConnect}
                    className="bg-orange-500 hover:bg-orange-600 text-white justify-start"
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    Connect Wallet
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}