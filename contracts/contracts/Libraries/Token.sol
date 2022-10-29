// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Token {
    function transferToMsgSender(address token, address to, uint256 amount) external {
        IERC20(token).transfer(to, amount);
    }

    function transferETHToMsgSender(address to, uint256 amount) external {
        payable(to).transfer(amount);
    }
}