const hre = require("hardhat");

async function main() {
  console.log("Checking Base network gas prices...");
  
  const [deployer] = await hre.ethers.getSigners();
  const provider = deployer.provider;
  
  // Get current balance
  const balance = await deployer.getBalance();
  console.log("Your balance:", hre.ethers.utils.formatEther(balance), "ETH");
  
  // Get current gas price
  const gasPrice = await provider.getGasPrice();
  console.log("Current gas price:", hre.ethers.utils.formatUnits(gasPrice, "gwei"), "gwei");
  
  // Get latest block to check base fee
  const block = await provider.getBlock("latest");
  if (block.baseFeePerGas) {
    console.log("Base fee:", hre.ethers.utils.formatUnits(block.baseFeePerGas, "gwei"), "gwei");
  }
  
  // Try to estimate with very low gas
  const minGasPrice = hre.ethers.utils.parseUnits("0.001", "gwei"); // 0.001 gwei
  console.log("\nTrying with minimum gas price:", hre.ethers.utils.formatUnits(minGasPrice, "gwei"), "gwei");
  
  // Deploy the contract with minimal gas
  const ArcaneETH = await hre.ethers.getContractFactory("ArcaneETH_V2");
  
  try {
    console.log("\nDeploying with minimal gas settings...");
    const arcaneETH = await ArcaneETH.deploy(
      "ArcaneETH",
      "ARCETH", 
      deployer.address,
      {
        gasPrice: minGasPrice,
        gasLimit: 5000000 // Set a high limit to avoid out of gas
      }
    );
    
    console.log("Transaction sent! Hash:", arcaneETH.deployTransaction.hash);
    console.log("Waiting for confirmation...");
    
    await arcaneETH.deployed();
    console.log("\n✅ Deployed to:", arcaneETH.address);
    
  } catch (error) {
    console.error("\n❌ Deployment failed:", error.message);
    
    // If it fails, show what we'd need
    const deployTx = ArcaneETH.getDeployTransaction("ArcaneETH", "ARCETH", deployer.address);
    const estimatedGas = await provider.estimateGas({
      ...deployTx,
      from: deployer.address
    });
    
    const costWithCurrentGas = estimatedGas.mul(gasPrice);
    const costWithMinGas = estimatedGas.mul(minGasPrice);
    
    console.log("\n📊 Cost Analysis:");
    console.log("Estimated gas units:", estimatedGas.toString());
    console.log("Cost with current gas:", hre.ethers.utils.formatEther(costWithCurrentGas), "ETH");
    console.log("Cost with 0.001 gwei:", hre.ethers.utils.formatEther(costWithMinGas), "ETH");
    console.log("Your balance:", hre.ethers.utils.formatEther(balance), "ETH");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });