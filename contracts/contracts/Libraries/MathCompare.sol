// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract MathCompare {
    function lt(uint256 a, uint256 b) external pure returns (bool) {
        return a < b;
    }

    function lte(uint256 a, uint256 b) external pure returns (bool) {
        return a <= b;
    }

    function gt(uint256 a, uint256 b) external pure returns (bool) {
        return a > b;
    }

    function gte(uint256 a, uint256 b) external pure returns (bool) {
        return a >= b;
    }
}