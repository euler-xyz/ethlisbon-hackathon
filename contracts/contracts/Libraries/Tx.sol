// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Tx {
    function origin() external view returns (address) {
        return tx.origin;
    }

    function gasPrice() external view returns(uint256) {
        return tx.gasprice;
    }
}