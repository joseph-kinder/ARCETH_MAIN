// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ArcaneETHV3 is ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    // Enums
    enum Rarity { Common, Rare, Epic, Legendary }
    
    // State variables
    Counters.Counter private _tokenIdCounter;
    
    // Pack price - ~10 cents on Base
    uint256 public constant PACK_PRICE = 0.00003 ether; // At $3000/ETH, this is ~$0.09
    uint256 public constant CARDS_PER_PACK = 5;
    uint256 public constant MAX_SUPPLY = 100000;
    
    // Rarity tokens (not NFTs, just balances)
    mapping(address => mapping(Rarity => uint256)) public rarityTokens;
    
    // Minted cards
    mapping(uint256 => Rarity) public cardRarity;
    mapping(uint256 => string) public cardPrompt;
    mapping(uint256 => uint256) public cardMintedAt;
    
    // Pack distribution weights (out of 100)
    uint8[4] public rarityWeights = [65, 25, 8, 2]; // Common: 65%, Rare: 25%, Epic: 8%, Legendary: 2%
    
    // Base URI for metadata
    string public baseTokenURI;
    bool public mintingActive = true;
    
    // Events
    event PackPurchased(address indexed buyer, Rarity[] rarities);
    event TokensMinted(address indexed to, Rarity rarity, uint256 amount);
    event CardMinted(address indexed owner, uint256 tokenId, Rarity rarity, string prompt);
    event RarityTokensBurned(address indexed owner, Rarity rarity, uint256 amount);
    
    constructor() ERC721("ArcaneETH Cards", "ARCANE") {}
    
    // Buy a pack and receive rarity tokens
    function buyPack() external payable nonReentrant {
        require(mintingActive, "Minting paused");
        require(msg.value >= PACK_PRICE, "Insufficient payment");
        require(_tokenIdCounter.current() < MAX_SUPPLY, "Max supply reached");
        
        Rarity[] memory packRarities = new Rarity[](CARDS_PER_PACK);
        
        // Generate random rarities for the pack
        for (uint256 i = 0; i < CARDS_PER_PACK; i++) {
            packRarities[i] = _generateRarity(i);
            rarityTokens[msg.sender][packRarities[i]]++;
        }
        
        emit PackPurchased(msg.sender, packRarities);
        
        // Emit individual token mint events for frontend tracking
        for (uint256 i = 0; i < CARDS_PER_PACK; i++) {
            emit TokensMinted(msg.sender, packRarities[i], 1);
        }
    }
    
    // Mint a card by burning a rarity token
    function mintCard(Rarity rarity, string memory prompt) external nonReentrant {
        require(mintingActive, "Minting paused");
        require(rarityTokens[msg.sender][rarity] > 0, "No tokens of this rarity");
        require(bytes(prompt).length > 0, "Prompt cannot be empty");
        require(_tokenIdCounter.current() < MAX_SUPPLY, "Max supply reached");
        
        // Burn the rarity token
        rarityTokens[msg.sender][rarity]--;
        emit RarityTokensBurned(msg.sender, rarity, 1);
        
        // Mint the NFT
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        
        // Store card data
        cardRarity[tokenId] = rarity;
        cardPrompt[tokenId] = prompt;
        cardMintedAt[tokenId] = block.timestamp;
        
        emit CardMinted(msg.sender, tokenId, rarity, prompt);
    }
    
    // Generate random rarity based on weights
    function _generateRarity(uint256 nonce) private view returns (Rarity) {
        uint256 random = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            msg.sender,
            nonce
        ))) % 100;
        
        uint256 cumulativeWeight = 0;
        for (uint8 i = 0; i < 4; i++) {
            cumulativeWeight += rarityWeights[i];
            if (random < cumulativeWeight) {
                return Rarity(i);
            }
        }
        
        return Rarity.Common; // Fallback
    }
    
    // View functions
    function getRarityTokenBalance(address owner, Rarity rarity) external view returns (uint256) {
        return rarityTokens[owner][rarity];
    }
    
    function getAllRarityTokenBalances(address owner) external view returns (uint256[4] memory) {
        uint256[4] memory balances;
        for (uint8 i = 0; i < 4; i++) {
            balances[i] = rarityTokens[owner][Rarity(i)];
        }
        return balances;
    }
    
    function getCardInfo(uint256 tokenId) external view returns (
        Rarity rarity,
        string memory prompt,
        uint256 mintedAt,
        address owner
    ) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return (
            cardRarity[tokenId],
            cardPrompt[tokenId],
            cardMintedAt[tokenId],
            ownerOf(tokenId)
        );
    }
    
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }
    
    // Admin functions
    function setMintingActive(bool _active) external onlyOwner {
        mintingActive = _active;
    }
    
    function setBaseURI(string memory _baseURI) external onlyOwner {
        baseTokenURI = _baseURI;
    }
    
    function setRarityWeights(uint8[4] memory _weights) external onlyOwner {
        require(_weights[0] + _weights[1] + _weights[2] + _weights[3] == 100, "Weights must sum to 100");
        rarityWeights = _weights;
    }
    
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds");
        payable(owner()).transfer(balance);
    }
    
    // Override functions
    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }
    
    // Remove the _exists function as it's already in ERC721
}