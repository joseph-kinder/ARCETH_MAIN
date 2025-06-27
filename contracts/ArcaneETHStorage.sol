// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ArcaneETHStorage {
    enum CardRarity { Common, Rare, Epic, Legendary }
    
    struct Card {
        uint256 tokenId;
        CardRarity rarity;
        uint256 attack;
        uint256 defense;
        string element;
        uint256 generation;
        uint256 mintedAt;
        address originalMinter;
    }
    
    mapping(uint256 => Card) public cards;
    mapping(CardRarity => uint256) public raritySupply;
    mapping(address => mapping(CardRarity => uint256)) public userRarityCount;
    
    address public nftContract;
    uint256 public currentGeneration = 1;
    
    modifier onlyNFTContract() {
        require(msg.sender == nftContract, "Only NFT contract");
        _;
    }
    
    constructor(address _nftContract) {
        nftContract = _nftContract;
    }
    
    function storeCard(
        uint256 tokenId,
        CardRarity rarity,
        uint256 attack,
        uint256 defense,
        string memory element,
        address minter
    ) external onlyNFTContract {
        cards[tokenId] = Card({
            tokenId: tokenId,
            rarity: rarity,
            attack: attack,
            defense: defense,
            element: element,
            generation: currentGeneration,
            mintedAt: block.timestamp,
            originalMinter: minter
        });
        
        raritySupply[rarity]++;
        userRarityCount[minter][rarity]++;
    }
    
    function getCard(uint256 tokenId) external view returns (Card memory) {
        return cards[tokenId];
    }
    
    function incrementGeneration() external onlyNFTContract {
        currentGeneration++;
    }
    
    function removeCard(uint256 tokenId, address owner) external onlyNFTContract {
        Card memory card = cards[tokenId];
        raritySupply[card.rarity]--;
        userRarityCount[owner][card.rarity]--;
        delete cards[tokenId];
    }
}