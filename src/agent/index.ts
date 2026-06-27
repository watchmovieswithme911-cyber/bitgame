/**
 * Agent Integration Module
 * Starts the 24/7 worker in background or as separate process
 */

import { startAgent } from './worker'

export async function initializeAgent() {
  console.log('🤖 Initializing BitGame AI Agent...')
  await startAgent()
}

export default initializeAgent
