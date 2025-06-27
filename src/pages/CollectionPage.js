import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { Package, Filter, Grid3x3 } from 'lucide-react';
import CardPreview from '../components/CardPreview';
import { useUserCards } from '../hooks/useUserCards';

const CollectionPage = () => {
  const { address, isConnected } = useAccount();
  const [filterRarity, setFilterRarity] = useState('all');
  const { cards, isLoading } = useUserCards(address);

  if (!isConnected) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Package className="w-16 h-16 mx-auto text-gray-600" />
          <h2 className="text-2xl font-semibold">Connect Your Wallet</h2>
          <p className="text-gray-400">Please connect your wallet to view your collection</p>
        </div>
      </div>
    );
  }

  const stats = {
    total: cards?.length || 0,
    common: cards?.filter(c => c.rarity === 'Common').length || 0,
    rare: cards?.filter(c => c.rarity === 'Rare').length || 0,
    epic: cards?.filter(c => c.rarity === 'Epic').length || 0,
    legendary: cards?.filter(c => c.rarity === 'Legendary').length || 0,
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            My Collection
          </span>
        </h1>
        <p className="text-xl text-gray-300">
          Manage and showcase your trading card collection
        </p>
      </motion.div>
      {/* Collection Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
      >
        {[
          { label: 'Total Cards', value: stats.total, color: 'from-purple-400 to-pink-400' },
          { label: 'Common', value: stats.common, color: 'from-gray-400 to-gray-500' },
          { label: 'Rare', value: stats.rare, color: 'from-blue-400 to-blue-500' },
          { label: 'Epic', value: stats.epic, color: 'from-purple-400 to-purple-500' },
          { label: 'Legendary', value: stats.legendary, color: 'from-yellow-400 to-yellow-500' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center"
          >
            <h3 className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
              {stat.value}
            </h3>
            <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Filter Bar */}
      <div className="flex items-center gap-4 mb-8">
        <Filter className="w-5 h-5 text-gray-400" />
        <div className="flex gap-2">
          {['all', 'common', 'rare', 'epic', 'legendary'].map((rarity) => (
            <button
              key={rarity}
              onClick={() => setFilterRarity(rarity)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterRarity === rarity
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-900/50 border border-white/10 hover:border-purple-500/50'
              }`}
            >
              {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
            </button>
          ))}
        </div>
      </div>
      {/* Cards Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-400">Loading your collection...</p>
          </div>
        </div>
      ) : cards && cards.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cards
            .filter(card => filterRarity === 'all' || card.rarity.toLowerCase() === filterRarity)
            .map((card, index) => (
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
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Grid3x3 className="w-16 h-16 mx-auto text-gray-600" />
            <h2 className="text-2xl font-semibold">No Cards Yet</h2>
            <p className="text-gray-400">Start creating or collecting cards to build your collection</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionPage;