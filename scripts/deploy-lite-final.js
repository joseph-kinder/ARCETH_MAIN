const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying simplified contract...\n");
  
  const [deployer] = await hre.ethers.getSigners();
  
  // Config is already deployed at: 0xB1211038F47E8221e6BB3eDDb2364BDF496d60d1
  const configAddress = "0xB1211038F47E8221e6BB3eDDb2364BDF496d60d1";
  
  console.log("Using existing config:", configAddress);
  console.log("Deploying ArcaneETH Lite...");
  
  // Deploy the simpler contract instead
  const ArcaneETH = await hre.ethers.getContractFactory("ArcaneETH_Lite");
  const arcane = await ArcaneETH.deploy();
  
  console.log("Tx hash:", arcane.deployTransaction.hash);
  console.log("Waiting for confirmation...");
  
  await arcane.deployed();
  
  console.log("\n✅ ArcaneETH Lite deployed to:", arcane.address);
  console.log("View on Basescan: https://basescan.org/address/" + arcane.address);
  
  // Set base URI
  console.log("\nSetting base URI...");
  const tx = await arcane.setBaseTokenURI("https://api.arcaneeth.com/metadata/");
  await tx.wait();
  console.log("✅ Base URI set!");
  
  console.log("\n🎉 DEPLOYMENT COMPLETE!");
  console.log("===================");
  console.log("Contract Address:", arcane.address);
  console.log("\nUpdate your .env:");
  console.log(`REACT_APP_CONTRACT_ADDRESS=${arcane.address}`);
  
  // Show the Config contract too
  console.log("\nDeployed Contracts:");
  console.log("- Config Contract:", configAddress);
  console.log("- NFT Contract:", arcane.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });