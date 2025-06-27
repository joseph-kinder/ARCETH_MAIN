import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { Sparkles, Loader2, Info, Package, Coins } from 'lucide-react';
import toast from 'react-hot-toast';
import CardPreview from '../components/CardPreview';
import { useArcaneETHV3 } from '../hooks/useArcaneETHV3';

const CreatePage = () => {
  const { address, isConnected } = useAccount();
  const [prompt, setPrompt] = useState('');
  const [selectedRarity, setSelectedRarity] = useState(null);
  const [generatedCard, setGeneratedCard] = useState(null);
  
  const {
    packPrice,
    rarityTokens,
    purchasePack,
    mintCard,
    isBuyingPack,
    isMintingCard,
    isGenerating,
  } = useArcaneETHV3();

  const rarities = [
    { 
      name: 'Common', 
      value: 0,
      color: 'from-gray-400 to-gray-500', 
      description: 'Basic cards with standard abilities',
      tokens: rarityTokens.common 
    },
    { 
      name: 'Rare', 
      value: 1,
      color: 'from-blue-400 to-blue-500', 
      description: 'Enhanced cards with special powers',
      tokens: rarityTokens.rare 
    },
    { 
      name: 'Epic', 
      value: 2,
      color: 'from-purple-400 to-purple-500', 
      description: 'Powerful cards with unique abilities',
      tokens: rarityTokens.epic 
    },
    { 
      name: 'Legendary', 
      value: 3,
      color: 'from-yellow-400 to-yellow-500', 
      description: 'The rarest and most powerful cards',
      tokens: rarityTokens.legendary 
    },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a description for your card');
      return;
    }

    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (selectedRarity === null) {
      toast.error('Please select a rarity level');
      return;
    }

    const rarity = rarities[selectedRarity];
    if (rarity.tokens === 0) {
      toast.error(`You don't have any ${rarity.name} tokens`);
      return;
    }

    try {
      const card = await mintCard(selectedRarity, prompt);
      setGeneratedCard(card);
      toast.success('Card minted successfully!');
    } catch (error) {
      // Error already handled in hook
    }
  };
  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Create Your Card
          </span>
        </h1>
        <p className="text-xl text-gray-300">
          Use rarity tokens to mint unique AI-generated cards
        </p>
      </motion.div>

      {/* Pack Purchase Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-8 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-6 border border-purple-500/30"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Package className="w-6 h-6" />
              Buy Card Packs
            </h2>
            <p className="text-gray-300">
              Each pack contains 5 rarity tokens • {packPrice ? `${(Number(packPrice) / 1e18).toFixed(5)} ETH` : 'Loading...'}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              65% Common • 25% Rare • 8% Epic • 2% Legendary
            </p>
          </div>
          <button
            onClick={purchasePack}
            disabled={isBuyingPack || !isConnected}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] transition-all flex items-center gap-2"
          >
            {isBuyingPack ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Purchasing...
              </>
            ) : (
              <>
                <Package className="w-5 h-5" />
                Buy Pack
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Rarity Tokens Display */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Coins className="w-5 h-5" />
          Your Rarity Tokens
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {rarities.map((rarity) => (
            <div
              key={rarity.name}
              className="bg-gray-900/50 border border-white/10 rounded-xl p-4 text-center"
            >
              <div className={`text-3xl font-bold bg-gradient-to-r ${rarity.color} bg-clip-text text-transparent`}>
                {rarity.tokens}
              </div>
              <div className="text-sm text-gray-400 mt-1">{rarity.name}</div>
            </div>
          ))}
        </div>
      </motion.div>
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Creation Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Prompt Input */}
          <div className="space-y-2">
            <label className="text-lg font-semibold">Card Description</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A mighty fire dragon with glowing eyes and ancient armor..."
              className="w-full h-32 px-4 py-3 bg-gray-900/50 border border-white/10 rounded-xl focus:border-purple-500 focus:outline-none transition-all resize-none"
              disabled={isGenerating || isMintingCard}
            />
          </div>

          {/* Rarity Selection */}
          <div className="space-y-2">
            <label className="text-lg font-semibold">Select Rarity</label>
            <div className="grid grid-cols-2 gap-3">
              {rarities.map((rarity) => (
                <button
                  key={rarity.name}
                  onClick={() => setSelectedRarity(rarity.value)}
                  disabled={rarity.tokens === 0}
                  className={`relative p-4 rounded-xl border transition-all ${
                    selectedRarity === rarity.value
                      ? 'border-purple-500 bg-purple-500/10'
                      : rarity.tokens === 0
                      ? 'border-white/5 bg-gray-900/30 opacity-50 cursor-not-allowed'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${rarity.color} opacity-10 rounded-xl`} />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`font-semibold bg-gradient-to-r ${rarity.color} bg-clip-text text-transparent`}>
                        {rarity.name}
                      </h3>
                      <span className="text-sm text-gray-400">{rarity.tokens} tokens</span>
                    </div>
                    <p className="text-xs text-gray-400">{rarity.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3">
            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-300">
              <p>The AI will generate a card that matches both your prompt AND the selected rarity level. A "God of all things" as a Common card will be less impressive than as a Legendary.</p>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || isMintingCard || !isConnected || selectedRarity === null}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            {isGenerating || isMintingCard ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isGenerating ? 'Generating...' : 'Minting...'}
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Mint Card (1 {selectedRarity !== null ? rarities[selectedRarity].name : ''} Token)
              </>
            )}
          </button>
        </motion.div>

        {/* Preview Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center"
        >
          {generatedCard ? (
            <div className="space-y-6">
              <CardPreview card={generatedCard} />
              <button
                onClick={() => {
                  setGeneratedCard(null);
                  setPrompt('');
                  setSelectedRarity(null);
                }}
                className="w-full py-3 bg-gray-800 border border-gray-700 rounded-xl font-semibold hover:bg-gray-700 transition-all"
              >
                Create Another Card
              </button>
            </div>
          ) : (
            <div className="w-full max-w-sm h-[500px] bg-gray-900/50 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center">
              <div className="text-center space-y-4">
                <Sparkles className="w-16 h-16 mx-auto text-purple-400/50" />
                <p className="text-gray-400">Your generated card will appear here</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CreatePage;