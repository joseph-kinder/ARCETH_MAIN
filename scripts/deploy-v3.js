const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying ArcaneETH V3 to Base Mainnet\n");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer:", deployer.address);
  
  const balance = await deployer.getBalance();
  console.log("Balance:", hre.ethers.utils.formatEther(balance), "ETH\n");
  
  // Deploy the new contract
  console.log("Deploying ArcaneETHV3...");
  const ArcaneETHV3 = await hre.ethers.getContractFactory("ArcaneETHV3");
  
  const arcane = await ArcaneETHV3.deploy({
    gasLimit: 3000000 // 3M gas
  });
  
  console.log("Tx hash:", arcane.deployTransaction.hash);
  console.log("Waiting for confirmation...");
  
  await arcane.deployed();
  
  console.log("\n✅ ArcaneETHV3 deployed to:", arcane.address);
  console.log("View on Basescan: https://basescan.org/address/" + arcane.address);
  
  // Set base URI
  console.log("\nSetting base URI...");
  const tx = await arcane.setBaseURI("https://api.arcaneeth.com/metadata/");
  await tx.wait();
  console.log("✅ Base URI set!");
  
  // Show pack price
  const packPrice = await arcane.PACK_PRICE();
  console.log("\nPack price:", hre.ethers.utils.formatEther(packPrice), "ETH");
  console.log("At $3000/ETH, that's $" + (parseFloat(hre.ethers.utils.formatEther(packPrice)) * 3000).toFixed(2));
  
  console.log("\n🎉 DEPLOYMENT COMPLETE!");
  console.log("===================");
  console.log("Contract Address:", arcane.address);
  console.log("\nUpdate your .env:");
  console.log(`REACT_APP_CONTRACT_ADDRESS=${arcane.address}`);
  
  console.log("\n📝 How it works:");
  console.log("1. Users buy packs for ~$0.10 each");
  console.log("2. Each pack gives 5 rarity tokens (65% Common, 25% Rare, 8% Epic, 2% Legendary)");
  console.log("3. Users burn 1 rarity token to mint a card of that rarity");
  console.log("4. The AI generates the card based on the prompt AND the rarity level");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });