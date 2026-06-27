# 🎮 BitGame — Free Bitcoin Gaming Platform with Commission

## Live Site
**https://watchmovieswithme911-cyber.github.io/bitgame/**

## 💰 How You Earn
Every time a player buys a game on your site, **5% commission** goes straight to YOUR Bitcoin wallet:

```
Your Wallet: 1QLTRW2YLBcwWJbCb1imGgwp98cSrUhNGJ
```

Example: Player buys "Crypto Legends" for 0.005 BTC → You earn 0.00025 BTC commission.

---

## 🚀 Deploy for FREE (Step-by-Step)

### OPTION 1: Oracle Cloud Free Tier (BEST — $0 forever)

Oracle gives you a **free ARM server** (4 cores, 24GB RAM) that runs forever at no cost.

**Step 1: Create Oracle Cloud Account**
1. Go to https://cloud.oracle.com/free
2. Sign up for a free account (needs credit card for verification, but you won't be charged)
3. Choose **"Always Free"** ARM instance

**Step 2: Create VM Instance**
1. After login, go to **Compute → Instances → Create Instance**
2. Choose **VM.Standard.A1.Flex** (Always Free eligible)
3. Select **4 OCPUs, 24 GB RAM**
4. Choose **Ubuntu 22.04** as the image
5. Download the SSH key
6. Click **Create**

**Step 3: Connect to your server**
```bash
ssh -i your-key.pem ubuntu@YOUR_SERVER_IP
```

**Step 4: Install Docker**
```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
sudo reboot
```

**Step 5: Clone and deploy BitGame**
```bash
# Reconnect after reboot
ssh -i your-key.pem ubuntu@YOUR_SERVER_IP

git clone https://github.com/watchmovieswithme911-cyber/bitgame.git
cd bitgame

# Copy and edit configuration
cp .env.example .env
nano .env  # Edit with your wallet and settings

# Start everything
docker-compose up -d
```

**Step 6: Point your domain**
1. Buy a domain (e.g., from Namecheap or Cloudflare — ~$10/year)
2. Point the DNS to your Oracle server IP:
   - A Record: `@` → `YOUR_SERVER_IP`
   - A Record: `www` → `YOUR_SERVER_IP`
3. Wait 5-10 minutes for DNS propagation

**Step 7: Access your sites**
- 🎮 **Gaming Site:** `http://YOUR_SERVER_IP:8080`
- ₿ **BTCPay Admin:** `http://YOUR_SERVER_IP` (set up on first visit)

---

### OPTION 2: Google Cloud Free Tier

**Step 1:** Sign up at https://cloud.google.com/free
**Step 2:** Create an e2-micro VM (always free)
**Step 3:** SSH in and follow the same Docker install steps above

---

### OPTION 3: Railway.app (Easiest, $5/month free credit)

1. Sign up at https://railway.app
2. Click **"New Project" → "Deploy from GitHub Repo"**
3. Select `watchmovieswithme911-cyber/bitgame`
4. Railway auto-deploys!
5. You get a public URL like `bitgame-production.up.railway.app`

---

## ₿ BTCPay Server Setup (Your Payment Processor)

BTCPay Server is **100% free, open source, and self-hosted**. It handles all Bitcoin payments.

1. Once Docker is running, visit `http://YOUR_SERVER_IP`
2. Create your admin account
3. Go to **Stores → Create Store** → Name it "BitGame"
4. Go to **Stores → Store Settings → Payment Methods → Add**
5. Select **Bitcoin (On-chain)**
6. Go to **Account → API Keys → Create New Key**
   - Check: **Store** permissions
7. Copy your **API Key** and **Store ID**
8. Edit `.env` on your server:
```bash
BTCPAY_API_KEY=your-api-key-here
BTCPAY_STORE_ID=your-store-id-here
BTCPAY_HOST=btcpay.yourdomain.com
```
9. Restart: `docker-compose restart bitgame`

---

## 🎮 Games Included

| Game | Genre | Price (BTC) | Your Commission (5%) |
|------|-------|-------------|---------------------|
| Crypto Legends | MOBA | 0.005 | 0.00025 |
| Neon Racing | Racing | 0.003 | 0.00015 |
| Phantom Protocol | Action | 0.008 | 0.0004 |
| Pixel Warriors | RPG | 0.002 | 0.0001 |
| Target Strike | FPS | 0.004 | 0.0002 |
| Shield Defense | Strategy | 0.001 | 0.00005 |

---

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/games` | GET | List all games |
| `/api/payments/create-invoice` | POST | Create payment invoice |
| `/api/payments/invoice/:id` | GET | Check invoice status |
| `/api/payments/verify` | POST | Verify BTC transaction |
| `/api/earnings/dashboard` | GET | Your commission overview |
| `/api/payments/simulate` | POST | Test with demo sales |

---

## 🛡️ Security Notes

- Your **private keys** stay on your server — BTCPay never shares them
- All payments go through **Bitcoin blockchain** — no middleman
- Commission is calculated **automatically** on every sale
- Your wallet address is stored in `.env` — never in code

---

## 📊 Earnings Calculator

| Monthly Sales | Revenue (BTC) | Your Commission (5%) |
|--------------|---------------|---------------------|
| 10 sales | ~0.04 BTC | ~0.002 BTC |
| 50 sales | ~0.2 BTC | ~0.01 BTC |
| 100 sales | ~0.4 BTC | ~0.02 BTC |
| 500 sales | ~2.0 BTC | ~0.1 BTC |

*Based on average game price of 0.004 BTC*

---

## ❓ FAQ

**Q: Is this really free?**
A: The software is 100% free (BTCPay Server + BitGame). You only need a server — and Oracle Cloud gives you one free forever.

**Q: What about Bitcoin transaction fees?**
A: The buyer pays the Bitcoin network fee when they send BTC. You receive the full game price minus your 5% commission.

**Q: Can I change the commission rate?**
A: Yes! Edit `COMMISSION_RATE` in `.env`. `0.05` = 5%, `0.10` = 10%, etc.

**Q: How do I withdraw my BTC earnings?**
A: Your BTC accumulates in your wallet. You can transfer it to any exchange or wallet anytime.

---

Built with ⚡ by Shogo
