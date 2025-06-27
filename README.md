# ArcaneETH V2 - AI-Powered NFT Trading Cards on Base L2

<div align="center">
  <img src="public/logo.png" alt="ArcaneETH Logo" width="200"/>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Built on Base](https://img.shields.io/badge/Built%20on-Base%20L2-0052FF)](https://base.org)
  [![Powered by Google AI](https://img.shields.io/badge/Powered%20by-Google%20AI-4285F4)](https://ai.google.dev/)
</div>

## 🎴 Overview

ArcaneETH is a cutting-edge platform that combines AI technology with blockchain to create unique NFT trading cards. Users can generate cards using natural language prompts, with Google's Gemini AI creating the metadata and artwork. All cards are minted as NFTs on Base L2 for fast, affordable transactions.

## ✨ Features

- **AI-Powered Generation**: Use Google's Gemini AI to create unique card designs from text prompts
- **Base L2 Integration**: Lightning-fast transactions with minimal gas fees
- **Dynamic Rarity System**: Cards are automatically assigned rarity based on their attributes
- **Modern UI/UX**: Sleek, animated interface built with React and Framer Motion
- **Pack System**: Purchase card packs with different rarities and probabilities
- **Marketplace**: Trade cards with other collectors
- **Collection Management**: View and manage your card collection

## 🚀 Tech Stack

### Frontend
- React 18 with TypeScript
- Wagmi v2 + RainbowKit for Web3 integration
- Framer Motion for animations
- Tailwind CSS for styling
- Zustand for state management

### Smart Contracts
- Solidity 0.8.19
- OpenZeppelin contracts
- Hardhat development environment
- Base L2 deployment

### Backend
- FastAPI (Python)
- Google Generative AI SDK
- Redis for caching
- Pillow for image processing
## 📋 Prerequisites

- Node.js v16+
- Python 3.9+
- Redis server
- Base Sepolia testnet ETH (for testing)
- Google AI API key

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/arcaneeth-v2.git
cd arcaneeth-v2
```

### 2. Install dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

Key configurations:
- `GOOGLE_API_KEY`: Your Google AI API key
- `REACT_APP_PRIVATE_KEY`: Deployment wallet private key
- `REACT_APP_WALLET_CONNECT_PROJECT_ID`: WalletConnect project ID
- `BASESCAN_API_KEY`: For contract verification

### 4. Deploy smart contracts

**Deploy to Base Sepolia (testnet):**
```bash
npx hardhat run scripts/deploy-base.js --network baseSepolia
```

**Deploy to Base mainnet:**
```bash
npx hardhat run scripts/deploy-base.js --network base
```

Update `REACT_APP_CONTRACT_ADDRESS` in your `.env` with the deployed address.
### 5. Start the services

**Start Redis:**
```bash
redis-server
```

**Start the backend API:**
```bash
cd backend
uvicorn app.main_v2:app --reload --port 8000
```

**Start the frontend:**
```bash
npm start
```

The application will be available at `http://localhost:3000`

## 🎮 Usage

### Creating Cards

1. Connect your wallet using the Connect button
2. Navigate to the "Create" page
3. Enter a description for your card (e.g., "A mighty fire dragon with golden scales")
4. Optionally select a rarity tier
5. Click "Generate Card" to create your card with AI
6. Review the generated card and click "Mint as NFT" to mint it on-chain

### Purchasing Packs

1. Go to the marketplace
2. Choose from Basic, Premium, or Ultimate packs
3. Each pack contains a different number of cards with varying rarity probabilities
4. Confirm the transaction in your wallet

### Trading Cards

Cards can be traded on secondary marketplaces that support Base L2 NFTs.

## 🏗️ Project Structure

```
arcaneeth-v2/
├── contracts/           # Smart contracts
│   ├── ArcaneETH_V2.sol   # Main contract
│   └── ARCETH_contract.sol # Legacy contract
├── scripts/            # Deployment scripts
├── backend/            # Python backend
│   └── app/
│       ├── main_v2.py    # FastAPI application
│       └── assets/       # Card templates
├── src/               # React frontend
│   ├── components/     # Reusable components
│   ├── pages/         # Page components
│   ├── hooks/         # Custom React hooks
│   └── constants/     # Contract ABIs and addresses
└── public/            # Static assets
```
## 🔧 Configuration

### Smart Contract Parameters

The contract supports configurable pack types:
- **Basic Pack**: 0.001 ETH, 3 cards, higher common probability
- **Premium Pack**: 0.003 ETH, 5 cards, balanced probabilities  
- **Ultimate Pack**: 0.01 ETH, 10 cards, higher rare+ probability

### AI Generation

The Google Gemini AI model generates:
- Card name
- Description and lore
- Attack/Defense stats (scaled by rarity)
- Element type
- Visual description for artwork

## 🚢 Deployment

### Frontend Deployment (Vercel)

```bash
npm run build
vercel --prod
```

### Backend Deployment (Google Cloud Run)

```bash
cd backend
gcloud run deploy arcaneeth-api \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

## 📈 Future Improvements

- [ ] Implement Imagen API for AI-generated artwork
- [ ] Add card fusion/evolution mechanics
- [ ] Create tournaments and leaderboards
- [ ] Implement card lending/rental system
- [ ] Add mobile app support
- [ ] Integrate with other Base L2 protocols

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built on [Base L2](https://base.org) for scalable blockchain infrastructure
- Powered by [Google AI](https://ai.google.dev/) for intelligent card generation
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Web3 integration with [RainbowKit](https://www.rainbowkit.com/)

## 📞 Contact

- Discord: [Join our community](https://discord.gg/arcaneeth)
- Twitter: [@ArcaneETH](https://twitter.com/arcaneeth)
- Email: support@arcaneeth.com

---

<div align="center">
  Made with ❤️ by the ArcaneETH team
</div>