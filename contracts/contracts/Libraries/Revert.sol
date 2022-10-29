// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Revert {
    function revert(bool doRevert) external pure {
        require(!doRevert, "Check failed");
    }

    function revertWithReason(bool doRevert, string calldata reason) external pure {
        require(!doRevert, reason);
    }
}