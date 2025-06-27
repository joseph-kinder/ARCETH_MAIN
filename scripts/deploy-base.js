const hre = require("hardhat");

async function main() {
  console.log("Starting deployment to Base L2...");
  
  // Get the contract factory
  const ArcaneETH_V2 = await hre.ethers.getContractFactory("ArcaneETH_V2");
  
  // Deploy parameters
  const name = "ArcaneETH";
  const symbol = "ARCETH";
  const treasuryAddress = process.env.TREASURY_ADDRESS || "0x0000000000000000000000000000000000000000"; // Set your treasury address
  
  console.log("Deploying with parameters:");
  console.log("- Name:", name);
  console.log("- Symbol:", symbol);
  console.log("- Treasury:", treasuryAddress);
  
  // Deploy the contract
  const arcaneETH = await ArcaneETH_V2.deploy(name, symbol, treasuryAddress);
  
  // Wait for deployment
  await arcaneETH.deployed();
  
  console.log("ArcaneETH_V2 deployed to:", arcaneETH.address);
  console.log("Transaction hash:", arcaneETH.deployTransaction.hash);
  
  // Wait for a few block confirmations
  console.log("Waiting for block confirmations...");
  await arcaneETH.deployTransaction.wait(5);
  
  // Verify the contract on Basescan
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("Verifying contract on Basescan...");
    try {
      await hre.run("verify:verify", {
        address: arcaneETH.address,
        constructorArguments: [name, symbol, treasuryAddress],
      });
      console.log("Contract verified successfully!");
    } catch (error) {
      console.log("Verification failed:", error.message);
    }
  }
  
  // Set initial configuration
  console.log("Setting initial configuration...");
  
  // Set base URI for metadata
  const baseURI = process.env.BASE_URI || "https://api.arcaneeth.com/metadata/";
  await arcaneETH.setBaseURI(baseURI);
  console.log("Base URI set to:", baseURI);
  
  console.log("\nDeployment complete! 🎉");
  console.log("Contract address:", arcaneETH.address);
  console.log("\nNext steps:");
  console.log("1. Update the contract address in your frontend");
  console.log("2. Set up metadata API endpoint");
  console.log("3. Configure treasury address if not set");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });