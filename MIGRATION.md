# Migration Guide: ArcaneETH V1 to V2

This guide will help you migrate from the original ArcaneETH to the new V2 version with Base L2 support and Google AI integration.

## 🔄 Major Changes

### 1. **Blockchain Migration**
- **From**: Ethereum Goerli testnet
- **To**: Base L2 (mainnet/Sepolia testnet)
- **Benefits**: 10-100x lower gas fees, faster transactions

### 2. **AI Generation**
- **From**: OpenAI GPT-3.5 + Stable Diffusion
- **To**: Google Gemini AI
- **Benefits**: Better integration, more consistent results, unified API

### 3. **Smart Contract Updates**
- New pack-based minting system
- Enhanced rarity mechanics
- Generation tracking
- Optimized for L2 gas costs

### 4. **Frontend Overhaul**
- Modern UI with animations
- RainbowKit wallet connection
- Improved state management
- Better mobile responsiveness

## 📝 Migration Steps

### Step 1: Backup Current Data

```bash
# Backup your current contract addresses and keys
cp .env .env.backup

# Export any important data from the old contract
```

### Step 2: Update Dependencies

```bash
# Remove old dependencies
npm uninstall @chakra-ui/react @emotion/react @emotion/styled

# Install new dependencies
npm install @rainbow-me/rainbowkit wagmi viem @tanstack/react-query

# Update backend dependencies
cd backend
pip install -r requirements.txt
```

### Step 3: Deploy New Contracts

1. Update your `.env` with Base RPC URLs
2. Get Base Sepolia test ETH from [Base Faucet](https://base.org/faucet)
3. Deploy the new contract:

```bash
npx hardhat run scripts/deploy-base.js --network baseSepolia
```

### Step 4: Update Frontend Configuration

1. Replace Chakra UI components with new Tailwind components
2. Update Web3 connection to use RainbowKit
3. Update contract addresses and ABIs

### Step 5: Migrate Backend

1. Replace OpenAI calls with Google Gemini AI
2. Update image generation logic
3. Configure Redis for caching

### Step 6: Data Migration (Optional)

If you want to preserve existing NFTs:
1. Deploy a migration contract
2. Allow users to claim their V1 NFTs on V2
3. Provide incentives for early migration

## 🔍 Key Differences

### Contract Functions

**V1:**
```solidity
function mintPack() external payable
function _mintNew(address wallet, CardType _type, string memory _tokenURI)
```

**V2:**
```solidity
function purchasePack(PackType _packType) external payable
function getCard(uint256 tokenId) public view returns (Card memory)
```

### API Endpoints

**V1:**
```python
@app.post("/generate_card")
def generate_card(prompt: str)
```

**V2:**
```python
@app.post("/generate")
async def generate_card(request: GenerateCardRequest)
```

## ⚠️ Breaking Changes

1. **Wallet Connection**: ChakraUI wallet modal replaced with RainbowKit
2. **State Management**: Local state replaced with Zustand stores
3. **Contract Interface**: Different function signatures and events
4. **API Response Format**: New metadata structure

## 🆘 Troubleshooting

### Common Issues

1. **"Contract not deployed"**
   - Ensure you've deployed to the correct network
   - Update `REACT_APP_CONTRACT_ADDRESS` in `.env`

2. **"Google AI API error"**
   - Verify your `GOOGLE_API_KEY` is valid
   - Check API quotas and limits

3. **"Transaction failed"**
   - Ensure you have enough Base ETH for gas
   - Check contract addresses match your network

### Getting Help

- Check the [Issues](https://github.com/yourusername/arcaneeth/issues) page
- Join our [Discord](https://discord.gg/arcaneeth) for support
- Review the updated documentation

## 🎉 Migration Complete!

Once migrated, you'll enjoy:
- Faster, cheaper transactions on Base L2
- Better AI-generated content with Google Gemini
- Modern, responsive UI with smooth animations
- Improved developer experience

Welcome to ArcaneETH V2! 🚀