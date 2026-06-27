#!/usr/bin/env bun
/**
 * Agent Server Entry Point
 * Run this as: bun run src/agent/server.ts
 * OR deploy as a separate microservice
 */

import { startAgent } from './worker'

// Start the agent
console.log('Starting BitGame 24/7 AI Agent Worker...')
startAgent().catch((error) => {
  console.error('Failed to start agent:', error)
  process.exit(1)
})

// Keep process alive
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason)
  process.exit(1)
})
