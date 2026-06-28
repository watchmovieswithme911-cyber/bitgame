# 🚀 START HERE - BitGame Launch Guide

## ⚡ QUICKSTART (3 Steps - 2 Minutes)

### Step 1: Clone & Setup
```bash
git clone https://github.com/watchmovieswithme911-cyber/bitgame
cd bitgame
cp .env.example .env
```

### Step 2: Configure (IMPORTANT)
Edit `.env` file:
```env
SELLER_WALLET=your_bitcoin_wallet_address
COMMISSION_RATE=0.05  # 5% earnings
BTCPAY_API_KEY=your_key_here (optional)
```

### Step 3: Launch
```bash
docker-compose up -d
```

## ✅ VERIFY IT'S WORKING

```bash
# Check services
docker-compose ps

# View agent logs (should show ✅ confirmations)
docker-compose logs -f agent

# Test in browser
http://localhost:8080
http://localhost:8080/earnings/dashboard
```

## 🎮 WHAT YOU'LL SEE

1. **Games Page** - 6 available games with Bitcoin prices
2. **Earnings Dashboard** - Real-time commission tracking
3. **Transactions Tab** - All payments and confirmations
4. **AI Agent (Background)** - Monitoring 24/7

## 💰 HOW YOU EARN

```
Player buys game (0.005 BTC)
         ↓
You earn 5% commission (0.00025 BTC)
         ↓
AI Agent confirms transaction (60 seconds)
         ↓
✅ Commission settled automatically
```

## 🤖 AI AGENT EXPLAINED

Runs automatically in background:
- Every 60 seconds: Checks for new payments
- Verifies with blockchain
- Updates commissions
- Generates reports
- Never stops (24/7)

## 📊 MONITOR YOUR EARNINGS

**Real-time Dashboard:**
```
http://localhost:8080/earnings/dashboard

Shows:
✅ Total revenue earned
✅ Commission balance
✅ Number of sales
✅ Transaction history
✅ Hourly/daily reports
```

## 🛑 STOP THE PLATFORM

```bash
docker-compose down
```

## 🚀 DEPLOY TO CLOUD (FREE)

**Oracle Cloud (RECOMMENDED - Forever Free)**
1. Sign up: https://cloud.oracle.com/free
2. SSH into instance
3. Install Docker: `curl -fsSL https://get.docker.com | sh`
4. Run: `docker-compose up -d`
5. Done! 🎉

## ❓ COMMON QUESTIONS

**Q: Is the agent really running 24/7?**
A: Yes! Check: `docker-compose logs -f agent`

**Q: How are commissions calculated?**
A: Automatically = Game Price × Commission Rate (5%)

**Q: Do I need BTCPay?**
A: Optional. Works without it but recommended for production.

**Q: Can I change commission rate?**
A: Yes! Edit .env: `COMMISSION_RATE=0.10` (for 10%)

**Q: Is my Bitcoin safe?**
A: Commissions go to your wallet after blockchain confirmation.

## 📞 NEED HELP?

**Read:**
- Full docs: `/README.md`
- Agent setup: `/docs/AGENT_SETUP.md`
- Deployment: `/DEPLOYMENT_STATUS.md`

**Test:**
```bash
bun run scripts/test-agent.ts
```

**Debug:**
```bash
# View all logs
docker-compose logs

# View agent specifically
docker-compose logs -f agent
```

## 🎉 YOU'RE READY!

```bash
docker-compose up -d
```

**Open:** http://localhost:8080

**Your platform is LIVE! 🚀**
