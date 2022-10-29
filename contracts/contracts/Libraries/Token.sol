// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Token {
    function transferToMsgSender(address token, uint256 amount) external {
        IERC20(token).transfer(msg.sender, amount);
    }

    function transferETHToMsgSender(uint256 amount) external {
        msg.sender.transfer(amount);
    }
}