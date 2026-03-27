# 🚀 Stabilizer AutoSwap Bot

Automated token swap bot using **ethers.js**.
Designed to stabilize balance between two tokens by continuously swapping in both directions.

---

## ✨ Features

* 🔁 Continuous auto swap loop
* 🔄 Bidirectional swap (Token A ↔ Token B)
* 💰 Uses **99% of balance** (safe max strategy)
* 🔓 Auto approval (MaxUint256)
* ⚡ Works on EVM chains (Sepolia, Mainnet, etc)
* 🧠 Smart balancing logic

---

## 📦 Installation

```bash
git clone https://github.com/yourusername/stabilizer_autoswap.git
cd stabilizer_autoswap
npm install
```

---

## ⚙️ Setup

Create `.env` file:

```env
RPC_URL=your_rpc_url
PRIVATE_KEY=your_private_key
```

---

## ▶️ Run

```bash
node bot.js
```

---

## 🧠 Logic

1. Fetch Token A & Token B balances
2. Calculate 99% usable balance
3. If Token A > Token B → swap A → B
4. Else → swap B → A
5. Repeat every 8 seconds

---

## ⚠️ Important

* ❌ No slippage protection
* 🔐 Never share your private key
* 🧪 Use testnet / burner wallet first
* ⚠️ Use at your own risk

---

## 📄 License

MIT

