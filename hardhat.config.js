require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("@typechain/hardhat");
const dotenv = require("dotenv");

dotenv.config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.19",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.8.21",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ]
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    base: {
      url: "https://mainnet.base.org",
      accounts: process.env.REACT_APP_PRIVATE_KEY ? [process.env.REACT_APP_PRIVATE_KEY] : []
      // No gas price - let the script handle it
    },
    baseSepolia: {
      url: "https://sepolia.base.org", 
      accounts: process.env.REACT_APP_PRIVATE_KEY ? [process.env.REACT_APP_PRIVATE_KEY] : [],
      gasPrice: "auto"  // Let Base determine the optimal gas price
    },
    // Keep goerli for testing
    goerli: {
      url: process.env.REACT_APP_GOERLI_RPC_URL || "",
      accounts: process.env.REACT_APP_PRIVATE_KEY ? [process.env.REACT_APP_PRIVATE_KEY] : []
    },
  },
  etherscan: {
    apiKey: {
      base: process.env.BASESCAN_API_KEY || "",
      baseSepolia: process.env.BASESCAN_API_KEY || "",
      goerli: process.env.REACT_APP_ETHERSCAN_KEY || ""
    },
    customChains: [
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org"
        }
      },
      {
        network: "baseSepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api", 
          browserURL: "https://sepolia.basescan.org"
        }
      }
    ]
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
};