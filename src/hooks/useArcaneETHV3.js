import { useState, useEffect } from 'react';
import { useContractRead, useContractWrite, useWaitForTransaction, useAccount } from 'wagmi';
import { parseEther } from 'viem';
import toast from 'react-hot-toast';

// Updated ABI for V3 contract
const CONTRACT_ABI = [
  {
    "name": "buyPack",
    "type": "function",
    "stateMutability": "payable",
    "inputs": [],
    "outputs": []
  },
  {
    "name": "mintCard",
    "type": "function",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "rarity", "type": "uint8" },
      { "name": "prompt", "type": "string" }
    ],
    "outputs": []
  },
  {
    "name": "getAllRarityTokenBalances",
    "type": "function",
    "stateMutability": "view",
    "inputs": [{ "name": "owner", "type": "address" }],
    "outputs": [{ "name": "", "type": "uint256[4]" }]
  },
  {
    "name": "PACK_PRICE",
    "type": "function",
    "stateMutability": "view",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256" }]
  }
];

export const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS || '0x7b2262D0d1c5D65AbfF89CEFFB4860f2FD5f9142';

export const useArcaneETHV3 = () => {
  const { address } = useAccount();
  const [isGenerating, setIsGenerating] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('Contract Address:', CONTRACT_ADDRESS);
    console.log('User Address:', address);
  }, [address]);

  // Read pack price
  const { data: packPrice } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'PACK_PRICE',
    onError: (error) => {
      console.error('Error reading pack price:', error);
    }
  });

  // Read rarity token balances
  const { data: rarityBalances, refetch: refetchBalances } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getAllRarityTokenBalances',
    args: [address],
    enabled: !!address,
    onError: (error) => {
      console.error('Error reading balances:', error);
    }
  });

  // Buy pack function
  const { data: buyPackData, write: buyPack, error: buyPackError } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'buyPack',
    onError: (error) => {
      console.error('Buy pack error:', error);
      toast.error(`Failed to buy pack: ${error.message}`);
    }
  });

  const { isLoading: isBuyingPack } = useWaitForTransaction({
    hash: buyPackData?.hash,
    onSuccess: (data) => {
      console.log('Pack purchase successful:', data);
      toast.success('Pack purchased! Check your rarity tokens.');
      refetchBalances();
    },
    onError: (error) => {
      console.error('Transaction error:', error);
      toast.error('Failed to purchase pack');
    },
  });

  // Mint card function
  const { data: mintCardData, write: mintCardWrite } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'mintCard',
    onError: (error) => {
      console.error('Mint card error:', error);
      toast.error(`Failed to mint: ${error.message}`);
    }
  });

  const { isLoading: isMintingCard } = useWaitForTransaction({
    hash: mintCardData?.hash,
    onSuccess: () => {
      toast.success('Card minted successfully!');
      refetchBalances();
    },
    onError: (error) => {
      toast.error('Failed to mint card');
    },
  });

  const purchasePack = () => {
    console.log('Attempting to purchase pack...');
    console.log('Pack price:', packPrice);
    
    if (!packPrice) {
      toast.error('Pack price not loaded');
      return;
    }
    
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      buyPack({
        value: packPrice,
      });
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Failed to initiate purchase');
    }
  };

  const mintCard = async (rarity, prompt) => {
    if (!prompt.trim()) {
      toast.error('Please enter a description for your card');
      return;
    }

    setIsGenerating(true);
    try {
      // First, generate the card metadata with AI
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          rarity: ['Common', 'Rare', 'Epic', 'Legendary'][rarity],
          user_address: address,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate card');
      }

      const cardData = await response.json();
      
      // Then mint on-chain
      mintCardWrite({
        args: [rarity, prompt],
      });

      return cardData;
    } catch (error) {
      console.error('Error generating card:', error);
      toast.error('Failed to generate card - is the backend running?');
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const getRarityTokens = () => {
    if (!rarityBalances) return { common: 0, rare: 0, epic: 0, legendary: 0 };
    return {
      common: Number(rarityBalances[0] || 0),
      rare: Number(rarityBalances[1] || 0),
      epic: Number(rarityBalances[2] || 0),
      legendary: Number(rarityBalances[3] || 0),
    };
  };

  return {
    packPrice,
    rarityTokens: getRarityTokens(),
    purchasePack,
    mintCard,
    isBuyingPack,
    isMintingCard,
    isGenerating,
    refetchBalances,
  };
};