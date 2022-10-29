// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/StorageSlot.sol";

contract Storage {
    function writeStorage(bytes32 slot, bytes32 value) external {
        StorageSlot.Bytes32Slot storage b32Pointer = StorageSlot.getBytes32Slot(slot);
        b32Pointer.value = value;
    }

    function readStorage(bytes32 slot, bytes32 value) external returns(bytes32) {
        StorageSlot.Bytes32Slot storage b32Pointer = StorageSlot.getBytes32Slot(slot);
        return b32Pointer.value;
    }
}