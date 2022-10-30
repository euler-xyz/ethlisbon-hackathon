import "../vendor/IEuler.sol";

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Positions {
    function closePosition(address underlying, address collateral, uint24 fee) external {
        IEulerSwap.SwapUniExactOutputParams memory params;

        params.subAccountIdIn = 0;
        params.subAccountIdOut = 0;
        params.amountOut = 0; // replaced
        params.amountInMaximum = 0; // FIXME: implement slippage check by computing maximum based on TWAP prices
        params.deadline = 0; // ignored
        params.path = abi.encodePacked(underlying, fee, collateral);

        EulerAddrsMainnet.swap.swapAndRepayUni(params, 0);
    }
}

