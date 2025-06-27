// Contract address - update this after deployment
export const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';

// Contract ABI - minimal version for frontend use
export const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "uint8",
        "name": "_packType",
        "type": "uint8"
      }
    ],
    "name": "purchasePack",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUserCards",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getCard",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          },
          {
            "internalType": "uint8",
            "name": "rarity",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "attack",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "defense",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "element",
            "type": "string"
          }
        ],
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];