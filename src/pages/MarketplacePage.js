import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, TrendingUp } from 'lucide-react';
import CardPreview from '../components/CardPreview';

const MarketplacePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // Sample marketplace cards - in production, fetch from blockchain/API
  const marketplaceCards = [
    {
      name: "Shadow Assassin",
      short_description: "Silent striker from the void realms",
      element: "Dark",
      attack: 92,
      defense: 45,
      rarity: "Epic",
      price: "0.05",
      owner: "0x1234...5678"
    },
    {
      name: "Phoenix Empress",
      short_description: "Reborn from the ashes of eternity",
      element: "Fire",
      attack: 88,
      defense: 76,
      rarity: "Legendary",
      price: "0.15",
      owner: "0xabcd...efgh"
    },
    {
      name: "Frost Sentinel",
      short_description: "Guardian of the frozen wastes",
      element: "Water",
      attack: 55,
      defense: 85,
      rarity: "Rare",
      price: "0.02",
      owner: "0x9876...5432"
    },
    // Add more cards...
  ];
  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Marketplace
          </span>
        </h1>
        <p className="text-xl text-gray-300">
          Discover and collect unique trading cards from creators worldwide
        </p>
      </motion.div>

      {/* Filters and Search */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search cards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-white/10 rounded-xl focus:border-purple-500 focus:outline-none transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <select
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value)}
              className="px-4 py-3 bg-gray-900/50 border border-white/10 rounded-xl focus:border-purple-500 focus:outline-none transition-all"
            >
              <option value="all">All Rarities</option>
              <option value="common">Common</option>
              <option value="rare">Rare</option>
              <option value="epic">Epic</option>
              <option value="legendary">Legendary</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-gray-900/50 border border-white/10 rounded-xl focus:border-purple-500 focus:outline-none transition-all"
            >
              <option value="recent">Recently Listed</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rarity">Rarity</option>
            </select>
          </div>
        </div>

        {/* Active Filters */}
        <div className="flex items-center gap-2 text-sm">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-gray-400">Active filters:</span>
          {selectedRarity !== 'all' && (
            <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded-full text-purple-400">
              {selectedRarity}
            </span>
          )}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {marketplaceCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group"
          >
            <div className="space-y-4">
              <CardPreview card={card} />
              
              {/* Card Info */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Current Price</span>
                  <span className="text-lg font-bold text-purple-400">{card.price} ETH</span>
                </div>
                <div className="text-sm text-gray-400 mb-3">
                  Owner: {card.owner}
                </div>
                <button className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold hover:scale-[1.02] transition-all">
                  Buy Now
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MarketplacePage;