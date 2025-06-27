const hre = require("hardhat");

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log("🚀 Starting Base Mainnet Deployment\n");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer:", deployer.address);
  
  const startBalance = await deployer.getBalance();
  console.log("Starting balance:", hre.ethers.utils.formatEther(startBalance), "ETH\n");
  
  // Just deploy the simplest contract first
  console.log("Deploying ArcaneETHConfig...");
  
  const Config = await hre.ethers.getContractFactory("ArcaneETHConfig");
  console.log("Factory created, sending transaction...");
  
  const config = await Config.deploy(deployer.address);
  console.log("Transaction sent!");
  console.log("Tx hash:", config.deployTransaction.hash);
  console.log("Waiting for confirmation...");
  
  // Wait with progress updates
  let confirmed = false;
  let attempts = 0;
  
  while (!confirmed && attempts < 60) { // 5 minutes max
    try {
      const receipt = await deployer.provider.getTransactionReceipt(config.deployTransaction.hash);
      if (receipt && receipt.confirmations > 0) {
        confirmed = true;
        console.log("\n✅ Contract deployed!");
        console.log("Address:", receipt.contractAddress);
        console.log("Gas used:", receipt.gasUsed.toString());
        console.log("Block:", receipt.blockNumber);
        
        const endBalance = await deployer.getBalance();
        const cost = startBalance.sub(endBalance);
        console.log("Deployment cost:", hre.ethers.utils.formatEther(cost), "ETH");
        console.log("Cost in USD (~$3000/ETH): $", (parseFloat(hre.ethers.utils.formatEther(cost)) * 3000).toFixed(4));
      } else {
        process.stdout.write(".");
        await sleep(5000); // Check every 5 seconds
        attempts++;
      }
    } catch (error) {
      process.stdout.write(".");
      await sleep(5000);
      attempts++;
    }
  }
  
  if (!confirmed) {
    console.log("\n⏱️ Transaction is taking longer than expected.");
    console.log("Check on Basescan: https://basescan.org/tx/" + config.deployTransaction.hash);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\nError:", error);
    process.exit(1);
  });