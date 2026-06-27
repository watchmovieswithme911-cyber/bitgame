# BitGame 24/7 AI Agent Setup Guide

## ✨ What the Agent Does

The **BitGame AI Agent Worker** runs 24/7 in the background and automatically:

- ✅ **Monitors pending payments** - Checks blockchain for transaction confirmations every 60 seconds
- 💰 **Settles commissions** - Automatically marks confirmed payments and calculates earnings
- 📊 **Generates reports** - Hourly summaries + daily snapshots of revenue/commissions
- 🔄 **Detects failures** - Marks expired transactions as failed after 1 hour
- 🛡️ **Error recovery** - Continues running even if individual checks fail

## 🚀 Quick Start

### Option 1: Run Locally (Development)

```bash
# Terminal 1: Start web server
bun run dev:server

# Terminal 2: Start web client
bun run dev:client

# Terminal 3: Start AI Agent
bun run dev:agent
```

Or all together:
```bash
bun run dev:full
```

### Option 2: Docker Compose (Production-Ready)

```bash
# Create .env file
cp .env.example .env
# Edit with your credentials:
# SELLER_WALLET=your_btc_wallet
# BTCPAY_API_KEY=your_btcpay_key
# etc.

# Start everything
docker-compose up -d

# View logs
docker-compose logs -f agent
docker-compose logs -f web
```

### Option 3: Systemd Service (Linux)

```bash
sudo bash scripts/deploy-agent.sh

# Check status
systemctl status bitgame-agent

# View logs
journalctl -u bitgame-agent -f
```

## 📋 Environment Variables

```env
# Bitcoin Settings
SELLER_WALLET=1QLTRW2YLBcwWJbCb1imGgwp98cSrUhNGJ
COMMISSION_RATE=0.05  # 5%

# BTCPay Server (optional but recommended)
BTCPAY_URL=https://your-btcpay.com
BTCPAY_API_KEY=xxxxx
BTCPAY_STORE_ID=xxxxx

# Web App
APP_URL=https://yourdomain.com
```

## 🔧 Agent APIs

The worker exposes monitoring via endpoints:

```bash
# Check earnings dashboard
curl http://localhost:8080/earnings/dashboard

# Get all games
curl http://localhost:8080/games

# Simulate a sale (for testing)
curl -X POST http://localhost:8080/payments/simulate

# Verify a transaction
curl -X POST http://localhost:8080/payments/verify \
  -H "Content-Type: application/json" \
  -d '{"txHash":"abc123..."}'
```

## 📊 Worker Lifecycle

```
Every 60 seconds:
  1. Check pending payments (Blockstream API)
  2. Detect failed/expired transactions
  3. Settle confirmed commissions
  
Every 60 checks (1 hour):
  4. Generate hourly earnings report
  
Every 1440 checks (24 hours):
  5. Generate daily dashboard snapshot
```

## 🛑 Stopping the Agent

```bash
# Docker
docker-compose down

# Systemd
systemctl stop bitgame-agent

# Manual process
kill -SIGTERM <pid>
```

The agent gracefully shuts down and logs final stats.

## 📈 Monitoring

View worker state and stats:

```typescript
// src/agent/worker.ts exports:
- state.checksCompleted      // Total cycles run
- state.paymentsProcessed    // Payments confirmed
- state.commissionsSettled   // Commissions handled
- state.errors               // Errors encountered
- state.lastRun              // Last check timestamp
```

## 🔐 Security Notes

- Agent uses read-only Blockstream API (no keys needed)
- Commission settlements are database-only (configure payout separately)
- All transactions logged to database
- SIGTERM/SIGINT handling for graceful shutdown

## 🚀 Deploy to Oracle Cloud Free Tier

```bash
# SSH into your free instance
ssh ubuntu@your-instance

# Clone repo
git clone https://github.com/watchmovieswithme911-cyber/bitgame.git
cd bitgame

# Install dependencies
curl -fsSL https://bun.sh | bash
source ~/.bashrc

# Set environment
cp .env.example .env
nano .env  # Edit with your settings

# Run with docker-compose
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v $(pwd):/workdir docker/compose:latest up -d

# View logs
docker-compose logs -f agent
```

That's it! Your 24/7 AI Agent is now running for **FREE** on Oracle Cloud 🎉

---

**Questions?** Check the main [README.md](../README.md) or create an issue on GitHub.
