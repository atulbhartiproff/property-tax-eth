# Property Tax Management on Ethereum

## Project Description

This project is a decentralized application (dApp) backend for managing property tax records on the Ethereum blockchain. It uses a Solidity smart contract to automate property tax collection while ensuring all records and payments are transparent, immutable, and secure.

This repository contains the smart contract and development environment managed with Foundry.

## Features

* **Admin-Controlled:** A designated admin address is responsible for managing the system.
* **Add Properties:** The admin can add new properties with details like owner name, location, area, and tax amount.
* **Pay Tax:** Any user can pay the property tax for a property by sending the exact amount of ETH to the contract.
* **Track Payments:** The contract keeps a record of which properties have been paid for.
* **Secure Fund Withdrawal:** The admin can securely withdraw all collected funds from the contract.
* **Custom Errors:** Uses custom errors for clear and gas-efficient reverts.

## Tech Stack

* **Blockchain:** Ethereum
* **Smart Contract Language:** Solidity (0.8.20)
* **Development Framework:** Foundry (forge, anvil, cast)

## Getting Started: Local Setup

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need the following software installed on your machine:

* **Foundry:** The core development toolkit. Install it by running:

  ```bash
  curl -L https://foundry.paradigm.xyz | bash && foundryup
  ```
* **Git:** To clone the repository.

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/atulbhartiproff/property-tax-eth
   cd property-tax-eth/backend
   ```
2. **Install Foundry Dependencies**

   ```bash
   forge install
   ```
3. **Compile the Smart Contract**

   ```bash
   forge build
   ```
4. **Run the Tests**

   ```bash
   forge test -vvv
   ```

   Ensure all tests pass.

## Usage: Local Interaction Guide

You will need three terminal windows to interact with the smart contract.

### Step 1: Start the Local Blockchain (Terminal 1)

```bash
anvil
```

Keep this terminal running. It provides funded test accounts.

### Step 2: Deploy the Smart Contract (Terminal 2)

```bash
forge create --rpc-url http://127.0.0.1:8545 \
--private-key YOUR_ADMIN_PRIVATE_KEY \
src/PropertyTax.sol:PropertyTax \
--broadcast
```

Copy the `Deployed to:` address from the output.

### Step 3: Interact with the Contract (Terminal 2 or 3)

* **Check the Admin Address**

```bash
cast call YOUR_CONTRACT_ADDRESS "I_ADMIN()" --rpc-url http://127.0.0.1:8545
```

* **Add a Property (Admin)**

```bash
cast send YOUR_CONTRACT_ADDRESS "addProperty(string,string,uint256,uint256)" \
"Alice" "123 Main St" 1500 1000000000000000000 \
--private-key YOUR_ADMIN_PRIVATE_KEY \
--rpc-url http://127.0.0.1:8545
```

* **Pay Property Tax (User)**

```bash
cast send YOUR_CONTRACT_ADDRESS "payTax(uint256)" 1 \
--value 1ether \
--private-key YOUR_USER_PRIVATE_KEY \
--rpc-url http://127.0.0.1:8545
```

* **Verify the Payment**

```bash
cast call YOUR_CONTRACT_ADDRESS "getPropertyDetails(uint256)" 1 --rpc-url http://127.0.0.1:8545
```

## Next Steps

* Develop a frontend application (e.g., using React) for a user-friendly interface to interact with the smart contract.
