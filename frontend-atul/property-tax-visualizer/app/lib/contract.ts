// app/lib/contract.ts

// TODO: Step 1 - Replace with the address of your deployed contract
// You get this address after running the `forge create` command.
export const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // This is a default Anvil address, change it!

// TODO: Step 2 - Replace with your contract's actual ABI
// You can find this in your Foundry project's `out` directory.
// Look for a file like: `out/YourContractName.sol/YourContractName.json`
// Copy the entire "abi" array from that JSON file and paste it here.
export const contractAbi = [
  {
    "inputs": [
      { "internalType": "string", "name": "_propertyId", "type": "string" },
      { "internalType": "address", "name": "_owner", "type": "address" }
    ],
    "name": "addProperty",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_propertyId", "type": "string" }
    ],
    "name": "payTax",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "string", "name": "propertyId", "type": "string" },
      { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }
    ],
    "name": "PropertyAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "string", "name": "propertyId", "type": "string" },
      { "indexed": true, "internalType": "address", "name": "payer", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "TaxPaid",
    "type": "event"
  }
] as const; // Using "as const" gives you better type-safety with wagmi