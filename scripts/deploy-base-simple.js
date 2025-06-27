const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying ArcaneETH to Base Mainnet\n");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer:", deployer.address);
  
  const balance = await deployer.getBalance();
  console.log("Balance:", hre.ethers.utils.formatEther(balance), "ETH\n");
  
  try {
    // Deploy Config first (smallest contract)
    console.log("1️⃣ Deploying Config Contract...");
    const Config = await hre.ethers.getContractFactory("ArcaneETHConfig");
    
    // Deploy with explicit gas limit
    const config = await Config.deploy(deployer.address, {
      gasLimit: 1000000, // 1M gas units should be plenty
    });
    
    console.log("   Tx hash:", config.deployTransaction.hash);
    console.log("   Waiting for confirmation...");
    
    await config.deployed();
    console.log("✅ Config deployed to:", config.address);
    
    const configReceipt = await config.deployTransaction.wait();
    console.log("   Gas used:", configReceipt.gasUsed.toString());
    console.log("   Cost:", hre.ethers.utils.formatEther(configReceipt.gasUsed.mul(configReceipt.effectiveGasPrice)), "ETH\n");
    
    // Deploy Core
    console.log("2️⃣ Deploying Core Contract...");
    const Core = await hre.ethers.getContractFactory("ArcaneETHCore");
    
    const core = await Core.deploy(config.address, {
      gasLimit: 3000000, // 3M gas for the larger contract
    });
    
    console.log("   Tx hash:", core.deployTransaction.hash);
    console.log("   Waiting for confirmation...");
    
    await core.deployed();
    console.log("✅ Core deployed to:", core.address);
    
    const coreReceipt = await core.deployTransaction.wait();
    console.log("   Gas used:", coreReceipt.gasUsed.toString());
    console.log("   Cost:", hre.ethers.utils.formatEther(coreReceipt.gasUsed.mul(coreReceipt.effectiveGasPrice)), "ETH\n");
    
    // Get storage address
    const storageAddress = await core.dataStorage();
    console.log("✅ Storage deployed to:", storageAddress);
    
    // Configure
    console.log("\n3️⃣ Configuring contracts...");
    
    const tx1 = await config.setNFTContract(core.address, { gasLimit: 100000 });
    await tx1.wait();
    console.log("✅ NFT contract set");
    
    const tx2 = await core.setBaseURI("https://api.arcaneeth.com/metadata/", { gasLimit: 100000 });
    await tx2.wait();
    console.log("✅ Base URI set");
    
    // Summary
    console.log("\n🎉 DEPLOYMENT SUCCESSFUL!");
    console.log("=======================");
    console.log("Core Contract:", core.address);
    console.log("Config Contract:", config.address);
    console.log("Storage Contract:", storageAddress);
    console.log("\nView on Basescan:");
    console.log("https://basescan.org/address/" + core.address);
    
    console.log("\n📝 Update your .env:");
    console.log(`REACT_APP_CONTRACT_ADDRESS=${core.address}`);
    
  } catch (error) {
    console.error("\n❌ Deployment failed!");
    console.error("Error:", error.message);
    if (error.error) {
      console.error("Details:", error.error.message);
    }
    if (error.transaction) {
      console.error("Failed tx:", error.transaction);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });