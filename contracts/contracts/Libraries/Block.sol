// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Block {
    function timestamp() external view returns(uint256) {
        return block.timestamp;
    }
    function coinbase() external view returns(address) {
        return block.coinbase;
    }

    function baseFee() external view returns(uint256) {
        return block.basefee;
    }

    function gasLimit() external view returns (uint256) {
        return block.gaslimit;
    }

    function number() external view returns(uint256) {
        return block.number;
    }
}