// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./ArcaneETHConfig.sol";
import "./ArcaneETHStorage.sol";

contract ArcaneETHCore is ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    ArcaneETHConfig public config;
    ArcaneETHStorage public dataStorage;
    
    Counters.Counter private _tokenIdCounter;
    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public constant GENERATION_THRESHOLD = 1000;
    string public baseTokenURI;
    bool public mintingActive = true;
    
    event PackPurchased(address indexed buyer, uint256 packType, uint256[] tokenIds);
    event CardMinted(uint256 indexed tokenId, address indexed minter, uint8 rarity);
    
    constructor(address _configAddress) ERC721("ArcaneETH", "ARCETH") {
        config = ArcaneETHConfig(_configAddress);
        dataStorage = new ArcaneETHStorage(address(this));
    }
    
    function purchasePack(uint256 packType) external payable nonReentrant {
        require(mintingActive, "Minting paused");
        require(packType < 3, "Invalid pack type");
        
        ArcaneETHConfig.PackConfig memory pack = config.getPackConfig(packType);
        require(msg.value >= pack.price, "Insufficient payment");
        require(_tokenIdCounter.current() + pack.cardCount <= MAX_SUPPLY, "Exceeds supply");
        
        uint256[] memory tokenIds = new uint256[](pack.cardCount);
        
        for (uint256 i = 0; i < pack.cardCount; i++) {
            uint8 rarity = _determineRarity(pack.rarityWeights);
            tokenIds[i] = _mintCard(msg.sender, ArcaneETHStorage.CardRarity(rarity));
        }
        
        // Distribute funds
        if (config.treasuryAddress() != address(0)) {
            uint256 treasuryAmount = (msg.value * config.creatorRoyalty()) / 10000;
            payable(config.treasuryAddress()).transfer(treasuryAmount);
        }
        
        emit PackPurchased(msg.sender, packType, tokenIds);
        
        // Check generation increment
        if (_tokenIdCounter.current() % GENERATION_THRESHOLD == 0) {
            dataStorage.incrementGeneration();
        }
    }    
    function _mintCard(address to, ArcaneETHStorage.CardRarity rarity) private returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        
        // Generate stats
        uint256 attack = _generateStat(rarity);
        uint256 defense = _generateStat(rarity);
        string memory element = _generateElement();
        
        // Store card data
        dataStorage.storeCard(tokenId, rarity, attack, defense, element, to);
        
        emit CardMinted(tokenId, to, uint8(rarity));
        return tokenId;
    }
    
    function _determineRarity(uint256[4] memory weights) private view returns (uint8) {
        uint256 total = weights[0] + weights[1] + weights[2] + weights[3];
        uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, _tokenIdCounter.current()))) % total;
        uint256 sum = 0;
        
        for (uint8 i = 0; i < 4; i++) {
            sum += weights[i];
            if (random < sum) return i;
        }
        return 0;
    }
    
    function _generateStat(ArcaneETHStorage.CardRarity rarity) private view returns (uint256) {
        uint256 base = uint256(rarity) * 20 + 20;
        uint256 variance = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao))) % 21;
        return base + variance;
    }
    
    function _generateElement() private view returns (string memory) {
        string[6] memory elements = ["Fire", "Water", "Earth", "Air", "Light", "Dark"];
        uint256 index = uint256(keccak256(abi.encodePacked(block.prevrandao))) % 6;
        return elements[index];
    }
    
    // Admin functions
    function setMintingActive(bool _active) external onlyOwner {
        mintingActive = _active;
    }
    
    function setBaseURI(string memory _baseURI) external onlyOwner {
        baseTokenURI = _baseURI;
    }
    
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds");
        payable(owner()).transfer(balance);
    }
    
    // View functions
    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }
    
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }
    
    function getCard(uint256 tokenId) external view returns (ArcaneETHStorage.Card memory) {
        require(_exists(tokenId), "Token does not exist");
        return dataStorage.getCard(tokenId);
    }
    
    // Override burn to update storage
    function _burn(uint256 tokenId) internal override {
        dataStorage.removeCard(tokenId, ownerOf(tokenId));
        super._burn(tokenId);
    }
}