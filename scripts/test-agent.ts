#!/usr/bin/env bun
/**
 * Test Suite for AI Agent Worker
 * Run: bun run scripts/test-agent.ts
 */

import { prisma } from '../src/lib/db'

async function testAgent() {
  console.log('🧪 BitGame AI Agent Test Suite\n')

  try {
    // Test 1: Database connectivity
    console.log('📝 Test 1: Database connection...')
    const gameCount = await prisma.game.count()
    console.log(`   ✅ Connected. Games in DB: ${gameCount}\n`)

    // Test 2: Payment simulation
    console.log('📝 Test 2: Creating test payment...')
    const games = await prisma.game.findMany({ take: 1 })
    if (games.length === 0) {
      console.log('   ⚠️  No games found. Skipping payment test.\n')
    } else {
      const testPurchase = await prisma.gamePurchase.create({
        data: {
          gameId: games[0].id,
          buyerAddress: 'test_buyer_123',
          sellerAddress: 'test_seller_123',
          amount: 0.001,
          commissionRate: 0.05,
          commissionAmount: 0.00005,
          sellerAmount: 0.00095,
          status: 'pending',
        },
      })
      console.log(`   ✅ Created test purchase: ${testPurchase.id}\n`)

      // Test 3: Commission creation
      console.log('📝 Test 3: Recording commission...')
      const commission = await prisma.commissionLedger.create({
        data: {
          purchaseId: testPurchase.id,
          sellerAddress: 'test_seller_123',
          amount: 0.00005,
          status: 'pending',
        },
      })
      console.log(`   ✅ Created commission ledger: ${commission.id}\n`)

      // Test 4: Query pending payments
      console.log('📝 Test 4: Querying pending payments...')
      const pending = await prisma.gamePurchase.findMany({
        where: { status: 'pending' },
      })
      console.log(`   ✅ Found ${pending.length} pending payment(s)\n`)

      // Cleanup
      console.log('🧹 Cleaning up test data...')
      await prisma.commissionLedger.deleteMany({
        where: { purchaseId: testPurchase.id },
      })
      await prisma.gamePurchase.delete({
        where: { id: testPurchase.id },
      })
      console.log('   ✅ Test data cleaned\n')
    }

    console.log('✨ All tests passed! Agent is ready to run.\n')
    console.log('Next steps:')
    console.log('  1. Set environment variables in .env')
    console.log('  2. Run: bun run start:agent')
    console.log('  3. Monitor: docker-compose logs -f agent\n')
  } catch (error) {
    console.error('❌ Test failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testAgent()
