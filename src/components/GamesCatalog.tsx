import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Gamepad2, 
  Star, 
  ShoppingCart, 
  Bitcoin,
  Clock,
  Users,
  Zap,
  Shield,
  Swords,
  Target,
  Car,
  Ghost
} from 'lucide-react'

interface Game {
  id: string
  title: string
  description: string
  price: number
  rating: number
  players: string
  genre: string
  image: string
  featured?: boolean
  new?: boolean
  icon: React.ReactNode
}

const GAMES: Game[] = [
  {
    id: '1',
    title: 'Crypto Legends',
    description: 'Battle other players in this crypto-themed MOBA. Earn Bitcoin for every victory!',
    price: 0.005,
    rating: 4.8,
    players: '125K',
    genre: 'MOBA',
    image: 'from-purple-600 to-blue-600',
    featured: true,
    icon: <Swords className="w-12 h-12 text-purple-400" />
  },
  {
    id: '2',
    title: 'Neon Racing',
    description: 'High-speed cyberpunk racing with crypto rewards. Customize your ride with NFT parts!',
    price: 0.003,
    rating: 4.6,
    players: '89K',
    genre: 'Racing',
    image: 'from-cyan-500 to-blue-500',
    new: true,
    icon: <Car className="w-12 h-12 text-cyan-400" />
  },
  {
    id: '3',
    title: 'Phantom Protocol',
    description: 'Stealth action game set in a dystopian future. Hack, infiltrate, and survive.',
    price: 0.008,
    rating: 4.9,
    players: '203K',
    genre: 'Action',
    image: 'from-green-500 to-emerald-600',
    featured: true,
    icon: <Ghost className="w-12 h-12 text-green-400" />
  },
  {
    id: '4',
    title: 'Pixel Warriors',
    description: 'Retro-style RPG with modern blockchain rewards. Level up and earn BTC!',
    price: 0.002,
    rating: 4.5,
    players: '67K',
    genre: 'RPG',
    image: 'from-orange-500 to-red-500',
    icon: <Zap className="w-12 h-12 text-orange-400" />
  },
  {
    id: '5',
    title: 'Target Strike',
    description: 'Tactical FPS with crypto tournaments. Compete for weekly Bitcoin prizes.',
    price: 0.004,
    rating: 4.7,
    players: '156K',
    genre: 'FPS',
    image: 'from-red-500 to-pink-500',
    icon: <Target className="w-12 h-12 text-red-400" />
  },
  {
    id: '6',
    title: 'Shield Defense',
    description: 'Tower defense with blockchain integration. Protect your crypto fortress!',
    price: 0.001,
    rating: 4.4,
    players: '45K',
    genre: 'Strategy',
    image: 'from-blue-500 to-indigo-600',
    new: true,
    icon: <Shield className="w-12 h-12 text-blue-400" />
  }
]

export function GamesCatalog() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [purchasedGames, setPurchasedGames] = useState<string[]>([])

  const handlePurchase = (game: Game) => {
    setPurchasedGames([...purchasedGames, game.id])
    setSelectedGame(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Gamepad2 className="w-6 h-6 text-orange-400" />
          Featured Games
        </h2>
        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
          {GAMES.length} Games Available
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {GAMES.map((game) => (
          <Card 
            key={game.id}
            className="bg-gray-900/50 border-gray-800 backdrop-blur-xl hover:border-gray-700 transition-all group overflow-hidden"
          >
            <div className={`h-32 bg-gradient-to-br ${game.image} flex items-center justify-center relative`}>
              {game.icon}
              {game.featured && (
                <Badge className="absolute top-2 right-2 bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
              {game.new && (
                <Badge className="absolute top-2 right-2 bg-green-500/20 text-green-400 border-green-500/30">
                  NEW
                </Badge>
              )}
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-white group-hover:text-orange-400 transition-colors">
                  {game.title}
                </CardTitle>
                <Badge className="bg-gray-700/50 text-gray-300 text-xs">
                  {game.genre}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                {game.description}
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-white">{game.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">{game.players}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2 border-t border-gray-800">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1 text-orange-400">
                  <Bitcoin className="w-4 h-4" />
                  <span className="font-mono font-bold">{game.price} BTC</span>
                </div>
                {purchasedGames.includes(game.id) ? (
                  <Button 
                    size="sm" 
                    className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    disabled
                  >
                    ✓ Owned
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={() => setSelectedGame(game)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Buy Now
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Purchase Dialog */}
      <Dialog open={selectedGame !== null} onOpenChange={(open) => !open && setSelectedGame(null)}>
        <DialogContent className="bg-gray-900 border-gray-800">
          {selectedGame && (
            <>
              <DialogHeader>
                <DialogTitle className="text-white flex items-center gap-2">
                  <Bitcoin className="w-5 h-5 text-orange-400" />
                  Confirm Purchase
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  You are about to purchase {selectedGame.title} with Bitcoin
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                  <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${selectedGame.image} flex items-center justify-center`}>
                    {selectedGame.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{selectedGame.title}</h4>
                    <p className="text-gray-400 text-sm">{selectedGame.genre}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Price</span>
                    <span className="text-white font-mono">{selectedGame.price} BTC</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Network Fee</span>
                    <span className="text-white font-mono">~0.0001 BTC</span>
                  </div>
                  <div className="border-t border-gray-700 pt-2 flex justify-between">
                    <span className="text-gray-400">Total</span>
                    <span className="text-orange-400 font-mono font-bold">{(selectedGame.price + 0.0001).toFixed(4)} BTC</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <p className="text-amber-300 text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Payment will be confirmed after 6 network confirmations
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setSelectedGame(null)}
                  className="border-gray-700 text-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={() => handlePurchase(selectedGame)}
                >
                  <Bitcoin className="w-4 h-4 mr-2" />
                  Pay with BTC
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}