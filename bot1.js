import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

// ===== CONFIG =====
const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const CONTRACT = "0xFa6419a3d3503a016dF3A59F690734862CA2A78D";

const TOKEN_A = "0xF85938e2Bfc178026f60c5Ea50cC347D42C73b3D";
const TOKEN_B = "0x77ef087024F87976aAdA0Aa7F73BB8EAe6E9dda1";

// ===== SETUP =====
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const abi = [
  "function swap(address,address,uint256,uint256) external"
];

const erc20Abi = [
  "function approve(address spender,uint256 amount) external returns (bool)",
  "function allowance(address owner,address spender) view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)"
];

const contract = new ethers.Contract(CONTRACT, abi, wallet);

// ===== WAIT TX =====
async function waitTx(txHash) {
  for (let i = 0; i < 20; i++) {
    const r = await provider.getTransactionReceipt(txHash);
    if (r) return r.status === 1;
    await new Promise(r => setTimeout(r, 3000));
  }
  return false;
}

// ===== GET BALANCE =====
async function getBalance(token) {
  const t = new ethers.Contract(token, erc20Abi, wallet);
  return await t.balanceOf(wallet.address);
}

// ===== APPROVE =====
async function approveIfNeeded(token, amount) {
  const t = new ethers.Contract(token, erc20Abi, wallet);

  const allowance = await t.allowance(wallet.address, CONTRACT);
  if (allowance >= amount) return true;

  console.log("🔓 Approving:", token);

  const tx = await t.approve(CONTRACT, ethers.MaxUint256);
  return await waitTx(tx.hash);
}

// ===== MAX SAFE =====
function getMaxAmount(balance) {
  return (balance * 100n) / 100n;
}

// ===== SWAP =====
async function swap(tokenIn, tokenOut, amount) {
  try {
    const tx = await contract.swap(tokenIn, tokenOut, amount, 0n);

    console.log("📤 TX:", tx.hash);

    const ok = await waitTx(tx.hash);

    if (!ok) {
      console.log("❌ REVERT\n");
      return;
    }

    console.log("✅ SUCCESS\n");

  } catch (err) {
    console.log("❌ ERROR:", err.message);
  }
}

// ===== MAIN =====
async function main() {
  console.log("🚀 Bot:", wallet.address);

  let i = 0;

  while (true) {
    i++;
    console.log(`\n🔄 Cycle ${i}`);

    try {
      const balanceA = await getBalance(TOKEN_A);
      const balanceB = await getBalance(TOKEN_B);

      console.log("💰 A:", balanceA.toString());
      console.log("💰 B:", balanceB.toString());

      const amountA = getMaxAmount(balanceA);
      const amountB = getMaxAmount(balanceB);

      // 🔥 LOGIC BARU (BOLAK-BALIK)
      if (balanceA > balanceB && amountA > 0n) {
        console.log("🔥 A -> B");
        await approveIfNeeded(TOKEN_A, amountA);
        await swap(TOKEN_A, TOKEN_B, amountA);

      } else if (amountB > 0n) {
        console.log("🔥 B -> A");
        await approveIfNeeded(TOKEN_B, amountB);
        await swap(TOKEN_B, TOKEN_A, amountB);

      } else {
        console.log("⛔ No balance");
      }

    } catch (err) {
      console.log("⚠️ Error:", err.message);
    }

    await new Promise(r => setTimeout(r, 8000));
  }
}

main();
