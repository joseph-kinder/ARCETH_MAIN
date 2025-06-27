const hre = require("hardhat");

async function main() {
  console.log("🔍 Checking for pending transactions...\n");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Account:", deployer.address);
  
  // Get current nonce (includes pending)
  const pendingNonce = await deployer.getTransactionCount("pending");
  const confirmedNonce = await deployer.getTransactionCount("latest");
  
  console.log("Confirmed nonce:", confirmedNonce);
  console.log("Pending nonce:", pendingNonce);
  
  if (pendingNonce > confirmedNonce) {
    console.log("\n⚠️  You have", pendingNonce - confirmedNonce, "pending transaction(s)");
    console.log("This is blocking new deployments.");
    
    console.log("\nOptions:");
    console.log("1. Wait for the pending transaction(s) to confirm");
    console.log("2. Cancel by sending a transaction with higher gas price");
    console.log("3. Check on Basescan: https://basescan.org/address/" + deployer.address);
    
    // Try to cancel pending transactions
    console.log("\nAttempting to replace pending transaction with higher gas...");
    
    const gasPrice = await deployer.getGasPrice();
    const higherGasPrice = gasPrice.mul(120).div(100); // 20% higher
    
    console.log("Current gas price:", hre.ethers.utils.formatUnits(gasPrice, "gwei"), "gwei");
    console.log("Replacement gas price:", hre.ethers.utils.formatUnits(higherGasPrice, "gwei"), "gwei");
    
    try {
      // Send 0 ETH to self with higher gas to replace
      const tx = await deployer.sendTransaction({
        to: deployer.address,
        value: 0,
        gasPrice: higherGasPrice,
        nonce: confirmedNonce // Use the first pending nonce
      });
      
      console.log("\n✅ Replacement transaction sent:", tx.hash);
      console.log("Waiting for confirmation...");
      
      const receipt = await tx.wait();
      console.log("✅ Transaction confirmed!");
      console.log("You can now deploy normally.");
      
    } catch (error) {
      console.error("\n❌ Failed to replace:", error.message);
    }
    
  } else {
    console.log("\n✅ No pending transactions. Ready to deploy!");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });