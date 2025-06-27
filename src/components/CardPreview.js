import React from 'react';
import { motion } from 'framer-motion';
import { Sword, Shield, Zap } from 'lucide-react';

const CardPreview = ({ card }) => {
  const rarityColors = {
    Common: 'from-gray-400 to-gray-600',
    Rare: 'from-blue-400 to-blue-600',
    Epic: 'from-purple-400 to-purple-600',
    Legendary: 'from-yellow-400 to-yellow-600'
  };

  const rarityGlow = {
    Common: 'shadow-gray-500/50',
    Rare: 'shadow-blue-500/50',
    Epic: 'shadow-purple-500/50',
    Legendary: 'shadow-yellow-500/50'
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`relative w-80 h-[480px] rounded-2xl overflow-hidden shadow-2xl ${rarityGlow[card.rarity]}`}
    >
      {/* Card Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${rarityColors[card.rarity]}`} />
      
      {/* Card Image */}
      {card.image_url ? (
        <img 
          src={card.image_url} 
          alt={card.name}
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white/20">
            <Zap className="w-32 h-32" />
          </div>
        </div>
      )}      
      {/* Card Content */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      
      <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
        {/* Card Name */}
        <h3 className="text-2xl font-bold text-white drop-shadow-lg">
          {card.name}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-white/90 line-clamp-2">
          {card.short_description}
        </p>
        
        {/* Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Sword className="w-5 h-5 text-red-400" />
              <span className="text-lg font-bold text-white">{card.attack}</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="w-5 h-5 text-blue-400" />
              <span className="text-lg font-bold text-white">{card.defense}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-white/60">Element</div>
            <div className="text-sm font-semibold text-white">{card.element}</div>
          </div>
        </div>
        
        {/* Rarity Badge */}
        <div className="absolute top-4 right-4">
          <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${rarityColors[card.rarity]} text-white text-xs font-bold uppercase tracking-wider`}>
            {card.rarity}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CardPreview;