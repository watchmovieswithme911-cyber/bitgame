import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Bitcoin, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Copy, 
  ExternalLink,
  AlertTriangle,
  Wallet,
  ArrowRight
} from 'lucide-react'

interface Transaction {
  txHash: string
  confirmations: number
  amount: number
  timestamp: string
  status: 'confirmed' | 'pending' | 'failed'
  from: string
  to: string
  fee: number
}

const WALLET_ADDRESS = '1QLTRW2YLBcwWJbCb1imGgwp98cSrUhNGJ'

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    txHash: '7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
    confirmations: 6,
    amount: 0.05,
    timestamp: '2024-03-15 14:32:18',
    status: 'confirmed',
    from: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    to: '1QLTRW2YLBcwWJbCb1imGgwp98cSrUhNGJ',
    fee: 0.00012
  },
  {
    txHash: '9f8e7d6c5b4a392817263544536271809a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d',
    confirmations: 2,
    amount: 0.12,
    timestamp: '2024-03-15 15:45:02',
    status: 'pending',
    from: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
    to: '1QLTRW2YLBcwWJbCb1imGgwp98cSrUhNGJ',
    fee: 0.00015
  },
  {
    txHash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    confirmations: 0,
    amount: 0.025,
    timestamp: '2024-03-15 16:10:45',
    status: 'pending',
    from: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
    to: '1QLTRW2YLBcwWJbCb1imGgwp98cSrUhNGJ',
    fee: 0.00008
  }
]

export function BitcoinPaymentChecker() {
  const [txHash, setTxHash] = useState('')
  const [searchResult, setSearchResult] = useState<Transaction | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkTransaction = async () => {
    if (!txHash.trim()) {
      setError('Please enter a transaction hash')
      return
    }
    
    setIsSearching(true)
    setError(null)
    setSearchResult(null)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const found = MOCK_TRANSACTIONS.find(t => t.txHash.includes(txHash))
    if (found) {
      setSearchResult(found)
    } else {
      setError('Transaction not found. Please check the hash and try again.')
    }
    setIsSearching(false)
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(WALLET_ADDRESS)
    setCopiedAddress(true)
    setTimeout(() => setCopiedAddress(false), 2000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />
      case 'pending':
        return <Clock className="w-5 h-5 text-amber-400" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'pending':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="check" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-900/50 border border-gray-800">
          <TabsTrigger value="check" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
            <Search className="w-4 h-4 mr-2" />
            Check Transaction
          </TabsTrigger>
          <TabsTrigger value="wallet" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
            <Wallet className="w-4 h-4 mr-2" />
            My Wallet
          </TabsTrigger>
        </TabsList>

        <TabsContent value="check" className="space-y-4">
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Bitcoin className="w-5 h-5 text-orange-400" />
                Bitcoin Transaction Checker
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter transaction hash (txid)..."
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  className="flex-1 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 font-mono text-sm"
                  onKeyDown={(e) => e.key === 'Enter' && checkTransaction()}
                />
                <Button 
                  onClick={checkTransaction}
                  disabled={isSearching}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {isSearching ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {error && (
                <Alert className="bg-red-500/10 border-red-500/30">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-300">{error}</AlertDescription>
                </Alert>
              )}

              {searchResult && (
                <div className="space-y-4 p-4 rounded-lg bg-gray-800/30 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-white">Transaction Details</h4>
                    <Badge className={getStatusColor(searchResult.status)}>
                      {getStatusIcon(searchResult.status)}
                      <span className="ml-1">{searchResult.status.toUpperCase()}</span>
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Amount</p>
                      <p className="text-white font-mono text-lg">{searchResult.amount} BTC</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Confirmations</p>
                      <p className="text-white font-mono text-lg">{searchResult.confirmations}/6</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Timestamp</p>
                      <p className="text-white font-mono">{searchResult.timestamp}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Fee</p>
                      <p className="text-white font-mono">{searchResult.fee} BTC</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <p className="text-gray-400 text-xs">From</p>
                      <p className="text-white font-mono text-xs break-all">{searchResult.from}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">To</p>
                      <p className="text-white font-mono text-xs break-all">{searchResult.to}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <p className="text-gray-400 text-xs">TxID:</p>
                    <p className="text-orange-400 font-mono text-xs truncate flex-1">{searchResult.txHash}</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2 text-gray-400 hover:text-white"
                      onClick={() => window.open(`https://blockstream.info/tx/${searchResult.txHash}`, '_blank')}
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>

                  {searchResult.status === 'confirmed' && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300 text-sm">
                        Transaction confirmed! Your game purchase is complete.
                      </span>
                      <ArrowRight className="w-4 h-4 text-emerald-400 ml-auto" />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white text-sm">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {MOCK_TRANSACTIONS.map((tx) => (
                  <div 
                    key={tx.txHash}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30 border border-gray-700/50 hover:border-gray-600 transition-colors cursor-pointer"
                    onClick={() => {
                      setTxHash(tx.txHash)
                      setSearchResult(tx)
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(tx.status)}
                      <div>
                        <p className="text-white text-sm font-mono">{tx.txHash.slice(0, 16)}...</p>
                        <p className="text-gray-400 text-xs">{tx.timestamp}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-mono">{tx.amount} BTC</p>
                      <Badge className={`${getStatusColor(tx.status)} text-xs`}>
                        {tx.confirmations} conf
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wallet" className="space-y-4">
          <Card className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-orange-500/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Wallet className="w-5 h-5 text-orange-400" />
                Your Bitcoin Wallet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-2">
                <p className="text-gray-400 text-sm">Wallet Address</p>
                <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                  <p className="text-white font-mono text-sm break-all">{WALLET_ADDRESS}</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-2"
                    onClick={copyAddress}
                  >
                    {copiedAddress ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-700 text-center">
                  <p className="text-gray-400 text-sm">Balance</p>
                  <p className="text-2xl font-bold text-white">0.195 BTC</p>
                  <p className="text-emerald-400 text-xs">≈ $12,450.00</p>
                </div>
                <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-700 text-center">
                  <p className="text-gray-400 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-amber-400">0.145 BTC</p>
                  <p className="text-gray-400 text-xs">2 transactions</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-gray-400 text-sm">Quick Pay for Games</p>
                <div className="grid grid-cols-3 gap-2">
                  {['0.001', '0.005', '0.01'].map((amount) => (
                    <Button 
                      key={amount}
                      variant="outline" 
                      className="border-gray-700 text-white hover:bg-orange-500/20 hover:border-orange-500/50"
                    >
                      {amount} BTC
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}