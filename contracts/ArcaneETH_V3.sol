// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ArcaneETH_V3 is ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    // Rarity levels
    enum Rarity { Common, Rare, Epic, Legendary }
    
    // Track tokens and cards
    mapping(address => mapping(Rarity => uint256)) public rarityTokens;
    mapping(uint256 => Rarity) public cardRarity;
    
    Counters.Counter private _tokenIdCounter;
    
    // Pricing and settings
    uint256 public packPrice = 0.00003 ether; // ~$0.10 at $3000/ETH
    uint256 public constant CARDS_PER_PACK = 5;
    uint256 public constant MAX_SUPPLY = 10000;
    string public baseTokenURI;
    bool public mintingActive = true;
    
    // Events
    event PackPurchased(address indexed buyer, uint256[4] tokenCounts);
    event CardMinted(address indexed minter, uint256 tokenId, Rarity rarity, string prompt);
    event TokensBurned(address indexed burner, Rarity rarity, uint256 amount);
    
    constructor() ERC721("ArcaneETH Cards", "ARCANE") {}
    
    // Buy a pack and receive rarity tokens
    function buyPack() external payable nonReentrant {
        require(mintingActive, "Minting paused");
        require(msg.value >= packPrice, "Insufficient payment");
        
        uint256[4] memory tokenCounts = [uint256(0), 0, 0, 0];
        
        // Generate 5 random tokens with rarity distribution
        for (uint256 i = 0; i < CARDS_PER_PACK; i++) {
            uint256 random = _random(i) % 100;
            
            if (random < 60) {
                // 60% Common
                rarityTokens[msg.sender][Rarity.Common]++;
                tokenCounts[0]++;
            } else if (random < 85) {
                // 25% Rare
                rarityTokens[msg.sender][Rarity.Rare]++;
                tokenCounts[1]++;
            } else if (random < 95) {
                // 10% Epic
                rarityTokens[msg.sender][Rarity.Epic]++;
                tokenCounts[2]++;
            } else {
                // 5% Legendary
                rarityTokens[msg.sender][Rarity.Legendary]++;
                tokenCounts[3]++;
            }
        }
        
        emit PackPurchased(msg.sender, tokenCounts);
    }
    
    // Mint a card using a rarity token
    function mintCard(Rarity rarity, string memory prompt) external nonReentrant {
        require(mintingActive, "Minting paused");
        require(rarityTokens[msg.sender][rarity] > 0, "No tokens of this rarity");
        require(_tokenIdCounter.current() < MAX_SUPPLY, "Max supply reached");
        require(bytes(prompt).length > 0, "Prompt required");
        
        // Burn the token
        rarityTokens[msg.sender][rarity]--;
        emit TokensBurned(msg.sender, rarity, 1);
        
        // Mint the NFT
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(msg.sender, tokenId);
        cardRarity[tokenId] = rarity;
        
        emit CardMinted(msg.sender, tokenId, rarity, prompt);
    }
    
    // View functions
    function getUserTokens(address user) external view returns (uint256[4] memory) {
        return [
            rarityTokens[user][Rarity.Common],
            rarityTokens[user][Rarity.Rare],
            rarityTokens[user][Rarity.Epic],
            rarityTokens[user][Rarity.Legendary]
        ];
    }
    
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }
    
    // Admin functions
    function setPackPrice(uint256 newPrice) external onlyOwner {
        packPrice = newPrice;
    }
    
    function setMintingActive(bool active) external onlyOwner {
        mintingActive = active;
    }
    
    function setBaseURI(string memory uri) external onlyOwner {
        baseTokenURI = uri;
    }
    
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds");
        payable(owner()).transfer(balance);
    }
    
    // Internal functions
    function _random(uint256 nonce) private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            msg.sender,
            nonce,
            _tokenIdCounter.current()
        )));
    }
    
    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }
}