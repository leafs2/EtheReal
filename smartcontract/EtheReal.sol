// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { Strings } from "@openzeppelin/contracts/utils/Strings.sol";
import "./HouseToken.sol";

interface IhouseAsset {
    function ownerOf(uint256 tokenId) external view returns (address owner);
    function transferFrom(address from, address to, uint256 tokenId) external;
    function tokenURI(uint256 tokenId) external view returns (string memory);
}

contract EtheReal is Ownable {
    using Strings for uint256;

    struct StakeInfo {
        address owner;
        uint256 stakeTime;
        uint256 duration;
        uint256 pricePerToken;
        uint256 rentPricePerMonth;
        address tokenAddress;
        uint256 totalSupply;
        uint256 currentSupply;
        uint256 startTime;
        uint256 endTime;
    }

    IhouseAsset public houseAsset;
    uint256 public duration = 30 days;

    mapping(uint256 => mapping (uint256 => address)) public rentAddressMonth;

    mapping(uint256 => StakeInfo) public stakes;
    mapping(uint256 => uint256) public houseOwnerClaimedAmount;
    mapping(uint256 => uint256) public houseInvestorClaimedAmount;
    mapping(uint256 => uint256) public minAmount;

    mapping(uint256 => address) public defaultRentAddress;

    event TokensPurchased(address indexed buyer, uint256 amount);
    event NFTStaked(address indexed staker, uint256 tokenId, uint256 duration);
    event RentHouse(address indexed renter, uint256 tokenId, uint256 months);

    constructor(address _houseAsset) Ownable(msg.sender) {
        houseAsset = IhouseAsset(_houseAsset);
    }

    function stakeNFT(uint256 tokenId,uint256 startTime, uint256 endTime,  uint256 _minAmount, uint256 months, uint256 pricePerToken, uint256 totalSupply, uint256 rentPricePerMonth) public {
        require(houseAsset.ownerOf(tokenId) == msg.sender, "Not the owner of the NFT");
        houseAsset.transferFrom(msg.sender, address(this), tokenId);
        uint256 stakeDuration = months * duration;
        string memory tokenName = string(abi.encodePacked("HouseToken ", tokenId.toString()));
        string memory tokenSymbol = string(abi.encodePacked("HT", tokenId.toString()));
        HouseToken token = new HouseToken(tokenName, tokenSymbol, totalSupply);
        stakes[tokenId] = StakeInfo({
            owner: msg.sender,
            stakeTime: block.timestamp,
            duration: stakeDuration,
            pricePerToken: pricePerToken,
            rentPricePerMonth: rentPricePerMonth,
            tokenAddress: address(token),
            totalSupply: totalSupply,
            currentSupply: 0,
            startTime: startTime,
            endTime: endTime
        });
        minAmount[tokenId] = _minAmount;
        emit NFTStaked(msg.sender, tokenId, duration);
    }

    function buyTokens(uint256 amount, uint256 tokenId) public payable {
        uint256 nowTime = block.timestamp;
        require(nowTime > stakes[tokenId].startTime, "not start");
        require(nowTime < stakes[tokenId].endTime, "ended");
        HouseToken token = HouseToken(stakes[tokenId].tokenAddress);
        uint256 price = amount * stakes[tokenId].pricePerToken;
        require(msg.value == price, "Incorrect ether value sent");
        require(amount >= minAmount[tokenId], "lower than minimum");
        houseOwnerClaimedAmount[tokenId] += price;
        token.mint(msg.sender, amount);
        stakes[tokenId].currentSupply += amount;
        emit TokensPurchased(msg.sender, amount);
    }

    function withdrawETH(uint256 tokenId) public {
        require(block.timestamp > stakes[tokenId].endTime, "not ended");
        require(msg.sender == stakes[tokenId].owner, "not owenr");
        require(stakes[tokenId].totalSupply== stakes[tokenId].currentSupply, "not sale");
        uint256 balance = houseOwnerClaimedAmount[tokenId];
        require(balance > 0, "HouseToken: no Ether available for withdrawal");
        payable(msg.sender).transfer(balance);
        houseOwnerClaimedAmount[tokenId] = 0;
    }

    function getRentPerAmount(uint256 tokenId) public view returns (uint256 amount){
        uint256 totalSupply = stakes[tokenId].totalSupply;
        uint256 currentSupply = stakes[tokenId].currentSupply;
        if (totalSupply == currentSupply)
            return houseInvestorClaimedAmount[tokenId] / totalSupply;
        else 
            return stakes[tokenId].pricePerToken;
    }

    function burnForETH(uint256 tokenId) public {
        require(block.timestamp > stakes[tokenId].endTime + stakes[tokenId].duration , "not ended");
        HouseToken token = HouseToken(stakes[tokenId].tokenAddress);
        uint256 amount = token.balanceOf(msg.sender);
        token.burn(msg.sender,amount);
        uint256 balance = amount * getRentPerAmount(tokenId);
        payable(msg.sender).transfer(balance);
    }

    function rentHouse( uint256 tokenId, uint256 months ) public payable {
        require(rentAddressMonth[tokenId][months] == address(0), "Already rented");
        uint256 price = stakes[tokenId].rentPricePerMonth;
        require(msg.value == price, "Incorrect ether value sent");
        houseInvestorClaimedAmount[tokenId] += price;
        rentAddressMonth[tokenId][months] = msg.sender;
        emit RentHouse(msg.sender, tokenId, months);
    }

    function rentHouses( uint256 tokenId, uint256[] memory months ) public payable {
        for (uint256 i = 0; i < months.length; i++) {
            rentHouse(tokenId, months[i]);
        }
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}

    function withdrawNFT(uint256 tokenId) public {
        require(stakes[tokenId].owner==msg.sender, "Not the owner of the NFT");
        if ( stakes[tokenId].totalSupply==stakes[tokenId].currentSupply ){
            require(block.timestamp >= stakes[tokenId].endTime+stakes[tokenId].duration, "Stake period not yet ended");
        } else {
            require(block.timestamp >= stakes[tokenId].endTime, "Stake period not yet ended");
        } 
        houseAsset.transferFrom(address(this), msg.sender, tokenId);

        delete stakes[tokenId];
    }

    function getStakeInfo(uint256 tokenId) public view returns (StakeInfo memory) {
        return stakes[tokenId];
    }
}