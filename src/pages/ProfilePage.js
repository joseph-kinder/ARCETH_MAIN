import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Copy, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import CardPreview from '../components/CardPreview';
import { useUserCards } from '../hooks/useUserCards';

const ProfilePage = () => {
  const { address } = useParams();
  const { cards, isLoading } = useUserCards(address);

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    toast.success('Address copied to clipboard!');
  };

  const truncateAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            
            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">Collector Profile</h1>
              <div className="flex items-center gap-4">
                <code className="text-lg text-gray-300">{truncateAddress(address)}</code>
                <button
                  onClick={copyAddress}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <a
                  href={`https://basescan.org/address/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{cards?.length || 0}</div>
                <div className="text-sm text-gray-400">Total Cards</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {cards?.filter(c => c.rarity === 'Legendary').length || 0}
                </div>
                <div className="text-sm text-gray-400">Legendary</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {cards?.filter(c => c.rarity === 'Epic').length || 0}
                </div>
                <div className="text-sm text-gray-400">Epic</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {cards?.filter(c => c.rarity === 'Rare').length || 0}
                </div>
                <div className="text-sm text-gray-400">Rare</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Collection */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold mb-6">Collection</h2>
        
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-gray-400">Loading collection...</p>
            </div>
          </div>
        ) : cards && cards.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cards.map((card, index) => (
              <motion.div
                key={card.tokenId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <CardPreview card={card} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">No cards in this collection yet</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProfilePage;