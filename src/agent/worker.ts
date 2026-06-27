/**
 * 24/7 AUTONOMOUS AI AGENT WORKER
 * ================================
 * This worker runs continuously in the background, monitoring:
 * - Pending payment confirmations (via Blockstream API)
 * - Commission settlements
 * - Transaction status updates
 * - Automated earnings reports
 *
 * Deploy alongside your server: `bun run src/agent/worker.ts`
 */

import { prisma } from '../lib/db'

const WORKER_NAME = '⚡ BitGame AI Agent'
const CHECK_INTERVAL = 60_000 // Check every 60 seconds
const BLOCKSTREAM_API = 'https://blockstream.info/api'
const SELLER_WALLET = process.env.SELLER_WALLET || '1QLTRW2YLBcwWJbCb1imGgwp98cSrUhNGJ'
const COMMISSION_RATE = parseFloat(process.env.COMMISSION_RATE || '0.05')

interface WorkerState {
  lastRun: number
  checksCompleted: number
  paymentsProcessed: number
  commissionsSettled: number
  errors: number
}

let state: WorkerState = {
  lastRun: 0,
  checksCompleted: 0,
  paymentsProcessed: 0,
  commissionsSettled: 0,
  errors: 0,
}

// ============================================
// HELPER: Fetch transaction from blockchain
// ============================================
async function fetchBlockstreamTx(txHash: string): Promise<{
  confirmed: boolean
  confirmations: number
} | null> {
  try {
    const res = await fetch(`${BLOCKSTREAM_API}/tx/${txHash}`)
    if (!res.ok) return null

    const tx = await res.json() as {
      status?: { confirmed?: boolean; block_height?: number }
    }

    if (tx.status?.confirmed) {
      return { confirmed: true, confirmations: 6 }
    }
    return { confirmed: false, confirmations: 0 }
  } catch (err) {
    console.error(`❌ Blockstream fetch failed for ${txHash}:`, err)
    return null
  }
}

// ============================================
// TASK 1: Check pending payments
// ============================================
async function checkPendingPayments() {
  const pending = await prisma.gamePurchase.findMany({
    where: { status: { in: ['awaiting_payment', 'pending'] } },
    include: { game: true },
  })

  console.log(`📋 Checking ${pending.length} pending payments...`)

  for (const purchase of pending) {
    if (!purchase.txHash) continue

    const blockchainData = await fetchBlockstreamTx(purchase.txHash)
    if (!blockchainData) continue

    if (blockchainData.confirmed && purchase.status !== 'confirmed') {
      // 🎉 Payment confirmed! Update status
      await prisma.gamePurchase.update({
        where: { id: purchase.id },
        data: {
          status: 'confirmed',
          confirmations: blockchainData.confirmations,
          confirmedAt: new Date(),
        },
      })

      // Settle commission
      await prisma.commissionLedger.updateMany({
        where: { purchaseId: purchase.id, status: 'pending' },
        data: { status: 'confirmed', txHash: purchase.txHash },
      })

      console.log(
        `✅ CONFIRMED: ${purchase.game.title} | ${purchase.amount} BTC | Commission: ${purchase.commissionAmount} BTC`
      )

      state.paymentsProcessed++
    }
  }
}

// ============================================
// TASK 2: Detect failed/expired transactions
// ============================================
async function detectFailedPayments() {
  const stale = await prisma.gamePurchase.findMany({
    where: {
      status: 'awaiting_payment',
      createdAt: {
        lt: new Date(Date.now() - 3600_000), // Older than 1 hour
      },
    },
  })

  for (const purchase of stale) {
    if (!purchase.txHash) {
      // No tx hash after 1 hour = failed to send
      await prisma.gamePurchase.update({
        where: { id: purchase.id },
        data: { status: 'failed' },
      })

      await prisma.commissionLedger.updateMany({
        where: { purchaseId: purchase.id },
        data: { status: 'failed' },
      })

      console.log(`⚠️ EXPIRED: Payment for ${purchase.id} (no tx hash after 1h)`)
    }
  }
}

// ============================================
// TASK 3: Automatic commission settlement
// ============================================
async function settleCommissions() {
  const confirmed = await prisma.commissionLedger.findMany({
    where: { status: 'confirmed' },
  })

  if (confirmed.length === 0) return

  const totalCommission = confirmed.reduce((sum, c) => sum + c.amount, 0)

  console.log(
    `💰 Ready to settle: ${confirmed.length} confirmed commissions | Total: ${totalCommission.toFixed(8)} BTC`
  )

  // Mark as settled (in real scenario, would integrate payout service)
  await prisma.commissionLedger.updateMany({
    where: { status: 'confirmed', id: { in: confirmed.map((c) => c.id) } },
    data: { status: 'settled' },
  })

  state.commissionsSettled += confirmed.length
}

// ============================================
// TASK 4: Hourly earnings report
// ============================================
async function generateHourlyReport() {
  const oneHourAgo = new Date(Date.now() - 3600_000)

  const recentPurchases = await prisma.gamePurchase.findMany({
    where: { createdAt: { gte: oneHourAgo } },
    include: { game: true },
  })

  const recentCommissions = await prisma.commissionLedger.findMany({
    where: { createdAt: { gte: oneHourAgo } },
  })

  const hourlyRevenue = recentPurchases.reduce((sum, p) => sum + p.amount, 0)
  const hourlyCommission = recentCommissions.reduce((sum, c) => sum + c.amount, 0)
  const confirmedInHour = recentCommissions
    .filter((c) => c.status === 'confirmed')
    .reduce((sum, c) => sum + c.amount, 0)

  if (recentPurchases.length > 0 || recentCommissions.length > 0) {
    console.log(
      `\n📊 HOURLY REPORT\n` +
        `   Revenue: ${hourlyRevenue.toFixed(8)} BTC (${recentPurchases.length} sales)\n` +
        `   Commission: ${hourlyCommission.toFixed(8)} BTC\n` +
        `   Confirmed: ${confirmedInHour.toFixed(8)} BTC\n`
    )
  }
}

// ============================================
// TASK 5: Daily dashboard snapshot
// ============================================
async function dailySnapshot() {
  const allPurchases = await prisma.gamePurchase.findMany({
    include: { game: true },
  })

  const allCommissions = await prisma.commissionLedger.findMany()

  const stats = {
    totalRevenue: allPurchases.reduce((sum, p) => sum + p.amount, 0),
    totalCommission: allCommissions.reduce((sum, c) => sum + c.amount, 0),
    confirmedCommission: allCommissions
      .filter((c) => c.status === 'confirmed')
      .reduce((sum, c) => sum + c.amount, 0),
    totalSales: allPurchases.length,
    confirmedSales: allPurchases.filter((p) => p.status === 'confirmed').length,
  }

  console.log(
    `\n🎮 DAILY SNAPSHOT\n` +
      `   Total Revenue: ${stats.totalRevenue.toFixed(8)} BTC\n` +
      `   Total Commission: ${stats.totalCommission.toFixed(8)} BTC\n` +
      `   Confirmed Commission: ${stats.confirmedCommission.toFixed(8)} BTC\n` +
      `   Sales: ${stats.confirmedSales}/${stats.totalSales} confirmed\n`
  )
}

// ============================================
// WORKER LOOP: Main execution
// ============================================
async function runWorkerCycle() {
  const startTime = Date.now()
  state.lastRun = startTime

  try {
    console.log(`\n⚡ [${new Date().toISOString()}] Starting agent cycle...`)

    // Run checks in sequence
    await checkPendingPayments()
    await detectFailedPayments()
    await settleCommissions()

    // Hourly & daily reports (every 60 checks, every 1440 checks)
    if (state.checksCompleted % 60 === 0) {
      await generateHourlyReport()
    }
    if (state.checksCompleted % 1440 === 0) {
      await dailySnapshot()
    }

    state.checksCompleted++

    const elapsed = Date.now() - startTime
    console.log(`✅ Cycle complete (${elapsed}ms) | Checks: ${state.checksCompleted}`)
  } catch (err) {
    state.errors++
    console.error(`❌ ERROR during cycle:`, err)
  }
}

// ============================================
// GRACEFUL SHUTDOWN
// ============================================
process.on('SIGTERM', async () => {
  console.log(`\n👋 Shutting down ${WORKER_NAME}...`)
  console.log(`   Total cycles: ${state.checksCompleted}`)
  console.log(`   Payments processed: ${state.paymentsProcessed}`)
  console.log(`   Commissions settled: ${state.commissionsSettled}`)
  console.log(`   Errors: ${state.errors}`)
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGINT', async () => {
  console.log(`\n👋 Interrupted. Shutting down...`)
  await prisma.$disconnect()
  process.exit(0)
})

// ============================================
// START AGENT
// ============================================
export async function startAgent() {
  console.log(`\n🚀 ${WORKER_NAME} starting...`)
  console.log(`   Check interval: ${CHECK_INTERVAL / 1000}s`)
  console.log(`   Seller wallet: ${SELLER_WALLET}`)
  console.log(`   Commission rate: ${(COMMISSION_RATE * 100).toFixed(0)}%\n`)

  // Run immediately on startup
  await runWorkerCycle()

  // Then run every CHECK_INTERVAL
  setInterval(() => {
    runWorkerCycle().catch((err) => {
      console.error('🔥 Unhandled error in cycle:', err)
      state.errors++
    })
  }, CHECK_INTERVAL)

  console.log(`✨ Agent is now running 24/7`)
}

// ============================================
// RUN IF CALLED DIRECTLY
// ============================================
if (import.meta.main) {
  startAgent().catch((err) => {
    console.error('Fatal error:', err)
    process.exit(1)
  })
}

export { state, startAgent }
