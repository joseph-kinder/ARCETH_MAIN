import { useEffect, useState } from 'react';
import { useContractRead, useAccount } from 'wagmi';
import { CONTRACT_ADDRESS } from './useArcaneETHV3';

// ABI for reading user's cards
const READ_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
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
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "tokenOfOwnerByIndex",
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
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getCardInfo",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "rarity",
        "type": "uint8"
      },
      {
        "internalType": "string",
        "name": "prompt",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "mintedAt",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export const useUserCardsV3 = () => {
  const { address } = useAccount();
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get user's balance
  const { data: balance } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: READ_ABI,
    functionName: 'balanceOf',
    args: [address],
    enabled: !!address,
  });

  // Get token IDs
  const { data: tokenIds } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: READ_ABI,
    functionName: 'tokenOfOwnerByIndex',
    args: [address, 0], // This only gets the first one, we need to loop
    enabled: !!address && balance > 0,
  });

  useEffect(() => {
    const fetchAllCards = async () => {
      if (!address || !balance || balance === 0) {
        setCards([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const fetchedCards = [];

      try {
        // For now, let's create mock data since we need to implement proper enumeration
        // In a real implementation, you'd loop through all tokenIds
        console.log(`User has ${balance} cards`);
        
        // Mock data for testing
        const rarityNames = ['Common', 'Rare', 'Epic', 'Legendary'];
        for (let i = 0; i < Math.min(balance, 10); i++) {
          fetchedCards.push({
            tokenId: i,
            name: `Card #${i}`,
            short_description: "An AI-generated trading card",
            element: ['Fire', 'Water', 'Earth', 'Air'][i % 4],
            attack: Math.floor(Math.random() * 100),
            defense: Math.floor(Math.random() * 100),
            rarity: rarityNames[Math.floor(Math.random() * 4)],
            mintedAt: Date.now()
          });
        }

        setCards(fetchedCards);
      } catch (error) {
        console.error('Error fetching cards:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllCards();
  }, [address, balance]);

  return { cards, isLoading, balance: balance || 0 };
};