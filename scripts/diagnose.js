const hre = require("hardhat");
const { ethers } = require("ethers");

async function main() {
  console.log("🔍 Diagnosing Base connection...\n");
  
  // Check environment
  console.log("Network:", hre.network.name);
  console.log("RPC URL:", hre.network.config.url);
  
  // Check if private key is loaded
  const privateKey = process.env.REACT_APP_PRIVATE_KEY;
  if (!privateKey) {
    console.error("❌ REACT_APP_PRIVATE_KEY not found in environment");
    return;
  }
  
  console.log("Private key loaded:", privateKey.substring(0, 10) + "...");
  
  // Create wallet directly
  try {
    const wallet = new ethers.Wallet(privateKey);
    console.log("Wallet address from key:", wallet.address);
  } catch (error) {
    console.error("❌ Invalid private key format:", error.message);
    return;
  }
  
  // Test provider connection
  console.log("\nTesting provider connection...");
  const provider = hre.ethers.provider;
  
  try {
    const blockNumber = await provider.getBlockNumber();
    console.log("✅ Connected! Current block:", blockNumber);
    
    const network = await provider.getNetwork();
    console.log("Network:", network.name, "Chain ID:", network.chainId);
    
    // Get signer
    const [signer] = await hre.ethers.getSigners();
    console.log("Signer address:", signer.address);
    
    // Check if addresses match
    const wallet = new ethers.Wallet(privateKey);
    if (signer.address.toLowerCase() !== wallet.address.toLowerCase()) {
      console.error("❌ Signer address doesn't match private key!");
      console.error("Expected:", wallet.address);
      console.error("Got:", signer.address);
    }
    
    // Try a simple transaction
    console.log("\nTesting transaction capability...");
    const tx = {
      to: signer.address, // Send to self
      value: ethers.utils.parseEther("0.000001"),
      gasLimit: 21000,
    };
    
    const estimatedGas = await signer.estimateGas(tx);
    console.log("✅ Can estimate gas:", estimatedGas.toString());
    
    // Don't actually send, just show we can
    console.log("✅ Ready to deploy!");
    
  } catch (error) {
    console.error("❌ Provider error:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });