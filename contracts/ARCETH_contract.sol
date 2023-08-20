// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ArcaneETH is ERC721URIStorage, Ownable {
    
    enum CardType {Common, Rare, Epic, Legendary}

    struct CardMintSettings {
        CardType cardType;
        uint256 mintPrice;
        uint256 cardtotalSupply;
        uint256 maxSupply;
        uint256 maxPerWallet;
    }

    mapping(uint256 => CardMintSettings) public cardSettings;

    uint256 public totalSupply;
    bool public isPublicMintEnabled;
    string public baseTokenURI;
    address payable public withdrawWallet;
    mapping(address => mapping(CardType => uint256)) public walletMints;

    constructor() payable ERC721("ArcaneETH", "ARCETH") {
        initCardSettings(
            CardMintSettings({
                cardType: CardType.Common,
                mintPrice: 1 gwei,
                cardtotalSupply: 0,
                maxSupply: 100,
                maxPerWallet: 10
            })
        );
        initCardSettings(
            CardMintSettings({
                cardType: CardType.Rare,
                mintPrice: 2 gwei,
                cardtotalSupply: 0,
                maxSupply: 100,
                maxPerWallet: 10
            })
        );
        initCardSettings(
            CardMintSettings({
                cardType: CardType.Epic,
                mintPrice: 3 gwei,
                cardtotalSupply: 0,
                maxSupply: 100,
                maxPerWallet: 10
            })
        );
        initCardSettings(
            CardMintSettings({
                cardType: CardType.Legendary,
                mintPrice: 4 gwei,
                cardtotalSupply: 0,
                maxSupply: 100,
                maxPerWallet: 10
            })
        );
        
    }

    function initCardSettings(CardMintSettings memory settings) internal {
        cardSettings[uint(settings.cardType)] = settings;
    }

    function setIsPublicMintEnabled(bool isPublicMintEnabled_) external onlyOwner {
        isPublicMintEnabled = isPublicMintEnabled_;
    }

    function setBaseTokenURI(string calldata _baseTokenURI) external onlyOwner {
        baseTokenURI = _baseTokenURI;
    }

    //function tokenURI(uint256 tokenId_) public view override returns (string memory) {
    //    require(_exists(tokenId_), "Token does not exist");
    //   return string(abi.encodePacked(baseTokenURI, Strings.toString(tokenId_), ".json"));
    //}

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

    function mint(CardType _type, string memory _tokenURI) external payable {

        CardMintSettings storage card = cardSettings[uint256(_type)];

        require(isPublicMintEnabled, "Minting not enabled");
        require(msg.value == card.mintPrice, "Wrong mint value");
        require(card.cardtotalSupply + 1 <= card.maxSupply, "Sold Out");
        require(walletMints[msg.sender][_type] + 1 <= card.maxPerWallet, "Exceed max wallet");

        // Mint token
        uint256 tokenId = totalSupply + 1;
        card.cardtotalSupply++;
        totalSupply++;
        _safeMint(msg.sender, tokenId);
        
        _setTokenURI(tokenId, _tokenURI);

        (bool success,) = withdrawWallet.call{value: msg.value}("");
        require(success, "Transfer failed");
    }
}