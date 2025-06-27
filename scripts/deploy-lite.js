const hre = require("hardhat");

async function main() {
  console.log("Starting deployment of ArcaneETH Lite to Base...");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  const balance = await deployer.getBalance();
  console.log("Account balance:", hre.ethers.utils.formatEther(balance), "ETH");
  
  // Get current gas price
  const gasPrice = await deployer.getGasPrice();
  console.log("Current gas price:", hre.ethers.utils.formatUnits(gasPrice, "gwei"), "gwei");
  
  // Deploy the lighter contract
  console.log("\nDeploying ArcaneETH_Lite...");
  const ArcaneETH = await hre.ethers.getContractFactory("ArcaneETH_Lite");
  
  // Estimate deployment cost
  const deployTransaction = ArcaneETH.getDeployTransaction();
  const estimatedGas = await deployer.estimateGas(deployTransaction);
  const estimatedCost = gasPrice.mul(estimatedGas);
  
  console.log("Estimated gas:", estimatedGas.toString());
  console.log("Estimated deployment cost:", hre.ethers.utils.formatEther(estimatedCost), "ETH");
  
  if (balance.lt(estimatedCost)) {
    console.error("\n❌ Insufficient funds!");
    console.error("Need:", hre.ethers.utils.formatEther(estimatedCost), "ETH");
    console.error("Have:", hre.ethers.utils.formatEther(balance), "ETH");
    return;
  }
  
  // Deploy with specific gas settings
  const arcaneETH = await ArcaneETH.deploy({
    gasLimit: estimatedGas.mul(110).div(100), // 10% buffer
    gasPrice: gasPrice
  });
  
  console.log("Transaction hash:", arcaneETH.deployTransaction.hash);
  console.log("Waiting for deployment...");
  
  await arcaneETH.deployed();
  
  console.log("\n✅ ArcaneETH_Lite deployed to:", arcaneETH.address);
  
  // Set base URI
  console.log("\nSetting base URI...");
  const tx = await arcaneETH.setBaseURI("https://api.arcaneeth.com/metadata/");
  await tx.wait();
  
  console.log("\n🎉 Deployment complete!");
  console.log("Contract address:", arcaneETH.address);
  console.log("View on Basescan: https://basescan.org/address/" + arcaneETH.address);
  
  // Calculate actual deployment cost
  const deployReceipt = await arcaneETH.deployTransaction.wait();
  const actualCost = deployReceipt.gasUsed.mul(deployReceipt.effectiveGasPrice);
  console.log("\nActual deployment cost:", hre.ethers.utils.formatEther(actualCost), "ETH");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });