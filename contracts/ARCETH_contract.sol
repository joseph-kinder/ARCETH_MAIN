// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ArcaneETH is ERC721URIStorage, Ownable {

    // State Variablesj
    using SafeMath for uint256;
    using Counters for Counters.Counter;
    mapping(uint256 => CardMintSettings) public cardSettings;
    mapping(uint256 => PassMintSettings) public passSettings;
    mapping(address => mapping(CardType => uint256)) public walletMints;
    mapping(address => mapping(CardType => uint256)) public walletPasses;
    mapping(address => bool) private admins;

    mapping(uint256 => Card) public cards;
    mapping(uint256 => uint256) public copiesLeft;  // Store the number of copies left for each card

    Counters.Counter public packsMinted;
    Counters.Counter public tokenIdCounter;
    Counters.Counter public totalSupplyCounter;
    Counters.Counter public totalPassCirculation;
    bool public isPublicMintEnabled = true;
    string public baseTokenURI;
    address payable public withdrawWallet;
    uint256 private nonce = 0;
    uint256 packPrice = 1 gwei;

    //Structs and Enums
    enum CardType {Common, Rare, Epic, Legendary}

    struct CardMintSettings {
        CardType cardType;
        uint256 cardtotalSupply;
        uint256 maxSupply;
        uint256 maxPerWallet;
        uint256 maxCopies;
    }

    struct PassMintSettings {
        CardType passType;
    }
    
    struct Card {
        CardType cardType;
        uint256 tokenId;
    }

    struct Pass {
        CardType passType;
    }

    struct Pack {
        Card[] cards;
        Pass[] passes;
    }

    //Events
    event PassTransferred(address indexed from, address indexed to, CardType indexed passType, uint256 amount);
    event TokenBurned(address indexed owner, uint256 tokenId);
    event PackMinted(
        address indexed owner,
        Card[] cards,
        Pass[] passes
    );

    //Constructor   
    constructor() ERC721("ArcaneETH", "ARCETH") {
        initCardSettings(
            CardMintSettings({
                cardType: CardType.Common,
                cardtotalSupply: 0,
                maxSupply: 100,
                maxPerWallet: 10,
                maxCopies: 20
            })
        );
        initCardSettings(
            CardMintSettings({
                cardType: CardType.Rare,
                cardtotalSupply: 0,
                maxSupply: 100,
                maxPerWallet: 10,
                maxCopies: 10
            })
        );
        initCardSettings(
            CardMintSettings({
                cardType: CardType.Epic,
                cardtotalSupply: 0,
                maxSupply: 100,
                maxPerWallet: 10,
                maxCopies: 3
            })
        );
        initCardSettings(
            CardMintSettings({
                cardType: CardType.Legendary,
                cardtotalSupply: 0,
                maxSupply: 100,
                maxPerWallet: 10,
                maxCopies: 1
            })
        );
        
    }

    //Modifiers
    modifier onlyAdmin() {
        require(admins[msg.sender], "Only admin allowed");
        _;
    }


    // Public and External Functions
    function setIsPublicMintEnabled(bool isPublicMintEnabled_) external onlyOwner {
        isPublicMintEnabled = isPublicMintEnabled_;
    }

    function setBaseTokenURI(string calldata _baseTokenURI) external onlyOwner {
        baseTokenURI = _baseTokenURI;
    }


    function balanceOf(address _owner, CardType _type) public view returns (uint256) {
        return walletMints[_owner][_type];
    }

    function totalBalanceOf(address _owner) external view returns (uint256) {
        return ERC721.balanceOf(_owner); 
    }

    function withdraw() external onlyOwner {
        (bool success, ) = withdrawWallet.call{ value: address(this).balance}("");
        require(success, "Withdraw failed");
    }

    function transfer(address to, uint256 tokenId) external {
        require(_isApprovedOrOwner(msg.sender, tokenId), "Not approved or owner");
        _transfer(msg.sender, to, tokenId);
    }

    function transferPass(address from, address to, CardType passType, uint256 amount) external {
        require(msg.sender == owner() || msg.sender == from, "Only owner or pass owner can transfer");
        require(from != address(0), "Invalid sender address");
        require(to != address(0), "Invalid recipient address");
        require(from != to, "Sender and recipient are the same");
        
        uint256 fromPassBalance = walletPasses[from][passType];
        require(fromPassBalance >= amount, "Insufficient pass balance");
        
        walletPasses[from][passType] -= amount;
        walletPasses[to][passType] += amount;
        
        emit PassTransferred(from, to, passType, amount);
    }

    function burn(uint256 tokenId) external {
        require(_exists(tokenId), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender || isAdmin(msg.sender), "Not the owner or admin");
        
        _burn(tokenId); // This is the OpenZeppelin function to burn the token
        
        emit TokenBurned(msg.sender, tokenId);
    }

    function mintPack() external payable {
        require(isPublicMintEnabled, "Minting not enabled");
        require(msg.value == packPrice, "Wrong mint value");
        
        Card[] memory generatedCards = new Card[](10);
        Pass[] memory generatedPasses = new Pass[](10);
        Pack memory pack;
        for (uint256 i = 0; i < 11; i++) {
            uint256 num1 = getRandomNumber(100);
            uint256 num2 = getRandomNumber(100);

            (CardType type_, bool mintNew) = getType(i, num1, num2);

            if (mintNew){
                addPass(msg.sender, type_, 1);
                //generatedPasses[i] = Pass({ passType: type_});
            } else {
                uint256 Id = getRandomTokenId(type_);
                uint256 tokenId = mintCopy(msg.sender, Id, type_);
                //generatedCards[i] = Card({ cardType: type_, tokenId: tokenId });
            }
        }

        // Remove empty slots from generated arrays
        //uint256 cardCount = 0;
        //for (uint256 i = 0; i < generatedCards.length; i++) {
        //    if (generatedCards[i].tokenId != 0) {
        //        generatedCards[cardCount] = generatedCards[i];
        //        cardCount++;
        //    }
        //}

        // Resize arrays to actual length
        //assembly {
        //    mstore(generatedCards, cardCount)
        //    mstore(generatedPasses, cardCount)
        //}

        //pack.cards = generatedCards;
        //pack.passes = generatedPasses;


        // Process and emit events for the minted pack
        //emit PackMinted(msg.sender, pack.cards, pack.passes);

        (bool success,) = withdrawWallet.call{ value: msg.value}("");
        require(success, "Transfer failed");
        packsMinted.increment();
    }

    //Internal and Private Functions
    function initCardSettings(CardMintSettings memory settings) internal {
        cardSettings[uint(settings.cardType)] = settings;
    }

    function getRandomNumber(uint256 max) internal returns (uint256) {
        nonce++;
        uint256 randomNumber = uint256(
            keccak256(abi.encodePacked(block.timestamp, block.prevrandao, nonce))
        );
        return randomNumber % max;

    }

    function getType(uint256 num, uint256 rand_rar, uint256 rand_mint) public view returns (CardType _type, bool newMint) {
        uint256 bound;

        if (totalSupplyCounter.current() < 20000) {
            bound = totalSupplyCounter.current() < 100 ? 50 : totalSupplyCounter.current() < 1000 ? 70 : totalSupplyCounter.current() < 10000 ? 80 : 90;
        }

        if (num <= 6) {
            _type = rand_rar < 80 ? CardType.Common : CardType.Rare;
        } else if (6 < num && num <= 8) {
            _type = rand_rar < 80 ? CardType.Rare : CardType.Epic;
        } else if (8 < num && num <= 10) {
            _type = rand_rar < 80 ? CardType.Epic : CardType.Legendary;
        }

        newMint = rand_mint >= bound;

        return (_type, newMint);
    }

    //SET TO INTERNAL AFTER TESTING
    function getRandomTokenId(CardType _type) public view returns (uint256) { 

        uint256[] memory availableTokens = new uint256[](totalSupplyCounter.current());
        uint256 availableCount = 0;

        for (uint256 i = 1; i <= totalSupplyCounter.current(); i++) {
            if (cards[i].cardType == _type && copiesLeft[i] > 0) {
                availableTokens[availableCount] = i;
                availableCount++;
            }
        }

        require(availableCount > 0, "No available cards with copies left");

        uint256 randomIndex = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender))) % availableCount;
        return availableTokens[randomIndex];
        }

    
    //Fallback and Receive Functions

    //Admin functions
    function setPackPrice(uint256 _packPrice) external onlyOwner {
        packPrice = _packPrice;
    }

    function addAdmin(address account) external onlyOwner {
        admins[account] = true;
    }

    function removeAdmin(address account) external onlyOwner {
        admins[account] = false;
    }

    function isAdmin(address account) public view returns (bool) {
        return admins[account];
    }

    //Token Metadata Functions
    function tokenURI(uint256 tokenId_) public view override returns (string memory) {
        require(_exists(tokenId_), "Token does not exist");
        return string(abi.encodePacked(baseTokenURI, Strings.toString(tokenId_), ".json"));
    }

    function addPass(address wallet, CardType passType, uint256 amount) public onlyOwner {
        // Add more requirements here
        require(amount > 0, "Amount must be greater than 0");
        walletPasses[wallet][passType] += amount;
        totalPassCirculation.increment();
    }

    function _mintNew(address wallet, CardType _type, string memory _tokenURI) public onlyOwner returns (uint256) {
        CardMintSettings storage card = cardSettings[uint256(_type)];

        require(isPublicMintEnabled, "Minting not enabled");
        require(card.cardtotalSupply + 1 <= card.maxSupply, "Sold Out");
        require(walletMints[wallet][_type] + 1 <= card.maxPerWallet, "Exceed max wallet");
        require(walletPasses[wallet][_type] >= 0, "Insufficient pass balance");

        // Mint token
        uint256 tokenId = totalSupplyCounter.current() + 1;
        card.cardtotalSupply++;
        totalSupplyCounter.increment();
        _safeMint(wallet, tokenId);
        
        _setTokenURI(tokenId, _tokenURI);

        walletMints[wallet][_type]++;
        walletPasses[wallet][_type]--;

        // Initialize copiesLeft for this card
        copiesLeft[tokenId] = card.maxCopies;

        // Update cards mapping
        cards[tokenId] = Card({ cardType: _type, tokenId: tokenId });

        return tokenId;
    }

    function mintCopy(address wallet, uint256 tokenId, CardType _type) public onlyOwner returns(uint256){
        CardMintSettings storage card = cardSettings[uint256(_type)];
        Card storage originalCard = cards[tokenId];

        require(_exists(tokenId), "Token does not exist");
        require(originalCard.tokenId != 0, "Invalid tokenId");
        require(isPublicMintEnabled, "Minting not enabled");
        require(card.cardtotalSupply + 1 <= card.maxSupply, "Sold Out");
        require(walletMints[wallet][_type] + 1 <= card.maxPerWallet, "Exceed max wallet");
        require(copiesLeft[tokenId] > 0, "No copies left");

        // Create a copy of the original card
        uint256 newTokenId = totalSupplyCounter.current() + 1;
        totalSupplyCounter.increment();
        _safeMint(wallet, newTokenId);
        
        _setTokenURI(newTokenId, tokenURI(tokenId));

        // Decrement copiesLeft for the original card
        copiesLeft[tokenId]--;
        walletMints[wallet][_type]++;

        // Update cards mapping for the copy
        cards[newTokenId] = Card({ cardType: originalCard.cardType, tokenId: newTokenId });

        return newTokenId;
    }

    function _testCards(address wallet) public onlyOwner {
        _mintNew(wallet, CardType.Common, "Balls");
        _mintNew(wallet, CardType.Rare, "Balls");
        _mintNew(wallet, CardType.Epic, "Balls");
        _mintNew(wallet, CardType.Legendary, "Balls");
    }

    function _testPasses(address wallet) public onlyOwner {
        addPass(wallet, CardType.Common, 3);
        addPass(wallet, CardType.Rare, 3);
        addPass(wallet, CardType.Epic, 3);
        addPass(wallet, CardType.Legendary, 3);
    }

}