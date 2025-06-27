const hre = require("hardhat");

async function main() {
  console.log("Testing Base connection and gas estimation...\n");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer address:", deployer.address);
  
  const balance = await deployer.getBalance();
  console.log("Balance:", hre.ethers.utils.formatEther(balance), "ETH");
  
  // Check if this is the right address (should have ~0.00182 ETH)
  if (balance.eq(0)) {
    console.error("\n❌ This wallet has no balance. Check your private key in .env");
    return;
  }
  
  // Test gas estimation for a simple contract
  console.log("\nEstimating gas for deployment...");
  
  const Config = await hre.ethers.getContractFactory("ArcaneETHConfig");
  const deployTx = Config.getDeployTransaction(deployer.address);
  
  try {
    const estimatedGas = await deployer.estimateGas(deployTx);
    console.log("Estimated gas units:", estimatedGas.toString());
    
    const gasPrice = await deployer.getGasPrice();
    console.log("Current gas price:", hre.ethers.utils.formatUnits(gasPrice, "gwei"), "gwei");
    
    const estimatedCost = estimatedGas.mul(gasPrice);
    console.log("Estimated cost:", hre.ethers.utils.formatEther(estimatedCost), "ETH");
    
    console.log("\n✅ Everything looks good!");
    console.log("You have enough ETH for deployment.");
    
  } catch (error) {
    console.error("\n❌ Error estimating gas:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });