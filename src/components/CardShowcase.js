import React from 'react';
import { motion } from 'framer-motion';
import CardPreview from './CardPreview';

const CardShowcase = () => {
  // Sample cards for showcase
  const sampleCards = [
    {
      name: "Inferno Dragon Lord",
      short_description: "Ancient dragon that commands the eternal flames",
      element: "Fire",
      attack: 95,
      defense: 78,
      rarity: "Legendary"
    },
    {
      name: "Crystal Guardian",
      short_description: "Protector of the sacred crystal caves",
      element: "Earth",
      attack: 65,
      defense: 92,
      rarity: "Epic"
    },
    {
      name: "Storm Weaver",
      short_description: "Master of lightning and thunder",
      element: "Air",
      attack: 82,
      defense: 68,
      rarity: "Epic"
    },
    {
      name: "Tidal Empress",
      short_description: "Ruler of the seven seas",
      element: "Water",
      attack: 88,
      defense: 85,
      rarity: "Legendary"
    }
  ];
  return (
    <section className="py-20">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Featured Cards
          </span>
        </h2>
        <p className="text-xl text-gray-300">Discover some of the most powerful cards in the collection</p>
      </motion.div>

      <div className="relative">
        {/* Carousel Container */}
        <div className="overflow-hidden">
          <motion.div 
            className="flex gap-8 px-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {/* Duplicate cards for infinite scroll effect */}
            {[...sampleCards, ...sampleCards].map((card, index) => (
              <div key={index} className="flex-shrink-0">
                <CardPreview card={card} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Gradient overlays for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-900 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-900 to-transparent pointer-events-none" />
      </div>
    </section>
  );
};

export default CardShowcase;