# Property Tax Blockchain Visualizer

This is a frontend application built with **Next.js** to visualize and interact with a Property Tax management smart contract running on a local **Anvil blockchain**. It provides a real-time feed of new blocks, detailed block inspection, and a user interface to call smart contract functions via **MetaMask**.

---

## ✨ Features

* **Real-time Block Feed**: Automatically displays new blocks as they are mined on the local Anvil node.
* **Detailed Block Inspection**: Click on any block to view its full details, including its hash, parent hash, miner, gas used, and timestamp.
* **Merkle Patricia Trie Verification**: For each block, the frontend calculates the Merkle Patricia Trie root from the transaction data and verifies it against the official `transactionsRoot` in the block header.
* **MetaMask Integration**: Securely connect your MetaMask wallet to interact with the blockchain.
* **Smart Contract Interaction**: User-friendly forms to call the `addProperty` and `payTax` functions on the deployed smart contract, including sending ETH for payable functions.
* **Modern UI**: A sleek, responsive interface built with Tailwind CSS, featuring a dark theme with purple accents.

---

## 📸 Screenshot

*Replace this with a screenshot of your running application.*

---

## 🛠️ Tech Stack

* **Framework**: Next.js (with App Router)
* **Language**: TypeScript
* **Styling**: Tailwind CSS
* **Blockchain Communication**:

  * `wagmi`: React Hooks for Ethereum.
  * `viem`: A lightweight and powerful TypeScript interface for Ethereum.
* **Local Blockchain**: Foundry (Anvil)

---

## 📋 Prerequisites

Ensure you have the following installed:

* Node.js (v18 or later)
* npm or yarn
* Foundry (for `anvil` and `forge`)
* MetaMask browser extension

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally. Assumes you already have a Foundry project for your smart contract.

### 1. Backend Setup (Smart Contract & Anvil)

**Start Anvil:**

```bash
anvil --block-time 3
```

Anvil will provide a list of accounts and private keys.

**Deploy Your Contract:**

```bash
forge create --rpc-url http://127.0.0.1:8545 --private-key <YOUR_ANVIL_PRIVATE_KEY> src/YourContract.sol:YourContract --constructor-args <ARGS>
```

Copy the `Deployed to:` address from the output.

### 2. Frontend Setup

**Clone the Repository:**

```bash
git clone <your-repo-url>
cd property-tax-visualizer
```

**Install Dependencies:**

```bash
npm install
```

**Configure Contract Details:**

* Open `app/lib/contract.ts`.
* Paste your contract address into the `contractAddress` variable.
* Copy the `abi` array from your Foundry project’s JSON file and paste it into `contractAbi`.

**Run the Development Server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 3. MetaMask Configuration

* Open MetaMask → Add Network:

  * **Network Name**: Anvil Local
  * **New RPC URL**: [http://127.0.0.1:8545](http://127.0.0.1:8545)
  * **Chain ID**: 31337
  * **Currency Symbol**: ETH
* Import an Anvil account private key into MetaMask.

---

## 📖 Usage

* **Connect Wallet**: Click the *Connect MetaMask* button.
* **Interact with the Contract**:

  * Use "Add New Property" or "Pay Property Tax" buttons.
  * Fill in details → Submit Transaction.
  * Approve transaction in MetaMask popup.
* **Observe the Blockchain**:

  * Pending → Success message with tx hash.
  * New block appears in feed.
  * Click block for details + Merkle Patricia Trie verification.

---

## 📂 Project Structure

```
property-tax-visualizer/
├── app/
│   ├── components/       # Reusable React components
│   │   ├── BlockDetails.tsx
│   │   ├── BlockFeed.tsx
│   │   ├── ConnectWallet.tsx
│   │   └── ContractInteractor.tsx
│   ├── lib/              # Configuration and providers
│   │   ├── contract.ts   # Smart contract ABI and address
│   │   └── providers.tsx # wagmi provider setup
│   ├── globals.css       # Global styles and Tailwind directives
│   └── page.tsx          # The main page component
├── public/               # Static assets
├── package.json
└── tailwind.config.ts    # Tailwind CSS configuration
```

---

## 📄 License

This project is licensed under the **MIT License**.
