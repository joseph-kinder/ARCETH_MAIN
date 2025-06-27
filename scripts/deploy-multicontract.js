const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting multi-contract deployment to Base...\n");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer:", deployer.address);
  
  // Check balance
  const balance = await deployer.getBalance();
  console.log("Balance:", hre.ethers.utils.formatEther(balance), "ETH\n");
  
  // Get current gas price on Base
  const provider = deployer.provider;
  const block = await provider.getBlock("latest");
  const baseFee = block.baseFeePerGas;
  
  console.log("Current base fee:", hre.ethers.utils.formatUnits(baseFee, "gwei"), "gwei");
  
  // Use very low priority fee (Base is not congested)
  const priorityFee = hre.ethers.utils.parseUnits("0.0001", "gwei"); // 0.0001 gwei priority
  const maxFeePerGas = baseFee.add(priorityFee);
  
  console.log("Max fee per gas:", hre.ethers.utils.formatUnits(maxFeePerGas, "gwei"), "gwei");
  console.log("Priority fee:", hre.ethers.utils.formatUnits(priorityFee, "gwei"), "gwei\n");
  
  const deployOptions = {
    maxFeePerGas: maxFeePerGas,
    maxPriorityFeePerGas: priorityFee,
    type: 2 // EIP-1559 transaction
  };
  
  try {
    // 1. Deploy Config Contract
    console.log("1️⃣ Deploying ArcaneETHConfig...");
    const Config = await hre.ethers.getContractFactory("ArcaneETHConfig");
    const config = await Config.deploy(deployer.address, deployOptions);
    await config.deployed();
    console.log("✅ Config deployed to:", config.address);
    
    // Get deployment cost
    const configReceipt = await config.deployTransaction.wait();
    const configCost = configReceipt.gasUsed.mul(configReceipt.effectiveGasPrice);
    console.log("   Cost:", hre.ethers.utils.formatEther(configCost), "ETH\n");
    
    // 2. Deploy Core Contract
    console.log("2️⃣ Deploying ArcaneETHCore...");
    const Core = await hre.ethers.getContractFactory("ArcaneETHCore");
    const core = await Core.deploy(config.address, deployOptions);
    await core.deployed();
    console.log("✅ Core deployed to:", core.address);
    
    const coreReceipt = await core.deployTransaction.wait();
    const coreCost = coreReceipt.gasUsed.mul(coreReceipt.effectiveGasPrice);
    console.log("   Cost:", hre.ethers.utils.formatEther(coreCost), "ETH");
    
    // Storage contract is deployed by Core, get its address
    const storageAddress = await core.dataStorage();
    console.log("✅ Storage deployed to:", storageAddress, "\n");
    
    // 3. Configure contracts
    console.log("3️⃣ Configuring contracts...");
    
    // Set NFT contract in config
    const tx1 = await config.setNFTContract(core.address, deployOptions);
    await tx1.wait();
    console.log("✅ NFT contract set in config");
    
    // Set base URI
    const tx2 = await core.setBaseURI("https://api.arcaneeth.com/metadata/", deployOptions);
    await tx2.wait();
    console.log("✅ Base URI set\n");
    
    // Calculate total cost
    const totalCost = configCost.add(coreCost);
    console.log("💰 Total deployment cost:", hre.ethers.utils.formatEther(totalCost), "ETH");
    console.log("   In USD (~$3000/ETH): $", (parseFloat(hre.ethers.utils.formatEther(totalCost)) * 3000).toFixed(2));
    
    // Summary
    console.log("\n📋 Deployment Summary");
    console.log("===================");
    console.log("Config Contract:", config.address);
    console.log("Core Contract:", core.address);
    console.log("Storage Contract:", storageAddress);
    console.log("Network: Base Mainnet");
    console.log("\n🎉 Deployment complete!");
    
    console.log("\n📝 Next steps:");
    console.log("1. Update .env with REACT_APP_CONTRACT_ADDRESS=" + core.address);
    console.log("2. Verify contracts on Basescan:");
    console.log(`   npx hardhat verify --network base ${config.address} "${deployer.address}"`);
    console.log(`   npx hardhat verify --network base ${core.address} "${config.address}"`);
    
  } catch (error) {
    console.error("\n❌ Deployment failed:", error.message);
    if (error.error) {
      console.error("Error details:", error.error);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });