import { useState } from 'react';
import { useContractWrite, useWaitForTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../constants/contract';
import toast from 'react-hot-toast';

export const useCardGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMinting, setIsMinting] = useState(false);

  // Contract interaction for purchasing packs
  const { data: mintData, write: purchasePack } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'purchasePack',
    onError: (error) => {
      console.error('Write error:', error);
      toast.error('Failed to initiate transaction');
      setIsMinting(false);
    }
  });

  const { isLoading: isConfirming } = useWaitForTransaction({
    hash: mintData?.hash,
    onSuccess: () => {
      toast.success('Pack purchased successfully!');
      setIsMinting(false);
    },
    onError: (error) => {
      toast.error('Failed to purchase pack');
      setIsMinting(false);
    },
  });

  const generateCard = async (prompt, rarity = null) => {
    setIsGenerating(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          rarity,
          user_address: window.ethereum?.selectedAddress,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate card');
      }

      const cardData = await response.json();
      return cardData;
    } catch (error) {
      console.error('Error generating card:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };
  const mintCard = async (cardData) => {
    setIsMinting(true);
    try {
      // For now, we're purchasing a pack - in a real implementation,
      // you would have specific minting logic based on the generated card
      const packType = cardData.rarity === 'Legendary' ? 2 : 
                      cardData.rarity === 'Epic' ? 1 : 0;
      
      const price = packType === 2 ? parseEther('0.01') :
                   packType === 1 ? parseEther('0.003') :
                   parseEther('0.001');

      purchasePack({
        args: [packType],
        value: price,
      });

      // Store metadata on backend
      await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/mint-callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metadata_uri: cardData.metadata_uri,
        }),
      });

    } catch (error) {
      console.error('Error minting card:', error);
      toast.error('Failed to mint card');
      setIsMinting(false);
      throw error;
    }
  };

  return {
    generateCard,
    mintCard,
    isGenerating,
    isMinting: isMinting || isConfirming,
  };
};