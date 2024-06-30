// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract HouseToken is ERC20, Ownable {
    uint256 public maxAmount;

    uint256 public totalDeposit;

    constructor(string memory name, string memory symbol, uint256 _maxAmount) ERC20(name, symbol) Ownable(msg.sender) {
        maxAmount = _maxAmount;
    }

    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= maxAmount, "HouseToken: minting amount exceeds max supply");
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyOwner{
        _burn(from, amount);
    }
}