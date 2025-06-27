// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract ArcaneETH_V2 is ERC721URIStorage, ERC721Enumerable, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    using Strings for uint256;

    // Card rarity tiers
    enum CardRarity { Common, Rare, Epic, Legendary }
    
    // Card struct with enhanced metadata
    struct Card {
        uint256 tokenId;
        CardRarity rarity;
        uint256 attack;
        uint256 defense;
        string element;
        uint256 generation; // Track when card was created
        uint256 mintedAt;
        address originalMinter;
    }

    // Pack types
    enum PackType { Basic, Premium, Ultimate }
    
    struct PackConfig {
        uint256 price;
        uint256 cardCount;
        uint256[4] rarityWeights; // [common, rare, epic, legendary]
    }
    // State variables
    Counters.Counter private _tokenIdCounter;
    Counters.Counter private _generationCounter;
    
    mapping(uint256 => Card) public cards;
    mapping(PackType => PackConfig) public packConfigs;
    mapping(address => uint256) public userPacksPurchased;
    mapping(CardRarity => uint256) public raritySupply;
    mapping(address => mapping(CardRarity => uint256)) public userRarityCount;
    
    // Events
    event PackPurchased(address indexed buyer, PackType packType, uint256[] tokenIds);
    event CardMinted(uint256 indexed tokenId, address indexed minter, CardRarity rarity);
    event CardBurned(uint256 indexed tokenId, address indexed burner);
    
    // Base L2 optimized settings
    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public constant GENERATION_THRESHOLD = 1000; // New generation every 1000 cards
    string public baseURI;
    bool public mintingActive = true;
    
    // Revenue sharing
    address public treasuryAddress;
    uint256 public creatorRoyalty = 250; // 2.5%
    
    constructor(
        string memory _name,
        string memory _symbol,
        address _treasuryAddress
    ) ERC721(_name, _symbol) {
        treasuryAddress = _treasuryAddress;
        _generationCounter.increment(); // Start at generation 1
        
        // Initialize pack configurations (prices in wei)
        packConfigs[PackType.Basic] = PackConfig({
            price: 0.001 ether,
            cardCount: 3,
            rarityWeights: [uint256(70), 25, 4, 1]
        });        
        packConfigs[PackType.Premium] = PackConfig({
            price: 0.003 ether,
            cardCount: 5,
            rarityWeights: [uint256(50), 35, 12, 3]
        });
        
        packConfigs[PackType.Ultimate] = PackConfig({
            price: 0.01 ether,
            cardCount: 10,
            rarityWeights: [uint256(30), 40, 20, 10]
        });
    }
    
    // Modifiers
    modifier mintingIsActive() {
        require(mintingActive, "Minting is paused");
        _;
    }
    
    modifier hasNotExceededSupply() {
        require(totalSupply() < MAX_SUPPLY, "Max supply reached");
        _;
    }
    
    // Main functions
    function purchasePack(PackType _packType) 
        external 
        payable 
        mintingIsActive 
        hasNotExceededSupply 
        nonReentrant 
    {
        PackConfig memory config = packConfigs[_packType];
        require(msg.value >= config.price, "Insufficient payment");
        require(totalSupply() + config.cardCount <= MAX_SUPPLY, "Not enough cards left");
        
        uint256[] memory tokenIds = new uint256[](config.cardCount);
        
        for (uint256 i = 0; i < config.cardCount; i++) {
            CardRarity rarity = _determineRarity(config.rarityWeights);
            tokenIds[i] = _mintCard(msg.sender, rarity);
        }        
        userPacksPurchased[msg.sender]++;
        
        // Distribute funds
        if (treasuryAddress != address(0)) {
            uint256 treasuryAmount = (msg.value * creatorRoyalty) / 10000;
            payable(treasuryAddress).transfer(treasuryAmount);
        }
        
        emit PackPurchased(msg.sender, _packType, tokenIds);
        
        // Check for generation increment
        if (totalSupply() % GENERATION_THRESHOLD == 0) {
            _generationCounter.increment();
        }
    }
    
    function _mintCard(address _to, CardRarity _rarity) private returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(_to, tokenId);
        
        // Create card data
        cards[tokenId] = Card({
            tokenId: tokenId,
            rarity: _rarity,
            attack: _generateStat(_rarity, true),
            defense: _generateStat(_rarity, false),
            element: _generateElement(),
            generation: _generationCounter.current(),
            mintedAt: block.timestamp,
            originalMinter: _to
        });
        
        raritySupply[_rarity]++;
        userRarityCount[_to][_rarity]++;
        
        emit CardMinted(tokenId, _to, _rarity);
        return tokenId;
    }    
    // Generation and rarity determination
    function _determineRarity(uint256[4] memory weights) private view returns (CardRarity) {
        uint256 totalWeight = weights[0] + weights[1] + weights[2] + weights[3];
        uint256 random = _random() % totalWeight;
        uint256 weightSum = 0;
        
        for (uint256 i = 0; i < 4; i++) {
            weightSum += weights[i];
            if (random < weightSum) {
                return CardRarity(i);
            }
        }
        
        return CardRarity.Common;
    }
    
    function _generateStat(CardRarity _rarity, bool isAttack) private view returns (uint256) {
        uint256 baseStat = uint256(_rarity) * 20 + 20;
        uint256 variance = _random() % 21; // 0-20 variance
        return baseStat + variance;
    }
    
    function _generateElement() private view returns (string memory) {
        string[6] memory elements = ["Fire", "Water", "Earth", "Air", "Light", "Dark"];
        return elements[_random() % 6];
    }
    
    function _random() private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            msg.sender,
            _tokenIdCounter.current()
        )));
    }
    
    // Burn functionality
    function burn(uint256 tokenId) public {
        require(_isApprovedOrOwner(msg.sender, tokenId), "Not authorized");
        
        CardRarity rarity = cards[tokenId].rarity;
        raritySupply[rarity]--;
        userRarityCount[ownerOf(tokenId)][rarity]--;        
        delete cards[tokenId];
        _burn(tokenId);
        
        emit CardBurned(tokenId, msg.sender);
    }
    
    // View functions
    function getCard(uint256 tokenId) public view returns (Card memory) {
        require(_ownerOf(tokenId) != address(0), "Card does not exist");
        return cards[tokenId];
    }
    
    function getUserCards(address user) public view returns (uint256[] memory) {
        uint256 balance = balanceOf(user);
        uint256[] memory tokenIds = new uint256[](balance);
        
        for (uint256 i = 0; i < balance; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(user, i);
        }
        
        return tokenIds;
    }
    
    function getRarityDistribution() public view returns (
        uint256 common,
        uint256 rare,
        uint256 epic,
        uint256 legendary
    ) {
        return (
            raritySupply[CardRarity.Common],
            raritySupply[CardRarity.Rare],
            raritySupply[CardRarity.Epic],
            raritySupply[CardRarity.Legendary]
        );
    }
    
    // Admin functions
    function setMintingActive(bool _active) external onlyOwner {
        mintingActive = _active;
    }    
    function setBaseURI(string memory _baseURI) external onlyOwner {
        baseURI = _baseURI;
    }
    
    function updatePackPrice(PackType _packType, uint256 _newPrice) external onlyOwner {
        packConfigs[_packType].price = _newPrice;
    }
    
    function setTreasuryAddress(address _treasury) external onlyOwner {
        treasuryAddress = _treasury;
    }
    
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);
    }
    
    // Override functions
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
    
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId) 
        public 
        view 
        override(ERC721, ERC721URIStorage) 
        returns (string memory) 
    {
        require(_ownerOf(tokenId) != address(0), "URI query for nonexistent token");
        
        string memory _tokenURI = super.tokenURI(tokenId);
        if (bytes(_tokenURI).length > 0) {
            return _tokenURI;        }
        
        return bytes(baseURI).length > 0
            ? string(abi.encodePacked(baseURI, tokenId.toString(), ".json"))
            : "";
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    
    // Additional helper functions
    function getCurrentGeneration() public view returns (uint256) {
        return _generationCounter.current();
    }
    
    function getPacksRemaining() public view returns (uint256) {
        return (MAX_SUPPLY - totalSupply()) / 3; // Assuming minimum pack size
    }
}