// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { Strings } from "@openzeppelin/contracts/utils/Strings.sol";

contract HouseAsset is ERC721 , Ownable {
    using Strings for uint256;
    mapping(uint256 => string) public tokenIdToURI;
    uint256 public nextTokenId = 1;

    constructor() ERC721("XueDAO House Asset", "XHA") Ownable(msg.sender) {}

    function airdrop (address houseOwner, string memory houseURI) public onlyOwner {
        _safeMint(houseOwner, nextTokenId);
        tokenIdToURI[nextTokenId] = houseURI;
        nextTokenId++;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(ownerOf(tokenId) != address(0), "ERC721Metadata: URI query for nonexistent token");
        return tokenIdToURI[tokenId];
    }
}