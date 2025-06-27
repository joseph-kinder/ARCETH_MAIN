const hre = require("hardhat");

async function main() {
  console.log("🚀 Clean deployment to Base Mainnet\n");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer:", deployer.address);
  
  const balance = await deployer.getBalance();
  console.log("Balance:", hre.ethers.utils.formatEther(balance), "ETH");
  
  // Get current nonce
  const nonce = await deployer.getTransactionCount();
  console.log("Current nonce:", nonce);
  
  // Get current gas price
  const gasPrice = await deployer.getGasPrice();
  console.log("Gas price:", hre.ethers.utils.formatUnits(gasPrice, "gwei"), "gwei\n");
  
  try {
    console.log("Deploying Config contract...");
    const Config = await hre.ethers.getContractFactory("ArcaneETHConfig");
    
    // Deploy with explicit settings
    const config = await Config.deploy(deployer.address, {
      nonce: nonce,
      gasPrice: gasPrice,
      gasLimit: 1000000
    });
    
    console.log("✅ Transaction sent!");
    console.log("Tx hash:", config.deployTransaction.hash);
    console.log("View on Basescan: https://basescan.org/tx/" + config.deployTransaction.hash);
    
    console.log("\nWaiting for confirmation...");
    const receipt = await config.deployed();
    
    console.log("\n🎉 Config deployed to:", config.address);
    
    // Now deploy Core with next nonce
    console.log("\nDeploying Core contract...");
    const Core = await hre.ethers.getContractFactory("ArcaneETHCore");
    
    const core = await Core.deploy(config.address, {
      nonce: nonce + 1,
      gasPrice: gasPrice,
      gasLimit: 3000000
    });
    
    console.log("✅ Transaction sent!");
    console.log("Tx hash:", core.deployTransaction.hash);
    
    await core.deployed();
    console.log("\n🎉 Core deployed to:", core.address);
    
    // Get storage
    const storageAddress = await core.dataStorage();
    console.log("Storage deployed to:", storageAddress);
    
    // Configure
    console.log("\nConfiguring contracts...");
    await config.setNFTContract(core.address, { nonce: nonce + 2 });
    await core.setBaseURI("https://api.arcaneeth.com/metadata/", { nonce: nonce + 3 });
    
    console.log("\n✅ DEPLOYMENT COMPLETE!");
    console.log("======================");
    console.log("Core Contract:", core.address);
    console.log("Config Contract:", config.address);
    console.log("Storage Contract:", storageAddress);
    console.log("\n📝 Update .env:");
    console.log(`REACT_APP_CONTRACT_ADDRESS=${core.address}`);
    
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    if (error.reason) console.error("Reason:", error.reason);
    if (error.error) console.error("Details:", error.error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });