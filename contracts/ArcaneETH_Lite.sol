// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ArcaneETH_Lite is ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    // State variables
    Counters.Counter private _tokenIdCounter;
    
    uint256 public constant PACK_PRICE = 0.001 ether;
    uint256 public constant MAX_SUPPLY = 10000;
    string public baseURI;
    bool public mintingActive = true;
    
    // Events
    event PackPurchased(address indexed buyer, uint256[] tokenIds);
    event CardMinted(uint256 indexed tokenId, address indexed minter);
    
    constructor() ERC721("ArcaneETH", "ARCETH") {}
    
    // Main functions
    function purchasePack() external payable nonReentrant {
        require(mintingActive, "Minting is paused");
        require(msg.value >= PACK_PRICE, "Insufficient payment");
        require(_tokenIdCounter.current() + 3 <= MAX_SUPPLY, "Not enough cards left");
        
        uint256[] memory tokenIds = new uint256[](3);
        
        for (uint256 i = 0; i < 3; i++) {
            uint256 tokenId = _tokenIdCounter.current();
            _tokenIdCounter.increment();
            _safeMint(msg.sender, tokenId);
            tokenIds[i] = tokenId;
            emit CardMinted(tokenId, msg.sender);
        }
        
        emit PackPurchased(msg.sender, tokenIds);
    }
    
    // Admin functions
    function setMintingActive(bool _active) external onlyOwner {
        mintingActive = _active;
    }
    
    function setBaseTokenURI(string memory _baseTokenURI) external onlyOwner {
        baseURI = _baseTokenURI;
    }
    
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);
    }
    
    // Override functions
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }
    
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "URI query for nonexistent token");
        return super.tokenURI(tokenId);
    }
    
    // View functions
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }
    
    // Remove the _exists function as it's already in ERC721
}