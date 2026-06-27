// DEPLOYMENT GUIDE — Free Bitcoin Gaming Server
// ==============================================
// This file contains the BTCPay Server integration + commission system.
// Deploy for FREE using one of these options:
//
// OPTION 1: Oracle Cloud Free Tier (BEST — forever free)
//   Sign up: https://cloud.oracle.com/free
//   - Always-free ARM instance (4 cores, 24GB RAM)
//   - Install Docker, run docker-compose up -d
//
// OPTION 2: Google Cloud Free Tier
//   Sign up: https://cloud.google.com/free
//   - Always-free e2-micro instance
//
// OPTION 3: Railway.app (easy, limited free tier)
//   Sign up: https://railway.app
//   - $5 free credit per month
//
// OPTION 4: Render.com (easy)
//   Sign up: https://render.com
//   - Free tier for web services
//
// After deploy, BTCPay Server runs at https://btcpay.yourdomain.com
// Your gaming site runs at https://yourdomain.com

import { Hono } from 'hono'
import { prisma } from './src/lib/db'

const app = new Hono()

const SELLER_WALLET = process.env.SELLER_WALLET || '1QLTRW2YLBcwWJbCb1imGgwp98cSrUhNGJ'
const COMMISSION_RATE = parseFloat(process.env.COMMISSION_RATE || '0.05')
const BTCPAY_URL = process.env.BTCPAY_URL || 'http://localhost:80'
const BTCPAY_API_KEY = process.env.BTCPAY_API_KEY || ''
const BTCPAY_STORE_ID = process.env.BTCPAY_STORE_ID || ''

// ============================================
// HELPER: Call BTCPay Server API
// ============================================
async function btcpayApi(endpoint: string, method = 'GET', body?: unknown) {
  if (!BTCPAY_API_KEY) {
    throw new Error('BTCPay Server not configured. Add your API key to .env')
  }
  const res = await fetch(`${BTCPAY_URL}/api/v1${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `token ${BTCPAY_API_KEY}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`BTCPay API error ${res.status}: ${err}`)
  }
  return res.json()
}

// ============================================
// HELPER: Generate unique BTC address for invoice
// ============================================
async function generateAddress() {
  try {
    const result = await btcpayApi(`/stores/${BTCPAY_STORE_ID}/payment-methods/onchain/BTC/generate`)
    return result.address
  } catch {
    // Fallback: return seller wallet if BTCPay not configured
    return SELLER_WALLET
  }
}

// ============================================
// SEED GAMES
// ============================================
let gamesSeeded = false

async function seedGames() {
  if (gamesSeeded) return
  const count = await prisma.game.count()
  if (count > 0) { gamesSeeded = true; return }

  const games = [
    { title: 'Crypto Legends', description: 'Battle other players in this crypto-themed MOBA. Earn Bitcoin for every victory!', genre: 'MOBA', price: 0.005, rating: 4.8, players: 125000, featured: true },
    { title: 'Neon Racing', description: 'High-speed cyberpunk racing with crypto rewards. Customize your ride with NFT parts!', genre: 'Racing', price: 0.003, rating: 4.6, players: 89000, isNew: true },
    { title: 'Phantom Protocol', description: 'Stealth action game set in a dystopian future. Hack, infiltrate, and survive.', genre: 'Action', price: 0.008, rating: 4.9, players: 203000, featured: true },
    { title: 'Pixel Warriors', description: 'Retro-style RPG with modern blockchain rewards. Level up and earn BTC!', genre: 'RPG', price: 0.002, rating: 4.5, players: 67000 },
    { title: 'Target Strike', description: 'Tactical FPS with crypto tournaments. Compete for weekly Bitcoin prizes.', genre: 'FPS', price: 0.004, rating: 4.7, players: 156000 },
    { title: 'Shield Defense', description: 'Tower defense with blockchain integration. Protect your crypto fortress!', genre: 'Strategy', price: 0.001, rating: 4.4, players: 45000, isNew: true },
  ]

  await prisma.game.createMany({ data: games })
  gamesSeeded = true
}

// ============================================
// GET ALL GAMES
// ============================================
app.get('/games', async (c) => {
  await seedGames()
  const games = await prisma.game.findMany({ orderBy: { createdAt: 'desc' } })
  return c.json({ games })
})

// ============================================
// CREATE INVOICE — Player buys a game
// Creates a BTCPay invoice OR generates a BTC address
// ============================================
app.post('/payments/create-invoice', async (c) => {
  await seedGames()
  const body = await c.req.json()
  const { gameId, buyerAddress } = body

  if (!gameId) return c.json({ error: 'gameId is required' }, 400)

  const game = await prisma.game.findUnique({ where: { id: gameId } })
  if (!game) return c.json({ error: 'Game not found' }, 404)

  const commissionAmount = +(game.price * COMMISSION_RATE).toFixed(8)
  const sellerAmount = +(game.price - commissionAmount).toFixed(8)

  // Try to create a real BTCPay invoice
  let invoiceId: string | null = null
  let paymentAddress: string
  let checkoutLink: string | null = null

  if (BTCPAY_API_KEY && BTCPAY_STORE_ID) {
    try {
      const invoice = await btcpayApi(`/stores/${BTCPAY_STORE_ID}/invoices`, 'POST', {
        amount: game.price,
        currency: 'BTC',
        metadata: {
          orderId: `game-${game.id}-${Date.now()}`,
          itemDesc: `${game.title} - Game Purchase`,
          sellerWallet: SELLER_WALLET,
          commissionRate: COMMISSION_RATE,
        },
        checkout: {
          redirectURL: `${process.env.APP_URL || 'http://localhost:8080'}/payment-complete`,
          speedPolicy: 'HighSpeed',
        },
      })
      invoiceId = invoice.id
      paymentAddress = invoice.paymentMethods?.[0]?.paymentLink || SELLER_WALLET
      checkoutLink = invoice.checkoutLink
    } catch {
      // Fallback to manual payment
      paymentAddress = await generateAddress()
    }
  } else {
    paymentAddress = SELLER_WALLET
  }

  // Record purchase in database
  const purchase = await prisma.gamePurchase.create({
    data: {
      gameId,
      buyerAddress: buyerAddress || 'pending',
      sellerAddress: SELLER_WALLET,
      amount: game.price,
      commissionRate: COMMISSION_RATE,
      commissionAmount,
      sellerAmount,
      txHash: invoiceId,
      status: 'awaiting_payment',
    },
  })

  // Record commission ledger entry
  await prisma.commissionLedger.create({
    data: {
      purchaseId: purchase.id,
      sellerAddress: SELLER_WALLET,
      amount: commissionAmount,
      status: 'pending',
    },
  })

  return c.json({
    invoiceId: purchase.id,
    game: game.title,
    amount: game.price,
    paymentAddress,
    checkoutLink,
    commission: {
      rate: `${(COMMISSION_RATE * 100).toFixed(0)}%`,
      amount: commissionAmount,
      seller: SELLER_WALLET,
    },
    instructions: `Send exactly ${game.price} BTC to the payment address. After 6 confirmations, your game will be activated and ${commissionAmount} BTC commission will be credited to ${SELLER_WALLET}.`,
  })
})

// ============================================
// CHECK INVOICE STATUS — Poll payment confirmation
// ============================================
app.get('/payments/invoice/:id', async (c) => {
  const id = c.req.param('id')

  const purchase = await prisma.gamePurchase.findUnique({
    where: { id },
    include: { game: true },
  })

  if (!purchase) return c.json({ error: 'Invoice not found' }, 404)

  // If connected to BTCPay, check real status
  if (BTCPAY_API_KEY && purchase.txHash) {
    try {
      const invoice = await btcpayApi(`/stores/${BTCPAY_STORE_ID}/invoices/${purchase.txHash}`)
      if (invoice.status === 'Complete' && purchase.status !== 'confirmed') {
        await prisma.gamePurchase.update({
          where: { id },
          data: { status: 'confirmed', confirmedAt: new Date(), confirmations: 6 },
        })
        await prisma.commissionLedger.updateMany({
          where: { purchaseId: id },
          data: { status: 'confirmed' },
        })
      }
    } catch { /* ignore */ }
  }

  // Reload after potential update
  const updated = await prisma.gamePurchase.findUnique({
    where: { id },
    include: { game: true },
  })

  return c.json({
    id: updated!.id,
    game: updated!.game.title,
    amount: updated!.amount,
    status: updated!.status,
    confirmations: updated!.confirmations,
    commissionEarned: updated!.commissionAmount,
    createdAt: updated!.createdAt,
    confirmedAt: updated!.confirmedAt,
  })
})

// ============================================
// VERIFY TX HASH — Check blockchain confirmation
// ============================================
app.post('/payments/verify', async (c) => {
  const body = await c.req.json()
  const { txHash } = body

  if (!txHash) return c.json({ error: 'txHash is required' }, 400)

  // Check against Blockstream API (free, no key needed)
  try {
    const res = await fetch(`https://blockstream.info/api/tx/${txHash}`)
    if (res.ok) {
      const tx = await res.json() as { status?: { confirmed?: boolean; block_height?: number } }
      const confirmed = tx.status?.confirmed ?? false

      // Find matching purchase
      const purchase = await prisma.gamePurchase.findFirst({ where: { txHash } })

      if (purchase) {
        const newStatus = confirmed ? 'confirmed' : 'pending'
        const confirmations = confirmed ? 6 : 0

        await prisma.gamePurchase.update({
          where: { id: purchase.id },
          data: {
            status: newStatus,
            confirmations,
            confirmedAt: confirmed ? new Date() : null,
          },
        })

        if (confirmed) {
          await prisma.commissionLedger.updateMany({
            where: { purchaseId: purchase.id },
            data: { status: 'confirmed', txHash },
          })
        }

        return c.json({
          txHash,
          confirmed,
          amount: purchase.amount,
          commissionEarned: purchase.commissionAmount,
          message: confirmed
            ? `✅ Confirmed! ${purchase.commissionAmount} BTC commission earned by ${SELLER_WALLET}`
            : `⏳ Pending — waiting for confirmations`,
        })
      }
    }
  } catch { /* fallback */ }

  return c.json({ txHash, confirmed: false, message: 'Transaction not found or pending' })
})

// ============================================
// EARNINGS DASHBOARD — Your commission overview
// ============================================
app.get('/earnings/dashboard', async (c) => {
  await seedGames()

  const allPurchases = await prisma.gamePurchase.findMany({
    include: { game: true },
    orderBy: { createdAt: 'desc' },
  })

  const allLedger = await prisma.commissionLedger.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const totalRevenue = allPurchases.reduce((sum, p) => sum + p.amount, 0)
  const totalCommission = allLedger.reduce((sum, l) => sum + l.amount, 0)
  const confirmedCommission = allLedger
    .filter((l) => l.status === 'confirmed')
    .reduce((sum, l) => sum + l.amount, 0)
  const pendingCommission = allLedger
    .filter((l) => l.status === 'pending')
    .reduce((sum, l) => sum + l.amount, 0)
  const totalSales = allPurchases.length
  const confirmedSales = allPurchases.filter((p) => p.status === 'confirmed').length
  const pendingSales = allPurchases.filter((p) => p.status !== 'confirmed').length

  // Earnings by game
  const gameStats: Record<string, { sales: number; revenue: number; commission: number }> = {}
  for (const p of allPurchases) {
    const title = p.game.title
    if (!gameStats[title]) gameStats[title] = { sales: 0, revenue: 0, commission: 0 }
    gameStats[title].sales++
    gameStats[title].revenue += p.amount
    gameStats[title].commission += p.commissionAmount
  }

  const recentTransactions = allPurchases.slice(0, 20).map((p) => ({
    id: p.id,
    game: p.game.title,
    buyerAddress: p.buyerAddress,
    totalAmount: p.amount,
    commissionEarned: p.commissionAmount,
    status: p.status,
    confirmations: p.confirmations,
    txHash: p.txHash,
    createdAt: p.createdAt,
    confirmedAt: p.confirmedAt,
  }))

  return c.json({
    wallet: SELLER_WALLET,
    commissionRate: `${(COMMISSION_RATE * 100).toFixed(0)}%`,
    btcpayConnected: !!BTCPAY_API_KEY,
    summary: {
      totalRevenue: +totalRevenue.toFixed(8),
      totalCommission: +totalCommission.toFixed(8),
      confirmedCommission: +confirmedCommission.toFixed(8),
      pendingCommission: +pendingCommission.toFixed(8),
      totalSales,
      confirmedSales,
      pendingSales,
    },
    gameStats: Object.entries(gameStats).map(([title, stats]) => ({
      title,
      ...stats,
      commission: +stats.commission.toFixed(8),
      revenue: +stats.revenue.toFixed(8),
    })),
    recentTransactions,
  })
})

// ============================================
// SIMULATE SALES — Test the commission flow
// ============================================
app.post('/payments/simulate', async (c) => {
  await seedGames()
  const games = await prisma.game.findMany()

  const buyerWallets = [
    '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
    'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
    '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
    '1CounterpartyXXXXXXXXXXXXXXXUWLpVr',
  ]
  const statuses = ['confirmed', 'pending', 'confirmed', 'confirmed', 'pending']
  const created: { game: string; buyer: string; amount: number; commission: number; status: string; txHash: string }[] = []

  for (let i = 0; i < 5; i++) {
    const game = games[Math.floor(Math.random() * games.length)]
    const buyer = buyerWallets[Math.floor(Math.random() * buyerWallets.length)]
    const commissionAmount = +(game.price * COMMISSION_RATE).toFixed(8)
    const sellerAmount = +(game.price - commissionAmount).toFixed(8)
    const status = statuses[i]
    const confirmations = status === 'confirmed' ? Math.floor(Math.random() * 10) + 6 : Math.floor(Math.random() * 5)
    const txHash = Array.from({ length: 64 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')

    const purchase = await prisma.gamePurchase.create({
      data: {
        gameId: game.id,
        buyerAddress: buyer,
        sellerAddress: SELLER_WALLET,
        amount: game.price,
        commissionRate: COMMISSION_RATE,
        commissionAmount,
        sellerAmount,
        txHash,
        status,
        confirmations,
        confirmedAt: status === 'confirmed' ? new Date() : null,
      },
    })

    await prisma.commissionLedger.create({
      data: {
        purchaseId: purchase.id,
        sellerAddress: SELLER_WALLET,
        amount: commissionAmount,
        txHash,
        status,
      },
    })

    created.push({
      game: game.title,
      buyer,
      amount: game.price,
      commission: commissionAmount,
      status,
      txHash,
    })
  }

  return c.json({
    message: `Simulated ${created.length} player purchases. Commission updated!`,
    transactions: created,
  })
})

export default app
