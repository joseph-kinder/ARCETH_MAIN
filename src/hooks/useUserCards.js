import { useEffect, useState } from 'react';
import { useContractRead } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../constants/contract';

export const useUserCards = (address) => {
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get user's token IDs
  const { data: tokenIds } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getUserCards',
    args: [address],
    enabled: !!address,
  });

  useEffect(() => {
    const fetchCardDetails = async () => {
      if (!tokenIds || tokenIds.length === 0) {
        setCards([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // In a real implementation, you would fetch card details for each tokenId
        // For now, we'll create sample data
        const cardDetails = tokenIds.map((tokenId, index) => ({
          tokenId: tokenId.toString(),
          name: `Card #${tokenId}`,
          short_description: "A unique trading card",
          element: ["Fire", "Water", "Earth", "Air"][index % 4],
          attack: Math.floor(Math.random() * 100),
          defense: Math.floor(Math.random() * 100),
          rarity: ["Common", "Rare", "Epic", "Legendary"][Math.floor(Math.random() * 4)],
        }));

        setCards(cardDetails);
      } catch (error) {
        console.error('Error fetching card details:', error);
        setCards([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCardDetails();
  }, [tokenIds]);

  return { cards, isLoading };
};