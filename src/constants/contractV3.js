// Contract address - V3 with token system
export const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS || '0xB65b79134fc123EfBfC17555919bdCE354505641';

// Contract ABI for V3
export const CONTRACT_ABI = [
  // Buy pack function
  {
    "inputs": [],
    "name": "buyPack",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  // Mint card function
  {
    "inputs": [
      {
        "internalType": "enum ArcaneETH_V3.Rarity",
        "name": "rarity",
        "type": "uint8"
      },
      {
        "internalType": "string",
        "name": "prompt",
        "type": "string"
      }
    ],
    "name": "mintCard",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Get user tokens
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUserTokens",
    "outputs": [
      {
        "internalType": "uint256[4]",
        "name": "",
        "type": "uint256[4]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  // Get pack price
  {
    "inputs": [],
    "name": "packPrice",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  // Total supply
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  // Events
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "buyer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256[4]",
        "name": "tokenCounts",
        "type": "uint256[4]"
      }
    ],
    "name": "PackPurchased",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "minter",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "enum ArcaneETH_V3.Rarity",
        "name": "rarity",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "prompt",
        "type": "string"
      }
    ],
    "name": "CardMinted",
    "type": "event"
  }
];

// Rarity enum mapping
export const RARITY = {
  Common: 0,
  Rare: 1,
  Epic: 2,
  Legendary: 3
};

export const RARITY_NAMES = ['Common', 'Rare', 'Epic', 'Legendary'];