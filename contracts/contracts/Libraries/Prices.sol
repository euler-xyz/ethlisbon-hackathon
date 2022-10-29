import "../vendor/IEuler.sol";

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Prices {
    /// @notice price in ETH, as seen by Euler (either TWAP or Chainlink)
    function getPrice(address underlying) external view returns (uint) {
        (uint twap, ) = EulerAddrsMainnet.exec.getPrice(underlying);
        return twap;
    }
}
