# Deployment Guide for ArcaneETH V2

## Prerequisites

Before deploying, you need:
1. ETH for gas fees
2. Your wallet private key
3. API keys for various services

## Getting Test ETH (Base Sepolia)

### Option 1: Base Faucet
1. Visit https://docs.base.org/docs/tools/network-faucets/
2. Connect your wallet
3. Request Base Sepolia ETH

### Option 2: Coinbase Wallet Faucet
1. Visit https://faucet.quicknode.com/base/sepolia
2. Enter your wallet address
3. Complete captcha and receive test ETH

### Option 3: Bridge from Sepolia
1. Get Sepolia ETH from https://sepoliafaucet.com/
2. Bridge to Base Sepolia using https://bridge.base.org/

## Setting Up Your Environment

1. **Create a new wallet for deployment** (recommended):
   ```bash
   # You can use any wallet, but here's how to create one with ethers
   node -e "console.log(require('ethers').Wallet.createRandom().privateKey)"
   ```

2. **Update your .env file**:
   ```env
   # Your deployment wallet private key (with 0x prefix)
   REACT_APP_PRIVATE_KEY=0x...your_private_key_here...
   
   # Treasury address for revenue (can be same as deployer)
   TREASURY_ADDRESS=0x...your_treasury_address...
   
   # Get from https://cloud.walletconnect.com/
   REACT_APP_WALLET_CONNECT_PROJECT_ID=your_project_id
   
   # Get from https://basescan.org/apis
   BASESCAN_API_KEY=your_basescan_api_key
   
   # Get from https://makersuite.google.com/app/apikey
   GOOGLE_API_KEY=your_google_ai_key
   ```

## Deployment Steps

### 1. Deploy to Base Sepolia (Testnet)

```bash
# Make sure you have test ETH first!
npx hardhat run scripts/deploy-base.js --network baseSepolia
```

Expected output:
```
Starting deployment to Base L2...
Deploying with parameters:
- Name: ArcaneETH
- Symbol: ARCETH
- Treasury: 0x...
ArcaneETH_V2 deployed to: 0x...
Transaction hash: 0x...
Contract verified successfully!
```

### 2. Update Frontend Configuration

After deployment, update your .env:
```env
REACT_APP_CONTRACT_ADDRESS=0x...deployed_contract_address...
```

### 3. Deploy to Base Mainnet (Production)

Once tested on Sepolia:

```bash
# Make sure you have at least 0.005 ETH on Base mainnet
npx hardhat run scripts/deploy-base.js --network base
```

## Verification

The deployment script automatically verifies the contract on Basescan. If it fails, you can manually verify:

```bash
npx hardhat verify --network baseSepolia YOUR_CONTRACT_ADDRESS "ArcaneETH" "ARCETH" "YOUR_TREASURY_ADDRESS"
```

## Post-Deployment

1. **Test the contract**:
   - Try purchasing a pack
   - Check card generation
   - Verify treasury receives fees

2. **Configure metadata API**:
   - Deploy your backend API
   - Update BASE_URI in the contract if needed

3. **Launch frontend**:
   ```bash
   npm start
   ```

## Estimated Costs

- **Base Sepolia**: Free (test network)
- **Base Mainnet**: ~0.004-0.005 ETH for deployment
- **Per Transaction**: ~$0.01-0.05 on Base mainnet

## Troubleshooting

### "Insufficient funds" error
- Check your wallet balance
- Ensure private key is correct in .env
- Try reducing gas price in hardhat.config.js

### "Nonce too high" error
- Reset your wallet nonce
- Or wait a few minutes and retry

### Contract not verified
- Check BASESCAN_API_KEY is correct
- Wait 30 seconds after deployment
- Try manual verification command

## Support

- Base Discord: https://discord.gg/buildonbase
- Base Docs: https://docs.base.org/
- Contract Issues: Check the GitHub issues

---

Remember to keep your private keys secure and never commit them to version control!