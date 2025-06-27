const hre = require("hardhat");
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function main() {
  console.log("🚀 Base Mainnet Deployment Configuration");
  console.log("=====================================\n");
  
  // Check if we're on the right network
  const network = hre.network.name;
  console.log(`Current network: ${network}`);
  
  if (network !== 'base') {
    console.log("⚠️  Warning: Not on Base mainnet. Use: npx hardhat run scripts/deploy-mainnet.js --network base");
    process.exit(1);
  }
  
  // Get deployment parameters
  const name = "ArcaneETH";
  const symbol = "ARCETH";
  
  // Ask for treasury address
  console.log("\n📝 Please provide deployment details:\n");
  const treasuryAddress = await question('Treasury address (or press Enter to use deployer address): ');
  
  const [deployer] = await hre.ethers.getSigners();
  const finalTreasury = treasuryAddress || deployer.address;
  
  // Show deployment preview
  console.log("\n📋 Deployment Preview:");
  console.log("===================");
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Network: Base Mainnet`);
  console.log(`Contract Name: ${name}`);
  console.log(`Symbol: ${symbol}`);
  console.log(`Treasury: ${finalTreasury}`);
  
  // Get deployer balance
  const balance = await deployer.getBalance();
  const balanceInEth = hre.ethers.utils.formatEther(balance);
  console.log(`Deployer Balance: ${balanceInEth} ETH`);
  
  if (balance.lt(hre.ethers.utils.parseEther("0.0005"))) {
    console.log("\n❌ Insufficient balance. You need at least 0.0005 ETH for deployment.");
    process.exit(1);
  }
  
  // Confirm deployment
  const confirm = await question('\n🤔 Do you want to proceed with deployment? (yes/no): ');
  
  if (confirm.toLowerCase() !== 'yes') {
    console.log("❌ Deployment cancelled.");
    process.exit(0);
  }
  
  rl.close();
  
  console.log("\n🚀 Starting deployment...\n");
  
  // Deploy the contract
  const ArcaneETH_V2 = await hre.ethers.getContractFactory("ArcaneETH_V2");
  const arcaneETH = await ArcaneETH_V2.deploy(name, symbol, finalTreasury);
  
  console.log("⏳ Waiting for deployment...");
  await arcaneETH.deployed();
  
  console.log("\n✅ ArcaneETH_V2 deployed to:", arcaneETH.address);
  console.log("📝 Transaction hash:", arcaneETH.deployTransaction.hash);
  
  // Wait for confirmations
  console.log("\n⏳ Waiting for block confirmations...");
  await arcaneETH.deployTransaction.wait(5);
  
  // Set base URI
  const baseURI = "https://api.arcaneeth.com/metadata/";
  console.log("\n🔧 Setting base URI to:", baseURI);
  const tx = await arcaneETH.setBaseURI(baseURI);
  await tx.wait();
  
  // Verify on Basescan
  console.log("\n🔍 Verifying contract on Basescan...");
  try {
    await hre.run("verify:verify", {
      address: arcaneETH.address,
      constructorArguments: [name, symbol, finalTreasury],
    });
    console.log("✅ Contract verified successfully!");
  } catch (error) {
    console.log("⚠️  Verification failed:", error.message);
    console.log("You can verify manually later with:");
    console.log(`npx hardhat verify --network base ${arcaneETH.address} "${name}" "${symbol}" "${finalTreasury}"`);
  }
  
  // Final summary
  console.log("\n🎉 Deployment Complete!");
  console.log("====================");
  console.log(`Contract Address: ${arcaneETH.address}`);
  console.log(`Treasury Address: ${finalTreasury}`);
  console.log(`Network: Base Mainnet`);
  console.log(`Block Explorer: https://basescan.org/address/${arcaneETH.address}`);
  
  console.log("\n📝 Next Steps:");
  console.log("1. Update REACT_APP_CONTRACT_ADDRESS in your .env file to:", arcaneETH.address);
  console.log("2. Start your backend API server");
  console.log("3. Run 'npm start' to launch the frontend");
  console.log("4. Test purchasing a pack on the live site!");
  
  // Calculate deployment cost
  const deploymentCost = balance.sub(await deployer.getBalance());
  console.log(`\n💰 Deployment cost: ${hre.ethers.utils.formatEther(deploymentCost)} ETH`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });