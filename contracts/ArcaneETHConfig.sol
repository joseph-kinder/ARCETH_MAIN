// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ArcaneETHConfig is Ownable {
    // Pack configurations
    struct PackConfig {
        uint256 price;
        uint256 cardCount;
        uint256[4] rarityWeights; // [common, rare, epic, legendary]
    }
    
    mapping(uint256 => PackConfig) public packConfigs;
    address public nftContract;
    address public treasuryAddress;
    uint256 public creatorRoyalty = 250; // 2.5%
    
    modifier onlyNFTContract() {
        require(msg.sender == nftContract, "Only NFT contract");
        _;
    }
    
    constructor(address _treasury) {
        treasuryAddress = _treasury;
        
        // Initialize pack configurations
        packConfigs[0] = PackConfig({
            price: 0.001 ether,
            cardCount: 3,
            rarityWeights: [uint256(70), 25, 4, 1]
        });
        
        packConfigs[1] = PackConfig({
            price: 0.003 ether,
            cardCount: 5,
            rarityWeights: [uint256(50), 35, 12, 3]
        });
        
        packConfigs[2] = PackConfig({
            price: 0.01 ether,
            cardCount: 10,
            rarityWeights: [uint256(30), 40, 20, 10]
        });
    }
    
    function setNFTContract(address _nftContract) external onlyOwner {
        nftContract = _nftContract;
    }
    
    function getPackConfig(uint256 packType) external view returns (PackConfig memory) {
        return packConfigs[packType];
    }
    
    function updatePackPrice(uint256 packType, uint256 newPrice) external onlyOwner {
        packConfigs[packType].price = newPrice;
    }
    
    function setTreasury(address _treasury) external onlyOwner {
        treasuryAddress = _treasury;
    }
}