import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Bitcoin, 
  TrendingUp, 
  Wallet, 
  Clock, 
  CheckCircle2, 
  RefreshCw,
  ExternalLink,
  Zap,
  BarChart3,
  ArrowUpRight,
  Copy
} from 'lucide-react'

interface GameStat {
  title: string
  sales: number
  revenue: number
  commission: number
}

interface Transaction {
  id: string
  game: string
  buyerAddress: string
  totalAmount: number
  commissionEarned: number
  status: string
  confirmations: number
  txHash: string | null
  createdAt: string
  confirmedAt: string | null
}

interface DashboardData {
  wallet: string
  commissionRate: string
  summary: {
    totalRevenue: number
    totalCommission: number
    confirmedCommission: number
    pendingCommission: number
    totalSales: number
    confirmedSales: number
    pendingSales: number
  }
  gameStats: GameStat[]
  recentTransactions: Transaction[]
}

export function EarningsDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [simulating, setSimulating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const fetchDashboard = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/earnings/dashboard')
      const body = await res.json()
      if (!res.ok) {
        setError(body.error ?? `HTTP ${res.status}`)
      } else {
        setData(body)
      }
    } catch {
      setError('Failed to load dashboard')
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchDashboard() }, [fetchDashboard])

  const simulatePayments = async () => {
    setSimulating(true)
    try {
      const res = await fetch('/api/payments/simulate', { method: 'POST' })
      const body = await res.json()
      if (!res.ok) {
        setError(body.error ?? 'Simulation failed')
      } else {
        await fetchDashboard()
      }
    } catch {
      setError('Simulation request failed')
    }
    setSimulating(false)
  }

  const copyWallet = () => {
    if (!data?.wallet) return
    navigator.clipboard.writeText(data.wallet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />
      case 'pending': return <Clock className="w-4 h-4 text-amber-400" />
      default: return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'pending': return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (error && !data) {
    return (
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="py-10 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={fetchDashboard} className="bg-orange-500 hover:bg-orange-600 text-white">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!data) return null

  const s = data.summary

  return (
    <div className="space-y-6">
      {/* Wallet header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Earnings Dashboard</h2>
            <div className="flex items-center gap-2">
              <p className="text-gray-400 text-sm font-mono truncate max-w-[300px]">{data.wallet}</p>
              <button onClick={copyWallet} className="text-gray-500 hover:text-orange-400 transition-colors">
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 px-3 py-1">
            <Zap className="w-3 h-3 mr-1" />
            {data.commissionRate} Commission
          </Badge>
          <Button 
            onClick={simulatePayments} 
            disabled={simulating}
            variant="outline" 
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            {simulating ? (
              <div className="w-4 h-4 border-2 border-gray-500/30 border-t-gray-300 rounded-full animate-spin mr-2" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Simulate Sales
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-orange-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Bitcoin className="w-4 h-4 text-orange-400" />
              <span className="text-gray-400 text-sm">Total Commission Earned</span>
            </div>
            <p className="text-2xl font-bold text-orange-400 font-mono">{s.totalCommission} BTC</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-gray-400 text-sm">Confirmed Earnings</span>
            </div>
            <p className="text-2xl font-bold text-emerald-400 font-mono">{s.confirmedCommission} BTC</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-gray-400 text-sm">Pending Earnings</span>
            </div>
            <p className="text-2xl font-bold text-amber-400 font-mono">{s.pendingCommission} BTC</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <span className="text-gray-400 text-sm">Total Sales</span>
            </div>
            <p className="text-2xl font-bold text-white">{s.totalSales}</p>
            <p className="text-xs text-gray-500">{s.confirmedSales} confirmed · {s.pendingSales} pending</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs: Per-game breakdown + Recent transactions */}
      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-900/50 border border-gray-800">
          <TabsTrigger value="transactions" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
            <Clock className="w-4 h-4 mr-2" />
            Recent Transactions
          </TabsTrigger>
          <TabsTrigger value="games" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
            <TrendingUp className="w-4 h-4 mr-2" />
            Earnings by Game
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-3">
          {data.recentTransactions.length === 0 ? (
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="py-10 text-center">
                <Bitcoin className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-400">No transactions yet.</p>
                <p className="text-gray-500 text-sm mt-1">Click "Simulate Sales" to see sample player purchases flow through your commission system.</p>
              </CardContent>
            </Card>
          ) : (
            data.recentTransactions.map((tx) => (
              <Card key={tx.id} className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(tx.status)}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-white font-medium">{tx.game}</p>
                          <Badge className={`${getStatusColor(tx.status)} text-xs`}>
                            {tx.status}
                          </Badge>
                          {tx.confirmations > 0 && (
                            <span className="text-xs text-gray-500">{tx.confirmations} conf</span>
                          )}
                        </div>
                        <p className="text-gray-500 text-xs font-mono truncate mt-0.5">
                          Buyer: {tx.buyerAddress}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 sm:text-right">
                      <div>
                        <p className="text-gray-400 text-xs">Sale</p>
                        <p className="text-white font-mono text-sm">{tx.totalAmount} BTC</p>
                      </div>
                      <div>
                        <p className="text-orange-400 text-xs flex items-center gap-1">
                          <ArrowUpRight className="w-3 h-3" />
                          Your Cut
                        </p>
                        <p className="text-orange-400 font-mono text-sm font-bold">+{tx.commissionEarned} BTC</p>
                      </div>
                      {tx.txHash && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-gray-500 hover:text-white"
                          onClick={() => window.open(`https://blockstream.info/tx/${tx.txHash}`, '_blank')}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="games" className="space-y-3">
          {data.gameStats.length === 0 ? (
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="py-10 text-center">
                <TrendingUp className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-400">No game sales yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.gameStats.map((g) => (
                <Card key={g.title} className="bg-gray-900/50 border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-base">{g.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Sales</span>
                      <span className="text-white">{g.sales}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Revenue</span>
                      <span className="text-white font-mono">{g.revenue} BTC</span>
                    </div>
                    <div className="flex justify-between text-sm border-t border-gray-800 pt-2">
                      <span className="text-orange-400 font-medium">Your Commission</span>
                      <span className="text-orange-400 font-mono font-bold">+{g.commission} BTC</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}