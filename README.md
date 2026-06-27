# BitGame - Bitcoin Gaming Platform 🎮⚡

**Play games, earn Bitcoin commissions. Powered by a 24/7 AI Agent.**

## ✨ Features

- 🎮 **Game Catalog** - Browse and purchase games with Bitcoin
- 💰 **Commission System** - Earn BTC commissions automatically
- 🤖 **24/7 AI Agent** - Autonomous worker monitors payments 24/7
- ✅ **Auto-Confirmation** - Blockchain transactions confirmed instantly
- 📊 **Earnings Dashboard** - Real-time stats and reports
- ⚡ **BTCPay Integration** - Professional payment processing
- 🚀 **Production Ready** - Deploy on free cloud tier (Oracle, Google, etc.)

## 🚀 Quick Start

### Local Development

```bash
# Clone & install
git clone https://github.com/watchmovieswithme911-cyber/bitgame
cd bitgame
bun install

# Setup database
bun run db:push

# Run everything
bun run dev:full
# Or separately:
bun run dev:server      # Web server on :8080
bun run dev:client      # React client on :5173
bun run dev:agent       # AI Agent (background worker)
```

### Production with Docker

```bash
# Setup environment
cp .env.example .env
# Edit .env with your settings

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f agent
docker-compose logs -f web
```

## 📖 Documentation

- **[Agent Setup Guide](docs/AGENT_SETUP.md)** - How the AI agent works and deployment options
- **[API Reference](docs/API.md)** - REST endpoints
- **[Architecture](docs/ARCHITECTURE.md)** - System design

## 🤖 24/7 AI Agent

The agent automatically:

✅ Monitors pending Bitcoin payments every 60 seconds
💰 Settles commissions when transactions confirm
📊 Generates hourly and daily earnings reports
🔄 Detects and marks failed/expired payments
🛡️ Maintains uptime with error recovery

**Start the agent:**
```bash
bun run start:agent          # Single process
bun run start:all            # With web server
docker-compose up -d agent   # In container
```

## 🎮 Games Available

- **Crypto Legends** (MOBA) - 0.005 BTC
- **Neon Racing** (Racing) - 0.003 BTC
- **Phantom Protocol** (Action) - 0.008 BTC
- **Pixel Warriors** (RPG) - 0.002 BTC
- **Target Strike** (FPS) - 0.004 BTC
- **Shield Defense** (Strategy) - 0.001 BTC

## 💰 Commission System

```
Example: Crypto Legends costs 0.005 BTC

Buyer pays:        0.005 BTC
Commission (5%):   0.00025 BTC → You get this
Seller gets:       0.00475 BTC
```

Adjust commission rate in `.env`:
```env
COMMISSION_RATE=0.05  # 5% (default)
```

## 🔗 API Endpoints

```bash
# Get all games
GET /games

# Create payment invoice
POST /payments/create-invoice
Body: { "gameId": "...", "buyerAddress": "..." }

# Check payment status
GET /payments/invoice/:id

# Verify blockchain transaction
POST /payments/verify
Body: { "txHash": "..." }

# View earnings dashboard
GET /earnings/dashboard

# Simulate sales (testing)
POST /payments/simulate
```

## 🌍 Deploy for FREE

### Option 1: Oracle Cloud (RECOMMENDED)
- Sign up: https://cloud.oracle.com/free
- Always-free: 4 cores, 24GB RAM
- Run `docker-compose up -d`

### Option 2: Google Cloud
- Sign up: https://cloud.google.com/free
- Free tier: e2-micro instance

### Option 3: Railway.app
- Sign up: https://railway.app
- $5 free credit/month

## 🛠️ Tech Stack

- **Backend**: Hono (TypeScript)
- **Frontend**: React 19 + Vite
- **Database**: SQLite (Prisma)
- **Payments**: BTCPay Server integration
- **Blockchain**: Blockstream API (confirmations)
- **Runtime**: Bun (2x faster than Node.js)

## 📊 Environment Variables

```env
# Bitcoin wallet to receive commissions
SELLER_WALLET=1QLTRW2YLBcwWJbCb1imGgwp98cSrUhNGJ

# Commission percentage (0.05 = 5%)
COMMISSION_RATE=0.05

# BTCPay Server (optional but recommended)
BTCPAY_URL=https://your-btcpay.com
BTCPAY_API_KEY=your_api_key
BTCPAY_STORE_ID=your_store_id

# Web app URL for redirects
APP_URL=https://yourdomain.com
```

## 🔒 Security

- All transactions logged to database
- Commission settlements are DB-only (configure payout separately)
- Blockstream API for blockchain queries (no keys needed)
- Graceful shutdown with SIGTERM/SIGINT handling
- Environment variables for sensitive data

## 📈 Monitoring

View agent stats:
```bash
# Docker
docker-compose logs -f agent

# Systemd
journalctl -u bitgame-agent -f

# API
curl http://localhost:8080/earnings/dashboard
```

## 🧪 Testing

```bash
# Test agent functionality
bun run scripts/test-agent.ts

# Simulate sales
curl -X POST http://localhost:8080/payments/simulate
```

## 📝 License

Apache 2.0 - See LICENSE file

## 🤝 Support

- **Issues**: https://github.com/watchmovieswithme911-cyber/bitgame/issues
- **Docs**: See `/docs` folder
- **Deployment**: Check [AGENT_SETUP.md](docs/AGENT_SETUP.md)

---

**Ready to earn Bitcoin 24/7?** Start the agent now:

```bash
bun run start:all
# or
docker-compose up -d
```

🚀 Your autonomous earnings are now live!
